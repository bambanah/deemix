<script setup lang="ts">
import PreviewControls from "@/components/globals/PreviewControls.vue";
import { getChartsData, getChartTracks } from "@/data/charts";
import { sendAddToQueue } from "@/utils/downloads";
import { emitter } from "@/utils/emitter";
import { convertDuration } from "@/utils/utils";
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const country = ref("");
const id = ref(0);
const countries = ref([]);
const chart = ref([]);

function playPausePreview(e) {
	emitter.emit("trackPreview:playPausePreview", e);
}

function addToQueue(e) {
	e.stopPropagation();
	sendAddToQueue(e.currentTarget.dataset.link);
}

function getTrackList(event) {
	document.getElementById("content").scrollTo(0, 0);

	const {
		currentTarget: {
			dataset: { title, id: countryId },
		},
	} = event;

	country.value = title;
	localStorage.setItem("chart", country.value);
	id.value = countryId;
}

function setTracklist(data) {
	chart.value = data;
}

function onChangeCountry() {
	country.value = "";
	id.value = 0;
}

function initCharts(chartsData) {
	countries.value = chartsData;
	country.value = localStorage.getItem("chart") || "";

	if (!country.value) return;

	let i = 0;
	for (; i < countries.value.length; i++) {
		if (countries.value[i].title === country.value) break;
	}

	if (i !== countries.value.length) {
		id.value = countries.value[i].id;
	} else {
		country.value = "";
		localStorage.setItem("chart", country.value);
	}
}

onMounted(async () => {
	const { data: chartsData } = await getChartsData();
	initCharts(chartsData);
});

watch(id, (newId) => {
	const isActualChart = newId !== 0;

	if (isActualChart) {
		setTracklist([]);
		getChartTracks(newId.toString()).then((response) =>
			setTracklist(response.data)
		);
	}
});
</script>

<template>
	<div>
		<h1 class="mb-8 text-5xl">
			{{ t("charts.title") }} {{ country ? `- ${country}` : "" }}
		</h1>

		<div v-if="country === ''">
			<div class="release-grid">
				<div
					v-for="release in countries"
					:key="release.id"
					:aria-label="release.title"
					:data-id="release.id"
					:data-title="release.title"
					class="release h-40 w-40 cursor-pointer"
					role="button"
					tabindex="0"
					@click="getTrackList"
					@keyup.enter="getTrackList"
				>
					<img
						:src="release.picture_medium"
						class="coverart w-full rounded"
						:alt="release.title"
					/>
				</div>
			</div>
		</div>

		<div v-else>
			<div class="flex gap-x-1">
				<button class="btn btn-primary" @click="onChangeCountry">
					{{ t("charts.changeCountry") }}
				</button>
				<button
					:data-link="'https://www.deezer.com/playlist/' + id"
					class="btn btn-primary"
					@click.stop="addToQueue"
				>
					{{ t("charts.download") }}
				</button>
			</div>

			<table class="table--charts table">
				<tbody>
					<tr v-for="(track, pos) in chart" :key="pos" class="track_row">
						<td
							:class="{ first: pos === 0 }"
							class="cursor-default p-3 text-center"
						>
							{{ pos + 1 }}
						</td>
						<td class="table__icon table__icon--big">
							<span
								:data-preview="track.preview"
								class="relative inline-block cursor-pointer rounded"
								@click="playPausePreview"
							>
								<PreviewControls v-if="track.preview" />
								<img :src="track.album.cover_small" class="coverart rounded" />
							</span>
						</td>
						<td class="table__cell--large">
							{{
								track.title +
								(track.title_version &&
								track.title.indexOf(track.title_version) == -1
									? " " + track.title_version
									: "")
							}}
						</td>
						<router-link
							v-slot="{ navigate }"
							:to="{ name: 'Artist', params: { id: track.artist.id } }"
							custom
						>
							<td
								role="link"
								class="table__cell table__cell--medium table__cell--center cursor-pointer"
								@click="navigate"
							>
								{{ track.artist.name }}
							</td>
						</router-link>
						<router-link
							v-slot="{ navigate }"
							:to="{ name: 'Album', params: { id: track.album.id } }"
							custom
						>
							<td
								role="link"
								class="table__cell--medium table__cell--center cursor-pointer"
								@click="navigate"
							>
								{{ track.album.title }}
							</td>
						</router-link>
						<td class="table__cell--small table__cell--center">
							{{ convertDuration(track.duration) }}
						</td>
						<td
							:data-link="track.link"
							aria-label="download"
							class="group cursor-pointer"
							role="button"
							@click.stop="addToQueue"
						>
							<i
								:title="t('globals.download_hint')"
								class="material-icons group-hover:text-primary transition-colors duration-150 ease-in-out"
							>
								get_app
							</i>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
