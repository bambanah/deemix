<script setup lang="ts">
import PendingQueueItem from "@/components/downloads/PendingQueueItem.vue";
import QueueItem from "@/components/downloads/QueueItem.vue";
import { pinia } from "@/stores";
import { useAppInfoStore } from "@/stores/appInfo";
import { useDownloadsStore } from "@/stores/downloads";
import { useErrorStore } from "@/stores/errors";
import { useLoginStore } from "@/stores/login";
import { fetchData, postToServer } from "@/utils/api-utils";
import { socket } from "@/utils/socket";
import {
	computed,
	onMounted,
	onUnmounted,
	ref,
	useTemplateRef,
	watch,
} from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();
const router = useRouter();

const tabMinWidth = 250;
const tabMaxWidth = 500;

const loginStore = useLoginStore(pinia);
const appInfoStore = useAppInfoStore(pinia);
const errorStore = useErrorStore(pinia);
const downloadsStore = useDownloadsStore(pinia);

const container = useTemplateRef("container");
const toggler = ref<HTMLElement | null>(null);
const list = ref<HTMLElement | null>(null);

const cachedTabWidth = ref(
	parseInt(localStorage.getItem("downloadTabWidth")) || 300
);
const isExpanded = ref(localStorage.getItem("downloadTabOpen") === "true");

const clientMode = computed(() => loginStore.clientMode);
const isSlim = computed(() => appInfoStore.hasSlimDownloads);
const showTags = computed(() => appInfoStore.showBitrateTags);
const isMobileDownloadsOpen = computed(
	() => appInfoStore.isMobileDownloadsOpen
);

const queueList = computed<Record<string, any>>(() => downloadsStore.queueList);
const pendingItems = computed(() => downloadsStore.pending);
const queueCount = computed(() => downloadsStore.queueCount);

watch(queueCount, (count) => appInfoStore.setDownloadQueueCount(count), {
	immediate: true,
});

function toggleMobileDownloads() {
	appInfoStore.toggleMobileDownloads();
}

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

async function showErrorsTab(item) {
	setErrors(item);

	router.push({ name: "Errors" });
}

onMounted(() => {
	socket.on("startDownload", downloadsStore.startDownload);
	socket.on("startConversion", downloadsStore.startConversion);
	socket.on("finishConversion", downloadsStore.finishConversion);
	socket.on("addedToQueue", downloadsStore.addToQueue);
	socket.on("updateQueue", downloadsStore.updateQueue);
	socket.on("removedFromQueue", downloadsStore.removeFromQueue);
	socket.on("finishDownload", downloadsStore.finishDownload);
	socket.on("removedAllDownloads", downloadsStore.removeAllDownloads);
	socket.on(
		"removedFinishedDownloads",
		downloadsStore.removedFinishedDownloads
	);

	fetchData("getQueue")
		.then((res) => {
			if (downloadsStore.initQueue(res)) socket.emit("queueRestored");
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

	<!-- Mobile bottom sheet -->
	<section
		class="mobile-downloads bg-panels-bg text-foreground fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-2xl shadow-2xl transition-transform duration-300 ease-in-out md:hidden"
		:class="{
			'translate-y-full': !isMobileDownloadsOpen,
			'translate-y-0': isMobileDownloadsOpen,
		}"
		:aria-hidden="!isMobileDownloadsOpen"
		aria-label="downloads"
	>
		<!-- Sheet handle -->
		<button
			class="flex w-full shrink-0 justify-center border-0 bg-transparent py-3"
			aria-label="Close downloads"
			@click="toggleMobileDownloads"
		>
			<span class="h-1 w-12 rounded-full bg-gray-500"></span>
		</button>

		<!-- Sheet header -->
		<div class="flex shrink-0 items-center justify-between px-4 pb-2">
			<span class="text-lg font-semibold capitalize">{{ t("downloads") }}</span>
			<div class="flex">
				<button
					v-if="clientMode"
					class="sheet-action"
					:aria-label="t('globals.open_downloads_folder')"
					@click="openDownloadsFolder"
				>
					<i class="material-icons">folder_open</i>
				</button>
				<button
					class="sheet-action"
					:aria-label="t('globals.clean_queue_hint')"
					@click="cleanQueue"
				>
					<i class="material-icons">clear_all</i>
				</button>
				<button
					class="sheet-action"
					:aria-label="t('globals.cancel_queue_hint')"
					@click="cancelQueue"
				>
					<i class="material-icons">delete_sweep</i>
				</button>
				<button
					class="sheet-action"
					aria-label="Close downloads"
					@click="toggleMobileDownloads"
				>
					<i class="material-icons">close</i>
				</button>
			</div>
		</div>

		<!-- Sheet queue list -->
		<div class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4">
			<PendingQueueItem
				v-for="item in pendingItems"
				:key="item.id"
				:item="item"
			/>
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

	<!-- Desktop side panel -->
	<section
		id="download_tab_container"
		ref="container"
		class="bg-panels-bg text-foreground relative hidden h-full shrink-0 md:block"
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
			<PendingQueueItem
				v-for="item in pendingItems"
				:key="item.id"
				:item="item"
			/>
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
.mobile-downloads {
	height: 70vh;
	height: 70dvh;
	padding-bottom: env(safe-area-inset-bottom, 0px);
}

.sheet-action {
	display: flex;
	align-items: center;
	justify-content: center;
	border: 0;
	background: transparent;
	cursor: pointer;
	width: 44px;
	height: 44px;
	color: var(--foreground);
}

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
