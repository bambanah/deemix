import { logger } from "@/helpers/logger.js";
import { getLastfmStatus } from "@/helpers/lastfm.js";
import { type ApiHandler } from "../../../types.js";

const path: ApiHandler["path"] = "/getLastfmStatus";

const handler: ApiHandler["handler"] = async (_req, res) => {
	try {
		res.send(await getLastfmStatus());
	} catch (error) {
		logger.error(error);
		res
			.status(500)
			.send({ error: "Unable to read Last.fm connection status." });
	}
};

const apiHandler: ApiHandler = { path, handler };

export default apiHandler;
