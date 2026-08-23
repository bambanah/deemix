import fs, { mkdtempSync } from "fs";
import { tmpdir } from "os";
import path, { sep } from "path";
import { readLoginCredentials, writeLoginCredentials } from "./credentials.js";

const loginJson = () => path.join(configFolder, "login.json");

let configFolder: string;

beforeEach(() => {
	configFolder = mkdtempSync(path.join(tmpdir(), "deemix-credentials-")) + sep;
});

test("returns a null arl without writing when login.json is absent", () => {
	expect(readLoginCredentials(configFolder)).toEqual({ arl: null });
	expect(fs.existsSync(loginJson())).toBe(false);
});

test("reads a stored arl", () => {
	fs.writeFileSync(loginJson(), JSON.stringify({ arl: "abc" }));

	expect(readLoginCredentials(configFolder)).toEqual({ arl: "abc" });
});

test("returns a null arl for a malformed login.json", () => {
	fs.writeFileSync(loginJson(), "{ not json");

	expect(readLoginCredentials(configFolder)).toEqual({ arl: null });
});

test("creates the config folder when writing", () => {
	const missingFolder = path.join(configFolder, "nested") + sep;

	writeLoginCredentials(missingFolder, { arl: "abc" });

	expect(readLoginCredentials(missingFolder)).toEqual({ arl: "abc" });
});

test("works with a config folder that has no trailing separator", () => {
	const noTrailingSep = configFolder.replace(/\/$/, "");

	writeLoginCredentials(noTrailingSep, { arl: "abc" });

	expect(readLoginCredentials(noTrailingSep)).toEqual({ arl: "abc" });
	expect(fs.existsSync(loginJson())).toBe(true);
});
