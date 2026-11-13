<script setup lang="ts">
import BaseLoadingPlaceholder from "@/components/globals/BaseLoadingPlaceholder.vue";
import BaseSpinner from "@/components/globals/BaseSpinner.vue";
import DownloadButton from "@/components/globals/DownloadButton.vue";
import BaseTab from "@/components/globals/BaseTab.vue";
import BaseTabs from "@/components/globals/BaseTabs.vue";
import { formatArtistData, getArtistData } from "@/data/artist";
import { checkNewRelease } from "@/utils/dates";
import { orderBy } from "lodash-es";
import { computed, reactive, ref, unref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const router = useRouter();
const { t } = useI18n();

const head = ref([
	{
		title: t("globals.listTabs.title", 1),
		sortKey: "releaseTitle",
	},
	{
		title: t("globals.listTabs.releaseDate"),
		sortKey: "releaseDate",
	},
	{
		title: t("globals.listTabs.track", 2),
		sortKey: "releaseTracksNumber",
		class: "cell-desktop",
	},
	// { title: '', width: '32px' }
	{ title: "", width: null },
]);

interface State {
	currentTab: string;
	sortKey: string | ((o: any) => number);
	sortOrder: "asc" | "desc";
	artistReleases: Record<string, any[]>;
	artistName: string;
	artistPicture: string;
	currentRelease: any;
}

const state: State = reactive<State>({
	currentTab: "",
	sortKey: "releaseDate",
	sortOrder: "desc",
	artistReleases: {},
	artistName: "",
	artistPicture: "",
	currentRelease: computed(() => state.artistReleases[state.currentTab]),
});

const downloadLink = computed(
	() => `https://www.deezer.com/artist/${unref(artistID)}`
);
const headerStyle = computed(() => ({
	backgroundImage: `linear-gradient(to bottom, transparent 0%, var(--main-background) 100%), url(${state.artistPicture})`,
}));

const artistID = computed(() => router.currentRoute.value.params.id);
const hasDataLoaded = ref(false);

function sortBy(key?: string) {
	if (key === state.sortKey) {
		state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc";
	} else {
		state.sortKey = key;
		state.sortOrder = "asc";
	}
}

getArtistData(unref(artistID.value.toString()))
	.then((artistData) => {
		hasDataLoaded.value = true;

		const { artistName, artistPictureXL, artistReleases } =
			formatArtistData(artistData);

		Object.assign(state, {
			artistName,
			artistPicture: artistPictureXL,
			artistReleases,
			currentTab: artistReleases ? Object.keys(artistReleases)[0] : 0,
		});
	})
	.catch((err) => {
		hasDataLoaded.value = true;
		console.error(err);
	});

const sortedData = computed(() => {
	if (!unref(hasDataLoaded)) {
		return [];
	}

	let sortKey = state.sortKey;

	if (sortKey === "releaseTracksNumber") {
		sortKey = (o) => Number(o.releaseTracksNumber);
	}

	return orderBy(state.currentRelease, sortKey, state.sortOrder);
});
</script>

<template>
	<BaseLoadingPlaceholder v-if="!hasDataLoaded" class="min-h-[50vh]" />
	<div v-else class="fixed-footer image-header relative">
		<header class="flex items-center" :style="headerStyle">
			<h1 class="m-0 min-w-0 pr-3">{{ state.artistName }}</h1>

			<DownloadButton
				:link="downloadLink"
				:item-title="state.artistName"
				icon-class="text-3xl md:text-4xl"
				:spinner-size="28"
				class="bg-primary text-grayscale-870 ml-auto grid h-12 w-12 shrink-0 place-items-center rounded-full border-0 md:h-16 md:w-16"
			/>
		</header>

		<BaseTabs>
			<BaseTab
				v-for="(item, name) in state.artistReleases"
				:key="name"
				:class="{ active: state.currentTab === name }"
				@click="state.currentTab = name"
			>
				{{ t(`globals.listTabs.${name}`, 2) }}
			</BaseTab>
		</BaseTabs>

		<table class="table">
			<thead>
				<tr>
					<th
						v-for="data in head"
						:key="data.title"
						:style="{ width: data.width ? data.width : 'auto' }"
						class="uppercase-first-letter"
						:class="[
							data.class,
							{
								'sort-asc':
									data.sortKey === state.sortKey && state.sortOrder == 'asc',
								'sort-desc':
									data.sortKey === state.sortKey && state.sortOrder == 'desc',
								sortable: data.sortKey,
								'cursor-pointer': data.sortKey,
							},
						]"
						@click="
							typeof data.sortKey === 'string' ? sortBy(data.sortKey) : null
						"
					>
						<!-- Need to change this behaviour for translations -->
						{{ data.title }}
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="release in sortedData" :key="release.releaseID">
					<router-link
						v-slot="{ navigate }"
						custom
						:data-cm-link="release.releaseLink"
						:to="{ name: 'Album', params: { id: release.releaseID } }"
					>
						<td
							role="link"
							class="flex cursor-pointer items-center"
							@click="navigate"
							@keypress.enter="() => navigate()"
						>
							<img
								class="coverart mr-2 h-10 w-10 shrink-0 rounded md:mr-4 md:h-14 md:w-14"
								:src="release.releaseCover"
							/>
							<i
								v-if="release.isReleaseExplicit"
								class="material-icons title-icon title-icon--explicit"
								>explicit</i
							>
							<div>
								<span class="hover:text-primary flex break-words">
									{{ release.releaseTitle }}
									<i
										v-if="checkNewRelease(release.releaseDate)"
										class="material-icons title-icon title-icon--right title-icon--new"
									>
										fiber_new
									</i>
								</span>
								<span
									v-show="state.currentTab === 'all'"
									class="uppercase-first-letter block text-xs opacity-50"
								>
									{{ t(`globals.listTabs.${release.releaseType}`) }}
								</span>
							</div>
						</td>
					</router-link>
					<td class="w-20 text-center text-xs md:w-32 md:text-base xl:w-40">
						{{ release.releaseDate }}
					</td>
					<td class="cell-desktop w-20 text-center xl:w-32">
						{{ release.releaseTracksNumber }}
					</td>
					<td class="w-8">
						<DownloadButton
							plain
							idle-icon="file_download"
							:link="release.releaseLink"
							:item-title="release.releaseTitle"
						/>
					</td>
				</tr>
			</tbody>
		</table>
		<footer class="bg-background-main">
			<div style="flex-grow: 1">
				<DownloadButton
					v-slot="{ state: downloadState }"
					:link="downloadLink + '/discography'"
					:item-title="state.artistName"
					class="btn btn-flat flex items-center gap-2"
				>
					<BaseSpinner v-if="downloadState === 'pending'" :size="16" />
					{{
						`${t("globals.download", {
							thing: t("globals.listTabs.discography"),
						})}`
					}}
				</DownloadButton>
			</div>
			<DownloadButton
				v-slot="{ state: downloadState, icon }"
				:link="downloadLink + '/' + state.currentTab"
				:item-title="state.artistName"
				class="btn btn-primary flex items-center"
			>
				{{
					`${t("globals.download", {
						thing: t(`globals.listTabs.${state.currentTab}`, 2),
					})}`
				}}<BaseSpinner
					v-if="downloadState === 'pending'"
					:size="18"
					class="ml-2"
				/><i v-else class="material-icons ml-2">{{
					icon === "get_app" ? "file_download" : icon
				}}</i>
			</DownloadButton>
		</footer>
	</div>
</template>
