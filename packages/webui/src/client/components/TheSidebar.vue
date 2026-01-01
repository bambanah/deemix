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
		class="bg-panels-bg text-foreground left-0 top-0 flex h-screen flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0"
		:class="{
			'slim-sidebar w-20': hasSlimSidebar,
			'min-w-56': !hasSlimSidebar,
			'fixed z-50 -translate-x-full': !isMobileSidebarOpen,
			'fixed z-50 translate-x-0': isMobileSidebarOpen,
			'md:flex': true,
		}"
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
					'my-2 w-14': hasSlimSidebar,
					'my-5 w-24': !hasSlimSidebar,
				}"
			/>
		</router-link>

		<nav className="flex flex-col grow">
			<router-link
				v-for="link in mainNavItems"
				:key="link.name"
				:aria-label="link.name"
				class="hover:bg-background-main text-foreground group relative flex h-16 w-full items-center px-4 no-underline"
				:class="{
					'bg-background-main': route.name === link.routerName,
					'justify-center': hasSlimSidebar,
				}"
				:to="{ name: link.routerName }"
				@click="handleNavClick"
			>
				<i
					:class="{ 'text-primary': route.name === link.routerName }"
					class="material-icons side_icon group-hover:text-primary p-2 text-3xl"
				>
					{{ link.icon }}
				</i>
				<span
					:class="{ hidden: hasSlimSidebar }"
					class="whitespace-no-wrap ml-3 overflow-hidden capitalize"
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
