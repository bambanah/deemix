import { findQueuedItem, getQueueKeyFromLink } from "./queueKeys.js";

describe("queueKeys", () => {
	test.each([
		["https://www.deezer.com/track/3135556", "track_3135556"],
		["https://www.deezer.com/en/album/302127?utm=x", "album_302127"],
		["https://deezer.com/es/playlist/1479458365/", "playlist_1479458365"],
		["https://www.deezer.com/artist/27/top_track", "playlist_27_top_track"],
		[
			"https://open.spotify.com/playlist/37i9dQZF1DX",
			"spotify_playlist_37i9dQZF1DX",
		],
	])("getQueueKeyFromLink(%s)", (link, key) => {
		expect(getQueueKeyFromLink(link)).toBe(key);
	});

	test.each([
		"https://www.deezer.com/artist/27",
		"https://www.deezer.com/artist/27/discography",
		"https://deezer.page.link/abc",
		"https://open.spotify.com/track/123",
		"https://www.deezer.com/track/1;https://www.deezer.com/track/2",
		"",
	])("getQueueKeyFromLink(%s) is null", (link) => {
		expect(getQueueKeyFromLink(link)).toBeNull();
	});

	test("findQueuedItem ignores the bitrate", () => {
		const queue = {
			album_302127_3: { type: "album", id: "302127", uuid: "album_302127_3" },
		};

		expect(findQueuedItem(queue, "album_302127")?.uuid).toBe("album_302127_3");
		expect(findQueuedItem(queue, "album_1")).toBeUndefined();
	});
});
