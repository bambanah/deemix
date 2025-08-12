import { Deezer } from "deezer-sdk";
import { sessionDZ } from "../../../deemixApp.js";
import { type ApiHandler } from "../../../types.js";

const path: ApiHandler["path"] = "/getUserPlaylists";

const handler: ApiHandler["handler"] = async (req, res) => {
	if (!sessionDZ[req.session.id]) sessionDZ[req.session.id] = new Deezer();
	const dz = sessionDZ[req.session.id];
	let data;

	if (dz.loggedIn) {
		const userID = dz.currentUser.id;
		data = await dz.gw.get_user_playlists(userID, { limit: -1 });
	} else {
		data = { error: "notLoggedIn" };
	}
	res.send(data);
};

const apiHandler: ApiHandler = { path, handler };

export default apiHandler;
