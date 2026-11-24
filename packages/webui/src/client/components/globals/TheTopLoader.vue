<script setup lang="ts">
import { pinia } from "@/stores";
import { useLoadingStore } from "@/stores/loading";
import { onUnmounted, ref, watch } from "vue";

/** Avoids flickering for requests that resolve almost instantly */
const SHOW_DELAY = 150;

const loadingStore = useLoadingStore(pinia);
const isVisible = ref(false);
let timer: ReturnType<typeof setTimeout> | null = null;

watch(
	() => loadingStore.isLoading,
	(isLoading) => {
		if (timer) clearTimeout(timer);

		if (isLoading) {
			timer = setTimeout(() => (isVisible.value = true), SHOW_DELAY);
		} else {
			isVisible.value = false;
		}
	},
	{ immediate: true }
);

onUnmounted(() => {
	if (timer) clearTimeout(timer);
});
</script>

<template>
	<div
		class="top-loader"
		:class="{ 'top-loader--visible': isVisible }"
		role="progressbar"
		aria-label="Loading"
		:aria-hidden="!isVisible"
	>
		<div class="top-loader__bar"></div>
	</div>
</template>

<style scoped>
.top-loader {
	position: relative;
	flex-shrink: 0;
	height: 3px;
	overflow: hidden;
	opacity: 0;
	transition: opacity 0.2s ease;
	pointer-events: none;
}

.top-loader--visible {
	opacity: 1;
}

.top-loader__bar {
	position: absolute;
	top: 0;
	bottom: 0;
	left: -40%;
	width: 40%;
	background-color: var(--primary-color);
	animation: top-loader-slide 1.1s ease-in-out infinite;
}

.top-loader:not(.top-loader--visible) .top-loader__bar {
	animation-play-state: paused;
}

@keyframes top-loader-slide {
	0% {
		left: -40%;
	}
	100% {
		left: 100%;
	}
}

@media (prefers-reduced-motion: reduce) {
	.top-loader__bar {
		left: 0;
		width: 100%;
		animation: none;
		opacity: 0.6;
	}
}
</style>
