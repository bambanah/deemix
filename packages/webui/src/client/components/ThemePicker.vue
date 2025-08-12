<script setup lang="ts">
import { pinia } from "@/stores";
import { useAppInfoStore } from "@/stores/appInfo";
import { useTheme } from "@/use/theme";
import { computed } from "vue";

const { THEMES, currentTheme } = useTheme();
const appInfoStore = useAppInfoStore(pinia);

const hasSlimSidebar = computed(() => appInfoStore.hasSlimSidebar);
</script>

<template>
	<div
		class="flex items-center justify-center gap-3 pb-6"
		:class="{ 'h-auto flex-col pb-6': hasSlimSidebar }"
		aria-label="theme selector"
		role="link"
	>
		<div
			v-for="theme of THEMES"
			:key="theme"
			class="size-6 cursor-pointer rounded-full border-0 border-neutral-500 transition-[border-width]"
			:class="{
				'border-[3px]': currentTheme === theme,
				'bg-white': theme === 'light',
				'bg-[#141414]': theme === 'dark',
				'bg-[#460eaf]': theme === 'purple',
			}"
			@click="currentTheme = theme"
		/>
	</div>
</template>
