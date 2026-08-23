import fs from "fs";
import path from "path";
import { type LoginFile } from "./types/LoginFile.js";

const DEFAULT_LOGIN: LoginFile = { arl: null };

const loginFile = (configFolder: string) =>
	path.join(configFolder, "login.json");

export function writeLoginCredentials(configFolder: string, login: LoginFile) {
	if (!fs.existsSync(configFolder)) fs.mkdirSync(configFolder);

	fs.writeFileSync(loginFile(configFolder), JSON.stringify(login, null, 2));
}

export function readLoginCredentials(configFolder: string): LoginFile {
	try {
		return JSON.parse(fs.readFileSync(loginFile(configFolder)).toString());
	} catch {
		return { ...DEFAULT_LOGIN };
	}
}
