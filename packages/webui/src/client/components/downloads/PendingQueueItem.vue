<script setup lang="ts">
import BaseSpinner from "@/components/globals/BaseSpinner.vue";
import type { PendingItem } from "@/stores/downloads";
import { useI18n } from "vue-i18n";

const { item } = defineProps<{ item: PendingItem }>();
const { t } = useI18n();
</script>

<template>
	<div class="download-object pending-download" aria-busy="true">
		<div class="download-info">
			<div
				class="coverart bg-grayscale-200 relative flex items-center justify-center rounded"
			>
				<BaseSpinner :size="28" />
			</div>

			<div class="download-info-data">
				<span class="download-line">
					{{ item.title || t("globals.adding_to_queue") }}
				</span>
				<span class="download-slim-separator"> - </span>
				<span class="download-line text-sm opacity-70">
					{{ item.title ? t("globals.adding_to_queue") : item.url }}
				</span>
			</div>
		</div>

		<div class="download-bar">
			<div class="progress">
				<div class="indeterminate"></div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.pending-download .progress .indeterminate {
	position: absolute;
	inset: 0;
}
</style>
