import { appSendGet } from "../../../../tests/utils";

describe("analyzeLink requests", () => {
	it("should respond 200 to calls with supported term", async () => {
		const res = await appSendGet(
			"/api/analyzeLink/?term=https://www.deezer.com/en/album/100896762"
		);

		expect(res.status).toBe(200);
	});

	it("should respond with an error to calls with not supported term", async () => {
		const res = await appSendGet(
			"/api/analyzeLink/?term=https://www.deezer.com/en/artist/15166511"
		);

		expect(res.status).toBe(400);
		expect(res.body.errorMessage).toBe("Not supported");
	});

	it("should respond album analyzed data", async () => {
		const res = await appSendGet(
			"/api/analyzeLink/?term=https://www.deezer.com/en/album/100896762"
		);

		expect(res.body.type).toBe("album");
		expect(res.body.artist.name).toBe("Lil Nas X");
	});

	it("should respond track analyzed data", async () => {
		const res = await appSendGet(
			"/api/analyzeLink/?term=https://www.deezer.com/en/track/1283264142"
		);

		expect(res.body.type).toBe("track");
		expect(res.body.artist.name).toBe("Lil Nas X");
	});
});
