<template>
	<div id="app">
		<div class="app-container">
			<TheSidebar />

			<div class="content-container">
				<TheSearchBar />
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
		<!-- <ConfirmModal /> -->

		<TheContextMenu />
	</div>
</template>

<script>
import { socket } from "@/utils/socket";

import BaseLoadingPlaceholder from "@/components/globals/BaseLoadingPlaceholder.vue";
import TheContextMenu from "@/components/globals/TheContextMenu.vue";
import TheTrackPreview from "@/components/globals/TheTrackPreview.vue";
import TheQualityModal from "@/components/globals/TheQualityModal.vue";
import DeezerWarning from "@/components/globals/DeezerWarning.vue";
// import ConfirmModal from '@/components/globals/ConfirmModal.vue'
import TheSidebar from "@/components/TheSidebar.vue";
import TheSearchBar from "@/components/TheSearchBar.vue";
import TheContent from "@/components/TheContent.vue";
import TheDownloadBar from "@/components/downloads/TheDownloadBar.vue";

export default {
	components: {
		TheSidebar,
		TheSearchBar,
		TheDownloadBar,
		TheTrackPreview,
		TheQualityModal,
		BaseLoadingPlaceholder,
		TheContextMenu,
		TheContent,
		DeezerWarning,
		// ConfirmModal
	},
	data() {
		return {
			isSocketConnected: false,
			loadingText: "Connecting to local server...",
		};
	},
	mounted() {
		this.isSocketConnected = socket.readyState === WebSocket.OPEN;
		socket.addEventListener("open", () => {
			console.log("Connected to WebSocket");
			this.isSocketConnected = true;
		});
		socket.addEventListener("error", (event) => {
			console.log(event);
			this.loadingText = "Couldn't connect to local server.";
		});
	},
};
</script>

<style>
.app-container {
	display: flex;
}

.content-container {
	width: 100%;
	display: flex;
	flex-direction: column;
}
</style>
