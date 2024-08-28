<template>
	<i
		class="rounded material-icons preview_controls absolute right-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 text-center text-white opacity-0 transition-opacity duration-200 ease-in-out"
		:title="$t('globals.play_hint').toString()"
		@mouseenter="previewMouseEnter"
		@mouseleave="previewMouseLeave"
	>
		play_arrow
	</i>
</template>

<script>
import EventBus from "@/utils/EventBus";

export default {
	methods: {
		previewMouseEnter: () => {
			EventBus.$emit("trackPreview:previewMouseEnter");
		},
		previewMouseLeave: () => {
			EventBus.$emit("trackPreview:previewMouseLeave");
		},
	},
};
</script>
