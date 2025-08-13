import { z } from "zod";

export const artistSchema = z.object({
	id: z.number(),
	name: z.string(),
	link: z.string().optional(),
	share: z.string().optional(),
	picture: z.string(),
	picture_small: z.string().optional(),
	picture_medium: z.string().optional(),
	picture_big: z.string().optional(),
	picture_xl: z.string().optional(),
	tracklist: z.string().optional(),
	md5_image: z.string().optional(),
	type: z.literal("artist"),
});

export type Artist = z.infer<typeof artistSchema>;

export const contributorSchema = artistSchema.extend({
	role: z.string(),
});

export type Contributor = z.infer<typeof contributorSchema>;
