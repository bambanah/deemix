<template>
	<i
		class="absolute top-0 right-0 flex items-center justify-center w-full h-full text-center text-white transition-opacity duration-200 ease-in-out bg-black bg-opacity-50 rounded opacity-0 material-icons preview_controls"
		:title="$t('globals.play_hint')"
		@mouseenter="previewMouseEnter"
		@mouseleave="previewMouseLeave"
	>
		play_arrow
	</i>
</template>

<script>
import {
	previewMouseEnter,
	previewMouseLeave,
} from "@/components/globals/TheTrackPreview.vue";

export default {
	methods: {
		previewMouseEnter,
		previewMouseLeave,
	},
};
</script>
