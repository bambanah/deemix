<script setup lang="ts">
import TopResult from "@/components/search/TopResult.vue";
import ResultsTracks from "@/components/search/ResultsTracks.vue";
import ResultsAlbums from "@/components/search/ResultsAlbums.vue";
import ResultsArtists from "@/components/search/ResultsArtists.vue";
import ResultsPlaylists from "@/components/search/ResultsPlaylists.vue";
import ResultsError from "@/components/search/ResultsError.vue";

import {
	formatSingleTrack,
	formatAlbums,
	formatArtist,
	formatPlaylist,
} from "@/data/search";
import { standardizeData } from "@/data/standardize";
import { useI18n } from "vue-i18n";
import { computed } from "vue";

const { t } = useI18n();

interface Props {
	viewInfo: any;
}

const { viewInfo } = defineProps<Props>();

const thereAreResults = computed(() => {
	const areInfosLoaded = !!viewInfo;

	if (!areInfosLoaded) {
		return false;
	}

	const noResultsPresent = viewInfo.ORDER.every((section) =>
		section === "TOP_RESULT"
			? viewInfo[section].length === 0
			: viewInfo[section].data.length === 0
	);

	return !noResultsPresent;
});

function checkSectionResults(section) {
	if (section === "TOP_RESULT") {
		return !!viewInfo.TOP_RESULT[0];
	} else {
		return !!viewInfo[section].data[0];
	}
}
</script>

<template>
	<section>
		<ResultsError v-if="viewInfo.ERROR" :error="viewInfo.ERROR"></ResultsError>
		<div v-else-if="!thereAreResults">
			<h1 class="text-center">{{ t("search.noResults") }}</h1>
		</div>

		<template v-else>
			<section
				v-for="section in viewInfo.ORDER"
				:key="section"
				class="border-grayscale-500 float-none border-t py-5 first:border-t-0"
			>
				<template v-if="checkSectionResults(section)">
					<h2
						class="mb-6 capitalize"
						:class="{
							'text-center text-4xl': section === 'TOP_RESULT',
							'hover:text-primary inline-block cursor-pointer text-3xl transition-colors duration-200 ease-in-out':
								section !== 'TOP_RESULT',
						}"
						@click="$emit('change-search-tab', section)"
					>
						{{ t(`globals.listTabs.${section.toLowerCase()}`, 2) }}
					</h2>

					<TopResult
						v-if="section === 'TOP_RESULT'"
						:info="viewInfo.TOP_RESULT[0]"
						@add-to-queue="$emit('add-to-queue', $event)"
					/>

					<ResultsTracks
						v-else-if="section === 'TRACK'"
						:view-info="standardizeData(viewInfo.TRACK, formatSingleTrack)"
						@add-to-queue="$emit('add-to-queue', $event)"
					/>

					<ResultsAlbums
						v-else-if="section === 'ALBUM'"
						:view-info="standardizeData(viewInfo.ALBUM, formatAlbums)"
						@add-to-queue="$emit('add-to-queue', $event)"
					/>

					<ResultsPlaylists
						v-else-if="section === 'PLAYLIST'"
						:view-info="standardizeData(viewInfo.PLAYLIST, formatPlaylist)"
						@add-to-queue="$emit('add-to-queue', $event)"
					/>

					<ResultsArtists
						v-else-if="section === 'ARTIST'"
						:view-info="standardizeData(viewInfo.ARTIST, formatArtist)"
						@add-to-queue="$emit('add-to-queue', $event)"
					/>
				</template>
			</section>
		</template>
	</section>
</template>
