<template>
	<div class="text-center">
		<h1>{{ t("search.error") }}</h1>
		<p class="secondary-text mt-4">{{ error }}</p>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

defineProps({
	error: {
		type: String,
		default: "Error",
	},
});

const { t } = useI18n();
</script>
