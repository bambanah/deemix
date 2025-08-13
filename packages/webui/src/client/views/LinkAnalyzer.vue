<template>
	<div id="analyzer_tab" class="image-header">
		<h1 class="mb-8 text-5xl capitalize">{{ t("sidebar.linkAnalyzer") }}</h1>

		<div v-if="link === ''">
			<p>
				{{ t("linkAnalyzer.info") }}
			</p>
			<p>
				{{ t("linkAnalyzer.useful") }}
			</p>
		</div>
		<div v-else-if="link === 'error'">
			<h2>{{ t("linkAnalyzer.linkNotSupported") }}</h2>
			<p>{{ t("linkAnalyzer.linkNotSupportedYet") }}</p>
		</div>

		<div v-else>
			<header
				class="flex items-center"
				:style="{
					'background-image':
						'linear-gradient(to bottom, transparent 0%, var(--main-background) 100%), url(\'' +
						image +
						'\')',
				}"
			>
				<div>
					<h1 class="m-0">{{ title }}</h1>
					<h2 v-if="type === 'track'" class="m-0 mb-3 text-lg">
						<i18n-t keypath="globals.by" tag="span">
							<template #artist>
								<router-link
									v-slot="{ navigate }"
									custom
									:to="{ name: 'Artist', params: { id: data.artist.id } }"
								>
									<span
										place="artist"
										role="link"
										class="cursor-pointer"
										@click="navigate"
										@keypress.enter="() => navigate()"
										>{{ data.artist.name }}</span
									>
								</router-link>
							</template>
						</i18n-t>
						•
						<i18n-t keypath="globals.in" tag="span">
							<template #album>
								<router-link
									v-slot="{ navigate }"
									custom
									:to="{ name: 'Album', params: { id: data.album.id } }"
								>
									<span
										role="link"
										class="cursor-pointer"
										@click="navigate"
										@keypress.enter="() => navigate()"
										>{{ data.album.title }}</span
									>
								</router-link>
							</template>
						</i18n-t>
					</h2>
					<h2 v-else-if="type === 'album'" class="m-0 mb-3 text-lg">
						<i18n-t keypath="globals.by" tag="span">
							<template #artist>
								<router-link
									v-slot="{ navigate }"
									custom
									:to="{ name: 'Artist', params: { id: data.artist.id } }"
								>
									<span
										role="link"
										class="cursor-pointer"
										@click="navigate"
										@keypress.enter="() => navigate()"
										>{{ data.artist.name }}</span
									>
								</router-link>
							</template>
						</i18n-t>
						{{ ` • ${t("globals.listTabs.trackN", data.nb_tracks)}` }}
					</h2>
				</div>
				<div
					role="button"
					aria-label="download"
					:data-link="link"
					class="bg-primary text-grayscale-870 ml-auto grid h-16 w-16 cursor-pointer place-items-center rounded-full"
					@click.stop="addToQueue"
				>
					<!-- @contextmenu.prevent="openQualityModal" -->
					<i class="material-icons text-4xl" :title="t('globals.download_hint')"
						>get_app</i
					>
				</div>
			</header>
			<table class="table">
				<tr v-if="data.id">
					<td>{{ t("linkAnalyzer.table.id") }}</td>
					<td>{{ data.id }}</td>
				</tr>
				<tr v-if="data.isrc">
					<td>{{ t("linkAnalyzer.table.isrc") }}</td>
					<td>{{ data.isrc }}</td>
				</tr>
				<tr v-if="data.upc">
					<td>{{ t("linkAnalyzer.table.upc") }}</td>
					<td>{{ data.upc }}</td>
				</tr>
				<tr v-if="data.duration">
					<td>{{ t("linkAnalyzer.table.duration") }}</td>
					<td>{{ convertDuration(data.duration) }}</td>
				</tr>
				<tr v-if="data.disk_number">
					<td>{{ t("linkAnalyzer.table.diskNumber") }}</td>
					<td>{{ data.disk_number }}</td>
				</tr>
				<tr v-if="data.track_position">
					<td>{{ t("linkAnalyzer.table.trackNumber") }}</td>
					<td>{{ data.track_position }}</td>
				</tr>
				<tr v-if="data.release_date">
					<td>{{ t("linkAnalyzer.table.releaseDate") }}</td>
					<td>{{ data.release_date }}</td>
				</tr>
				<tr v-if="data.bpm">
					<td>{{ t("linkAnalyzer.table.bpm") }}</td>
					<td>{{ data.bpm }}</td>
				</tr>
				<tr v-if="data.label">
					<td>{{ t("linkAnalyzer.table.label") }}</td>
					<td>{{ data.label }}</td>
				</tr>
				<tr v-if="data.record_type">
					<td>{{ t("linkAnalyzer.table.recordType") }}</td>
					<td>{{ t(`globals.listTabs.${data.record_type}`, 1) }}</td>
				</tr>
				<tr v-if="data.genres && data.genres.data.length">
					<td>{{ t("linkAnalyzer.table.genres") }}</td>
					<td>{{ data.genres.data.map((x) => x.name).join("; ") }}</td>
				</tr>
				<tr v-if="data.readable !== undefined">
					<td>{{ t("linkAnalyzer.table.readable") }}</td>
					<td>
						{{ t(data.readable ? "globals.yes" : "globals.no").capitalize() }}
					</td>
				</tr>
				<tr v-if="countries.length && user.country">
					<td>{{ t("linkAnalyzer.table.available") }}</td>
					<td>
						{{
							t(
								availableCountries.includes(user.country.toLowerCase())
									? "globals.yes"
									: "globals.no"
							).capitalize()
						}}
					</td>
				</tr>
			</table>

			<template v-if="countries.length">
				<h3>{{ t("linkAnalyzer.countries") }}</h3>
				<p v-for="(country, i) in countries" :key="i">
					{{ country[0] }} - [{{ country[2] }}] {{ country[1] }}
				</p>
			</template>
			<template v-else-if="type === 'track'">
				<h3>{{ t("linkAnalyzer.noCountries") }}</h3>
			</template>

			<div v-if="type === 'album'">
				<router-link
					v-slot="{ navigate }"
					custom
					name="button"
					:to="{ name: 'Album', params: { id } }"
				>
					<button
						role="link"
						class="btn btn-primary"
						@click="navigate"
						@keypress.enter="() => navigate()"
					>
						{{ t("linkAnalyzer.table.tracklist") }}
					</button>
				</router-link>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { pinia } from "@/stores";
