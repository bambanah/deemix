import { fixName } from "./pathtemplates.js";

test("fix name", async () => {
	const fixed = fixName("track/:*");
	expect(fixed).toBe("track___");
});
