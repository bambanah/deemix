import { Collection, Convertable } from "@/download-objects/Collection.js";
import { generateAlbumItem } from "@/download-objects/generateAlbumItem.js";
import { generateTrackItem } from "@/download-objects/generateTrackItem.js";
import {
	AlbumNotOnDeezer,
	InvalidID,
	PluginNotEnabledError,
	SpotifyPlaylistNotAccessible,
	TrackNotOnDeezer,
} from "@/errors.js";
import { type Settings } from "@/types/Settings.js";
import { getConfigFolder } from "@/utils/localpaths.js";
import {
	type Market,
	SpotifyApi,
	type MaxInt,
	type Track as SpotifyTrack,
} from "@spotify/web-api-ts-sdk";
import { queue } from "async";
import { Deezer, type DeezerTrack } from "deezer-sdk";
import fs from "fs";
import got from "got";
import { sep } from "path";
import BasePlugin from "./base.js";

interface CachedTrack {
	id?: number;
	isrc?: string;
	data?: {
		title?: string;
		artist: string;
		album: string;
	};
}

export default class SpotifyPlugin extends BasePlugin {
	credentials: { clientId: string; clientSecret: string };
	settings: { fallbackSearch: boolean };
	enabled: boolean;
	configFolder: string;
	sp: SpotifyApi;

	constructor(configFolder = undefined) {
		super();
		this.credentials = { clientId: "", clientSecret: "" };
		this.settings = {
			fallbackSearch: false,
		};
		this.enabled = false;
		/* this.sp */
		this.configFolder = configFolder || getConfigFolder();
		this.configFolder += `spotify${sep}`;
		return this;
	}

	override setup() {
		fs.mkdirSync(this.configFolder, { recursive: true });

		this.loadSettings();
		return this;
	}

	override async parseLink(link: string) {
		if (link.includes("link.tospotify.com")) {
			const response = await got.get(link, {
				https: { rejectUnauthorized: false },
			}); // Resolve URL shortner
			link = response.url;
		}

		// Remove extra stuff
		if (link.includes("?")) link = link.slice(0, link.indexOf("?"));
		if (link.includes("&")) link = link.slice(0, link.indexOf("&"));
		if (link.endsWith("/")) link = link.slice(0, -1); // Remove last slash if present

		if (!link.includes("spotify")) return [link, undefined, undefined]; // return if not a spotify link

		let link_type: string, link_id: string;

		if (link.search(/[/:]track[/:](.+)/g) !== -1) {
			link_type = "track";
			link_id = /[/:]track[/:](.+)/g.exec(link)[1];
		} else if (link.search(/[/:]album[/:](.+)/g) !== -1) {
			link_type = "album";
			link_id = /[/:]album[/:](.+)/g.exec(link)[1];
		} else if (link.search(/[/:]playlist[/:](.+)/g) !== -1) {
			link_type = "playlist";
			link_id = /[/:]playlist[/:](.+)/g.exec(link)[1];
		}

		return [link, link_type, link_id];
	}

	override async generateDownloadObject(dz, link, bitrate) {
		let link_type, link_id;
		[link, link_type, link_id] = await this.parseLink(link);

		if (link_type == null || link_id == null) return null;

		switch (link_type) {
			case "track":
				return this.generateTrackItem(dz, link_id, bitrate);
			case "album":
				return this.generateAlbumItem(dz, link_id, bitrate);
			case "playlist":
				return this.generatePlaylistItem(dz, link_id, bitrate);
		}
	}

	async generateTrackItem(dz: Deezer, linkId: string, bitrate: number) {
		const cache = this.loadCache();

		let cachedTrack: CachedTrack;

		if (cache.tracks[linkId]) {
			cachedTrack = cache.tracks[linkId];
		} else {
			cachedTrack = await this.getTrack(linkId);
			cache.tracks[linkId] = cachedTrack;
			this.saveCache(cache);
		}

		if (cachedTrack.isrc) {
			try {
				return generateTrackItem(dz, `isrc:${cachedTrack.isrc}`, bitrate);
			} catch {
				/* empty */
			}
		}

		if (this.settings.fallbackSearch) {
			if (!cachedTrack.id || cachedTrack.id === 0) {
				const trackID = await dz.api.get_track_id_from_metadata(
					cachedTrack.data.artist,
					cachedTrack.data.title,
					cachedTrack.data.album
				);

				if (trackID !== "0") {
					cachedTrack.id = trackID;
					cache.tracks[linkId] = cachedTrack;
					this.saveCache(cache);
				}
			}
			if (cachedTrack.id !== 0)
				return generateTrackItem(dz, cachedTrack.id, bitrate);
		}

		throw new TrackNotOnDeezer(`https://open.spotify.com/track/${linkId}`);
	}

