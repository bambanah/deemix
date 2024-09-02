import { each, queue } from "async";
import { exec } from "child_process";
import { Deezer, TrackFormats, errors as _errors, utils } from "deezer-js";
import {
	createWriteStream,
	existsSync,
	mkdirSync,
	readFileSync,
	unlinkSync,
	writeFileSync,
} from "fs";
import { HTTPError, ReadError, TimeoutError, default as got } from "got";
import { tmpdir } from "os";
import { generateCryptedStreamURL, streamTrack } from "./decryption";
import {
	DownloadCanceled,
	DownloadFailed,
	ErrorMessages,
	PreferredBitrateNotFound,
	TrackNot360,
} from "./errors";
import { DEFAULTS, OverwriteOption, Settings } from "./settings";
import { IDownloadObject } from "./types/DownloadObjects";
import { StaticPicture } from "./types/Picture";
import Track, { formatsName } from "./types/Track";
import { USER_AGENT_HEADER, pipeline, shellEscape } from "./utils";
import { checkShouldDownload, tagTrack } from "./utils/downloadUtils";
import {
	generateAlbumName,
	generateArtistName,
	generateDownloadObjectName,
	generatePath,
} from "./utils/pathtemplates";

const { WrongLicense, WrongGeolocation } = _errors;
const { map_track } = utils;

const extensions = {
	[TrackFormats.FLAC]: ".flac",
	[TrackFormats.LOCAL]: ".mp3",
	[TrackFormats.MP3_320]: ".mp3",
	[TrackFormats.MP3_128]: ".mp3",
	[TrackFormats.DEFAULT]: ".mp3",
	[TrackFormats.MP4_RA3]: ".mp4",
	[TrackFormats.MP4_RA2]: ".mp4",
	[TrackFormats.MP4_RA1]: ".mp4",
} as const;

const formats_non_360 = {
	[TrackFormats.FLAC]: "FLAC",
	[TrackFormats.MP3_320]: "MP3_320",
	[TrackFormats.MP3_128]: "MP3_128",
};
const formats_360 = {
	[TrackFormats.MP4_RA3]: "MP4_RA3",
	[TrackFormats.MP4_RA2]: "MP4_RA2",
	[TrackFormats.MP4_RA1]: "MP4_RA1",
};

const TEMPDIR = tmpdir() + "/deemix-imgs";
mkdirSync(TEMPDIR, { recursive: true });

async function downloadImage(
	url: string,
	path: string,
	overwrite = OverwriteOption.DONT_OVERWRITE
) {
	if (
		existsSync(path) &&
		![
			OverwriteOption.OVERWRITE,
			OverwriteOption.ONLY_TAGS,
			OverwriteOption.KEEP_BOTH,
		].includes(overwrite)
	) {
		const file = readFileSync(path);
		if (file.length !== 0) return path;
		unlinkSync(path);
	}
	let timeout: NodeJS.Timeout | null = null;
	let error = "";

	const downloadStream = got
		.stream(url, {
			headers: { "User-Agent": USER_AGENT_HEADER },
			https: { rejectUnauthorized: false },
		})
		.on("data", function () {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				error = "DownloadTimeout";
				downloadStream.destroy();
			}, 5000);
		});
	const fileWriterStream = createWriteStream(path);

	timeout = setTimeout(() => {
		error = "DownloadTimeout";
		downloadStream.destroy();
	}, 5000);

	try {
		await pipeline(downloadStream, fileWriterStream);
	} catch (e) {
		unlinkSync(path);
		if (e instanceof HTTPError) {
			if (url.includes("images.dzcdn.net")) {
				const urlBase = url.slice(0, url.lastIndexOf("/") + 1);
				const pictureURL = url.slice(urlBase.length);
				const pictureSize = parseInt(
					pictureURL.slice(0, pictureURL.indexOf("x"))
				);
				if (pictureSize > 1200) {
					return downloadImage(
						urlBase +
							pictureURL.replace(`${pictureSize}x${pictureSize}`, "1200x1200"),
						path,
						overwrite
					);
				}
			}
			return null;
		}
		if (
			e instanceof ReadError ||
			e instanceof TimeoutError ||
			[
				"ESOCKETTIMEDOUT",
				"ERR_STREAM_PREMATURE_CLOSE",
				"ETIMEDOUT",
				"ECONNRESET",
			].includes(e.code) ||
			(downloadStream.destroyed && error === "DownloadTimeout")
		) {
			return downloadImage(url, path, overwrite);
		}
		console.trace(e);
		throw e;
	}
	return path;
}

