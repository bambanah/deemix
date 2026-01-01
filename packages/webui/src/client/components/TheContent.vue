<template>
	<main
		id="content"
		ref="content"
		aria-label="main content"
		@scroll="$route.name === 'Search' ? handleContentScroll() : null"
	>
		<div id="container">
			<BackButton
				v-if="showBackButton"
				class="sticky -ml-20"
				style="top: 1rem"
			/>

			<router-view
				v-if="!$route.meta.notKeepAlive"
				:key="$route.fullPath"
				:class="{ '-mt-16': showBackButton }"
				:perform-scrolled-search="performScrolledSearch"
			></router-view>

			<router-view
				v-if="$route.meta.notKeepAlive"
				:key="$route.fullPath"
				:class="{ '-mt-16': showBackButton }"
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
#container {
	--container-width: 95%;
	margin: 0 auto;
	max-width: 1280px;
	width: var(--container-width);
	transform: scale(1);
}
@media only screen and (min-width: 601px) {
	#container {
		--container-width: 85%;
	}
}
@media only screen and (min-width: 993px) {
	#container {
		--container-width: 70%;
	}
}

main {
	background-color: var(--main-background);
	padding-right: 5px;
	width: 100%;
	height: calc(100vh - 93px);
	overflow-y: scroll;
	overflow-x: hidden;
}

@media (max-width: 767px) {
	main {
		height: calc(100dvh - 93px - env(safe-area-inset-bottom, 0px));
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
