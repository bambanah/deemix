import got from "got";
import {
	map_artist_album,
	map_user_track,
	map_user_artist,
	map_user_album,
	map_user_playlist,
} from "./utils.js";
import { GWAPIError } from "./errors.js";
import { type APIOptions } from "./index.js";

export const PlaylistStatus = {
	PUBLIC: 0,
	PRIVATE: 1,
	COLLABORATIVE: 2,
};

export interface GWTrack {
	ALB_ID: string;
	TRACK_TOKEN_EXPIRE: number;
	TOKEN: string;
	USER_ID: any;
	FILESIZE_MP3_MISC: any;
	VERSION: string;
	TRACK_NUMBER: number;
	DISK_NUMBER: number;
	RANK: any;
	RANK_SNG: any;
	PHYSICAL_RELEASE_DATE: string;
	EXPLICIT_LYRICS(EXPLICIT_LYRICS: any): boolean;
	EXPLICIT_TRACK_CONTENT: any;
	MEDIA: any;
	GAIN: number;
	ARTISTS: any;
	LYRICS_ID: any;
	SNG_CONTRIBUTORS: any;
	FALLBACK: any;
	DIGITAL_RELEASE_DATE: any;
	GENRE_ID: any;
	COPYRIGHT: any;
	LYRICS: any;
	ALBUM_FALLBACK: any;
	FILESIZE_AAC_64: any;
	FILESIZE_MP3_64: any;
	FILESIZE_MP3_128: any;
	FILESIZE_MP3_256: any;
	FILESIZE_MP3_320: any;
	FILESIZE_MP4_RA1: any;
	FILESIZE_MP4_RA2: any;
	FILESIZE_MP4_RA3: any;
	FILESIZE_FLAC: any;
	TRACK_TOKEN: string;
	SNG_ID: number;
	SNG_TITLE: string;
	DURATION: number;
	MD5_ORIGIN: number;
	MEDIA_VERSION: number;
	FILESIZE: number;
	ALB_TITLE: string;
	ALB_PICTURE: string;
	ART_ID: number;
	ART_NAME: string;
	ISRC: string;
}

export const EMPTY_TRACK_OBJ = {
	SNG_ID: 0,
	SNG_TITLE: "",
	DURATION: 0,
	MD5_ORIGIN: 0,
	MEDIA_VERSION: 0,
	FILESIZE: 0,
	ALB_TITLE: "",
	ALB_PICTURE: "",
	ART_ID: 0,
	ART_NAME: "",
} satisfies Partial<GWTrack>;

export class GW {
	httpHeaders: any;
	cookieJar: any;
	api_token: any;

	constructor(cookieJar, headers) {
		this.httpHeaders = headers;
		this.cookieJar = cookieJar;
		this.api_token = null;
	}

	async api_call(method: string, args?: any, params?: any): Promise<any> {
		if (args === undefined) args = {};
		if (params === undefined) params = {};
		if (!this.api_token && method !== "deezer.getUserData")
			this.api_token = await this._get_token();
		const p = {
			api_version: "1.0",
			api_token: method === "deezer.getUserData" ? "null" : this.api_token,
			input: "3",
			method,
			...params,
		};
		let result_json;
		try {
			result_json = await got
				.post("http://www.deezer.com/ajax/gw-light.php", {
					searchParams: p,
					json: args,
					cookieJar: this.cookieJar,
					headers: this.httpHeaders,
					https: {
						rejectUnauthorized: false,
					},
				})
				.json();
		} catch (e) {
			console.error("[ERROR] deezer.gw", method, args, e.name, e.message);
			if (
				[
					"ECONNABORTED",
					"ECONNREFUSED",
					"ECONNRESET",
					"ENETRESET",
					"ETIMEDOUT",
				].includes(e.code)
			) {
				await new Promise((resolve) => setTimeout(resolve, 2000)); // sleep(2000ms)
				return this.api_call(method, args, params);
			}
			throw new GWAPIError(`${method} ${args}:: ${e.name}: ${e.message}`);
		}
		if (result_json.error.length || Object.keys(result_json.error).length) {
			if (
				JSON.stringify(result_json.error) ===
					'{"GATEWAY_ERROR":"invalid api token"}' ||
				JSON.stringify(result_json.error) ===
					'{"VALID_TOKEN_REQUIRED":"Invalid CSRF token"}'
			) {
				this.api_token = await this._get_token();
				return this.api_call(method, args, params);
			}
			if (result_json.payload && result_json.payload.FALLBACK) {
				Object.keys(result_json.payload.FALLBACK).forEach((key) => {
					args[key] = result_json.payload.FALLBACK[key];
				});
				return this.api_call(method, args, params);
			}
			throw new GWAPIError(JSON.stringify(result_json.error));
		}
		if (!this.api_token && method === "deezer.getUserData")
			this.api_token = result_json.results.checkForm;
		return result_json.results;
	}

