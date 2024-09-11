import got from "got";
import { CookieJar } from "tough-cookie";
import {
	APIError,
	DataException,
	IndividualAccountChangedNotAllowedException,
	InvalidQueryException,
	InvalidTokenException,
	ItemsLimitExceededException,
	MissingParameterException,
	PermissionException,
	WrongParameterException,
} from "./errors.js";
import { Deezer, type APIOptions } from "./index.js";
import { albumSchema, type DeezerAlbum } from "./schema/album-schema.js";
import { trackSchema, type DeezerTrack } from "./schema/track-schema.js";
import { artistSchema } from "./schema/contributor-schema.js";

// Possible values for order parameter in search
export const SearchOrder = {
	RANKING: "RANKING",
	TRACK_ASC: "TRACK_ASC",
	TRACK_DESC: "TRACK_DESC",
	ARTIST_ASC: "ARTIST_ASC",
	ARTIST_DESC: "ARTIST_DESC",
	ALBUM_ASC: "ALBUM_ASC",
	ALBUM_DESC: "ALBUM_DESC",
	RATING_ASC: "RATING_ASC",
	RATING_DESC: "RATING_DESC",
	DURATION_ASC: "DURATION_ASC",
	DURATION_DESC: "DURATION_DESC",
};

export interface APIArtist {
	id: number;
	name: string;
	link?: string;
	share?: string;
	picture?: string;
	picture_small?: string;
	picture_medium?: string;
	picture_big?: string;
	picture_xl?: string;
	nb_album?: number;
	nb_fan?: number;
	radio?: boolean;
	tracklist?: string;
	role?: string;
	md5_image?: string;
}

export interface APIAlbum {
	id: string;
	title: string;
	link: string;
	cover: string;
	cover_small: string;
	cover_medium: string;
	cover_big: string;
	cover_xl: string;
	release_date: string; // Assuming the date is in string format (e.g., "YYYY-MM-DD")
	root_artist?: APIArtist;
	nb_tracks?: number;
	nb_disk?: number;
	tracks?: { data?: APITrack[] };
	md5_image?: string;
	md5_origin?: string;
	artist?: APIArtist;
	explicit_lyrics?: boolean;
	contributors?: APIContributor[];
	record_type?: string;
	upc?: string;
	label?: string;
	copyright?: string;
	original_release_date?: string;
	genres?: { data?: { name?: string }[] };
}

export interface APITrack {
	id: number;
	readable: boolean;
	title: string;
	title_short: string;
	title_version: string;
	unseen: boolean;
	isrc: string;
	link: string;
	share: string;
	duration: number;
	track_position: number;
	disk_number: number;
	rank: number;
	release_date: string; // Assuming the date is in string format (e.g., "YYYY-MM-DD")
	explicit_lyrics: boolean;
	explicit_content_lyrics: number;
	explicit_content_cover: number;
	preview: string;
	bpm: number;
	gain: number;
	available_countries: string[]; // List of countries as strings
	alternative?: APITrack; // Assuming alternative is of type Track
	alternative_albums?: {
		data: APIAlbum[];
	};
	contributors?: APIContributor[]; // Assuming Contributor is an object
	md5_image: string;
	track_token: string;
	artist: APIArtist;
	album: APIAlbum;
	size?: number;
	lyrics_id?: string;
	lyrics?: string;
	position?: number;
	copyright?: string;
	physical_release_date?: string;
	genres?: string[];
}

export interface APIContributor {
	id: number;
	name: string;
	link: string;
	share: string;
	picture: string;
	picture_small: string;
	picture_medium: string;
	picture_big: string;
	picture_xl: string;
	role: string | null | undefined;
}

export interface APIPlaylist {
	id?: string;
	title?: any;
	description?: string;
	duration?: number;
	public?: any;
	is_loved_track?: boolean;
	collaborative?: boolean;
	nb_tracks?: any;
	fans?: any;
	link?: string;
	share?: any;
	picture?: any;
	picture_small?: any;
	picture_medium?: any;
	picture_big?: any;
	picture_xl?: any;
	checksum?: any;
	tracklist?: string;
	creation_date?: string;
	creator?: any;
	type?: string;
	various_artist?: any;
	explicit?: any;
}

