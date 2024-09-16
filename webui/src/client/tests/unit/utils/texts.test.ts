import { upperCaseFirstLowerCaseRest } from "../../../utils/texts";

describe("texts utils", () => {
	describe("upperCaseFirstLowerCaseRest", () => {
		test("converts a full uppercase string", () => {
			expect(upperCaseFirstLowerCaseRest("TEST STRING")).toBe("Test string");
		});

		test("converts a full lowercase string", () => {
			expect(upperCaseFirstLowerCaseRest("test string")).toBe("Test string");
		});

		test("converts a mixed string", () => {
			expect(upperCaseFirstLowerCaseRest("i wOn'T woRK")).toBe("I won't work");
		});
	});
});
