<script setup lang="ts">
import BaseLoadingPlaceholder from "@/components/globals/BaseLoadingPlaceholder.vue";
import BaseSpinner from "@/components/globals/BaseSpinner.vue";
import DownloadButton from "@/components/globals/DownloadButton.vue";
import { isEmpty } from "lodash-es";
import { convertDuration } from "@/utils/utils";
import { emitter } from "@/utils/emitter";
import { pinia } from "@/stores";
import { useDownloadsStore } from "@/stores/downloads";
import { useI18n } from "vue-i18n";
import { onMounted, ref, watch } from "vue";

const { t } = useI18n();
const downloadsStore = useDownloadsStore(pinia);

const title = ref("");
const metadata = ref("");
const release_date = ref("");
const label = ref("");
const explicit = ref(false);
const image = ref("");
const type = ref("empty");
const link = ref("");
const body = ref([]);

function playPausePreview(e) {
	emitter.emit("trackPreview:playPausePreview", e);
}
function reset() {
	title.value = "Loading...";
	image.value = "";
	metadata.value = "";
	label.value = "";
	release_date.value = "";
	explicit.value = false;
	type.value = "empty";
	body.value = [];
}
function getTrackLink(track) {
	return type.value === "spotifyPlaylist" ? track.uri : track.link;
}
/** Tracks already in the download queue (pending, downloading or finished) */
function isTrackInQueue(track) {
	const trackLink = getTrackLink(track);
	return (
		Boolean(trackLink) && downloadsStore.getDownloadState(trackLink) !== "idle"
	);
}
function isSelectable(track) {
	return (
		(track.type === "track" || type.value === "spotifyPlaylist") &&
		!isTrackInQueue(track)
	);
}
function toggleAll(e) {
	const checked = e.currentTarget.checked;

	(body.value || []).forEach((item) => {
		if (isSelectable(item)) item.selected = checked;
	});
}
function selectedLinks() {
	const selected = [];
	if (body.value) {
		body.value.forEach((item) => {
			if (item.selected && isSelectable(item))
				selected.push(getTrackLink(item));
		});
	}
	return selected.join(";");
}
function showAlbum(data) {
	reset();

	const {
		id: albumID,
		title: albumTitle,
		explicit_lyrics,
		label: albumLabel,
		artist: { name: artistName },
		tracks: albumTracks,
		nb_tracks: numberOfTracks,
		release_date: albumReleaseDate,
		cover_xl,
	} = data;

	type.value = "album";
	link.value = `https://www.deezer.com/album/${albumID}`;
	title.value = albumTitle;
	explicit.value = explicit_lyrics;
	label.value = albumLabel;
	metadata.value = `${artistName} • ${t(
		"globals.listTabs.trackN",
		numberOfTracks
	)}`;
	release_date.value = albumReleaseDate.substring(0, 10);
	image.value = cover_xl;

	if (isEmpty(albumTracks)) {
		body.value = null;
	} else {
		body.value = albumTracks;
	}
}
function showPlaylist(data) {
	reset();

	const {
		id: playlistID,
		title: playlistTitle,
		picture_xl: playlistCover,
		creation_date,
		creator: { name: creatorName },
		tracks: playlistTracks,
		tracks: { length: numberOfTracks },
	} = data;

	type.value = "playlist";
	link.value = `https://www.deezer.com/playlist/${playlistID}`;
	title.value = playlistTitle;
	image.value = playlistCover;
	release_date.value = creation_date.substring(0, 10);
	metadata.value = `${t("globals.by", {
		artist: creatorName,
	})} • ${t("globals.listTabs.trackN", numberOfTracks)}`;

	if (isEmpty(playlistTracks)) {
		body.value = null;
	} else {
		body.value = playlistTracks;
	}
}
function showSpotifyPlaylist(data) {
	reset();

	const {
		uri: playlistURI,
		name: playlistName,
		images,
		images: { length: numberOfImages },
		owner: { display_name: ownerName },
		tracks: playlistTracks,
		tracks: { length: numberOfTracks },
	} = data;

	type.value = "spotifyPlaylist";
	link.value = playlistURI;
	title.value = playlistName;
	image.value = numberOfImages
		? images[0].url
		: "https://e-cdns-images.dzcdn.net/images/cover/d41d8cd98f00b204e9800998ecf8427e/1000x1000-000000-80-0-0.jpg";
	release_date.value = "";
	metadata.value = `${t("globals.by", {
		artist: ownerName,
	})} • ${t("globals.listTabs.trackN", numberOfTracks)}`;

	if (isEmpty(playlistTracks)) {
		body.value = null;
	} else {
		body.value = playlistTracks;
	}
}
function selectRow(_, track) {
	if (!isSelectable(track)) return;
	track.selected = !track.selected;
}

