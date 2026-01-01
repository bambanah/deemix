<script setup lang="ts">
import QueueItem from "@/components/downloads/QueueItem.vue";
import { pinia } from "@/stores";
import { useAppInfoStore } from "@/stores/appInfo";
import { useErrorStore } from "@/stores/errors";
import { useLoginStore } from "@/stores/login";
import { fetchData, postToServer } from "@/utils/api-utils";
import { socket } from "@/utils/socket";
import { toast } from "@/utils/toasts";
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();
const router = useRouter();

const tabMinWidth = 250;
const tabMaxWidth = 500;

const loginStore = useLoginStore(pinia);
const appInfoStore = useAppInfoStore(pinia);
const errorStore = useErrorStore(pinia);

const container = useTemplateRef("container");
const toggler = ref<HTMLElement | null>(null);
const list = ref<HTMLElement | null>(null);

const cachedTabWidth = ref(
	parseInt(localStorage.getItem("downloadTabWidth")) || 300
);
const queue = ref([]);
const queueList = ref<any>({});
const queueComplete = ref([]);
const isExpanded = ref(localStorage.getItem("downloadTabOpen") === "true");

const clientMode = computed(() => loginStore.clientMode);
const isSlim = computed(() => appInfoStore.hasSlimDownloads);
const showTags = computed(() => appInfoStore.showBitrateTags);
const isMobileDownloadsOpen = computed(
	() => appInfoStore.isMobileDownloadsOpen
);

const queueCount = computed(
	() => queue.value.length + queueComplete.value.length
);

function toggleMobileDownloads() {
	appInfoStore.toggleMobileDownloads();
}

const finishedWithoutErrors = computed(() => {
	const isCompletedWithoutErrors = (el) =>
		(el.status || "") === "download finished" && el.errors.length === 0;

	return Object.values(queueList.value).filter(isCompletedWithoutErrors);
});

function checkIfToggleBar(keyEvent) {
	if (!(keyEvent.ctrlKey && keyEvent.key === "b")) return;

	toggleDownloadTab();
}

const setErrors = (errors) => errorStore.setErrors(errors);

function onRemoveItem(uuid: string) {
	socket.emit("removeFromQueue", uuid);
}

function onRetryDownload(uuid: string) {
	postToServer("retryDownload", { uuid });
}

function setTabWidth(newWidth?: number) {
	if (newWidth === undefined) {
		container.value.style.width = "";
		list.value.style.width = "";
	} else {
		container.value.style.width = newWidth + "px";
		list.value.style.width = newWidth + "px";
	}
}

function initQueue(data) {
	const {
		queueOrder: initQueue,
		//		queueComplete: initQueueComplete,
		current: currentItem,
		queue: initQueueList,
		restored,
	} = data;

	const initQueueComplete = Object.values(initQueueList)
		.filter((el: any) =>
			["completed", "withErrors", "failed"].includes(el.status)
		)
		.map((el: any) => el.uuid);

	if (initQueueComplete && initQueueComplete.length) {
		initQueueComplete.forEach((item) => {
			initQueueList[item].silent = true;
			addToQueue(initQueueList[item]);
		});
	}

	if (currentItem) {
		currentItem.silent = true;
		addToQueue(currentItem, true);
	}

	initQueue.forEach((item) => {
		if (!initQueueList[item]) return;
		initQueueList[item].silent = true;
		addToQueue(initQueueList[item]);
	});

	if (restored) {
		toast(t("toasts.queueRestored"), "done", true, "restoring_queue");
		socket.emit("queueRestored");
	}
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
		} else {
			queueItem = queueItem[0];
		}
	}

	// Add implicit values back
	queueItem.downloaded = queueItem.downloaded || 0;
	queueItem.failed = queueItem.failed || 0;
	queueItem.progress = queueItem.progress || 0;
	queueItem.conversion = queueItem.conversion || 0;
	queueItem.errors = queueItem.errors || [];

	// * Here we have only queueItem objects
	queueItem.current = current;
	queueList.value[queueItem.uuid] = queueItem;

	// * Used when opening the app in another tab
	const itemIsAlreadyDownloaded =
		queueItem.downloaded + queueItem.failed == queueItem.size;

	if (itemIsAlreadyDownloaded) {
		const itemIsNotInCompletedQueue = !queueComplete.value.includes(
			queueItem.uuid
		);

		queueList.value[queueItem.uuid].status = "download finished";

		if (itemIsNotInCompletedQueue) {
			// * Add it
			queueComplete.value.push(queueItem.uuid);
		}
	} else {
		const itemIsNotInQueue = !queue.value.includes(queueItem.uuid);

		if (itemIsNotInQueue) {
			queue.value.push(queueItem.uuid);
		}
	}

	const needToStartDownload =
		!itemIsAlreadyDownloaded &&
		((queueItem.progress > 0 && queueItem.progress < 100) || current);

	if (needToStartDownload) {
		startDownload(queueItem.uuid);
	}

	if (!queueItem.silent) {
		toast(
			t("toasts.addedToQueue", { item: queueItem.title }),
			"playlist_add_check"
		);
	}
}

