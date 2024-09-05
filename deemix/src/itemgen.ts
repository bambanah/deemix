import { Single, Collection } from "./types/DownloadObjects";
import {
	GenerationError,
	ISRCnotOnDeezer,
	InvalidID,
	NotYourPrivatePlaylist,
} from "./errors";
import {
	utils,
	type APIAlbum,
	type APIArtist,
	type APIPlaylist,
	type APITrack,
	type EnrichedAPITrack,
	type EnrichedAPIAlbum,
	type GWTrack,
} from "deezer-js";
import { each } from "async";
import { Deezer } from "deezer-js";
import { Album } from "./types/Album";

const { map_user_playlist, map_track, map_album } = utils;

export async function generateTrackItem(
	dz: Deezer,
	id: number | string,
	bitrate: number,
	trackAPI?: APITrack | EnrichedAPITrack,
	albumAPI?: APIAlbum
) {
	// Get essential track info
	if (!trackAPI) {
		if (String(id).startsWith("isrc") || (typeof id === "number" && id > 0)) {
			try {
				trackAPI = await dz.api.get_track(id);
			} catch (e) {
				console.trace(e);
				throw new GenerationError(`https://deezer.com/track/${id}`, e.message);
			}
			// Check if is an isrc: url
			if (String(id).startsWith("isrc")) {
				if (trackAPI.id && trackAPI.title) id = trackAPI.id;
				else throw new ISRCnotOnDeezer(`https://deezer.com/track/${id}`);
			}
		} else {
			const trackAPI_gw = await dz.gw.get_track(id);
			trackAPI = map_track(trackAPI_gw);
		}
	} else {
		id = trackAPI.id;
	}
	if (!/^-?\d+$/.test(String(id)))
		throw new InvalidID(`https://deezer.com/track/${id}`);

	let cover: string;
	if (trackAPI.album.cover_small) {
		cover =
			trackAPI.album.cover_small.slice(0, -24) + "/75x75-000000-80-0-0.jpg";
	} else {
		cover = `https://e-cdns-images.dzcdn.net/images/cover/${trackAPI.md5_image}/75x75-000000-80-0-0.jpg`;
	}

	delete trackAPI.track_token;

	return new Single({
		type: "track",
		id,
		bitrate,
		title: trackAPI.title,
		artist: trackAPI.artist.name,
		cover,
		explicit: trackAPI.explicit_lyrics,
		single: {
			trackAPI,
			albumAPI,
		},
	});
}

