import { checkNewRelease } from "../../../src/utils/dates.js";

describe("date utils", () => {
  describe("checkNewRelease", () => {
    it("returns a positive result checking today's date", () => {
      expect(checkNewRelease(new Date())).toBe(true);
    });

    it("returns a negative result checking a week ago's date", () => {
      const dateToCheck = new Date();
      dateToCheck.setDate(dateToCheck.getDate() - 7);

      expect(checkNewRelease(dateToCheck)).toBe(false);
    });
  });
});
