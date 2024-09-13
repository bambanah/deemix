import {
	Deezer,
	utils,
	type APIAlbum,
	type APITrack,
	type EnrichedAPITrack,
} from "deezer-sdk";
import { GenerationError, ISRCnotOnDeezer, InvalidID } from "@/errors.js";
import { Single } from "./Single.js";

const { map_track } = utils;

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
				trackAPI = await dz.api.getTrack(id);
			} catch (e) {
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