	async generateAlbumItem(dz: Deezer, link_id, bitrate) {
		const cache = this.loadCache();

		let cachedAlbum;
		if (cache.albums[link_id]) {
			cachedAlbum = cache.albums[link_id];
		} else {
			cachedAlbum = await this.getAlbum(link_id);
			cache.albums[link_id] = cachedAlbum;
			this.saveCache(cache);
		}

		try {
			return generateAlbumItem(dz, `upc:${cachedAlbum.upc}`, bitrate);
		} catch {
			throw new AlbumNotOnDeezer(`https://open.spotify.com/album/${link_id}`);
		}
	}

	async generatePlaylistItem(dz: Deezer, link_id: string, bitrate: number) {
		if (!this.enabled) throw new PluginNotEnabledError("Spotify");
		let spotifyPlaylist;
		let market: Market | undefined;
		try {
			spotifyPlaylist = await this.sp.playlists.getPlaylist(link_id);
		} catch (e) {
			// Some Spotify playlists require a market context to resolve.
			if (this.getSpotifyErrorStatus(e) === 404) {
				market = "US";
				try {
					spotifyPlaylist = await this.sp.playlists.getPlaylist(
						link_id,
						market
					);
				} catch (retryError) {
					if (this.getSpotifyErrorStatus(retryError) === 404) {
						return this.generatePlaylistItemFromPage(dz, link_id, bitrate);
					}
					throw retryError;
				}
			} else {
				throw e;
			}
		}

		const playlistAPI: any = this._convertPlaylistStructure(spotifyPlaylist);
		playlistAPI.various_artist = await dz.api.get_artist(5080); // Useful for save as compilation

		let tracklistTemp = spotifyPlaylist.tracks.items;
		while (spotifyPlaylist.tracks.next) {
			const regExec = /offset=(\d+)&limit=(\d+)/g.exec(
				spotifyPlaylist.tracks.next
			);
			const offset = parseInt(regExec[1]);
			const limit = parseInt(regExec[2]) as MaxInt<50>;

			const playlistTracks = await this.sp.playlists.getPlaylistItems(
				link_id,
				market,
				undefined,
				limit,
				offset
			);

			spotifyPlaylist.tracks = playlistTracks;
			tracklistTemp = tracklistTemp.concat(spotifyPlaylist.tracks.items);
		}

		const tracklist: SpotifyTrack[] = [];
		tracklistTemp.forEach((item) => {
			if (!item.track) return; // Skip everything that isn't a track
			if (item.track.explicit && !playlistAPI.explicit)
				playlistAPI.explicit = true;
			tracklist.push(item.track);
		});
		if (!playlistAPI.explicit) playlistAPI.explicit = false;

		return new Convertable({
			type: "spotify_playlist",
			id: link_id,
			bitrate,
			title: spotifyPlaylist.name,
			artist: spotifyPlaylist.owner.display_name,
			cover: playlistAPI.picture_thumbnail,
			explicit: playlistAPI.explicit,
			size: tracklist.length,
			collection: {
				tracks: [],
				playlistAPI,
			},
			plugin: "spotify",
			conversion_data: tracklist,
		});
	}

