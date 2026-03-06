import { existsSync, mkdtempSync, readFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

import { describe, expect, it, vi } from "vitest";

import { Collection } from "./download-objects/Collection.js";
import { Downloader } from "./downloader.js";

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
