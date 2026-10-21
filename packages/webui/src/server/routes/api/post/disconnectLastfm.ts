import { logger } from "@/helpers/logger.js";
import { disconnectLastfm } from "@/helpers/lastfm.js";
import { type ApiHandler } from "../../../types.js";

const path: ApiHandler["path"] = "/disconnectLastfm";

const handler: ApiHandler["handler"] = async (_req, res) => {
	try {
		await disconnectLastfm();
		res.send({ connected: false });
	} catch (error) {
		logger.error(error);
		res.status(500).send({ error: "Unable to disconnect Last.fm." });
	}
};

const apiHandler: ApiHandler = { path, handler };

export default apiHandler;