async function getPreferredBitrate(
	dz: Deezer,
	track: Track,
	preferredBitrate: string,
	shouldFallback: boolean,
	feelingLucky: boolean,
	uuid: string,
	listener: any
) {
	preferredBitrate = parseInt(preferredBitrate);

	let falledBack = false;
	let hasAlternative = track.fallbackID !== "0";
	let isGeolocked = false;
	let wrongLicense = false;

	async function testURL(track: Track, url: string, formatName: string) {
		if (!url) return false;
		let request;
		try {
			request = got
				.get(url, {
					headers: { "User-Agent": USER_AGENT_HEADER },
					https: { rejectUnauthorized: false },
					timeout: 7000,
				})
				.on("response", (response) => {
					track.filesizes[`${formatName.toLowerCase()}`] =
						response.statusCode === 403
							? 0
							: response.headers["content-length"];
					request.cancel();
				});

			await request;
		} catch (e) {
			if (e.isCanceled) {
				if (track.filesizes[`${formatName.toLowerCase()}`] === 0) return false;
				return true;
			}
			if (e instanceof ReadError || e instanceof TimeoutError) {
				return await testURL(track, url, formatName);
			}
			if (e instanceof HTTPError) return false;
			console.trace(e);
			throw e;
		}
	}

	async function getCorrectURL(
		track: Track,
		formatName: string,
		formatNumber: number,
		feelingLucky: boolean
	) {
		// Check the track with the legit method
		let url;
		wrongLicense =
			((formatName === "FLAC" || formatName.startsWith("MP4_RA")) &&
				!dz.current_user.can_stream_lossless) ||
			(formatName === "MP3_320" && !dz.current_user.can_stream_hq);
		if (
			track.filesizes[`${formatName.toLowerCase()}`] &&
			track.filesizes[`${formatName.toLowerCase()}`] !== "0"
		) {
			try {
				url = await dz.get_track_url(track.trackToken, formatName);
			} catch (e) {
				wrongLicense = e.name === "WrongLicense";
				isGeolocked = e.name === "WrongGeolocation";
			}
		}
		// Fallback to old method
		if (!url && feelingLucky) {
			url = generateCryptedStreamURL(
				track.id,
				track.MD5,
				track.mediaVersion,
				formatNumber
			);
			if (await testURL(track, url, formatName)) return url;
			url = undefined;
		}
		return url;
	}

	if (track.local) {
		const url = await getCorrectURL(
			track,
			"MP3_MISC",
			TrackFormats.LOCAL,
			feelingLucky
		);
		track.urls.MP3_MISC = url;
		return TrackFormats.LOCAL;
	}

	const is360Format = Object.keys(formats_360).includes(preferredBitrate);
	let formats;
	if (!shouldFallback) {
		formats = { ...formats_360, ...formats_non_360 };
	} else if (is360Format) {
		formats = { ...formats_360 };
	} else {
		formats = { ...formats_non_360 };
	}

	// Check and renew trackToken before starting the check
	await track.checkAndRenewTrackToken(dz);
	for (let i = 0; i < Object.keys(formats).length; i++) {
		// Check bitrates
		const formatNumber = Object.keys(formats).reverse()[i];
		const formatName = formats[formatNumber];

		// Current bitrate is higher than preferred bitrate; skip
		if (formatNumber > preferredBitrate) {
			continue;
		}

		let currentTrack = track;
		let url = await getCorrectURL(
			currentTrack,
			formatName,
			formatNumber,
			feelingLucky
		);
		let newTrack;
		do {
			if (!url && hasAlternative) {
				newTrack = await dz.gw.get_track_with_fallback(currentTrack.fallbackID);
				newTrack = map_track(newTrack);
				currentTrack = new Track();
				currentTrack.parseEssentialData(newTrack);
				hasAlternative = currentTrack.fallbackID !== 0;
			}
			if (!url)
				url = await getCorrectURL(
					currentTrack,
					formatName,
					formatNumber,
					feelingLucky
				);
		} while (!url && hasAlternative);

		if (url) {
			if (newTrack) track.parseEssentialData(newTrack);
			track.urls[formatName] = url;
			return formatNumber;
		}

		if (!shouldFallback) {
			if (wrongLicense) throw new WrongLicense(formatName);
			if (isGeolocked) throw new WrongGeolocation(dz.current_user.country);
			throw new PreferredBitrateNotFound();
		} else if (!falledBack) {
			falledBack = true;
			if (listener && uuid) {
				listener.send("downloadInfo", {
					uuid,
					state: "bitrateFallback",
					data: {
						id: track.id,
						title: track.title,
						artist: track.mainArtist.name,
					},
				});
			}
		}
	}
	if (is360Format) throw new TrackNot360();
	const url = await getCorrectURL(
		track,
		"MP3_MISC",
		TrackFormats.DEFAULT,
		feelingLucky
	);
	track.urls.MP3_MISC = url;
	return TrackFormats.DEFAULT;
}

