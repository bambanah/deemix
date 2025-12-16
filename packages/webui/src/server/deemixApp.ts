import { CantStream, NotLoggedIn } from "@/helpers/errors.js";
import { logger } from "@/helpers/logger.js";
import { GUI_VERSION, WEBUI_PACKAGE_VERSION } from "@/helpers/versions.js";
import {
	Collection,
	Convertable,
	DEFAULT_SETTINGS,
	Downloader,
	generateDownloadObject,
	loadSettings,
	saveSettings,
	Single,
	SpotifyPlugin,
	utils,
	type DownloadObject,
	type Listener,
	type Settings,
	type SpotifySettings,
} from "deemix";
import { Deezer, setDeezerCacheDir } from "deezer-sdk";
import fs from "fs";
import got, { type Response as GotResponse } from "got";
import { sep } from "path";
import { v4 as uuidv4 } from "uuid";

// Functions
export const getAccessToken = utils.getDeezerAccessTokenFromEmailPassword;
export const getArlFromAccessToken = utils.getDeezerArlFromAccessToken;

// Constants
export const configFolder: string = utils.getConfigFolder();
setDeezerCacheDir(configFolder);
export const defaultSettings: Settings = DEFAULT_SETTINGS;

export const sessionDZ: Record<string, Deezer> = {};

type DeezerAvailable = "yes" | "no" | "no-network";

export class DeemixApp {
	queueOrder: string[];
	queue: Record<string, any>;
	currentJob: boolean | Downloader | null;

	deezerAvailable?: DeezerAvailable;
	latestVersion: string | null;

	plugins: Record<string, SpotifyPlugin>;
	settings: Settings;

	listener: Listener;

	constructor(listener: Listener) {
		this.settings = loadSettings(configFolder);

		this.queueOrder = [];
		this.queue = {};
		this.currentJob = null;

		this.plugins = {
			spotify: new SpotifyPlugin(),
		};
		this.latestVersion = null;
		this.listener = listener;

		this.plugins.spotify.setup();
		this.restoreQueueFromDisk();
	}

	async isDeezerAvailable() {
		if (this.deezerAvailable) return this.deezerAvailable;

		let response: GotResponse<string>;
		try {
			response = await got.get("https://www.deezer.com/", {
				headers: {
					Cookie:
						"dz_lang=en; Domain=deezer.com; Path=/; Secure; hostOnly=false;",
				},
				https: {
					rejectUnauthorized: false,
				},
				retry: {
					limit: 5,
				},
			});
		} catch (e) {
			logger.error(e);
			this.deezerAvailable = "no-network";

			return this.deezerAvailable;
		}
		const title = (
			response.body.match(/<title[^>]*>([^<]+)<\/title>/)![1] || ""
		).trim();

		this.deezerAvailable =
			title !== "Deezer will soon be available in your country." ? "yes" : "no";

		return this.deezerAvailable;
	}

	async getLatestVersion(force = false): Promise<string | null> {
		if (this.latestVersion === null || force) {
			try {
				const responseJson = await got
					.get(
						`https://raw.githubusercontent.com/bambanah/deemix/main/packages/${GUI_VERSION !== undefined ? "gui" : "webui"}/package.json`
					)
					.json();
				this.latestVersion = JSON.parse(JSON.stringify(responseJson)).version;
			} catch (e) {
				logger.error(e);
				this.latestVersion = "NotFound";
				return this.latestVersion;
			}
		}
		return this.latestVersion;
	}

	parseVersion(version: string | null): any {
		if (version === null || version === "continuous" || version === "NotFound")
			return null;
		try {
			const matchResult =
				version.match(/(\d+)\.(\d+)\.(\d+)-r(\d+)\.(.+)/) || [];
			return {
				year: parseInt(matchResult[1]),
				month: parseInt(matchResult[2]),
				day: parseInt(matchResult[3]),
				revision: parseInt(matchResult[4]),
				commit: matchResult[5] || "",
			};
		} catch (e) {
			logger.error(e);
			return null;
		}
	}

	isUpdateAvailable(): boolean {
		return (
			this.latestVersion.localeCompare(
				GUI_VERSION ?? WEBUI_PACKAGE_VERSION,
				undefined,
				{
					numeric: true,
				}
			) === 1
		);
	}

	getSettings() {
		return {
			settings: this.settings,
			defaultSettings,
			spotifySettings: this.plugins.spotify.getSettings(),
		};
	}

	saveSettings(newSettings: Settings, newSpotifySettings: SpotifySettings) {
		saveSettings(newSettings, configFolder);
		this.settings = newSettings;
		this.plugins.spotify.saveSettings(newSpotifySettings);
	}

	getQueue() {
		const result: any = {
			queue: this.queue,
			queueOrder: this.queueOrder,
		};

		if (this.currentJob instanceof Downloader) {
			result.current = this.currentJob.downloadObject.getSlimmedDict();
		}

		return result;
	}

