import { ID3Writer } from "browser-id3-writer";
import Metaflac from "metaflac-js2";
import fs from "fs";
import Track from "./types/Track.js";
import type { Tags } from "@/types/Settings.js";

function tagID3(path: string, track: Track, save: Tags) {
	const songBuffer = fs.readFileSync(path);
	const writer = new ID3Writer(songBuffer.buffer);

	if (save.title) writer.setFrame("TIT2", track.title);

	if (save.artist && track.artists.length) {
		if (save.multiArtistSeparator === "default") {
			writer.setFrame("TPE1", track.artists);
		} else {
			if (save.multiArtistSeparator === "nothing") {
				writer.setFrame("TPE1", [track.mainArtist.name]);
			} else {
				writer.setFrame("TPE1", [track.artistsString]);
			}
			// Tag ARTISTS is added to keep the multiartist support when using a non standard tagging method
			// https://picard-docs.musicbrainz.org/en/appendices/tag_mapping.html#artists
			if (save.artists) {
				writer.setFrame("TXXX", {
					description: "ARTISTS",
					value: track.artists.join(", "),
				});
			}
		}
	}

	if (save.album) writer.setFrame("TALB", track.album.title);

	if (save.albumArtist && track.album.artists.length) {
		if (save.singleAlbumArtist && track.album.mainArtist.save) {
			writer.setFrame("TPE2", track.album.mainArtist.name);
		} else {
			writer.setFrame("TPE2", track.album.artists.join(", "));
		}
	}

	if (save.trackNumber) {
		let trackNumber = String(track.trackNumber);
		if (save.trackTotal) trackNumber += `/${track.album.trackTotal}`;
		writer.setFrame("TRCK", trackNumber);
	}
	if (save.discNumber) {
		let discNumber = String(track.discNumber);
		if (save.discTotal) discNumber += `/${track.album.discTotal}`;
		writer.setFrame("TPOS", discNumber);
	}

	if (save.genre) writer.setFrame("TCON", track.album.genre);
	if (save.year) writer.setFrame("TYER", Number(track.date.year));

	// Referencing ID3 standard
	// https://id3.org/id3v2.3.0#TDAT
	// The 'Date' frame is a numeric string in the DDMM format.
	if (save.date)
		writer.setFrame("TDAT", "" + track.date.day + track.date.month);

	if (save.length) writer.setFrame("TLEN", track.duration * 1000);
	if (save.bpm && track.bpm) writer.setFrame("TBPM", track.bpm);
	if (save.label) writer.setFrame("TPUB", track.album.label);
	if (save.isrc) writer.setFrame("TSRC", track.ISRC);
	if (save.barcode) {
		writer.setFrame("TXXX", {
			description: "BARCODE",
			value: track.album.barcode,
		});
	}
	if (save.explicit) {
		writer.setFrame("TXXX", {
			description: "ITUNESADVISORY",
			value: track.explicit ? "1" : "0",
		});
	}
	if (save.replayGain) {
		writer.setFrame("TXXX", {
			description: "REPLAYGAIN_TRACK_GAIN",
			value: track.replayGain,
		});
	}
	if (save.lyrics && track.lyrics.unsync) {
		writer.setFrame("USLT", {
			description: "",
			lyrics: track.lyrics.unsync,
			language: "XXX",
		});
	}

	if (save.syncedLyrics && track.lyrics.syncID3.length !== 0) {
		writer.setFrame("SYLT", {
			type: 1,
			text: track.lyrics.syncID3,
			timestampFormat: 2,
		});
	}

	const involvedPeople = [];
	Object.keys(track.contributors).forEach((role) => {
		if (["author", "engineer", "mixer", "producer", "writer"].includes(role)) {
			track.contributors[role].forEach((person) => {
				involvedPeople.push([role, person]);
			});
		} else if (role === "composer" && save.composer) {
			writer.setFrame("TCOM", track.contributors.composer);
		}
	});
	if (involvedPeople.length && save.involvedPeople)
		writer.setFrame("IPLS", involvedPeople);

	if (save.copyright && track.copyright)
		writer.setFrame("TCOP", track.copyright);
	if (
		(save.savePlaylistAsCompilation && track.playlist) ||
		track.album.recordType === "compile"
	) {
		writer.setFrame("TCMP", "1");
	}

	if (save.source) {
		writer.setFrame("TXXX", {
			description: "SOURCE",
			value: "Deezer",
		});
		writer.setFrame("TXXX", {
			description: "SOURCEID",
			value: track.id.toString(),
		});
	}

	// if (save.rating) {
	// 	let rank = (track.rank / 10000) * 2.55;
	// 	rank = rank > 255 ? 255 : Math.round(rank);
	// 	writer.setFrame("POPM", {
	// 		rating: rank,
	// 	});
	// }

	if (save.cover && track.album.embeddedCoverPath) {
		const coverArrayBuffer = fs.readFileSync(track.album.embeddedCoverPath);
		if (coverArrayBuffer.length !== 0) {
			writer.setFrame("APIC", {
				type: 3,
				data: coverArrayBuffer.buffer,
				description: "cover",
				useUnicodeEncoding: save.coverDescriptionUTF8,
			});
		}
	}

	let taggedSongBuffer = Buffer.from(writer.addTag());
	if (taggedSongBuffer.slice(-128, -125).toString() === "TAG") {
		taggedSongBuffer = taggedSongBuffer.slice(0, -128);
	}
	if (save.saveID3v1) {
		taggedSongBuffer = tagID3v1(taggedSongBuffer, track, save);
	}

	fs.writeFileSync(path, taggedSongBuffer);
}