// Contains additional information from GW
export interface EnrichedAPITrack
	extends Omit<APITrack, "album" | "artist" | "contributors"> {
	type?: string;
	md5_origin?: string;
	filesizes?: Record<string, any>;
	media_version?: number;
	track_token_expire?: number;
	token: string;
	user_id: string;
	lyrics_id?: string;
	physical_release_date?: string;
	song_contributors?: any;
	fallback_id?: number;
	digital_release_date?: string;
	genre_id?: number;
	copyright?: string;
	lyrics?: string;
	alternative_albums?: any;
	album?: EnrichedAPIAlbum;
	artist: EnrichedAPIArtist;
	contributors: EnrichedAPIContributor[];
}

export interface EnrichedAPIContributor extends APIContributor {
	md5_image: string;
	tracklist: string;
	type: string;
	order: string;
	rank: any;
}

export interface EnrichedAPIAlbum extends APIAlbum {
	md5_image?: string;
	tracklist?: string;
	type?: string;
}

export interface EnrichedAPIArtist extends APIArtist {
	md5_image?: string;
	type?: string;
}

type APIArgs = Record<string | number, string | number>;

export class API {
	http_headers: { "User-Agent": string };
	cookie_jar: CookieJar;
	access_token: string | null;

	constructor(cookie_jar: CookieJar, headers: { "User-Agent": string }) {
		this.http_headers = headers;
		this.cookie_jar = cookie_jar;
		this.access_token = null;
	}

	async call(endpoint: string, args: APIArgs = {}): Promise<unknown> {
		if (this.access_token) args["access_token"] = this.access_token;

		let response;
		try {
			response = await got
				.get("https://api.deezer.com/" + endpoint, {
					searchParams: args,
					cookieJar: this.cookie_jar,
					headers: this.http_headers,
					https: {
						rejectUnauthorized: false,
					},
				})
				.json();
		} catch (e) {
			console.error("[ERROR] deezer.api", endpoint, args, e.name, e.message);
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
				return this.call(endpoint, args);
			}
			throw new APIError(`${endpoint} ${args}:: ${e.name}: ${e.message}`);
		}

		if (response.error) {
			if (response.error.code) {
				if ([4, 700].indexOf(response.error.code) !== -1) {
					await new Promise((resolve) => setTimeout(resolve, 5000)); // sleep(5000ms)
					return await this.call(endpoint, args);
				}
				if (response.error.code === 100)
					throw new ItemsLimitExceededException(
						`ItemsLimitExceededException: ${endpoint} ${
							response.error.message || ""
						}`
					);
				if (response.error.code === 200)
					throw new PermissionException(
						`PermissionException: ${endpoint} ${response.error.message || ""}`
					);
				if (response.error.code === 300)
					throw new InvalidTokenException(
						`InvalidTokenException: ${endpoint} ${response.error.message || ""}`
					);
				if (response.error.code === 500)
					throw new WrongParameterException(
						`ParameterException: ${endpoint} ${response.error.message || ""}`
					);
				if (response.error.code === 501)
					throw new MissingParameterException(
						`MissingParameterException: ${endpoint} ${
							response.error.message || ""
						}`
					);
				if (response.error.code === 600)
					throw new InvalidQueryException(
						`InvalidQueryException: ${endpoint} ${response.error.message || ""}`
					);
				if (response.error.code === 800)
					throw new DataException(
						`DataException: ${endpoint} ${response.error.message || ""}`
					);
				if (response.error.code === 901)
					throw new IndividualAccountChangedNotAllowedException(
						`IndividualAccountChangedNotAllowedException: ${endpoint} ${
							response.error.message || ""
						}`
					);
			}
			throw new APIError(response.error);
		}

