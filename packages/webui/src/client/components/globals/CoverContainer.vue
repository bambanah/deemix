<script setup lang="ts">
import BaseSpinner from "@/components/globals/BaseSpinner.vue";
import DownloadButton from "@/components/globals/DownloadButton.vue";

interface Props {
	cover: string;
	isRounded?: boolean;
	isCircle?: boolean;
	link: string;
	itemTitle?: string;
}

defineProps<Props>();
</script>

<template>
	<div class="cover-container group relative">
		<img
			aria-hidden="true"
			class="coverart block w-full opacity-100"
			:class="{ rounded: isRounded, 'rounded-full': isCircle }"
			:src="cover"
		/>

		<DownloadButton
			v-slot="{ state, icon }"
			:link="link"
			:item-title="itemTitle"
			class="download_overlay absolute flex items-center justify-center rounded-full border-0 bg-black p-0 text-center text-white"
		>
			<BaseSpinner v-if="state === 'pending'" :size="20" class="m-3" />
			<i v-else class="material-icons">{{ icon }}</i>
		</DownloadButton>
	</div>
</template>

<style scoped>
/* Fluid square cover: fills its grid cell on phones, capped on desktop */
.cover-container {
	width: 100%;
	aspect-ratio: 1 / 1;
	margin: 0px auto 10px;
}
.cover-container .coverart {
	backface-visibility: hidden;
	transition: 0.5s ease;
	height: 100%;
	object-fit: cover;
}
.cover-container .download_overlay {
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	transition: 0.5s ease;
	opacity: 0;
	min-width: 2rem;
	height: 2.75rem;
	text-align: center;
}
.cover-container .download_overlay i {
	padding: 0.625rem;
}
.cover-container .download_overlay:focus-visible,
.cover-container .download_overlay.download-btn--disabled {
	opacity: 1;
}
.cover-container .download_overlay:not(.download-btn--disabled):hover {
	background-color: var(--primary-color);
}
.cover-container .download_overlay.download-btn--finished {
	background-color: var(--primary-color);
}
@media (min-width: 768px) {
	.cover-container {
		max-width: 156px;
	}
}

/* Touch screens have no hover: keep the download button visible in a corner */
@media (hover: none) {
	.cover-container .download_overlay {
		top: auto;
		left: auto;
		right: 0.375rem;
		bottom: 0.375rem;
		transform: none;
		opacity: 0.9;
		height: 2.5rem;
		min-width: 2.5rem;
	}
	.cover-container .download_overlay i {
		padding: 0.5rem;
	}
}

@media (hover: hover) {
	.cover-container:hover .coverart {
		opacity: 0.75;
	}
	.cover-container:hover .download_overlay {
		opacity: 1;
		border: 0;
	}
}
</style>