// Deselect the tracks that get added to the queue (also from other views/tabs)
watch(
	() => [downloadsStore.queueList, downloadsStore.pending],
	() => {
		(body.value || []).forEach((item) => {
			if (item.selected && isTrackInQueue(item)) item.selected = false;
		});
	},
	{ deep: true }
);

onMounted(() => {
	emitter.on("showAlbum", showAlbum);
	emitter.on("showPlaylist", showPlaylist);
	emitter.on("showSpotifyPlaylist", showSpotifyPlaylist);
});
</script>

<template>
	<BaseLoadingPlaceholder v-if="type === 'empty'" class="min-h-[50vh]" />
	<div
		v-else
		ref="root"
		class="fixed-footer bg-background-main image-header relative"
	>
		<header
			:style="{
				'background-image':
					'linear-gradient(to bottom, transparent 0%, var(--main-background) 100%), url(\'' +
					image +
					'\')',
			}"
		>
			<h1 class="m-0 flex items-center text-3xl md:text-5xl">
				{{ title }}
				<i v-if="explicit" class="material-icons title-icon title-icon--right"
					>explicit</i
				>
			</h1>

			<h2 class="m-0 mb-3 text-lg">
				<p v-if="metadata">{{ metadata }}</p>
				<p v-if="release_date">{{ release_date }}</p>
			</h2>
		</header>

		<table class="table--tracklist table">
			<thead>
				<tr>
					<th>
						<i class="material-icons">music_note</i>
					</th>
					<th>#</th>
					<th>{{ t("globals.listTabs.title", 1) }}</th>
					<th class="cell-desktop">{{ t("globals.listTabs.artist", 1) }}</th>
					<th v-if="type !== 'album'" class="cell-desktop">
						{{ t("globals.listTabs.album", 1) }}
					</th>
					<th class="cell-desktop">
						<i class="material-icons">timer</i>
					</th>
					<th class="table__icon table__cell--center cursor-pointer">
						<input class="selectAll" type="checkbox" @click="toggleAll" />
					</th>
				</tr>
			</thead>
			<tbody>
				<template v-if="type !== 'spotifyPlaylist'">
					<template v-for="(track, index) in body">
						<tr
							v-if="track.type === 'track'"
							:key="track.id"
							:class="{ 'track-in-queue': isTrackInQueue(track) }"
							@click="selectRow(index, track)"
						>
							<td class="table__cell--x-small table__cell--center">
								<div
									class="table__cell-content table__cell-content--vertical-center"
								>
									<i
										:class="{
											preview_playlist_controls: track.preview,
											'cursor-pointer': track.preview,
											disabled: !track.preview,
										}"
										:data-preview="track.preview"
										:data-link-only="track.link"
										:title="t('globals.play_hint')"
										class="material-icons"
										v-on="{ click: track.preview ? playPausePreview : false }"
									>
										play_arrow
									</i>
								</div>
							</td>
							<td class="table__cell--small table__cell--center track_position">
								{{
									type === "album"
										? track.track_position
										: body.indexOf(track) + 1
								}}
							</td>
							<td class="table__cell--large table__cell--with-icon">
								<div
									class="table__cell-content table__cell-content--vertical-center"
								>
									<i
										v-if="track.explicit_lyrics"
										class="material-icons title-icon"
									>
										explicit
									</i>
									{{
										track.title +
										(track.title_version &&
										track.title.indexOf(track.title_version) == -1
											? " " + track.title_version
											: "")
									}}
								</div>
								<span class="cell-subtitle">
									{{ track.artist.name
									}}<template v-if="type === 'playlist'">
										· {{ track.album.title }}</template
									>
									· {{ convertDuration(track.duration) }}
								</span>
							</td>
							<router-link
								v-slot="{ navigate }"
								:to="{ name: 'Artist', params: { id: track.artist.id } }"
								custom
							>
								<td
									role="link"
									class="table__cell--medium table__cell--center cell-desktop cursor-pointer"
									@click="navigate"
								>
									{{ track.artist.name }}
								</td>
							</router-link>
							<router-link
								v-if="type === 'playlist'"
								v-slot="{ navigate }"
								:to="{ name: 'Album', params: { id: track.album.id } }"
								custom
							>
								<td
									role="link"
									class="table__cell--medium table__cell--center cell-desktop cursor-pointer"
									@click="navigate"
								>
									{{ track.album.title }}
								</td>
							</router-link>
							<td
								:class="{
									'table__cell--small': type === 'album',
									'table__cell--x-small': type === 'playlist',
								}"
								class="table__cell--center cell-desktop"
							>
								{{ convertDuration(track.duration) }}
							</td>
							<td class="table__icon table__cell--center">
								<input
									v-model="track.selected"
									:class="
										isTrackInQueue(track)
											? 'cursor-not-allowed'
											: 'cursor-pointer'
									"
									:disabled="isTrackInQueue(track)"
									:title="
										isTrackInQueue(track)
											? t('globals.already_in_queue_hint')
											: undefined
									"
									type="checkbox"
									@click.stop
								/>
							</td>
						</tr>
						<tr
							v-else-if="track.type == 'disc_separator'"
							:key="track.id + '_disc_separator'"
							class="table__row-no-highlight"
							style="opacity: 0.54"
						>
							<td>
								<div
									class="table__cell-content table__cell-content--vertical-center"
									style="opacity: 0.54"
								>
									<i class="material-icons">album</i>
								</div>
							</td>
							<td class="table__cell--center">
								{{ track.number }}
							</td>
							<td class="cell-mobile" colspan="2"></td>
							<td class="cell-desktop" :colspan="type === 'album' ? 4 : 5"></td>
						</tr>
					</template>
				</template>
				<template v-else>
					<tr v-for="(track, i) in body" :key="track.id">
						<td>
							<i
								v-if="track.preview_url"
								:class="{
									preview_playlist_controls: track.preview_url,
									'cursor-pointer': track.preview_url,
								}"
								:data-preview="track.preview_url"
								:title="t('globals.play_hint')"
								class="material-icons"
								@click="playPausePreview"
							>
								play_arrow
							</i>
							<i v-else class="material-icons disabled">play_arrow</i>
						</td>
						<td>{{ i + 1 }}</td>
						<td>
							<div class="flex items-center">
								<i v-if="track.explicit" class="material-icons title-icon"
									>explicit</i
								>
								{{ track.name }}
							</div>
							<span class="cell-subtitle">
								{{ track.artists[0].name }} · {{ track.album.name }} ·
								{{ convertDuration(Math.floor(track.duration_ms / 1000)) }}
							</span>
						</td>
						<td class="cell-desktop">{{ track.artists[0].name }}</td>
						<td class="cell-desktop">{{ track.album.name }}</td>
						<td class="cell-desktop">
							{{ convertDuration(Math.floor(track.duration_ms / 1000)) }}
						</td>
						<td>
							<input
								v-model="track.selected"
								:class="
									isTrackInQueue(track)
										? 'cursor-not-allowed'
										: 'cursor-pointer'
								"
								:disabled="isTrackInQueue(track)"
								:title="
									isTrackInQueue(track)
										? t('globals.already_in_queue_hint')
										: undefined
								"
								type="checkbox"
							/>
						</td>
					</tr>
				</template>
			</tbody>
		</table>
		<span
			v-if="label"
			style="
				opacity: 0.4;
				margin-top: 8px;
				display: inline-block;
				font-size: 13px;
			"
			>{{ label }}</span
		>
		<footer class="bg-background-main">
			<DownloadButton
				v-slot="{ state, icon }"
				:link="link"
				:item-title="title"
				class="btn btn-primary flex items-center gap-2 md:mr-2"
			>
				<BaseSpinner v-if="state === 'pending'" :size="16" />
				<i v-else-if="state !== 'idle'" class="material-icons">{{ icon }}</i>
				{{
					`${t("globals.download", {
						thing: t(`globals.listTabs.${type}`, 1),
					})}`
				}}
			</DownloadButton>
			<DownloadButton
				v-slot="{ state }"
				:link="selectedLinks()"
				:item-title="t('tracklist.downloadSelection')"
				class="btn btn-primary flex items-center"
			>
				{{ t("tracklist.downloadSelection")
				}}<BaseSpinner v-if="state === 'pending'" :size="18" class="ml-2" /><i
					v-else
					class="material-icons ml-2"
					>file_download</i
				>
			</DownloadButton>
		</footer>
	</div>
</template>

<style scoped>
.track-in-queue td {
	opacity: 0.6;
}
</style>
