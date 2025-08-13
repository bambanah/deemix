import type { Settings } from "deemix";
import { TrackFormats } from "deezer-sdk";

const bitrateTextNumberMap = {
	[TrackFormats.MP3_128]: ["mp3_128", "128", "1"],
	[TrackFormats.MP3_320]: ["mp3_320", "mp3", "320", "3"],
	[TrackFormats.FLAC]: ["flac", "flac", "lossless", "9"],
	[TrackFormats.MP4_RA1]: ["mp4_ra1", "360_lq", "13"],
	[TrackFormats.MP4_RA2]: ["mp4_ra2", "360_mq", "14"],
	[TrackFormats.MP4_RA3]: ["mp4_ra3", "360", "360_hq", "15"],
} as const;

const displayBitrateHelp = (inputBitrate: string) => {
	console.log(`Invalid bitrate:\n- ${inputBitrate}\n`);

	console.log("Available bitrates:");

	for (const [bitrateName, bitrateNumber] of Object.entries(TrackFormats)) {
		if (
			bitrateNumber === TrackFormats.LOCAL ||
			bitrateNumber === TrackFormats.DEFAULT
		)
			continue;

		console.log(
			`- ${bitrateName}: ${bitrateTextNumberMap[bitrateNumber].slice(1).join(", ")}`
		);
	}

	console.log("");
};

export function parseBitrate(
	settings: Pick<Settings, "maxBitrate">,
	bitrate: string
) {
	const downloadBitrate = getBitrateNumberFromText(bitrate);

	if (downloadBitrate) {
		settings.maxBitrate = downloadBitrate;
	} else {
		displayBitrateHelp(bitrate);

		process.exit(1);
	}
}

export function getBitrateNumberFromText(text: string) {
	text = text.trim().toLowerCase();

	for (const [bitrate, bitrateTexts] of Object.entries(bitrateTextNumberMap)) {
		if ((bitrateTexts as readonly string[]).includes(text))
			return Number(bitrate);
	}

	return undefined;
}
