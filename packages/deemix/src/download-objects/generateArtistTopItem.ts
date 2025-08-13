import { Deezer, type APIArtist } from "deezer-sdk";
import { GenerationError, InvalidID } from "../errors.js";
import { generatePlaylistItem } from "./generatePlaylistItem.js";

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