	async generatePlaylistItemFromPage(
		dz: Deezer,
		link_id: string,
		bitrate: number
	) {
		const playlistUrl = `https://open.spotify.com/playlist/${link_id}`;
		const page = await got.get(playlistUrl, {
			https: { rejectUnauthorized: false },
		});
		const html = page.body;

		const titleMatch = /<meta property="og:title" content="([^"]+)"/i.exec(
			html
		);
		const imageMatch = /<meta property="og:image" content="([^"]+)"/i.exec(
			html
		);
		const creatorMatch = /<meta name="music:creator" content="([^"]+)"/i.exec(
			html
		);
		const descriptionMatch = /<meta name="description" content="([^"]+)"/i.exec(
			html
		);
		const expectedCount = this.getExpectedPlaylistTrackCount(
			descriptionMatch?.[1] || ""
		);

		const webPlaylist = await this.getPlaylistFromWebApi(link_id);
		if (webPlaylist) {
			const playlistAPI: any = this._convertPlaylistStructure(
				webPlaylist.playlist
			);
			playlistAPI.various_artist = await dz.api.get_artist(5080);
			playlistAPI.explicit = webPlaylist.tracks.some((track) => track.explicit);

			return new Convertable({
				type: "spotify_playlist",
				id: link_id,
				bitrate,
				title: webPlaylist.playlist.name,
				artist: webPlaylist.playlist.owner.display_name,
				cover: playlistAPI.picture_thumbnail,
				explicit: playlistAPI.explicit,
				size: webPlaylist.tracks.length,
				collection: {
					tracks: [],
					playlistAPI,
				},
				plugin: "spotify",
				conversion_data: webPlaylist.tracks,
			});
		}

		const trackIdSet = this.extractTrackIdsFromHtml(html);

		// Main playlist page often exposes only a preview subset (e.g. 30).
		if (expectedCount && trackIdSet.size < expectedCount) {
			try {
				const embedPage = await got.get(
					`https://open.spotify.com/embed/playlist/${link_id}`,
					{
						https: { rejectUnauthorized: false },
					}
				);
				const embedTrackIds = this.extractTrackIdsFromHtml(embedPage.body);
				for (const trackId of embedTrackIds) {
					trackIdSet.add(trackId);
				}
			} catch {
				/* empty */
			}
		}

		const trackIds = Array.from(trackIdSet);

		if (!trackIds.length) {
			throw new SpotifyPlaylistNotAccessible(playlistUrl);
		}

		const tracklist: SpotifyTrack[] = [];
		for (const trackId of trackIds) {
			try {
				const track = await this.sp.tracks.get(trackId);
				tracklist.push(track);
			} catch {
				// Skip tracks unavailable to this app credentials in current market
			}
		}

		if (!tracklist.length) {
			throw new SpotifyPlaylistNotAccessible(playlistUrl);
		}

		const ownerUrl =
			creatorMatch?.[1] || "https://open.spotify.com/user/spotify";
		const ownerId = ownerUrl.split("/").pop() || "spotify";
		const playlistLike: any = {
			snapshot_id: "",
			collaborative: false,
			owner: {
				id: ownerId,
				display_name: ownerId,
				href: ownerUrl,
			},
			description: descriptionMatch?.[1] || "",
			followers: { total: 0 },
			id: link_id,
			external_urls: { spotify: playlistUrl },
			tracks: {
				total: tracklist.length,
				href: `${playlistUrl}/tracks`,
			},
			images: imageMatch?.[1] ? [{ url: imageMatch[1] }] : [],
			public: true,
			name: titleMatch?.[1] || `Spotify Playlist ${link_id}`,
		};

		const playlistAPI: any = this._convertPlaylistStructure(playlistLike);
		playlistAPI.various_artist = await dz.api.get_artist(5080);
		playlistAPI.explicit = tracklist.some((track) => track.explicit);

		return new Convertable({
			type: "spotify_playlist",
			id: link_id,
			bitrate,
			title: playlistLike.name,
			artist: playlistLike.owner.display_name,
			cover: playlistAPI.picture_thumbnail,
			explicit: playlistAPI.explicit,
			size: tracklist.length,
			collection: {
				tracks: [],
				playlistAPI,
			},
			plugin: "spotify",
			conversion_data: tracklist,
		});
	}

	async getSpotifyWebAccessToken() {
		try {
			const data: any = await got
				.get(
					"https://open.spotify.com/get_access_token?reason=transport&productType=web_player",
					{
						https: { rejectUnauthorized: false },
						responseType: "json",
					}
				)
				.json();
			if (
				typeof data?.accessToken === "string" &&
				data.accessToken.length > 0
			) {
				return data.accessToken;
			}
		} catch {
			/* empty */
		}
		return null;
	}

	async getPlaylistFromWebApi(link_id: string) {
		const accessToken = await this.getSpotifyWebAccessToken();
		if (!accessToken) return null;

		const headers = {
			Authorization: `Bearer ${accessToken}`,
			accept: "application/json",
		};

		try {
			const playlist: any = await got
				.get(`https://api.spotify.com/v1/playlists/${link_id}?market=US`, {
					headers,
					https: { rejectUnauthorized: false },
					responseType: "json",
				})
				.json();

			const trackItems: any[] = Array.isArray(playlist?.tracks?.items)
				? [...playlist.tracks.items]
				: [];
			let nextUrl: string | null = playlist?.tracks?.next || null;

			while (nextUrl) {
				const page: any = await got
					.get(nextUrl, {
						headers,
						https: { rejectUnauthorized: false },
						responseType: "json",
					})
					.json();
				if (Array.isArray(page?.items)) {
					trackItems.push(...page.items);
				}
				nextUrl = page?.next || null;
			}

			const tracklist: SpotifyTrack[] = [];
			for (const item of trackItems) {
				if (!item?.track || typeof item.track.id !== "string") continue;
				tracklist.push(item.track);
			}

			if (!tracklist.length) return null;
			playlist.tracks.items = trackItems;
			playlist.tracks.total = tracklist.length;

			return {
				playlist,
				tracks: tracklist,
			};
		} catch {
			return null;
		}
	}

	extractTrackIdsFromHtml(html: string): Set<string> {
		const trackIdSet = new Set<string>();
		const addTrackIds = (matches: IterableIterator<RegExpMatchArray>) => {
			for (const match of matches) {
				if (match?.[1]) {
					trackIdSet.add(match[1]);
				}
			}
		};

		const nextDataMatch =
			/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i.exec(html);
		if (nextDataMatch?.[1]) {
			addTrackIds(nextDataMatch[1].matchAll(/spotify:track:([A-Za-z0-9]+)/gi));
		}

		addTrackIds(
			html.matchAll(
				/<meta name="music:song" content="https:\/\/open\.spotify\.com\/track\/([A-Za-z0-9]+)"/gi
			)
		);

		addTrackIds(html.matchAll(/spotify:track:([A-Za-z0-9]+)/gi));
		addTrackIds(html.matchAll(/open\.spotify\.com\/track\/([A-Za-z0-9]+)/gi));

		return trackIdSet;
	}

	getExpectedPlaylistTrackCount(description: string): number | null {
		const countMatch = /(\d[\d,]*)\s+items?/i.exec(description);
		if (!countMatch?.[1]) return null;
		const parsedCount = Number.parseInt(countMatch[1].replaceAll(",", ""), 10);
		if (Number.isNaN(parsedCount) || parsedCount <= 0) return null;
		return parsedCount;
	}

	getSpotifyErrorStatus(error: any): number | undefined {
		const directStatus =
			error?.status ??
			error?.response?.statusCode ??
			error?.body?.error?.status ??
			error?.statusCode;
		if (typeof directStatus === "number") return directStatus;

		const message = String(error?.message || "");
		const codeMatch =
			/message:\s*(\d+)/i.exec(message) ||
			/response code:\s*(\d+)/i.exec(message) ||
			/"status"\s*:\s*(\d+)/i.exec(message);
		if (codeMatch?.[1]) return Number.parseInt(codeMatch[1], 10);

		return undefined;
	}

	async getTrack(track_id: string, spotifyTrack?: SpotifyTrack) {
		if (!this.enabled) throw new PluginNotEnabledError("Spotify");

		const cachedTrack = {
			isrc: null,
			data: null,
		};

		if (!spotifyTrack) {
			try {
				spotifyTrack = await this.sp.tracks.get(track_id);
			} catch (e) {
				if (e.body.error.message === "invalid id")
					throw new InvalidID(`https://open.spotify.com/track/${track_id}`);
				throw e;
			}
		}

		if (spotifyTrack.external_ids && spotifyTrack.external_ids.isrc) {
			let isrc = spotifyTrack.external_ids.isrc;
			if (isrc.includes("-")) {
				isrc = isrc.replace("-", "");
			}

			cachedTrack.isrc = isrc;
		}

		cachedTrack.data = {
			title: spotifyTrack.name,
			artist: spotifyTrack.artists[0].name,
			album: spotifyTrack.album.name,
		};

		return cachedTrack;
	}

	async getAlbum(album_id: string, spotifyAlbum = null) {
		if (!this.enabled) throw new PluginNotEnabledError("Spotify");
		const cachedAlbum = {
			upc: null,
			data: null,
		};

		if (!spotifyAlbum) {
			try {
				spotifyAlbum = await this.sp.albums.get(album_id);
			} catch (e) {
				if (e.body.error.message === "invalid id")
					throw new InvalidID(`https://open.spotify.com/album/${album_id}`);
				throw e;
			}
		}
		if (spotifyAlbum.external_ids && spotifyAlbum.external_ids.upc)
			cachedAlbum.upc = spotifyAlbum.external_ids.upc;
		cachedAlbum.data = {
			title: spotifyAlbum.name,
			artist: spotifyAlbum.artists[0].name,
		};
		return cachedAlbum;
	}

	async convert(
		dz: Deezer,
		downloadObject: Convertable,
		settings: Settings,
		listener: any = null
	): Promise<Collection> {
		const cache = this.loadCache();

		let conversion = 0;
		let conversionNext = 0;

		const collection = [];
		if (listener)
			listener.send("startConversion", {
				uuid: downloadObject.uuid,
				title: downloadObject.title,
			});

		const q = queue(
			async (data: { track: SpotifyTrack; pos: number }, callback) => {
				const { track, pos } = data;
				if (downloadObject.isCanceled) return;

				let cachedTrack;
				if (cache.tracks[track.id]) {
					cachedTrack = cache.tracks[track.id];
				} else {
					cachedTrack = await this.getTrack(track.id, track);
					cache.tracks[track.id] = cachedTrack;
					this.saveCache(cache);
				}

				let trackAPI: DeezerTrack;
				if (cachedTrack.isrc) {
					try {
						trackAPI = await dz.api.getTrackByISRC(cachedTrack.isrc);
						if (!trackAPI.id || !trackAPI.title) trackAPI = null;
					} catch {
						/* Empty */
					}
				}

				if (this.settings.fallbackSearch && !trackAPI) {
					if (!cachedTrack.id || cachedTrack.id === "0") {
						const trackID = await dz.api.get_track_id_from_metadata(
							cachedTrack.data.artist,
							cachedTrack.data.title,
							cachedTrack.data.album
						);
						if (trackID !== "0") {
							cachedTrack.id = trackID;
							cache.tracks[track.id] = cachedTrack;
							this.saveCache(cache);
						}
					}
					if (cachedTrack.id !== "0")
						trackAPI = await dz.api.getTrack(cachedTrack.id);
				}

				if (!trackAPI) {
					trackAPI = {
						id: "0",
						title: track.name,
						duration: 0,
						md5_origin: 0,
						media_version: 0,
						filesizes: {},
						album: {
							title: track.album.name,
							md5_image: "",
						},
						artist: {
							id: 0,
							name: track.artists[0].name,
							md5_image: "",
						},
					};
				}

				trackAPI.position = pos + 1;
				collection[pos] = trackAPI;

				conversionNext += (1 / downloadObject.size) * 100;

				if (
					Math.round(conversionNext) !== conversion &&
					Math.round(conversionNext) % 10 === 0 &&
					Math.round(conversionNext) !== 100
				) {
					conversion = Math.round(conversionNext);
					if (listener)
						listener.send("updateQueue", {
							uuid: downloadObject.uuid,
							title: downloadObject.title,
							conversion,
						});
				}

				callback();
			},
			settings.queueConcurrency
		);

		downloadObject.conversionData.forEach((track, pos) => {
			q.push({ track, pos }, () => {});
		});

		await q.drain();

		downloadObject.collection.tracks = collection;
		downloadObject.size = collection.length;

		const returnCollection = new Collection(downloadObject.toDict());
		if (listener)
			listener.send("finishConversion", returnCollection.getSlimmedDict());

		fs.writeFileSync(this.configFolder + "cache.json", JSON.stringify(cache));
		return returnCollection;
	}

	_convertPlaylistStructure(spotifyPlaylist) {
		let cover = null;
		// Mickey: some playlists can be faulty, for example https://open.spotify.com/playlist/7vyEjAGrXOIjqlC8pZRupW
		if (spotifyPlaylist?.images?.length) cover = spotifyPlaylist.images[0].url;

		const deezerPlaylist = {
			checksum: spotifyPlaylist.snapshot_id,
			collaborative: spotifyPlaylist.collaborative,
			creation_date: "XXXX-00-00",
			creator: {
				id: spotifyPlaylist.owner.id,
				name: spotifyPlaylist.owner.display_name,
				tracklist: spotifyPlaylist.owner.href,
				type: "user",
			},
			description: spotifyPlaylist.description,
			duration: 0,
			fans: spotifyPlaylist.followers ? spotifyPlaylist.followers.total : 0,
			id: spotifyPlaylist.id,
			is_loved_track: false,
			link: spotifyPlaylist.external_urls.spotify,
			nb_tracks: spotifyPlaylist.tracks.total,
			picture: cover,
			picture_small:
				cover ||
				"https://e-cdns-images.dzcdn.net/images/cover/d41d8cd98f00b204e9800998ecf8427e/56x56-000000-80-0-0.jpg",
			picture_medium:
				cover ||
				"https://e-cdns-images.dzcdn.net/images/cover/d41d8cd98f00b204e9800998ecf8427e/250x250-000000-80-0-0.jpg",
			picture_big:
				cover ||
				"https://e-cdns-images.dzcdn.net/images/cover/d41d8cd98f00b204e9800998ecf8427e/500x500-000000-80-0-0.jpg",
			picture_xl:
				cover ||
				"https://e-cdns-images.dzcdn.net/images/cover/d41d8cd98f00b204e9800998ecf8427e/1000x1000-000000-80-0-0.jpg",
			picture_thumbnail:
				cover ||
				"https://e-cdns-images.dzcdn.net/images/cover/d41d8cd98f00b204e9800998ecf8427e/75x75-000000-80-0-0.jpg",
			public: spotifyPlaylist.public,
			share: spotifyPlaylist.external_urls.spotify,
			title: spotifyPlaylist.name,
			tracklist: spotifyPlaylist.tracks.href,
			type: "playlist",
		};

		return deezerPlaylist;
	}

	loadSettings() {
		if (!fs.existsSync(this.configFolder + "config.json")) {
			fs.writeFileSync(
				this.configFolder + "config.json",
				JSON.stringify(
					{
						...this.credentials,
						...this.settings,
					},
					null,
					2
				)
			);
		}
		let settings;
		try {
			settings = JSON.parse(
				fs.readFileSync(this.configFolder + "config.json").toString()
			);
		} catch (e) {
			if (e.name === "SyntaxError") {
				fs.writeFileSync(
					this.configFolder + "config.json",
					JSON.stringify(
						{
							...this.credentials,
							...this.settings,
						},
						null,
						2
					)
				);
			}
			settings = JSON.parse(
				JSON.stringify({
					...this.credentials,
					...this.settings,
				})
			);
		}
		this.setSettings(settings);
		this.checkCredentials();
	}

	saveSettings(newSettings?: any) {
		if (newSettings) this.setSettings(newSettings);
		this.checkCredentials();
		fs.writeFileSync(
			this.configFolder + "config.json",
			JSON.stringify(
				{
					...this.credentials,
					...this.settings,
				},
				null,
				2
			)
		);
	}

	getSettings() {
		return {
			...this.credentials,
			...this.settings,
		};
	}

	setSettings(newSettings) {
		this.credentials = {
			clientId: newSettings.clientId,
			clientSecret: newSettings.clientSecret,
		};
		const settings = { ...newSettings };
		delete settings.clientId;
		delete settings.clientSecret;
		this.settings = settings;
	}

	loadCache() {
		let cache;
		try {
			cache = JSON.parse(
				fs.readFileSync(this.configFolder + "cache.json").toString()
			);
		} catch (e) {
			if (e.name === "SyntaxError") {
				fs.writeFileSync(
					this.configFolder + "cache.json",
					JSON.stringify({ tracks: {}, albums: {} }, null, 2)
				);
			}
			cache = { tracks: {}, albums: {} };
		}
		return cache;
	}

	saveCache(newCache) {
		fs.writeFileSync(
			this.configFolder + "cache.json",
			JSON.stringify(newCache)
		);
	}

	checkCredentials() {
		if (
			this.credentials.clientId === "" ||
			this.credentials.clientSecret === ""
		) {
			this.enabled = false;
			return;
		}

		this.sp = SpotifyApi.withClientCredentials(
			this.credentials.clientId,
			this.credentials.clientSecret
		);
		this.enabled = true;
	}

	getCredentials() {
		return this.credentials;
	}

	setCredentials(clientId, clientSecret) {
		clientId = clientId.trim();
		clientSecret = clientSecret.trim();

		this.credentials = { clientId, clientSecret };
		this.saveSettings();
	}
}
