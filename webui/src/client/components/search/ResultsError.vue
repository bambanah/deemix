<script setup lang="ts">
import { useI18n } from "vue-i18n";

interface Props {
	error?: string;
}

const { error = "Error" } = defineProps<Props>();

const { t } = useI18n();
</script>

<template>
	<div class="text-center">
		<h1>{{ t("search.error") }}</h1>
		<p class="secondary-text mt-4">{{ error }}</p>
	</div>
</template>
