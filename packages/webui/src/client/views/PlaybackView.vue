<script setup lang="ts">
import { pinia } from "@/stores";
import {
	usePlayerStore,
	type ScrobbleArtistTag,
	type StreamQuality,
} from "@/stores/player";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const playerStore = usePlayerStore(pinia);

const username = ref("");
const authorizationUrl = ref("");
const errorMessage = ref("");
const isWaitingForAuthorization = ref(false);
const isBusy = ref(false);
const isConnected = computed(() => username.value !== "");

const qualityOptions: { value: StreamQuality; label: string; hint: string }[] =
	[
		{
			value: "FLAC",
			label: "playback.qualityFlac",
			hint: "playback.qualityFlacHint",
		},
		{
			value: "MP3_320",
			label: "playback.quality320",
			hint: "playback.quality320Hint",
		},
		{
			value: "MP3_128",
			label: "playback.quality128",
			hint: "playback.quality128Hint",
		},
	];

const artistTagOptions: {
	value: ScrobbleArtistTag;
	label: string;
	hint: string;
}[] = [
	{
		value: "artist",
		label: "lastfm.artistTagArtists",
		hint: "lastfm.artistTagArtistsHint",
	},
	{
		value: "albumArtist",
		label: "lastfm.artistTagAlbumArtist",
		hint: "lastfm.artistTagAlbumArtistHint",
	},
];

async function post(endpoint: string) {
	const response = await fetch(`${location.base}api/${endpoint}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: "{}",
	});
	const result = await response.json();
	if (!response.ok) {
		throw new Error(
			result.error || `Last.fm request failed with status ${response.status}`
		);
	}
	return result;
}

async function loadStatus() {
	try {
		const response = await fetch(`${location.base}api/getLastfmStatus`);
		const result = await response.json();
		if (!response.ok) throw new Error(result.error);
		username.value = result.username ?? "";
		if (!result.configured) errorMessage.value = t("lastfm.notConfigured");
	} catch (error) {
		console.error(error);
		errorMessage.value = t("lastfm.statusError");
	}
}

async function connect() {
	isBusy.value = true;
	errorMessage.value = "";
	const authWindow = window.open("", "_blank");

	try {
		const result = await post("connectLastfm");
		authorizationUrl.value = result.url;
		isWaitingForAuthorization.value = true;
		if (authWindow) authWindow.location.href = result.url;
	} catch (error) {
		authWindow?.close();
		console.error(error);
		errorMessage.value = t("lastfm.connectError");
	} finally {
		isBusy.value = false;
	}
}

async function completeConnection() {
	isBusy.value = true;
	errorMessage.value = "";

	try {
		const result = await post("completeLastfm");
		username.value = result.username;
		authorizationUrl.value = "";
		isWaitingForAuthorization.value = false;
	} catch (error) {
		console.error(error);
		errorMessage.value = t("lastfm.completeError");
	} finally {
		isBusy.value = false;
	}
}

async function disconnect() {
	isBusy.value = true;
	errorMessage.value = "";

	try {
		await post("disconnectLastfm");
		username.value = "";
	} catch (error) {
		console.error(error);
		errorMessage.value = t("lastfm.disconnectError");
	} finally {
		isBusy.value = false;
	}
}

onMounted(() => {
	void loadStatus();
});
</script>

<template>
	<section class="py-8">
		<h1 class="mb-2 text-4xl font-bold">{{ t("playback.title") }}</h1>
		<p class="mb-8 opacity-70">{{ t("playback.description") }}</p>

		<section
			class="bg-panels-bg mb-6 rounded-lg p-5"
			aria-labelledby="stream-quality"
		>
			<h2 id="stream-quality" class="mb-1 text-xl font-semibold">
				{{ t("playback.qualityTitle") }}
			</h2>
			<p class="mb-4 opacity-70">{{ t("playback.qualityDescription") }}</p>
			<div class="flex flex-col gap-3" role="radiogroup">
				<label
					v-for="option in qualityOptions"
					:key="option.value"
					class="flex cursor-pointer items-start gap-3"
				>
					<input
						type="radio"
						name="stream-quality"
						class="mt-1"
						:value="option.value"
						:checked="playerStore.streamQuality === option.value"
						@change="playerStore.setStreamQuality(option.value)"
					/>
					<span>
						<span class="block font-semibold">{{ t(option.label) }}</span>
						<span class="block text-sm opacity-70">{{ t(option.hint) }}</span>
					</span>
				</label>
			</div>
		</section>

		<h2 class="mb-4 mt-10 text-2xl font-bold">{{ t("lastfm.title") }}</h2>

		<section
			class="bg-panels-bg mb-6 rounded-lg p-5"
			aria-labelledby="lastfm-account"
		>
			<h2 id="lastfm-account" class="mb-3 text-xl font-semibold">
				{{ t("lastfm.account") }}
			</h2>
			<p v-if="isConnected" class="mb-4">
				{{ t("lastfm.connected", { username }) }}
			</p>
			<p v-else class="mb-4 opacity-70">{{ t("lastfm.notConnected") }}</p>
			<p v-if="errorMessage" class="mb-4 text-red-500" role="alert">
				{{ errorMessage }}
			</p>
			<div class="flex flex-wrap gap-3">
				<button
					v-if="!isConnected && !isWaitingForAuthorization"
					class="btn btn-primary"
					type="button"
					:disabled="isBusy"
					@click="connect"
				>
					{{ t("lastfm.connect") }}
				</button>
				<a
					v-if="authorizationUrl"
					class="btn btn-flat"
					:href="authorizationUrl"
					target="_blank"
					rel="noopener noreferrer"
				>
					{{ t("lastfm.openAuthorization") }}
				</a>
				<button
					v-if="isWaitingForAuthorization"
					class="btn btn-primary"
					type="button"
					:disabled="isBusy"
					@click="completeConnection"
				>
					{{ t("lastfm.complete") }}
				</button>
				<button
					v-if="isConnected"
					class="btn btn-flat"
					type="button"
					:disabled="isBusy"
					@click="disconnect"
				>
					{{ t("lastfm.disconnect") }}
				</button>
			</div>
		</section>

		<section
			class="bg-panels-bg rounded-lg p-5"
			aria-labelledby="lastfm-artist-tag"
		>
			<h2 id="lastfm-artist-tag" class="mb-1 text-xl font-semibold">
				{{ t("lastfm.artistTagTitle") }}
			</h2>
			<p class="mb-4 opacity-70">{{ t("lastfm.artistTagDescription") }}</p>
			<div class="flex flex-col gap-3" role="radiogroup">
				<label
					v-for="option in artistTagOptions"
					:key="option.value"
					class="flex cursor-pointer items-start gap-3"
				>
					<input
						type="radio"
						name="scrobble-artist-tag"
						class="mt-1"
						:value="option.value"
						:checked="playerStore.scrobbleArtistTag === option.value"
						@change="playerStore.setScrobbleArtistTag(option.value)"
					/>
					<span>
						<span class="block font-semibold">{{ t(option.label) }}</span>
						<span class="block text-sm opacity-70">{{ t(option.hint) }}</span>
					</span>
				</label>
			</div>
		</section>
	</section>
</template>
