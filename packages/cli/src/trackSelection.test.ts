import { describe, expect, it } from "vitest";
import { selectAlbumTracks } from "./trackSelection";
const album = () => ({
	type: "album",
	size: 3,
	progressNext: 0,
	collection: {
		albumAPI: { title: "Compilation" },
		tracks: [
			{ id: 1, track_position: 1 },
			{ id: 2, track_position: 2 },
			{ id: 3, track_position: 3 },
		],
	},
});
describe("missing album track selection", () => {
	it("keeps album context, original positions, and original totals", () => {
		const item = album();
		const metadata = item.collection.albumAPI;
		selectAlbumTracks(item, "2,3");
		expect(item.collection.tracks).toEqual([
			{ id: 2, track_position: 2 },
			{ id: 3, track_position: 3 },
		]);
		expect(item.collection.albumAPI).toBe(metadata);
		expect(item.size).toBe(3);
		expect(item.progressNext).toBeCloseTo(100 / 3);
	});
	it("rejects IDs absent from the album before modifying it", () => {
		const item = album();
		expect(() => selectAlbumTracks(item, "9")).toThrow(/absent/);
		expect(item.collection.tracks).toHaveLength(3);
	});
	it.each(["0", "-1", "1,", "garbage"])("rejects invalid IDs %s", (ids) => {
		expect(() => selectAlbumTracks(album(), ids)).toThrow();
	});
	it("leaves an ordinary album download unchanged", () => {
		const item = album();
		selectAlbumTracks(item);
		expect(item.collection.tracks).toHaveLength(3);
	});
});
