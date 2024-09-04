import { upperCaseFirstLowerCaseRest } from "../../../utils/texts";

describe("texts utils", () => {
	describe("upperCaseFirstLowerCaseRest", () => {
		it("converts a full uppercase string", () => {
			expect(upperCaseFirstLowerCaseRest("TEST STRING")).toBe("Test string");
		});

		it("converts a full lowercase string", () => {
			expect(upperCaseFirstLowerCaseRest("test string")).toBe("Test string");
		});

		it("converts a mixed string", () => {
			expect(upperCaseFirstLowerCaseRest("i wOn'T woRK")).toBe("I won't work");
		});
	});
});
