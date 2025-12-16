<template>
	<i
		class="material-icons preview_controls absolute right-0 top-0 !flex h-full w-full items-center justify-center rounded bg-black bg-opacity-50 text-center text-white opacity-0 transition-opacity duration-200 ease-in-out"
		:title="t('globals.play_hint').toString()"
		@mouseenter="previewMouseEnter($event)"
		@mouseleave="previewMouseLeave($event)"
	>
		play_arrow
	</i>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { emitter } from "@/utils/emitter";

const { t } = useI18n();

const previewMouseEnter = (e: MouseEvent) => {
	emitter.emit("trackPreview:previewMouseEnter", e);
};

const previewMouseLeave = (e: MouseEvent) => {
	emitter.emit("trackPreview:previewMouseLeave", e);
};
</script>
