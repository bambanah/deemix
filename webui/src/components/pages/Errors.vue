<template>
	<div>
		<h1 class="mb-8 text-5xl">{{ $t("errors.title", { name: title }) }}</h1>

		<table v-if="errors.length >= 1" class="table--tracklist table">
			<tr>
				<th>ID</th>
				<th class="uppercase-first-letter">
					{{ $tc("globals.listTabs.artist", 1) }}
				</th>
				<th class="uppercase-first-letter">
					{{ $tc("globals.listTabs.title", 1) }}
				</th>
				<th class="uppercase-first-letter">
					{{ $tc("globals.listTabs.error", 1) }}
				</th>
			</tr>
			<tr v-for="error in errors" :key="error.data.id">
				<td>{{ error.data.id }}</td>
				<td>{{ error.data.artist }}</td>
				<td>{{ error.data.title }}</td>
				<td>
					<span :title="error.stack">
						{{
							error.errid
								? $t(`errors.ids.${error.errid}`, { bitrate: downloadBitrate })
								: error.message
						}}
					</span>
				</td>
			</tr>
		</table>
		<div v-if="postErrors.length >= 1">
			<h2>{{ $t("errors.postTitle") }}</h2>
			<table class="table--tracklist table">
				<tr>
					<th>ID</th>
					<th class="uppercase-first-letter">
						{{ $tc("globals.listTabs.empty") }}
					</th>
					<th class="uppercase-first-letter">
						{{ $tc("globals.listTabs.error", 1) }}
					</th>
				</tr>
				<tr v-for="error in postErrors" :key="error.data.id">
					<td>{{ error.data.position }}</td>
					<td>
						<span v-if="error.data.id"
							>{{ error.data.artist }} - {{ error.data.title }}</span
						>
					</td>
					<td>
						<span :title="error.stack">{{
							error.errid ? $t(`errors.ids.${error.errid}`) : error.message
						}}</span>
					</td>
				</tr>
			</table>
		</div>
	</div>
</template>

<script lang="ts">
import { pinia } from "@/stores";
import { useErrorStore } from "@/stores/errors";

const errorStore = useErrorStore(pinia);

export default {
	data() {
		return {
			BITRATE_LABELS: {
				15: "360 HQ",
				14: "360 MQ",
				13: "360 LQ",
				9: "FLAC",
				3: "320kbps",
				1: "128kbps",
				8: "128kbps",
				0: "MP3",
			},
		};
	},
	computed: {
		title() {
			return `${errorStore.artist} - ${errorStore.title}`;
		},
		errors() {
			let errors = [];
			errorStore.errors.forEach((error) => {
				if (!error.type || error.type === "track") errors.push(error);
			});
			return errors;
		},
		postErrors() {
			let errors = [];
			errorStore.errors.forEach((error) => {
				if (error.type === "post") errors.push(error);
			});
			return errors;
		},
		downloadBitrate() {
			return this.BITRATE_LABELS[errorStore.bitrate];
		},
	},
};
</script>

<style></style>
