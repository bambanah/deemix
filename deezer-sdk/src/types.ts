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