export async function generateAlbumItem(
	dz: Deezer,
	id: string,
	bitrate: number,
	rootArtist?: { id: any; name: any; picture_small: any }
) {
	// Get essential album info
	let albumAPI: APIAlbum | EnrichedAPIAlbum;
	if (String(id).startsWith("upc")) {
		const upcs = [id.slice(4).toString()];
		upcs.push(parseInt(upcs[0], 10).toString()); // Try UPC without leading zeros as well
		let lastError: { message: string };
		await each(upcs, async (upc) => {
			try {
				albumAPI = await dz.api.get_album(`upc:${upc}`);
			} catch (e) {
				lastError = e;
				albumAPI = null;
			}
		});
		if (!albumAPI) {
			console.trace(lastError);
			throw new GenerationError(
				`https://deezer.com/album/${id}`,
				lastError.message
			);
		}
		id = albumAPI.id;
	} else {
		try {
			const albumAPI_gw_page = await dz.gw.get_album_page(id);
			if (albumAPI_gw_page.DATA) {
				albumAPI = <any>map_album(albumAPI_gw_page.DATA);
				id = albumAPI_gw_page.DATA.ALB_ID;
				const albumAPI_new = await dz.api.get_album(id);
				albumAPI = { ...albumAPI, ...albumAPI_new };
			} else {
				throw new GenerationError(
					`https://deezer.com/album/${id}`,
					"Can't find the album"
				);
			}
		} catch (e) {
			console.trace(e);
			throw new GenerationError(`https://deezer.com/album/${id}`, e.message);
		}
	}
	if (!/^\d+$/.test(String(id)))
		throw new InvalidID(`https://deezer.com/album/${id}`);

	// Get extra info about album
	// This saves extra api calls when downloading
	let albumAPI_gw = await dz.gw.get_album(id);
	albumAPI_gw = map_album(albumAPI_gw);
	albumAPI = { ...albumAPI_gw, ...albumAPI };
	albumAPI.root_artist = rootArtist;

	// If the album is a single download as a track
	if (albumAPI.nb_tracks === 1) {
		if (albumAPI.tracks.data.length) {
			return generateTrackItem(
				dz,
				albumAPI.tracks.data[0].id,
				bitrate,
				null,
				albumAPI
			);
		}
		throw new GenerationError(
			`https://deezer.com/album/${id}`,
			"Single has no tracks."
		);
	}

	const tracksArray = await dz.gw.get_album_tracks(id);

	let cover: string;
	if (albumAPI.cover_small) {
		cover = albumAPI.cover_small.slice(0, -24) + "/75x75-000000-80-0-0.jpg";
	} else {
		cover = `https://e-cdns-images.dzcdn.net/images/cover/${albumAPI.md5_image}/75x75-000000-80-0-0.jpg`;
	}

	const totalSize = tracksArray.length;
	albumAPI.nb_tracks = totalSize;
	const collection = [];
	tracksArray.forEach((trackAPI: GWTrack, pos: number) => {
		const mappedTrack = map_track(trackAPI);
		delete mappedTrack.track_token;
		mappedTrack.position = pos + 1;
		collection.push(mappedTrack);
	});

	return new Collection({
		type: "album",
		id,
		bitrate,
		title: albumAPI.title,
		artist: albumAPI.artist.name,
		cover,
		explicit: albumAPI.explicit_lyrics,
		size: totalSize,
		collection: {
			tracks: collection,
			albumAPI,
		},
	});
}

export async function generatePlaylistItem(
	dz: Deezer,
	id: string,
	bitrate: number,
	playlistAPI?: APIPlaylist,
	playlistTracksAPI?: any[]
) {
	if (!playlistAPI) {
		if (!/^\d+$/.test(id))
			throw new InvalidID(`https://deezer.com/playlist/${id}`);
		// Get essential playlist info
		try {
			playlistAPI = await dz.api.get_playlist(id);
		} catch (e) {
			console.trace(e);
			playlistAPI = null;
		}
		// Fallback to gw api if the playlist is private
		if (!playlistAPI) {
			try {
				const userPlaylist = await dz.gw.get_playlist_page(id);
				playlistAPI = map_user_playlist(userPlaylist.DATA);
			} catch (e) {
				console.trace(e);
				throw new GenerationError(
					`https://deezer.com/playlist/${id}`,
					e.message
				);
			}
		}
		// Check if private playlist and owner
		if (!playlistAPI.public && playlistAPI.creator.id !== dz.current_user.id) {
			throw new NotYourPrivatePlaylist(`https://deezer.com/playlist/${id}`);
		}
	}

	if (!playlistTracksAPI) {
		playlistTracksAPI = await dz.gw.get_playlist_tracks(id);
	}
	playlistAPI.various_artist = await dz.api.get_artist(5080); // Useful for save as compilation

	const totalSize = playlistTracksAPI.length;
	playlistAPI.nb_tracks = totalSize;
	const collection = [];
	playlistTracksAPI.forEach((trackAPI: GWTrack, pos: number) => {
		const mappedTrack = map_track(trackAPI);
		if (mappedTrack.explicit_lyrics) {
			playlistAPI.explicit = true;
		}
		delete mappedTrack.track_token;
		mappedTrack.position = pos + 1;
		collection.push(mappedTrack);
	});

	if (!playlistAPI.explicit) playlistAPI.explicit = false;

	return new Collection({
		type: "playlist",
		id,
		bitrate,
		title: playlistAPI.title,
		artist: playlistAPI.creator.name,
		cover: playlistAPI.picture_small.slice(0, -24) + "/75x75-000000-80-0-0.jpg",
		explicit: playlistAPI.explicit,
		size: totalSize,
		collection: {
			tracks: collection,
			playlistAPI,
		},
	});
}

