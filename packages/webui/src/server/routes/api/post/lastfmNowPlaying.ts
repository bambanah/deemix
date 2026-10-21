import { logger } from "@/helpers/logger.js";
import { updateLastfmNowPlaying } from "@/helpers/lastfm.js";
import { type ApiHandler } from "../../../types.js";

const path: ApiHandler["path"] = "/lastfmNowPlaying";

const handler: ApiHandler["handler"] = async (req, res) => {
	const { artist, title, duration } = req.body;
	const album = typeof req.body.album === "string" ? req.body.album : undefined;
	const albumArtist =
		typeof req.body.albumArtist === "string" ? req.body.albumArtist : undefined;
	if (
		typeof artist !== "string" ||
		!artist ||
		typeof title !== "string" ||
		!title
	) {
		res.status(400).send({ error: "Artist and track title are required." });
		return;
	}

	try {
		await updateLastfmNowPlaying({
			artist,
			title,
			album,
			albumArtist,
			duration,
		});
		logger.info(`Last.fm now playing: ${artist} - ${title}`);
		res.send({ updated: true });
	} catch (error) {
		logger.error(
			`Last.fm now playing failed: ${artist} - ${title}: ${(error as Error).message}`
		);
		res.status(502).send({ error: "Unable to update Last.fm now playing." });
	}
};

const apiHandler: ApiHandler = { path, handler };

export default apiHandler;
