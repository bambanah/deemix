import { TrackFormats } from "deezer-sdk";
import { fixName, generateTrackName, generatePlaylistName, pad } from "./pathtemplates.js";

test("fix name", async () => {
	const fixed = fixName("track/:*");
	expect(fixed).toBe("track___");
});

test("pad name", () => {
	const settings = {
		paddingSize: 0,
		padTracks: true,
		padSingleDigit: true,
	};

	expect(pad(1, 12, settings)).toEqual("01");
	expect(pad(12, 12, settings)).toEqual("12");

	settings.paddingSize = 4;
	expect(pad(1, 2, settings)).toEqual("0001");
	expect(pad(12, 12, settings)).toEqual("0012");

	settings.padSingleDigit = false;
	settings.paddingSize = 1;
	expect(pad(1, 12, settings)).toEqual("1");
	expect(pad(12, 12, settings)).toEqual("12");

	settings.padTracks = false;

	expect(pad(1, 12, settings)).toEqual("1");
	expect(pad(12, 12, settings)).toEqual("12");
});

describe("generateTrackName with %bitrate%", () => {
	const baseTrack = {
		title: "Test Song",
		mainArtist: { name: "Artist", id: 1 },
		artists: ["Artist"],
		artistsString: "Artist",
		fullArtistsString: "Artist",
		mainArtistsString: "Artist",
		featArtistsString: "",
		album: null,
		date: { year: "2025" },
		dateString: "2025-01-01",
		bpm: 120,
		ISRC: "TEST00000001",
		explicit: false,
		id: 12345,
		discNumber: 1,
		playlist: null,
		position: null,
		bitrate: TrackFormats.FLAC,
	} as any;

	const baseSettings = {
		illegalCharacterReplacer: "_",
		padTracks: true,
		paddingSize: 0,
		padSingleDigit: true,
	} as any;

	test("resolves %bitrate% to FLAC", () => {
		const result = generateTrackName("%bitrate%/%artist% - %title%", baseTrack, baseSettings);
		expect(result).toBe("FLAC/Artist - Test Song");
	});

	test("resolves %bitrate% to 320", () => {
		const track = { ...baseTrack, bitrate: TrackFormats.MP3_320 };
		const result = generateTrackName("%bitrate%/%artist% - %title%", track, baseSettings);
		expect(result).toBe("320/Artist - Test Song");
	});

	test("resolves %bitrate% to 128", () => {
		const track = { ...baseTrack, bitrate: TrackFormats.MP3_128 };
		const result = generateTrackName("%bitrate%/%artist% - %title%", track, baseSettings);
		expect(result).toBe("128/Artist - Test Song");
	});

	test("handles unknown bitrate gracefully", () => {
		const track = { ...baseTrack, bitrate: 999 };
		const result = generateTrackName("%bitrate%/%artist% - %title%", track, baseSettings);
		expect(result).toBe("999/Artist - Test Song");
	});
});

describe("generatePlaylistName with %bitrate%", () => {
	const baseTrack = {
		playlist: {
			title: "My Playlist",
			playlistID: "123",
			owner: { name: "Owner", id: "456" },
			date: { year: "2025" },
			dateString: "2025-01-01",
			explicit: false,
		},
		bitrate: TrackFormats.MP3_320,
	} as any;

	const baseSettings = {
		illegalCharacterReplacer: "_",
		playlistNameTemplate: "%bitrate%/%playlist%",
		dateFormat: "Y-M-D",
	} as any;

	test("resolves %bitrate% in playlist folder name", () => {
		const result = generatePlaylistName(baseTrack, baseSettings);
		expect(result).toBe("320/My Playlist");
	});

	test("resolves FLAC bitrate in playlist folder name", () => {
		const track = { ...baseTrack, bitrate: TrackFormats.FLAC };
		const result = generatePlaylistName(track, baseSettings);
		expect(result).toBe("FLAC/My Playlist");
	});
});
