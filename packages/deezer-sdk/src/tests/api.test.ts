import { Deezer } from "../deezer.js";

const deezer = new Deezer();

test("retrieves a track", async () => {
	const track = await deezer.api.getTrack(1283264142);
	expect(track.title).toBe("MONTERO (Call Me By Your Name)");
});

test("retrieves a track by ISRC", async () => {
	const track = await deezer.api.getTrackByISRC("USSM12100531");
	expect(track.title).toBe("MONTERO (Call Me By Your Name)");
});
