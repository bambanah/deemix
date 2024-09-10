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
import { socket } from "@/utils/socket";
import { onMounted, ref } from "vue";

const isSocketConnected = ref(false);
const loadingText = ref("Connecting to local server...");

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

		<TheContextMenu />
	</div>
</template>

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
