import { appSendGet } from "../../../../tests/utils";

describe("analyzeLink requests", () => {
  it("should respond 200 to calls with supported child number", async () => {
    const res = await appSendGet("/api/changeAccount/?child=1");

    expect(res.status).toBe(200);
  });

  it("should respond 400 to calls with not supported child number", async () => {
    const res = await appSendGet("/api/changeAccount/");

    expect(res.status).toBe(400);
  });
});
