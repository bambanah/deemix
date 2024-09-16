import { checkNewRelease } from "../../../utils/dates";

describe("date utils", () => {
	describe("checkNewRelease", () => {
		test("returns a positive result checking today's date", () => {
			expect(checkNewRelease(new Date())).toBe(true);
		});

		test("returns a negative result checking a week ago's date", () => {
			const dateToCheck = new Date();
			dateToCheck.setDate(dateToCheck.getDate() - 7);

			expect(checkNewRelease(dateToCheck)).toBe(false);
		});
	});
});
