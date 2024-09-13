import { API } from "./api.js";
import { DeezerError, WrongGeolocation, WrongLicense } from "./errors.js";
import { GW } from "./gw.js";
import got from "got";
import { Cookie, CookieJar } from "tough-cookie";
import type { User } from "./types.js";

export class Deezer {
	loggedIn: boolean;
	httpHeaders: { "User-Agent": string };
	cookieJar: CookieJar;
	currentUser?: User;
	childs: User[];
	selectedAccount: number;
	api: API;
	gw: GW;

	constructor() {
		this.httpHeaders = {
			"User-Agent":
				"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
		};
		this.cookieJar = new CookieJar();

		this.loggedIn = false;
		this.currentUser = {};
		this.childs = [];
		this.selectedAccount = 0;

		this.api = new API(this.cookieJar, this.httpHeaders);
		this.gw = new GW(this.cookieJar, this.httpHeaders);
	}

	async login(
		email: string,
		password: string,
		reCaptchaToken: string,
		child: string | number = 0
	) {
		if (child && typeof child === "string") child = parseInt(child);

		// Check if user already logged in
		let userData = await this.gw.get_user_data();
		if (!userData || (userData && Object.keys(userData).length === 0)) {
			return (this.loggedIn = false);
		}

		if (userData.USER.USER_ID === 0) return (this.loggedIn = false);

		const login = await got
			.post("https://www.deezer.com/ajax/action.php", {
				headers: this.httpHeaders,
				cookieJar: this.cookieJar,
				https: {
					rejectUnauthorized: false,
				},
				form: {
					type: "login",
					mail: email,
					password,
					checkFormLogin: userData.checkFormLogin,
					reCaptchaToken,
				},
			})
			.text();

		// Check if user logged in
		if (login.indexOf("success") === -1) {
			this.loggedIn = false;
			return false;
		}
		userData = await this.gw.get_user_data();
		await this._postLogin(userData);
		this.changeAccount(child);
		this.loggedIn = true;
		return true;
	}

	async loginViaArl(arl: string, child: string | number = 0) {
		if (child && typeof child === "string") child = parseInt(child);

		// Create cookie
		const cookie_obj = new Cookie({
			key: "arl",
			value: arl.trim(),
			domain: ".deezer.com",
			path: "/",
			httpOnly: true,
		});
		await this.cookieJar.setCookie(
			cookie_obj.toString(),
			"https://www.deezer.com"
		);

		const userData = await this.gw.get_user_data();
		// Check if user logged in
		if (!userData || (userData && Object.keys(userData).length === 0))
			return (this.loggedIn = false);
		if (userData.USER.USER_ID === 0) return (this.loggedIn = false);

		await this._postLogin(userData);
		this.changeAccount(child);
		this.loggedIn = true;
		return true;
	}

	async _postLogin(userData) {
		this.childs = [];
		const family =
			userData.USER.MULTI_ACCOUNT.ENABLED &&
			!userData.USER.MULTI_ACCOUNT.IS_SUB_ACCOUNT;
		if (family) {
			const childs = await this.gw.get_child_accounts();
			childs.forEach((child) => {
				if (child.EXTRA_FAMILY.IS_LOGGABLE_AS) {
					this.childs.push({
						id: child.USER_ID,
						name: child.BLOG_NAME,
						picture: child.USER_PICTURE || "",
						license_token: userData.USER.OPTIONS.license_token,
						can_stream_hq:
							userData.USER.OPTIONS.web_hq || userData.USER.OPTIONS.mobile_hq,
						can_stream_lossless:
							userData.USER.OPTIONS.web_lossless ||
							userData.USER.OPTIONS.mobile_lossless,
						country: userData.USER.OPTIONS.license_country,
						language: userData.USER.SETTING.global.language || "",
						loved_tracks: child.LOVEDTRACKS_ID,
					});
				}
			});
		} else {
			this.childs.push({
				id: userData.USER.USER_ID,
				name: userData.USER.BLOG_NAME,
				picture: userData.USER.USER_PICTURE || "",
				license_token: userData.USER.OPTIONS.license_token,
				can_stream_hq:
					userData.USER.OPTIONS.web_hq || userData.USER.OPTIONS.mobile_hq,
				can_stream_lossless:
					userData.USER.OPTIONS.web_lossless ||
					userData.USER.OPTIONS.mobile_lossless,
				country: userData.USER.OPTIONS.license_country,
				language: userData.USER.SETTING.global.language || "",
				loved_tracks: userData.USER.LOVEDTRACKS_ID,
			});
		}
	}

	changeAccount(child_n) {
		if (this.childs.length - 1 < child_n) child_n = 0;
		this.currentUser = this.childs[child_n];
		this.selectedAccount = child_n;
		let lang = this.currentUser?.language
			?.toString()
			.replace(/[^0-9A-Za-z *,-.;=]/g, "");
		if (lang?.slice(2, 1) === "-") {
			lang = lang.slice(0, 5);
		} else {
			lang = lang?.slice(0, 2);
		}
		this.httpHeaders["Accept-Language"] = lang;

		return [this.currentUser, this.selectedAccount];
	}

	async get_track_url(track_token, format) {
		const tracks = await this.get_tracks_url([track_token], format);
		if (tracks.length > 0) {
			if (tracks[0] instanceof DeezerError) throw tracks[0];
			else return tracks[0];
		}
		return null;
	}

	async get_tracks_url(track_tokens, format) {
		if (!Array.isArray(track_tokens)) track_tokens = [track_tokens];
		if (!this.currentUser?.license_token) return [];
		if (
			((format === "FLAC" || format.startsWith("MP4_RA")) &&
				!this.currentUser.can_stream_lossless) ||
			(format === "MP3_320" && !this.currentUser.can_stream_hq)
		)
			throw new WrongLicense(format);

		let response;
		const result: (DeezerError | null)[] = [];

		try {
			response = await got
				.post("https://media.deezer.com/v1/get_url", {
					headers: this.httpHeaders,
					cookieJar: this.cookieJar,
					https: {
						rejectUnauthorized: false,
					},
					json: {
						license_token: this.currentUser.license_token,
						media: [
							{
								type: "FULL",
								formats: [{ cipher: "BF_CBC_STRIPE", format }],
							},
						],
						track_tokens,
					},
				})
				.json();
		} catch {
			return [];
		}

		if (response.data.length) {
			response.data.forEach((data) => {
				if (data.errors) {
					if (data.errors[0].code === 2002) {
						result.push(new WrongGeolocation(this.currentUser?.country));
					} else {
						result.push(new DeezerError(JSON.stringify(response)));
					}
				}
				if (data.media) result.push(data.media[0].sources[0].url);
				else result.push(null);
			});
		}
		return result;
	}
}