	async _get_token() {
		const token_data = await this.get_user_data();
		return token_data.checkForm;
	}

	get_user_data() {
		return this.api_call("deezer.getUserData");
	}

	get_user_profile_page(user_id, tab, options: APIOptions = {}) {
		const limit = options.limit || 10;
		return this.api_call("deezer.pageProfile", {
			USER_ID: user_id,
			tab,
			nb: limit,
		});
	}

	get_user_favorite_ids(checksum = null, options: APIOptions = {}) {
		const limit = options.limit || 10000;
		const start = options.start || 0;
		return this.api_call("song.getFavoriteIds", { nb: limit, start, checksum });
	}

	get_child_accounts() {
		return this.api_call("deezer.getChildAccounts");
	}

	getTrack(sng_id: string | number): Promise<GWTrack> {
		return this.api_call("song.getData", { SNG_ID: sng_id });
	}

	get_track_page(sng_id) {
		return this.api_call("deezer.pageTrack", { SNG_ID: sng_id });
	}

	get_track_lyrics(sng_id) {
		return this.api_call("song.getLyrics", { SNG_ID: sng_id });
	}

	async get_tracks(sng_ids) {
		const tracks_array: any[] = [];
		const body = await this.api_call("song.getListData", { SNG_IDS: sng_ids });
		let errors = 0;
		for (let i = 0; i < sng_ids.length; i++) {
			if (sng_ids[0] !== 0) {
				tracks_array.push(body.data[i - errors]);
			} else {
				errors++;
				tracks_array.push(EMPTY_TRACK_OBJ);
			}
		}
		return tracks_array;
	}

	get_album(alb_id) {
		return this.api_call("album.getData", { ALB_ID: alb_id });
	}

	get_album_page(alb_id) {
		return this.api_call("deezer.pageAlbum", {
			ALB_ID: alb_id,
			lang: "en",
			header: true,
			tab: 0,
		});
	}

	async get_album_tracks(alb_id) {
		const tracks_array: any[] = [];
		const body = await this.api_call("song.getListByAlbum", {
			ALB_ID: alb_id,
			nb: -1,
		});
		body.data.forEach((track) => {
			const _track = track;
			_track.POSITION = body.data.indexOf(track);
			tracks_array.push(_track);
		});
		return tracks_array;
	}

	get_artist(art_id) {
		return this.api_call("artist.getData", { ART_ID: art_id });
	}

	get_artist_page(art_id) {
		return this.api_call("deezer.pageArtist", {
			ART_ID: art_id,
			lang: "en",
			header: true,
			tab: 0,
		});
	}

	async get_artist_top_tracks(art_id, options: APIOptions = {}) {
		const limit = options.limit || 100;
		const tracks_array: any[] = [];
		const body = await this.api_call("artist.getTopTrack", {
			ART_ID: art_id,
			nb: limit,
		});
		body.data.forEach((track) => {
			track.POSITION = body.data.indexOf(track);
			tracks_array.push(track);
		});
		return tracks_array;
	}

	get_artist_discography(art_id, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 25;
		return this.api_call("album.getDiscography", {
			ART_ID: art_id,
			discography_mode: "all",
			nb: limit,
			nb_songs: 0,
			start: index,
		});
	}

	get_playlist(playlist_id) {
		return this.get_playlist_page(playlist_id);
	}

	get_playlist_page(playlist_id) {
		return this.api_call("deezer.pagePlaylist", {
			PLAYLIST_ID: playlist_id,
			lang: "en",
			header: true,
			tab: 0,
		});
	}

