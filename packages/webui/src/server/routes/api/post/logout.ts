import { Deezer } from "deezer-sdk";
import { sessionDZ } from "../../../deemixApp.js";
import { resetLoginCredentials } from "../../../helpers/loginStorage.js";
import type { ApiHandler } from "../../../types.js";

const path: ApiHandler["path"] = "/logout";

const handler: ApiHandler["handler"] = (req, res) => {
	sessionDZ[req.session.id] = new Deezer();
	res.send({ logged_out: true });
	if (req.app.get("isSingleUser")) resetLoginCredentials();
};

const apiHandler: ApiHandler = { path, handler };

export default apiHandler;
