import type { Deezer } from "deezer-sdk";
import { existsSync, readFileSync, rmSync, writeFileSync } from "fs";
import readline from "node:readline/promises";
import path from "path";

export const deezerLogin = async (dz: Deezer, configFolder: string) => {
	if (!dz || typeof configFolder !== "string") {
		throw new Error("Invalid parameters");
	}

	const arlFileLocation = path.join(configFolder, ".arl");

	if (existsSync(arlFileLocation)) {
		try {
			const arl = readFileSync(arlFileLocation).toString().trim();
			if (!arl) throw new Error("Empty ARL file");

			const loggedIn = await dz.loginViaArl(arl);
			if (!loggedIn) throw new Error("Invalid ARL");

			return true;
		} catch (e) {
			rmSync(arlFileLocation);
			throw e;
		}
	}

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	const arl = await rl.question("Enter your ARL: ");
	await dz.loginViaArl(arl);
	writeFileSync(arlFileLocation, arl);

	return dz.loggedIn;
};
