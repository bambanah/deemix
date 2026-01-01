<script setup lang="ts">
import { pinia } from "@/stores";
import { useAppInfoStore } from "@/stores/appInfo";
import { fetchData } from "@/utils/api-utils";
import { sendAddToQueue } from "@/utils/downloads";
import { emitter } from "@/utils/emitter";
import { isValidURL } from "@/utils/utils";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

const appInfoStore = useAppInfoStore(pinia);
const route = useRoute();
const router = useRouter();

const { t } = useI18n();

const searchbar = ref<HTMLInputElement | null>(null);
const lastTextSearch = ref("");

const showSearchButton = computed(() => appInfoStore.showSearchButton);

function focusSearchBar(keyEvent: KeyboardEvent) {
	if (keyEvent.keyCode === 70 && keyEvent.ctrlKey) {
		keyEvent.preventDefault();
		searchbar.value.focus();
	}
}
function deleteSearchBarContent(keyEvent: KeyboardEvent) {
	if (!(keyEvent.key === "Backspace" && keyEvent.ctrlKey && keyEvent.shiftKey))
		return;

	searchbar.value.value = "";
	searchbar.value.focus();
}

async function clickPerformSearch(ev: MouseEvent) {
	ev.preventDefault();
	const term = searchbar.value.value;
	const isEmptySearch = term === "";
	if (isEmptySearch) return;

	await performSearch(term, false);
}

async function rightClickPerformSearch(ev: MouseEvent) {
	ev.preventDefault();
	ev.stopPropagation();
	const term = searchbar.value.value;
	if (!term) return;

	await performSearch(term, true);
}

async function keyPerformSearch(keyEvent: KeyboardEvent) {
	const isEnterPressed = keyEvent.keyCode === 13;
	if (!isEnterPressed) return;

	const term = searchbar.value.value;
	if (!term) return;

	const isCtrlPressed = keyEvent.ctrlKey;
	await performSearch(term, isCtrlPressed);
}

async function performSearch(term: string, modifierKey: boolean) {
	const isSearchingURL = isValidURL(term);
	const isShowingAnalyzer = route.name === "Link Analyzer";
	const isShowingSearch = route.name === "Search";
	const isSameAsLastSearch = term === lastTextSearch.value;

	if (isSearchingURL) {
		if (modifierKey) {
			emitter.emit("ContextMenu:searchbar", term);
			return;
		}

		if (isShowingAnalyzer) {
			try {
				const analyzedData = await fetchData("analyzeLink", { term });
				const isError = !!analyzedData.errorCode;

				if (isError) {
					emitter.emit("analyze_notSupported", analyzedData);
					return;
				}

				if (analyzedData.type === "track") {
					emitter.emit("analyze_track", analyzedData);
				}

				if (analyzedData.type === "album") {
					emitter.emit("analyze_album", analyzedData);
				}
				return;
			} catch (error) {
				console.error(error);
				return;
			}
		}

		sendAddToQueue(term);
	} else {
		// The user is searching a normal string
		if (isShowingSearch && isSameAsLastSearch) return;

		/*
				isShowing 		isSame
				false 				false			Loading
				false 				true			Loading (because component Search is not loaded)
				true 					false			Loading
				true 					true			Never
				*/

		lastTextSearch.value = term;
		await router.push({
			name: "Search",
			query: {
				term,
			},
		});
	}
}

onMounted(() => {
	document.addEventListener("keydown", focusSearchBar);
	document.addEventListener("keyup", deleteSearchBarContent);
});

onUnmounted(() => {
	document.removeEventListener("keydown", focusSearchBar);
	document.removeEventListener("keyup", deleteSearchBarContent);
});
</script>

<template>
	<header id="search" aria-label="searchbar" :class="{ showSearchButton }">
		<div v-show="!showSearchButton" class="search__icon hidden md:block">
			<i class="material-icons">search</i>
		</div>

		<input
			id="searchbar"
			ref="searchbar"
			class="w-full"
			autocomplete="off"
			type="search"
			name="searchbar"
			value=""
			:placeholder="t('searchbar')"
			autofocus
			@keyup="keyPerformSearch($event)"
		/>

		<a
			v-show="showSearchButton"
			href="#"
			class="searchButton"
			@contextmenu="rightClickPerformSearch"
			@click="clickPerformSearch"
			><i class="material-icons">search</i></a
		>
	</header>
</template>

<style>
input[type="search"]::-webkit-search-cancel-button {
	-webkit-appearance: none;
	width: 28px;
	height: 28px;
	background-color: var(--foreground);
	-webkit-mask-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='28' viewBox='0 0 24 24' width='28'%3E%%3Cpath fill='%23ffffff' d='M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z'/%3E3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3C/svg%3E");
	mask-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='28' viewBox='0 0 24 24' width='28'%3E%%3Cpath fill='%23ffffff' d='M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z'/%3E3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3C/svg%3E");
}

#search {
	background-color: var(--secondary-background);
	padding: 0 1em;
	display: flex;
	align-items: center;
	border: 1px solid transparent;
	transition: border 200ms ease-in-out;
	border-radius: 15px;
	margin: 10px 10px 20px 10px;
	overflow: hidden;
}
#search .search__icon {
	width: 2rem;
	height: 2rem;
}
#search .search__icon i {
	font-size: 2rem;
	color: var(--foreground);
}
#search .search__icon i::selection {
	background: none;
}
#search #searchbar {
	height: 45px;
	padding-left: 0.5em;
	border: 0px;
	border-radius: 0px;
	background-color: var(--secondary-background);
	color: var(--foreground);
	font-size: 1.2rem;
	font-family: "Open Sans";
	font-weight: 300;
	margin-bottom: 0;
}
#search #searchbar:focus {
	outline: none;
}
#search #searchbar::-webkit-search-cancel-button {
	appearance: none;
	width: 28px;
	height: 28px;
	background-color: var(--foreground);
	mask-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='28' viewBox='0 0 24 24' width='28'%3E%%3Cpath fill='%23ffffff' d='M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z'/%3E3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3C/svg%3E");
}
#search #searchbar:-webkit-autofill,
#search #searchbar:-webkit-autofill:hover,
#search #searchbar:-webkit-autofill:focus,
#search #searchbar:-webkit-autofill:active {
	box-shadow: 0 0 0 45px var(--secondary-background) inset !important;
}
#search .searchButton {
	background-color: var(--primary-color);
	color: var(--primary-text);
	align-self: stretch;
	width: 48px;
	display: flex;
	text-decoration: none;
	align-items: center;
	justify-content: center;
	border-radius: 0px 15px 15px 0px;
	margin-left: 1em;
}
#search .searchButton i {
	font-size: 2rem;
}
#search .searchButton i::selection {
	background: none;
}
#search:focus-within {
	border: 1px solid var(--foreground);
}
#search.showSearchButton {
	padding: 0 0 0 1em;
}
</style>
