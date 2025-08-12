import { WebSocketServer } from "ws";
import { logger } from "@/helpers/logger.js";
import { DeemixApp } from "@/deemixApp.js";
import type { Settings, SpotifySettings } from "deemix";

const eventName = "saveSettings";

export interface SaveSettingsData {
	settings: Settings;
	spotifySettings: SpotifySettings;
}

const cb = (
	data: SaveSettingsData,
	_: any,
	__: WebSocketServer,
	deemix: DeemixApp
) => {
	const { settings, spotifySettings } = data;
	deemix.saveSettings(settings, spotifySettings);
	logger.info("Settings saved");
	deemix.listener.send("updateSettings", { settings, spotifySettings });
};

export default { eventName, cb };
