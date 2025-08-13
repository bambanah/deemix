import { z } from "zod";
import { artistSchema, contributorSchema } from "./contributor-schema.js";
import { albumTrackSchema } from "./track-schema.js";

export const trackAlbumSchema = z.object({
	id: z.number(),
	title: z.string(),
	link: z.string(),
	cover: z.string(),
	cover_small: z.string(),
	cover_medium: z.string(),
	cover_big: z.string(),
	cover_xl: z.string(),
	md5_image: z.string(),
	release_date: z.string().optional(),
	tracklist: z.string(),
	type: z.literal("album"),
});

export type TrackAlbum = z.infer<typeof trackAlbumSchema>;

export const albumSchema = trackAlbumSchema.extend({
	upc: z.string(),
	genre_id: z.number(),
	genres: z.object({ data: z.array(z.string()) }),
	label: z.string(),
	nb_tracks: z.number(),
	duration: z.number(),
	fans: z.number(),
	record_type: z.string(),
	available: z.boolean(),
	explicit_lyrics: z.boolean(),
	explicit_content_lyrics: z.number(),
	explicit_content_cover: z.number(),
	contributors: z.array(z.lazy(() => contributorSchema)),
	artist: artistSchema,
	tracks: z.object({ data: z.array(z.lazy(() => albumTrackSchema)) }),
});

export type DeezerAlbum = z.infer<typeof albumSchema>;
