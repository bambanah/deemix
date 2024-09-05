import { Deezer } from "deezer-js";
import { sessionDZ } from "@/deemixApp";
import { type ApiHandler } from "@/types";

const path: ApiHandler["path"] = "/getUserAlbums";

const handler: ApiHandler["handler"] = async (req, res) => {
	if (!sessionDZ[req.session.id]) sessionDZ[req.session.id] = new Deezer();
	const dz = sessionDZ[req.session.id];
	let data;

	if (dz.logged_in) {
		const userID = dz.current_user.id;
		data = await dz.gw.get_user_albums(userID, { limit: -1 });
	} else {
		data = { error: "notLoggedIn" };
	}
	res.send(data);
};

const apiHandler: ApiHandler = { path, handler };

export default apiHandler;
