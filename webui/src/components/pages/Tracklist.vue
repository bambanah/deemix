<template>
	<div ref="root" class="fixed-footer bg-background-main image-header relative">
		<header
			:style="{
				'background-image':
					'linear-gradient(to bottom, transparent 0%, var(--main-background) 100%), url(\'' +
					image +
					'\')',
			}"
		>
			<h1 class="m-0 flex items-center text-5xl">
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
					<th>{{ $tc("globals.listTabs.title", 1) }}</th>
					<th>{{ $tc("globals.listTabs.artist", 1) }}</th>
					<th v-if="type === 'playlist'">
						{{ $tc("globals.listTabs.album", 1) }}
					</th>
					<th>
						<i class="material-icons">timer</i>
					</th>
					<th class="table__icon table__cell--center clickable">
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
										:title="$t('globals.play_hint')"
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
							</td>
							<router-link
								v-slot="{ navigate }"
								:to="{ name: 'Artist', params: { id: track.artist.id } }"
								class="table__cell--medium table__cell--center clickable"
								custom
							>
								<td role="link" @click="navigate" @keypress.enter="navigate">
									{{ track.artist.name }}
								</td>
							</router-link>
							<router-link
								v-if="type === 'playlist'"
								v-slot="{ navigate }"
								:to="{ name: 'Album', params: { id: track.album.id } }"
								class="table__cell--medium table__cell--center clickable"
								custom
							>
								<td role="link" @click="navigate" @keypress.enter="navigate">
									{{ track.album.title }}
								</td>
							</router-link>
							<td
								:class="{
									'table__cell--small': type === 'album',
									'table__cell--x-small': type === 'playlist',
								}"
								class="table__cell--center"
							>
								{{ convertDuration(track.duration) }}
							</td>
							<td class="table__icon table__cell--center">
								<input
									v-model="track.selected"
									class="clickable"
									type="checkbox"
								/>
							</td>
						</tr>
						<tr
							v-else-if="track.type == 'disc_separator'"
							:key="track.id"
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
							<td colspan="4"></td>
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
								:title="$t('globals.play_hint')"
								class="material-icons"
								@click="playPausePreview"
							>
								play_arrow
							</i>
							<i v-else class="material-icons disabled">play_arrow</i>
						</td>
						<td>{{ i + 1 }}</td>
						<td class="flex items-center">
							<i v-if="track.explicit" class="material-icons title-icon"
								>explicit</i
							>
							{{ track.name }}
						</td>
						<td>{{ track.artists[0].name }}</td>
						<td>{{ track.album.name }}</td>
						<td>{{ convertDuration(Math.floor(track.duration_ms / 1000)) }}</td>
						<td>
							<input
								v-model="track.selected"
								class="clickable"
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
			<button
				:data-link="link"
				class="btn btn-primary mr-2"
				@click.stop="addToQueue"
			>
				{{
					`${$t("globals.download", {
						thing: $tc(`globals.listTabs.${type}`, 1),
					})}`
				}}
			</button>
			<button
				:data-link="selectedLinks()"
				class="btn btn-primary flex items-center"
				@click.stop="addToQueue"
			>
				{{ $t("tracklist.downloadSelection")
				}}<i class="material-icons ml-2">file_download</i>
			</button>
		</footer>
	</div>
</template>

<script>
import { isEmpty } from "lodash-es";
import { sendAddToQueue } from "@/utils/downloads";
import Utils from "@/utils/utils";
import EventBus from "@/utils/EventBus";

export default {
	data() {
		return {
			title: "",
			metadata: "",
			release_date: "",
			label: "",
			explicit: false,
			image: "",
			type: "empty",
			link: "",
			body: [],
		};
	},
	mounted() {
		EventBus.$on("showAlbum", this.showAlbum);
		EventBus.$on("showPlaylist", this.showPlaylist);
		EventBus.$on("showSpotifyPlaylist", this.showSpotifyPlaylist);
	},
	methods: {
		playPausePreview: (e) => {
			EventBus.$emit("trackPreview:playPausePreview", e);
		},
		reset() {
			this.title = "Loading...";
			this.image = "";
			this.metadata = "";
			this.label = "";
			this.release_date = "";
			this.explicit = false;
			this.type = "empty";
			this.body = [];
		},
		addToQueue(e) {
			sendAddToQueue(e.currentTarget.dataset.link);
		},
		toggleAll(e) {
			this.body.forEach((item) => {
				if (item.type === "track") {
					item.selected = e.currentTarget.checked;
				}
			});
		},
		selectedLinks() {
			const selected = [];
			if (this.body) {
				this.body.forEach((item) => {
					if (item.type === "track" && item.selected)
						selected.push(
							this.type === "spotifyPlaylist" ? item.uri : item.link
						);
				});
			}
			return selected.join(";");
		},
		convertDuration: Utils.convertDuration,
		showAlbum(data) {
			this.reset();

			const {
				id: albumID,
				title: albumTitle,
				explicit_lyrics,
				label: albumLabel,
				artist: { name: artistName },
				tracks: albumTracks,
				nb_tracks: numberOfTracks,
				release_date,
				cover_xl,
			} = data;

			this.type = "album";
			this.link = `https://www.deezer.com/album/${albumID}`;
			this.title = albumTitle;
			this.explicit = explicit_lyrics;
			this.label = albumLabel;
			this.metadata = `${artistName} • ${this.$tc(
				"globals.listTabs.trackN",
				numberOfTracks
			)}`;
			this.release_date = release_date.substring(0, 10);
			this.image = cover_xl;

			if (isEmpty(albumTracks)) {
				this.body = null;
			} else {
				this.body = albumTracks;
			}
		},
		showPlaylist(data) {
			this.reset();

			const {
				id: playlistID,
				title: playlistTitle,
				picture_xl: playlistCover,
				creation_date,
				creator: { name: creatorName },
				tracks: playlistTracks,
				tracks: { length: numberOfTracks },
			} = data;

			this.type = "playlist";
			this.link = `https://www.deezer.com/playlist/${playlistID}`;
			this.title = playlistTitle;
			this.image = playlistCover;
			this.release_date = creation_date.substring(0, 10);
			this.metadata = `${this.$t("globals.by", {
				artist: creatorName,
			})} • ${this.$tc("globals.listTabs.trackN", numberOfTracks)}`;

			if (isEmpty(playlistTracks)) {
				this.body = null;
			} else {
				this.body = playlistTracks;
			}
		},
		showSpotifyPlaylist(data) {
			this.reset();

			const {
				uri: playlistURI,
				name: playlistName,
				images,
				images: { length: numberOfImages },
				owner: { display_name: ownerName },
				tracks: playlistTracks,
				tracks: { length: numberOfTracks },
			} = data;

			this.type = "spotifyPlaylist";
			this.link = playlistURI;
			this.title = playlistName;
			this.image = numberOfImages
				? images[0].url
				: "https://e-cdns-images.dzcdn.net/images/cover/d41d8cd98f00b204e9800998ecf8427e/1000x1000-000000-80-0-0.jpg";
			this.release_date = "";
			this.metadata = `${this.$t("globals.by", {
				artist: ownerName,
			})} • ${this.$tc("globals.listTabs.trackN", numberOfTracks)}`;

			if (isEmpty(playlistTracks)) {
				this.body = null;
			} else {
				this.body = playlistTracks;
			}
		},
		selectRow(_, track) {
			track.selected = !track.selected;
		},
	},
};
</script>
