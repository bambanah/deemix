import {
	Deezer,
	TrackFormats,
	utils,
	type APIAlbum,
	type APITrack,
	type EnrichedAPITrack,
} from "deezer-sdk";
import { AlbumDoesntExists, NoDataToParse } from "../errors.js";
import { FeaturesOption } from "../settings.js";
import {
	andCommaConcat,
	changeCase,
	generateReplayGainString,
	removeDuplicateArtists,
	removeFeatures,
} from "../utils/index.js";
import { Album } from "./Album.js";
import { Artist } from "./Artist.js";
import { CustomDate } from "./CustomDate.js";
import { VARIOUS_ARTISTS } from "./index.js";
import { Lyrics } from "./Lyrics.js";
import { Picture } from "./Picture.js";
import { Playlist } from "./Playlist.js";
import type { Settings } from "./Settings.js";

const { mapGwTrackToDeezer: map_track, map_album } = utils;

export const formatsName = {
	[TrackFormats.FLAC]: "FLAC",
	[TrackFormats.LOCAL]: "MP3_MISC",
	[TrackFormats.MP3_320]: "MP3_320",
	[TrackFormats.MP3_128]: "MP3_128",
	[TrackFormats.DEFAULT]: "MP3_MISC",
	[TrackFormats.MP4_RA3]: "MP4_RA3",
	[TrackFormats.MP4_RA2]: "MP4_RA2",
	[TrackFormats.MP4_RA1]: "MP4_RA1",
} as const;

class Track {
	id: number = 0;
	name?: string;
	title: string = "";
	MD5?: number;
	mediaVersion?: number;
	trackToken: string = "";
	trackTokenExpiration?: number;
	duration: number = 0;
	fallbackID: number = 0;
	albumsFallback: any[] = [];
	filesizes: Record<string, any> = {};
	local: boolean = false;
	mainArtist: Artist | null = null;
	artist: { Main: any[]; Featured?: any[] } = { Main: [] };
	artists: any[] = [];
	album: Album | null = null;
	trackNumber: number = 0;
	discNumber: number = 0;
	date: CustomDate = new CustomDate();
	lyrics: Lyrics | null = null;
	bpm: number;
	contributors: Record<string, any> = {};
	copyright: string = "";
	explicit: boolean = false;
	ISRC: string = "";
	replayGain: string = "";
	playlist: Playlist | null = null;
	position: number | null = null;
	searched: boolean = false;
	bitrate: keyof typeof formatsName = 0;
	dateString: string = "";
	artistsString: string = "";
	mainArtistsString: string = "";
	featArtistsString: string = "";
	fullArtistsString: string = "";
	urls: Partial<
		Record<(typeof formatsName)[keyof typeof formatsName], string>
	> = {};
	downloadURL: string;
	rank: any;
	artistString: any;

	parseEssentialData(trackAPI: EnrichedAPITrack) {
		this.id = trackAPI.id;
		this.duration = trackAPI.duration;
		this.trackToken = trackAPI.track_token;
		this.trackTokenExpiration = trackAPI.track_token_expire;
		this.MD5 = trackAPI.md5_origin;
		this.mediaVersion = trackAPI.media_version;
		this.filesizes = trackAPI.filesizes;
		this.fallbackID = trackAPI.fallback_id ?? 0;
		this.local = this.id < 0;
		this.urls = {};
	}

