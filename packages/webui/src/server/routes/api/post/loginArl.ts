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

const handler: RequestHandler<any, any, RawLoginArlBody, any> = async (
	req,
	res
) => {
	if (!sessionDZ[req.session.id]) sessionDZ[req.session.id] = new Deezer();
	const deemix: DeemixApp = req.app.get("deemix");
	const dz: Deezer = sessionDZ[req.session.id];
	const isSingleUser: boolean = req.app.get("isSingleUser");

	if (!req.body) {
		res.status(400).send();
	}

	if (!req.body.arl) {
		res.status(400).send();
	}

	const loginParams: { arl: string; child?: number } = { arl: req.body.arl };

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
		arl: req.body.arl,
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
				accessToken: null,
				arl: returnValue.arl,
			});
	} else if (isSingleUser) resetLoginCredentials();
	res.status(200).send(returnValue);
};

const apiHandler = { path, handler };

export default apiHandler;
