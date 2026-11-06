import type { Listener } from "@/types/listener.js";
import { DownloadObject } from "./DownloadObject.js";
import { type Track as SpotifyTrack } from "@spotify/web-api-ts-sdk";

export class Collection extends DownloadObject {
	collection: any;

	constructor(obj) {
		super(obj);
		// Completed queue items are persisted in slimmed form (see
		// DownloadObject.getSlimmedDict) without a collection payload. Default
		// it so a stale queue entry can never leave this undefined and crash
		// the downloader.
		this.collection = obj.collection ?? { tracks: [] };
		this.__type__ = "Collection";
	}

	override toDict() {
		const item = super.toDict();

		return { ...item, collection: this.collection };
	}

	completeTrackProgress(listener: Listener) {
		this.progressNext += (1 / this.size) * 100;
		this.updateProgress(listener);
	}

	removeTrackProgress(listener: Listener) {
		this.progressNext -= (1 / this.size) * 100;
		this.updateProgress(listener);
	}
}

export class Convertable extends Collection {
	plugin: string;
	conversionData: SpotifyTrack[];

	constructor(obj) {
		super(obj);
		this.plugin = obj.plugin;
		this.conversionData = obj.conversion_data;
		this.__type__ = "Convertable";
	}

	override toDict() {
		const item = super.toDict();

		return {
			...item,
			plugin: this.plugin,
			conversion_data: this.conversionData,
		};
	}
}
