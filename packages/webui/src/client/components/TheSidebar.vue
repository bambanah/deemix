<script setup lang="ts">
import ThemePicker from "@/components/ThemePicker.vue";

import { mainNavItems } from "@/data/sidebar";
import { pinia } from "@/stores";
import { useAppInfoStore } from "@/stores/appInfo";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const { t } = useI18n();
const route = useRoute();
const appInfoStore = useAppInfoStore(pinia);

const updateAvailable = computed(() => appInfoStore.updateAvailable);
const hasSlimSidebar = computed(() => appInfoStore.hasSlimSidebar);
const isMobileSidebarOpen = computed(() => appInfoStore.isMobileSidebarOpen);

function closeSidebar() {
	appInfoStore.closeMobileSidebar();
}

function handleNavClick() {
	// Close sidebar on mobile after navigation
	appInfoStore.closeMobileSidebar();
}
</script>

<template>
	<!-- Mobile backdrop overlay -->
	<div
		v-if="isMobileSidebarOpen"
		class="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
		@click="closeSidebar"
	></div>

	<aside
		class="bg-panels-bg text-foreground fixed inset-y-0 left-0 z-50 flex w-64 max-w-[80vw] shrink-0 flex-col overflow-y-auto transition-transform duration-300 ease-in-out md:relative md:z-auto md:max-w-none md:translate-x-0"
		:class="{
			'slim-sidebar md:w-20': hasSlimSidebar,
			'md:w-56': !hasSlimSidebar,
			'-translate-x-full': !isMobileSidebarOpen,
			'translate-x-0 shadow-2xl': isMobileSidebarOpen,
		}"
		style="
			padding-top: env(safe-area-inset-top, 0px);
			padding-bottom: env(safe-area-inset-bottom, 0px);
		"
		aria-label="sidebar"
		role="navigation"
	>
		<router-link
			:to="{ name: 'Home' }"
			class="flex w-full justify-center"
			@click="handleNavClick"
		>
			<img
				src="@/assets/deemix-icon.svg?url"
				alt="deemix-icon"
				class="mx-auto"
				:class="{
					'my-4 w-20 md:my-2 md:w-14': hasSlimSidebar,
					'my-4 w-20 md:my-5 md:w-24': !hasSlimSidebar,
				}"
			/>
		</router-link>

		<nav class="flex grow flex-col">
			<router-link
				v-for="link in mainNavItems"
				:key="link.name"
				:aria-label="link.name"
				class="hover:bg-background-main text-foreground group relative flex h-14 w-full shrink-0 items-center px-4 no-underline md:h-16"
				:class="{
					'bg-background-main': route.name === link.routerName,
					'md:justify-center': hasSlimSidebar,
				}"
				:to="{ name: link.routerName }"
				@click="handleNavClick"
			>
				<i
					:class="{ 'text-primary': route.name === link.routerName }"
					class="material-icons side_icon group-hover:text-primary p-2 text-2xl md:text-3xl"
				>
					{{ link.icon }}
				</i>
				<span
					:class="{ 'md:hidden': hasSlimSidebar }"
					class="ml-3 overflow-hidden whitespace-nowrap capitalize"
				>
					{{ t(link.label) }}
				</span>
				<span
					v-if="link.name === 'about' && updateAvailable"
					class="absolute left-10 top-3 h-3 w-3 rounded-full bg-red-600"
				></span>
			</router-link>
		</nav>

		<ThemePicker />
	</aside>
</template>
