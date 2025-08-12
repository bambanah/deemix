import {
	Convertable,
	Downloader,
	generateDownloadObject,
	SpotifyPlugin,
	utils,
	type Listener,
	type Settings,
} from "deemix";
import { TrackFormats, type Deezer } from "deezer-sdk";
import { configFolder } from "./main";

const listener: Listener = {
	send: (key: string, data?: unknown) => {
		const logLine = utils.formatListener(key, data);
		if (logLine) console.log(logLine);
		if (["downloadInfo", "downloadWarn"].includes(key)) return;
	},
};

export const downloadLinks = async (
	dz: Deezer,
	urls: string[],
	settings: Settings,
	spotifyPlugin: SpotifyPlugin
) => {
	const bitrate = settings.maxBitrate ?? TrackFormats.MP3_128;

	const downloadObjects = [];
	for (const url of urls) {
		try {
			const downloadObject = await generateDownloadObject(
				dz,
				url,
				bitrate,
				{ spotify: spotifyPlugin },
				listener
			);

			if (Array.isArray(downloadObject)) {
				downloadObjects.concat(downloadObject);
			} else {
				downloadObjects.push(downloadObject);
			}
		} catch (e) {
			if (e instanceof Error && e.name === "PluginNotEnabledError") {
				console.warn(
					`Populate Spotify app credentials to download Spotify links:\n\t${configFolder}spotify/config.json\n`
				);
				console.log(
					"Documentation: https://developer.spotify.com/documentation/web-api/tutorials/getting-started#create-an-app"
				);

				continue;
			}

			if (e instanceof Error) {
				console.error(e);
			}
		}
	}

	for (let downloadObject of downloadObjects) {
		if (downloadObject instanceof Convertable) {
			downloadObject = await spotifyPlugin.convert(
				dz,
				downloadObject,
				settings,
				listener
			);
		}

		const downloader = new Downloader(dz, downloadObject, settings, listener);
		await downloader.start();
	}

	return "Done";
};