class Downloader {
	dz: Deezer;
	downloadObject: IDownloadObject;
	settings: Settings;
	bitrate: any;
	listener: any;
	playlistCovername: null;
	playlistURLs: any[];
	coverQueue: {};

	constructor(
		dz: Deezer,
		downloadObject: IDownloadObject,
		settings: Settings,
		listener
	) {
		this.dz = dz;
		this.downloadObject = downloadObject;
		this.settings = settings || DEFAULTS;
		this.bitrate = downloadObject.bitrate;
		this.listener = listener;

		this.playlistCovername = null;
		this.playlistURLs = [];

		this.coverQueue = {};
	}

	log(data, state) {
		if (this.listener) {
			this.listener.send("downloadInfo", {
				uuid: this.downloadObject.uuid,
				data,
				state,
			});
		}
	}

	warn(data, state, solution) {
		if (this.listener) {
			this.listener.send("downloadWarn", {
				uuid: this.downloadObject.uuid,
				data,
				state,
				solution,
			});
		}
	}

	async start() {
		if (!this.downloadObject.isCanceled) {
			if (this.downloadObject.__type__ === "Single") {
				const track = await this.downloadWrapper({
					trackAPI: this.downloadObject.single.trackAPI,
					albumAPI: this.downloadObject.single.albumAPI,
				});
				if (track) await this.afterDownloadSingle(track);
			} else if (this.downloadObject.__type__ === "Collection") {
				const tracks = [];

				const q = queue(
					async (data: { track: Track; pos: number }, callback) => {
						const { track, pos } = data;
						tracks[pos] = await this.downloadWrapper({
							trackAPI: track,
							albumAPI: this.downloadObject.collection.albumAPI,
							playlistAPI: this.downloadObject.collection.playlistAPI,
						});

						callback();
					},
					this.settings.queueConcurrency
				);

				if (this.downloadObject.collection.tracks.length) {
					this.downloadObject.collection.tracks.forEach((track, pos) => {
						q.push({ track, pos }, () => {});
					});

					await q.drain();
				}
				await this.afterDownloadCollection(tracks);
			}
		}

		if (this.listener) {
			if (this.downloadObject.isCanceled) {
				this.listener.send("currentItemCancelled", this.downloadObject.uuid);
				this.listener.send("removedFromQueue", this.downloadObject.uuid);
			} else {
				this.listener.send("finishDownload", this.downloadObject.uuid);
			}
		}
	}

