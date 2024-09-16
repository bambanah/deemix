import { appSendGet } from "@/tests/utils.js";

describe("analyzeLink requests", () => {
	test("should respond 200 to calls with supported child number", async () => {
		appSendGet("/api/changeAccount/?child=1").expect(200);
	});

	test("should respond 400 to calls with not supported child number", async () => {
		appSendGet("/api/changeAccount/").expect(400);
	});
});
