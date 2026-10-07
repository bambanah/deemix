import { afterEach, describe, expect, it, vi } from "vitest";
import { Downloader } from "./downloader.js";
import { DownloadFailed } from "./errors.js";
import Track from "./types/Track.js";

const gw = (id: any, fallback: any = 0) => ({
	SNG_ID: id,
	SNG_TITLE: "Fallback",
	ART_NAME: "Artist",
	FALLBACK: { SNG_ID: fallback },
});
const extra = {
	trackAPI: { id: 1, title: "Original", artist: { name: "Artist" } },
} as any;
function setup(edges: Record<string, any>, available = 0, settings = {}) {
	const object = { failed: 0, errors: [], bitrate: 9, size: 1 } as any;
	const dz = {
		gw: {
			get_track_with_fallback: vi.fn(async (id) =>
				gw(edges[id]?.id ?? id, edges[id]?.fallback ?? 0)
			),
			get_album_page: vi.fn(),
		},
		api: { get_track_id_from_metadata: vi.fn(async () => "0") },
	} as any;
	const d = new Downloader(dz, object, settings as any, { send: vi.fn() });
	const track = new Track();
	Object.assign(track, {
		id: 1,
		fallbackID: edges[1]?.fallback ?? 0,
		albumsFallback: [],
		ISRC: "X",
		mainArtist: { name: "Artist" },
		title: "Original",
		album: { title: "Album" },
	});
	const attempts: any[] = [];
	vi.spyOn(d, "download").mockImplementation(async (_, retry) => {
		const t = retry ?? track;
		attempts.push(t.id);
		if (attempts.length > 8) throw new Error("Safety stop: unbounded retry");
		if (Number(t.id) === available) return { id: t.id };
		throw new DownloadFailed("notAvailable", t);
	});
	return { d, dz, object, track, attempts };
}
afterEach(() => vi.restoreAllMocks());
describe("track fallback traversal", () => {
	it.each([
		["available B", { 1: { fallback: 2 } }, 2, [1, 2], 0],
		["self cycle", { 1: { fallback: "1" } }, 0, [1], 1],
		[
			"two-track cycle",
			{ 1: { fallback: 2 }, 2: { fallback: "1" } },
			0,
			[1, 2],
			1,
		],
		[
			"valid chain",
			{ 1: { fallback: 2 }, 2: { fallback: 3 } },
			3,
			[1, 2, 3],
			0,
		],
		["resolved alias", { 1: { fallback: 2 }, 2: { id: "1" } }, 0, [1], 1],
	])("terminates %s", async (_, edges, available, expected, failed) => {
		const s = setup(edges as any, available as number);
		await s.d.downloadWrapper(extra);
		expect(s.attempts).toEqual(expected);
		expect(s.object.failed).toBe(failed);
		expect(s.object.errors).toHaveLength(failed as number);
	});
	it("consumes repeated ISRC candidates then succeeds", async () => {
		const s = setup({}, 3, { fallbackISRC: true });
		s.track.albumsFallback = [20, 10];
		s.dz.gw.get_album_page.mockImplementation(async (id) => ({
			SONGS: { data: [{ ISRC: "X", SNG_ID: id === 10 ? "1" : 3 }] },
		}));
		expect(await s.d.downloadWrapper(extra)).toEqual({ id: 3 });
		expect(s.dz.gw.get_album_page).toHaveBeenCalledTimes(2);
	});
	it("propagates history through search and tries search once", async () => {
		const s = setup({ 2: { fallback: 1 } }, 0, { fallbackSearch: true });
		s.dz.api.get_track_id_from_metadata.mockResolvedValue(2);
		await s.d.downloadWrapper(extra);
		expect(s.attempts).toEqual([1, 2]);
		expect(s.object.failed).toBe(1);
		expect(s.dz.api.get_track_id_from_metadata).toHaveBeenCalledTimes(1);
	});
	it("allows search success", async () => {
		const s = setup({}, 2, { fallbackSearch: true });
		s.dz.api.get_track_id_from_metadata.mockResolvedValue(2);
		expect(await s.d.downloadWrapper(extra)).toEqual({ id: 2 });
	});
	it("keeps retry history separate for consecutive tracks", async () => {
		const s = setup({ 1: { fallback: 2 } }, 2);
		await s.d.downloadWrapper(extra);
		s.track.id = 1;
		s.track.fallbackID = 2;
		await s.d.downloadWrapper(extra);
		expect(s.attempts).toEqual([1, 2, 1, 2]);
	});
	it("does not refetch original metadata on an actual download retry", async () => {
		const d = new Downloader({} as any, { size: 1 } as any, {} as any, {
			send: vi.fn(),
		});
		const track = new Track();
		track.id = 2;
		track.MD5 = 0;
		const parse = vi.spyOn(track, "parseData").mockResolvedValue(undefined);
		await expect(d.download(extra, track)).rejects.toMatchObject({
			errid: "notEncoded",
			track,
		});
		expect(parse).not.toHaveBeenCalled();
		expect(track.id).toBe(2);
	});
});
