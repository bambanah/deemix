import type { DeezerTrack } from "deezer-sdk";
import { DownloadObject } from "./DownloadObject.js";

export class Single extends DownloadObject {
	single: DeezerTrack;

	constructor({
		single,
		...rest
	}: { single: DeezerTrack } & Partial<DownloadObject>) {
		super(rest);
		this.size = 1;
		this.single = single;
		this.__type__ = "Single";
	}

	override toDict() {
		const item = super.toDict();

		return { ...item, single: this.single };
	}

	completeTrackProgress(listener) {
		this.progressNext = 100;
		this.updateProgress(listener);
	}

	removeTrackProgress(listener) {
		this.progressNext = 0;
		this.updateProgress(listener);
	}
}
