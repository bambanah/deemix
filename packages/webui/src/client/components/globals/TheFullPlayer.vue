<script setup lang="ts">
import { pinia } from "@/stores";
import { usePlayerStore } from "@/stores/player";
import { postToServer, fetchData } from "@/utils/api-utils";
import { convertDuration } from "@/utils/utils";
import { emitter } from "@/utils/emitter";
import { storeToRefs } from "pinia";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const PLAYER_HEIGHT = "4.5rem";

const { t } = useI18n();
const playerStore = usePlayerStore(pinia);
const { currentTrack, isPlaying, hasNext, hasPrevious, volume } =
	storeToRefs(playerStore);

const audio = ref<HTMLAudioElement | null>(null);
const currentTime = ref(0);
const duration = ref(0);
const isBuffering = ref(false);
const errorMessage = ref("");
const codec = ref("");

const lastFmConnected = ref(false);
let hasScrobbled = false;
let hasSentNowPlaying = false;
let startedAt = 0;

const progress = computed(() =>
	duration.value ? (currentTime.value / duration.value) * 100 : 0
);

function streamUrl(trackId: string, quality: string) {
	const url = new URL(
		`${location.base}api/streamTrack`,
		window.location.origin
	);
	url.searchParams.set("id", trackId);
	url.searchParams.set("quality", quality);
	return url.href;
}

async function startPlayback() {
	if (!audio.value) return;
	// Never play on top of a 30 seconds preview
	(
		document.getElementById("preview-track") as HTMLAudioElement | null
	)?.pause();
	try {
		await audio.value.play();
	} catch (error) {
		if ((error as DOMException).name === "AbortError") return;
		console.error(error);
		playerStore.setPlaying(false);
	}
}

function loadTrack() {
	const track = currentTrack.value;
	if (!audio.value || !track) return;

	errorMessage.value = "";
	currentTime.value = 0;
	duration.value = track.duration;
	hasScrobbled = false;
	hasSentNowPlaying = false;
	// A quality change applies from the next track, seeking must keep the same file
	const quality = playerStore.streamQuality;
	codec.value = "";
	void loadCodec(track.id, quality);
	audio.value.src = streamUrl(track.id, quality);
	audio.value.volume = volume.value / 100;
	updateMediaSession();
	if (isPlaying.value) void startPlayback();
}

const CODEC_LABELS: Record<string, string> = {
	FLAC: "FLAC",
	MP3_320: "MP3 320",
	MP3_128: "MP3 128",
};

async function loadCodec(trackId: string, quality: string) {
	try {
		const info = await fetchData("streamTrackInfo", { id: trackId, quality });
		// Ignore late answers for a track that is no longer playing
		if (currentTrack.value?.id !== trackId || !info?.format) return;
		codec.value = CODEC_LABELS[info.format] ?? info.format;
	} catch {
		codec.value = "";
	}
}

function seek(event: Event) {
	if (!audio.value || !duration.value) return;
	const percentage = Number((event.target as HTMLInputElement).value);
	audio.value.currentTime = (percentage / 100) * duration.value;
}

function changeVolume(event: Event) {
	const value = Number((event.target as HTMLInputElement).value);
	playerStore.setVolume(value);
	if (audio.value) audio.value.volume = value / 100;
}

function onPlay() {
	playerStore.setPlaying(true);
	if (!hasSentNowPlaying) {
		hasSentNowPlaying = true;
		startedAt = Math.floor(Date.now() / 1000);
		void sendLastFm("lastfmNowPlaying");
	}
}

function onPause() {
	// "pause" also fires right before "ended", the queue decides what happens next
	if (audio.value?.ended) return;
	playerStore.setPlaying(false);
}

function onTimeUpdate() {
	if (!audio.value) return;
	currentTime.value = audio.value.currentTime;
	if (Number.isFinite(audio.value.duration))
		duration.value = audio.value.duration;

	const threshold =
		duration.value > 30 ? Math.min(duration.value / 2, 240) : duration.value;
	if (duration.value && currentTime.value >= threshold) void scrobble();
}

function onEnded() {
	void scrobble();
	playerStore.next();
}

