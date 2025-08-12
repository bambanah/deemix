import { each } from "async";
import {
	type Deezer,
	type APIPlaylist,
	type GWTrack,
	type APIArtist,
	utils,
} from "deezer-sdk";
import {
	InvalidID,
	GenerationError,
	NotYourPrivatePlaylist,
} from "../errors.js";
import type { Album } from "../types/index.js";
import { generateAlbumItem } from "./generateAlbumItem.js";
import { Collection } from "./Collection.js";
import type { Single } from "./Single.js";

const { map_user_playlist, mapGwTrackToDeezer: map_track } = utils;

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
		if (!playlistAPI.public && playlistAPI.creator.id !== dz.currentUser.id) {
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
	const albumList: (Single | Collection)[] = [];
	if (tab === "discography") {
		delete artistDiscographyAPI.all;
		await each(artistDiscographyAPI, async (type: any) => {
			await each(type, async (album: any) => {
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
