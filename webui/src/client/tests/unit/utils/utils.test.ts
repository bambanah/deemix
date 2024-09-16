import {
	isValidURL,
	convertDuration,
	convertDurationSeparated,
} from "../../../utils/utils";

describe("utils utils (needs refactor)", () => {
	describe("isValidURL", () => {
		test("returns a positive result with all supported URLs", () => {
			expect(isValidURL("https://www.deezer.com")).toBe(true);
			expect(isValidURL("https://deezer.page.link")).toBe(true);
			expect(isValidURL("https://open.spotify.com")).toBe(true);
			expect(isValidURL("https://link.tospotify.com")).toBe(true);
			expect(isValidURL("spotify:something")).toBe(true);
		});

		test("returns a negative result with a not supported URL", () => {
			expect(isValidURL("https://www.google.com")).toBe(false);
		});
	});

	describe("convertDuration", () => {
		test("converts seconds in the correct format", () => {
			expect(convertDuration(120)).toBe("2:00");
			expect(convertDuration(60)).toBe("1:00");
			expect(convertDuration(30)).toBe("0:30");
		});
	});

	describe("convertDurationSeparated", () => {
		test("converts seconds in the correct format", () => {
			expect(convertDurationSeparated(120)).toStrictEqual([0, 2, 0]);
			expect(convertDurationSeparated(60)).toStrictEqual([0, 1, 0]);
			expect(convertDurationSeparated(30)).toStrictEqual([0, 0, 30]);
		});
	});
});
