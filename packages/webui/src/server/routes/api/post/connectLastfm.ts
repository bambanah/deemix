import { logger } from "@/helpers/logger.js";
import { getLastfmAuthorizationUrl } from "@/helpers/lastfm.js";
import { type ApiHandler } from "../../../types.js";

const pendingTokens = new Map<string, string>();
const path: ApiHandler["path"] = "/connectLastfm";

const handler: ApiHandler["handler"] = async (req, res) => {
	try {
		const authorization = await getLastfmAuthorizationUrl();
		pendingTokens.set(req.session.id, authorization.token);
		res.send({ url: authorization.url });
	} catch (error) {
		logger.error(error);
		res.status(503).send({
			error:
				"Unable to start Last.fm authorization. Check the API credentials.",
		});
	}
};

export function takePendingLastfmToken(sessionId: string) {
	const token = pendingTokens.get(sessionId);
	pendingTokens.delete(sessionId);
	return token;
}

const apiHandler: ApiHandler = { path, handler };

export default apiHandler;