function tagFLAC(path, track, save) {
	const flac = new Metaflac(path);
	flac.removeAllTags();

	if (save.title) flac.setTag(`TITLE=${track.title}`);

	if (save.artist && track.artists.length) {
		if (save.multiArtistSeparator === "default") {
			track.artists.forEach((artist) => {
				flac.setTag(`ARTIST=${artist}`);
			});
		} else {
			if (save.multiArtistSeparator === "nothing") {
				flac.setTag(`ARTIST=${track.mainArtist.name}`);
			} else {
				flac.setTag(`ARTIST=${track.artistsString}`);
			}
			// Tag ARTISTS is added to keep the multiartist support when using a non standard tagging method
			// https://picard-docs.musicbrainz.org/en/appendices/tag_mapping.html#artists
			if (save.artists) {
				track.artists.forEach((artist) => {
					flac.setTag(`ARTISTS=${artist}`);
				});
			}
		}
	}

	if (save.album) flac.setTag(`ALBUM=${track.album.title}`);

	if (save.albumArtist && track.album.artists.length) {
		if (save.singleAlbumArtist && track.album.mainArtist.save) {
			flac.setTag(`ALBUMARTIST=${track.album.mainArtist.name}`);
		} else {
			track.album.artists.forEach((artist) => {
				flac.setTag(`ALBUMARTIST=${artist}`);
			});
		}
	}

	if (save.trackNumber) flac.setTag(`TRACKNUMBER=${track.trackNumber}`);
	if (save.trackTotal) flac.setTag(`TRACKTOTAL=${track.album.trackTotal}`);
	if (save.discNumber) flac.setTag(`DISCNUMBER=${track.discNumber}`);
	if (save.discTotal) flac.setTag(`DISCTOTAL=${track.album.discTotal}`);
	if (save.genre) {
		track.album.genre.forEach((genre) => {
			flac.setTag(`GENRE=${genre}`);
		});
	}

	// YEAR tag is not suggested as a standard tag
	// Being YEAR already contained in DATE will only use DATE instead
	// Reference: https://www.xiph.org/vorbis/doc/v-comment.html#fieldnames
	if (save.date) flac.setTag(`DATE=${track.dateString}`);
	else if (save.year) flac.setTag(`DATE=${track.date.year}`);

	if (save.length) flac.setTag(`LENGTH=${parseInt(track.duration) * 1000}`);
	if (save.bpm && track.bpm) flac.setTag(`BPM=${track.bpm}`);
	if (save.label) flac.setTag(`PUBLISHER=${track.album.label}`);
	if (save.isrc) flac.setTag(`ISRC=${track.ISRC}`);
	if (save.barcode) flac.setTag(`BARCODE=${track.album.barcode}`);
	if (save.explicit)
		flac.setTag(`ITUNESADVISORY=${track.explicit ? "1" : "0"}`);
	if (save.replayGain) flac.setTag(`REPLAYGAIN_TRACK_GAIN=${track.replayGain}`);
	if (save.lyrics && track.lyrics.unsync)
		flac.setTag(`LYRICS=${track.lyrics.unsync}`);

	Object.keys(track.contributors).forEach((role) => {
		if (
			[
				"author",
				"engineer",
				"mixer",
				"producer",
				"writer",
				"composer",
			].includes(role)
		) {
			if (
				(save.involvedPeople && role !== "composer") ||
				(save.composer && role === "composer")
			) {
				track.contributors[role].forEach((person) => {
					flac.setTag(`${role.toUpperCase()}=${person}`);
				});
			}
		} else if (role === "musicpublisher" && save.involvedPeople) {
			track.contributors.musicpublisher.forEach((person) => {
				flac.setTag(`ORGANIZATION=${person}`);
			});
		}
	});

	if (save.copyright && track.copyright)
		flac.setTag(`COPYRIGHT=${track.copyright}`);
	if (
		(save.savePlaylistAsCompilation && track.playlist) ||
		track.album.recordType === "compile"
	) {
		flac.setTag("COMPILATION=1");
	}

	if (save.source) {
		flac.setTag("SOURCE=Deezer");
		flac.setTag(`SOURCEID=${track.id}`);
	}

	if (save.rating) {
		const rank = Math.round(track.rank / 10000);
		flac.setTag(`RATING=${rank}`);
	}

	if (save.cover && track.album.embeddedCoverPath) {
		const picture = fs.readFileSync(track.album.embeddedCoverPath);
		if (picture.length !== 0) flac.importPicture(picture);
	}

	flac.save();
}

