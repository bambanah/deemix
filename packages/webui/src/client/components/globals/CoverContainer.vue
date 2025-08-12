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
.cover-container {
	width: 156px;
	height: 156px;
	margin: 0px auto 10px;
}
.cover-container .coverart {
	backface-visibility: hidden;
	transition: 0.5s ease;
	height: auto;
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
.cover-container:hover .coverart {
	opacity: 0.75;
}
.cover-container:hover .download_overlay {
	opacity: 1;
	border: 0;
}
</style>