import { useLoginStore } from "@/stores/login";
import { COUNTRIES } from "@/utils/countries";
import { sendAddToQueue } from "@/utils/downloads";
import { emitter } from "@/utils/emitter";
import { convertDuration } from "@/utils/utils";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const loginStore = useLoginStore(pinia);

const { t } = useI18n();

const user = computed(() => loginStore.user);

const link = ref("");
const title = ref("");
const subtitle = ref("");
const image = ref("");
const type = ref("");
const id = ref("0");
const countries = ref([]);
const availableCountries = ref([]);

interface Data {
	title: string;
	subtitle: string;
	image: string;
	type: string;
	id: string;
	countries: string[][];
	available_countries: string[];
	label: string;
	isrc: string;
	link: string;
	data: any;
	nb_tracks: number;
	upc: string;
	duration: number;
	disk_number: number;
	track_number: number;
	release_date: string;
	bpm: number;
	track_position: number;
	record_type: string;
	readable: boolean;
	genres: {
		data: {
			name: string;
		}[];
	};
	artist: {
		name: string;
		id: string;
	};
	album: {
		id: string;
		title: string;
	};
}

const data = ref<Partial<Data>>({});

function reset() {
	title.value = "Loading...";
	subtitle.value = "";
	image.value = "";
	data.value = {};
	type.value = "";
	link.value = "";
	countries.value = [];
	availableCountries.value = [];
}

function showTrack(data) {
	reset();

	const {
		title,
		title_version,
		album: { cover_xl },
		link,
		available_countries,
		id,
	} = data;

	title.value =
		title +
		(title_version && !title.includes(title_version)
			? " " + title_version
			: "");
	image.value = cover_xl;
	type.value = "track";
	link.value = link;
	id.value = id;

	availableCountries.value.forEach((cc) => {
		const temp = [];
		const chars = [...cc].map((c) => c.charCodeAt() + 127397);
		temp.push(String.fromCodePoint(...chars));
		temp.push(COUNTRIES[cc]);
		temp.push(cc.toUpperCase());
		countries.value.push(temp);
		available_countries.value.push(cc.toLowerCase());
	});

	data.value = data;
}

function showAlbum(data) {
	reset();

	const { title, cover_xl, link, id } = data;

	title.value = title;
	image.value = cover_xl;
	type.value = "album";
	link.value = link;
	data.value = data;
	id.value = id;
}

function notSupported() {
	link.value = "error";
}

function addToQueue(e) {
	sendAddToQueue(e.currentTarget.dataset.link);
}

onMounted(() => {
	emitter.on("analyze_track", showTrack);
	emitter.on("analyze_album", showAlbum);
	emitter.on("analyze_notSupported", notSupported);
});
</script>
