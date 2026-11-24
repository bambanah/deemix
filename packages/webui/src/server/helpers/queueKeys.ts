/**
 * Helpers to identify queue items regardless of their bitrate.
 * Mirrors `client/utils/queue-keys.ts`.
 */

/** `type_id` key of a queue item (its uuid without the bitrate) */
export function getQueueKey(item: { type: string; id: string | number }) {
	return `${item.type}_${item.id}`;
}

/**
 * Returns the queue key a link will produce once added to the queue, or `null`
 * when it can't be known without querying the API.
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

/** Finds an item of the queue with the same type and id, whatever its bitrate */
export function findQueuedItem<T extends { type: string; id: string | number }>(
	queue: Record<string, T>,
	key: string
): T | undefined {
	return Object.values(queue).find((item) => getQueueKey(item) === key);
}