const id3v1Genres = [
	"Blues",
	"Classic Rock",
	"Country",
	"Dance",
	"Disco",
	"Funk",
	"Grunge",
	"Hip-Hop",
	"Jazz",
	"Metal",
	"New Age",
	"Oldies",
	"Other",
	"Pop",
	"Rhythm and Blues",
	"Rap",
	"Reggae",
	"Rock",
	"Techno",
	"Industrial",
	"Alternative",
	"Ska",
	"Death Metal",
	"Pranks",
	"Soundtrack",
	"Euro-Techno",
	"Ambient",
	"Trip-Hop",
	"Vocal",
	"Jazz & Funk",
	"Fusion",
	"Trance",
	"Classical",
	"Instrumental",
	"Acid",
	"House",
	"Game",
	"Sound clip",
	"Gospel",
	"Noise",
	"Alternative Rock",
	"Bass",
	"Soul",
	"Punk",
	"Space",
	"Meditative",
	"Instrumental Pop",
	"Instrumental Rock",
	"Ethnic",
	"Gothic",
	"Darkwave",
	"Techno-Industrial",
	"Electronic",
	"Pop-Folk",
	"Eurodance",
	"Dream",
	"Southern Rock",
	"Comedy",
	"Cult",
	"Gangsta",
	"Top 40",
	"Christian Rap",
	"Pop/Funk",
	"Jungle music",
	"Native US",
	"Cabaret",
	"New Wave",
	"Psychedelic",
	"Rave",
	"Showtunes",
	"Trailer",
	"Lo-Fi",
	"Tribal",
	"Acid Punk",
	"Acid Jazz",
	"Polka",
	"Retro",
	"Musical",
	"Rock ’n’ Roll",
	"Hard Rock",
	"Folk",
	"Folk-Rock",
	"National Folk",
	"Swing",
	"Fast Fusion",
	"Bebop",
	"Latin",
	"Revival",
	"Celtic",
	"Bluegrass",
	"Avantgarde",
	"Gothic Rock",
	"Progressive Rock",
	"Psychedelic Rock",
	"Symphonic Rock",
	"Slow Rock",
	"Big Band",
	"Chorus",
	"Easy Listening",
	"Acoustic",
	"Humour",
	"Speech",
	"Chanson",
	"Opera",
	"Chamber Music",
	"Sonata",
	"Symphony",
	"Booty Bass",
	"Primus",
	"Porn Groove",
	"Satire",
	"Slow Jam",
	"Club",
	"Tango",
	"Samba",
	"Folklore",
	"Ballad",
	"Power Ballad",
	"Rhythmic Soul",
	"Freestyle",
	"Duet",
	"Punk Rock",
	"Drum Solo",
	"A cappella",
	"Euro-House",
	"Dance Hall",
	"Goa music",
	"Drum & Bass",
	"Club-House",
	"Hardcore Techno",
	"Terror",
	"Indie",
	"BritPop",
	"Negerpunk",
	"Polsk Punk",
	"Beat",
	"Christian Gangsta Rap",
	"Heavy Metal",
	"Black Metal",
	"Crossover",
	"Contemporary Christian",
	"Christian Rock",
	"Merengue",
	"Salsa",
	"Thrash Metal",
	"Anime",
	"Jpop",
	"Synthpop",
	"Abstract",
	"Art Rock",
	"Baroque",
	"Bhangra",
	"Big beat",
	"Breakbeat",
	"Chillout",
	"Downtempo",
	"Dub",
	"EBM",
	"Eclectic",
	"Electro",
	"Electroclash",
	"Emo",
	"Experimental",
	"Garage",
	"Global",
	"IDM",
	"Illbient",
	"Industro-Goth",
	"Jam Band",
	"Krautrock",
	"Leftfield",
	"Lounge",
	"Math Rock",
	"New Romantic",
	"Nu-Breakz",
	"Post-Punk",
	"Post-Rock",
	"Psytrance",
	"Shoegaze",
	"Space Rock",
	"Trop Rock",
	"World Music",
	"Neoclassical",
	"Audiobook",
	"Audio Theatre",
	"Neue Deutsche Welle",
	"Podcast",
	"Indie-Rock",
	"G-Funk",
	"Dubstep",
	"Garage Rock",
	"Psybient",
];

