import { appSendPost } from "../../../../tests/utils";

describe("loginArl requests", () => {
	it("should respond 200 to calls with arl", async () => {
		const responseStatusCollector: number[] = [];
		const batchCalls = ["/api/loginArl/?arl=abcdef1234"];

		for (const uri of batchCalls) {
			responseStatusCollector.push((await appSendPost(uri)).status);
		}

		expect(responseStatusCollector).toMatchObject(
			new Array(batchCalls.length).fill(200)
		);
		expect(responseStatusCollector).toMatchObject(
			new Array(responseStatusCollector.length).fill(200)
		);
	});

	it("should respond 400 to calls without arl", async () => {
		const responseStatusCollector: number[] = [];
		const batchCalls = [
			"/api/loginArl/",
			"/api/loginArl/?dummy=test",
			"/api/loginArl/?email=aaa@aa.com",
		];

		for (const uri of batchCalls) {
			responseStatusCollector.push((await appSendPost(uri)).status);
		}

		expect(responseStatusCollector).toMatchObject(
			new Array(responseStatusCollector.length).fill(400)
		);
	});

	it("should login using ARL", async () => {
		const response = await appSendPost(
			`/api/loginArl/?arl=${process.env.DEEZER_ARL}`
		);

		expect(response.status).toBe(200);
		expect(response.body.status).toBe(true);
	});

	it("should not login using wrong ARL", async () => {
		const response = await appSendPost(`/api/loginArl/?arl=abcdef1234`);

		expect(response.status).toBe(200);
		expect(response.body.status).toBe(false);
	});
});
