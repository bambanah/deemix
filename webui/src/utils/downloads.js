import { postToServer } from "@/utils/api";

/**
 * @param {string} url
 * @param {number|null} bitrate
 */
export function sendAddToQueue(url, bitrate = null) {
	if (!url) throw new Error("No URL given to sendAddToQueue function!");

	postToServer("addToQueue", { url, bitrate });
}

/**
 * @param {{ link: string }[]} releases
 * @returns {string}
 */
export function aggregateDownloadLinks(releases) {
	const links = releases.map((release) => release.link);

	return links.join(";");
}
