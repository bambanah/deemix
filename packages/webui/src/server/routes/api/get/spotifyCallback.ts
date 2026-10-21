import { type ApiHandler } from "../../../types.js";

const path: ApiHandler["path"] = "/spotifyCallback";

const handler: ApiHandler["handler"] = async (req, res) => {
	const deemix = req.app.get("deemix");
	const spotify = deemix.plugins.spotify;

	const { code, state, error } = req.query;

	if (error) {
		res.status(400).send(`<html><body><h2>Spotify Auth Error</h2><p>${error}</p><script>setTimeout(()=>window.close(),3000)</script></body></html>`);
		return;
	}

	if (!code || !state) {
		res.status(400).send(`<html><body><h2>Missing parameters</h2><script>setTimeout(()=>window.close(),3000)</script></body></html>`);
		return;
	}

	// Reconstruct the same redirect URI used during login
	const protocol = req.headers["x-forwarded-proto"] || req.protocol || "http";
	const host = req.headers["x-forwarded-host"] || req.headers.host;
	const redirectUri = `${protocol}://${host}/api/spotifyCallback`;

	try {
		await spotify.handleAuthCallback(code as string, redirectUri, state as string);
		// Redirect back to the app settings page with success indicator
		res.send(`<html><body><h2>Spotify Connected!</h2><p>You can close this window.</p><script>if(window.opener){window.opener.postMessage('spotifyOAuthSuccess','*');setTimeout(()=>window.close(),1500)}else{setTimeout(()=>{window.location.href='/'},1500)}</script></body></html>`);
	} catch (e) {
		res.status(500).send(`<html><body><h2>Auth Failed</h2><p>${e.message}</p><script>setTimeout(()=>window.close(),5000)</script></body></html>`);
	}
};

const apiHandler: ApiHandler = { path, handler };

export default apiHandler;