	async addToQueue(
		dz: Deezer,
		url: string[],
		bitrate: number,
		retry: boolean = false
	) {
		if (!dz.loggedIn) throw new NotLoggedIn();
		if (
			!this.settings.feelingLucky &&
			((!dz.currentUser.can_stream_lossless && bitrate === 9) ||
				(!dz.currentUser.can_stream_hq && bitrate === 3))
		)
			throw new CantStream(bitrate);

		let downloadObjs: DownloadObject[] = [];
		const downloadErrors: any[] = [];
		let link = "";
		const requestUUID = uuidv4();

		if (url.length > 1) {
			this.listener.send("startGeneratingItems", {
				uuid: requestUUID,
				total: url.length,
			});
		}

		for (let i = 0; i < url.length; i++) {
			link = url[i];
			logger.info(`Adding ${link} to queue`);
			try {
				const downloadObj = await generateDownloadObject(
					dz,
					link,
					bitrate,
					this.plugins,
					this.listener
				);

				if (Array.isArray(downloadObj)) {
					downloadObjs = downloadObjs.concat(downloadObj);
				} else if (downloadObj) {
					downloadObjs.push(downloadObj);
				}
			} catch (e) {
				downloadErrors.push(e);
			}
		}

		if (downloadErrors.length) {
			downloadErrors.forEach((e) => {
				if (!e.errid) logger.error(e);
				this.listener.send("queueError", {
					link: e.link,
					error: e.message,
					errid: e.errid,
				});
			});
		}

		if (url.length > 1) {
			this.listener.send("finishGeneratingItems", {
				uuid: requestUUID,
				total: downloadObjs.length,
			});
		}

		const slimmedObjects: Record<string, any>[] = [];

		downloadObjs.forEach((downloadObj) => {
			// Check if element is already in queue
			if (Object.keys(this.queue).includes(downloadObj.uuid) && !retry) {
				this.listener.send("alreadyInQueue", downloadObj.getEssentialDict());
				return;
			}

			// Save queue status when adding something to the queue
			if (!fs.existsSync(configFolder + "queue"))
				fs.mkdirSync(configFolder + "queue");

			this.queueOrder.push(downloadObj.uuid);
			fs.writeFileSync(
				configFolder + `queue${sep}order.json`,
				JSON.stringify(this.queueOrder)
			);
			this.queue[downloadObj.uuid] = downloadObj.getEssentialDict();
			this.queue[downloadObj.uuid].status = "inQueue";

			fs.writeFileSync(
				configFolder + `queue${sep}${downloadObj.uuid}.json`,
				JSON.stringify({ ...downloadObj.toDict(), status: "inQueue" })
			);

			slimmedObjects.push(downloadObj.getSlimmedDict());
		});
		if (slimmedObjects.length === 1)
			this.listener.send("addedToQueue", slimmedObjects[0]);
		else this.listener.send("addedToQueue", slimmedObjects);

		this.startQueue(dz);
		return slimmedObjects;
	}

	async startQueue(dz: Deezer) {
		do {
			if (this.currentJob !== null || this.queueOrder.length === 0) {
				// Should not start another download
				return null;
			}
			this.currentJob = true; // lock currentJob

			let currentUUID: string;
			do {
				currentUUID = this.queueOrder.shift() || "";
			} while (this.queue[currentUUID] === undefined && this.queueOrder.length);
			if (this.queue[currentUUID] === undefined) {
				fs.writeFileSync(
					configFolder + `queue${sep}order.json`,
					JSON.stringify(this.queueOrder)
				);
				this.currentJob = null;
				return null;
			}
			this.queue[currentUUID].status = "downloading";
			const currentItem = JSON.parse(
				fs
					.readFileSync(configFolder + `queue${sep}${currentUUID}.json`)
					.toString()
			);
			let downloadObject: Single | Collection | Convertable | undefined =
				undefined;

			switch (currentItem.__type__) {
				case "Single":
					downloadObject = new Single(currentItem);
					break;
				case "Collection":
					downloadObject = new Collection(currentItem);
					break;
				case "Convertable": {
					const convertable = new Convertable(currentItem);
					downloadObject = await this.plugins[convertable.plugin].convert(
						dz,
						convertable,
						this.settings,
						this.listener
					);
					fs.writeFileSync(
						configFolder + `queue${sep}${downloadObject.uuid}.json`,
						JSON.stringify({ ...downloadObject.toDict(), status: "inQueue" })
					);
					break;
				}
			}

			if (typeof downloadObject === "undefined") return;

			this.currentJob = new Downloader(
				dz,
				downloadObject,
				this.settings,
				this.listener
			);

			this.listener.send("startDownload", currentUUID);
			await this.currentJob.start();

			if (!downloadObject.isCanceled) {
				// Set status
				if (
					downloadObject.failed === downloadObject.size &&
					downloadObject.size !== 0
				) {
					this.queue[currentUUID].status = "failed";
				} else if (downloadObject.failed > 0) {
					this.queue[currentUUID].status = "withErrors";
				} else {
					this.queue[currentUUID].status = "completed";
				}

				const savedObject = {
					...downloadObject.getSlimmedDict(),
					status: this.queue[currentUUID].status,
				};
				// Save queue status
				this.queue[currentUUID] = savedObject;
				fs.writeFileSync(
					configFolder + `queue${sep}${currentUUID}.json`,
					JSON.stringify(savedObject)
				);
			}

			fs.writeFileSync(
				configFolder + `queue${sep}order.json`,
				JSON.stringify(this.queueOrder)
			);

			this.currentJob = null;
		} while (this.queueOrder.length);
	}

