import { postToServer } from "@/utils/api-utils";

export function sendAddToQueue(url: string, bitrate?: number) {
	if (!url) throw new Error("No URL given to sendAddToQueue function!");

	postToServer("addToQueue", { url, bitrate });
}

export function aggregateDownloadLinks(releases: { link: string }[]): string {
	const links = releases.map((release) => release.link);

	return links.join(";");
}
