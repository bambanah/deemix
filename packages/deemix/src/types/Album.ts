import { removeDuplicateArtists, removeFeatures } from "@/utils/core.js";
import { type APIAlbum } from "deezer-sdk";
import { Artist } from "./Artist.js";
import { CustomDate } from "./CustomDate.js";
import { Picture } from "./Picture.js";
import { VARIOUS_ARTISTS } from "./index.js";

export class Album {
	id: string;
	title: string;
	name?: string;
	pic: any;
	artist: { Main: any[] };
	artists: any[];
	mainArtist: Artist | null;
	date: CustomDate;
	dateString: string;
	trackTotal: number;
	discTotal: number;
	embeddedCoverPath: string;
	embeddedCoverURL: string;
	explicit: boolean;
	genre: any[];
	barcode: string;
	label: string;
	copyright: string;
	recordType: string;
	bitrate: number;
	rootArtist: Artist | null;
	variousArtists: Artist | null;
	playlistId: null;
	owner: null;
	isPlaylist: boolean;
	playlistID: any;

	constructor(alb_id = "0", title = "", pic_md5 = "") {
		this.id = alb_id;
		this.title = title;
		this.pic = new Picture(pic_md5, "cover");
		this.artist = { Main: [] };
		this.artists = [];
		this.mainArtist = null;
		this.date = new CustomDate();
		this.dateString = "";
		this.trackTotal = 0;
		this.discTotal = 0;
		this.embeddedCoverPath = "";
		this.embeddedCoverURL = "";
		this.explicit = false;
		this.genre = [];
		this.barcode = "Unknown";
		this.label = "Unknown";
		this.copyright = "";
		this.recordType = "album";
		this.bitrate = 0;
		this.rootArtist = null;
		this.variousArtists = null;

		this.playlistId = null;
		this.owner = null;
		this.isPlaylist = false;
	}

	parseAlbum(albumAPI: APIAlbum) {
		this.title = albumAPI.title;

		// Getting artist image ID
		// ex: https://e-cdns-images.dzcdn.net/images/artist/f2bc007e9133c946ac3c3907ddc5d2ea/56x56-000000-80-0-0.jpg
		let art_pic = albumAPI.artist.picture_small;
		if (art_pic) art_pic = art_pic.slice(art_pic.indexOf("artist/") + 7, -24);
		else art_pic = "";
		this.mainArtist = new Artist(
			albumAPI.artist.id,
			albumAPI.artist.name,
			"Main",
			art_pic
		);
		if (albumAPI.root_artist) {
			let art_pic = albumAPI.root_artist.picture_small;
			art_pic = art_pic.slice(art_pic.indexOf("artist/") + 7, -24);
			this.rootArtist = new Artist(
				albumAPI.root_artist.id,
				albumAPI.root_artist.name,
				"Root",
				art_pic
			);
		}

		albumAPI.contributors.forEach((artist) => {
			const isVariousArtists = artist.id === VARIOUS_ARTISTS;
			const isMainArtist = artist.role === "Main";

			if (isVariousArtists) {
				this.variousArtists = new Artist(artist.id, artist.name, artist.role);
				return;
			}

			if (!this.artists.includes(artist.name)) {
				this.artists.push(artist.name);
			}

			if (
				isMainArtist ||
				(!this.artist.Main.includes(artist.name) && !isMainArtist)
			) {
				if (!this.artist[artist.role]) this.artist[artist.role] = [];
				this.artist[artist.role].push(artist.name);
			}
		});

		this.trackTotal = albumAPI.nb_tracks;
		this.recordType = albumAPI.record_type || this.recordType;

		this.barcode = albumAPI.upc || this.barcode;
		this.label = albumAPI.label || this.label;
		this.explicit = Boolean(albumAPI.explicit_lyrics || false);
		let release_date = albumAPI.release_date;
		if (albumAPI.original_release_date)
			release_date = albumAPI.original_release_date;
		if (release_date) {
			this.date.year = release_date.slice(0, 4);
			this.date.month = release_date.slice(5, 7);
			this.date.day = release_date.slice(8, 10);
			this.date.fixDayMonth();
		}

		this.discTotal = albumAPI.nb_disk || 1;
		this.copyright = albumAPI.copyright || "";

		if (this.pic.md5 === "") {
			if (albumAPI.md5_image) {
				this.pic.md5 = albumAPI.md5_image;
			} else if (albumAPI.cover_small) {
				// Getting album cover MD5
				// ex: https://e-cdns-images.dzcdn.net/images/cover/2e018122cb56986277102d2041a592c8/56x56-000000-80-0-0.jpg
				const alb_pic = albumAPI.cover_small;
				this.pic.md5 = alb_pic.slice(alb_pic.indexOf("cover/") + 6, -24);
			}
		}

		if (
			albumAPI.genres &&
			albumAPI.genres.data &&
			albumAPI.genres.data.length > 0
		) {
			albumAPI.genres.data.forEach((genre) => {
				this.genre.push(genre.name);
			});
		}
	}

	makePlaylistCompilation(playlist) {
		this.variousArtists = playlist.variousArtists;
		this.mainArtist = playlist.mainArtist;
		this.title = playlist.title;
		this.rootArtist = playlist.rootArtist;
		this.artist = playlist.artist;
		this.artists = playlist.artists;
		this.trackTotal = playlist.trackTotal;
		this.recordType = playlist.recordType;
		this.barcode = playlist.barcode;
		this.label = playlist.label;
		this.explicit = playlist.explicit;
		this.date = playlist.date;
		this.discTotal = playlist.discTotal;
		this.playlistID = playlist.playlistID;
		this.owner = playlist.owner;
		this.pic = playlist.pic;
		this.isPlaylist = true;
	}

	removeDuplicateArtists() {
		[this.artist, this.artists] = removeDuplicateArtists(
			this.artist,
			this.artists
		);
	}

	getCleanTitle() {
		return removeFeatures(this.title);
	}
}
