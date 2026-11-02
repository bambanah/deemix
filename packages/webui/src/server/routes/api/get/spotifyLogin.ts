import { type ApiHandler } from "../../../types.js";

const path: ApiHandler["path"] = "/spotifyLogin";

const handler: ApiHandler["handler"] = (req, res) => {
	const deemix = req.app.get("deemix");
	const spotify = deemix.plugins.spotify;

	if (!spotify.enabled && !spotify.credentials.clientId) {
		res.status(400).json({ error: "Spotify credentials not configured" });
		return;
	}

	// Build redirect URI from the current request origin
	const protocol = req.headers["x-forwarded-proto"] || req.protocol || "http";
	const host = req.headers["x-forwarded-host"] || req.headers.host;
	const redirectUri = `${protocol}://${host}/api/spotifyCallback`;

	const authUrl = spotify.getAuthUrl(redirectUri);
	res.redirect(authUrl);
};

const apiHandler: ApiHandler = { path, handler };

export default apiHandler;