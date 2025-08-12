import { z } from "zod";

export const playlistSchema = z.object({
	id: z.string(),
});
