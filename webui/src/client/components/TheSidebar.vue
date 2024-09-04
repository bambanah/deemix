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
			class="mx-auto w-20"
		/>
		<router-link
			v-for="link in links"
			:key="link.name"
			:aria-label="link.ariaLabel"
			:class="{ 'bg-background-main': activeTablink === link.name }"
			:to="{ name: link.routerName }"
			class="main_tablinks hover:bg-background-main text-foreground group relative flex h-16 items-center no-underline"
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
			class="mt-5 flex h-12"
			role="link"
		>
			<i
				class="material-icons side_icon side_icon--theme cursor-default p-2 text-3xl transition-all duration-500"
			>
				brush
			</i>
			<div
				id="theme_togglers"
				:class="{ 'inline-grid gap-2': isSlim }"
				class="relative flex w-full items-center justify-evenly"
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

<script lang="ts">
import { links } from "@/data/sidebar";
import { pinia } from "@/stores";
import { useAppInfoStore } from "@/stores/appInfo";
import { useTheme } from "@/use/theme";
import {
	computed,
	defineComponent,
	getCurrentInstance,
	reactive,
	toRefs,
} from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
	setup(_, ctx) {
		const { t } = useI18n();

		const currInstance = getCurrentInstance();

		const activeTab = links.find(
			(link) => link.routerName === currInstance?.proxy.$root.$route.name
		);

		const state = reactive({
			activeTablink: activeTab ? activeTab.name : "home",
			links,
		});
		const { THEMES, currentTheme } = useTheme();

		/* === Add update notification near info === */
		const appInfoStore = useAppInfoStore(pinia);
		const updateAvailable = computed(() => appInfoStore.updateAvailable);

		currInstance?.proxy.$root.$router.afterEach((to) => {
			const linkInSidebar = state.links.find(
				(link) => link.routerName === to.name
			);

			if (!linkInSidebar) return;

			state.activeTablink = linkInSidebar.name;
		});

		return {
			...toRefs(state),
			updateAvailable,
			THEMES,
			currentTheme,
			isSlim: false,
			t,
		};
	},
});
</script>

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
