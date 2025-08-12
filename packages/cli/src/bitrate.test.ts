import { TrackFormats } from "deezer-sdk";
import { parseBitrate } from "./bitrate";

const bitrateInputExpectedMap = [
	["1", TrackFormats.MP3_128],
	["mp3_128", TrackFormats.MP3_128],
	["128", TrackFormats.MP3_128],

	["3", TrackFormats.MP3_320],
	["mp3_320", TrackFormats.MP3_320],
	["mp3", TrackFormats.MP3_320],
	["320", TrackFormats.MP3_320],

	["9", TrackFormats.FLAC],
	["flac", TrackFormats.FLAC],
	["lossless", TrackFormats.FLAC],

	["13", TrackFormats.MP4_RA1],
	["mp4_ra1", TrackFormats.MP4_RA1],
	["360_lq", TrackFormats.MP4_RA1],

	["14", TrackFormats.MP4_RA2],
	["mp4_ra2", TrackFormats.MP4_RA2],
	["360_mq", TrackFormats.MP4_RA2],

	["15", TrackFormats.MP4_RA3],
	["mp4_ra3", TrackFormats.MP4_RA3],
	["360", TrackFormats.MP4_RA3],
	["360_hq", TrackFormats.MP4_RA3],
] as const;

const mockExit = vi.spyOn(process, "exit").mockImplementation((number) => {
	throw new Error(`Exit with code ${number}`);
});

test.each(bitrateInputExpectedMap)(
	"parseBitrate with no default - %s -> %i",
	(input: string, expected: number) => {
		const settings = { maxBitrate: undefined };

		parseBitrate(settings, input);

		expect(settings.maxBitrate).toBe(expected);
	}
);

test.each(bitrateInputExpectedMap)(
	"parseBitrate with FLAC default - %s -> %i",
	(input: string, expected: number) => {
		const settings = { maxBitrate: TrackFormats.FLAC };

		parseBitrate(settings, input);

		expect(settings.maxBitrate).toBe(expected);
	}
);

const invalidBitrates = ["invalid", "invalid123", "123", "1.0"];

test.each(invalidBitrates)("invalid bitrate - %s", (bitrate: string) => {
	const settings = { maxBitrate: TrackFormats.MP3_128 };

	expect(() => parseBitrate(settings, bitrate)).toThrowError();

	expect(mockExit).toHaveBeenCalledWith(1);
});
