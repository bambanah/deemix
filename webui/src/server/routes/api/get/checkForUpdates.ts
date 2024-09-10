import { type ApiHandler } from "@/types.js";

const path: ApiHandler["path"] = "/checkForUpdates";

const handler: ApiHandler["handler"] = async (req, res) => {
	const deemix = req.app.get("deemix");
	const latestVersion = await deemix.getLatestVersion();

	res.send({
		latestVersion,
		updateAvailable: deemix.isUpdateAvailable(),
	});
};

const apiHandler: ApiHandler = { path, handler };

export default apiHandler;
