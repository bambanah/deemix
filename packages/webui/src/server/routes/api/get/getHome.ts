import { Deezer } from "deezer-sdk";
import { sessionDZ } from "../../../deemixApp.js";
import { type ApiHandler } from "../../../types.js";

const path: ApiHandler["path"] = "/getHome";

let homeCache: any;

const handler: ApiHandler["handler"] = async (req, res) => {
	if (!sessionDZ[req.session.id]) sessionDZ[req.session.id] = new Deezer();
	const dz = sessionDZ[req.session.id];

	if (!homeCache) {
		homeCache = await dz.api.get_chart(0, { limit: 30 });
	}
	res.send(homeCache);
};

const apiHandler: ApiHandler = { path, handler };

export default apiHandler;
