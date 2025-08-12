import got from "got";
import { CookieJar } from "tough-cookie";
import { USER_AGENT_HEADER } from "./index.js";
import { _md5 } from "./crypto.js";

const CLIENT_ID = "172365";
const CLIENT_SECRET = "fb0bec7ccc063dab0417eb7b0d847f34";

export async function getDeezerAccessTokenFromEmailPassword(email, password) {
	let accessToken = null;
	password = _md5(password, "utf8");
	const hash = _md5(
		[CLIENT_ID, email, password, CLIENT_SECRET].join(""),
		"utf8"
	);
	try {
		const response = got.get("https://api.deezer.com/auth/token", {
			searchParams: {
				app_id: CLIENT_ID,
				login: email,
				password,
				hash,
			},
			https: { rejectUnauthorized: false },
			headers: { "User-Agent": USER_AGENT_HEADER },
		});
		const responseData = (await response.json()) as { access_token?: string };

		accessToken = responseData.access_token ?? null;
	} catch {
		/* empty */
	}
	return accessToken;
}

export async function getDeezerArlFromAccessToken(accessToken) {
	if (!accessToken) return null;
	let arl = null;
	const cookieJar = new CookieJar();
	try {
		await got.get("https://api.deezer.com/platform/generic/track/3135556", {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"User-Agent": USER_AGENT_HEADER,
			},
			https: { rejectUnauthorized: false },
			cookieJar,
		});
		const response = got.get(
			"https://www.deezer.com/ajax/gw-light.php?method=user.getArl&input=3&api_version=1.0&api_token=null",
			{
				headers: { "User-Agent": USER_AGENT_HEADER },
				https: { rejectUnauthorized: false },
				cookieJar,
			}
		);
		const responseData = (await response.json()) as { results?: string };

		arl = responseData.results ?? null;
	} catch {
		/* empty */
	}
	return arl;
}
