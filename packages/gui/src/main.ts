import { deemixApp } from "deemix-webui";
import {
	app,
	BrowserWindow,
	dialog,
	ipcMain,
	Menu,
	MenuItem,
	shell,
} from "electron";
import contextMenu from "electron-context-menu";
import fs from "fs";
import { fileURLToPath } from "node:url";
import { platform } from "os";
import { join } from "path";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";

// eslint-disable-next-line @typescript-eslint/no-require-imports
if (require("electron-squirrel-startup") === true) app.quit();

const argv = await yargs(hideBin(process.argv)).options({
	port: { type: "string", default: "6595" },
	host: { type: "string", default: "0.0.0.0" },
	dev: { type: "boolean", default: false },
}).argv;

import path from "node:path";

const PORT = process.env.DEEMIX_SERVER_PORT || argv.port;
process.env.DEEMIX_SERVER_PORT = PORT;
process.env.DEEMIX_HOST = argv.host;

let win: BrowserWindow | null = null;

const windowStatePath = join(app.getPath("userData"), "window-state.json");

function getWindowState() {
	try {
		const data = fs.readFileSync(windowStatePath, "utf-8");
		return JSON.parse(data);
	} catch {
		return { width: 800, height: 600, isMaximized: false };
	}
}

function saveWindowState(win: BrowserWindow) {
	if (!win) return;
	const bounds = win.getNormalBounds();
	const isMaximized = win.isMaximized();
	fs.writeFileSync(windowStatePath, JSON.stringify({ ...bounds, isMaximized }));
}

async function main() {
	const state = getWindowState();
	win = new BrowserWindow({
		width: state.width || 800,
		height: state.height || 600,
		x: state.x,
		y: state.y,
		useContentSize: true,
		autoHideMenuBar: true,
		icon: join(
			path.dirname(fileURLToPath(import.meta.url)),
			platform() === "win32" ? "build/icon.ico" : "build/64x64.png"
		),
		webPreferences: {
			preload: join(path.dirname(fileURLToPath(import.meta.url)), "preload.js"),
		},
	});

	if (state.isMaximized) {
		win.maximize();
	}

	if (process.env.NODE_ENV === "development") {
		win.setMenu(null);

		const menu = new Menu();
		menu.append(
			new MenuItem({
				label: "DevTools",
				submenu: [
					{
						role: "reload",
						accelerator: "f5",
						click: () => {
							win.reload();
						},
					},
					{
						role: "toggleDevTools",
						accelerator: "f12",
						click: () => {
							win.webContents.toggleDevTools();
						},
					},
				],
			})
		);
		Menu.setApplicationMenu(menu);
	}

	// Open links in external browser
	win.webContents.setWindowOpenHandler(({ url }) => {
		shell.openExternal(url);
		return { action: "deny" };
	});

	win.loadURL(`http://localhost:${PORT}`);

	win.on("close", () => {
		saveWindowState(win!);
		if (deemixApp.getSettings().settings.clearQueueOnExit) {
			deemixApp.cancelAllDownloads();
		}
	});
}

app.on("ready", async () => {
	main();

	contextMenu({
		showLookUpSelection: false,
		showSearchWithGoogle: false,
		showInspectElement: false,
	});

	// Only one istance per time
	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			main();
		}
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

ipcMain.on("openDownloadsFolder", () => {
	const { downloadLocation } = deemixApp.getSettings().settings;
	shell.openPath(downloadLocation);
});

ipcMain.on("selectDownloadFolder", async (event, downloadLocation) => {
	const path = await dialog.showOpenDialog(win, {
		defaultPath: downloadLocation,
		properties: ["openDirectory", "createDirectory"],
	});
	if (path.filePaths[0])
		win.webContents.send("downloadFolderSelected", path.filePaths[0]);
});
