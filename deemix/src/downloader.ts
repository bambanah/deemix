import { each, queue } from "async";
import { exec } from "child_process";
import { Deezer, TrackFormats, utils } from "deezer-js";
import { APIAlbum, APITrack } from "deezer-js/src/api";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { HTTPError } from "got";
import { tmpdir } from "os";
import { streamTrack } from "./decryption";
import { DownloadCanceled, DownloadFailed, ErrorMessages } from "./errors";
import { DEFAULTS, OverwriteOption, Settings } from "./settings";
import { IDownloadObject } from "./types/DownloadObjects";
import { StaticPicture } from "./types/Picture";
import Track, { formatsName } from "./types/Track";
import { downloadImage, getPreferredBitrate, shellEscape } from "./utils";
import { checkShouldDownload, tagTrack } from "./utils/downloadUtils";
import {
	generateAlbumName,
	generateArtistName,
	generateDownloadObjectName,
	generatePath,
	generatePathNew,
} from "./utils/pathtemplates";
import { Album, Playlist } from "./types";

const { performance } = require("perf_hooks");

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

const TEMPDIR = tmpdir() + "/deemix-imgs";
mkdirSync(TEMPDIR, { recursive: true });

export class Downloader {
	dz: Deezer;
	downloadObject: IDownloadObject;
	settings: Settings;
	bitrate: string;
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

	async download(
		extraData: { trackAPI: APITrack; albumAPI?: APIAlbum; playlistAPI?: any },
		track?: Track
	) {
		const startTime = performance.now();

		const returnData = {};
		const { trackAPI, albumAPI, playlistAPI } = extraData;

		if (this.downloadObject.isCanceled) throw new DownloadCanceled();
		if (trackAPI.id === 0) throw new DownloadFailed("notOnDeezer");

		trackAPI.size = this.downloadObject.size;

		let itemData = {
			id: trackAPI.id,
			title: trackAPI.title,
			artist: trackAPI.artist.name,
		};

		if (!track) {
			track = new Track();
			track.parseTrack(trackAPI);
			if (albumAPI) {
				track.album = new Album(albumAPI.id, albumAPI.title);
				track.album.parseAlbum(albumAPI);
			}
			if (playlistAPI) {
				track.playlist = new Playlist(playlistAPI);
			}
		}

		const { filename, filepath, artistPath, coverPath, extrasPath } =
			generatePath(track, this.downloadObject, this.settings);

		// Make sure the filepath exsists
		mkdirSync(filepath, { recursive: true });
		const extension = extensions[track.bitrate];
		let writepath = `${filepath}/${filename}${extension}`;

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
					downloadPath: writepath,
					extrasPath: this.downloadObject.extrasPath,
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

		// Enrich track with additional data
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

		console.log(`Parsing: ${performance.now() - startTime}ms`);

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
		// const { filename, filepath, artistPath, coverPath, extrasPath } =
		// 	generatePath(track, this.downloadObject, this.settings);
		if (this.downloadObject.isCanceled) throw new DownloadCanceled();

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

	async downloadWrapper(extraData: { trackAPI: APITrack }, track?: Track) {
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
