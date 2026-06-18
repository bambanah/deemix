import { DeemixApp, sessionDZ } from "@/deemixApp.js";
import { logger } from "@/helpers/logger.js";
import {
	resetLoginCredentials,
	saveLoginCredentials,
} from "@/helpers/loginStorage.js";
import { type ApiHandler } from "@/types.js";
import { Deezer } from "deezer-sdk";
import type { RequestHandler } from "express";

export interface RawLoginArlBody {
	arl: string;
	child?: number;
}

const LoginStatus = {
	NOT_AVAILABLE: -1,
	FAILED: 0,
	SUCCESS: 1,
	ALREADY_LOGGED: 2,
	FORCED_SUCCESS: 3,
};

const path: ApiHandler["path"] = "/loginArl";

// An ARL is a hex token. Reject anything else up front so a stray paste (the
// whole DevTools cookie row, surrounding quotes, etc.) returns a clear error
// instead of failing deep in the cookie jar with an opaque "Cookie failed to
// parse" that surfaces to the user as a generic "Couldn't log in".
const ARL_REGEX = /^[a-f0-9]+$/i;

const handler: RequestHandler<any, any, RawLoginArlBody, any> = async (
	req,
	res
) => {
	if (!sessionDZ[req.session.id]) sessionDZ[req.session.id] = new Deezer();
	const deemix: DeemixApp = req.app.get("deemix");
	const dz: Deezer = sessionDZ[req.session.id];
	const isSingleUser: boolean = req.app.get("isSingleUser");

	if (!req.body || !req.body.arl) {
		res.status(400).send();
		return;
	}

	// Strip whitespace/newlines that commonly sneak in when copying the cookie.
	const arl = String(req.body.arl).replace(/\s+/g, "");

	if (!arl) {
		res.status(400).send();
		return;
	}

	if (!ARL_REGEX.test(arl)) {
		logger.warn("Rejected ARL login: value contains invalid characters");
		res.status(200).send({ status: LoginStatus.FAILED, error: "invalidArl" });
		return;
	}

	const loginParams: { arl: string; child?: number } = { arl };

	// TODO Handle the child === 0 case, don't want to rely on the loginViaArl default param (it may change in the
	//  future)
	if (req.body.child) {
		loginParams.child = req.body.child;
	}

	let response;

	if (process.env.NODE_ENV !== "test") {
		if (!dz.loggedIn) {
			try {
				response = await dz.loginViaArl(loginParams.arl, loginParams.child);
			} catch (e) {
				logger.error(e);
				response = false;
			}
			response = response ? 1 : 0;
		} else {
			response = LoginStatus.ALREADY_LOGGED;
		}
	} else {
		const testDz = new Deezer();
		response = await testDz.loginViaArl(loginParams.arl, loginParams.child);
	}
	if (response === LoginStatus.FAILED) sessionDZ[req.session.id] = new Deezer();
	if (!(await deemix.isDeezerAvailable())) response = LoginStatus.NOT_AVAILABLE;
	const returnValue = {
		status: response,
		arl,
		user: dz.currentUser,
		childs: dz.childs,
		currentChild: dz.selectedAccount,
	};

	if (
		response !== LoginStatus.NOT_AVAILABLE &&
		response !== LoginStatus.FAILED
	) {
		deemix.startQueue(dz);
		if (isSingleUser)
			saveLoginCredentials({
				arl: returnValue.arl,
			});
	} else if (isSingleUser) resetLoginCredentials();
	res.status(200).send(returnValue);
};

const apiHandler = { path, handler };

export default apiHandler;