	async download(extraData, track: Track) {
		const returnData = {};
		const { trackAPI, albumAPI, playlistAPI } = extraData;
		trackAPI.size = this.downloadObject.size;
		if (this.downloadObject.isCanceled) throw new DownloadCanceled();
		if (parseInt(trackAPI.id) === 0) throw new DownloadFailed("notOnDeezer");

		let itemData = {
			id: trackAPI.id,
			title: trackAPI.title,
			artist: trackAPI.artist.name,
		};

		// Generate track object
		if (!track) {
			track = new Track();
			try {
				await track.parseData(
					this.dz,
					trackAPI.id,
					trackAPI,
					albumAPI,
					playlistAPI
				);
			} catch (e) {
				if (e.name === "AlbumDoesntExists") {
					throw new DownloadFailed("albumDoesntExists");
				}
				if (e.name === "MD5NotFound") {
					throw new DownloadFailed("notLoggedIn");
				}
				console.trace(e);
				throw e;
			}
		}
		if (this.downloadObject.isCanceled) throw new DownloadCanceled();

		// Check if the track is encoded
		if (track.MD5 === "") throw new DownloadFailed("notEncoded", track);

		// Check the target bitrate
		let selectedFormat;
		try {
			selectedFormat = await getPreferredBitrate(
				this.dz,
				track,
				this.bitrate,
				this.settings.fallbackBitrate,
				this.settings.feelingLucky,
				this.downloadObject.uuid,
				this.listener
			);
		} catch (e) {
			if (e.name === "WrongLicense") {
				throw new DownloadFailed("wrongLicense");
			}
			if (e.name === "WrongGeolocation") {
				throw new DownloadFailed("wrongGeolocation", track);
			}
			if (e.name === "PreferredBitrateNotFound") {
				throw new DownloadFailed("wrongBitrate", track);
			}
			if (e.name === "TrackNot360") {
				throw new DownloadFailed("no360RA");
			}
			console.trace(e);
			throw e;
		}
		track.bitrate = selectedFormat;
		track.album.bitrate = selectedFormat;

		// Apply Settings
		track.applySettings(this.settings);

		// Generate filename and filepath from metadata
		const { filename, filepath, artistPath, coverPath, extrasPath } =
			generatePath(track, this.downloadObject, this.settings);
		if (this.downloadObject.isCanceled) throw new DownloadCanceled();

		// Make sure the filepath exsists
		mkdirSync(filepath, { recursive: true });
		const extension = extensions[track.bitrate];
		let writepath = `${filepath}/${filename}${extension}`;

		if (this.settings.overwriteFile === OverwriteOption.KEEP_BOTH) {
			const baseFilename = `${filepath}/${filename}`;
			let currentFilename;
			let c = 0;
			do {
				c++;
				currentFilename = `${baseFilename} (${c})${extension}`;
			} while (existsSync(currentFilename));
			writepath = currentFilename;
		}

		const shouldDownload = checkShouldDownload(
			filename,
			filepath,
			extension,
			writepath,
			this.settings.overwriteFile,
			track
		);

		// Adding tags
		if (
			!shouldDownload &&
			[OverwriteOption.ONLY_TAGS, OverwriteOption.OVERWRITE].includes(
				this.settings.overwriteFile
			)
		) {
			tagTrack(extension, writepath, track, this.settings.tags);
		}

		if (!shouldDownload) {
			if (this.listener) {
				this.listener.send("updateQueue", {
					uuid: this.downloadObject.uuid,
					alreadyDownloaded: true,
					downloadPath: String(writepath),
					extrasPath: String(this.downloadObject.extrasPath),
				});
			}

			returnData.filename = writepath.slice(extrasPath.length + 1);
			returnData.data = itemData;
			returnData.path = String(writepath);

			this.downloadObject.files.push(returnData);

			this.downloadObject.completeTrackProgress(this.listener);
			this.downloadObject.downloaded += 1;
			return returnData;
		}

		itemData = {
			id: track.id,
			title: track.title,
			artist: track.mainArtist.name,
		};

		// Save extrasPath
		if (extrasPath && !this.downloadObject.extrasPath) {
			this.downloadObject.extrasPath = extrasPath;
		}

		// Generate covers URLs
		let embeddedImageFormat = `jpg-${this.settings.jpegImageQuality}`;
		if (this.settings.embeddedArtworkPNG) embeddedImageFormat = "png";

		track.album.embeddedCoverURL = track.album.pic.getURL(
			this.settings.embeddedArtworkSize,
			embeddedImageFormat
		);
		let ext = track.album.embeddedCoverURL.slice(-4);
		if (ext.charAt(0) !== ".") ext = ".jpg";
		track.album.embeddedCoverPath = `${TEMPDIR}/${
			track.album.isPlaylist ? "pl" + track.playlist.id : "alb" + track.album.id
		}_${this.settings.embeddedArtworkSize}${ext}`;

		// Download and cache the coverart
		if (!this.coverQueue[track.album.embeddedCoverPath]) {
			this.coverQueue[track.album.embeddedCoverPath] = downloadImage(
				track.album.embeddedCoverURL,
				track.album.embeddedCoverPath
			);
		}
		track.album.embeddedCoverPath =
			await this.coverQueue[track.album.embeddedCoverPath];
		if (this.coverQueue[track.album.embeddedCoverPath])
			delete this.coverQueue[track.album.embeddedCoverPath];

		// Save local album art
		if (coverPath) {
			returnData.albumURLs = [];
			this.settings.localArtworkFormat.split(",").forEach((picFormat) => {
				if (["png", "jpg"].includes(picFormat)) {
					let extendedFormat = picFormat;
					if (extendedFormat === "jpg")
						extendedFormat += `-${this.settings.jpegImageQuality}`;
					const url = track.album.pic.getURL(
						this.settings.localArtworkSize,
						extendedFormat
					);
					// Skip non deezer pictures at the wrong format
					if (track.album.pic instanceof StaticPicture && picFormat !== "jpg")
						return;
					returnData.albumURLs.push({ url, ext: picFormat });
				}
			});
			returnData.albumPath = coverPath;
			returnData.albumFilename = generateAlbumName(
				this.settings.coverImageTemplate,
				track.album,
				this.settings,
				track.playlist
			);
		}

		// Save artist art
		if (artistPath) {
			returnData.artistURLs = [];
			this.settings.localArtworkFormat.split(",").forEach((picFormat) => {
				// Deezer doesn't support png artist images
				if (picFormat === "jpg") {
					const extendedFormat = `${picFormat}-${this.settings.jpegImageQuality}`;
					const url = track.album.mainArtist.pic.getURL(
						this.settings.localArtworkSize,
						extendedFormat
					);
					// Skip non deezer pictures at the wrong format
					if (track.album.mainArtist.pic.md5 === "") return;
					returnData.artistURLs.push({ url, ext: picFormat });
				}
			});
			returnData.artistPath = artistPath;
			returnData.artistFilename = generateArtistName(
				this.settings.artistImageTemplate,
				track.album.mainArtist,
				this.settings,
				track.album.rootArtist
			);
		}

		// Save playlist art
		if (track.playlist) {
			if (this.playlistURLs.length === 0) {
				this.settings.localArtworkFormat.split(",").forEach((picFormat) => {
					if (["png", "jpg"].includes(picFormat)) {
						let extendedFormat = picFormat;
						if (extendedFormat === "jpg")
							extendedFormat += `-${this.settings.jpegImageQuality}`;
						const url = track.playlist.pic.getURL(
							this.settings.localArtworkSize,
							extendedFormat
						);
						// Skip non deezer pictures at the wrong format
						if (
							track.playlist.pic instanceof StaticPicture &&
							picFormat !== "jpg"
						)
							return;
						this.playlistURLs.push({ url, ext: picFormat });
					}
				});
			}
			if (!this.playlistCovername) {
				track.playlist.bitrate = track.bitrate;
				track.playlist.dateString = track.playlist.date.format(
					this.settings.dateFormat
				);
				this.playlistCovername = generateAlbumName(
					this.settings.coverImageTemplate,
					track.playlist,
					this.settings,
					track.playlist
				);
			}
		}

		// Save lyrics in lrc file
		if (this.settings.syncedLyrics && track.lyrics.sync) {
			if (
				!existsSync(`${filepath}/${filename}.lrc`) ||
				[OverwriteOption.OVERWRITE, OverwriteOption.ONLY_TAGS].includes(
					this.settings.overwriteFile
				)
			) {
				writeFileSync(`${filepath}/${filename}.lrc`, track.lyrics.sync);
			}
		}

		// Download the track
		track.downloadURL = track.urls[formatsName[track.bitrate]];
		if (!track.downloadURL) throw new DownloadFailed("notAvailable", track);
		try {
			await streamTrack(writepath, track, this.downloadObject, this.listener);
		} catch (e) {
			if (e instanceof HTTPError)
				throw new DownloadFailed("notAvailable", track);
			throw e;
		}

		if (!track.local) {
			tagTrack(extension, writepath, track, this.settings.tags);
		}

		if (track.searched) returnData.searched = true;
		this.downloadObject.downloaded += 1;

		if (this.listener) {
			this.listener.send("updateQueue", {
				uuid: this.downloadObject.uuid,
				downloaded: true,
				downloadPath: String(writepath),
				extrasPath: String(this.downloadObject.extrasPath),
			});
		}
		returnData.filename = writepath.slice(extrasPath.length + 1);
		returnData.data = itemData;
		returnData.path = String(writepath);
		this.downloadObject.files.push(returnData);
		return returnData;
	}

