import { getPropertyWithFallback } from "@/utils/utils";

export function formatSingleTrack(track: { [key: string]: any }) {
	let isTrackExplicit = getPropertyWithFallback(
		track,
		"explicit_lyrics",
		"EXPLICIT_LYRICS"
	);

	if (typeof isTrackExplicit === "string") {
		isTrackExplicit = isTrackExplicit !== "0";
	}

	return {
		/* Track */
		trackTitle: getPropertyWithFallback(track, "title", "SNG_TITLE"),
		trackTitleVersion: getPropertyWithFallback(
			track,
			"title_version",
			"VERSION"
		),
		trackPreview: getPropertyWithFallback(track, "preview", "MEDIA.0.HREF"),
		trackDuration: getPropertyWithFallback(track, "duration", "DURATION"),
		trackLink:
			getPropertyWithFallback(track, "link") ||
			`https://www.deezer.com/track/${track.SNG_ID}`,
		isTrackExplicit,

		/* Artist */
		artistID: getPropertyWithFallback(track, "artist.id", "ART_ID"),
		artistName: getPropertyWithFallback(track, "artist.name", "ART_NAME"),

		/* Album */
		albumID: getPropertyWithFallback(track, "album.id", "ALB_ID"),
		albumTitle: getPropertyWithFallback(track, "album.title", "ALB_TITLE"),
		albumPicture:
			getPropertyWithFallback(track, "album.cover_small") ||
			`https://e-cdns-images.dzcdn.net/images/cover/${track.ALB_PICTURE}/56x56-000000-80-0-0.jpg`,
	};
}

export function formatAlbums(album: Record<string, any>) {
	let isAlbumExplicit = getPropertyWithFallback(
		album,
		"explicit_lyrics",
		"EXPLICIT_ALBUM_CONTENT.EXPLICIT_LYRICS_STATUS"
	);

	if (typeof isAlbumExplicit === "number") {
		isAlbumExplicit = isAlbumExplicit === 1;
	}

	return {
		/* Album */
		albumID: getPropertyWithFallback(album, "id", "ALB_ID"),
		albumTitle: getPropertyWithFallback(album, "title", "ALB_TITLE"),
		albumCoverMedium:
			getPropertyWithFallback(album, "cover_medium") ||
			`https://e-cdns-images.dzcdn.net/images/cover/${album.ALB_PICTURE}/156x156-000000-80-0-0.jpg`,
		albumLink:
			getPropertyWithFallback(album, "link") ||
			`https://deezer.com/album/${album.ALB_ID}`,
		albumTracks: getPropertyWithFallback(album, "nb_tracks", "NUMBER_TRACK"),
		isAlbumExplicit,

		/* Artist */
		artistName: getPropertyWithFallback(album, "artist.name", "ART_NAME"),
	};
}

export function formatArtist(artist: { [key: string]: any }) {
	return {
		/* Artist */
		artistID: getPropertyWithFallback(artist, "id", "ART_ID"),
		artistName: getPropertyWithFallback(artist, "name", "ART_NAME"),
		artistPictureMedium:
			getPropertyWithFallback(artist, "picture_medium") ||
			`https://e-cdns-images.dzcdn.net/images/artist/${artist.ART_PICTURE}/156x156-000000-80-0-0.jpg`,
		artistLink:
			getPropertyWithFallback(artist, "link") ||
			`https://deezer.com/artist/${artist.ART_ID}`,
		// TODO Fix
		artistAlbumsNumber: getPropertyWithFallback(artist, "nb_album", "NB_FAN"),
	};
}

export function formatPlaylist(playlist: { [key: string]: any }) {
	return {
		/* Playlist */
		playlistID: getPropertyWithFallback(playlist, "id", "PLAYLIST_ID"),
		playlistTitle: getPropertyWithFallback(playlist, "title", "TITLE"),
		playlistPictureMedium:
			getPropertyWithFallback(playlist, "picture_medium") ||
			`https://e-cdns-images.dzcdn.net/images/${playlist.PICTURE_TYPE}/${playlist.PLAYLIST_PICTURE}/156x156-000000-80-0-0.jpg`,
		playlistLink:
			getPropertyWithFallback(playlist, "link") ||
			`https://deezer.com/playlist/${playlist.PLAYLIST_ID}`,
		playlistTracksNumber: getPropertyWithFallback(
			playlist,
			"nb_tracks",
			"NB_SONG"
		),

		/* Artist */
		artistName: getPropertyWithFallback(
			playlist,
			"user.name",
			"PARENT_USERNAME"
		),
	};
}

export function formatTitle(track: { [key: string]: any }) {
	const hasTitleVersion =
		track.trackTitleVersion &&
		!track.trackTitle.includes(track.trackTitleVersion);

	return `${track.trackTitle}${
		hasTitleVersion ? ` ${track.trackTitleVersion}` : ""
	}`;
}
