<script setup lang="ts">
import TheDownloadBar from "@/components/downloads/TheDownloadBar.vue";
import BaseLoadingPlaceholder from "@/components/globals/BaseLoadingPlaceholder.vue";
import DeezerWarning from "@/components/globals/DeezerWarning.vue";
import TheContextMenu from "@/components/globals/TheContextMenu.vue";
import TheQualityModal from "@/components/globals/TheQualityModal.vue";
import TheTrackPreview from "@/components/globals/TheTrackPreview.vue";
import TheContent from "@/components/TheContent.vue";
import TheSearchBar from "@/components/TheSearchBar.vue";
import TheSidebar from "@/components/TheSidebar.vue";
import { pinia } from "@/stores";
import { useAppInfoStore } from "@/stores/appInfo";
import { socket } from "@/utils/socket";
import { computed, onMounted, ref } from "vue";

const appInfoStore = useAppInfoStore(pinia);

const isSocketConnected = ref(false);
const loadingText = ref("Connecting to local server...");

const queueCount = computed(() => appInfoStore.downloadQueueCount);

function toggleMobileSidebar() {
	appInfoStore.toggleMobileSidebar();
}

function toggleMobileDownloads() {
	appInfoStore.toggleMobileDownloads();
}

onMounted(() => {
	isSocketConnected.value = socket.readyState === WebSocket.OPEN;

	socket.addEventListener("open", () => {
		isSocketConnected.value = true;
	});

	socket.addEventListener("error", (event) => {
		console.error(event);
		loadingText.value = "Couldn't connect to local server.";
	});
});
</script>

<template>
	<div id="app">
		<div class="app-container">
			<TheSidebar />

			<div class="content-container">
				<!-- Top bar: menu + search + downloads on mobile, search only on desktop -->
				<div class="app-header">
					<button
						class="header-btn md:hidden"
						aria-label="Toggle menu"
						@click="toggleMobileSidebar"
					>
						<i class="material-icons">menu</i>
					</button>

					<TheSearchBar />

					<button
						class="header-btn relative md:hidden"
						aria-label="Open downloads"
						@click="toggleMobileDownloads"
					>
						<i class="material-icons">download</i>
						<span
							v-if="queueCount > 0"
							class="bg-primary absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs text-white"
						>
							{{ queueCount > 99 ? "99+" : queueCount }}
						</span>
					</button>
				</div>
				<DeezerWarning />
				<TheContent />
			</div>

			<TheDownloadBar />
		</div>

		<BaseLoadingPlaceholder
			:text="loadingText"
			:hidden="isSocketConnected"
			additional-classes="fixed inset-0 bg-black bg-opacity-50 z-50"
		/>

		<TheTrackPreview />
		<TheQualityModal />

		<TheContextMenu />
	</div>
</template>

<style>
/* Mobile first: base styles target small screens, min-width queries enhance */
.app-container {
	display: flex;
	height: 100vh;
	height: 100dvh;
	overflow: hidden;
}

.content-container {
	display: flex;
	flex: 1 1 auto;
	flex-direction: column;
	min-width: 0;
	overflow: hidden;
}

.app-header {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 0.75rem;
	padding-top: calc(0.5rem + env(safe-area-inset-top, 0px));
}

.app-header #search {
	flex: 1;
	min-width: 0;
	margin: 0;
}

.header-btn {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	justify-content: center;
	border: none;
	border-radius: 15px;
	background: var(--secondary-background);
	cursor: pointer;
	width: 44px;
	height: 44px;
	color: var(--foreground);
}

@media (min-width: 768px) {
	.app-header {
		padding: 10px 10px 20px;
	}

	.header-btn {
		display: none;
	}
}
</style>
