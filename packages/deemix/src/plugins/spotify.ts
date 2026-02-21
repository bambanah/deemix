import { Collection, Convertable } from "@/download-objects/Collection.js";
import { generateAlbumItem } from "@/download-objects/generateAlbumItem.js";
import { generateTrackItem } from "@/download-objects/generateTrackItem.js";
import {
	AlbumNotOnDeezer,
	InvalidID,
	PluginNotEnabledError,
	TrackNotOnDeezer,
} from "@/errors.js";
import { type Settings } from "@/types/Settings.js";
import { getConfigFolder } from "@/utils/localpaths.js";
import {
	SpotifyApi,
	type MaxInt,
	type Track as SpotifyTrack,
	type AccessToken,
} from "@spotify/web-api-ts-sdk";
import { queue } from "async";
import { Deezer, type DeezerTrack } from "deezer-sdk";
import crypto from "crypto";
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

	// OAuth token storage
	oauthTokens: {
		accessToken: string;
		refreshToken: string;
		expiresAt: number; // Unix timestamp in ms
	} | null;
	oauthState: string | null; // CSRF protection

	constructor(configFolder = undefined) {
		super();
		this.credentials = { clientId: "", clientSecret: "" };
		this.settings = {
			fallbackSearch: false,
		};
		this.enabled = false;
		this.oauthTokens = null;
		this.oauthState = null;
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

		await this.ensureValidToken();
		let spotifyPlaylist = await this.spotifyApiGet(`/playlists/${link_id}`) as any;
		if (!spotifyPlaylist) {
			spotifyPlaylist = await this.sp.playlists.getPlaylist(link_id);
		}

		// Handle null tracks (Spotify Dev Mode apps return null tracks for public playlists)
		if (!spotifyPlaylist.tracks) {
			spotifyPlaylist.tracks = await this.sp.playlists.getPlaylistItems(link_id);
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

			let playlistTracks = await this.spotifyApiGet(`/playlists/${link_id}/tracks?offset=${offset}&limit=${limit}`) as any;
			if (!playlistTracks) {
				playlistTracks = await this.sp.playlists.getPlaylistItems(
					link_id,
					undefined,
					undefined,
					limit,
					offset
				);
			}

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

	async getTrack(track_id: string, spotifyTrack?: SpotifyTrack) {
		if (!this.enabled) throw new PluginNotEnabledError("Spotify");
		await this.ensureValidToken();

		const cachedTrack = {
			isrc: null,
			data: null,
		};

		if (!spotifyTrack) {
			const directTrack = await this.spotifyApiGet(`/tracks/${track_id}`);
			if (directTrack) {
				spotifyTrack = directTrack as SpotifyTrack;
			} else {
				try {
					spotifyTrack = await this.sp.tracks.get(track_id);
				} catch (e) {
					if (e.body?.error?.message === "invalid id")
						throw new InvalidID(`https://open.spotify.com/track/${track_id}`);
					throw e;
				}
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
		await this.ensureValidToken();
		const cachedAlbum = {
			upc: null,
			data: null,
		};

		if (!spotifyAlbum) {
			const directAlbum = await this.spotifyApiGet(`/albums/${album_id}`);
			if (directAlbum) {
				spotifyAlbum = directAlbum;
			} else {
				try {
					spotifyAlbum = await this.sp.albums.get(album_id);
				} catch (e) {
					if (e.body?.error?.message === "invalid id")
						throw new InvalidID(`https://open.spotify.com/album/${album_id}`);
					throw e;
				}
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
			nb_tracks: spotifyPlaylist.tracks?.total ?? 0,
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
			tracklist: spotifyPlaylist.tracks?.href ?? '',
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

		// Load OAuth tokens if present
		if (settings.oauthTokens) {
			this.oauthTokens = settings.oauthTokens;
		}

		this.checkCredentials();
	}

	saveSettings(newSettings?: any) {
		if (newSettings) this.setSettings(newSettings);
		this.checkCredentials();
		const configData: any = {
			...this.credentials,
			...this.settings,
		};
		// Persist OAuth tokens if present
		if (this.oauthTokens) {
			configData.oauthTokens = this.oauthTokens;
		}
		fs.writeFileSync(
			this.configFolder + "config.json",
			JSON.stringify(configData, null, 2)
		);
	}

	getSettings() {
		return {
			...this.credentials,
			...this.settings,
			oauthAuthenticated: this.isOAuthAuthenticated(),
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
		delete settings.oauthTokens;
		delete settings.oauthAuthenticated;
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

		// Prefer OAuth tokens if available and valid
		if (this.oauthTokens && this.oauthTokens.accessToken) {
			this._initWithOAuthToken();
			this.enabled = true;
			return;
		}

		// Fall back to Client Credentials
		this.sp = SpotifyApi.withClientCredentials(
			this.credentials.clientId,
			this.credentials.clientSecret
		);
		this.enabled = true;
	}

	_initWithOAuthToken() {
		const token: AccessToken = {
			access_token: this.oauthTokens.accessToken,
			token_type: "Bearer",
			expires_in: Math.max(0, Math.floor((this.oauthTokens.expiresAt - Date.now()) / 1000)),
			refresh_token: this.oauthTokens.refreshToken,
		};
		this.sp = SpotifyApi.withAccessToken(
			this.credentials.clientId,
			token
		);
	}

	/**
	 * Direct Spotify API call using got + Bearer token.
	 * Bypasses the @spotify/web-api-ts-sdk which has issues with withAccessToken.
	 * Falls back to null if no OAuth tokens, so callers use the SDK instead.
	 */
	private async spotifyApiGet(endpoint: string): Promise<any | null> {
		if (!this.oauthTokens?.accessToken) return null;
		await this.ensureValidToken();
		try {
			const response = await got.get(`https://api.spotify.com/v1${endpoint}`, {
				headers: {
					'Authorization': `Bearer ${this.oauthTokens.accessToken}`,
				},
			}).json();
			return response;
		} catch (e) {
			// If OAuth request fails, return null to fall back to SDK
			console.error('[spotify] Direct OAuth API call failed:', e.message);
			return null;
		}
	}

	// --- OAuth Flow Methods ---

	getAuthUrl(redirectUri: string): string {
		this.oauthState = crypto.randomBytes(16).toString("hex");
		const scopes = "playlist-read-private";
		const params = new URLSearchParams({
			response_type: "code",
			client_id: this.credentials.clientId,
			scope: scopes,
			redirect_uri: redirectUri,
			state: this.oauthState,
		});
		return `https://accounts.spotify.com/authorize?${params.toString()}`;
	}

	async handleAuthCallback(code: string, redirectUri: string, state: string): Promise<boolean> {
		// Verify CSRF state
		if (this.oauthState && state !== this.oauthState) {
			throw new Error("OAuth state mismatch — possible CSRF attack");
		}
		this.oauthState = null;

		// Exchange authorization code for tokens
		const basicAuth = Buffer.from(
			`${this.credentials.clientId}:${this.credentials.clientSecret}`
		).toString("base64");

		const response: any = await got.post("https://accounts.spotify.com/api/token", {
			headers: {
				"Authorization": `Basic ${basicAuth}`,
				"Content-Type": "application/x-www-form-urlencoded",
			},
			form: {
				grant_type: "authorization_code",
				code,
				redirect_uri: redirectUri,
			},
		}).json();

		if (!response.access_token) {
			throw new Error(`Spotify token exchange failed: ${JSON.stringify(response)}`);
		}

		this.oauthTokens = {
			accessToken: response.access_token,
			refreshToken: response.refresh_token,
			expiresAt: Date.now() + (response.expires_in * 1000),
		};

		this._initWithOAuthToken();
		this.enabled = true;
		this.saveSettings();
		return true;
	}

	async refreshAccessToken(): Promise<boolean> {
		if (!this.oauthTokens?.refreshToken) return false;

		const basicAuth = Buffer.from(
			`${this.credentials.clientId}:${this.credentials.clientSecret}`
		).toString("base64");

		try {
			const response: any = await got.post("https://accounts.spotify.com/api/token", {
				headers: {
					"Authorization": `Basic ${basicAuth}`,
					"Content-Type": "application/x-www-form-urlencoded",
				},
				form: {
					grant_type: "refresh_token",
					refresh_token: this.oauthTokens.refreshToken,
				},
			}).json();

			if (!response.access_token) return false;

			this.oauthTokens.accessToken = response.access_token;
			this.oauthTokens.expiresAt = Date.now() + (response.expires_in * 1000);
			// Spotify may issue a new refresh token
			if (response.refresh_token) {
				this.oauthTokens.refreshToken = response.refresh_token;
			}

			this._initWithOAuthToken();
			this.saveSettings();
			return true;
		} catch {
			return false;
		}
	}

	async ensureValidToken(): Promise<void> {
		if (!this.oauthTokens) return;
		// Refresh if token expires within 60 seconds
		if (Date.now() >= this.oauthTokens.expiresAt - 60000) {
			await this.refreshAccessToken();
		}
	}

	isOAuthAuthenticated(): boolean {
		return !!(this.oauthTokens?.accessToken);
	}

	logoutOAuth(): void {
		this.oauthTokens = null;
		this.saveSettings();
		this.checkCredentials(); // Fall back to Client Credentials
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
