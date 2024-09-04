import got from "got";
import { CookieJar, Cookie } from "tough-cookie";
import { API } from "./api";
import { GW } from "./gw";
import { DeezerError, WrongLicense, WrongGeolocation } from "./errors";

// Number associtation for formats
const TrackFormats = {
	FLAC: 9,
	MP3_320: 3,
	MP3_128: 1,
	MP4_RA3: 15,
	MP4_RA2: 14,
	MP4_RA1: 13,
	DEFAULT: 8,
	LOCAL: 0,
} as const;

interface User {
	id?: number;
	name?: string;
	picture?: string;
	license_token?: string;
	can_stream_hq?: boolean;
	can_stream_lossless?: boolean;
	country?: string;
	language?: string;
	loved_tracks?: number;
}

export interface APIOptions {
	index?: number;
	limit?: number;
	start?: number;
	strict?: boolean;
	order?: string;
}

class Deezer {
	logged_in: boolean;
	http_headers: { "User-Agent": string };
	cookie_jar: CookieJar;
	current_user: User;
	childs: User[];
	selected_account: number;
	api: API;
	gw: GW;

	constructor() {
		this.http_headers = {
			"User-Agent":
				"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
		};
		this.cookie_jar = new CookieJar();

		this.logged_in = false;
		this.current_user = {};
		this.childs = [];
		this.selected_account = 0;

		this.api = new API(this.cookie_jar, this.http_headers);
		this.gw = new GW(this.cookie_jar, this.http_headers);
	}

	async login(
		email: string,
		password: string,
		reCaptchaToken: string,
		child: string | number = 0
	) {
		if (child && typeof child === "string") child = parseInt(child);

		// Check if user already logged in
		let user_data = await this.gw.get_user_data();
		if (!user_data || (user_data && Object.keys(user_data).length === 0)) {
			return (this.logged_in = false);
		}

		if (user_data.USER.USER_ID === 0) return (this.logged_in = false);

		const login = await got
			.post("https://www.deezer.com/ajax/action.php", {
				headers: this.http_headers,
				cookieJar: this.cookie_jar,
				https: {
					rejectUnauthorized: false,
				},
				form: {
					type: "login",
					mail: email,
					password,
					checkFormLogin: user_data.checkFormLogin,
					reCaptchaToken,
				},
			})
			.text();

		// Check if user logged in
		if (login.indexOf("success") === -1) {
			this.logged_in = false;
			return false;
		}
		user_data = await this.gw.get_user_data();
		await this._post_login(user_data);
		this.change_account(child);
		this.logged_in = true;
		return true;
	}

	async login_via_arl(arl: string, child: string | number = 0) {
		if (child && typeof child === "string") child = parseInt(child);

		// Create cookie
		const cookie_obj = new Cookie({
			key: "arl",
			value: arl.trim(),
			domain: ".deezer.com",
			path: "/",
			httpOnly: true,
		});
		await this.cookie_jar.setCookie(
			cookie_obj.toString(),
			"https://www.deezer.com"
		);

		const user_data = await this.gw.get_user_data();
		// Check if user logged in
		if (!user_data || (user_data && Object.keys(user_data).length === 0))
			return (this.logged_in = false);
		if (user_data.USER.USER_ID === 0) return (this.logged_in = false);

		await this._post_login(user_data);
		this.change_account(child);
		this.logged_in = true;
		return true;
	}

	async _post_login(user_data) {
		this.childs = [];
		const family =
			user_data.USER.MULTI_ACCOUNT.ENABLED &&
			!user_data.USER.MULTI_ACCOUNT.IS_SUB_ACCOUNT;
		if (family) {
			const childs = await this.gw.get_child_accounts();
			childs.forEach((child) => {
				if (child.EXTRA_FAMILY.IS_LOGGABLE_AS) {
					this.childs.push({
						id: child.USER_ID,
						name: child.BLOG_NAME,
						picture: child.USER_PICTURE || "",
						license_token: user_data.USER.OPTIONS.license_token,
						can_stream_hq:
							user_data.USER.OPTIONS.web_hq || user_data.USER.OPTIONS.mobile_hq,
						can_stream_lossless:
							user_data.USER.OPTIONS.web_lossless ||
							user_data.USER.OPTIONS.mobile_lossless,
						country: user_data.USER.OPTIONS.license_country,
						language: user_data.USER.SETTING.global.language || "",
						loved_tracks: child.LOVEDTRACKS_ID,
					});
				}
			});
		} else {
			this.childs.push({
				id: user_data.USER.USER_ID,
				name: user_data.USER.BLOG_NAME,
				picture: user_data.USER.USER_PICTURE || "",
				license_token: user_data.USER.OPTIONS.license_token,
				can_stream_hq:
					user_data.USER.OPTIONS.web_hq || user_data.USER.OPTIONS.mobile_hq,
				can_stream_lossless:
					user_data.USER.OPTIONS.web_lossless ||
					user_data.USER.OPTIONS.mobile_lossless,
				country: user_data.USER.OPTIONS.license_country,
				language: user_data.USER.SETTING.global.language || "",
				loved_tracks: user_data.USER.LOVEDTRACKS_ID,
			});
		}
	}

	change_account(child_n) {
		if (this.childs.length - 1 < child_n) child_n = 0;
		this.current_user = this.childs[child_n];
		this.selected_account = child_n;
		let lang = this.current_user.language
			?.toString()
			.replace(/[^0-9A-Za-z *,-.;=]/g, "");
		if (lang?.slice(2, 1) === "-") {
			lang = lang.slice(0, 5);
		} else {
			lang = lang?.slice(0, 2);
		}
		this.http_headers["Accept-Language"] = lang;

		return [this.current_user, this.selected_account];
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
		if (!this.current_user.license_token) return [];
		if (
			((format === "FLAC" || format.startsWith("MP4_RA")) &&
				!this.current_user.can_stream_lossless) ||
			(format === "MP3_320" && !this.current_user.can_stream_hq)
		)
			throw new WrongLicense(format);

		let response;
		const result: (DeezerError | null)[] = [];

		try {
			response = await got
				.post("https://media.deezer.com/v1/get_url", {
					headers: this.http_headers,
					cookieJar: this.cookie_jar,
					https: {
						rejectUnauthorized: false,
					},
					json: {
						license_token: this.current_user.license_token,
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
						result.push(new WrongGeolocation(this.current_user.country));
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

export { TrackFormats, Deezer };

export * from "./api";
export * from "./gw";
export * as utils from "./utils";
export * as errors from "./errors";
