import { appSendGet } from "@/tests/utils.js";

describe("analyzeLink requests", () => {
	test("should respond 200 to calls with supported term", async () => {
		appSendGet(
			"/api/analyzeLink/?term=https://www.deezer.com/en/album/100896762"
		).expect(200);
	});

	test("should respond with an error to calls with not supported term", async () => {
		appSendGet(
			"/api/analyzeLink/?term=https://www.deezer.com/en/artist/15166511"
		)
			.expect(400)
			.expect((res) => {
				expect(res.body.errorMessage).toBe("Not supported");
			});
	});

	test("should respond album analyzed data", async () => {
		appSendGet(
			"/api/analyzeLink/?term=https://www.deezer.com/en/album/100896762"
		).expect((res) => {
			expect(res.body.type).toBe("album");
			expect(res.body.artist.name).toBe("Lil Nas X");
		});
	});

	test("should respond track analyzed data", async () => {
		appSendGet(
			"/api/analyzeLink/?term=https://www.deezer.com/en/track/1283264142"
		).expect((res) => {
			expect(res.body.type).toBe("track");
			expect(res.body.artist.name).toBe("Lil Nas X");
		});
	});
});
