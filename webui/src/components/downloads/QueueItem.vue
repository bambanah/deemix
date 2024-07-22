<template>
	<div class="download-object" :data-link-only="generateLink">
		<div class="download-info">
			<div class="relative coverart rounded">
				<img width="75px" :src="queueItem.cover" :alt="`Cover ${queueItem.title}`">
				<span v-if="showTags" class="tag">{{ bitrateText }}</span>
			</div>

			<div class="download-info-data">
				<span class="download-line">
					<i v-if="queueItem.explicit" class="material-icons explicit-icon">explicit</i> {{ queueItem.title }}
				</span>
				<span class="download-slim-separator"> - </span>
				<span>{{ queueItem.artist }}</span>
			</div>

			<div class="download-info-status" style="text-align: center">
				<span class="download-line"> {{ queueItem.downloaded + queueItem.failed }}/{{ queueItem.size }} </span>

				<span
					v-if="hasFails"
					class="flex items-center"
					:class="{ clickable: hasFails }"
					style="justify-content: center"
					@click="hasFails ? $emit('show-errors', queueItem) : null"
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
				:class="{ clickable: finishedWithFails || resultIconText === 'delete_forever' }"
				@click="onResultIconClick"
			>
				{{ resultIconText }}
			</i>
			<div v-else class="circle-loader"></div>
		</div>
	</div>
</template>

<script>
const possibleStates = ['converting', 'downloading', 'download finished', 'completed']

export default {
	props: {
		queueItem: {
			type: Object,
			default: () => ({})
		},
		showTags: Boolean
	},
	data() {
		return {
			isLoading: false
		}
	},
	computed: {
		hasFails() {
			return this.queueItem.failed >= 1
		},
		hasErrors() {
			return this.queueItem.errors.length >= 1
		},
		allFailed() {
			let allFailed = false

			if (this.queueItem.status === 'download finished') {
				allFailed = this.queueItem.size !== 0 && this.queueItem.failed === this.queueItem.size
			}

			return allFailed
		},
		finishedWithFails() {
			return this.queueItem.status === 'download finished' && (this.hasFails || this.hasErrors)
		},
		isDeterminateStatus() {
			return possibleStates.includes(this.queueItem.status)
		},
		barClass() {
			return {
				converting: this.queueItem.status === 'converting',
				indeterminate: !this.isDeterminateStatus,
				determinate: this.isDeterminateStatus
			}
		},
		barStyle() {
			let width = 0
			let backgroundColor = 'var(--primary-color)'

			if (this.hasFails || this.hasErrors) {
				// Orange
				backgroundColor = 'hsl(33, 100%, 47%)'
			} else {
				// Green
				backgroundColor = 'hsl(150, 76%, 34%)'
			}

			if (this.allFailed) {
				// Red
				backgroundColor = 'hsl(360, 100%, 35%)'
			}

			if (this.queueItem.status === 'download finished') {
				width = 100
			}

			if (this.queueItem.status === 'downloading') {
				width = this.queueItem.progress
			}

			if (this.queueItem.status === 'converting') {
				width = 100 - this.queueItem.conversion
				backgroundColor = 'hsl(46, 100%, 50%)'
			}

			return {
				width: `${width}%`,
				backgroundColor
			}
		},
		resultIconText() {
			let text = 'delete_forever'

			if (this.queueItem.status === 'download finished') {
				if (!(this.hasFails || this.hasErrors)) {
					text = 'done'
				} else if (this.queueItem.failed >= this.queueItem.size) {
					text = 'error'
				} else {
					text = 'warning'
				}
			}

			return text
		},
		generateLink() {
			switch (this.queueItem.type) {
				case "track":
					return `https://deezer.com/track/${this.queueItem.id}`
				case "album":
					return `https://deezer.com/album/${this.queueItem.id}`
				case "playlist":
					if (this.queueItem.id.endsWith("_top_track")) return `https://www.deezer.com/artist/${this.queueItem.id.slice(0, -10)}/top_track`
					return `https://deezer.com/playlist/${this.queueItem.id}`
				case "spotify_playlist":
					return `https://open.spotify.com/playlist/${this.queueItem.id}`
				default:
					return ""
			}
		},
		bitrateText() {
			switch (parseInt(this.queueItem.bitrate)) {
				case 9: return "FLAC";
				case 3: return "320";
				case 1: return "128";
				case 15: return "360HQ";
				case 14: return "360MQ";
				case 13: return "360LQ";
				default: return "MISC";
			}
		}
	},
	methods: {
		onResultIconClick() {
			if (this.isDeterminateStatus) {
				if (this.finishedWithFails) {
					this.$emit('retry-download', this.queueItem.uuid)
				}

				if (this.queueItem.status === 'downloading') {
					this.isLoading = true
					this.$emit('remove-item', this.queueItem.uuid)
				}
			} else {
				this.isLoading = true
				this.$emit('remove-item', this.queueItem.uuid)
			}
		}
	}
}
</script>

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
	cursor: default;
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
	display: inline-block;
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
	content: '';
	position: absolute;
	background-color: inherit;
	top: 0;
	left: 0;
	bottom: 0;
	will-change: left, right;
	animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
}
.progress .indeterminate::after {
	content: '';
	position: absolute;
	background-color: inherit;
	top: 0;
	left: 0;
	bottom: 0;
	will-change: left, right;
	animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
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
