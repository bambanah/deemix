import { TrackFormats } from "deezer-sdk";
import {
	existsSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	writeFileSync,
} from "fs";
import { tmpdir } from "os";
import { join } from "path";

import { describe, expect, it, vi } from "vitest";

import { Collection } from "./download-objects/Collection.js";
import { Downloader } from "./downloader.js";
import { generatePath } from "./utils/pathtemplates.js";

vi.mock("./utils/getPreferredBitrate.js", () => ({
	getPreferredBitrate: vi.fn(async () => TrackFormats.FLAC),
}));

vi.mock("./utils/pathtemplates.js", async (importOriginal) => ({
	...(await importOriginal<typeof import("./utils/pathtemplates.js")>()),
	generatePath: vi.fn(),
}));

describe("Downloader.afterDownloadCollection", () => {
	it("still creates m3u8 when a track entry is missing", async () => {
		const downloadLocation = mkdtempSync(join(tmpdir(), "deemix-test-"));

		const downloadObject = new Collection({
			type: "playlist",
			id: "123",
			bitrate: 1,
			title: "Regression Playlist",
			artist: "Spotify",
			cover: "",
			size: 2,
			explicit: false,
			collection: {
				tracks: [],
				playlistAPI: {
					title: "Regression Playlist",
				},
			},
		});

		const settings = {
			downloadLocation,
			createM3U8File: true,
			playlistFilenameTemplate: "%title%",
			illegalCharacterReplacer: "_",
			logErrors: false,
			logSearched: false,
			saveArtwork: false,
			saveArtworkArtist: false,
			tags: {
				savePlaylistAsCompilation: false,
			},
			executeCommand: "",
		} as any;

		const downloader = new Downloader({} as any, downloadObject, settings, {
			send: vi.fn(),
		} as any);

		await downloader.afterDownloadCollection([
			undefined,
			{
				filename: "Artist - Song.mp3",
				data: { artist: "Artist", title: "Song" },
			},
		]);

		const playlistFile = join(downloadLocation, "Regression Playlist.m3u8");
		expect(existsSync(playlistFile)).toBe(true);
		expect(readFileSync(playlistFile, "utf8").trim()).toBe("Artist - Song.mp3");
	});
});

describe("Downloader.download", () => {
	it("writes the m3u8 into the album folder when every track was already downloaded", async () => {
		const downloadLocation = mkdtempSync(join(tmpdir(), "deemix-test-"));
		const artistPath = join(downloadLocation, "Artist");
		const albumPath = join(artistPath, "Album");
		mkdirSync(albumPath, { recursive: true });
		writeFileSync(join(albumPath, "01 - Song.flac"), "");

		vi.mocked(generatePath).mockReturnValue({
			filename: "01 - Song",
			filepath: albumPath,
			artistPath,
			coverPath: albumPath,
			extrasPath: albumPath,
		} as any);

		const downloadObject = new Collection({
			type: "album",
			id: "456",
			bitrate: TrackFormats.FLAC,
			title: "Album",
			artist: "Artist",
			cover: "",
			size: 1,
			explicit: false,
			collection: { tracks: [] },
		});

		const settings = {
			downloadLocation,
			overwriteFile: "n",
			createM3U8File: true,
			playlistFilenameTemplate: "%title%",
			illegalCharacterReplacer: "_",
			logErrors: false,
			logSearched: false,
			saveArtwork: false,
			saveArtworkArtist: false,
			tags: {
				savePlaylistAsCompilation: false,
			},
			executeCommand: "",
		} as any;

		const downloader = new Downloader({} as any, downloadObject, settings, {
			send: vi.fn(),
		} as any);

		const track = {
			id: 1,
			title: "Song",
			MD5: "0123456789abcdef",
			album: {},
			mainArtist: { name: "Artist" },
			parseData: vi.fn(async () => {}),
			applySettings: vi.fn(),
		} as any;

		const result = await downloader.download(
			{ trackAPI: { id: 1, title: "Song", artist: { name: "Artist" } } as any },
			track
		);
		await downloader.afterDownloadCollection([result]);

		const playlistFile = join(albumPath, "Album.m3u8");
		expect(existsSync(playlistFile)).toBe(true);
		expect(readFileSync(playlistFile, "utf8").trim()).toBe("01 - Song.flac");
		expect(existsSync(join(downloadLocation, "Album.m3u8"))).toBe(false);
	});
});
