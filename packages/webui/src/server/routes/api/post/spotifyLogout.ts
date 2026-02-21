import { type ApiHandler } from "../../../types.js";

const path: ApiHandler["path"] = "/spotifyLogout";

const handler: ApiHandler["handler"] = (req, res) => {
	const deemix = req.app.get("deemix");
	const spotify = deemix.plugins.spotify;

	spotify.logoutOAuth();
	res.json({ success: true, spotifyEnabled: spotify.enabled, oauthAuthenticated: false });
};

const apiHandler: ApiHandler = { path, handler };

export default apiHandler;