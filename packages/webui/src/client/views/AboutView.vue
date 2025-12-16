<script setup lang="ts">
import { pinia } from "@/stores";
import { useAppInfoStore } from "@/stores/appInfo";
import { useOnline } from "@/use/online";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const appInfo = useAppInfoStore(pinia);
const { isOnline } = useOnline();
const { t } = useI18n();

const updateUrl = computed(() => {
	if (appInfo.guiVersion) {
		return `https://github.com/bambanah/deemix/releases/tag/deemix-gui%40${appInfo.latestVersion}`;
	} else {
		return `https://github.com/bambanah/deemix/pkgs/container/deemix`;
	}
});
</script>

<template>
	<div class="mb-8 flex flex-col items-start gap-6">
		<h1 class="text-5xl capitalize">{{ t("sidebar.about") }}</h1>

		<div
			class="inline-flex rounded-full px-4 py-2"
			:class="{ 'bg-green-500': isOnline, 'bg-red-500': !isOnline }"
		>
			<span class="uppercase-first-letter text-sm">
				{{ t(`about.appStatus.${isOnline ? "online" : "offline"}`) }}
			</span>
		</div>

		<div class="list-none pl-0">
			<p>
				{{ t("about.updates.currentWebuiVersion") }}:
				{{ appInfo.webuiVersion || t("about.updates.versionNotAvailable") }}
			</p>
			<p v-if="appInfo.guiVersion">
				{{ t("about.updates.currentGuiVersion") }}:
				{{ appInfo.guiVersion || t("about.updates.versionNotAvailable") }}
			</p>
			<p>{{ t("about.updates.deemixVersion") }}: {{ appInfo.deemixVersion }}</p>
			<i18n-t
				v-if="appInfo.updateAvailable && appInfo.latestVersion"
				keypath="about.updates.updateAvailable"
				tag="p"
			>
				<template #version>
					<a :href="updateUrl" target="_blank">{{ appInfo.latestVersion }}</a>
				</template>
			</i18n-t>
		</div>

		<a href="https://ko-fi.com/L3L71IQN1F" target="_blank">
			<img
				height="36"
				style="border: 0px; height: 36px"
				src="https://storage.ko-fi.com/cdn/kofi6.png?v=6"
				border="0"
				alt="Buy Me a Coffee at ko-fi.com"
			/>
		</a>

		<div>
			<h2 class="text-3xl">
				{{ t("about.titles.bugReportsContributing") }}
			</h2>
			<a
				href="https://github.com/bambanah/deemix"
				class="mt-4 flex items-center gap-2"
				target="_blank"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="20"
					viewBox="0 0 16 16"
					width="20"
					aria-hidden="true"
					class="d-block"
				>
					<path
						fill="currentColor"
						d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
					></path>
				</svg>
				{{ t("about.officialRepo") }}
			</a>
		</div>

		<ul>
			<li>
				{{ t("about.beforeReporting") }}
			</li>
			<li v-html="t('about.beSure')"></li>
			<li>
				{{ t("about.duplicateReports") }}
			</li>
		</ul>

		<h2 class="text-3xl leading-10">{{ t("about.titles.license") }}</h2>
		<p>
			<a
				rel="license"
				href="https://www.gnu.org/licenses/gpl-3.0.en.html"
				target="_blank"
			>
				<img
					alt="GNU General Public License"
					style="border-width: 0"
					src="https://www.gnu.org/graphics/gplv3-127x51.png"
				/>
			</a>
		</p>
		<i18n-t keypath="about.licencedUnder.text" tag="p">
			<template #gpl3>
				<a
					rel="license"
					href="https://www.gnu.org/licenses/gpl-3.0.en.html"
					target="_blank"
					>{{ t("about.licencedUnder.gpl3") }}</a
				>
			</template>
		</i18n-t>
	</div>
</template>

<style scoped>
ul {
	@apply pl-4;
}

ul li {
	@apply leading-6;
}

:link {
	text-decoration: none;
}
</style>
