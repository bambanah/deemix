import { z } from "zod";
import { artistSchema, contributorSchema } from "./contributor-schema.js";
import { trackAlbumSchema } from "./album-schema.js";

export const baseTrackSchema = z.object({
	id: z.number(),
	readable: z.boolean(),
	title: z.string(),
	title_short: z.string(),
	title_version: z.string(),
	link: z.string(),
	duration: z.number(),
	rank: z.number(),
	explicit_lyrics: z.boolean(),
	explicit_content_lyrics: z.number(),
	explicit_content_cover: z.number(),
	preview: z.string(),
	md5_image: z.string(),
	size: z.number().optional(),
	lyrics_id: z.string().optional(),
	lyrics: z.string().optional(),
	position: z.number().optional(),
	copyright: z.string().optional(),
	physical_release_date: z.string().optional(),
	genres: z.array(z.string()).optional(),
	type: z.literal("track"),
});

export const albumTrackSchema = baseTrackSchema.extend({
	artist: z.object({
		id: z.number(),
		name: z.string(),
		tracklist: z.string(),
		type: z.literal("artist"),
	}),
	album: z.object({
		id: z.number(),
		title: z.string(),
		cover: z.string(),
		cover_small: z.string(),
		cover_medium: z.string(),
		cover_big: z.string(),
		cover_xl: z.string(),
		tracklist: z.string(),
		type: z.literal("album"),
	}),
});

export const trackSchema = baseTrackSchema.extend({
	isrc: z.string(),
	share: z.string(),
	track_position: z.number(),
	disk_number: z.number(),
	release_date: z.string(),
	bpm: z.number(),
	gain: z.number(),
	md5_origin: z.number().optional(),
	available_countries: z.array(z.string()),
	alternative: z.lazy(() => trackSchema).optional(),
	contributors: z.array(z.lazy(() => contributorSchema)).optional(),
	track_token: z.string(),
	artist: artistSchema,
	album: z.lazy(() => trackAlbumSchema),
});

export type DeezerTrack = z.infer<typeof trackSchema>;
