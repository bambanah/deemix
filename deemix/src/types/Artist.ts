import { Picture } from "./Picture.js";
import { VARIOUS_ARTISTS } from "./index.js";

export class Artist {
	id: number;
	name: string;
	pic: Picture;
	role: string;
	save: boolean;

	constructor(art_id: number = 0, name = "", role = "", pic_md5 = "") {
		this.id = art_id;
		this.name = name;
		this.pic = new Picture(pic_md5, "artist");
		this.role = role;
		this.save = true;
	}

	isVariousArtists() {
		return this.id === VARIOUS_ARTISTS;
	}
}
