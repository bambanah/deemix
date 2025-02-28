import type { Deezer } from "deezer-sdk";
import { existsSync, readFileSync, rmSync, writeFileSync } from "fs";
import readline from "node:readline/promises";
import path from "path";

export const deezerLogin = async (dz: Deezer, configFolder: string) => {
	const arlFileLocation = path.join(configFolder, ".arl");

	if (existsSync(arlFileLocation)) {
		const arl = readFileSync(arlFileLocation).toString().trim();
		if (!arl) {
			console.error("ARL file is empty.");
			process.exit(1);
		}

		const loggedIn = await dz.loginViaArl(arl);

		if (loggedIn) {
			return true;
		}

		// If the ARL is invalid, remove it
		rmSync(arlFileLocation);
	}

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	const arl = await rl.question("Enter your ARL: ");
	if (!arl) {
		console.error("Invalid ARL input.");
		process.exit(1);
	}

	await dz.loginViaArl(arl);
	writeFileSync(arlFileLocation, arl);

	return dz.loggedIn;
};
