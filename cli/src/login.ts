import type { Deezer } from "deezer-sdk";
import { existsSync, readFileSync, writeFileSync } from "fs";
import readline from "node:readline/promises";
import path from "path";

export const deezerLogin = async (dz: Deezer, configFolder: string) => {
	const arlFileLocation = path.join(configFolder, ".arl");

	if (existsSync(arlFileLocation)) {
		const arl = readFileSync(arlFileLocation).toString().trim();
		await dz.loginViaArl(arl);
	} else {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});
		const arl = await rl.question("Enter your ARL: ");
		await dz.loginViaArl(arl);
		writeFileSync(arlFileLocation, arl);
	}

	return dz.loggedIn;
};