function updateQueue(update) {
	// downloaded and failed default to false?
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

	if (uuid && queue.value.includes(uuid)) {
		if (downloaded || alreadyDownloaded) {
			queueList.value[uuid].downloaded++;
		}

		if (failed) {
			queueList.value[uuid].failed++;
			queueList.value[uuid].errors.push({
				message: error,
				data,
				errid,
				stack,
			});
		}

		if (progress) {
			queueList.value[uuid].progress = progress;
		}

		if (conversion) {
			queueList.value[uuid].conversion = conversion;
		}

		if (postFailed) {
			queueList.value[uuid].errors.push({ message: error, data, stack });
		}
	}
}

function removeFromQueue({ uuid }: { uuid: string }) {
	const index = queue.value.indexOf(uuid);

	if (index > -1) {
		delete queue.value[index];
		delete queueList.value[uuid];
	}
}

function removeAllDownloads(currentItem) {
	queueComplete.value = [];

	if (!currentItem) {
		queue.value = [];
		queueList.value = {};
	} else {
		queue.value = [currentItem];

		const tempQueueItem = queueList.value[currentItem];

		queueList.value = {};
		queueList.value[currentItem] = tempQueueItem;
	}
}

function removedFinishedDownloads() {
	// TODO: Make this a computed property
	queueComplete.value = finishedWithoutErrors.value.map((el: any) => el.uuid);

	queueComplete.value.forEach((uuid) => {
		delete queueList.value[uuid];
	});

	queueComplete.value = [];
}

function toggleDownloadTab() {
	setTabWidth();

	container.value.style.transition = "all 250ms ease-in-out";

	// Toggle returns a Boolean based on the action it performed
	isExpanded.value = !isExpanded.value;

	if (isExpanded.value) {
		setTabWidth(cachedTabWidth.value);
	}

	localStorage.setItem("downloadTabOpen", isExpanded.value.toString());
}

function cleanQueue() {
	socket.emit("removeFinishedDownloads");
}

function cancelQueue() {
	socket.emit("cancelAllDownloads");
}

function openDownloadsFolder() {
	window.api.send("openDownloadsFolder");
}

function handleDrag(event) {
	let newWidth = window.innerWidth - event.pageX + 2;

	if (newWidth < tabMinWidth) {
		newWidth = tabMinWidth;
	} else if (newWidth > tabMaxWidth) {
		newWidth = tabMaxWidth;
	}

	cachedTabWidth.value = newWidth;
	setTabWidth(newWidth);
}

function startDrag() {
	document.addEventListener("mousemove", handleDrag);
}

function startDownload(uuid) {
	queueList.value[uuid].status = "downloading";
}

