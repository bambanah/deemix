import { fetchData } from "@/utils/api";

let settingsData = {};
let defaultSettingsData = {};
let spotifyCredentials = {};

export async function getSettingsData() {
	const data = await fetchData("getSettings");
	const { settings, defaultSettings, spotifySettings } = data;
	settingsData = settings;
	defaultSettingsData = defaultSettings;
	spotifyCredentials = spotifySettings || {};

	return { settingsData, defaultSettingsData, spotifyCredentials };
}

/**
 * @returns	{number}
 */
export function getInitialPreviewVolume() {
	let volume = parseInt(localStorage.getItem("previewVolume"));

	if (isNaN(volume)) {
		volume = 80; // Default
		localStorage.setItem("previewVolume", volume.toString());
	}

	return volume;
}

/**
 * @returns	{boolean}
 */
export function checkInitialSlimDownloads() {
	return localStorage.getItem("slimDownloads") === "true";
}

/**
 * @returns	{boolean}
 */
export function checkInitialSlimSidebar() {
	return localStorage.getItem("slimSidebar") === "true";
}

/**
 * @returns	{boolean}
 */
export function checkInitialShowBitrateTags() {
	return localStorage.getItem("showBitrateTags") === "true";
}

/**
 * @returns	{boolean}
 */
export function checkInitialShowSearchButton() {
	return localStorage.getItem("showSearchButton") === "true";
}
