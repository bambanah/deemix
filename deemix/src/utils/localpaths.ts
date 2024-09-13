import { execSync } from "child_process";
import fs from "fs";
import { homedir } from "os";
import { sep } from "path";
import { canWrite } from "../utils/core.js";

const homedata = homedir();
let userdata = "";
let musicdata = "";

function checkPath(path: string) {
	if (path === "") return "";
	if (!fs.existsSync(path)) return "";
	if (!canWrite(path)) return "";
	return path;
}

export function getConfigFolder() {
	if (userdata !== "") return userdata;

	if (process.env.DEEMIX_DATA_DIR)
		return process.env.DEEMIX_DATA_DIR.replace(/\/*$/, "") + "/";

	if (process.env.XDG_CONFIG_HOME && userdata === "") {
		userdata = `${process.env.XDG_CONFIG_HOME}${sep}`;
		userdata = checkPath(userdata);
	}
	if (process.env.APPDATA && userdata === "") {
		userdata = `${process.env.APPDATA}${sep}`;
		userdata = checkPath(userdata);
	}
	if (process.platform === "darwin" && userdata === "") {
		userdata = `${homedata}/Library/Application Support/`;
		userdata = checkPath(userdata);
	}
	if (userdata === "") {
		userdata = `${homedata}${sep}.config${sep}`;
		userdata = checkPath(userdata);
	}

	if (userdata === "") userdata = `${process.cwd()}${sep}config${sep}`;
	else userdata += `deemix${sep}`;

	return userdata;
}

export function getMusicFolder() {
	if (musicdata !== "") return musicdata;

	if (process.env.DEEMIX_MUSIC_DIR)
		return process.env.DEEMIX_MUSIC_DIR.replace(/\/*$/, "") + "/";

	if (process.env.XDG_MUSIC_DIR && musicdata === "") {
		musicdata = `${process.env.XDG_MUSIC_DIR}${sep}`;
		musicdata = checkPath(musicdata);
	}
	if (fs.existsSync(`${homedata}${sep}.config${sep}user-dirs.dirs`)) {
		const userDirs = fs
			.readFileSync(`${homedata}${sep}.config${sep}user-dirs.dirs`)
			.toString();
		musicdata = userDirs.match(/XDG_MUSIC_DIR="(.*)"/)[1];
		musicdata = musicdata.replace(
			/\$([A-Z_]+[A-Z0-9_]*)/gi,
			(_, envName) => process.env[envName]
		);
		musicdata += sep;
		musicdata = checkPath(musicdata);
	}
	if (process.platform === "win32" && musicdata === "") {
		try {
			const musicKeys = ["My Music", "{4BD8D571-6D19-48D3-BE97-422220080E43}"];
			const regData = execSync(
				'reg.exe query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Shell Folders"'
			)
				.toString()
				.split("\r\n");
			for (let i = 0; i < regData.length; i++) {
				const line = regData[i];
				if (line === "") continue;
				if (i === 1) continue;
				const lines = line.split("    ");
				if (musicKeys.includes(lines[1])) {
					musicdata = lines[3] + sep;
					break;
				}
			}
			musicdata = checkPath(musicdata);
		} catch {
			/* empty */
		}
	}
	if (musicdata === "") {
		musicdata = `${homedata}${sep}Music${sep}`;
		musicdata = checkPath(musicdata);
	}

	if (musicdata === "") musicdata = `${process.cwd()}${sep}music${sep}`;
	else musicdata += `deemix Music${sep}`;

	return musicdata;
}
