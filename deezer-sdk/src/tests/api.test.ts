import { Deezer } from "@/deezer.js";

const deezer = new Deezer();

test("retrieves a track", async () => {
	const track = await deezer.api.get_track(1283264142);
	expect(track.title).toBe("MONTERO (Call Me By Your Name)");
});

test.skip("retrieves a track by ISRC", async () => {
	const track = await deezer.api.get_track_by_ISRC("USSM12100531");
	expect(track.title).toBe("MONTERO (Call Me By Your Name)");
});

test("retrieves an album", async () => {
	const album = await deezer.api.get_album(221543452);
	expect(album.title).toBe("Fearless (Taylor's Version)");
});