	async downloadWrapper(extraData, track: Track) {
		const { trackAPI } = extraData;
		// Temp metadata to generate logs
		const itemData = {
			id: trackAPI.id,
			title: trackAPI.title,
			artist: trackAPI.artist.name,
		};

		let result;
		try {
			result = await this.download(extraData, track);
		} catch (e) {
			if (e instanceof DownloadFailed) {
				if (e.track) {
					const track = e.track;
					if (track.fallbackID !== 0) {
						this.warn(itemData, e.errid, "fallback");
						let newTrack = await this.dz.gw.get_track_with_fallback(
							track.fallbackID
						);
						newTrack = map_track(newTrack);
						track.parseEssentialData(newTrack);
						return await this.downloadWrapper(extraData, track);
					}
					if (track.albumsFallback.length && this.settings.fallbackISRC) {
						const newAlbumID = track.albumsFallback.pop();
						const newAlbum = await this.dz.gw.get_album_page(newAlbumID);
						let fallbackID = 0;
						for (const newTrack of newAlbum.SONGS.data) {
							if (newTrack.ISRC === track.ISRC) {
								fallbackID = newTrack.SNG_ID;
								break;
							}
						}
						if (fallbackID !== 0) {
							this.warn(itemData, e.errid, "fallback");
							let newTrack =
								await this.dz.gw.get_track_with_fallback(fallbackID);
							newTrack = map_track(newTrack);
							track.parseEssentialData(newTrack);
							return await this.downloadWrapper(extraData, track);
						}
					}
					if (!track.searched && this.settings.fallbackSearch) {
						this.warn(itemData, e.errid, "search");
						const searchedID = await this.dz.api.get_track_id_from_metadata(
							track.mainArtist.name,
							track.title,
							track.album.title
						);
						if (searchedID !== "0") {
							let newTrack =
								await this.dz.gw.get_track_with_fallback(searchedID);
							newTrack = map_track(newTrack);
							track.parseEssentialData(newTrack);
							track.searched = true;
							this.log(itemData, "searchFallback");
							return await this.downloadWrapper(extraData, track);
						}
					}
					e.errid += "NoAlternative";
					e.message = ErrorMessages[e.errid];
				}
				result = {
					error: {
						message: e.message,
						errid: e.errid,
						data: itemData,
						type: "track",
					},
				};
			} else if (e instanceof DownloadCanceled) {
				return;
			} else {
				console.trace(e);
				result = {
					error: {
						message: e.message,
						data: itemData,
						stack: String(e.stack),
						type: "track",
					},
				};
			}
		}

		if (result.error) {
			this.downloadObject.completeTrackProgress(this.listener);
			this.downloadObject.failed += 1;
			this.downloadObject.errors.push(result.error);
			if (this.listener) {
				const error = result.error;
				this.listener.send("updateQueue", {
					uuid: this.downloadObject.uuid,
					failed: true,
					data: error.data,
					error: error.message,
					errid: error.errid || null,
					stack: error.stack || null,
					type: error.type,
				});
			}
		}
		return result;
	}