function onError() {
	if (!currentTrack.value) return;
	errorMessage.value = t("fullPlayer.playError");
	// Skip tracks that can't be streamed instead of stopping the whole album
	if (hasNext.value) setTimeout(() => playerStore.next(), 1500);
	else playerStore.setPlaying(false);
}

async function sendLastFm(endpoint: "lastfmNowPlaying" | "lastfmScrobble") {
	const track = currentTrack.value;
	if (!lastFmConnected.value || !track) return;
	try {
		const artist =
			playerStore.scrobbleArtistTag === "albumArtist"
				? track.albumArtist || track.artist
				: track.artist;
		await postToServer(endpoint, {
			artist,
			title: track.title,
			album: track.album,
			albumArtist: track.albumArtist,
			duration: Math.round(duration.value),
			timestamp: startedAt,
		});
	} catch (error) {
		console.error(error);
	}
}

async function scrobble() {
	if (hasScrobbled) return;
	hasScrobbled = true;
	await sendLastFm("lastfmScrobble");
}

function updateMediaSession() {
	const track = currentTrack.value;
	if (!("mediaSession" in navigator) || !track) return;
	navigator.mediaSession.metadata = new MediaMetadata({
		title: track.title,
		artist: track.artist,
		album: track.album,
		artwork: track.cover ? [{ src: track.cover, sizes: "500x500" }] : [],
	});
}

function pauseFromPreview() {
	if (isPlaying.value) playerStore.setPlaying(false);
}

watch(
	() => currentTrack.value?.id,
	() => loadTrack()
);

watch(isPlaying, (shouldPlay) => {
	if (!audio.value?.src) return;
	if (shouldPlay && audio.value.paused) void startPlayback();
	if (!shouldPlay && !audio.value.paused) audio.value.pause();
});

watch(
	currentTrack,
	(track) => {
		document.documentElement.style.setProperty(
			"--full-player-height",
			track ? PLAYER_HEIGHT : "0px"
		);
		if (!track && audio.value) {
			audio.value.pause();
			audio.value.removeAttribute("src");
		}
	},
	{ immediate: true }
);

onMounted(async () => {
	emitter.on("fullPlayer:pause", pauseFromPreview);

	if ("mediaSession" in navigator) {
		navigator.mediaSession.setActionHandler("play", () =>
			playerStore.setPlaying(true)
		);
		navigator.mediaSession.setActionHandler("pause", () =>
			playerStore.setPlaying(false)
		);
		navigator.mediaSession.setActionHandler("nexttrack", () =>
			playerStore.next()
		);
		navigator.mediaSession.setActionHandler("previoustrack", () =>
			playerStore.previous()
		);
	}

	try {
		const status = await fetchData("getLastfmStatus");
		// Still try without server credentials, so the server log explains the failure
		lastFmConnected.value = !!status?.username;
	} catch {
		lastFmConnected.value = false;
	}
});

onBeforeUnmount(() => {
	emitter.off("fullPlayer:pause", pauseFromPreview);
});
</script>

