<template>
	<div>
		<h1 class="mb-8 text-5xl">
			{{ $t("favorites.title") }}
			<div
				ref="reloadButton"
				aria-label="reload"
				class="clickable inline-block"
				role="button"
				@click="refreshFavorites"
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
				:class="{ active: activeTab === tab }"
				@click="activeTab = tab"
			>
				{{ $tc(`globals.listTabs.${tab}`, 2) }}
			</BaseTab>
		</BaseTabs>

		<button
			v-if="!activeTabEmpty"
			class="btn btn-primary"
			style="margin-bottom: 2rem"
			@click="downloadAllOfType"
		>
			{{
				$t("globals.download", {
					thing: $tc(`globals.listTabs.${activeTab}N`, getTabLength()),
				})
			}}
		</button>

		<div v-show="activeTab === 'playlist'">
			<div v-if="playlists.length + spotifyPlaylists.length === 0">
				<h1>{{ $t("favorites.noPlaylists") }}</h1>
			</div>
			<div
				v-if="playlists.length + spotifyPlaylists.length > 0"
				class="release-grid"
			>
				<div v-for="release in playlists" :key="release.id" class="release">
					<router-link
						v-slot="{ navigate }"
						:to="{ name: 'Playlist', params: { id: release.id } }"
						class="cursor-pointer"
						custom
					>
						<div role="link" @click="navigate" @keypress.enter="navigate">
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
							`${$t("globals.by", { artist: release.creator.name })} - ${$tc(
								"globals.listTabs.trackN",
								release.nb_tracks
							)}`
						}}
					</p>
				</div>

				<div
					v-for="release in spotifyPlaylists"
					:key="release.id"
					class="release"
				>
					<router-link
						v-slot="{ navigate }"
						:to="{ name: 'Spotify Playlist', params: { id: release.id } }"
						class="cursor-pointer"
						custom
					>
						<div role="link" @click="navigate" @keypress.enter="navigate">
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
							`${$t("globals.by", { artist: release.creator.name })} - ${$tc(
								"globals.listTabs.trackN",
								release.nb_tracks
							)}`
						}}
					</p>
				</div>
			</div>
		</div>

		<div v-show="activeTab === 'album'">
			<div v-if="albums.length === 0">
				<h1>{{ $t("favorites.noAlbums") }}</h1>
			</div>
			<div v-if="albums.length > 0" class="release-grid">
				<router-link
					v-for="release in albums"
					:key="release.id"
					v-slot="{ navigate }"
					:to="{ name: 'Album', params: { id: release.id } }"
					class="release clickable"
					custom
				>
					<div role="link" @click="navigate" @keypress.enter="navigate">
						<CoverContainer
							:cover="release.cover_medium"
							:link="release.link"
							is-rounded
							@click.stop="addToQueue"
						/>
						<p class="primary-text">{{ release.title }}</p>
						<p class="secondary-text">
							{{ `${$t("globals.by", { artist: release.artist.name })}` }}
						</p>
					</div>
				</router-link>
			</div>
		</div>

		<div v-show="activeTab === 'artist'">
			<div v-if="artists.length == 0">
				<h1>{{ $t("favorites.noArtists") }}</h1>
			</div>
			<div v-if="artists.length > 0" class="release-grid">
				<router-link
					v-for="release in artists"
					:key="release.id"
					v-slot="{ navigate }"
					:to="{ name: 'Artist', params: { id: release.id } }"
					class="release clickable"
					custom
				>
					<div role="link" @click="navigate" @keypress.enter="navigate">
						<CoverContainer
							:cover="release.picture_medium"
							:link="release.link"
							is-circle
							@click.stop="addToQueue"
						/>
						<p class="primary-text">{{ release.name }}</p>
					</div>
				</router-link>
			</div>
		</div>

		<div v-show="activeTab === 'track'">
			<div v-if="tracks.length == 0">
				<h1>{{ $t("favorites.noTracks") }}</h1>
			</div>
			<table v-if="tracks.length > 0" class="table">
				<tr v-for="track in tracks" :key="track.id" class="track_row">
					<td
						:class="{ first: track.position === 1 }"
						class="cursor-default p-3 text-center"
					>
						{{ track.position }}
					</td>
					<td>
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
								:title="$t('globals.download_hint')"
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

<script>
import { defineComponent, reactive, toRefs, watch } from "vue";

import PreviewControls from "@components/globals/PreviewControls.vue";
import CoverContainer from "@components/globals/CoverContainer.vue";
import { playPausePreview } from "@components/globals/TheTrackPreview.vue";
import { BaseTab, BaseTabs } from "@components/globals/BaseTabs";

import { aggregateDownloadLinks, sendAddToQueue } from "@/utils/downloads";
import { convertDuration } from "@/utils/utils";
import { toast } from "@/utils/toasts";
import { useFavorites } from "@/use/favorites";

export default defineComponent({
	components: {
		PreviewControls,
		CoverContainer,
		BaseTabs,
		BaseTab,
	},
	setup(_, ctx) {
		const state = reactive({
			activeTab: "playlist",
			tabs: ["playlist", "album", "artist", "track"],
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

			toast(ctx.root.$t("toasts.refreshFavs"), "done", true);
		});

		return {
			...toRefs(state),
			tracks: favoriteTracks,
			albums: favoriteAlbums,
			artists: favoriteArtists,
			playlists: favoritePlaylists,
			spotifyPlaylists: favoriteSpotifyPlaylists,
			lovedTracks: lovedTracksPlaylist,
			refreshFavorites,
			isRefreshingFavorites,
		};
	},
	computed: {
		activeTabEmpty() {
			const toCheck = this.getActiveRelease();

			return toCheck?.length === 0;
		},
	},
	methods: {
		playPausePreview,
		convertDuration,
		downloadAllOfType() {
			try {
				const toDownload = this.getActiveRelease();

				if (this.activeTab === "track") {
					if (this.lovedTracks) {
						sendAddToQueue(this.lovedTracks);
					} else {
						const lovedTracks = this.getLovedTracksPlaylist();
						sendAddToQueue(lovedTracks.link);
					}
				} else {
					sendAddToQueue(aggregateDownloadLinks(toDownload));
				}
			} catch (error) {
				console.error(error.message);
			}
		},
		addToQueue(e) {
			sendAddToQueue(e.currentTarget.dataset.link);
		},
		getActiveRelease(tab = this.activeTab) {
			let toDownload;

			switch (tab) {
				case "playlist":
					toDownload = this.playlists;
					toDownload.concat(this.spotifyPlaylists);
					break;
				case "album":
					toDownload = this.albums;
					break;
				case "artist":
					toDownload = this.artists;
					break;
				case "track":
					toDownload = this.tracks;
					break;

				default:
					break;
			}

			return toDownload;
		},
		getTabLength(tab = this.activeTab) {
			let total = this[`${tab}s`]?.length;

			if (tab === "playlist") {
				total += this.spotifyPlaylists.length;
			}

			return total || 0;
		},
		getLovedTracksPlaylist() {
			const lovedTracks = this.playlists.filter((playlist) => {
				return playlist.is_loved_track;
			});

			if (lovedTracks.length !== 0) {
				return lovedTracks[0];
			} else {
				toast(this.$t("toasts.noLovedPlaylist"), "warning", true);
				throw new Error("No loved tracks playlist!");
			}
		},
	},
});
</script>