	afterDownloadErrorReport(position, error, itemData = {}) {
		console.trace(error);
		this.downloadObject.errors.push({
			message: error.message,
			stack: String(error.stack),
			data: { position, ...itemData },
			type: "post",
		});
		if (this.listener) {
			this.listener.send("updateQueue", {
				uuid: this.downloadObject.uuid,
				postFailed: true,
				error: error.message,
				data: { position, ...itemData },
				stack: error.stack,
				type: "post",
			});
		}
	}

	async afterDownloadSingle(track) {
		if (!track) return;
		if (!this.downloadObject.extrasPath) {
			this.downloadObject.extrasPath = this.settings.downloadLocation;
		}

		// Save local album artwork
		try {
			if (this.settings.saveArtwork && track.albumPath) {
				await each(track.albumURLs, async (image) => {
					await downloadImage(
						image.url,
						`${track.albumPath}/${track.albumFilename}.${image.ext}`,
						this.settings.overwriteFile
					);
				});
			}
		} catch (e) {
			this.afterDownloadErrorReport("SaveLocalAlbumArt", e);
		}

		// Save local artist artwork
		try {
			if (this.settings.saveArtworkArtist && track.artistPath) {
				await each(track.artistURLs, async (image) => {
					await downloadImage(
						image.url,
						`${track.artistPath}/${track.artistFilename}.${image.ext}`,
						this.settings.overwriteFile
					);
				});
			}
		} catch (e) {
			this.afterDownloadErrorReport("SaveLocalArtistArt", e);
		}

		// Create searched logfile
		try {
			if (this.settings.logSearched && track.searched) {
				const filename = `${track.data.artist} - ${track.data.title}`;
				let searchedFile;
				try {
					searchedFile = readFileSync(
						`${this.downloadObject.extrasPath}/searched.txt`
					).toString();
				} catch {
					searchedFile = "";
				}
				if (searchedFile.indexOf(filename) === -1) {
					if (searchedFile !== "") searchedFile += "\r\n";
					searchedFile += filename + "\r\n";
					writeFileSync(
						`${this.downloadObject.extrasPath}/searched.txt`,
						searchedFile
					);
				}
			}
		} catch (e) {
			this.afterDownloadErrorReport("CreateSearchedLog", e);
		}

		// Execute command after download
		try {
			if (this.settings.executeCommand !== "") {
				const child = exec(
					this.settings.executeCommand
						.replaceAll("%folder%", shellEscape(this.downloadObject.extrasPath))
						.replaceAll("%filename%", shellEscape(track.filename)),
					(error, stdout, stderr) => {
						if (error) this.afterDownloadErrorReport("ExecuteCommand", error);
						const itemData = { stderr, stdout };
						if (stderr) this.log(itemData, "stderr");
						if (stdout) this.log(itemData, "stdout");
					}
				);

				await new Promise((resolve) => {
					child.on("close", resolve);
				});
			}
		} catch (e) {
			this.afterDownloadErrorReport("ExecuteCommand", e);
		}
	}

