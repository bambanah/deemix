import i18n from "@/plugins/i18n";
import { postToServer } from "@/utils/api-utils";
import {
	type DownloadState,
	getDownloadStateFromItem,
	getQueueKey,
	getQueueKeyFromLink,
} from "@/utils/queue-keys";
import { toast } from "@/utils/toasts";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export interface QueueItem {
	uuid: string;
	id: string;
	type: string;
	title: string;
	artist?: string;
	cover?: string;
	bitrate?: string | number;
	explicit?: boolean;
	size: number;
	downloaded: number;
	failed: number;
	progress: number;
	conversion: number;
	errors: any[];
	status?: string;
	current?: boolean;
	silent?: boolean;
	[key: string]: any;
}

export interface PendingItem {
	/** Request id, used as key for the placeholder row */
	id: string;
	url: string;
	title?: string;
	startedAt: number;
}

const t = (key: string, params: Record<string, any> = {}) =>
	i18n.global.t(key, params);

let requestCounter = 0;

export const useDownloadsStore = defineStore("downloads", () => {
	/** uuids of the items still to be downloaded (in order) */
	const queue = ref<string[]>([]);
	/** uuids of finished items */
	const queueComplete = ref<string[]>([]);
	/** every item by uuid */
	const queueList = ref<Record<string, QueueItem>>({});
	/** add-to-queue requests waiting for the server */
	const pending = ref<PendingItem[]>([]);

	const queueCount = computed(
		() => queue.value.length + queueComplete.value.length + pending.value.length
	);

	const finishedWithoutErrors = computed(() =>
		Object.values(queueList.value).filter(
			(el) =>
				(el.status || "") === "download finished" && el.errors.length === 0
		)
	);

	/** queue key (type_id, without bitrate) -> download state */
	const stateByKey = computed(() => {
		const states: Record<string, DownloadState> = {};

		Object.values(queueList.value).forEach((item) => {
			states[getQueueKey(item)] = getDownloadStateFromItem(item);
		});

		return states;
	});

	function getLinkState(link: string): DownloadState {
		const key = getQueueKeyFromLink(link);
		return (key && stateByKey.value[key]) || "idle";
	}

	/** State of a download button for the given link (may contain `;`) */
	function getDownloadState(url: string): DownloadState {
		if (!url) return "idle";
		if (
			pending.value.some(
				(item) => item.url === url || item.url.split(/[\s;]+/).includes(url)
			)
		)
			return "pending";

		const links = url.split(/[\s;]+/).filter(Boolean);
		if (links.length === 0) return "idle";

		const states: DownloadState[] = links.map(getLinkState);

		// Every link is already in the queue: show the "least advanced" state
		if (!states.includes("idle")) {
			const priority: DownloadState[] = [
				"queued",
				"downloading",
				"error",
				"finished",
			];
			return priority.find((state) => states.includes(state)) || "queued";
		}

		return "idle";
	}

	function isInQueue(uuid: string) {
		return queue.value.includes(uuid) || queueComplete.value.includes(uuid);
	}

	/* ===== Actions triggered by the user ===== */

	async function sendAddToQueue(
		url: string,
		bitrate?: number | string | null,
		title?: string
	): Promise<boolean> {
		if (getDownloadState(url) === "pending") return false;

		// Skip links already in the queue, regardless of their bitrate
		const links = url.split(/[\s;]+/).filter(Boolean);
		const linksToAdd = links.filter((link) => getLinkState(link) === "idle");

		if (linksToAdd.length === 0) {
			toast(
				t("toasts.alreadyInQueue", {
					item: title || t("globals.this_item"),
				}),
				"playlist_add_check"
			);
			return false;
		}

		const pendingItem: PendingItem = {
			id: `pending_${++requestCounter}`,
			url,
			title,
			startedAt: Date.now(),
		};
		pending.value.push(pendingItem);

		try {
			const response = await postToServer("addToQueue", {
				url: linksToAdd.join(";"),
				bitrate,
			});

			// The socket event usually arrives first, but add the items from the
			// response too so the UI is updated even if the event is lost.
			const added = response?.data?.obj;
			if (Array.isArray(added)) {
				added
					.filter((item) => item?.uuid && !queueList.value[item.uuid])
					.forEach((item) => addToQueue({ ...item, silent: true }));
			}

			return Boolean(response?.result);
		} finally {
			pending.value = pending.value.filter(
				(item) => item.id !== pendingItem.id
			);
		}
	}

	/* ===== Actions triggered by the server ===== */

	function initQueue(data) {
		const {
			queueOrder,
			current: currentItem,
			queue: initQueueList,
			restored,
		} = data;

		Object.values(initQueueList)
			.filter((el: any) =>
				["completed", "withErrors", "failed"].includes(el.status)
			)
			.forEach((el: any) => {
				el.silent = true;
				addToQueue(el);
			});

		if (currentItem) {
			currentItem.silent = true;
			addToQueue(currentItem, true);
		}

		queueOrder.forEach((uuid: string) => {
			if (!initQueueList[uuid]) return;
			initQueueList[uuid].silent = true;
			addToQueue(initQueueList[uuid]);
		});

		if (restored) {
			toast(t("toasts.queueRestored"), "done", true, "restoring_queue");
		}

		return Boolean(restored);
	}

	function addToQueue(queueItem, current = false) {
		if (Array.isArray(queueItem)) {
			if (queueItem.length > 1) {
				queueItem.forEach((item) => {
					item.silent = true;
					addToQueue(item);
				});
				toast(
					t("toasts.addedMoreToQueue", { n: queueItem.length }),
					"playlist_add_check"
				);
				return;
			}

			queueItem = queueItem[0];
		}

		if (!queueItem) return;

		// Add implicit values back
		queueItem.downloaded = queueItem.downloaded || 0;
		queueItem.failed = queueItem.failed || 0;
		queueItem.progress = queueItem.progress || 0;
		queueItem.conversion = queueItem.conversion || 0;
		queueItem.errors = queueItem.errors || [];
		queueItem.current = current;

		const alreadyKnown = Boolean(queueList.value[queueItem.uuid]);
		queueList.value[queueItem.uuid] = queueItem;

		// * Used when opening the app in another tab
		const itemIsAlreadyDownloaded =
			queueItem.downloaded + queueItem.failed == queueItem.size;

		if (itemIsAlreadyDownloaded) {
			queueList.value[queueItem.uuid].status = "download finished";

			if (!queueComplete.value.includes(queueItem.uuid)) {
				queueComplete.value.push(queueItem.uuid);
			}
		} else if (!queue.value.includes(queueItem.uuid)) {
			queue.value.push(queueItem.uuid);
		}

		const needToStartDownload =
			!itemIsAlreadyDownloaded &&
			((queueItem.progress > 0 && queueItem.progress < 100) || current);

		if (needToStartDownload) {
			startDownload(queueItem.uuid);
		}

		if (!queueItem.silent && !alreadyKnown) {
			toast(
				t("toasts.addedToQueue", { item: queueItem.title }),
				"playlist_add_check"
			);
		}
	}

	function updateQueue(update) {
		const {
			uuid,
			downloaded,
			alreadyDownloaded,
			failed,
			progress,
			conversion,
			error,
			data,
			errid,
			stack,
			postFailed,
		} = update;

		if (!uuid || !queue.value.includes(uuid) || !queueList.value[uuid]) return;

		const item = queueList.value[uuid];

		if (downloaded || alreadyDownloaded) item.downloaded++;

		if (failed) {
			item.failed++;
			item.errors.push({ message: error, data, errid, stack });
		}

		if (progress) item.progress = progress;
		if (conversion) item.conversion = conversion;
		if (postFailed) item.errors.push({ message: error, data, stack });
	}

	function removeFromQueue({ uuid }: { uuid: string }) {
		queue.value = queue.value.filter((el) => el !== uuid);
		queueComplete.value = queueComplete.value.filter((el) => el !== uuid);
		delete queueList.value[uuid];
	}

	function removeAllDownloads(currentItem?: string) {
		queueComplete.value = [];

		if (!currentItem) {
			queue.value = [];
			queueList.value = {};
			return;
		}

		const tempQueueItem = queueList.value[currentItem];

		queue.value = [currentItem];
		queueList.value = tempQueueItem ? { [currentItem]: tempQueueItem } : {};
	}

	function removedFinishedDownloads() {
		const finished = finishedWithoutErrors.value.map((el) => el.uuid);

		finished.forEach((uuid) => {
			delete queueList.value[uuid];
		});

		queueComplete.value = queueComplete.value.filter(
			(uuid) => !finished.includes(uuid)
		);
	}

	function startDownload(uuid: string) {
		if (queueList.value[uuid]) queueList.value[uuid].status = "downloading";
	}

	function finishDownload({ uuid }: { uuid: string }) {
		if (!isInQueue(uuid) || !queueList.value[uuid]) return;

		queueList.value[uuid].status = "download finished";
		toast(
			t("toasts.finishDownload", { item: queueList.value[uuid].title }),
			"done"
		);

		const index = queue.value.indexOf(uuid);

		if (index > -1) {
			queue.value.splice(index, 1);
			queueComplete.value.push(uuid);
		}

		if (queue.value.length <= 0) {
			toast(t("toasts.allDownloaded"), "done_all");
		}
	}

	function startConversion({ uuid }: { uuid: string }) {
		if (!queueList.value[uuid]) return;
		queueList.value[uuid].status = "converting";
		queueList.value[uuid].conversion = 0;
	}

	function finishConversion(downloadObject: { uuid: string; size: number }) {
		if (!queueList.value[downloadObject.uuid]) return;
		queueList.value[downloadObject.uuid].size = downloadObject.size;
	}

	return {
		queue,
		queueComplete,
		queueList,
		pending,
		queueCount,
		getDownloadState,
		sendAddToQueue,
		initQueue,
		addToQueue,
		updateQueue,
		removeFromQueue,
		removeAllDownloads,
		removedFinishedDownloads,
		startDownload,
		finishDownload,
		startConversion,
		finishConversion,
	};
});
