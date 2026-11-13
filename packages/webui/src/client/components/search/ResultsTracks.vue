<script setup lang="ts">
import DownloadButton from "@/components/globals/DownloadButton.vue";
import BaseLoadingPlaceholder from "@/components/globals/BaseLoadingPlaceholder.vue";
import PreviewControls from "@/components/globals/PreviewControls.vue";
import ResultsError from "@/components/search/ResultsError.vue";
import { formatTitle } from "@/data/search";
import { emitter } from "@/utils/emitter";
import { convertDuration } from "@/utils/utils";
import { useI18n } from "vue-i18n";

interface Props {
	viewInfo?: {
		error: string;
		data: any[];
		hasLoaded: boolean;
	};
	itemsToShow?: number;
	wantHeaders?: boolean;
}

const { viewInfo, itemsToShow = 6, wantHeaders = false } = defineProps<Props>();

const { t } = useI18n();

const playPausePreview = (e: MouseEvent) => {
	emitter.emit("trackPreview:playPausePreview", e);
};
</script>

<template>
	<section>
		<BaseLoadingPlaceholder v-if="!viewInfo?.hasLoaded" />

		<template v-else>
			<ResultsError v-if="viewInfo.error" :error="viewInfo.error" />
			<div v-else-if="viewInfo.data.length === 0">
				<h1 class="text-center">{{ t("search.noResultsTrack") }}</h1>
			</div>

			<table v-else class="table--tracks table w-full">
				<thead v-if="wantHeaders">
					<tr class="capitalize">
						<th class="h-12 pb-3" colspan="2">
							{{ t("globals.listTabs.title", 1) }}
						</th>
						<th class="cell-desktop h-12 pb-3">
							{{ t("globals.listTabs.artist", 1) }}
						</th>
						<th class="cell-desktop h-12 pb-3">
							{{ t("globals.listTabs.album", 1) }}
						</th>
						<th class="cell-desktop h-12 pb-3">
							<i class="material-icons">timer</i>
						</th>
						<th class="h-12 w-11 pb-3 md:w-14"></th>
					</tr>
				</thead>

				<tbody>
					<tr
						v-for="track in viewInfo.data.slice(0, itemsToShow)"
						:key="track.trackLink"
					>
						<td class="table__icon table__icon--big">
							<span
								class="relative inline-block cursor-pointer rounded"
								:data-preview="track.trackPreview"
								@click="playPausePreview($event)"
							>
								<PreviewControls v-if="track.trackPreview" />

								<img class="coverart rounded" :src="track.albumPicture" />
							</span>
						</td>

						<td class="table__cell table__cell--large">
							<div
								class="table__cell-content table__cell-content--vertical-center break-words [overflow-wrap:anywhere]"
							>
								<i
									v-if="track.isTrackExplicit"
									class="material-icons title-icon"
									>explicit</i
								>
								{{ formatTitle(track) }}
							</div>
							<span class="cell-subtitle">
								{{ track.artistName }} · {{ track.albumTitle }} ·
								{{ convertDuration(track.trackDuration) }}
							</span>
						</td>

						<router-link
							v-slot="{ navigate }"
							custom
							:to="{ name: 'Artist', params: { id: track.artistID } }"
						>
							<td
								role="link"
								class="table__cell table__cell--medium table__cell--center cell-desktop break-words"
								@click="navigate"
							>
								<span class="cursor-pointer hover:underline">
									{{ track.artistName }}
								</span>
							</td>
						</router-link>

						<router-link
							v-slot="{ navigate }"
							custom
							:to="{ name: 'Album', params: { id: track.albumID } }"
						>
							<td
								role="link"
								class="table__cell table__cell--medium table__cell--center cell-desktop break-words"
								@click="navigate"
							>
								<span class="cursor-pointer hover:underline">
									{{ track.albumTitle }}
								</span>
							</td>
						</router-link>

						<td
							class="table__cell table__cell--small table__cell--center cell-desktop"
						>
							{{ convertDuration(track.trackDuration) }}
						</td>

						<td class="table__cell--center">
							<DownloadButton
								plain
								:link="track.trackLink"
								:item-title="track.trackTitle"
								class="transition-colors duration-150 ease-in-out"
							/>
						</td>
					</tr>
				</tbody>
			</table>
		</template>
	</section>
</template>
