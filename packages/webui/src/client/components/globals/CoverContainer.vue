<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();

interface Props {
	cover: string;
	isRounded?: boolean;
	isCircle?: boolean;
	link: string;
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

		<button
			role="button"
			aria-label="download"
			:data-link="link"
			class="download_overlay hover:bg-primary absolute rounded-full border-0 bg-black p-0 text-center opacity-0"
			tabindex="0"
			v-bind="$attrs"
		>
			<i
				class="material-icons cursor-pointer text-white"
				:title="t('globals.download_hint')"
				>get_app</i
			>
		</button>
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
.cover-container .download_overlay:focus {
	opacity: 1;
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