	async get_playlist_tracks(playlist_id) {
		const tracks_array: any[] = [];
		const body = await this.api_call("playlist.getSongs", {
			PLAYLIST_ID: playlist_id,
			nb: -1,
		});
		body.data.forEach((track) => {
			track.POSITION = body.data.indexOf(track);
			tracks_array.push(track);
		});
		return tracks_array;
	}

	create_playlist(
		title,
		status = PlaylistStatus.PUBLIC,
		description,
		songs = []
	) {
		const newSongs: any[] = [];
		songs.forEach((song) => {
			newSongs.push([song, 0]);
		});
		return this.api_call("playlist.create", {
			title,
			status,
			description,
			songs: newSongs,
		});
	}

	edit_playlist(playlist_id, title, status, description, songs = []) {
		const newSongs: any[] = [];
		songs.forEach((song) => {
			newSongs.push([song, 0]);
		});
		return this.api_call("playlist.update", {
			PLAYLIST_ID: playlist_id,
			title,
			status,
			description,
			songs: newSongs,
		});
	}

	add_songs_to_playlist(playlist_id, songs, offset = -1) {
		const newSongs: any[] = [];
		songs.forEach((song) => {
			newSongs.push([song, 0]);
		});
		return this.api_call("playlist.addSongs", {
			PLAYLIST_ID: playlist_id,
			songs: newSongs,
			offset,
		});
	}

	add_song_to_playlist(playlist_id, sng_id, offset = -1) {
		return this.add_songs_to_playlist(playlist_id, [sng_id], offset);
	}

	remove_songs_from_playlist(playlist_id, songs) {
		const newSongs: any[] = [];
		songs.forEach((song) => {
			newSongs.push([song, 0]);
		});
		return this.api_call("playlist.deleteSongs", {
			PLAYLIST_ID: playlist_id,
			songs: newSongs,
		});
	}

	remove_song_from_playlist(playlist_id, sng_id) {
		return this.remove_songs_from_playlist(playlist_id, [sng_id]);
	}

	delete_playlist(playlist_id) {
		return this.api_call("playlist.delete", { PLAYLIST_ID: playlist_id });
	}

