import type { DownloadObject } from "@/download-objects/DownloadObject.js";
import { CustomDate } from "@/types/CustomDate.js";
import { type Settings } from "@/types/Settings.js";
import Track from "@/types/Track.js";
import { TrackFormats, type DeezerTrack } from "deezer-sdk";

const bitrateLabels = {
	[TrackFormats.MP4_RA3]: "360 HQ",
	[TrackFormats.MP4_RA2]: "360 MQ",
	[TrackFormats.MP4_RA1]: "360 LQ",
	[TrackFormats.FLAC]: "FLAC",
	[TrackFormats.MP3_320]: "320",
	[TrackFormats.MP3_128]: "128",
	[TrackFormats.DEFAULT]: "128",
	[TrackFormats.LOCAL]: "MP3",
};

export function fixName(txt: string, char = "_") {
	txt = txt + "";
	txt = txt.replace(/[\0/\\:*?"<>|]/g, char);
	return txt.normalize("NFC");
}

export function fixLongName(name: string) {
	if (name.includes("/")) {
		const sepName = name.split("/");
		name = "";
		sepName.forEach((txt) => {
			txt = fixLongName(txt);
			name += `${txt}/`;
		});
		name = name.slice(0, -1);
	} else {
		name = name.slice(0, 200);
	}
	return name;
}

export function antiDot(str: string) {
	while (
		str[str.length - 1] === "." ||
		str[str.length - 1] === " " ||
		str[str.length - 1] === "\n"
	) {
		str = str.slice(0, -1);
	}
	if (str.length < 1) {
		str = "dot";
	}
	return str;
}

export function pad(
	num: number,
	maxVal: number,
	settings: Pick<Settings, "paddingSize" | "padTracks" | "padSingleDigit">
) {
	if (!settings.padTracks) return num + "";

	let paddingSize =
		settings.paddingSize === 0
			? maxVal.toString().length
			: settings.paddingSize;

	if (settings.padSingleDigit && paddingSize === 1) paddingSize = 2;

	return (num + "").padStart(paddingSize, "0");
}

const shouldCreatePlaylistFolder = (track: Track, settings: Settings) => {
	return (
		settings.createPlaylistFolder &&
		track.playlist &&
		!settings.tags.savePlaylistAsCompilation
	);
};

const shouldCreateArtistFolder = (track: Track, settings: Settings) => {
	return (
		(settings.createArtistFolder && !track.playlist) ||
		(settings.createArtistFolder &&
			track.playlist &&
			settings.tags.savePlaylistAsCompilation) ||
		(settings.createArtistFolder &&
			track.playlist &&
			settings.createStructurePlaylist)
	);
};

const shouldCreateAlbumFolder = (
	track: Track,
	settings: Settings,
	singleTrack: boolean
) => {
	return (
		settings.createAlbumFolder &&
		(!singleTrack || (singleTrack && settings.createSingleFolder)) &&
		(!track.playlist ||
			(track.playlist && settings.tags.savePlaylistAsCompilation) ||
			(track.playlist && settings.createStructurePlaylist))
	);
};

const shouldCreateCDFolder = (
	track: Track,
	settings: Settings,
	singleTrack: boolean
) => {
	return (
		track.album?.discTotal > 1 &&
		settings.createAlbumFolder &&
		settings.createCDFolder &&
		(!singleTrack || (singleTrack && settings.createSingleFolder)) &&
		(!track.playlist ||
			(track.playlist && settings.tags.savePlaylistAsCompilation) ||
			(track.playlist && settings.createStructurePlaylist))
	);
};

export function generatePath(
	track: DeezerTrack,
	downloadObjectType: DownloadObject["type"],
	settings: Settings
) {
	let filenameTemplate = "%artist% - %title%";
	let singleTrack = false;
	if (downloadObjectType === "track") {
		filenameTemplate = settings.createSingleFolder
			? settings.albumTracknameTemplate
			: settings.tracknameTemplate;
		singleTrack = true;
	} else if (downloadObjectType === "album") {
		filenameTemplate = settings.albumTracknameTemplate;
	} else {
		filenameTemplate = settings.playlistTracknameTemplate;
	}

	let filename = generateTrackName(filenameTemplate, track, settings);

	let filepath = settings.downloadLocation || ".";
	let artistPath: string, coverPath: string, extrasPath: string;

	if (shouldCreatePlaylistFolder(track, settings)) {
		filepath += `/${generatePlaylistName(track, settings)}`;
	}

	if (track.playlist && !settings.tags.savePlaylistAsCompilation) {
		extrasPath = filepath;
	}

	if (shouldCreateArtistFolder(track, settings)) {
		filepath += `/${generateArtistName(
			settings.artistNameTemplate,
			track.album.mainArtist,
			settings,
			track.album.rootArtist
		)}`;
		artistPath = filepath;
	}

	if (shouldCreateAlbumFolder(track, settings, singleTrack)) {
		filepath += `/${generateAlbumName(
			settings.albumNameTemplate,
			track.album,
			settings,
			track.playlist
		)}`;
		coverPath = filepath;
	}

	if (!extrasPath) extrasPath = filepath;

	if (shouldCreateCDFolder(track, settings, singleTrack)) {
		filepath += `/CD${track.discNumber}`;
	}

	// Remove Subfolders from filename and add it to filepath
	if (filename.includes("/")) {
		const tempPath = filename.slice(0, filename.indexOf("/"));
		filepath += `/${tempPath}`;
		filename = filename.slice(tempPath.length + 1);
	}

	return {
		filename,
		filepath,
		artistPath,
		coverPath,
		extrasPath,
	};
}

export function generateTrackName(
	filename: string,
	track: Track,
	settings: Settings
) {
	const c = settings.illegalCharacterReplacer;

	filename = filename.replaceAll("%title%", fixName(track.title, c));
	filename = filename.replaceAll("%artist%", fixName(track.mainArtist.name, c));
	filename = filename.replaceAll(
		"%artists%",
		fixName(track.artists.join(", "), c)
	);
	filename = filename.replaceAll(
		"%tagsartists%",
		fixName(track.artistsString, c)
	);
	filename = filename.replaceAll(
		"%allartists%",
		fixName(track.fullArtistsString, c)
	);
	filename = filename.replaceAll(
		"%mainartists%",
		fixName(track.mainArtistsString, c)
	);
	if (track.featArtistsString)
		filename = filename.replaceAll(
			"%featartists%",
			fixName("(" + track.featArtistsString + ")", c)
		);
	else
		filename = filename
			.replaceAll(" %featartists%", "")
			.replaceAll("%featartists%", "");

	if (track.album) {
		filename = filename.replaceAll("%album%", fixName(track.album.title, c));
		filename = filename.replaceAll(
			"%albumartist%",
			fixName(track.album.mainArtist.name, c)
		);
		filename = filename.replaceAll(
			"%tracknumber%",
			pad(track.trackNumber, track.album.trackTotal, settings)
		);
		filename = filename.replaceAll(
			"%tracktotal%",
			track.album.trackTotal.toString()
		);

		if (track.album.genre.length) {
			filename = filename.replaceAll(
				"%genre%",
				fixName(track.album.genre[0], c)
			);
		} else {
			filename = filename.replaceAll("%genre%", "Unknown");
		}

		filename = filename.replaceAll(
			"%disctotal%",
			track.album.discTotal.toString()
		);
		filename = filename.replaceAll("%label%", fixName(track.album.label, c));
		filename = filename.replaceAll("%upc%", track.album.barcode);
		filename = filename.replaceAll("%album_id%", track.album.id);
	}

	filename = filename.replaceAll("%discnumber%", String(track.discNumber));
	filename = filename.replaceAll("%year%", String(track.date.year));
	filename = filename.replaceAll("%date%", track.dateString);
	filename = filename.replaceAll("%bpm%", String(track.bpm));
	filename = filename.replaceAll("%isrc%", track.ISRC);
	if (track.explicit) {
		filename = filename.replaceAll("%explicit%", "(Explicit)");
	} else {
		filename = filename
			.replaceAll(" %explicit%", "")
			.replaceAll("%explicit%", "");
	}

	filename = filename.replaceAll("%track_id%", track.id.toString());
	filename = filename.replaceAll("%artist_id%", String(track.mainArtist.id));
	if (track.playlist) {
		filename = filename.replaceAll("%playlist_id%", track.playlist.playlistID);
		filename = filename.replaceAll(
			"%position%",
			pad(track.position, track.playlist.trackTotal, settings)
		);
	} else if (track.album) {
		filename = filename.replaceAll("%playlist_id%", "");
		if (track.album) {
			filename = filename.replaceAll(
				"%position%",
				pad(track.trackNumber, track.album.trackTotal, settings)
			);
		}
	}

	filename = filename.replaceAll("\\", "/");
	return antiDot(fixLongName(filename));
}

export function generateAlbumName(
	foldername: string,
	album,
	settings: Settings,
	playlist
) {
	const c = settings.illegalCharacterReplacer;
	if (playlist && settings.tags.savePlaylistAsCompilation) {
		foldername = foldername.replaceAll(
			"%album_id%",
			"pl_" + playlist.playlistID
		);
		foldername = foldername.replaceAll("%genre%", "Compile");
	} else {
		foldername = foldername.replaceAll("%album_id%", album.id);
		if (album.genre.length)
			foldername = foldername.replaceAll("%genre%", fixName(album.genre[0], c));
		else foldername = foldername.replaceAll("%genre%", "Unknown");
	}
	foldername = foldername.replaceAll("%album%", fixName(album.title, c));
	foldername = foldername.replaceAll(
		"%artist%",
		fixName(album.mainArtist.name, c)
	);
	foldername = foldername.replaceAll(
		"%artists%",
		fixName(album.artists.join(", "), c)
	);
	foldername = foldername.replaceAll("%artist_id%", album.mainArtist.id);
	if (playlist) {
		foldername = foldername.replaceAll(
			"%playlist%",
			fixName(playlist.title, c)
		);
	} else {
		foldername = foldername.replaceAll("%playlist%", fixName(album.title, c));
	}
	if (album.rootArtist) {
		foldername = foldername.replaceAll(
			"%root_artist%",
			fixName(album.rootArtist.name, c)
		);
		foldername = foldername.replaceAll("%root_artist_id%", album.rootArtist.id);
	} else {
		foldername = foldername.replaceAll(
			"%root_artist%",
			fixName(album.mainArtist.name, c)
		);
		foldername = foldername.replaceAll("%root_artist_id%", album.mainArtist.id);
	}
	foldername = foldername.replaceAll("%tracktotal%", album.trackTotal);
	foldername = foldername.replaceAll("%disctotal%", album.discTotal);
	foldername = foldername.replaceAll(
		"%type%",
		fixName(
			album.recordType.charAt(0).toUpperCase() + album.recordType.slice(1),
			c
		)
	);
	foldername = foldername.replaceAll("%upc%", album.barcode);
	foldername = foldername.replaceAll(
		"%explicit%",
		album.explicit ? "(Explicit)" : ""
	);
	foldername = foldername.replaceAll("%label%", fixName(album.label, c));
	foldername = foldername.replaceAll("%year%", album.date.year);
	foldername = foldername.replaceAll("%date%", album.dateString);
	foldername = foldername.replaceAll(
		"%bitrate%",
		bitrateLabels[parseInt(album.bitrate)]
	);

	foldername = foldername.replaceAll("\\", "/");
	return antiDot(fixLongName(foldername));
}

export function generateArtistName(
	foldername: string,
	artist,
	settings: Settings,
	rootArtist
) {
	const c = settings.illegalCharacterReplacer;
	foldername = foldername.replaceAll("%artist%", fixName(artist.name, c));
	foldername = foldername.replaceAll("%artist_id%", artist.id);
	if (rootArtist) {
		foldername = foldername.replaceAll(
			"%root_artist%",
			fixName(rootArtist.name, c)
		);
		foldername = foldername.replaceAll("%root_artist_id%", rootArtist.id);
	} else {
		foldername = foldername.replaceAll(
			"%root_artist%",
			fixName(artist.name, c)
		);
		foldername = foldername.replaceAll("%root_artist_id%", artist.id);
	}
	foldername = foldername.replaceAll("\\", "/");
	return antiDot(fixLongName(foldername));
}

export function generatePlaylistName(
	{ playlist }: Track,
	{ illegalCharacterReplacer, playlistNameTemplate, dateFormat }: Settings
) {
	const c = illegalCharacterReplacer;
	const today = new Date();
	const today_dz = new CustomDate(
		String(today.getDate()).padStart(2, "0"),
		String(today.getMonth() + 1).padStart(2, "0"),
		String(today.getFullYear())
	);

	let foldername = playlistNameTemplate;

	foldername = foldername.replaceAll("%playlist%", fixName(playlist.title, c));
	foldername = foldername.replaceAll(
		"%playlist_id%",
		fixName(playlist.playlistID, c)
	);
	foldername = foldername.replaceAll(
		"%owner%",
		fixName(playlist.owner.name, c)
	);
	foldername = foldername.replaceAll("%owner_id%", playlist.owner.id);
	foldername = foldername.replaceAll("%year%", playlist.date.year);
	foldername = foldername.replaceAll("%date%", playlist.dateString);
	foldername = foldername.replaceAll(
		"%explicit%",
		playlist.explicit ? "(Explicit)" : ""
	);
	foldername = foldername.replaceAll("%today%", today_dz.format(dateFormat));
	foldername = foldername.replaceAll("\\", "/");

	return antiDot(fixLongName(foldername));
}

export function generateDownloadObjectName(
	foldername: string,
	queueItem,
	settings: Settings
) {
	const c = settings.illegalCharacterReplacer;
	foldername = foldername.replaceAll("%title%", fixName(queueItem.title, c));
	foldername = foldername.replaceAll("%artist%", fixName(queueItem.artist, c));
	foldername = foldername.replaceAll("%size%", queueItem.size);
	foldername = foldername.replaceAll("%type%", fixName(queueItem.type, c));
	foldername = foldername.replaceAll("%id%", fixName(queueItem.id, c));
	if (
		queueItem.type === "playlist" &&
		queueItem.collection &&
		queueItem.collection.playlistAPI
	) {
		foldername = foldername.replaceAll(
			"%playlist%",
			fixName(queueItem.collection.playlistAPI.title, c)
		);
	} else {
		foldername = foldername.replaceAll(
			"%playlist%",
			fixName(queueItem.title, c)
		);
	}
	foldername = foldername.replaceAll(
		"%bitrate%",
		bitrateLabels[parseInt(queueItem.bitrate)]
	);
	foldername = foldername.replaceAll("\\", "/").replace("/", c);
	return antiDot(fixLongName(foldername));
}