// Filters only Extended Ascii characters
function extAsciiFilter(string) {
	let output = "";
	string.split("").forEach((x) => {
		if (x.charCodeAt(0) > 255) {
			output += "?";
		} else {
			output += x;
		}
	});
	return output;
}

function tagID3v1(taggedSongBuffer, track, save) {
	const tagBuffer = Buffer.alloc(128);

	tagBuffer.write("TAG", 0); // Header
	if (save.title) {
		const trimmedTitle = extAsciiFilter(track.title.substring(0, 30));
		tagBuffer.write(trimmedTitle, 3);
	}
	if (save.artist) {
		let selectedArtist;
		if (track.artistsString) selectedArtist = track.artistsString;
		else selectedArtist = track.mainArtist.name;

		const trimmedArtist = extAsciiFilter(selectedArtist.substring(0, 30));
		tagBuffer.write(trimmedArtist, 33);
	}
	if (save.album) {
		const trimmedAlbum = extAsciiFilter(track.album.title.substring(0, 30));
		tagBuffer.write(trimmedAlbum, 63);
	}
	if (save.year) {
		const trimmedYear = track.date.year.substring(0, 4);
		tagBuffer.write(trimmedYear, 93);
	}
	if (save.trackNumber) {
		if (track.trackNumber <= 65535) {
			if (track.trackNumber > 255) {
				tagBuffer.writeUInt8(track.trackNumber >> 8, 125);
				tagBuffer.writeUInt8(track.trackNumber & 255, 126);
			} else {
				tagBuffer.writeUInt8(parseInt(track.trackNumber), 126);
			}
		}
	}
	if (save.genre) {
		const selectedGenre = track.album.genre[0];
		if (id3v1Genres.includes(selectedGenre))
			tagBuffer.writeUInt8(id3v1Genres.indexOf(selectedGenre), 127);
		else tagBuffer.writeUInt8(255, 127);
	} else {
		tagBuffer.writeUInt8(255, 127);
	}

	// Save tags
	const buffer = new ArrayBuffer(taggedSongBuffer.byteLength + 128);
	const bufferWriter = new Uint8Array(buffer);
	bufferWriter.set(new Uint8Array(taggedSongBuffer), 0);
	bufferWriter.set(new Uint8Array(tagBuffer), taggedSongBuffer.byteLength);
	return Buffer.from(buffer);
}

export { tagID3, tagFLAC, tagID3v1 };