	async enrichMetadata(dz: Deezer) {
		if (!this.id) throw new NoDataToParse();

		if (!this.album) {
			const gwTrack = await dz.gw.get_track_with_fallback(this.id);
			const mappedGwTrack = map_track(gwTrack);

			if (!this.position) this.position = mappedGwTrack.position;

			this.parseEssentialData(mappedGwTrack);

			if (!this.album) {
				this.album = new Album(
					mappedGwTrack.album.id,
					mappedGwTrack.album.title,
					mappedGwTrack.album.md5_origin || ""
				);
			}
		}

		// only public api has bpm
		if (!this.local && !this.bpm) {
			try {
				const apiTrack = await dz.api.getTrack(this.id);
				if (!this.position && apiTrack.position)
					this.position = apiTrack.position;

				if (this.local) {
					this.parseLocalTrackData(apiTrack);
				} else {
					this.parseTrack(apiTrack);
				}
			} catch {
				/* empty */
			}
		}

		if (!this.local) {
			// Get Lyrics Data
			if (!this.lyrics && this.lyrics.id !== "0") {
				try {
					this.lyrics = await dz.gw.get_track_lyrics(this.id);
				} catch {
					this.lyrics.id = "0";
				}
			}
			if (this.lyrics.id !== "0") {
				this.lyrics.parseLyrics(this.lyrics);
			}

			if (!this.album) {
				this.album = new Album();
			}

			// Get album Data
			// TODO: Missing genres and upc from album
			try {
				const apiAlbum = await dz.api.get_album(this.album.id);
				this.album.parseAlbum(apiAlbum);
			} catch (e) {
				console.error(e);
			}

			// Get album_gw Data
			// Only gw has disk number
			if (!this.album.trackTotal) {
				try {
					const gwAlbum = await dz.gw.get_album(this.album.id);
					const mappedAlbum = map_album(gwAlbum) as APIAlbum;
					this.album.parseAlbum(mappedAlbum);
				} catch (e) {
					console.error("Error getting gw album:", e);
				}
			}

			if (!this.album.id) throw new AlbumDoesntExists();

			// albumAPI_gw doesn't contain the artist cover
			// Getting artist image ID
			// ex: https://e-cdns-images.dzcdn.net/images/artist/f2bc007e9133c946ac3c3907ddc5d2ea/56x56-000000-80-0-0.jpg
			if (!this.album.mainArtist.pic.md5) {
				const artistAPI: any = await dz.api.get_artist(
					this.album.mainArtist.id
				);
				this.album.mainArtist.pic.md5 = artistAPI.picture_small.slice(
					artistAPI.picture_small.search("artist/") + 7,
					-24
				);
			}

			// Fill missing data
			if (this.album.date && !this.date) this.date = this.album.date;
		}

		// Remove unwanted charaters in track name
		// Example: track/127793
		this.title = this.title.replace(/\s\s+/g, " ");

		// Make sure there is at least one artist
		if (!this.artist.Main.length) {
			this.artist.Main = [this.mainArtist.name];
		}

		this.generateMainFeatStrings();
	}

	parseLocalTrackData(trackAPI: APITrack) {
		// Local tracks has only the trackAPI_gw page and
		// contains only the tags provided by the file
		this.title = trackAPI.title;
		this.album = new Album(trackAPI.album.title);
		this.album.pic = new Picture(trackAPI.md5_image || "", "cover");
		this.mainArtist = new Artist(0, trackAPI.artist.name, "Main");
		this.artists = [trackAPI.artist.name];
		this.artist = {
			Main: [trackAPI.artist.name],
		};
		this.album.artist = this.artist;
		this.album.artists = this.artists;
		this.album.date = this.date;
		this.album.mainArtist = this.mainArtist;
	}

