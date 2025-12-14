<script setup lang="ts">
import BaseLoadingPlaceholder from "@/components/globals/BaseLoadingPlaceholder.vue";
import BaseTab from "@/components/globals/BaseTab.vue";
import BaseTabs from "@/components/globals/BaseTabs.vue";
import ResultsAlbums from "@/components/search/ResultsAlbums.vue";
import ResultsAll from "@/components/search/ResultsAll.vue";
import ResultsArtists from "@/components/search/ResultsArtists.vue";
import ResultsPlaylists from "@/components/search/ResultsPlaylists.vue";
import ResultsTracks from "@/components/search/ResultsTracks.vue";
import {
	formatAlbums,
	formatArtist,
	formatPlaylist,
	formatSingleTrack,
} from "@/data/search";
import { standardizeData } from "@/data/standardize";
import { useMainSearch } from "@/use/main-search";
import { useSearch } from "@/use/search";
import { sendAddToQueue } from "@/utils/downloads";
import { uniqWith } from "lodash-es";
import { computed, onMounted, reactive, ref, watch, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { markRaw } from "vue";

const resetObj = { data: [], next: 0, total: 0, hasLoaded: false };

const lastTab = ref(null);

const { t } = useI18n();
const route = useRoute();

interface Props {
	performScrolledSearch?: boolean;
}

const props = defineProps<Props>();

interface Tab {
	name: string;
	searchType: string;
	component: any;
	viewInfo: string;
	formatFunc?: (o?: Record<string, any>) => any;
}

interface State {
	currentTab: Tab;
	results: Record<string, any>;
	tabs: Tab[];
}

const state = reactive<State>({
	currentTab: {
		name: "",
		searchType: "",
		component: {},
		viewInfo: "",
		formatFunc: () => {},
	},
	results: {
		query: "",
		allTab: {
			ORDER: [],
			TOP_RESULT: [],
			ALBUM: {
				hasLoaded: false,
			},
			ARTIST: {
				hasLoaded: false,
			},
			TRACK: {
				hasLoaded: false,
			},
			PLAYLIST: {
				hasLoaded: false,
			},
		},
		trackTab: { ...resetObj },
		albumTab: { ...resetObj },
		artistTab: { ...resetObj },
		playlistTab: { ...resetObj },
	},
	tabs: [
		{
			name: t("globals.listTabs.all"),
			searchType: "all",
			component: markRaw(ResultsAll),
			viewInfo: "allTab",
		},
		{
			name: t("globals.listTabs.track", 2),
			searchType: "track",
			component: markRaw(ResultsTracks),
			viewInfo: "trackTab",
			formatFunc: formatSingleTrack,
		},
		{
			name: t("globals.listTabs.album", 2),
			searchType: "album",
			component: markRaw(ResultsAlbums),
			viewInfo: "albumTab",
			formatFunc: formatAlbums,
		},
		{
			name: t("globals.listTabs.artist", 2),
			searchType: "artist",
			component: markRaw(ResultsArtists),
			viewInfo: "artistTab",
			formatFunc: formatArtist,
		},
		{
			name: t("globals.listTabs.playlist", 2),
			searchType: "playlist",
			component: markRaw(ResultsPlaylists),
			viewInfo: "playlistTab",
			formatFunc: formatPlaylist,
		},
	],
});
const { searchResult, performMainSearch } = useMainSearch();
const { result, performSearch } = useSearch();
const cachedSearchedTerm = computed(() => searchResult.value.QUERY);
const searchedTerm = computed(
	() => route.query.term || cachedSearchedTerm.value
);
const isQueryEmpty = computed(() => state.results.query === "");
const isSearching = ref(false);
const isMainSearchCached = computed(
	() => Object.keys(searchResult.value).length !== 0
);
const isNewSearch = computed(
	() => cachedSearchedTerm.value !== searchedTerm.value
);
const loadedTabs = computed(() => {
	const tabsLoaded = [];

	for (const resultKey in state.results) {
		if (
			Object.prototype.hasOwnProperty.call(state.results, resultKey) &&
			resultKey !== "query"
		) {
			const currentResult = state.results[resultKey];

			if (currentResult.hasLoaded) {
				tabsLoaded.push(resultKey.replace(/Tab/g, ""));
			}
		}
	}

	return tabsLoaded;
});

if (isMainSearchCached.value && !isNewSearch.value) {
	onMounted(() => {
		handleMainSearch(searchResult.value);
	});
}

if (searchedTerm.value && (!isMainSearchCached.value || isNewSearch.value)) {
	performMainSearch(searchedTerm.value);
	isSearching.value = true;
}

function handleMainSearch(newValue) {
	// Hide loading placeholder
	isSearching.value = false;

	state.results.query = newValue.QUERY;

	state.results.allTab = newValue;
	state.results.allTab.TRACK.hasLoaded = true;
	state.results.allTab.ALBUM.hasLoaded = true;
	state.results.allTab.ARTIST.hasLoaded = true;
	state.results.allTab.PLAYLIST.hasLoaded = true;

	state.results.trackTab = newValue.TRACK;
	state.results.albumTab = newValue.ALBUM;
	state.results.artistTab = newValue.ARTIST;
	state.results.playlistTab = newValue.PLAYLIST;

	if (lastTab.value && lastTab.value.searchType !== "all") {
		state.currentTab = lastTab.value;

		performSearch({
			term: newValue.QUERY,
			type: state.currentTab.searchType,
		});
	} else {
		state.currentTab = state.tabs.find((tab) => tab.searchType === "all");
	}
}

function addToQueue(e) {
	sendAddToQueue(e.currentTarget.dataset.link);
}
function getViewInfo() {
	if (state.currentTab.searchType === "all") {
		return state.results.allTab;
	}

	return standardizeData(
		state.results[state.currentTab.viewInfo],
		state.currentTab.formatFunc
	);
}
function changeSearchTab(tabName) {
	tabName = tabName.toLowerCase();

	const newTab = state.tabs.find((tab) => {
		return tab.searchType === tabName;
	});

	if (!newTab) {
		console.error(`No tab ${tabName} found`);
		return;
	}

	window.scrollTo(0, 0);
	state.currentTab = newTab;
	lastTab.value = newTab;
}
function scrolledSearch() {
	if (state.currentTab.searchType === "all") return;

	const currentTabKey = `${state.currentTab.searchType}Tab`;
	const needToPerformScrolledSearch =
		state.results[currentTabKey].next < state.results[currentTabKey].total;

	if (needToPerformScrolledSearch) {
		performSearch({
			term: state.results.query,
			type: state.currentTab.searchType,
			start: state.results[`${state.currentTab.searchType}Tab`].next,
		});
	}
}
function isTabLoaded(tab: Tab) {
	return loadedTabs.value.includes(tab.searchType) || tab.searchType === "all";
}

// Main search watcher
watch(searchResult, handleMainSearch);

// Search watcher
watch(result, (newValue) => {
	const { next: nextResult, total, type, data: newData, error } = newValue;

	const currentTabKey = `${type}Tab`;
	let next = total;
	state.results[currentTabKey].error = error;

	if (nextResult) {
		next = parseInt(nextResult.match(/index=(\d*)/)[1]);
	}

	if (state.results[currentTabKey].total !== total) {
		state.results[currentTabKey].total = total;
	}

	if (state.results[currentTabKey].next !== next) {
		state.results[currentTabKey].next = next;

		// Preventing duplicate entries by filtering them by ID
		const rawData = state.results[currentTabKey].data.concat(newData);
		const filteredData = uniqWith(rawData, (obj1: any, obj2: any) => {
			return obj1.id === obj2.id;
		});

		state.results[currentTabKey].data = filteredData;
	}

	state.results[currentTabKey].hasLoaded = true;
});

watchEffect(() => {
	if (props.performScrolledSearch) scrolledSearch();
});

watch(state.currentTab, (newTab) => {
	if (isTabLoaded(newTab)) return;
	performSearch({
		term: state.results.query,
		type: newTab.searchType,
		start: state.results[`${newTab.searchType}Tab`].next,
	});
});

state.currentTab = state.tabs.find((tab) => tab.searchType === "all");
</script>

<template>
	<div id="search_tab">
		<div v-show="isQueryEmpty && !isSearching">
			<h2>{{ t("search.startSearching") }}</h2>
			<p>{{ t("search.description") }}</p>
		</div>

		<BaseLoadingPlaceholder text="Searching..." :hidden="!isSearching" />

		<div v-show="!isQueryEmpty && !isSearching">
			<BaseTabs>
				<BaseTab
					v-for="tab in state.tabs"
					:key="tab.name"
					:class="{ active: state.currentTab.name === tab.name }"
					@click="changeSearchTab(tab.searchType)"
				>
					{{ tab.name }}
				</BaseTab>
			</BaseTabs>

			<keep-alive>
				<component
					:is="state.currentTab.component"
					:view-info="getViewInfo()"
					want-headers
					:items-to-show="Infinity"
					@add-to-queue="addToQueue"
					@change-search-tab="changeSearchTab"
				></component>
			</keep-alive>
		</div>
	</div>
</template>
