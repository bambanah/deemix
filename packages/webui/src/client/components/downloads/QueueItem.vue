<script setup lang="ts">
import { computed, ref } from "vue";

const possibleStates = [
	"converting",
	"downloading",
	"download finished",
	"completed",
];

interface Props {
	queueItem: {
		id: string;
		type: string;
		downloaded: number;
		failed: number;
		errors: any[];
		status: string;
		size: number;
		uuid: string;
		progress: number;
		conversion: number;
		bitrate: string;
		artist: string;
		title: string;
		cover: string;
		album: {
			id: string;
			title: string;
		};
		artists: string[];
		explicit: boolean;
	};
	showTags: boolean;
}
const { queueItem } = defineProps<Props>();
const emit = defineEmits(["retry-download", "remove-item", "show-errors"]);

const isLoading = ref(false);
const hovered = ref(false);

const hasFails = computed(() => queueItem.failed >= 1);
const hasErrors = computed(() => queueItem.errors?.length >= 1);
const allFailed = computed(() => {
	let allFailed = false;

	if (queueItem.status === "download finished") {
		allFailed = queueItem.size !== 0 && queueItem.failed === queueItem.size;
	}

	return allFailed;
});
const finishedWithFails = computed(() => {
	return (
		queueItem.status === "download finished" &&
		(hasFails.value || hasErrors.value)
	);
});
const isDeterminateStatus = computed(() =>
	possibleStates.includes(queueItem.status)
);
const barClass = computed(() => ({
	converting: queueItem.status === "converting",
	indeterminate: !isDeterminateStatus.value,
	determinate: isDeterminateStatus.value,
}));
const barStyle = computed(() => {
	let width = 0;
	let backgroundColor = "var(--primary-color)";

	if (hasFails.value || hasErrors.value) {
		// Orange
		backgroundColor = "hsl(33, 100%, 47%)";
	} else {
		// Green
		backgroundColor = "hsl(150, 76%, 34%)";
	}

	if (allFailed.value) {
		// Red
		backgroundColor = "hsl(360, 100%, 35%)";
	}

	if (queueItem.status === "download finished") {
		width = 100;
	}

	if (queueItem.status === "downloading") {
		width = queueItem.progress;
	}

	if (queueItem.status === "converting") {
		width = 100 - queueItem.conversion;
		backgroundColor = "hsl(46, 100%, 50%)";
	}

	return {
		width: `${width}%`,
		backgroundColor,
	};
});

const resultIconText = computed(() => {
	let text = "delete_forever";

	if (queueItem.status === "download finished") {
		if (!(hasFails.value || hasErrors.value)) {
			text = "done";
		} else if (queueItem.failed >= queueItem.size) {
			text = "error";
		} else {
			text = "warning";
		}
	}

	return text;
});

const generateLink = computed(() => {
	switch (queueItem.type) {
		case "track":
			return `https://deezer.com/track/${queueItem.id}`;
		case "album":
			return `https://deezer.com/album/${queueItem.id}`;
		case "playlist":
			if (queueItem.id.endsWith("_top_track"))
				return `https://www.deezer.com/artist/${queueItem.id.slice(
					0,
					-10
				)}/top_track`;
			return `https://deezer.com/playlist/${queueItem.id}`;
		case "spotify_playlist":
			return `https://open.spotify.com/playlist/${queueItem.id}`;
		default:
			return "";
	}
});

const bitrateText = computed(() => {
	switch (parseInt(queueItem.bitrate)) {
		case 9:
			return "FLAC";
		case 3:
			return "320";
		case 1:
			return "128";
		case 15:
			return "360HQ";
		case 14:
			return "360MQ";
		case 13:
			return "360LQ";
		default:
			return "MISC";
	}
});

function onResultIconClick() {
	if (isDeterminateStatus.value) {
		if (finishedWithFails.value) {
			emit("retry-download", queueItem.uuid);
		}

		if (queueItem.status === "downloading") {
			isLoading.value = true;
			emit("remove-item", queueItem.uuid);
		}
	} else {
		isLoading.value = true;
		emit("remove-item", queueItem.uuid);
	}
}
</script>

