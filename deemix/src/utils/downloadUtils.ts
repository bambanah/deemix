import fs from "fs";
import { OverwriteOption } from "../settings.js";
import { tagFLAC, tagID3 } from "../tagger.js";

export const checkShouldDownload = (
	filename,
	filepath,
	extension,
	writepath,
	overwriteFile,
	track
) => {
	if (
		overwriteFile === OverwriteOption.OVERWRITE ||
		overwriteFile === OverwriteOption.KEEP_BOTH
	)
		return true;

	const trackAlreadyDownloaded = fs.existsSync(writepath);

	if (
		trackAlreadyDownloaded &&
		overwriteFile === OverwriteOption.DONT_OVERWRITE
	)
		return false;

	// Don't overwrite and don't mind extension
	if (
		!trackAlreadyDownloaded &&
		overwriteFile === OverwriteOption.DONT_CHECK_EXT
	) {
		const extensions = [".mp3", ".flac", ".opus", ".m4a"];
		const baseFilename = `${filepath}/${filename}`;

		for (const ext of extensions) {
			if (fs.existsSync(baseFilename + ext)) return false;
		}
	}

	// Overwrite only lower bitrates
	if (
		trackAlreadyDownloaded &&
		overwriteFile === OverwriteOption.ONLY_LOWER_BITRATES &&
		extension === ".mp3"
	) {
		const stats = fs.statSync(writepath);
		const fileSizeKb = (stats.size * 8) / 1024;
		const bitrateAprox = fileSizeKb / track.duration;
		if (Number(track.bitrate) === 3 && bitrateAprox < 310) {
			return true;
		}
	}

	return !trackAlreadyDownloaded;
};

export const tagTrack = (extension, writepath, track, tags) => {
	if (extension === ".mp3") {
		tagID3(writepath, track, tags);
	} else if (extension === ".flac") {
		tagFLAC(writepath, track, tags);
	}
};
