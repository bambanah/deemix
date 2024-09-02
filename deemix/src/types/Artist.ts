import { Picture } from "./Picture";
import { VARIOUS_ARTISTS } from "./index";

export class Artist {
	id: string;
	name: string;
	pic: Picture;
	role: string;
	save: boolean;

	constructor(art_id = "0", name = "", role = "", pic_md5 = "") {
		this.id = String(art_id);
		this.name = name;
		this.pic = new Picture(pic_md5, "artist");
		this.role = role;
		this.save = true;
	}

	isVariousArtists() {
		return this.id === VARIOUS_ARTISTS;
	}
}