	parseTrack(trackAPI: APITrack) {
		this.id = trackAPI.id;
		this.title = trackAPI.title;

		this.discNumber = trackAPI.disk_number;
		this.explicit = trackAPI.explicit_lyrics;
		this.copyright = trackAPI.copyright;
		if (trackAPI.gain)
			this.replayGain = generateReplayGainString(trackAPI.gain);
		this.ISRC = trackAPI.isrc;
		this.trackNumber = trackAPI.track_position;
		this.contributors = trackAPI.contributors;
		this.rank = trackAPI.rank;
		this.bpm = trackAPI.bpm;

		this.lyrics = new Lyrics(trackAPI.lyrics_id || "0");

		this.mainArtist = new Artist(
			trackAPI.artist.id,
			trackAPI.artist.name,
			"Main",
			trackAPI.artist.md5_image
		);

		if (trackAPI.physical_release_date) {
			this.date.day = trackAPI.physical_release_date.slice(8, 10);
			this.date.month = trackAPI.physical_release_date.slice(5, 7);
			this.date.year = trackAPI.physical_release_date.slice(0, 4);
			this.date.fixDayMonth();
		}

		trackAPI.contributors?.forEach((artist: any) => {
			const isVariousArtists = artist.id === VARIOUS_ARTISTS;
			const isMainArtist = artist.role === "Main";

			if (trackAPI.contributors.length > 1 && isVariousArtists) return;

			if (!this.artists.includes(artist.name)) {
				this.artists.push(artist.name);
			}

			if (
				isMainArtist ||
				(!this.artist.Main.includes(artist.name) && !isMainArtist)
			) {
				if (!this.artist[artist.role]) {
					this.artist[artist.role] = [];
				}
				this.artist[artist.role].push(artist.name);
			}
		});

		if (trackAPI.alternative_albums) {
			trackAPI.alternative_albums.data.forEach((album: any) => {
				if (
					album.RIGHTS.STREAM_ADS_AVAILABLE ||
					album.RIGHTS.STREAM_SUB_AVAILABLE
				) {
					this.albumsFallback.push(album.ALB_ID);
				}
			});
		}
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

	getFeatTitle() {
		if (this.featArtistsString && !this.title.toLowerCase().includes("feat.")) {
			return `${this.title} (${this.featArtistsString})`;
		}
		return this.title;
	}

	generateMainFeatStrings() {
		this.mainArtistsString = andCommaConcat(this.artist.Main);
		this.fullArtistsString = `${this.mainArtistsString}`;
		this.featArtistsString = "";
		if (this.artist.Featured) {
			this.featArtistsString = `feat. ${andCommaConcat(this.artist.Featured)}`;
			this.fullArtistsString += ` ${this.featArtistsString}`;
		}
	}

	async checkAndRenewTrackToken(dz: Deezer) {
		const now = new Date();
		const expiration = new Date(this.trackTokenExpiration * 1000);
		if (now > expiration) {
			const newTrack = await dz.gw.get_track_with_fallback(this.id);
			this.trackToken = newTrack.TRACK_TOKEN;
			this.trackTokenExpiration = newTrack.TRACK_TOKEN_EXPIRE;
		}
	}

	applySettings(settings: Settings) {
		// Check if should save the playlist as a compilation
		if (settings.tags.savePlaylistAsCompilation && this.playlist) {
			this.trackNumber = this.position;
			this.discNumber = 1;
			this.album.makePlaylistCompilation(this.playlist);
		} else {
			if (this.album.date) this.date = this.album.date;
		}
		this.dateString = this.date.format(settings.dateFormat);
		this.album.dateString = this.album.date.format(settings.dateFormat);
		if (this.playlist)
			this.playlist.dateString = this.playlist.date.format(settings.dateFormat);

		// Check various artist option
		if (settings.albumVariousArtists && this.album.variousArtists) {
			const artist = this.album.variousArtists;
			const isMainArtist = artist.role === "Main";

			if (!this.album.artists.includes(artist.name)) {
				this.album.artists.push(artist.name);
			}

			if (
				isMainArtist ||
				(!this.album.artist.Main.includes(artist.name) && !isMainArtist)
			) {
				if (!this.album.artist[artist.role]) {
					this.album.artist[artist.role] = [];
				}
				this.album.artist[artist.role].push(artist.name);
			}
		}
		this.album.mainArtist.save =
			!this.album.mainArtist.isVariousArtists() ||
			(settings.albumVariousArtists &&
				this.album.mainArtist.isVariousArtists());

		// Check removeDuplicateArtists
		if (settings.removeDuplicateArtists) {
			this.removeDuplicateArtists();
			this.generateMainFeatStrings();
		}

		// Check if user wants the feat in the title
		if (settings.featuredToTitle === FeaturesOption.REMOVE_TITLE) {
			this.title = this.getCleanTitle();
		} else if (settings.featuredToTitle === FeaturesOption.MOVE_TITLE) {
			this.title = this.getFeatTitle();
		} else if (settings.featuredToTitle === FeaturesOption.REMOVE_TITLE_ALBUM) {
			this.title = this.getCleanTitle();
			this.album.title = this.album.getCleanTitle();
		}

		// Remove (Album Version) from tracks that have that
		if (settings.removeAlbumVersion && this.title.includes("Album Version")) {
			this.title = this.title.replace(/ ?\(Album Version\)/g, "").trim();
		}

		// Change title and artist casing if needed
		if (settings.titleCasing !== "nothing") {
			this.title = changeCase(this.title, settings.titleCasing);
		}
		if (settings.artistCasing !== "nothing") {
			this.mainArtist.name = changeCase(
				this.mainArtist.name,
				settings.artistCasing
			);
			this.artists.forEach((artist, i) => {
				this.artists[i] = changeCase(artist, settings.artistCasing);
			});
			Object.keys(this.artist).forEach((art_type) => {
				this.artist[art_type].forEach((artist, i) => {
					this.artist[art_type][i] = changeCase(artist, settings.artistCasing);
				});
			});
			this.generateMainFeatStrings();
		}

		// Generate artist tag
		if (settings.tags.multiArtistSeparator === "default") {
			if (settings.featuredToTitle === FeaturesOption.MOVE_TITLE) {
				this.artistsString = this.artist.Main.join(", ");
			} else {
				this.artistString = this.artists.join(", ");
			}
		} else if (settings.tags.multiArtistSeparator === "andFeat") {
			this.artistsString = this.mainArtistsString;
			if (
				this.featArtistsString &&
				settings.featuredToTitle !== FeaturesOption.MOVE_TITLE
			) {
				this.artistsString += ` ${this.featArtistsString}`;
			}
		} else {
			const separator = settings.tags.multiArtistSeparator;
			if (settings.featuredToTitle === FeaturesOption.MOVE_TITLE) {
				this.artistsString = this.artist.Main.join(separator);
			} else {
				this.artistsString = this.artists.join(separator);
			}
		}
	}
}

export default Track;
