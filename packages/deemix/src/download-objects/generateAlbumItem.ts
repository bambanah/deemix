import { each } from "async";
import {
	Deezer,
	utils,
	type APIAlbum,
	type EnrichedAPIAlbum,
	type GWTrack,
} from "deezer-sdk";
import { GenerationError, InvalidID } from "../errors.js";
import { Collection } from "./Collection.js";
import { generateTrackItem } from "./generateTrackItem.js";

const { mapGwTrackToDeezer: map_track, map_album } = utils;

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
