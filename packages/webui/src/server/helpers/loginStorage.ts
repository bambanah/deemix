import {
	readLoginCredentials,
	utils,
	writeLoginCredentials,
	type LoginFile,
} from "deemix";

const configFolder = utils.getConfigFolder();

let loginData: LoginFile = {
	arl: null,
};

export function loadLoginCredentials() {
	loginData = readLoginCredentials(configFolder);
}

export function getLoginCredentials(): LoginFile {
	if (!loginData.arl) loadLoginCredentials();
	return loginData;
}

export function saveLoginCredentials(newLogin: LoginFile) {
	if (newLogin.arl) loginData.arl = newLogin.arl;
	writeLoginCredentials(configFolder, loginData);
}

export function resetLoginCredentials() {
	loginData = { arl: null };
	writeLoginCredentials(configFolder, loginData);
}
