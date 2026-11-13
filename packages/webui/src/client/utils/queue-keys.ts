export type DownloadState =
	| "idle"
	| "pending"
	| "queued"
	| "downloading"
	| "finished"
	| "error";

/**
 * Key that identifies a queue item regardless of its bitrate.
 * Mirrors the server one in `server/helpers/queueKeys.ts`.
 */
export function getQueueKey(item: { type: string; id: string | number }) {
	return `${item.type}_${item.id}`;
}

/**
 * Returns the queue key a link will produce once added to the queue, or `null`
 * when it can't be known beforehand (artist discographies, short links, Spotify
 * tracks/albums, multiple links...).
 */
export function getQueueKeyFromLink(link: string): string | null {
	if (!link || /[\s;]/.test(link.trim())) return null;

	let cleanLink = link.trim();
	cleanLink = cleanLink.split("?")[0].split("&")[0].split("#")[0];
	if (cleanLink.endsWith("/")) cleanLink = cleanLink.slice(0, -1);

	if (cleanLink.includes("open.spotify.com")) {
		const spotifyPlaylist = /\/playlist\/([A-Za-z0-9]+)$/.exec(cleanLink);
		return spotifyPlaylist ? `spotify_playlist_${spotifyPlaylist[1]}` : null;
	}

	if (!cleanLink.includes("deezer.com")) return null;

	let match = /\/track\/([^/]+)$/.exec(cleanLink);
	if (match) return `track_${match[1]}`;

	match = /\/album\/([^/]+)$/.exec(cleanLink);
	if (match) return `album_${match[1]}`;

	match = /\/playlist\/(\d+)$/.exec(cleanLink);
	if (match) return `playlist_${match[1]}`;

	match = /\/artist\/(\d+)\/top_track$/.exec(cleanLink);
	if (match) return `playlist_${match[1]}_top_track`;

	return null;
}

/** Maps the status of a queue item to the state shown by download buttons. */
export function getDownloadStateFromItem(item: {
	status?: string;
	size?: number;
	failed?: number;
	downloaded?: number;
	errors?: any[];
}): DownloadState {
	switch (item.status) {
		case "downloading":
		case "converting":
			return "downloading";
		case "download finished":
		case "completed":
		case "withErrors":
			return item.size !== 0 && item.failed === item.size
				? "error"
				: "finished";
		case "failed":
			return "error";
		default:
			return "queued";
	}
}

export function aggregateDownloadLinks(releases: { link: string }[]): string {
	const links = releases.map((release) => release.link);

	return links.join(";");
}
