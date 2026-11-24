<template>
	<main
		id="content"
		ref="content"
		aria-label="main content"
		@scroll="$route.name === 'Search' ? handleContentScroll() : null"
	>
		<div id="container">
			<BackButton v-if="showBackButton" class="back-button sticky" />

			<router-view
				v-if="!$route.meta.notKeepAlive"
				:key="$route.fullPath"
				:class="{ 'has-back-button': showBackButton }"
				:perform-scrolled-search="performScrolledSearch"
			></router-view>

			<router-view
				v-if="$route.meta.notKeepAlive"
				:key="$route.fullPath"
				:class="{ 'has-back-button': showBackButton }"
				:perform-scrolled-search="performScrolledSearch"
			></router-view>
		</div>
	</main>
</template>

<script setup lang="ts">
import { debounce } from "@/utils/utils";
import BackButton from "@/components/globals/BackButton.vue";
import { computed, nextTick, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const performScrolledSearch = ref(false);
const content = ref<HTMLElement | null>(null);

const showBackButton = computed(() => {
	return [
		"Tracklist",
		"Artist",
		"Album",
		"Playlist",
		"Spotify Playlist",
	].includes(String(route.name));
});

const handleContentScroll = debounce(async function () {
	if (
		content.value.scrollTop + content.value.clientHeight <
		content.value.scrollHeight
	)
		return;

	performScrolledSearch.value = true;

	await nextTick();

	performScrolledSearch.value = false;
}, 100);

onMounted(() => {
	router.beforeEach((_, __, next) => {
		content.value?.scrollTo(0, 0);
		next();
	});
});
</script>

<style>
/* Mobile first: full-width content with side gutters */
#container {
	margin: 0 auto;
	padding: 0 1rem calc(1.5rem + env(safe-area-inset-bottom, 0px));
	width: 100%;
	max-width: 1280px;
	transform: scale(1);
}

#container .back-button {
	top: 0.75rem;
	margin-left: 0.5rem;
}

#container .has-back-button {
	margin-top: -3rem;
}

@media (min-width: 768px) {
	#container {
		padding: 0 0 2rem;
		width: 85%;
	}

	#container .back-button {
		top: 1rem;
		margin-left: -5rem;
	}

	#container .has-back-button {
		margin-top: -4rem;
	}
}

@media (min-width: 993px) {
	#container {
		width: 70%;
	}
}

main {
	flex: 1 1 auto;
	background-color: var(--main-background);
	width: 100%;
	min-height: 0;
	overflow-x: hidden;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
	overscroll-behavior: contain;
}

@media (min-width: 768px) {
	main {
		padding-right: 5px;
		overflow-y: scroll;
	}
}

main::-webkit-scrollbar {
	width: 10px;
}

main::-webkit-scrollbar-track {
	background: var(--main-background);
}

main::-webkit-scrollbar-thumb {
	background: var(--main-scroll);
	border-radius: 4px;
	width: 6px;
	padding: 0px 2px;
}
</style>
