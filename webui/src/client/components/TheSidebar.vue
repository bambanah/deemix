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

const isSlim = ref(false);
const activeTablink = ref(activeTab ? activeTab.name : "home");

/* === Add update notification near info === */
const updateAvailable = computed(() => appInfoStore.updateAvailable);

router.afterEach((to) => {
	const linkInSidebar = links.find((link) => link.routerName === to.name);

	if (!linkInSidebar) return;

	activeTablink.value = linkInSidebar.name;
});
</script>

<template>
	<aside
		id="sidebar"
		:class="{ 'slim-sidebar w-12': isSlim }"
		:style="{ minWidth: '14rem' }"
		aria-label="sidebar"
		class="bg-panels-bg text-foreground left-0 top-0 flex h-screen flex-col"
		role="navigation"
	>
		<img
			src="@/assets/deemix-icon.svg?url"
			alt="deemix-icon"
			class="mx-auto my-5 w-24"
		/>
		<router-link
			v-for="link in links"
			:key="link.name"
			:aria-label="link.ariaLabel"
			:class="{ 'bg-background-main': activeTablink === link.name }"
			:to="{ name: link.routerName }"
			class="main_tablinks hover:bg-background-main text-foreground group relative flex h-16 items-center px-4 no-underline"
			@click="activeTablink = link.name"
		>
			<i
				:class="{ 'text-primary': activeTablink === link.name }"
				class="material-icons side_icon group-hover:text-primary p-2 text-3xl"
			>
				{{ link.icon }}
			</i>
			<span
				:class="{ hidden: isSlim }"
				class="whitespace-no-wrap main-tablinks-text ml-3 overflow-hidden capitalize"
			>
				{{ t(link.label) }}
			</span>
			<span
				v-if="link.name === 'about' && updateAvailable"
				id="update-notification"
				class="absolute h-3 w-3 rounded-full bg-red-600"
			></span>
		</router-link>

		<span
			id="theme_selector"
			:class="{ 'inline-grid gap-2': isSlim }"
			aria-label="theme selector"
			class="-ml-10 mb-5 mt-auto flex h-12 items-center justify-center gap-2"
			role="link"
		>
			<i
				class="material-icons side_icon side_icon--theme w-10 p-2 text-xl transition-all duration-500"
			>
				brush
			</i>
			<div
				id="theme_togglers"
				:class="{ 'inline-grid gap-2': isSlim }"
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
		</span>
	</aside>
</template>

<style scoped>
.deemix-icon-container {
	display: grid;
	place-content: center;
}
.slim-sidebar .deemix-icon-container {
	margin: 0.5rem 0;
}
.slim-sidebar .deemix-icon-container:deep(svg) {
	height: 30px;
}
.deemix-icon-container:deep(svg) {
	height: 75px;
}

#update-notification {
	top: 12px;
	left: 30px;
}

.side_icon--theme {
	font-size: 1.5rem /* 24px */;
	line-height: 2rem /* 32px */;
}

.theme_toggler {
	transition: border 200ms ease-in-out;
}
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
