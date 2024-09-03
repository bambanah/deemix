<template>
	<section
		id="download_tab_container"
		ref="container"
		class="bg-panels-bg text-foreground block h-screen"
		:class="{ 'tab-hidden': !isExpanded, 'w-8': !isExpanded }"
		:data-label="$t('downloads')"
		aria-label="downloads"
		@transitionend="$refs.container.style.transition = ''"
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
			:title="$t('globals.toggle_download_tab_hint')"
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
				:title="$t('globals.open_downloads_folder')"
				@click="openDownloadsFolder"
			>
				folder_open
			</i>
			<i
				class="material-icons m-1 cursor-pointer text-2xl"
				:title="$t('globals.clean_queue_hint')"
				@click="cleanQueue"
			>
				clear_all
			</i>
			<i
				class="material-icons m-1 cursor-pointer text-2xl"
				:title="$t('globals.cancel_queue_hint')"
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

<script>
import QueueItem from "@/components/downloads/QueueItem.vue";

import { socket } from "@/utils/socket";
import { toast } from "@/utils/toasts";
import { fetchData, postToServer } from "@/utils/api";
import { useLoginStore } from "@/stores/login";
import { useAppInfoStore } from "@/stores/appInfo";
import { useErrorStore } from "@/stores/errors";
import { pinia } from "@/stores";

const tabMinWidth = 250;
const tabMaxWidth = 500;

const loginStore = useLoginStore(pinia);
const appInfoStore = useAppInfoStore(pinia);
const errorStore = useErrorStore(pinia);

