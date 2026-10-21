import { logger } from "@/helpers/logger.js";
import { listPlayerTracks } from "@/helpers/playerLibrary.js";
import { type ApiHandler } from "../../../types.js";

const path: ApiHandler["path"] = "/getPlayerLibrary";

const handler: ApiHandler["handler"] = async (req, res) => {
	const deemix = req.app.get("deemix");
	const downloadDirectory = deemix.getSettings().settings.downloadLocation;

	try {
		res.send({ tracks: await listPlayerTracks(downloadDirectory) });
	} catch (error) {
		logger.error(error);
		res
			.status(500)
			.send({ error: "Unable to read the configured download folder." });
	}
};

const apiHandler: ApiHandler = { path, handler };

export default apiHandler;
