import { sessionDZ } from "../../../deemixApp.js";
import {
	getStreamSource,
	parseStreamQuality,
	streamCacheKey,
} from "@/helpers/deezerStream.js";
import { logger } from "@/helpers/logger.js";
import { type ApiHandler } from "../../../types.js";

const path: ApiHandler["path"] = "/streamTrackInfo";

// Tells the player which format /streamTrack serves, the <audio> element can't read headers
const handler: ApiHandler["handler"] = async (req, res) => {
	const trackId = req.query.id;
	if (typeof trackId !== "string" || !/^-?\d+$/.test(trackId)) {
		res.status(400).send({ error: "A valid track id is required." });
		return;
	}

	const dz = sessionDZ[req.session.id];
	if (!dz?.loggedIn) {
		res.status(401).send({ error: "notLoggedIn" });
		return;
	}

	try {
		const quality = parseStreamQuality(req.query.quality);
		const source = await getStreamSource(
			dz,
			streamCacheKey(req.session.id, trackId, quality),
			trackId,
			quality
		);
		if (!source) {
			res.status(404).send({ error: "notAvailable" });
			return;
		}
		res.send({ format: source.format, mimeType: source.mimeType });
	} catch (error) {
		logger.error(error);
		res.status(502).send({ error: "Unable to get this track from Deezer." });
	}
};

const apiHandler: ApiHandler = { path, handler };

export default apiHandler;
