<script setup lang="ts">
import BaseTab from "@/components/globals/BaseTab.vue";
import BaseTabs from "@/components/globals/BaseTabs.vue";
import CoverContainer from "@/components/globals/CoverContainer.vue";
import PreviewControls from "@/components/globals/PreviewControls.vue";
import { useFavorites } from "@/use/favorites";
import { aggregateDownloadLinks, sendAddToQueue } from "@/utils/downloads";
import { emitter } from "@/utils/emitter";
import { toast } from "@/utils/toasts";
import { convertDuration } from "@/utils/utils";
import { computed, reactive, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const tabs = ["playlist", "album", "artist", "track"] as const;

const state = reactive<{
	activeTab: (typeof tabs)[number];
	tabs: typeof tabs;
}>({
	activeTab: "playlist",
	tabs,
});

const {
	favoriteArtists,
	favoriteAlbums,
	favoriteSpotifyPlaylists,
	favoritePlaylists,
	favoriteTracks,
	lovedTracksPlaylist,
	isRefreshingFavorites,
	refreshFavorites,
} = useFavorites();

refreshFavorites({ isInitial: true }).catch(console.error);

watch(isRefreshingFavorites, (newVal, oldVal) => {
	// If oldVal is true and newOne is false, it means that a refreshing has just terminated
	// because isRefreshingFavorites represents the status of the refresh functionality
	const isRefreshingTerminated = oldVal && !newVal;

	if (!isRefreshingTerminated) return;

	toast(t("toasts.refreshFavs"), "done", true);
});

const onRefreshFavorites = () => {
	refreshFavorites({});
};

function playPausePreview(e) {
	emitter.emit("trackPreview:playPausePreview", e);
}

function downloadAllOfType() {
	try {
		const toDownload = getActiveRelease();

		if (state.activeTab === "track") {
			if (lovedTracksPlaylist.value) {
				sendAddToQueue(lovedTracksPlaylist.value);
			} else {
				const lovedTracks = getLovedTracksPlaylist();
				sendAddToQueue(lovedTracks.link);
			}
		} else {
			sendAddToQueue(aggregateDownloadLinks(toDownload));
		}
	} catch (error) {
		console.error(error.message);
	}
}

function addToQueue(e) {
	sendAddToQueue(e.currentTarget.dataset.link);
}

function getActiveRelease(tab?: (typeof state.tabs)[number]) {
	if (!tab) tab = state.activeTab;

	let toDownload: any[];

	switch (tab) {
		case "playlist":
			toDownload = favoritePlaylists.value;
			toDownload.concat(favoriteSpotifyPlaylists);
			break;
		case "album":
			toDownload = favoriteAlbums.value;
			break;
		case "artist":
			toDownload = favoriteArtists.value;
			break;
		case "track":
			toDownload = favoriteTracks.value;
			break;

		default:
			break;
	}

	return toDownload;
}

function getLovedTracksPlaylist() {
	const lovedTracks = favoritePlaylists.value.filter((playlist) => {
		return playlist.is_loved_track;
	});

	if (lovedTracks.length !== 0) {
		return lovedTracks[0];
	} else {
		toast(t("toasts.noLovedPlaylist"), "warning", true);
		throw new Error("No loved tracks playlist!");
	}
}

const activeTabEmpty = computed(() => {
	const toCheck = getActiveRelease();

	return toCheck?.length === 0;
});
</script>

<template>
	<div>
		<h1 class="mb-8 text-5xl">
			{{ t("favorites.title") }}
			<div
				ref="reloadButton"
				aria-label="reload"
				class="inline-block cursor-pointer"
				role="button"
				@click="onRefreshFavorites"
			>
				<i :class="{ spin: isRefreshingFavorites }" class="material-icons"
					>sync</i
				>
			</div>
		</h1>

		<BaseTabs>
			<BaseTab
				v-for="tab in tabs"
				:key="tab"
				:class="{ active: state.activeTab === tab }"
				@click="state.activeTab = tab"
			>
				{{ t(`globals.listTabs.${tab}`, 2) }}
			</BaseTab>
		</BaseTabs>

		<button
			v-if="!activeTabEmpty"
			class="btn btn-primary"
			style="margin-bottom: 2rem"
			@click="downloadAllOfType"
		>
			{{
				t("globals.download", {
					thing: t(
						`globals.listTabs.${state.activeTab}N`,
						getActiveRelease().length
					),
				})
			}}
		</button>

		<div v-show="state.activeTab === 'playlist'">
			<div
				v-if="favoritePlaylists.length + favoriteSpotifyPlaylists.length === 0"
			>
				<h1>{{ t("favorites.noPlaylists") }}</h1>
			</div>
			<div
				v-if="favoritePlaylists.length + favoriteSpotifyPlaylists.length > 0"
				class="release-grid"
			>
				<div
					v-for="release in favoritePlaylists"
					:key="release.id"
					class="release"
				>
					<router-link
						v-slot="{ navigate }"
						:to="{ name: 'Playlist', params: { id: release.id } }"
						class="cursor-pointer"
						custom
					>
						<div
							role="link"
							class="cursor-pointer"
							@click="navigate"
							@keypress.enter="() => navigate()"
						>
							<CoverContainer
								:cover="release.picture_medium"
								:link="release.link"
								is-rounded
								@click.stop="addToQueue"
							/>
							<p class="primary-text">{{ release.title }}</p>
						</div>
					</router-link>

					<p class="secondary-text">
						{{
							`${t("globals.by", { artist: release.creator.name })} - ${t(
								"globals.listTabs.trackN",
								release.nb_tracks
							)}`
						}}
					</p>
				</div>

				<div
					v-for="release in favoriteSpotifyPlaylists"
					:key="release.id"
					class="release"
				>
					<router-link
						v-slot="{ navigate }"
						:to="{ name: 'Spotify Playlist', params: { id: release.id } }"
						custom
					>
						<div
							role="link"
							class="cursor-pointer"
							@click="navigate"
							@keypress.enter="() => navigate()"
						>
							<CoverContainer
								:cover="release.picture_medium"
								:link="release.link"
								is-rounded
								@click.stop="addToQueue"
							/>
							<p class="primary-text">{{ release.title }}</p>
						</div>
					</router-link>

					<p class="secondary-text">
						{{
							`${t("globals.by", { artist: release.creator.name })} - ${t(
								"globals.listTabs.trackN",
								release.nb_tracks
							)}`
						}}
					</p>
				</div>
			</div>
		</div>

		<div v-show="state.activeTab === 'album'">
			<div v-if="favoriteAlbums.length === 0">
				<h1>{{ t("favorites.noAlbums") }}</h1>
			</div>
			<div v-if="favoriteAlbums.length > 0" class="release-grid">
				<router-link
					v-for="release in favoriteAlbums"
					:key="release.id"
					v-slot="{ navigate }"
					:to="{ name: 'Album', params: { id: release.id } }"
					custom
				>
					<div
						role="link"
						class="release cursor-pointer"
						@click="navigate"
						@keypress.enter="() => navigate()"
					>
						<CoverContainer
							:cover="release.cover_medium"
							:link="release.link"
							is-rounded
							@click.stop="addToQueue"
						/>
						<p class="primary-text">{{ release.title }}</p>
						<p class="secondary-text">
							{{ `${t("globals.by", { artist: release.artist.name })}` }}
						</p>
					</div>
				</router-link>
			</div>
		</div>

		<div v-show="state.activeTab === 'artist'">
			<div v-if="favoriteArtists.length == 0">
				<h1>{{ t("favorites.noArtists") }}</h1>
			</div>
			<div v-if="favoriteArtists.length > 0" class="release-grid">
				<router-link
					v-for="release in favoriteArtists"
					:key="release.id"
					v-slot="{ navigate }"
					:to="{ name: 'Artist', params: { id: release.id } }"
					custom
				>
					<div
						role="link"
						class="release cursor-pointer"
						@click="navigate"
						@keypress.enter="() => navigate()"
					>
						<CoverContainer
							:cover="release.picture_medium"
							:link="release.link"
							is-circle
							@click.stop="addToQueue"
						/>
						<p class="primary-text text-center">{{ release.name }}</p>
					</div>
				</router-link>
			</div>
		</div>

		<div v-show="state.activeTab === 'track'">
			<div v-if="favoriteTracks.length == 0">
				<h1>{{ t("favorites.noTracks") }}</h1>
			</div>
			<table v-if="favoriteTracks.length > 0" class="table">
				<tr v-for="track in favoriteTracks" :key="track.id" class="track_row">
					<td
						:class="{ first: track.position === 1 }"
						class="cursor-default p-3 text-center"
					>
						{{ track.position }}
					</td>
					<td>
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
							@keypress.enter="() => navigate()"
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
							@keypress.enter="() => navigate()"
						>
							{{ track.album.title }}
						</td>
					</router-link>
					<td class="table__cell--small">
						{{ convertDuration(track.duration) }}
					</td>
					<td
						:data-link="track.link"
						aria-label="download"
						class="group cursor-pointer"
						role="button"
						@click.stop="addToQueue"
					>
						<div
							class="table__cell-content table__cell-content--vertical-center"
						>
							<i
								:title="t('globals.download_hint')"
								class="material-icons group-hover:text-primary transition-colors duration-150 ease-in-out"
							>
								get_app
							</i>
						</div>
					</td>
				</tr>
			</table>
		</div>
	</div>
</template>
