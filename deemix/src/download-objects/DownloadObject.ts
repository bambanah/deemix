export class DownloadObject {
	type: "track" | "album" | "playlist" | "artist" | "spotify_playlist";
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
			Math.floor(this.progressNext) % 10 === 0 &&
			Math.round(this.progressNext) !== 100
		) {
			this.progress = Math.floor(this.progressNext);
			if (listener)
				listener.send("updateQueue", {
					uuid: this.uuid,
					title: this.title,
					progress: this.progress,
				});
		}
	}
}
