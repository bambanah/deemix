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

	test("should reject an ARL containing non-hex characters", async () => {
		// e.g. the whole DevTools cookie row pasted in, surrounding text, etc.
		const malformed = ["arl\tabcdef1234\t.deezer.com", "not-hex!", "abc$123"];

		for (const arl of malformed) {
			const response = await appSendPost("/api/loginArl/").send({ arl });
			expect(response.status).toBe(200);
			expect(response.body.status).toBe(0);
			expect(response.body.error).toBe("invalidArl");
		}
	});

	test("should strip surrounding whitespace from the ARL", async () => {
		// A padded but otherwise hex value is cleaned, not rejected as invalid.
		const response = await appSendPost("/api/loginArl/").send({
			arl: "  abcdef1234\n",
		});

		expect(response.status).toBe(200);
		expect(response.body.error).toBeUndefined();
		expect(response.body.arl).toBe("abcdef1234");
	});
});
