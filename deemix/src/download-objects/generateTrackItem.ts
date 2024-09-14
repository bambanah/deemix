import { Deezer, utils, type APIAlbum, type DeezerTrack } from "deezer-sdk";
import { GenerationError, ISRCnotOnDeezer, InvalidID } from "@/errors.js";
import { Single } from "./Single.js";

const { mapGwTrackToDeezer } = utils;

export async function generateTrackItem(
	dz: Deezer,
	id: number | string,
	bitrate: number,
	albumAPI?: APIAlbum
) {
	let deezerTrack: DeezerTrack;

	// Get essential track info
	if (String(id).startsWith("isrc") || (typeof id === "number" && id > 0)) {
		try {
			deezerTrack = await dz.api.getTrack(id);
		} catch (e) {
			throw new GenerationError(`https://deezer.com/track/${id}`, e.message);
		}

		// Check if is an isrc: url
		if (String(id).startsWith("isrc")) {
			if (deezerTrack.id && deezerTrack.title) {
				id = deezerTrack.id;
			} else {
				throw new ISRCnotOnDeezer(`https://deezer.com/track/${id}`);
			}
		}
	} else {
		const gwTrack = await dz.gw.getTrack(id);
		deezerTrack = mapGwTrackToDeezer(gwTrack);
	}

	if (!/^-?\d+$/.test(String(id)))
		throw new InvalidID(`https://deezer.com/track/${id}`);

	let cover: string;
	if (deezerTrack.album.cover_small) {
		cover =
			deezerTrack.album.cover_small.slice(0, -24) + "/75x75-000000-80-0-0.jpg";
	} else {
		cover = `https://e-cdns-images.dzcdn.net/images/cover/${deezerTrack.md5_image}/75x75-000000-80-0-0.jpg`;
	}

	delete deezerTrack.track_token;

	return new Single({
		type: "track",
		id,
		bitrate,
		title: deezerTrack.title,
		artist: deezerTrack.artist.name,
		cover,
		explicit: deezerTrack.explicit_lyrics,
		single: {
			trackAPI: deezerTrack,
			albumAPI,
		},
	});
}
