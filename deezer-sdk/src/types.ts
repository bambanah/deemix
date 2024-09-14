// Number association for formats
export const TrackFormats = {
	FLAC: 9,
	MP3_320: 3,
	MP3_128: 1,
	MP4_RA3: 15,
	MP4_RA2: 14,
	MP4_RA1: 13,
	DEFAULT: 8,
	LOCAL: 0,
} as const;

export interface User {
	id?: number;
	name?: string;
	picture?: string;
	license_token?: string;
	can_stream_hq?: boolean;
	can_stream_lossless?: boolean;
	country?: string;
	language?: string;
	loved_tracks?: number;
}

export interface APIOptions {
	index?: number;
	limit?: number;
	start?: number;
	strict?: boolean;
	order?: string;
}

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
	release_date?: string; // Assuming the date is in string format (e.g., "YYYY-MM-DD")
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
	md5_origin?: number;
	filesizes?: Record<string, any>;
	media_version?: number;
	track_token_expire?: number;
	token: string;
	user_id: string;
	lyrics_id?: string;
	physical_release_date?: string;
	fallback_id?: number;
	digital_release_date?: string;
	genre_id?: number;
	copyright?: string;
	lyrics?: string;
	alternative_albums?: any;
	album?: EnrichedAPIAlbum;
	artist: EnrichedAPIArtist;
	contributors: EnrichedAPIContributor[];
	song_contributors: EnrichedAPIContributor[];
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
