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

	// Spotify Feb 2026 migration (Development Mode apps, enforced 9 Mar 2026):
	// GET /playlists/{id}/tracks was replaced by GET /playlists/{id}/items,
	// and the shape changed from tracks.items[].track to items.items[].item.
	// Extended Quota apps still serve the old shape, and the pinned
	// @spotify/web-api-ts-sdk@1.2.0 still generates /tracks URLs, so every
	// playlist page is normalized here into the legacy
	// { items, next, total, href } form (each entry exposing .track).
	private normalizeTracksPage(page: any): any {
		if (!page || typeof page !== "object") return page;
		const rawItems: any[] = Array.isArray((page as any)?.items?.items)
			? (page as any).items.items
			: Array.isArray((page as any)?.tracks?.items)
				? (page as any).tracks.items
				: Array.isArray((page as any)?.items)
					? (page as any).items
					: [];
		const maybeItemsPage = (page as any)?.items;
		const source =
			maybeItemsPage && !Array.isArray(maybeItemsPage)
				? maybeItemsPage
				: ((page as any)?.tracks ?? page);
		const normalizedItems = rawItems.map((entry: any) => {
			if (!entry || typeof entry !== "object") return entry;
			const track = entry.item ?? entry.track;
			if (track && !entry.track) return { ...entry, track };
			return entry;
		});
		return {
			...source,
			items: normalizedItems,
			next: source?.next ?? (page as any)?.next ?? null,
			total: source?.total ?? (page as any)?.total ?? normalizedItems.length,
			href: source?.href ?? (page as any)?.href ?? "",
		};
	}

	private normalizePlaylistTracksPage(playlist: any): void {
		if (!playlist || typeof playlist !== "object") return;
		if (!playlist.tracks && playlist.items) {
			playlist.tracks = this.normalizeTracksPage(playlist.items);
		} else if (playlist.tracks) {
			playlist.tracks = this.normalizeTracksPage(playlist.tracks);
		}
	}

	async generatePlaylistItem(dz: Deezer, link_id: string, bitrate: number) {
		if (!this.enabled) throw new PluginNotEnabledError("Spotify");
		await this.ensureValidToken();
		let spotifyPlaylist = await this.spotifyApiGet(`/playlists/${link_id}`) as any;
		let market: Market | undefined;
		if (!spotifyPlaylist) {
			// Fall back to SDK, with market retry for region-locked playlists
			try {
				spotifyPlaylist = await this.sp.playlists.getPlaylist(link_id);
			} catch (e) {
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
		}

		// Normalize Feb 2026 (`items`) and legacy (`tracks`) playlist shapes
		this.normalizePlaylistTracksPage(spotifyPlaylist);

		// Handle null/missing track pages (Spotify Dev Mode apps return null
		// tracks for some playlists): try the Feb 2026 `/items` endpoint
		// first via direct HTTP, then fall back to the SDK (which still
		// targets `/tracks` and only helps Extended Quota apps).
		if (!spotifyPlaylist.tracks?.items) {
			const itemsPage = (await this.spotifyApiGet(
				`/playlists/${link_id}/items?offset=0&limit=50`
			)) as any;
			if (itemsPage) {
				spotifyPlaylist.tracks = this.normalizeTracksPage(itemsPage);
			} else {
				spotifyPlaylist.tracks = this.normalizeTracksPage(
					await this.sp.playlists.getPlaylistItems(link_id)
				);
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

			let playlistTracks = (await this.spotifyApiGet(
				`/playlists/${link_id}/items?offset=${offset}&limit=${limit}`
			)) as any;
			if (!playlistTracks) {
				playlistTracks = await this.sp.playlists.getPlaylistItems(
					link_id,
					market,
					undefined,
					limit,
					offset
				);
			}

			spotifyPlaylist.tracks = this.normalizeTracksPage(playlistTracks);
			tracklistTemp = tracklistTemp.concat(spotifyPlaylist.tracks.items);
		}

		const tracklist: SpotifyTrack[] = [];
		tracklistTemp.forEach((item) => {
			// Feb 2026 shape wraps each entry as `item`; legacy shape uses `track`
			const track = item?.item ?? item?.track;
			if (!track) return; // Skip everything that isn't a track
			if (track.explicit && !playlistAPI.explicit) playlistAPI.explicit = true;
			tracklist.push(track);
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

			const trackPage: any = playlist?.items ?? playlist?.tracks;
			const trackItems: any[] = Array.isArray(trackPage?.items)
				? [...trackPage.items]
				: [];
			let nextUrl: string | null = trackPage?.next || null;

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
				const track = item?.item ?? item?.track;
				if (!track || typeof track.id !== "string") continue;
				tracklist.push(track);
			}

			if (!tracklist.length) return null;
			const normalized = this.normalizeTracksPage(
				playlist.tracks ?? playlist.items
			);
			playlist.tracks =
				normalized && typeof normalized === "object" ? normalized : {};
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
		// Normalize Feb 2026 (`items`) and legacy (`tracks`) shapes so both
		// Development Mode and Extended Quota responses report correct counts.
		this.normalizePlaylistTracksPage(spotifyPlaylist);
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
