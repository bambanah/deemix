import { IDownloadObject } from "./DownloadObject.js";

export class Collection extends IDownloadObject {
	collection: any;

	constructor(obj) {
		super(obj);
		this.collection = obj.collection;
		this.__type__ = "Collection";
	}

	override toDict() {
		const item = super.toDict();

		return { ...item, collection: this.collection };
	}

	completeTrackProgress(listener) {
		this.progressNext += (1 / this.size) * 100;
		this.updateProgress(listener);
	}

	removeTrackProgress(listener) {
		this.progressNext -= (1 / this.size) * 100;
		this.updateProgress(listener);
	}
}

export class Convertable extends Collection {
	plugin: string;
	conversion_data: any;

	constructor(obj) {
		super(obj);
		this.plugin = obj.plugin;
		this.conversion_data = obj.conversion_data;
		this.__type__ = "Convertable";
	}

	override toDict() {
		const item = super.toDict();

		return {
			...item,
			plugin: this.plugin,
			conversion_data: this.conversion_data,
		};
	}
}
