import { appSendGet } from "@/tests/utils.js";

describe("albumSearch requests", () => {
	it("should respond 200 to calls with term", async () => {
		const batchCalls = [
			"/api/album-search/?term=eminem",
			"/api/album-search/?term=eminem?start=10",
			"/api/album-search/?term=eminem?ack=aa",
			"/api/album-search/?term=eminem?ack=aa?start=10",
			"/api/album-search/?term=eminem?ack=aa?start=10?nb=34",
		];

		for (const uri of batchCalls) {
			appSendGet(uri).expect(200);
		}
	});

	it("should respond 400 to calls without term", async () => {
		const responseStatusCollector: number[] = [];
		const batchCalls = [
			"/api/album-search/",
			"/api/album-search/?start=10",
			"/api/album-search/?ack=aa",
			"/api/album-search/?ack=aa?start=10",
			"/api/album-search/?ack=aa?start=10?nb=34",
		];

		for (const uri of batchCalls) {
			appSendGet(uri).expect(400);
		}
	});

	it("should respond the desired search result", async () => {
		appSendGet("/api/album-search/?term=eminem")
			.expect(200)
			.expect((res) => {
				expect(res.body.data.length).not.toBe(0);
			});
	});

	it.skip("should respond the desired search result with a start parameter", async () => {
		appSendGet("/api/album-search/?term=eminem?start=10")
			.expect(200)
			.expect((res) => {
				expect(res.body.data.length).not.toBe(0);
			});
	});
});