	async afterDownloadCollection(tracks) {
		if (!this.downloadObject.extrasPath) {
			this.downloadObject.extrasPath = this.settings.downloadLocation;
		}

		const playlist = [];
		let errors = "";
		let searched = "";

		for (let i = 0; i < tracks.length; i++) {
			const track = tracks[i];
			if (!track) return;

			if (track.error) {
				if (!track.error.data)
					track.error.data = { id: "0", title: "Unknown", artist: "Unknown" };
				errors += `${track.error.data.id} | ${track.error.data.artist} - ${track.error.data.title} | ${track.error.message}\r\n`;
			}

			if (track.searched)
				searched += `${track.data.artist} - ${track.data.title}\r\n`;

			// Save local album artwork
			try {
				if (this.settings.saveArtwork && track.albumPath) {
					await each(track.albumURLs, async (image) => {
						await downloadImage(
							image.url,
							`${track.albumPath}/${track.albumFilename}.${image.ext}`,
							this.settings.overwriteFile
						);
					});
				}
			} catch (e) {
				this.afterDownloadErrorReport("SaveLocalAlbumArt", e, track.data);
			}

			// Save local artist artwork
			try {
				if (this.settings.saveArtworkArtist && track.artistPath) {
					await each(track.artistURLs, async (image) => {
						await downloadImage(
							image.url,
							`${track.artistPath}/${track.artistFilename}.${image.ext}`,
							this.settings.overwriteFile
						);
					});
				}
			} catch (e) {
				this.afterDownloadErrorReport("SaveLocalArtistArt", e, track.data);
			}

			// Save filename for playlist file
			playlist[i] = track.filename || "";
		}

		// Create errors logfile
		try {
			if (this.settings.logErrors && errors !== "") {
				writeFileSync(`${this.downloadObject.extrasPath}/errors.txt`, errors);
			}
		} catch (e) {
			this.afterDownloadErrorReport("CreateErrorLog", e);
		}

		// Create searched logfile
		try {
			if (this.settings.logSearched && searched !== "") {
				writeFileSync(
					`${this.downloadObject.extrasPath}/searched.txt`,
					searched
				);
			}
		} catch (e) {
			this.afterDownloadErrorReport("CreateSearchedLog", e);
		}

		// Save Playlist Artwork
		try {
			if (
				this.settings.saveArtwork &&
				this.playlistCovername &&
				!this.settings.tags.savePlaylistAsCompilation
			) {
				await each(this.playlistURLs, async (image) => {
					await downloadImage(
						image.url,
						`${this.downloadObject.extrasPath}/${this.playlistCovername}.${image.ext}`,
						this.settings.overwriteFile
					);
				});
			}
		} catch (e) {
			this.afterDownloadErrorReport("SavePlaylistArt", e);
		}

		// Create M3U8 File
		try {
			if (this.settings.createM3U8File) {
				const filename =
					generateDownloadObjectName(
						this.settings.playlistFilenameTemplate,
						this.downloadObject,
						this.settings
					) || "playlist";
				writeFileSync(
					`${this.downloadObject.extrasPath}/${filename}.m3u8`,
					playlist.join("\n")
				);
			}
		} catch (e) {
			this.afterDownloadErrorReport("CreatePlaylistFile", e);
		}

		// Execute command after download
		try {
			if (this.settings.executeCommand !== "") {
				const child = exec(
					this.settings.executeCommand
						.replaceAll("%folder%", shellEscape(this.downloadObject.extrasPath))
						.replaceAll("%filename%", ""),
					(error, stdout, stderr) => {
						if (error) this.afterDownloadErrorReport("ExecuteCommand", error);
						const itemData = { stderr, stdout };
						if (stderr) this.log(itemData, "stderr");
						if (stdout) this.log(itemData, "stdout");
					}
				);

				await new Promise((resolve) => {
					child.on("close", resolve);
				});
			}
		} catch (e) {
			this.afterDownloadErrorReport("ExecuteCommand", e);
		}
	}
}

export default {
	Downloader,
	downloadImage,
	getPreferredBitrate,
};
