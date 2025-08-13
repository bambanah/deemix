import { Deezer } from "deezer-sdk";
import { sessionDZ } from "@/deemixApp.js";
import { logger } from "@/helpers/logger.js";
import { getLoginCredentials } from "@/helpers/loginStorage.js";
import { type ApiHandler } from "@/types.js";
import {
	DEEMIX_PACKAGE_VERSION,
	GUI_VERSION,
	WEBUI_PACKAGE_VERSION,
} from "@/helpers/versions.js";

const path: ApiHandler["path"] = "/connect";
let update: {
	webuiVersion: string;
	deemixVersion: string;
	guiVersion?: string;
} | null = null;

const handler: ApiHandler["handler"] = async (req, res) => {
	if (!sessionDZ[req.session.id]) sessionDZ[req.session.id] = new Deezer();
	const dz = sessionDZ[req.session.id];
	const deemix = req.app.get("deemix");
	const isSingleUser = req.app.get("isSingleUser");

	if (!update) {
		logger.info(`webui version ${WEBUI_PACKAGE_VERSION}`);
		logger.info(`deemix version ${DEEMIX_PACKAGE_VERSION}`);
		if (GUI_VERSION) logger.info(`gui version ${GUI_VERSION}`);

		update = {
			webuiVersion: WEBUI_PACKAGE_VERSION,
			guiVersion: GUI_VERSION,
			deemixVersion: DEEMIX_PACKAGE_VERSION,
		};
	}

	const result = <any>{
		update,
		autologin: !dz.loggedIn,
		currentUser: dz.currentUser,
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
