import { fetchData } from "@/utils/api-utils";

let settingsData = {};
let defaultSettingsData = {};
let spotifyCredentials: any = {};

export async function getSettingsData() {
	const data = await fetchData("getSettings");
	const { settings, defaultSettings, spotifySettings } = data;

	settingsData = settings;
	defaultSettingsData = defaultSettings;
	spotifyCredentials = spotifySettings || {};

	return { settingsData, defaultSettingsData, spotifyCredentials };
}

export function getInitialPreviewVolume() {
	let volume = parseInt(localStorage.getItem("previewVolume") ?? "");

	if (isNaN(volume)) {
		volume = 80; // Default
		localStorage.setItem("previewVolume", volume.toString());
	}

	return volume;
}
