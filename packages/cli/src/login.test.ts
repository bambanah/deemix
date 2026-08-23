import type { Deezer } from "deezer-sdk";
import fs, { mkdtempSync } from "fs";
import { tmpdir } from "os";
import path, { sep } from "path";
import { deezerLogin } from "./login";

let promptedArl = "";

vi.mock("node:readline/promises", () => ({
	default: {
		createInterface: () => ({
			question: async () => promptedArl,
			close: () => {},
		}),
	},
}));

let configFolder: string;

const fakeDeezer = (validArl?: string) => {
	const dz = {
		loggedIn: false,
		attempted: [] as string[],
		async loginViaArl(arl: string) {
			dz.attempted.push(arl);
			dz.loggedIn = arl === validArl;
			return dz.loggedIn;
		},
	};
	return dz;
};

const login = (dz: ReturnType<typeof fakeDeezer>) =>
	deezerLogin(dz as unknown as Deezer, configFolder);

const loginJson = () => path.join(configFolder, "login.json");

const readStoredArl = () =>
	JSON.parse(fs.readFileSync(loginJson()).toString()).arl;

const originalIsTTY = process.stdin.isTTY;

beforeEach(() => {
	configFolder = mkdtempSync(path.join(tmpdir(), "deemix-cli-login-")) + sep;
	process.stdin.isTTY = false;
	promptedArl = "";
});

afterEach(() => {
	process.stdin.isTTY = originalIsTTY;
});

const mockExit = vi.spyOn(process, "exit").mockImplementation((code) => {
	throw new Error(`Exit with code ${code}`);
});

test("logs in with the arl from login.json", async () => {
	fs.writeFileSync(loginJson(), JSON.stringify({ arl: "abc" }));
	const dz = fakeDeezer("abc");

	expect(await login(dz)).toBe(true);
	expect(dz.attempted).toEqual(["abc"]);
});

test("copies a legacy .arl file into login.json and leaves it in place", async () => {
	fs.writeFileSync(path.join(configFolder, ".arl"), "legacy\n");
	const dz = fakeDeezer("legacy");

	expect(await login(dz)).toBe(true);
	expect(readStoredArl()).toBe("legacy");
	expect(fs.existsSync(path.join(configFolder, ".arl"))).toBe(true);
});

test("prefers login.json over a legacy .arl file", async () => {
	fs.writeFileSync(loginJson(), JSON.stringify({ arl: "abc" }));
	fs.writeFileSync(path.join(configFolder, ".arl"), "legacy");
	const dz = fakeDeezer("abc");

	expect(await login(dz)).toBe(true);
	expect(dz.attempted).toEqual(["abc"]);
});

test("recovers from a malformed login.json via the legacy .arl file", async () => {
	fs.writeFileSync(loginJson(), "{ not json");
	fs.writeFileSync(path.join(configFolder, ".arl"), "legacy");
	const dz = fakeDeezer("legacy");

	expect(await login(dz)).toBe(true);
	expect(readStoredArl()).toBe("legacy");
});

test("exits with an actionable message when no arl is stored and stdin is not a TTY", async () => {
	const stderr = vi.spyOn(console, "error").mockImplementation(() => {});

	await expect(login(fakeDeezer())).rejects.toThrow("Exit with code 1");

	expect(mockExit).toHaveBeenCalledWith(1);
	expect(stderr.mock.calls.flat().join("\n")).toMatch(/docker exec -it/);
});

test("exits without prompting when the stored arl is invalid and stdin is not a TTY", async () => {
	vi.spyOn(console, "error").mockImplementation(() => {});
	fs.writeFileSync(loginJson(), JSON.stringify({ arl: "old" }));

	await expect(login(fakeDeezer("new"))).rejects.toThrow("Exit with code 1");
});

test("stores an interactively prompted arl once it logs in", async () => {
	process.stdin.isTTY = true;
	promptedArl = "typed";

	expect(await login(fakeDeezer("typed"))).toBe(true);
	expect(readStoredArl()).toBe("typed");
});

test("does not store an interactively prompted arl that fails to log in", async () => {
	process.stdin.isTTY = true;
	promptedArl = "wrong";

	expect(await login(fakeDeezer("right"))).toBe(false);
	expect(fs.existsSync(loginJson())).toBe(false);
});
