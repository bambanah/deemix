import { IDownloadObject } from "./DownloadObject.js";

export class Single extends IDownloadObject {
	single: any;

	constructor(obj) {
		super(obj);
		this.size = 1;
		this.single = obj.single;
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
