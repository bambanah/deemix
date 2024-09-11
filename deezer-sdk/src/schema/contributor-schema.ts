import { z } from "zod";

export const artistSchema = z.object({
	id: z.number(),
	name: z.string(),
	link: z.string().optional(),
	share: z.string().optional(),
	picture: z.string(),
	picture_small: z.string(),
	picture_medium: z.string(),
	picture_big: z.string(),
	picture_xl: z.string(),
	type: z.literal("artist"),
});

export type Artist = z.infer<typeof artistSchema>;

export const contributorSchema = artistSchema.extend({
	role: z.string(),
});

export type Contributor = z.infer<typeof contributorSchema>;
