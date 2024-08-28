<template>
	<div>
		<h1 class="mb-8 text-5xl">
			{{ $t("charts.title") }} {{ country ? `- ${country}` : "" }}
		</h1>

		<div v-if="country === ''">
			<div class="release-grid">
				<div
					v-for="release in countries"
					:key="release.id"
					:aria-label="release.title"
					:data-id="release.id"
					:data-title="release.title"
					class="release clickable h-40 w-40"
					role="button"
					tabindex="0"
					@click="getTrackList"
					@keyup.enter="getTrackList"
				>
					<img
						:src="release.picture_medium"
						class="rounded coverart w-full"
						:alt="release.title"
					/>
				</div>
			</div>
		</div>

		<div v-else>
			<button class="btn btn-primary" @click="onChangeCountry">
				{{ $t("charts.changeCountry") }}
			</button>
			<button
				:data-link="'https://www.deezer.com/playlist/' + id"
				class="btn btn-primary"
				@click.stop="addToQueue"
			>
				{{ $t("charts.download") }}
			</button>
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
								class="rounded relative inline-block cursor-pointer"
								@click="playPausePreview"
							>
								<PreviewControls v-if="track.preview" />
								<img :src="track.album.cover_small" class="rounded coverart" />
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
							class="table__cell table__cell--medium table__cell--center clickable"
							custom
						>
							<td role="link" @click="navigate" @keypress.enter="navigate">
								{{ track.artist.name }}
							</td>
						</router-link>
						<router-link
							v-slot="{ navigate }"
							:to="{ name: 'Album', params: { id: track.album.id } }"
							class="table__cell--medium table__cell--center clickable"
							custom
						>
							<td role="link" @click="navigate" @keypress.enter="navigate">
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
								:title="$t('globals.download_hint')"
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

<script>
import PreviewControls from "@/components/globals/PreviewControls.vue";
import { sendAddToQueue } from "@/utils/downloads";
import { convertDuration } from "@/utils/utils";
import { getChartsData, getChartTracks } from "@/data/charts";
import EventBus from "@/utils/EventBus";

export default {
	components: {
		PreviewControls,
	},
	data() {
		return {
			country: "",
			id: 0,
			countries: [],
			chart: [],
		};
	},
	computed: {
		worldwideRelease() {
			const worldwideRelease = this.countries.filter((country) => {
				return country.title === "Worldwide";
			});

			return worldwideRelease[0];
		},
	},
	watch: {
		id(newId) {
			const isActualChart = newId !== 0;

			if (isActualChart) {
				this.setTracklist([]);
				getChartTracks(newId).then((response) =>
					this.setTracklist(response.data)
				);
			}
		},
	},
	async created() {
		// socket.on('setChartTracks', this.setTracklist)
		// this.$on('hook:destroyed', () => {
		// 	socket.off('setChartTracks')
		// })

		const { data: chartsData } = await getChartsData();
		this.initCharts(chartsData);
	},
	methods: {
		convertDuration,
		playPausePreview: (e) => {
			EventBus.$emit("trackPreview:playPausePreview", e);
		},
		addToQueue(e) {
			e.stopPropagation();
			sendAddToQueue(e.currentTarget.dataset.link);
		},
		getTrackList(event) {
			document.getElementById("content").scrollTo(0, 0);

			const {
				currentTarget: {
					dataset: { title, id },
				},
			} = event;

			this.country = title;
			localStorage.setItem("chart", this.country);
			this.id = id;
		},
		setTracklist(data) {
			this.chart = data;
		},
		onChangeCountry() {
			this.country = "";
			this.id = 0;
		},
		initCharts(chartsData) {
			this.countries = chartsData;
			this.country = localStorage.getItem("chart") || "";

			if (!this.country) return;

			let i = 0;
			for (; i < this.countries.length; i++) {
				if (this.countries[i].title === this.country) break;
			}

			if (i !== this.countries.length) {
				this.id = this.countries[i].id;
			} else {
				this.country = "";
				localStorage.setItem("chart", this.country);
			}
		},
	},
};
</script>