export default {
	components: {
		QueueItem,
	},
	data: () => {
		return {
			cachedTabWidth: parseInt(localStorage.getItem("downloadTabWidth")) || 300,
			queue: [],
			queueList: {},
			queueComplete: [],
			isExpanded: localStorage.getItem("downloadTabOpen") === "true",
		};
	},
	computed: {
		clientMode: () => loginStore.clientMode,
		isSlim: () => appInfoStore.hasSlimDownloads,
		showTags: () => appInfoStore.showBitrateTags,
		finishedWithoutErrors() {
			const isCompletedWithoutErrors = (el) =>
				(el.status || "") === "download finished" && el.errors.length === 0;

			return Object.values(this.queueList).filter(isCompletedWithoutErrors);
		},
	},
	created() {
		const checkIfToggleBar = (keyEvent) => {
			if (!(keyEvent.ctrlKey && keyEvent.key === "b")) return;

			this.toggleDownloadTab();
		};

		document.addEventListener("keyup", checkIfToggleBar);

		this.$on("hook:destroyed", () => {
			document.removeEventListener("keyup", checkIfToggleBar);
		});
	},
	mounted() {
		socket.on("startDownload", this.startDownload);
		socket.on("startConversion", this.startConversion);
		socket.on("finishConversion", this.finishConversion);
		// socket.on('init_downloadQueue', this.initQueue)
		socket.on("addedToQueue", this.addToQueue);
		socket.on("updateQueue", this.updateQueue);
		socket.on("removedFromQueue", this.removeFromQueue);
		socket.on("finishDownload", this.finishDownload);
		socket.on("removedAllDownloads", this.removeAllDownloads);
		socket.on("removedFinishedDownloads", this.removedFinishedDownloads);

		fetchData("getQueue")
			.then((res) => {
				this.initQueue(res);
			})
			.catch(console.error);

		// Check if download tab has slim entries
		if (localStorage.getItem("slimDownloads") === "true") {
			this.$refs.list.classList.add("slim");
		}

		if (this.isExpanded) {
			this.setTabWidth(this.cachedTabWidth);
		}

		document.addEventListener("mouseup", () => {
			document.removeEventListener("mousemove", this.handleDrag);
		});

		window.addEventListener("beforeunload", () => {
			localStorage.setItem("downloadTabWidth", this.cachedTabWidth);
		});
	},
	methods: {
		setErrors: (errors) => errorStore.setErrors(errors),
		onRemoveItem(uuid) {
			socket.emit("removeFromQueue", uuid);
		},
		onRetryDownload(uuid) {
			console.log("Retry", uuid);
			postToServer("retryDownload", { uuid });
		},
		setTabWidth(newWidth) {
			if (undefined === newWidth) {
				this.$refs.container.style.width = "";
				this.$refs.list.style.width = "";
			} else {
				this.$refs.container.style.width = newWidth + "px";
				this.$refs.list.style.width = newWidth + "px";
			}
		},
		initQueue(data) {
			const {
				queueOrder: initQueue,
				//		queueComplete: initQueueComplete,
				current: currentItem,
				queue: initQueueList,
				restored,
			} = data;

			const initQueueComplete = Object.values(initQueueList)
				.filter((el) =>
					["completed", "withErrors", "failed"].includes(el.status)
				)
				.map((el) => el.uuid);

			if (initQueueComplete && initQueueComplete.length) {
				initQueueComplete.forEach((item) => {
					initQueueList[item].silent = true;
					this.addToQueue(initQueueList[item]);
				});
			}

			if (currentItem) {
				currentItem.silent = true;
				this.addToQueue(currentItem, true);
			}

			initQueue.forEach((item) => {
				if (!initQueueList[item]) return;
				initQueueList[item].silent = true;
				this.addToQueue(initQueueList[item]);
			});

			if (restored) {
				toast(this.$t("toasts.queueRestored"), "done", true, "restoring_queue");
				socket.emit("queueRestored");
			}
		},
		addToQueue(queueItem, current = false) {
			if (Array.isArray(queueItem)) {
				if (queueItem.length > 1) {
					queueItem.forEach((item) => {
						item.silent = true;
						this.addToQueue(item);
					});
					toast(
						this.$t("toasts.addedMoreToQueue", { n: queueItem.length }),
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
			this.$set(queueItem, "current", current);
			this.$set(this.queueList, queueItem.uuid, queueItem);

			// * Used when opening the app in another tab
			const itemIsAlreadyDownloaded =
				queueItem.downloaded + queueItem.failed == queueItem.size;

			if (itemIsAlreadyDownloaded) {
				const itemIsNotInCompletedQueue = !this.queueComplete.includes(
					queueItem.uuid
				);

				this.$set(
					this.queueList[queueItem.uuid],
					"status",
					"download finished"
				);

				if (itemIsNotInCompletedQueue) {
					// * Add it
					this.queueComplete.push(queueItem.uuid);
				}
			} else {
				const itemIsNotInQueue = !this.queue.includes(queueItem.uuid);

				if (itemIsNotInQueue) {
					this.queue.push(queueItem.uuid);
				}
			}

			const needToStartDownload =
				!itemIsAlreadyDownloaded &&
				((queueItem.progress > 0 && queueItem.progress < 100) || current);

			if (needToStartDownload) {
				this.startDownload(queueItem.uuid);
			}

			if (!queueItem.silent) {
				toast(
					this.$t("toasts.addedToQueue", { item: queueItem.title }),
					"playlist_add_check"
				);
			}
		},
		updateQueue(update) {
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

			if (uuid && this.queue.includes(uuid)) {
				if (downloaded || alreadyDownloaded) {
					this.queueList[uuid].downloaded++;
				}

				if (failed) {
					this.queueList[uuid].failed++;
					this.queueList[uuid].errors.push({
						message: error,
						data,
						errid,
						stack,
					});
				}

				if (progress) {
					this.queueList[uuid].progress = progress;
				}

				if (conversion) {
					this.queueList[uuid].conversion = conversion;
				}

				if (postFailed) {
					this.queueList[uuid].errors.push({ message: error, data, stack });
				}
			}
		},
		removeFromQueue(uuid) {
			const index = this.queue.indexOf(uuid);

			if (index > -1) {
				this.$delete(this.queue, index);
				this.$delete(this.queueList, uuid);
			}
		},
		removeAllDownloads(currentItem) {
			this.queueComplete = [];

			if (!currentItem) {
				this.queue = [];
				this.queueList = {};
			} else {
				this.queue = [currentItem];

				const tempQueueItem = this.queueList[currentItem];

				this.queueList = {};
				this.queueList[currentItem] = tempQueueItem;
			}
		},
		removedFinishedDownloads() {
			// TODO: Make this a computed property
			this.queueComplete = this.finishedWithoutErrors.map((el) => el.uuid);

			this.queueComplete.forEach((uuid) => {
				this.$delete(this.queueList, uuid);
			});

			this.queueComplete = [];
		},
		toggleDownloadTab() {
			this.setTabWidth();

			this.$refs.container.style.transition = "all 250ms ease-in-out";

			// Toggle returns a Boolean based on the action it performed
			this.isExpanded = !this.isExpanded;

			if (this.isExpanded) {
				this.setTabWidth(this.cachedTabWidth);
			}

			localStorage.setItem("downloadTabOpen", this.isExpanded);
		},
		cleanQueue() {
			socket.emit("removeFinishedDownloads");
		},
		cancelQueue() {
			socket.emit("cancelAllDownloads");
		},
		openDownloadsFolder() {
			// if (this.clientMode) {
			window.api.send("openDownloadsFolder");
			// }
		},
		handleDrag(event) {
			let newWidth = window.innerWidth - event.pageX + 2;

			if (newWidth < tabMinWidth) {
				newWidth = tabMinWidth;
			} else if (newWidth > tabMaxWidth) {
				newWidth = tabMaxWidth;
			}

			this.cachedTabWidth = newWidth;
			this.setTabWidth(newWidth);
		},
		startDrag() {
			document.addEventListener("mousemove", this.handleDrag);
		},
		startDownload(uuid) {
			this.$set(this.queueList[uuid], "status", "downloading");
		},
		finishDownload(uuid) {
			const isInQueue =
				this.queue.includes(uuid) || this.queueComplete.includes(uuid);

			if (!isInQueue) return;

			this.$set(this.queueList[uuid], "status", "download finished");
			toast(
				this.$t("toasts.finishDownload", { item: this.queueList[uuid].title }),
				"done"
			);

			const index = this.queue.indexOf(uuid);

			if (index > -1) {
				this.queue.splice(index, 1);
				this.queueComplete.push(uuid);
			}

			if (this.queue.length <= 0) {
				toast(this.$t("toasts.allDownloaded"), "done_all");
			}
		},
		startConversion(uuid) {
			this.$set(this.queueList[uuid], "status", "converting");
			this.$set(this.queueList[uuid], "conversion", 0);
		},
		finishConversion(downloadObject) {
			this.$set(
				this.queueList[downloadObject.uuid],
				"size",
				downloadObject.size
			);
		},
		async showErrorsTab(item) {
			await this.setErrors(item);

			this.$router.push({ name: "Errors" });
		},
	},
};
</script>

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
