<template>
	<i
		class="material-icons preview_controls absolute right-0 top-0 flex h-full w-full items-center justify-center rounded bg-black bg-opacity-50 text-center text-white opacity-0 transition-opacity duration-200 ease-in-out"
		:title="t('globals.play_hint').toString()"
		@mouseenter="previewMouseEnter"
		@mouseleave="previewMouseLeave"
	>
		play_arrow
	</i>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { emitter } from "@/utils/emitter";

const { t } = useI18n();

const previewMouseEnter = () => {
	emitter.emit("trackPreview:previewMouseEnter");
};

const previewMouseLeave = () => {
	emitter.emit("trackPreview:previewMouseLeave");
};
</script>
