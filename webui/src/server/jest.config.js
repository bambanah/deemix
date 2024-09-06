import { createDefaultPreset } from "ts-jest";

const defaultPreset = createDefaultPreset();

export default {
	clearMocks: true,
	roots: ["<rootDir>/src", "<rootDir>/tests"],
	testEnvironment: "node",
	preset: "ts-jest",
	moduleNameMapper: {
		// Force module uuid to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
		uuid: require.resolve("uuid"),
	},
	setupFiles: ["dotenv/config"],
	...defaultPreset,
};