	add_song_to_favorites(sng_id) {
		return this.gw_api_call("favorite_song.add", { SNG_ID: sng_id });
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	gw_api_call(arg0: string, arg1: Record<string, any>) {
		throw new Error("Method not implemented.");
	}

	remove_song_from_favorites(sng_id) {
		return this.gw_api_call("favorite_song.remove", { SNG_ID: sng_id });
	}

	add_album_to_favorites(alb_id) {
		return this.gw_api_call("album.addFavorite", { ALB_ID: alb_id });
	}

	remove_album_from_favorites(alb_id) {
		return this.gw_api_call("album.deleteFavorite", { ALB_ID: alb_id });
	}

	add_artist_to_favorites(art_id) {
		return this.gw_api_call("artist.addFavorite", { ART_ID: art_id });
	}

	remove_artist_from_favorites(art_id) {
		return this.gw_api_call("artist.deleteFavorite", { ART_ID: art_id });
	}

	add_playlist_to_favorites(playlist_id) {
		return this.gw_api_call("playlist.addFavorite", {
			PARENT_PLAYLIST_ID: playlist_id,
		});
	}

	remove_playlist_from_favorites(playlist_id) {
		return this.gw_api_call("playlist.deleteFavorite", {
			PLAYLIST_ID: playlist_id,
		});
	}

	get_page(page) {
		const params = {
			gateway_input: JSON.stringify({
				PAGE: page,
				VERSION: "2.3",
				SUPPORT: {
					grid: ["channel", "album"],
					"horizontal-grid": ["album"],
				},
				LANG: "en",
			}),
		};
		return this.api_call("page.get", {}, params);
	}

	search(
		query,
		index = 0,
		limit = 10,
		suggest = true,
		artist_suggest = true,
		top_tracks = true
	) {
		return this.api_call("deezer.pageSearch", {
			query,
			start: index,
			nb: limit,
			suggest,
			artist_suggest,
			top_tracks,
		});
	}

	search_music(query, type, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 10;
		return this.api_call("search.music", {
			query,
			filter: "ALL",
			output: type,
			start: index,
			nb: limit,
		});
	}

	// Extra calls

	async get_artist_discography_tabs(art_id, options: APIOptions = {}) {
		const limit = options.limit || 100;
		let index = 0;
		let releases = [];
		const result: any = { all: [], featured: [], more: [] };
		const ids: any[] = [];

		// Get all releases
		let response;
		do {
			response = await this.get_artist_discography(art_id, { index, limit });
			releases = releases.concat(response.data);
			index += limit;
		} while (index < response.total);

		releases.forEach((release: any) => {
			if (ids.indexOf(release.ALB_ID) === -1) {
				ids.push(release.ALB_ID);
				const obj = map_artist_album(release);
				if (
					(release.ART_ID === art_id ||
						(release.ART_ID !== art_id && release.ROLE_ID === 0)) &&
					release.ARTISTS_ALBUMS_IS_OFFICIAL
				) {
					// Handle all base record types
					if (!result[obj.record_type]) result[obj.record_type] = [];
					result[obj.record_type].push(obj);
					result.all.push(obj);
				} else {
					if (release.ROLE_ID === 5) {
						// Handle albums where the artist is featured
						result.featured.push(obj);
					} else if (release.ROLE_ID === 0) {
						// Handle "more" albums
						result.more.push(obj);
						result.all.push(obj);
					}
				}
			}
		});
		return result;
	}

	async get_track_with_fallback(sng_id): Promise<GWTrack> {
		let body;
		if (parseInt(sng_id) > 0) {
			try {
				body = await this.get_track_page(sng_id);
			} catch {
				/* nothing */
			}
		}

		if (body) {
			if (body.LYRICS) body.DATA.LYRICS = body.LYRICS;
			if (body.ISRC) body.DATA.ALBUM_FALLBACK = body.ISRC;
			body = body.DATA;
		} else {
			body = await this.getTrack(sng_id);
		}
		return body;
	}

	async get_user_playlists(user_id, options: APIOptions = {}) {
		const limit = options.limit || 25;
		const user_profile_page = await this.get_user_profile_page(
			user_id,
			"playlists",
			{ limit }
		);
		const blog_name = user_profile_page.DATA.USER.BLOG_NAME || "Unknown";
		const data = user_profile_page.TAB.playlists.data;
		const result: any[] = [];
		data.forEach((playlist) => {
			result.push(map_user_playlist(playlist, blog_name));
		});
		return result;
	}

	async get_user_albums(user_id, options: APIOptions = {}) {
		const limit = options.limit || 25;
		let data = await this.get_user_profile_page(user_id, "albums", { limit });
		data = data.TAB.albums.data;
		const result: any[] = [];
		data.forEach((album) => {
			result.push(map_user_album(album));
		});
		return result;
	}

	async get_user_artists(user_id, options: APIOptions = {}) {
		const limit = options.limit || 25;
		let data = await this.get_user_profile_page(user_id, "artists", { limit });
		data = data.TAB.artists.data;
		const result: any[] = [];
		data.forEach((artist) => {
			result.push(map_user_artist(artist));
		});
		return result;
	}

	async get_user_tracks(user_id, options: APIOptions = {}) {
		const user_data = await this.get_user_data();
		if (user_data.USER.USER_ID === user_id)
			return this.get_my_favorite_tracks(options);
		const limit = options.limit || 25;
		let data = await this.get_user_profile_page(user_id, "loved", { limit });
		data = data.TAB.loved.data;
		const result: any[] = [];
		data.forEach((track) => {
			result.push(map_user_track(track));
		});
		return result;
	}

	// TODO: Optimise this function
	async get_my_favorite_tracks(options: APIOptions = {}) {
		const limit = options.limit || 25;
		const ids_raw = await this.get_user_favorite_ids(null, { limit });
		const ids = ids_raw.data.map((x) => x.SNG_ID);
		if (!ids.length) return [];
		const data = await this.get_tracks(ids);
		const result: any[] = [];
		let i = 0;
		data.forEach((track) => {
			if (!track) return;
			while (track.SNG_ID !== ids[i]) i++;
			track = { ...track, ...ids_raw.data[i] };
			result.push(map_user_track(track));
			i++;
		});
		return result;
	}
}
