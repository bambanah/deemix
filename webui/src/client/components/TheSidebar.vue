<script setup lang="ts">
import { links } from "@/data/sidebar";
import { pinia } from "@/stores";
import { useAppInfoStore } from "@/stores/appInfo";
import { useTheme } from "@/use/theme";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const appInfoStore = useAppInfoStore(pinia);
const { THEMES, currentTheme } = useTheme();

const activeTab = links.find((link) => link.routerName === route.name);

const activeTablink = ref(activeTab ? activeTab.name : "home");

/* === Add update notification near info === */
const updateAvailable = computed(() => appInfoStore.updateAvailable);
const hasSlimSidebar = computed(() => appInfoStore.hasSlimSidebar);

router.afterEach((to) => {
	const linkInSidebar = links.find((link) => link.routerName === to.name);

	if (!linkInSidebar) return;

	activeTablink.value = linkInSidebar.name;
});
</script>

<template>
	<aside
		class="bg-panels-bg text-foreground left-0 top-0 flex h-screen flex-col"
		:class="{
			'slim-sidebar w-20': hasSlimSidebar,
			'min-w-56': !hasSlimSidebar,
		}"
		aria-label="sidebar"
		role="navigation"
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
		<router-link
			v-for="link in links"
			:key="link.name"
			:aria-label="link.ariaLabel"
			class="hover:bg-background-main text-foreground group relative flex h-16 w-full items-center px-4 no-underline"
			:class="{
				'bg-background-main': activeTablink === link.name,
				'justify-center': hasSlimSidebar,
			}"
			:to="{ name: link.routerName }"
			@click="activeTablink = link.name"
		>
			<i
				:class="{ 'text-primary': activeTablink === link.name }"
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

		<div
			class="-ml-10 mb-5 mt-auto flex h-12 items-center justify-center gap-2"
			:class="{ 'ml-0 h-auto flex-col': hasSlimSidebar }"
			aria-label="theme selector"
			role="link"
		>
			<i class="material-icons w-10 p-2 text-xl transition-all duration-500">
				brush
			</i>
			<div
				:class="{ 'inline-grid gap-2': hasSlimSidebar }"
				class="relative flex items-center justify-center gap-3"
			>
				<div
					v-for="theme of THEMES"
					:key="theme"
					:class="[
						{ 'theme_toggler--active': currentTheme === theme },
						`theme_toggler--${theme}`,
					]"
					class="theme_toggler border-grayscale-500 gap h-6 w-6 cursor-pointer rounded-full border"
					@click="currentTheme = theme"
				/>
			</div>
		</div>
	</aside>
</template>

<style scoped>
.theme_toggler--active {
	border-width: 3px;
}
.theme_toggler--light {
	background-color: #fff;
}
.theme_toggler--dark {
	background-color: #141414;
}
.theme_toggler--purple {
	background: #460eaf;
}
</style>
