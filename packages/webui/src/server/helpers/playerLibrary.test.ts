import { mkdir, mkdtemp, rm, writeFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { listPlayerTracks, resolvePlayerTrack } from "./playerLibrary.js";

describe("player library", () => {
	let musicDirectory: string;

	beforeEach(async () => {
		musicDirectory = await mkdtemp(join(tmpdir(), "deemix-player-"));
	});

	afterEach(async () => {
		await rm(musicDirectory, { recursive: true, force: true });
	});

	test("lists audio files recursively and ignores other file types", async () => {
		await mkdir(join(musicDirectory, "Artist - Album"), { recursive: true });
		await writeFile(join(musicDirectory, "Artist - Album", "Track.FLAC"), "");
		await writeFile(join(musicDirectory, "cover.jpg"), "");

		await expect(listPlayerTracks(musicDirectory)).resolves.toEqual([
			{
				path: "Artist - Album/Track.FLAC",
				artist: "Artist",
				title: "Track",
			},
		]);
	});

	test("resolves only supported audio files inside the library", async () => {
		await writeFile(join(musicDirectory, "track.mp3"), "");
		await writeFile(join(musicDirectory, "cover.jpg"), "");

		await expect(resolvePlayerTrack(musicDirectory, "track.mp3")).resolves.toBe(
			join(musicDirectory, "track.mp3")
		);
		await expect(
			resolvePlayerTrack(musicDirectory, "../outside.mp3")
		).resolves.toBeNull();
		await expect(
			resolvePlayerTrack(musicDirectory, "cover.jpg")
		).resolves.toBeNull();
	});
});
