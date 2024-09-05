import { type ApiHandler } from "../../../types.js";

const path = "/cancelAllDownloads";

const handler: ApiHandler["handler"] = (req, res) => {
	const deemix = req.app.get("deemix");
	deemix.cancelAllDownloads();
	res.send({ result: true });
};

const apiHandler = { path, handler };

export default apiHandler;
