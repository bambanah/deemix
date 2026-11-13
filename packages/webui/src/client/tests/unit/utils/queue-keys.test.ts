import {
	getDownloadStateFromItem,
	getQueueKey,
	getQueueKeyFromLink,
} from "../../../utils/queue-keys";

describe("queue keys", () => {
	test.each([
		["https://www.deezer.com/track/3135556", "track_3135556"],
		["https://www.deezer.com/en/album/302127?utm=x", "album_302127"],
		["https://deezer.com/es/playlist/1479458365/", "playlist_1479458365"],
		["https://www.deezer.com/artist/27/top_track", "playlist_27_top_track"],
		[
			"https://open.spotify.com/playlist/37i9dQZF1DX",
			"spotify_playlist_37i9dQZF1DX",
		],
	])("getQueueKeyFromLink(%s) -> %s", (link, key) => {
		expect(getQueueKeyFromLink(link)).toBe(key);
	});

	test.each([
		"https://www.deezer.com/artist/27",
		"https://www.deezer.com/artist/27/discography",
		"https://deezer.page.link/abc",
		"https://www.deezer.com/track/1;https://www.deezer.com/track/2",
		"",
	])("getQueueKeyFromLink(%s) is null", (link) => {
		expect(getQueueKeyFromLink(link)).toBeNull();
	});

	test("getQueueKey matches the link key regardless of bitrate", () => {
		const item = { type: "album", id: "302127", uuid: "album_302127_9" };
		expect(getQueueKey(item)).toBe(
			getQueueKeyFromLink("https://www.deezer.com/album/302127")
		);
	});

	test("getDownloadStateFromItem", () => {
		expect(getDownloadStateFromItem({ status: "inQueue" })).toBe("queued");
		expect(getDownloadStateFromItem({})).toBe("queued");
		expect(getDownloadStateFromItem({ status: "downloading" })).toBe(
			"downloading"
		);
		expect(getDownloadStateFromItem({ status: "converting" })).toBe(
			"downloading"
		);
		expect(
			getDownloadStateFromItem({
				status: "download finished",
				size: 10,
				failed: 1,
			})
		).toBe("finished");
		expect(
			getDownloadStateFromItem({
				status: "download finished",
				size: 2,
				failed: 2,
			})
		).toBe("error");
	});
});
