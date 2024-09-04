import { Deezer } from "deezer-js";
import { sessionDZ } from "../../../deemixApp";
import { resetLoginCredentials } from "../../../helpers/loginStorage";
import { ApiHandler } from "../../../types";

const path: ApiHandler["path"] = "/logout";

const handler: ApiHandler["handler"] = (req, res) => {
	sessionDZ[req.session.id] = new Deezer();
	res.send({ logged_out: true });
	if (req.app.get("isSingleUser")) resetLoginCredentials();
};

const apiHandler: ApiHandler = { path, handler };

export default apiHandler;
