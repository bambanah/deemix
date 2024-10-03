import { Command } from "commander";
import { settings, utils } from "deemix";
import { Deezer } from "deezer-sdk";
import path from "path";
import packageJson from "../package.json" with { type: "json" };

const { load: loadSettings } = settings;
const { getConfigFolder } = utils;

const program = new Command();

program
	.name("deemix")
	.description("A CLI wrapper for deemix")
	.version(packageJson.version)
	.argument("<url>", "The URL of the track or playlist")
	.option("-p, --path <path>", "Downloads in the given folder")
	.option("-b, --bitrate <type>", "Overrides the default bitrate selected")
	.option(
		"--portable",
		"Creates the config folder in the same directory where the script is launched"
	)
	.parse();

const { path: downloadPath, bitrate, portable } = program.opts();

let configFolder: string;

if (portable) {
	configFolder = path.join(process.cwd(), "config");
} else {
	configFolder = getConfigFolder();
}

const loadedSettings = loadSettings(configFolder);

console.log(
	loadedSettings.downloadLocation,
	downloadPath,
	loadedSettings.maxBitrate,
	bitrate
);

const dz = new Deezer();

console.log(dz.loggedIn);
