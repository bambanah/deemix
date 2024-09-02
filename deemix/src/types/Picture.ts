export class Picture {
	md5: string;
	type: string;

	constructor(md5 = "", pic_type = "") {
		this.md5 = md5;
		this.type = pic_type;
	}

	getURL(size, format) {
		const url = `https://e-cdns-images.dzcdn.net/images/${this.type}/${this.md5}/${size}x${size}`;

		if (format.startsWith("jpg")) {
			let quality = 80;
			if (format.includes("-")) quality = parseInt(format.substr(4));
			format = "jpg";
			return url + `-000000-${quality}-0-0.jpg`;
		}
		if (format === "png") {
			return url + "-none-100-0-0.png";
		}

		return url + ".jpg";
	}
}

export class StaticPicture {
	staticURL: string;

	constructor(url: string) {
		this.staticURL = url;
	}

	getURL() {
		return this.staticURL;
	}
}
