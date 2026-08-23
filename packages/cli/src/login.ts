import { readLoginCredentials, writeLoginCredentials } from "deemix";
import type { Deezer } from "deezer-sdk";
import { existsSync, readFileSync } from "fs";
import readline from "node:readline/promises";
import path from "path";

const readLegacyArl = (configFolder: string) => {
	const arlFileLocation = path.join(configFolder, ".arl");

	if (!existsSync(arlFileLocation)) return null;

	return readFileSync(arlFileLocation).toString().trim() || null;
};

export const deezerLogin = async (dz: Deezer, configFolder: string) => {
	const storedArl = readLoginCredentials(configFolder).arl;
	const legacyArl = storedArl ? null : readLegacyArl(configFolder);
	const arl = storedArl ?? legacyArl;

	if (arl && (await dz.loginViaArl(arl))) {
		if (legacyArl) writeLoginCredentials(configFolder, { arl: legacyArl });

		return true;
	}

	if (!process.stdin.isTTY) {
		console.error(
			"No valid ARL found. Log in through the deemix web UI, or run this command with a terminal attached (docker exec -it, for the Docker image) to be prompted for an ARL."
		);

		process.exit(1);
	}

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	const promptedArl = await rl.question("Enter your ARL: ");
	rl.close();

	await dz.loginViaArl(promptedArl);

	if (dz.loggedIn) writeLoginCredentials(configFolder, { arl: promptedArl });

	return dz.loggedIn;
};