function finishDownload({ uuid }: { uuid: string }) {
	const isInQueue =
		queue.value.includes(uuid) || queueComplete.value.includes(uuid);

	if (!isInQueue) return;

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
function startConversion({ uuid }: { uuid: string; title: string }) {
	queueList.value[uuid].status = "converting";
	queueList.value[uuid].conversion = 0;
}
function finishConversion(downloadObject) {
	queueList.value[downloadObject.uuid].size = downloadObject.size;
}
async function showErrorsTab(item) {
	setErrors(item);

	router.push({ name: "Errors" });
}

onMounted(() => {
	socket.on("startDownload", startDownload);
	socket.on("startConversion", startConversion);
	socket.on("finishConversion", finishConversion);
	socket.on("addedToQueue", addToQueue);
	socket.on("updateQueue", updateQueue);
	socket.on("removedFromQueue", removeFromQueue);
	socket.on("finishDownload", finishDownload);
	socket.on("removedAllDownloads", removeAllDownloads);
	socket.on("removedFinishedDownloads", removedFinishedDownloads);

	fetchData("getQueue")
		.then((res) => {
			initQueue(res);
		})
		.catch(console.error);

	// Check if download tab has slim entries
	if (localStorage.getItem("slimDownloads") === "true") {
		list.value.classList.add("slim");
	}

	if (isExpanded.value) {
		setTabWidth(cachedTabWidth.value);
	}

	document.addEventListener("mouseup", () => {
		document.removeEventListener("mousemove", handleDrag);
	});
	document.addEventListener("keyup", checkIfToggleBar);

	window.addEventListener("beforeunload", () => {
		localStorage.setItem("downloadTabWidth", cachedTabWidth.value.toString());
	});
});

onUnmounted(() => {
	document.removeEventListener("keyup", checkIfToggleBar);
});
</script>

<template>
	<!-- Mobile bottom sheet backdrop -->
	<div
		v-if="isMobileDownloadsOpen"
		class="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
		@click="toggleMobileDownloads"
	></div>

	<!-- Mobile FAB button (when sheet is closed) -->
	<button
		v-if="!isMobileDownloadsOpen"
		class="bg-primary fixed right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/30 shadow-lg md:hidden"
		style="bottom: calc(1rem + env(safe-area-inset-bottom, 0px))"
		aria-label="Open downloads"
		@click="toggleMobileDownloads"
	>
		<i class="material-icons text-2xl text-white">download</i>
		<span
			v-if="queueCount > 0"
			class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
		>
			{{ queueCount > 9 ? "9+" : queueCount }}
		</span>
	</button>

	<!-- Mobile bottom sheet -->
	<section
		class="bg-panels-bg text-foreground fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl transition-transform duration-300 ease-in-out md:hidden"
		:class="{
			'translate-y-full': !isMobileDownloadsOpen,
			'translate-y-0': isMobileDownloadsOpen,
		}"
		style="height: 60vh"
		aria-label="downloads"
	>
		<!-- Mobile sheet handle -->
		<div class="flex justify-center py-2" @click="toggleMobileDownloads">
			<div class="h-1 w-12 rounded-full bg-gray-500"></div>
		</div>

		<!-- Mobile header -->
		<div class="flex items-center justify-between px-4 pb-2">
			<span class="text-lg font-semibold capitalize">{{ t("downloads") }}</span>
			<div class="flex gap-2">
				<i
					v-if="clientMode"
					class="material-icons cursor-pointer text-xl"
					@click="openDownloadsFolder"
				>
					folder_open
				</i>
				<i class="material-icons cursor-pointer text-xl" @click="cleanQueue">
					clear_all
				</i>
				<i class="material-icons cursor-pointer text-xl" @click="cancelQueue">
					delete_sweep
				</i>
				<i
					class="material-icons cursor-pointer text-xl"
					@click="toggleMobileDownloads"
				>
					close
				</i>
			</div>
		</div>

		<!-- Mobile queue list -->
		<div class="h-[calc(60vh-80px)] overflow-y-auto px-4">
			<QueueItem
				v-for="item in queueList"
				:key="item.uuid"
				:queue-item="item"
				:show-tags="showTags"
				@show-errors="showErrorsTab"
				@remove-item="onRemoveItem"
				@retry-download="onRetryDownload"
			/>
			<p v-if="queueCount === 0" class="py-8 text-center text-gray-500">
				No downloads in queue
			</p>
		</div>
	</section>

	<!-- Desktop sidebar (unchanged) -->
	<section
		id="download_tab_container"
		ref="container"
		class="bg-panels-bg text-foreground hidden h-screen md:block"
		:class="{ 'tab-hidden': !isExpanded, 'w-8': !isExpanded }"
		:data-label="t('downloads')"
		aria-label="downloads"
		@transitionend="container.style.transition = ''"
	>
		<!-- Drag handler -->
		<div
			v-show="isExpanded"
			class="bg-grayscale-200 absolute h-full w-4"
			style="cursor: ew-resize"
			@mousedown.prevent="startDrag"
		></div>

		<!-- Bar toggler -->
		<i
			id="toggle_download_tab"
			ref="toggler"
			class="material-icons m-1 cursor-pointer text-2xl"
			:class="{ 'ml-1': !isExpanded, 'ml-5': isExpanded }"
			:title="t('globals.toggle_download_tab_hint')"
			@click.prevent="toggleDownloadTab"
		></i>

		<!-- Queue buttons -->
		<div
			class="absolute right-0 top-0 transition-all duration-200 ease-in-out"
			:class="{
				'invisible opacity-0': !isExpanded,
				'visible opacity-100': isExpanded,
			}"
		>
			<i
				v-if="clientMode"
				class="material-icons m-1 cursor-pointer text-2xl"
				:title="t('globals.open_downloads_folder')"
				@click="openDownloadsFolder"
			>
				folder_open
			</i>
			<i
				class="material-icons m-1 cursor-pointer text-2xl"
				:title="t('globals.clean_queue_hint')"
				@click="cleanQueue"
			>
				clear_all
			</i>
			<i
				class="material-icons m-1 cursor-pointer text-2xl"
				:title="t('globals.cancel_queue_hint')"
				@click="cancelQueue"
			>
				delete_sweep
			</i>
		</div>

		<div
			v-show="isExpanded"
			id="download_list"
			ref="list"
			class="w-full pr-2"
			:class="{ slim: isSlim }"
		>
			<QueueItem
				v-for="item in queueList"
				:key="item.uuid"
				:queue-item="item"
				:show-tags="showTags"
				@show-errors="showErrorsTab"
				@remove-item="onRemoveItem"
				@retry-download="onRetryDownload"
			/>
		</div>
	</section>
</template>

<style scoped>
#toggle_download_tab {
	width: 25px;
	height: 25px;
}
#toggle_download_tab::before {
	font-family: "Material Icons";
	font-style: normal;
	font-weight: 400;
	content: "chevron_right";
}

#download_tab_container.tab-hidden #toggle_download_tab::before {
	content: "chevron_left";
}
#download_tab_container.tab-hidden::after {
	content: attr(data-label);
	display: flex;
	align-items: center;
	text-transform: capitalize;
	writing-mode: vertical-rl;
	line-height: 2rem;
}

#download_list {
	height: calc(100% - 32px);
	padding-left: 28px;
	overflow-y: scroll;
}
#download_list::-webkit-scrollbar {
	width: 10px;
}
#download_list::-webkit-scrollbar-track {
	background: var(--panels-background);
}
#download_list::-webkit-scrollbar-thumb {
	background: var(--panels-scroll);
	border-radius: 4px;
	width: 6px;
	padding: 0px 2px;
}
</style>
