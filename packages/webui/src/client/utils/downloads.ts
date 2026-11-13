import { pinia } from "@/stores";
import { useDownloadsStore } from "@/stores/downloads";

export * from "@/utils/queue-keys";

/**
 * Adds one or more links (separated by `;`) to the download queue.
 * Returns `false` when the request was not sent because the item is already
 * being added or is already in the queue.
 */
export function sendAddToQueue(
	url: string,
	bitrate?: number | string | null,
	title?: string
): Promise<boolean> {
	if (!url) throw new Error("No URL given to sendAddToQueue function!");

	return useDownloadsStore(pinia).sendAddToQueue(url, bitrate, title);
}
