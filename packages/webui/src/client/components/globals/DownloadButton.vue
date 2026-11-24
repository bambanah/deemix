<script setup lang="ts">
import BaseSpinner from "@/components/globals/BaseSpinner.vue";
import { pinia } from "@/stores";
import { useDownloadsStore } from "@/stores/downloads";
import type { DownloadState } from "@/utils/queue-keys";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

interface Props {
	/** Link (or links separated by `;`) to add to the queue */
	link: string;
	/** Title of the item, used in toasts and the pending queue row */
	itemTitle?: string;
	bitrate?: number | string | null;
	/** Icon shown when the item can be downloaded */
	idleIcon?: string;
	/** Removes the native button styles (for icon-only buttons) */
	plain?: boolean;
	iconClass?: string;
	spinnerSize?: number;
}

const {
	link,
	itemTitle = "",
	bitrate = null,
	idleIcon = "get_app",
	plain = false,
	iconClass = "",
	spinnerSize = 20,
} = defineProps<Props>();

const { t } = useI18n();
const downloadsStore = useDownloadsStore(pinia);

const state = computed<DownloadState>(() =>
	downloadsStore.getDownloadState(link)
);
const isDisabled = computed(() => !link || state.value !== "idle");

const icon = computed(() => {
	switch (state.value) {
		case "queued":
			return "schedule";
		case "downloading":
			return "downloading";
		case "finished":
			return "download_done";
		case "error":
			return "error_outline";
		default:
			return idleIcon;
	}
});

const hint = computed(() => {
	switch (state.value) {
		case "pending":
			return t("globals.adding_to_queue");
		case "queued":
		case "downloading":
		case "error":
			return t("globals.already_in_queue_hint");
		case "finished":
			return t("globals.downloaded_hint");
		default:
			return t("globals.download_hint");
	}
});

function onClick() {
	if (isDisabled.value) return;

	downloadsStore.sendAddToQueue(link, bitrate, itemTitle);
}
</script>

<template>
	<button
		type="button"
		class="download-btn"
		:class="[
			`download-btn--${state}`,
			{ 'download-btn--plain': plain, 'download-btn--disabled': isDisabled },
		]"
		:title="hint"
		:aria-label="hint"
		:aria-disabled="isDisabled"
		:aria-busy="state === 'pending'"
		:data-link="link"
		@click.stop.prevent="onClick"
	>
		<slot :state="state" :icon="icon" :hint="hint" :disabled="isDisabled">
			<BaseSpinner v-if="state === 'pending'" :size="spinnerSize" />
			<i v-else class="material-icons" :class="iconClass">{{ icon }}</i>
		</slot>
	</button>
</template>

<style scoped>
.download-btn {
	cursor: pointer;
}

.download-btn--plain {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0;
	border: 0;
	background: transparent;
	color: inherit;
	font: inherit;
}

.download-btn--plain:not(.download-btn--disabled):hover {
	color: var(--primary-color);
}

.download-btn--disabled {
	cursor: default;
}

.download-btn--disabled:not(.download-btn--pending) {
	opacity: 0.6;
}

.download-btn--finished.download-btn--plain {
	color: var(--primary-color);
}
</style>
