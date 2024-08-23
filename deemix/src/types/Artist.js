const { Picture } = require("./Picture.js");
const { VARIOUS_ARTISTS } = require("./index.js");

class Artist {
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

module.exports = {
	Artist,
};
