import { Deezer } from "deezer-js";
import { sessionDZ } from "@/deemixApp";
import { logger } from "@/helpers/logger";
import { getLoginCredentials } from "@/helpers/loginStorage";
import { ApiHandler } from "@/types";
import {
	DEEMIX_PACKAGE_VERSION,
	WEBUI_PACKAGE_VERSION,
} from "@/helpers/versions";

const path: ApiHandler["path"] = "/connect";
let update: any = null;

const handler: ApiHandler["handler"] = async (req, res) => {
	if (!sessionDZ[req.session.id]) sessionDZ[req.session.id] = new Deezer();
	const dz = sessionDZ[req.session.id];
	const deemix = req.app.get("deemix");
	const isSingleUser = req.app.get("isSingleUser");

	if (!update) {
		logger.info(
			`Currently running deemix-webui version ${WEBUI_PACKAGE_VERSION}`
		);
		logger.info(`deemix-lib version ${DEEMIX_PACKAGE_VERSION}`);
		update = {
			currentCommit: WEBUI_PACKAGE_VERSION,
			deemixVersion: DEEMIX_PACKAGE_VERSION,
		};
	}

	const result: any = {
		update,
		autologin: !dz.logged_in,
		currentUser: dz.current_user,
		deezerAvailable: await deemix.isDeezerAvailable(),
		spotifyEnabled: deemix.plugins.spotify.enabled,
		settingsData: deemix.getSettings(),
	};

	if (isSingleUser && result.autologin)
		result.singleUser = getLoginCredentials();

	if (result.settingsData.settings.autoCheckForUpdates)
		result.checkForUpdates = true;

	const queue = deemix.getQueue();

	if (Object.keys(queue.queue).length > 0) {
		result.queue = queue;
	}

	res.send(result);
};

const apiHandler: ApiHandler = { path, handler };

export default apiHandler;
