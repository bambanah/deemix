import { logger } from "@/helpers/logger.js";
import { resolvePlayerTrack } from "@/helpers/playerLibrary.js";
import { type ApiHandler } from "../../../types.js";

const path: ApiHandler["path"] = "/getPlayerTrack";

const handler: ApiHandler["handler"] = async (req, res) => {
	const trackPath = req.query.path;
	if (typeof trackPath !== "string" || trackPath.length === 0) {
		res.status(400).send({ error: "A track path is required." });
		return;
	}

	const deemix = req.app.get("deemix");
	const downloadDirectory = deemix.getSettings().settings.downloadLocation;

	try {
		const filePath = await resolvePlayerTrack(downloadDirectory, trackPath);
		if (!filePath) {
			res
				.status(404)
				.send({ error: "Track not found in the download folder." });
			return;
		}

		res.sendFile(filePath, (error) => {
			if (!error) return;
			logger.error(error);
			if (!res.headersSent) {
				res.status(500).send({ error: "Unable to play this track." });
			}
		});
	} catch (error) {
		logger.error(error);
		res
			.status(500)
			.send({ error: "Unable to read the configured download folder." });
	}
};

const apiHandler: ApiHandler = { path, handler };

export default apiHandler;