export async function generateArtistItem(
	dz: Deezer,
	id: string,
	bitrate: number,
	listener: {
		send: (
			arg0: string,
			arg1: { id: any; name: any; picture_small: any }
		) => void;
	},
	tab = "all"
) {
	let path = "";
	if (tab !== "all") path = "/" + tab;

	if (!/^\d+$/.test(id))
		throw new InvalidID(`https://deezer.com/artist/${id}${path}`);
	// Get essential artist info
	let artistAPI: Partial<APIArtist>;
	try {
		artistAPI = await dz.api.get_artist(id);
	} catch (e) {
		console.trace(e);
		throw new GenerationError(
			`https://deezer.com/artist/${id}${path}`,
			e.message
		);
	}

	const rootArtist = {
		id: artistAPI.id,
		name: artistAPI.name,
		picture_small: artistAPI.picture_small,
	};
	if (listener) {
		listener.send("startAddingArtist", rootArtist);
	}
	const artistDiscographyAPI = await dz.gw.get_artist_discography_tabs(id, {
		limit: 100,
	});
	const albumList = [];
	if (tab === "discography") {
		delete artistDiscographyAPI.all;
		await each(artistDiscographyAPI, async (type) => {
			await each(type, async (album) => {
				try {
					const albumData = await generateAlbumItem(
						dz,
						album.id,
						bitrate,
						rootArtist
					);
					albumList.push(albumData);
				} catch (e) {
					console.warn(album.id, "No Data", e);
				}
			});
		});
	} else {
		const tabReleases = artistDiscographyAPI[tab] || [];
		await each(tabReleases, async (album: Album) => {
			try {
				const albumData = await generateAlbumItem(
					dz,
					album.id,
					bitrate,
					rootArtist
				);
				albumList.push(albumData);
			} catch (e) {
				console.warn(album.id, "No Data", e);
			}
		});
	}

	if (listener) {
		listener.send("finishAddingArtist", rootArtist);
	}
	return albumList;
}

export async function generateArtistTopItem(
	dz: Deezer,
	id: string,
	bitrate: number
) {
	if (!/^\d+$/.test(id))
		throw new InvalidID(`https://deezer.com/artist/${id}/top_track`);
	// Get essential artist info
	let artistAPI: Partial<APIArtist>;
	try {
		artistAPI = await dz.api.get_artist(id);
	} catch (e) {
		console.trace(e);
		throw new GenerationError(
			`https://deezer.com/artist/${id}/top_track`,
			e.message
		);
	}

	// Emulate the creation of a playlist
	// Can't use generatePlaylistItem directly as this is not a real playlist
	const playlistAPI = {
		id: artistAPI.id + "_top_track",
		title: artistAPI.name + " - Top Tracks",
		description: "Top Tracks for " + artistAPI.name,
		duration: 0,
		public: true,
		is_loved_track: false,
		collaborative: false,
		nb_tracks: 0,
		fans: artistAPI.nb_fan,
		link: "https://www.deezer.com/artist/" + artistAPI.id + "/top_track",
		share: null,
		picture: artistAPI.picture,
		picture_small: artistAPI.picture_small,
		picture_medium: artistAPI.picture_medium,
		picture_big: artistAPI.picture_big,
		picture_xl: artistAPI.picture_xl,
		checksum: null,
		tracklist: "https://api.deezer.com/artist/" + artistAPI.id + "/top",
		creation_date: "XXXX-00-00",
		creator: {
			id: "art_" + artistAPI.id,
			name: artistAPI.name,
			type: "user",
		},
		type: "playlist",
	};

	const artistTopTracksAPI_gw = await dz.gw.get_artist_top_tracks(id);
	return generatePlaylistItem(
		dz,
		playlistAPI.id,
		bitrate,
		playlistAPI,
		artistTopTracksAPI_gw
	);
}