	cancelDownload(uuid: string) {
		if (Object.keys(this.queue).includes(uuid)) {
			switch (this.queue[uuid].status) {
				case "downloading":
					if (this.currentJob instanceof Downloader) {
						this.currentJob.downloadObject.isCanceled = true;
					}
					this.listener.send("cancellingCurrentItem", uuid);
					break;
				case "inQueue":
					this.queueOrder.splice(this.queueOrder.indexOf(uuid), 1);
					fs.writeFileSync(
						configFolder + `queue${sep}order.json`,
						JSON.stringify(this.queueOrder)
					);
					this.listener.send("removedFromQueue", { uuid });
					break;

				default:
					this.listener.send("removedFromQueue", { uuid });
					break;
			}
			fs.unlinkSync(configFolder + `queue${sep}${uuid}.json`);
			delete this.queue[uuid];
		}
	}

	cancelAllDownloads() {
		this.queueOrder = [];
		let currentItem: string | null = null;
		Object.values(this.queue).forEach((downloadObject: any) => {
			if (downloadObject.status === "downloading") {
				if (this.currentJob instanceof Downloader) {
					this.currentJob.downloadObject.isCanceled = true;
				}

				this.listener.send("cancellingCurrentItem", downloadObject.uuid);
				currentItem = downloadObject.uuid;
			}
			fs.unlinkSync(configFolder + `queue${sep}${downloadObject.uuid}.json`);
			delete this.queue[downloadObject.uuid];
		});
		fs.writeFileSync(
			configFolder + `queue${sep}order.json`,
			JSON.stringify(this.queueOrder)
		);
		this.listener.send("removedAllDownloads", currentItem);
	}

	clearCompletedDownloads() {
		Object.values(this.queue).forEach((downloadObject: any) => {
			if (downloadObject.status === "completed") {
				fs.unlinkSync(configFolder + `queue${sep}${downloadObject.uuid}.json`);
				delete this.queue[downloadObject.uuid];
			}
		});
		this.listener.send("removedFinishedDownloads");
	}

	restoreQueueFromDisk() {
		if (!fs.existsSync(configFolder + "queue"))
			fs.mkdirSync(configFolder + "queue");
		const allItems: string[] = fs.readdirSync(configFolder + "queue");
		allItems.forEach((filename: string) => {
			if (filename === "order.json") {
				try {
					this.queueOrder = JSON.parse(
						fs.readFileSync(configFolder + `queue${sep}order.json`).toString()
					);
				} catch {
					this.queueOrder = [];
					fs.writeFileSync(
						configFolder + `queue${sep}order.json`,
						JSON.stringify(this.queueOrder)
					);
				}
			} else {
				let currentItem: any;
				try {
					currentItem = JSON.parse(
						fs.readFileSync(configFolder + `queue${sep}${filename}`).toString()
					);
				} catch {
					fs.unlinkSync(configFolder + `queue${sep}${filename}`);
					return;
				}
				if (currentItem.status === "inQueue") {
					let downloadObject: any;
					switch (currentItem.__type__) {
						case "Single":
							downloadObject = new Single(currentItem);
							// Remove old incompatible queue items
							if (downloadObject.single.trackAPI_gw) {
								fs.unlinkSync(configFolder + `queue${sep}${filename}`);
								return;
							}
							break;
						case "Collection":
							downloadObject = new Collection(currentItem);
							// Remove old incompatible queue items
							if (downloadObject.collection.tracks_gw) {
								fs.unlinkSync(configFolder + `queue${sep}${filename}`);
								return;
							}
							break;
						case "Convertable":
							downloadObject = new Convertable(currentItem);
							break;
					}
					this.queue[downloadObject.uuid] = downloadObject.getEssentialDict();
					this.queue[downloadObject.uuid].status = "inQueue";
				} else {
					this.queue[currentItem.uuid] = currentItem;
				}
			}
		});
	}
}
