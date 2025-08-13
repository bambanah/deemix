import { type ApiHandler } from "../../../types.js";

const path: ApiHandler["path"] = "/getSettings";

const handler: ApiHandler["handler"] = (req, res) => {
	const deemix = req.app.get("deemix");
	res.send(deemix.getSettings());
};

const apiHandler: ApiHandler = { path, handler };

export default apiHandler;
