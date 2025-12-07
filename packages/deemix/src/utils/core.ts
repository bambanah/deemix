import { accessSync, constants, type PathLike } from "fs";
import stream from "stream";
import { promisify } from "util";
import { ErrorMessages } from "@/errors.js";

export const pipeline = promisify(stream.pipeline);

export const USER_AGENT_HEADER =
	"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36";

export function canWrite(path: PathLike) {
	try {
		accessSync(path, constants.R_OK | constants.W_OK);
	} catch {
		return false;
	}
	return true;
}

export function generateReplayGainString(trackGain: number) {
	return `${Math.round((trackGain + 18.4) * -100) / 100} dB`;
}

export function changeCase(text: string, caseType: string) {
	switch (caseType) {
		case "lower":
			return text.toLowerCase();
		case "upper":
			return text.toUpperCase();
		case "start": {
			const words = text.trim().split(" ");
			for (let i = 0; i < words.length; i++) {
				if (
					["(", "{", "[", "'", '"'].some(
						(bracket) => words[i].length > 1 && words[i].startsWith(bracket)
					)
				) {
					words[i] =
						words[i][0] +
						words[i][1].toUpperCase() +
						words[i].substr(2).toLowerCase();
				} else if (words[i].length > 1) {
					words[i] =
						words[i][0].toUpperCase() + words[i].substr(1).toLowerCase();
				} else {
					words[i] = words[i][0].toUpperCase();
				}
			}
			return words.join(" ");
		}
		case "sentence":
			return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
		default:
			return text;
	}
}

export function removeFeatures(title: string) {
	let clean = title;
	let found = false;
	let pos;
	if (clean.search(/[\s(]\(?\s?feat\.?\s/gi) !== -1) {
		pos = clean.search(/[\s(]\(?\s?feat\.?\s/gi);
		found = true;
	}
	if (clean.search(/[\s(]\(?\s?ft\.?\s/gi) !== -1) {
		pos = clean.search(/[\s(]\(?\s?ft\.?\s/gi);
		found = true;
	}
	const openBracket = clean[pos] === "(" || clean[pos + 1] === "(";
	const otherBracket = clean.indexOf("(", pos + 2);
	if (found) {
		let tempTrack = clean.slice(0, pos);
		if (clean.includes(")") && openBracket) {
			tempTrack += clean.slice(clean.indexOf(")", pos + 2) + 1);
		}
		if (!openBracket && otherBracket !== -1) {
			tempTrack += ` ${clean.slice(otherBracket)}`;
		}
		clean = tempTrack.trim();
		clean = clean.replace(/\s\s+/g, " "); // remove extra spaces
	}
	return clean;
}

export function andCommaConcat(list: string[]) {
	const total = list.length;
	let result = "";

	list.forEach((art, i) => {
		result += art;
		if (total !== i + 1) {
			if (total - 1 === i + 1) {
				result += " & ";
			} else {
				result += ", ";
			}
		}
	});

	return result;
}

export function uniqueArray(arr: any[]) {
	arr.forEach((namePrinc, iPrinc) => {
		arr.forEach((nameRest, iRest) => {
			if (
				iPrinc !== iRest &&
				nameRest.toLowerCase().includes(namePrinc.toLowerCase())
			) {
				arr.splice(iRest, 1);
			}
		});
	});
	return arr;
}

export function shellEscape(s) {
	if (typeof s !== "string") return "";
	if (!/[^\w@%+=:,./-]/g.test(s)) return s;
	return "'" + s.replaceAll("'", "'\"'\"'") + "'";
}

export function removeDuplicateArtists(artist, artists) {
	artists = uniqueArray(artists);
	Object.keys(artist).forEach((role) => {
		artist[role] = uniqueArray(artist[role]);
	});
	return [artist, artists];
}

export function formatListener(key: string, data) {
	let message = "";

	switch (key) {
		case "startAddingArtist":
			return `Started gathering ${data.name}'s albums (${data.id})`;
		case "finishAddingArtist":
			return `Finished gathering ${data.name}'s albums (${data.id})`;
		case "updateQueue":
			if (data.failed)
				message += `${data.data.artist} - ${data.data.title} :: ${data.error}`;
			if (data.progress) message += `Downloading: ${data.progress}%`;
			if (data.conversion) message += `Converting: ${data.conversion}%`;

			return !message ? "" : `[${data.title ?? data.uuid}] ${message}`;
		case "downloadInfo":
			message = data.state;
			switch (data.state) {
				case "getTags":
					message = "Getting tags.";
					break;
				case "gotTags":
					message = "Tags got.";
					break;
				case "getBitrate":
					message = "Getting download URL.";
					break;
				case "bitrateFallback":
					message = "Desired bitrate not found, falling back to lower bitrate.";
					break;
				case "searchFallback":
					message =
						"This track has been searched for, result might not be 100% exact.";
					break;
				case "gotBitrate":
					message = "Download URL got.";
					break;
				case "getAlbumArt":
					message = "Downloading album art.";
					break;
				case "gotAlbumArt":
					message = "Album art downloaded.";
					break;
				case "downloading":
					message = "Downloading track.";
					break;
				case "downloadTimeout":
					message = "Deezer timed out when downloading track, retrying...";
					break;
				case "downloaded":
					message = "Track downloaded.";
					break;
				case "alreadyDownloaded":
					message = "Track already downloaded.";
					break;
				case "tagging":
					message = "Tagging track.";
					break;
				case "tagged":
					message = "Track tagged.";
					break;
				case "stderr":
					return `ExecuteCommand Error: ${data.data.stderr}`;
				case "stdout":
					return `ExecuteCommand Output: ${data.data.stdout}`;
			}
			return `[${data.title ?? data.uuid}] ${data.data.artist} - ${data.data.title} :: ${message}`;
		case "downloadWarn":
			message = `[${data.uuid}] ${data.data.artist} - ${data.data.title} :: ${
				ErrorMessages[data.state]
			} `;
			switch (data.solution) {
				case "fallback":
					message += "Using fallback id.";
					break;
				case "search":
					message += "Searching for alternative.";
					break;
			}
			return message;
		case "currentItemCancelled":
			return `Current item cancelled (${data.title ?? data.uuid})`;
		case "removedFromQueue":
			return `[${data.title ?? data.uuid}] Removed from the queue`;
		case "finishDownload":
			return `[${data.title ?? data.uuid}] Download complete`;
		case "startConversion":
			return `[${data.title ?? data.uuid}] Started converting`;
		case "finishConversion":
			return `[${data.title ?? data.uuid}] Conversion complete`;
		default:
			return message;
	}
}
