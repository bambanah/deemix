import { Artist } from "./Artist.js";
import { CustomDate } from "./CustomDate.js";
import { Picture, StaticPicture } from "./Picture.js";

export class Playlist {
	id: string;
	title: any;
	artist: { Main: any[] };
	artists: any[];
	trackTotal: any;
	recordType: string;
	barcode: string;
	label: string;
	explicit: any;
	genre: string[];
	date: CustomDate;
	dateString?: string;
	discTotal: string;
	playlistID: any;
	owner: any;
	pic: Picture | StaticPicture;
	variousArtists: Artist;
	mainArtist: any;
	bitrate?: number;

	constructor(playlistAPI) {
		this.id = `pl_${playlistAPI.id}`;
		this.title = playlistAPI.title;
		this.artist = { Main: [] };
		this.artists = [];
		this.trackTotal = playlistAPI.nb_tracks;
		this.recordType = "compile";
		this.barcode = "";
		this.label = "";
		this.explicit = playlistAPI.explicit;
		this.genre = ["Compilation"];

		const year = playlistAPI.creation_date.slice(0, 4);
		const month = playlistAPI.creation_date.slice(5, 7);
		const day = playlistAPI.creation_date.slice(8, 10);
		this.date = new CustomDate(day, month, year);

		this.discTotal = "1";
		this.playlistID = playlistAPI.id;
		this.owner = playlistAPI.creator;

		if (playlistAPI.picture_small.includes("dzcdn.net")) {
			const url = playlistAPI.picture_small;
			let picType = url.slice(url.indexOf("images/") + 7);
			picType = picType.slice(0, picType.indexOf("/"));
			const md5 = url.slice(
				url.indexOf(picType + "/") + picType.length + 1,
				-24
			);
			this.pic = new Picture(md5, picType);
		} else {
			this.pic = new StaticPicture(playlistAPI.picture_xl);
		}

		if (playlistAPI.various_artist) {
			let pic_md5 = playlistAPI.various_artist.picture_small;
			pic_md5 = pic_md5.slice(pic_md5.indexOf("artist/") + 7, -24);
			this.variousArtists = new Artist(
				playlistAPI.various_artist.id,
				playlistAPI.various_artist.name,
				playlistAPI.various_artist.role,
				pic_md5
			);
			this.mainArtist = this.variousArtists;
		}
	}
}
