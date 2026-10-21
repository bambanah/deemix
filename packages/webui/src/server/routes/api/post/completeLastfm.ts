import { logger } from "@/helpers/logger.js";
import { connectLastfm } from "@/helpers/lastfm.js";
import { type ApiHandler } from "../../../types.js";
import { takePendingLastfmToken } from "./connectLastfm.js";

const path: ApiHandler["path"] = "/completeLastfm";

const handler: ApiHandler["handler"] = async (req, res) => {
	const token = takePendingLastfmToken(req.session.id);
	if (!token) {
		res
			.status(400)
			.send({ error: "Start Last.fm authorization before completing it." });
		return;
	}

	try {
		res.send(await connectLastfm(token));
	} catch (error) {
		logger.error(error);
		res
			.status(502)
			.send({ error: "Last.fm authorization could not be completed." });
	}
};

const apiHandler: ApiHandler = { path, handler };

export default apiHandler;
