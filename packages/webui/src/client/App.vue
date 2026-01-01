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
import { onMounted, ref } from "vue";

const appInfoStore = useAppInfoStore(pinia);

const isSocketConnected = ref(false);
const loadingText = ref("Connecting to local server...");

function toggleMobileSidebar() {
	appInfoStore.toggleMobileSidebar();
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
				<!-- Mobile header with hamburger -->
				<div class="mobile-header">
					<button
						class="hamburger-btn"
						aria-label="Toggle menu"
						@click="toggleMobileSidebar"
					>
						<svg viewBox="0 0 24 24">
							<rect x="3" y="5" width="18" height="2" rx="1" />
							<rect x="3" y="11" width="18" height="2" rx="1" />
							<rect x="3" y="17" width="18" height="2" rx="1" />
						</svg>
					</button>
					<TheSearchBar />
				</div>
				<DeezerWarning />
				<TheContent />
			</div>

			<TheDownloadBar />
		</div>

		<BaseLoadingPlaceholder
			:text="loadingText"
			:hidden="isSocketConnected"
			additional-classes="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-50"
		/>

		<TheTrackPreview />
		<TheQualityModal />

		<TheContextMenu />
	</div>
</template>

<style>
.app-container {
	display: flex;
	min-height: 100vh;
	min-height: 100dvh; /* Dynamic viewport height for mobile */
}

.content-container {
	width: 100%;
	display: flex;
	flex-direction: column;
	overflow-x: hidden;
}

/* Mobile header with hamburger + search bar */
.mobile-header {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 10px;
}

.mobile-header #search {
	flex: 1;
	margin: 0;
}

.hamburger-btn {
	display: none;
	width: 48px;
	height: 48px;
	padding: 12px;
	border: none;
	background: var(--secondary-background);
	border-radius: 15px;
	cursor: pointer;
	flex-shrink: 0;
}

.hamburger-btn svg {
	width: 24px;
	height: 24px;
	fill: var(--foreground);
}

/* Mobile: show hamburger, add bottom padding */
@media (max-width: 767px) {
	.hamburger-btn {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.content-container {
		padding-bottom: calc(80px + env(safe-area-inset-bottom, 0px));
	}
}

/* Desktop: restore original search bar margin */
@media (min-width: 768px) {
	.mobile-header {
		padding: 0;
	}

	.mobile-header #search {
		margin: 10px 10px 20px 10px;
	}
}
</style>
