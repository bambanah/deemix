import { logger } from "@/helpers/logger.js";
import { scrobbleLastfmTrack } from "@/helpers/lastfm.js";
import { type ApiHandler } from "../../../types.js";

const path: ApiHandler["path"] = "/lastfmScrobble";

const handler: ApiHandler["handler"] = async (req, res) => {
	const { artist, title, timestamp, duration } = req.body;
	const album = typeof req.body.album === "string" ? req.body.album : undefined;
	const albumArtist =
		typeof req.body.albumArtist === "string" ? req.body.albumArtist : undefined;
	if (
		typeof artist !== "string" ||
		!artist ||
		typeof title !== "string" ||
		!title ||
		!Number.isInteger(timestamp)
	) {
		res
			.status(400)
			.send({ error: "Artist, track title and timestamp are required." });
		return;
	}

	try {
		const result = await scrobbleLastfmTrack({
			artist,
			title,
			timestamp,
			album,
			albumArtist,
			duration,
		});
		if (result.accepted) {
			logger.info(`Last.fm scrobble successful: ${artist} - ${title}`);
		} else {
			logger.warn(
				`Last.fm ignored scrobble: ${artist} - ${title} (${result.ignoredReason})`
			);
		}
		res.send({
			scrobbled: result.accepted,
			ignoredReason: result.ignoredReason,
		});
	} catch (error) {
		logger.error(
			`Last.fm scrobble failed: ${artist} - ${title}: ${(error as Error).message}`
		);
		res
			.status(502)
			.send({ error: "Unable to scrobble this track to Last.fm." });
	}
};

const apiHandler: ApiHandler = { path, handler };

export default apiHandler;
