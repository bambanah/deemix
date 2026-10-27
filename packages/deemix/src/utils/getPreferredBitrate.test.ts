import { describe, expect, it, vi } from "vitest";
import { TrackFormats } from "deezer-sdk";
import Track from "../types/Track.js";
import { getPreferredBitrate } from "./getPreferredBitrate.js";
function setup(
	edges: Record<string, any>,
	success: (id: any, format: string) => boolean
) {
	const track = new Track();
	Object.assign(track, {
		id: 1,
		fallbackID: edges[1]?.fallback ?? 0,
		trackToken: "1",
		filesizes: { flac: "1", mp3_320: "1", mp3_128: "1" },
	});
	vi.spyOn(track, "checkAndRenewTrackToken").mockResolvedValue(undefined);
	const dz = {
		currentUser: { can_stream_lossless: true, can_stream_hq: true },
		gw: {
			get_track_with_fallback: vi.fn(async (id) => {
				if (dz.gw.get_track_with_fallback.mock.calls.length > 8)
					throw new Error("Safety stop: cyclic bitrate traversal");
				return {
					SNG_ID: edges[id]?.id ?? id,
					TRACK_TOKEN: String(edges[id]?.id ?? id),
					FILESIZE_FLAC: "1",
					FILESIZE_MP3_320: "1",
					FILESIZE_MP3_128: "1",
					FALLBACK: { SNG_ID: edges[id]?.fallback ?? 0 },
				};
			}),
		},
		get_track_url: vi.fn(async (token, format) =>
			success(token, format) ? "https://test/media" : undefined
		),
	} as any;
	return { track, dz };
}
describe("bitrate fallback traversal", () => {
	it.each([
		["self cycle", { 1: { fallback: "1" } }, 0],
		["two-track cycle", { 1: { fallback: 2 }, 2: { fallback: "1" } }, 1],
		["resolved alias", { 1: { fallback: 2 }, 2: { id: "1" } }, 1],
	])("exhausts FLAC %s and still tests MP3", async (_, edges, calls) => {
		const s = setup(edges, (id, format) => format === "MP3_320" && id === "1");
		expect(
			await getPreferredBitrate(
				s.dz,
				s.track,
				TrackFormats.FLAC,
				true,
				false,
				"",
				null
			)
		).toBe(TrackFormats.MP3_320);
		expect(s.dz.gw.get_track_with_fallback).toHaveBeenCalledTimes(calls);
		expect(s.track.urls.MP3_320).toBe("https://test/media");
	});
	it("allows A to B to C success", async () => {
		const s = setup(
			{ 1: { fallback: 2 }, 2: { fallback: 3 } },
			(id) => id === "3"
		);
		expect(
			await getPreferredBitrate(
				s.dz,
				s.track,
				TrackFormats.FLAC,
				true,
				false,
				"",
				null
			)
		).toBe(TrackFormats.FLAC);
		expect(s.track.id).toBe(3);
		expect(s.dz.gw.get_track_with_fallback).toHaveBeenCalledTimes(2);
	});
	it("retains failure when bitrate fallback is disabled", async () => {
		const s = setup({ 1: { fallback: 1 } }, () => false);
		await expect(
			getPreferredBitrate(
				s.dz,
				s.track,
				TrackFormats.FLAC,
				false,
				false,
				"",
				null
			)
		).rejects.toMatchObject({ name: "PreferredBitrateNotFound" });
	});
	it("returns unavailable default after exhausting formats", async () => {
		const s = setup({ 1: { fallback: 2 }, 2: { fallback: 1 } }, () => false);
		expect(
			await getPreferredBitrate(
				s.dz,
				s.track,
				TrackFormats.FLAC,
				true,
				false,
				"",
				null
			)
		).toBe(TrackFormats.DEFAULT);
		expect(s.track.urls.MP3_MISC).toBeUndefined();
		expect(s.dz.gw.get_track_with_fallback).toHaveBeenCalledTimes(3);
	});
});
