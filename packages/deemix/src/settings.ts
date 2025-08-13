import { TrackFormats } from "deezer-sdk";
import { getMusicFolder, getConfigFolder } from "./utils/localpaths.js";
import fs from "fs";
import { type Settings } from "./types/Settings.js";

// Should the lib overwrite files?
export const OverwriteOption = {
	OVERWRITE: "y", // Yes, overwrite the file
	DONT_OVERWRITE: "n", // No, don't overwrite the file
	DONT_CHECK_EXT: "e", // No, and don't check for extensions
	KEEP_BOTH: "b", // No, and keep both files
	ONLY_TAGS: "t", // Overwrite only the tags
	ONLY_LOWER_BITRATES: "l", // Overwrite only lower bitrates
};

// What should I do with featured artists?
export const FeaturesOption = {
	NO_CHANGE: "0", // Do nothing
	REMOVE_TITLE: "1", // Remove from track title
	REMOVE_TITLE_ALBUM: "3", // Remove from track title and album title
	MOVE_TITLE: "2", // Move to track title
};

export const DEFAULT_SETTINGS: Settings = {
	downloadLocation: getMusicFolder(),
	tracknameTemplate: "%artist% - %title%",
	albumTracknameTemplate: "%tracknumber% - %title%",
	playlistTracknameTemplate: "%artist% - %title%",
	createPlaylistFolder: true,
	playlistNameTemplate: "%playlist%",
	createArtistFolder: false,
	artistNameTemplate: "%artist%",
	createAlbumFolder: true,
	albumNameTemplate: "%artist% - %album%",
	createCDFolder: true,
	createStructurePlaylist: false,
	createSingleFolder: false,
	padTracks: true,
	padSingleDigit: true,
	paddingSize: 0,
	illegalCharacterReplacer: "_",
	queueConcurrency: 10,
	maxBitrate: TrackFormats.MP3_128,
	feelingLucky: false,
	fallbackBitrate: false,
	fallbackSearch: false,
	fallbackISRC: false,
	logErrors: true,
	logSearched: false,
	overwriteFile: OverwriteOption.DONT_OVERWRITE,
	createM3U8File: false,
	playlistFilenameTemplate: "playlist",
	syncedLyrics: false,
	embeddedArtworkSize: 800,
	embeddedArtworkPNG: false,
	localArtworkSize: 1200,
	localArtworkFormat: "jpg",
	saveArtwork: true,
	coverImageTemplate: "cover",
	saveArtworkArtist: false,
	artistImageTemplate: "folder",
	jpegImageQuality: 90,
	dateFormat: "Y-M-D",
	albumVariousArtists: true,
	removeAlbumVersion: false,
	removeDuplicateArtists: true,
	featuredToTitle: FeaturesOption.NO_CHANGE,
	titleCasing: "nothing",
	artistCasing: "nothing",
	executeCommand: "",
	tags: {
		title: true,
		artist: true,
		artists: true,
		album: true,
		cover: true,
		trackNumber: true,
		trackTotal: false,
		discNumber: true,
		discTotal: false,
		albumArtist: true,
		genre: true,
		year: true,
		date: true,
		explicit: false,
		isrc: true,
		length: true,
		barcode: true,
		bpm: true,
		replayGain: false,
		label: true,
		lyrics: false,
		syncedLyrics: false,
		copyright: false,
		composer: false,
		involvedPeople: false,
		source: false,
		rating: false,
		savePlaylistAsCompilation: false,
		useNullSeparator: false,
		saveID3v1: true,
		multiArtistSeparator: "default",
		singleAlbumArtist: false,
		coverDescriptionUTF8: false,
	},
};

export function saveSettings(settings: Settings, configFolder) {
	configFolder = configFolder || getConfigFolder();
	if (!fs.existsSync(configFolder)) fs.mkdirSync(configFolder);

	fs.writeFileSync(
		configFolder + "config.json",
		JSON.stringify(settings, null, 2)
	);
}

export function loadSettings(configFolder: string) {
	configFolder = configFolder || getConfigFolder();
	if (!fs.existsSync(configFolder)) fs.mkdirSync(configFolder);

	if (!fs.existsSync(configFolder + "config.json"))
		saveSettings(DEFAULT_SETTINGS, configFolder);

	let settings: Settings;
	try {
		settings = JSON.parse(
			fs.readFileSync(configFolder + "config.json").toString()
		);
	} catch (e) {
		if (e.name === "SyntaxError") saveSettings(DEFAULT_SETTINGS, configFolder);
		settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
	}
	if (check(settings) > 0) saveSettings(settings, configFolder);
	return settings;
}

function check(settings: Settings) {
	let changes = 0;
	Object.keys(DEFAULT_SETTINGS).forEach((_iSet) => {
		if (
			settings[_iSet] === undefined ||
			typeof settings[_iSet] !== typeof DEFAULT_SETTINGS[_iSet]
		) {
			settings[_iSet] = DEFAULT_SETTINGS[_iSet];
			changes++;
		}
	});
	Object.keys(DEFAULT_SETTINGS.tags).forEach((_iSet) => {
		if (
			settings.tags[_iSet] === undefined ||
			typeof settings.tags[_iSet] !== typeof DEFAULT_SETTINGS.tags[_iSet]
		) {
			settings.tags[_iSet] = DEFAULT_SETTINGS.tags[_iSet];
			changes++;
		}
	});
	if (settings.downloadLocation === "") {
		settings.downloadLocation = DEFAULT_SETTINGS.downloadLocation;
		changes++;
	}
	[
		"tracknameTemplate",
		"albumTracknameTemplate",
		"playlistTracknameTemplate",
		"playlistNameTemplate",
		"artistNameTemplate",
		"albumNameTemplate",
		"playlistFilenameTemplate",
		"coverImageTemplate",
		"artistImageTemplate",
		"paddingSize",
	].forEach((template) => {
		if (settings[template] === "") {
			settings[template] = DEFAULT_SETTINGS[template];
			changes++;
		}
	});
	return changes;
}
