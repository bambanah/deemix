import { signParameters } from "./lastfm.js";

describe("Last.fm API signatures", () => {
	test("signs sorted parameters with the application secret", () => {
		expect(
			signParameters({ method: "auth.getToken", api_key: "abc" }, "secret")
		).toBe("f86444211049e605f18c05a5964aabfc");
	});
});
