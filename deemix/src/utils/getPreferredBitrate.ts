import { Deezer, TrackFormats, errors as _errors, utils } from "deezer-sdk";
import {
	HTTPError,
	ReadError,
	TimeoutError,
	default as got,
	type CancelableRequest,
	type Response as GotResponse,
} from "got";
import { generateCryptedStreamURL } from "../decryption.js";
import { PreferredBitrateNotFound, TrackNot360 } from "../errors.js";
import Track from "../types/Track.js";
import { USER_AGENT_HEADER } from "../utils/core.js";

const { WrongLicense, WrongGeolocation } = _errors;
const { mapGwTrackToDeezer: map_track } = utils;

const formats_non_360 = {
	[TrackFormats.FLAC]: "FLAC",
	[TrackFormats.MP3_320]: "MP3_320",
	[TrackFormats.MP3_128]: "MP3_128",
};
const formats_360 = {
	[TrackFormats.MP4_RA3]: "MP4_RA3",
	[TrackFormats.MP4_RA2]: "MP4_RA2",
	[TrackFormats.MP4_RA1]: "MP4_RA1",
};

export async function getPreferredBitrate(
	dz: Deezer,
	track: Track,
	preferredBitrate: number,
	shouldFallback: boolean,
	feelingLucky: boolean,
	uuid: string,
	listener: any
) {
	let falledBack = false;
	let hasAlternative = track.fallbackID !== 0;
	let isGeolocked = false;
	let wrongLicense = false;

	async function testURL(track: Track, url: string, formatName: string) {
		if (!url) return false;
		let request: CancelableRequest<GotResponse<string>>;
		try {
			request = got
				.get(url, {
					headers: { "User-Agent": USER_AGENT_HEADER },
					https: { rejectUnauthorized: false },
				})
				.on("response", (response) => {
					track.filesizes[`${formatName.toLowerCase()}`] =
						response.statusCode === 403
							? 0
							: response.headers["content-length"];
					request.cancel();
				});

			await request;
		} catch (e) {
			if (e.isCanceled) {
				if (track.filesizes[`${formatName.toLowerCase()}`] === 0) return false;
				return true;
			}
			if (e instanceof ReadError || e instanceof TimeoutError) {
				return await testURL(track, url, formatName);
			}
			if (e instanceof HTTPError) return false;
			console.trace(e);
			throw e;
		}
	}

	async function getCorrectURL(
		track: Track,
		formatName: string,
		formatNumber: number,
		feelingLucky: boolean
	) {
		// Check the track with the legit method
		let url: string;
		wrongLicense =
			((formatName === "FLAC" || formatName.startsWith("MP4_RA")) &&
				!dz.currentUser?.can_stream_lossless) ||
			(formatName === "MP3_320" && !dz.currentUser?.can_stream_hq);
		if (
			track.filesizes[`${formatName.toLowerCase()}`] &&
			track.filesizes[`${formatName.toLowerCase()}`] !== "0"
		) {
			try {
				url = await dz.get_track_url(track.trackToken, formatName);
			} catch (e) {
				wrongLicense = e.name === "WrongLicense";
				isGeolocked = e.name === "WrongGeolocation";
			}
		}
		// Fallback to old method
		if (!url && feelingLucky) {
			url = generateCryptedStreamURL(
				track.id,
				track.MD5,
				track.mediaVersion,
				formatNumber
			);
			if (await testURL(track, url, formatName)) return url;
			url = undefined;
		}
		return url;
	}

	if (track.local) {
		const url = await getCorrectURL(
			track,
			"MP3_MISC",
			TrackFormats.LOCAL,
			feelingLucky
		);
		track.urls.MP3_MISC = url;
		return TrackFormats.LOCAL;
	}

	const is360Format = Object.keys(formats_360).includes(
		preferredBitrate.toString()
	);
	let formats: Record<number, string>;
	if (!shouldFallback) {
		formats = { ...formats_360, ...formats_non_360 };
	} else if (is360Format) {
		formats = { ...formats_360 };
	} else {
		formats = { ...formats_non_360 };
	}

	// Check and renew trackToken before starting the check
	await track.checkAndRenewTrackToken(dz);
	for (let i = 0; i < Object.keys(formats).length; i++) {
		// Check bitrates
		const formatNumber = parseInt(Object.keys(formats).reverse()[i]);
		const formatName = formats[formatNumber];

		// Current bitrate is higher than preferred bitrate; skip
		if (formatNumber > preferredBitrate) {
			continue;
		}

		let currentTrack = track;
		let url = await getCorrectURL(
			currentTrack,
			formatName,
			formatNumber,
			feelingLucky
		);
		let newTrack;
		do {
			if (!url && hasAlternative) {
				newTrack = await dz.gw.get_track_with_fallback(currentTrack.fallbackID);
				newTrack = map_track(newTrack);
				currentTrack = new Track();
				currentTrack.parseEssentialData(newTrack);
				hasAlternative = currentTrack.fallbackID !== 0;
			}
			if (!url)
				url = await getCorrectURL(
					currentTrack,
					formatName,
					formatNumber,
					feelingLucky
				);
		} while (!url && hasAlternative);

		if (url) {
			if (newTrack) track.parseEssentialData(newTrack);
			track.urls[formatName] = url;
			return formatNumber;
		}

		if (!shouldFallback) {
			if (wrongLicense) throw new WrongLicense(formatName);
			if (isGeolocked) throw new WrongGeolocation(dz.currentUser.country);
			throw new PreferredBitrateNotFound();
		} else if (!falledBack) {
			falledBack = true;
			if (listener && uuid) {
				listener.send("downloadInfo", {
					uuid,
					state: "bitrateFallback",
					data: {
						id: track.id,
						title: track.title,
						artist: track.mainArtist.name,
					},
				});
			}
		}
	}
	if (is360Format) throw new TrackNot360();
	const url = await getCorrectURL(
		track,
		"MP3_MISC",
		TrackFormats.DEFAULT,
		feelingLucky
	);
	track.urls.MP3_MISC = url;
	return TrackFormats.DEFAULT;
}
