import * as deemix from "deemix";
import fs from "fs";
import type { LoginFile } from "../types.js";

const configFolder = deemix.utils.getConfigFolder();

const DEFAULTS: LoginFile = {
	arl: null,
};

let loginData: LoginFile = {
	arl: null,
};

export function loadLoginCredentials() {
	if (!fs.existsSync(configFolder)) fs.mkdirSync(configFolder);
	if (!fs.existsSync(configFolder + "login.json")) resetLoginCredentials();

	try {
		loginData = JSON.parse(
			fs.readFileSync(configFolder + "login.json").toString()
		);
	} catch (e: any) {
		if (e.name === "SyntaxError") resetLoginCredentials();
	}
}

export function getLoginCredentials(): LoginFile {
	if (!loginData.arl) loadLoginCredentials();
	return loginData;
}

export function saveLoginCredentials(newLogin: LoginFile) {
	if (newLogin.arl) loginData.arl = newLogin.arl;
	if (!fs.existsSync(configFolder)) fs.mkdirSync(configFolder);
	fs.writeFileSync(
		configFolder + "login.json",
		JSON.stringify(loginData, null, 2)
	);
}

export function resetLoginCredentials() {
	if (!fs.existsSync(configFolder)) fs.mkdirSync(configFolder);
	fs.writeFileSync(
		configFolder + "login.json",
		JSON.stringify(DEFAULTS, null, 2)
	);
	loginData = JSON.parse(JSON.stringify(DEFAULTS));
}
