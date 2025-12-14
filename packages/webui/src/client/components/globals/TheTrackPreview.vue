<template>
	<audio
		id="preview-track"
		ref="preview"
		@canplay="onCanPlay"
		@timeupdate="onTimeUpdate"
	/>
</template>

<script setup lang="ts">
import router from "@/router";
import { pinia } from "@/stores";
import { useAppInfoStore } from "@/stores/appInfo";
import { emitter } from "@/utils/emitter";
import { adjustVolume } from "@/utils/adjust-volume";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const preview = ref<HTMLAudioElement | null>(null);
const previewStopped = ref(false);

const appInfoStore = useAppInfoStore(pinia);
const previewVolume = computed(() => appInfoStore.previewVolume);

const onCanPlay = async () => {
	if (!preview.value) return;

	await preview.value.play();
	previewStopped.value = false;

	await adjustVolume(preview.value, previewVolume.value / 100, {
		duration: 500,
	});
};

const onTimeUpdate = async () => {
	if (!preview.value?.duration || isNaN(preview.value.duration)) return;

	let duration = preview.value?.duration;

	if (!isFinite(duration)) {
		duration = 30;
	}

	if (duration - preview.value.currentTime >= 1) return;
	if (previewStopped.value) return;

	await adjustVolume(preview.value, 0, { duration: 800 });

	previewStopped.value = true;

	document
		.querySelectorAll("a[playing] > .preview_controls")
		.forEach((control) => {
			control.classList.add("opacity-0");
		});

	document.querySelectorAll("*").forEach((el) => {
		el.removeAttribute("playing");
	});

	document
		.querySelectorAll(".preview_controls, .preview_playlist_controls")
		.forEach((el) => {
			el.textContent = "play_arrow";
		});
};

const playPausePreview = async (e: MouseEvent) => {
	e.preventDefault();
	e.stopPropagation();

	const { currentTarget: obj } = e;

	if (!obj || !preview.value) return;

	const targetElement = obj as HTMLElement;
	const icon =
		targetElement.tagName === "I"
			? targetElement
			: targetElement.querySelector("i");

	if (targetElement.hasAttribute("playing")) {
		if (preview.value?.paused) {
			preview.value.play();
			previewStopped.value = false;

			if (icon) icon.innerText = "pause";

			await adjustVolume(preview.value, previewVolume.value / 100, {
				duration: 500,
			});
		} else {
			previewStopped.value = true;

			if (icon) icon.innerText = "play_arrow";

			await adjustVolume(preview.value, 0, { duration: 250 });
			preview.value.pause();
		}
	} else {
		document.querySelectorAll("*").forEach((el) => {
			el.removeAttribute("playing");
		});
		targetElement.setAttribute("playing", "true");

		document
			.querySelectorAll(".preview_controls, .preview_playlist_controls")
			.forEach((el) => {
				el.textContent = "play_arrow";
			});

		document.querySelectorAll(".preview_controls").forEach((el) => {
			el.classList.add("opacity-0");
		});

		if (icon) {
			icon.innerText = "pause";
			icon.classList.remove("opacity-0");
		}

		previewStopped.value = false;

		await adjustVolume(preview.value, 0, { duration: 250 });
		preview.value.pause();

		preview.value.src = targetElement.getAttribute("data-preview") ?? "";

		preview.value?.load();
	}
};

const stopStackedTabsPreview = async () => {
	const controls = Array.prototype.slice.call(
		document.querySelectorAll(".preview_playlist_controls[playing]")
	);

	if (controls.length === 0 || !preview.value) return;

	await adjustVolume(preview.value, 0, { duration: 250 });
	preview.value.pause();

	previewStopped.value = true;

	controls.forEach((control) => {
		control.removeAttribute("playing");
		control.innerText = "play_arrow";
	});
};

const previewMouseEnter = (e: MouseEvent) => {
	if (!e) return;

	if (e.currentTarget) {
		(e.currentTarget as HTMLElement).classList.remove("opacity-0");
	}
};

const previewMouseLeave = (e: MouseEvent) => {
	if (!e) return;

	const { currentTarget: obj } = e;
	const parentIsPlaying = (obj as HTMLElement)?.parentElement?.hasAttribute(
		"playing"
	);

	if ((parentIsPlaying && previewStopped.value) || !parentIsPlaying) {
		if (obj) {
			(obj as HTMLElement).classList.add("opacity-0");
		}
	}
};

// Lifecycle hooks
onMounted(() => {
	router.beforeEach((_, __, next) => {
		stopStackedTabsPreview();
		next();
	});

	emitter.on("trackPreview:playPausePreview", playPausePreview);
	emitter.on("trackPreview:previewMouseEnter", previewMouseEnter);
	emitter.on("trackPreview:previewMouseLeave", previewMouseLeave);
});

onBeforeUnmount(() => {
	emitter.off("trackPreview:playPausePreview", playPausePreview);
	emitter.off("trackPreview:previewMouseEnter", previewMouseEnter);
	emitter.off("trackPreview:previewMouseLeave", previewMouseLeave);
});
</script>
