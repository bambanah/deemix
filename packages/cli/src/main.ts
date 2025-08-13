import { Command } from "commander";
import { loadSettings, SpotifyPlugin, utils } from "deemix";
import { Deezer, setDeezerCacheDir } from "deezer-sdk";
import path, { sep } from "path";
import packageJson from "../package.json" with { type: "json" };
import { parseBitrate } from "./bitrate";
import { downloadLinks } from "./download";
import { deezerLogin } from "./login";

const { getConfigFolder } = utils;

const program = new Command();

program
	.name("deemix")
	.description("A CLI wrapper for deemix")
	.version(packageJson.version)
	.argument("<url>", "The URL of the track or playlist")
	.option("-p, --path <path>", "Downloads in the given folder")
	.option(
		"-b, --bitrate <type>",
		"Overrides the default bitrate selected - 128, 320, flac"
	)
	.option(
		"--portable",
		"Creates the config folder in the same directory where the script is launched"
	)
	.parse();

const { portable } = program.opts();

export let configFolder: string;

if (portable) {
	configFolder = path.join(process.cwd(), `config${sep}`);
} else {
	configFolder = getConfigFolder();
}
setDeezerCacheDir(configFolder);

const settings = loadSettings(configFolder);

const spotifyPlugin = new SpotifyPlugin(configFolder);
spotifyPlugin.setup();

const { path: downloadPath, bitrate } = program.opts();

if (downloadPath) settings.downloadLocation = path.resolve(downloadPath);
if (bitrate) parseBitrate(settings, bitrate);

const loginAndDownload = async () => {
	const dz = new Deezer();
	const loggedIn = await deezerLogin(dz, configFolder);

	if (loggedIn) {
		const urls = program.args;

		await downloadLinks(dz, urls, settings, spotifyPlugin);

		process.exit(0);
	} else {
		console.error("Not logged in");

		process.exit(1);
	}
};

loginAndDownload();