<template>
	<audio
		ref="audio"
		preload="auto"
		@play="onPlay"
		@pause="onPause"
		@timeupdate="onTimeUpdate"
		@ended="onEnded"
		@error="onError"
		@waiting="isBuffering = true"
		@playing="isBuffering = false"
	/>

	<div
		v-if="currentTrack"
		class="full-player bg-panels-bg flex items-center gap-4 px-4"
		role="region"
		:aria-label="t('fullPlayer.title')"
	>
		<div class="flex min-w-0 flex-1 items-center gap-3">
			<router-link
				v-if="currentTrack.cover && currentTrack.albumId"
				:to="{ name: 'Album', params: { id: currentTrack.albumId } }"
				:title="t('fullPlayer.goToAlbum')"
				class="flex-shrink-0"
			>
				<img
					:src="currentTrack.cover"
					:alt="t('fullPlayer.goToAlbum')"
					class="h-12 w-12 rounded transition-opacity hover:opacity-75"
				/>
			</router-link>
			<img
				v-else-if="currentTrack.cover"
				:src="currentTrack.cover"
				alt=""
				class="h-12 w-12 flex-shrink-0 rounded"
			/>
			<div class="min-w-0">
				<p class="m-0 truncate font-semibold">{{ currentTrack.title }}</p>
				<p v-if="errorMessage" class="m-0 truncate text-sm text-red-500">
					{{ errorMessage }}
				</p>
				<p v-else class="m-0 truncate text-sm opacity-70">
					<router-link
						v-if="currentTrack.artistId"
						:to="{ name: 'Artist', params: { id: currentTrack.artistId } }"
						class="player-link"
						>{{ currentTrack.artist }}</router-link
					>
					<span v-else>{{ currentTrack.artist }}</span>
					<template v-if="currentTrack.album">
						<span aria-hidden="true"> • </span>
						<router-link
							v-if="currentTrack.albumId"
							:to="{ name: 'Album', params: { id: currentTrack.albumId } }"
							class="player-link"
							>{{ currentTrack.album }}</router-link
						>
						<span v-else>{{ currentTrack.album }}</span>
					</template>
				</p>
			</div>
		</div>

		<div class="flex flex-[2] flex-col items-center gap-1">
			<div class="flex items-center gap-2">
				<button
					type="button"
					class="player-button"
					:disabled="!hasPrevious"
					:aria-label="t('fullPlayer.previous')"
					@click="playerStore.previous()"
				>
					<i class="material-icons" aria-hidden="true">skip_previous</i>
				</button>
				<button
					type="button"
					class="player-button player-button--main bg-primary"
					:aria-label="isPlaying ? t('fullPlayer.pause') : t('fullPlayer.play')"
					@click="playerStore.togglePlay()"
				>
					<i class="material-icons text-white" aria-hidden="true">
						{{
							isBuffering && isPlaying
								? "hourglass_empty"
								: isPlaying
									? "pause"
									: "play_arrow"
						}}
					</i>
				</button>
				<button
					type="button"
					class="player-button"
					:disabled="!hasNext"
					:aria-label="t('fullPlayer.next')"
					@click="playerStore.next()"
				>
					<i class="material-icons" aria-hidden="true">skip_next</i>
				</button>
			</div>
			<div class="flex w-full items-center gap-2 text-xs">
				<span class="w-10 text-right">{{
					convertDuration(Math.floor(currentTime))
				}}</span>
				<input
					class="flex-1"
					type="range"
					min="0"
					max="100"
					step="0.1"
					:value="progress"
					:aria-label="t('fullPlayer.seek')"
					@input="seek"
				/>
				<span class="w-10">{{ convertDuration(Math.floor(duration)) }}</span>
				<span
					v-if="codec"
					class="codec-badge"
					:class="{ 'codec-badge--lossless text-primary': codec === 'FLAC' }"
					:title="t('fullPlayer.codec')"
					>{{ codec }}</span
				>
			</div>
		</div>

		<div class="hidden flex-1 items-center justify-end gap-2 md:flex">
			<i class="material-icons" aria-hidden="true">volume_up</i>
			<input
				class="w-24"
				type="range"
				min="0"
				max="100"
				:value="volume"
				:aria-label="t('fullPlayer.volume')"
				@input="changeVolume"
			/>
			<button
				type="button"
				class="player-button"
				:aria-label="t('fullPlayer.close')"
				@click="playerStore.stop()"
			>
				<i class="material-icons" aria-hidden="true">close</i>
			</button>
		</div>
	</div>
</template>

<style scoped>
.full-player {
	height: var(--full-player-height);
	flex-shrink: 0;
	border-top: 1px solid rgba(128, 128, 128, 0.2);
}

.player-button {
	display: flex;
	align-items: center;
	justify-content: center;
	border: 0;
	background: transparent;
	color: inherit;
	border-radius: 9999px;
	width: 2.25rem;
	height: 2.25rem;
	cursor: pointer;
}

.codec-badge {
	flex-shrink: 0;
	padding: 0 0.375rem;
	border: 1px solid currentColor;
	border-radius: 0.25rem;
	font-size: 0.625rem;
	font-weight: 700;
	line-height: 1rem;
	letter-spacing: 0.03em;
	opacity: 0.7;
	white-space: nowrap;
}

.codec-badge--lossless {
	opacity: 1;
}

.player-link {
	color: inherit;
	text-decoration: none;
}

.player-link:hover {
	text-decoration: underline;
}

.player-button:disabled {
	opacity: 0.4;
	cursor: default;
}

.player-button--main {
	width: 2.5rem;
	height: 2.5rem;
}
</style>
