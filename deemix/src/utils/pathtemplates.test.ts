import { fixName, pad } from "./pathtemplates.js";

test("fix name", async () => {
	const fixed = fixName("track/:*");
	expect(fixed).toBe("track___");
});

test("pad name", () => {
	const settings = {
		paddingSize: 0,
		padTracks: true,
		padSingleDigit: true,
	};

	expect(pad(1, 12, settings)).toEqual("01");
	expect(pad(12, 12, settings)).toEqual("12");

	settings.paddingSize = 4;
	expect(pad(1, 2, settings)).toEqual("0001");
	expect(pad(12, 12, settings)).toEqual("0012");

	settings.padSingleDigit = false;
	settings.paddingSize = 1;
	expect(pad(1, 12, settings)).toEqual("1");
	expect(pad(12, 12, settings)).toEqual("12");

	settings.padTracks = false;

	expect(pad(1, 12, settings)).toEqual("1");
	expect(pad(12, 12, settings)).toEqual("12");
});
