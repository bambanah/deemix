export class IDownloadObject {
	type: any;
	id: any;
	bitrate: number;
	title: any;
	artist: any;
	cover: any;
	explicit: any;
	size: any;
	downloaded: number;
	failed: number;
	progress: any;
	errors: any;
	files: any;
	extrasPath: any;
	progressNext: number;
	uuid: string;
	isCanceled: boolean;
	__type__: "Single" | "Collection" | "Convertable";

	constructor(obj) {
		this.type = obj.type;
		this.id = obj.id;
		this.bitrate = obj.bitrate;
		this.title = obj.title;
		this.artist = obj.artist;
		this.cover = obj.cover;
		this.explicit = obj.explicit || false;
		this.size = obj.size;
		this.downloaded = obj.downloaded || 0;
		this.failed = obj.failed || 0;
		this.progress = obj.progress || 0;
		this.errors = obj.errors || [];
		this.files = obj.files || [];
		this.extrasPath = obj.extrasPath || "";
		this.progressNext = 0;
		this.uuid = `${this.type}_${this.id}_${this.bitrate}`;
		this.isCanceled = false;
		this.__type__ = null;
	}

	toDict() {
		return {
			type: this.type,
			id: this.id,
			bitrate: this.bitrate,
			uuid: this.uuid,
			title: this.title,
			artist: this.artist,
			cover: this.cover,
			explicit: this.explicit,
			size: this.size,
			downloaded: this.downloaded,
			failed: this.failed,
			progress: this.progress,
			errors: this.errors,
			files: this.files,
			extrasPath: this.extrasPath,
			__type__: this.__type__,
		};
	}

	getSlimmedDict() {
		const light = this.toDict();
		const propertiesToDelete = [
			"single",
			"collection",
			"plugin",
			"conversion_data",
		];
		propertiesToDelete.forEach((property) => {
			if (Object.keys(light).includes(property)) {
				delete light[property];
			}
		});
		return light;
	}

	getEssentialDict() {
		return {
			type: this.type,
			id: this.id,
			bitrate: this.bitrate,
			uuid: this.uuid,
			title: this.title,
			artist: this.artist,
			cover: this.cover,
			explicit: this.explicit,
			size: this.size,
			extrasPath: this.extrasPath,
		};
	}

	updateProgress(listener) {
		if (
			Math.floor(this.progressNext) !== this.progress &&
			Math.floor(this.progressNext) % 2 === 0
		) {
			this.progress = Math.floor(this.progressNext);
			if (listener)
				listener.send("updateQueue", {
					uuid: this.uuid,
					progress: this.progress,
				});
		}
	}
}

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