		return response;
	}

	// -----===== Tracks =====-----

	async getTrack(song_id: string | number): Promise<DeezerTrack> {
		const response = await this.call(`track/${song_id}`);
		return trackSchema.parse(response);
	}

	getTrackByISRC(isrc: string): Promise<DeezerTrack> {
		return this.getTrack(`isrc:${isrc}`);
	}

	// -----===== Albums =====-----

	async get_album(album_id: string | number): Promise<APIAlbum> {
		return this.call(`album/${album_id}`) as Promise<APIAlbum>;
	}

	get_album_by_UPC(upc: string) {
		return this.get_album(`upc:${upc}`);
	}

	get_album_comments(album_id: number, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 25;
		return this.call(`album/${album_id}/comments`, { index, limit });
	}

	get_album_fans(album_id: number, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 100;
		return this.call(`album/${album_id}/fans`, { index, limit });
	}

	get_album_tracks(album_id: number, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || -1;
		return this.call(`album/${album_id}/tracks`, { index, limit });
	}

	// -----===== Artists =====-----

	get_artist(artist_id) {
		return this.call(`artist/${artist_id}`);
	}

	get_artist_top(artist_id, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 10;
		return this.call(`artist/${artist_id}/top`, { index, limit });
	}

	get_artist_albums(artist_id, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || -1;
		return this.call(`artist/${artist_id}/albums`, { index, limit });
	}

	get_artist_comments(artist_id, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 10;
		return this.call(`artist/${artist_id}/comments`, { index, limit });
	}

	get_artist_fans(artist_id, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 100;
		return this.call(`artist/${artist_id}/fans`, { index, limit });
	}

	get_artist_related(artist_id, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 20;
		return this.call(`artist/${artist_id}/related`, { index, limit });
	}

	get_artist_radio(artist_id, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 25;
		return this.call(`artist/${artist_id}/radio`, { index, limit });
	}

	get_artist_playlists(artist_id, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || -1;
		return this.call(`artist/${artist_id}/playlists`, { index, limit });
	}

	// -----===== Charts =====-----

	get_chart(genre_id = 0, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 10;
		return this.call(`chart/${genre_id}`, { index, limit });
	}

	get_chart_tracks(genre_id = 0, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 10;
		return this.call(`chart/${genre_id}/tracks`, { index, limit });
	}

	get_chart_albums(genre_id = 0, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 10;
		return this.call(`chart/${genre_id}/albums`, { index, limit });
	}

	get_chart_artists(genre_id = 0, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 10;
		return this.call(`chart/${genre_id}/artists`, { index, limit });
	}

	get_chart_playlists(genre_id = 0, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 10;
		return this.call(`chart/${genre_id}/playlists`, { index, limit });
	}

	get_chart_podcasts(genre_id = 0, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 10;
		return this.call(`chart/${genre_id}/podcasts`, { index, limit });
	}

	get_comment(comment_id) {
		return this.call(`comment/${comment_id}`);
	}

	get_editorials(options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 10;
		return this.call("editorial", { index, limit });
	}

	get_editorial(genre_id = 0) {
		return this.call(`editorial/${genre_id}`);
	}

	get_editorial_selection(genre_id = 0, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 10;
		return this.call(`editorial/${genre_id}/selection`, { index, limit });
	}

	get_editorial_charts(genre_id = 0, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 10;
		return this.call(`editorial/${genre_id}/charts`, { index, limit });
	}

	get_editorial_releases(genre_id = 0, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 10;
		return this.call(`editorial/${genre_id}/releases`, { index, limit });
	}

	// -----===== Genres =====-----

	get_genres(options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 10;
		return this.call("genre", { index, limit });
	}

	get_genre(genre_id = 0) {
		return this.call(`genre/${genre_id}`);
	}

	get_genre_artists(genre_id = 0, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 10;
		return this.call(`genre/${genre_id}/artists`, { index, limit });
	}

	get_genre_radios(genre_id = 0, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 10;
		return this.call(`genre/${genre_id}/radios`, { index, limit });
	}

	get_infos() {
		return this.call("infos");
	}

	get_options() {
		return this.call("options");
	}

	// -----===== Playlists =====-----

	get_playlist(playlist_id) {
		return this.call(`playlist/${playlist_id}`);
	}

	get_playlist_comments(album_id, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 10;
		return this.call(`playlist/${album_id}/comments`, { index, limit });
	}

	get_playlist_fans(album_id, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 100;
		return this.call(`playlist/${album_id}/fans`, { index, limit });
	}

	get_playlist_tracks(album_id, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || -1;
		return this.call(`playlist/${album_id}/tracks`, { index, limit });
	}

	get_playlist_radio(album_id, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 100;
		return this.call(`playlist/${album_id}/radio`, { index, limit });
	}

	get_radios(options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 10;
		return this.call("radio", { index, limit });
	}

	get_radios_genres(options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 25;
		return this.call("radio/genres", { index, limit });
	}

	get_radios_top(options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 50;
		return this.call("radio/top", { index, limit });
	}

	get_radios_lists(options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 25;
		return this.call("radio/lists", { index, limit });
	}

	get_radio(radio_id) {
		return this.call(`radio/${radio_id}`);
	}

	get_radio_tracks(radio_id, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 40;
		return this.call(`radio/${radio_id}/tracks`, { index, limit });
	}

	_generate_search_advanced_query(filters) {
		let query = "";
		if (filters.artist) query += `artist:"${filters.artist}" `;
		if (filters.album) query += `album:"${filters.album}" `;
		if (filters.track) query += `track:"${filters.track}" `;
		if (filters.label) query += `label:"${filters.label}" `;
		if (filters.dur_min) query += `dur_min:"${filters.dur_min}" `;
		if (filters.dur_max) query += `dur_max:"${filters.dur_max}" `;
		if (filters.bpm_min) query += `bpm_min:"${filters.bpm_min}" `;
		if (filters.bpm_max) query += `bpm_max:"${filters.bpm_max}" `;
		return query.trim();
	}

	_generate_search_args(query, options: APIOptions = {}) {
		const strict = options.strict || false;
		const order = options.order || SearchOrder.RANKING;
		const index = options.index || 0;
		const limit = options.limit || 25;
		const args: APIArgs = { q: query, index, limit };
		if (strict) args.strict = "on";
		if (order) args.order = order;
		return args;
	}

	// -----===== Search =====-----

	search(query, options: APIOptions = {}) {
		const args = this._generate_search_args(query, options);
		return this.call("search", args);
	}

	advanced_search(filters, options: APIOptions = {}) {
		const query = this._generate_search_advanced_query(filters);
		return this.search(query, options);
	}

	search_album(query, options: APIOptions = {}) {
		const args = this._generate_search_args(query, options);
		return this.call("search/album", args);
	}

	search_artist(query, options: APIOptions = {}) {
		const args = this._generate_search_args(query, options);
		return this.call("search/artist", args);
	}

	search_playlist(query, options: APIOptions = {}) {
		const args = this._generate_search_args(query, options);
		return this.call("search/playlist", args);
	}

	search_radio(query, options: APIOptions = {}) {
		const args = this._generate_search_args(query, options);
		return this.call("search/radio", args);
	}

	search_track(query, options: APIOptions = {}) {
		const args = this._generate_search_args(query, options);
		return this.call("search/track", args);
	}

	search_user(query, options: APIOptions = {}) {
		const args = this._generate_search_args(query, options);
		return this.call("search/user", args);
	}

	get_user(user_id) {
		return this.call(`user/${user_id}`);
	}

	get_user_albums(user_id, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 25;
		return this.call(`user/${user_id}/albums`, { index, limit });
	}

	get_user_artists(user_id, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 25;
		return this.call(`user/${user_id}/artists`, { index, limit });
	}

	get_user_flow(user_id, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 25;
		return this.call(`user/${user_id}/flow`, { index, limit });
	}

	get_user_following(user_id, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 25;
		return this.call(`user/${user_id}/followings`, { index, limit });
	}

	get_user_followers(user_id, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 25;
		return this.call(`user/${user_id}/followers`, { index, limit });
	}

	get_user_playlists(user_id, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 25;
		return this.call(`user/${user_id}/playlists`, { index, limit });
	}

	get_user_radios(user_id, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 25;
		return this.call(`user/${user_id}/radios`, { index, limit });
	}

	get_user_tracks(user_id, options: APIOptions = {}) {
		const index = options.index || 0;
		const limit = options.limit || 25;
		return this.call(`user/${user_id}/tracks`, { index, limit });
	}

	// Extra calls

	async get_countries_charts() {
		const temp: any = await this.get_user_playlists("637006841", {
			index: 0,
			limit: -1,
		});
		const result = temp.data.sort((a, b) => a.title.localeCompare(b.title)); // Sort all playlists
		if (!result[0].title.startsWith("Top")) result.shift(); // Remove loved tracks playlist
		return result;
	}

	async get_track_id_from_metadata(artist, track, album) {
		artist = artist.replace("–", "-").replace("’", "'");
		track = track.replace("–", "-").replace("’", "'");
		album = album.replace("–", "-").replace("’", "'");

		let resp: any = await this.advanced_search({ artist, track, album });
		if (resp.data.length) return resp.data[0].id;

		resp = await this.advanced_search({ artist, track });
		if (resp.data.length) return resp.data[0].id;

		// Try removing version
		if (
			track.indexOf("(") !== -1 &&
			track.indexOf(")") !== -1 &&
			track.indexOf("(") < track.indexOf(")")
		) {
			resp = await this.advanced_search({ artist, track: track.split("(")[0] });
			if (resp.data.length) return resp.data[0].id;
		} else if (track.indexOf(" - ") !== -1) {
			resp = await this.advanced_search({
				artist,
				track: track.split(" - ")[0],
			});
			if (resp.data.length) return resp.data[0].id;
		}

		return "0";
	}
}
