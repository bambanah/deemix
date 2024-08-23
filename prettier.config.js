/** @type {import("prettier").Config} */
module.exports = {
	singleQuote: false,
	useTabs: true,
	endOfLine: "lf",
	trailingComma: "es5",
	overrides: [
		{
			files: "pnpm-lock.yaml",
			options: {
				singleQuote: true,
			},
		},
	],
};