<template>
	<div class="download-object" :data-link-only="generateLink">
		<div class="download-info">
			<div class="coverart relative rounded">
				<img
					width="75px"
					:src="queueItem.cover"
					:alt="`Cover ${queueItem.title}`"
				/>
				<span v-if="showTags" class="tag">{{ bitrateText }}</span>
			</div>

			<div class="download-info-data">
				<span class="download-line">
					<i v-if="queueItem.explicit" class="material-icons explicit-icon"
						>explicit</i
					>
					{{ queueItem.title }}
				</span>
				<span class="download-slim-separator"> - </span>
				<span>{{ queueItem.artist }}</span>
			</div>

			<div class="download-info-status" style="text-align: center">
				<span class="download-line">
					{{ queueItem.downloaded + queueItem.failed }}/{{ queueItem.size }}
				</span>

				<span
					v-if="hasFails"
					class="flex items-center"
					:class="{ 'cursor-pointer': hasFails }"
					style="justify-content: center"
					@click="hasFails ? emit('show-errors', queueItem) : null"
				>
					{{ queueItem.failed }}
					<i class="material-icons">error_outline</i>
				</span>
			</div>
		</div>

		<div class="download-bar">
			<div class="progress">
				<div :class="barClass" :style="barStyle"></div>
			</div>
			<i
				v-if="!isLoading"
				class="material-icons queue_icon"
				:class="{
					'cursor-pointer':
						finishedWithFails || resultIconText === 'delete_forever',
				}"
				@mouseover="hovered = true"
				@mouseleave="hovered = false"
				@click="onResultIconClick"
			>
				{{ hovered && finishedWithFails ? "refresh" : resultIconText }}
			</i>
			<div v-else class="circle-loader"></div>
		</div>
	</div>
</template>

<style>
.download-object {
	padding-bottom: 8px;
}
.download-object .download-info {
	display: flex;
	align-items: center;
}
.download-object .download-info .coverart {
	height: 75px;
	width: 75px;
	flex: 0 0 75px;
	overflow: hidden;
}
.download-object .download-info .coverart .tag {
	position: absolute;
	bottom: 0px;
	right: 0px;
}
.download-object .download-info .download-line {
	display: block;
}
.download-object .download-info .download-line .explicit-icon {
	vertical-align: bottom;
}
.download-object .download-info .download-slim-separator {
	display: none;
}
.download-object .download-info-data {
	flex: 1 50%;
	margin-left: 8px;
	overflow: hidden;
}
.download-object .download-info-status {
	flex: 1 15%;
	margin-left: 8px;
	width: 80px;
}
.download-object > .download-bar {
	display: flex;
	align-items: center;
	height: 24px;
}
.download-object > .download-bar > .queue_icon {
	margin-left: 8px;
}
.download-object > .download-bar > .progress {
	margin: 0;
}

#download_list:not(.slim) .download-line {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

#download_list.slim > .download-object .download-info {
	display: block;
}
#download_list.slim > .download-object .download-info .coverart {
	display: none;
}
#download_list.slim > .download-object .download-info .download-line {
	display: inline-block;
}
#download_list.slim > .download-object .download-info .download-slim-separator {
	display: inline-block;
}
#download_list.slim > .download-object .download-info-data {
	width: calc(80% - 16px);
	display: inline-block;
	padding-left: 0;
}
#download_list.slim > .download-object .download-info-status {
	width: 20%;
	display: block;
	float: right;
}

.progress {
	position: relative;
	height: 4px;
	display: block;
	width: 100%;
	background-color: var(--secondary-background);
	border-radius: 2px;
	margin: 0.5rem 0 1rem 0;
	overflow: hidden;
}
.progress .determinate {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	background-color: var(--primary-color);
	transition: width 0.3s linear;
}
.progress .converting {
	background-color: var(--secondary-color);
	transition: none !important;
}
.progress .indeterminate {
	background-color: var(--primary-color);
}
.progress .indeterminate::before {
	content: "";
	position: absolute;
	background-color: inherit;
	top: 0;
	left: 0;
	bottom: 0;
	will-change: left, right;
	animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
}
.progress .indeterminate::after {
	content: "";
	position: absolute;
	background-color: inherit;
	top: 0;
	left: 0;
	bottom: 0;
	will-change: left, right;
	animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1)
		infinite;
	animation-delay: 1.15s;
}

@keyframes indeterminate {
	0% {
		left: -35%;
		right: 100%;
	}
	60% {
		left: 100%;
		right: -90%;
	}
	100% {
		left: 100%;
		right: -90%;
	}
}

@keyframes indeterminate-short {
	0% {
		left: -200%;
		right: 100%;
	}
	60% {
		left: 107%;
		right: -8%;
	}
	100% {
		left: 107%;
		right: -8%;
	}
}
</style>
