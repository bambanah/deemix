import { appSendPost } from "@/tests/utils.js";

describe("loginArl requests", () => {
	test("should respond 200 to calls with arl", async () => {
		const batchCalls = ["/api/loginArl/?arl=abcdef1234"];

		for (const uri of batchCalls) {
			appSendPost(uri).expect(200);
		}
	});

	test("should respond 400 to calls without arl", async () => {
		const batchCalls = [
			"/api/loginArl/",
			"/api/loginArl/?dummy=test",
			"/api/loginArl/?email=aaa@aa.com",
		];

		for (const uri of batchCalls) {
			appSendPost(uri).expect(400);
		}
	});

	test("should login using ARL", async () => {
		appSendPost(`/api/loginArl/?arl=${process.env.DEEZER_ARL}`)
			.expect(200)
			.expect((response) => expect(response.body.status).toBe(true));
	});

	test("should not login using wrong ARL", async () => {
		appSendPost(`/api/loginArl/?arl=abcdef1234`)
			.expect(200)
			.expect((response) => expect(response.body.status).toBe(false));
	});
});
