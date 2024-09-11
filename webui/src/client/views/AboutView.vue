<script setup lang="ts">
import paypal from "@/assets/paypal.svg?url";
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
	<div id="about_tab">
		<h1 class="mb-8 text-5xl capitalize">{{ t("sidebar.about") }}</h1>

		<div
			class="mb-8 inline-flex rounded-full px-4 py-2"
			:class="{ 'bg-green-500': isOnline, 'bg-red-500': !isOnline }"
		>
			<span class="uppercase-first-letter text-sm">
				{{ t(`about.appStatus.${isOnline ? "online" : "offline"}`) }}
			</span>
		</div>

		<ul>
			<li>
				{{ t("about.updates.currentWebuiVersion") }}:
				<span>{{
					appInfo.webuiVersion || t("about.updates.versionNotAvailable")
				}}</span>
			</li>
			<li v-if="appInfo.guiVersion">
				{{ t("about.updates.currentWebuiVersion") }}:
				<span>{{
					appInfo.guiVersion || t("about.updates.versionNotAvailable")
				}}</span>
			</li>
			<li>
				{{ t("about.updates.deemixVersion") }}: {{ appInfo.deemixVersion }}
			</li>
			<i18n-t
				v-if="appInfo.updateAvailable && appInfo.latestVersion"
				keypath="about.updates.updateAvailable"
				tag="li"
			>
				<template #version>
					<a :href="updateUrl" target="_blank">{{ appInfo.latestVersion }}</a>
				</template>
			</i18n-t>
		</ul>

		<ul>
			<li v-html="t('about.usesLibrary')"></li>
			<li v-html="t('about.thanks')"></li>
			<i18n-t keypath="about.upToDate.text" tag="li">
				<template #newsChannel>
					<a href="https://tg.deemix.app" target="_blank">{{
						t("about.upToDate.newsChannel")
					}}</a>
				</template>
			</i18n-t>
		</ul>

		<h2>{{ t("about.titles.usefulLinks") }}</h2>
		<ul class="no-dots">
			<li>
				<a href="https://deemix.app/gui" target="_blank"
					>🌍 {{ t("about.officialWebsite") }}</a
				>
			</li>
			<li>
				<a href="https://gitlab.com/RemixDev/deemix-js" target="_blank"
					>🚀 {{ t("about.officialRepo") }}</a
				>
			</li>
			<li>
				<a href="https://gitlab.com/RemixDev/deemix-webui" target="_blank">
					💻 {{ t("about.officialWebuiRepo") }}
				</a>
			</li>
			<li>
				<a href="https://www.reddit.com/r/deemix" target="_blank"
					>🤖 {{ t("about.officialSubreddit") }}</a
				>
			</li>
			<li>
				<a href="https://tg.deemix.app" target="_blank"
					>📰 {{ t("about.newsChannel") }}</a
				>
			</li>
			<li>
				<a href="https://t.me/RemixDevNews" target="_blank"
					>💾 {{ t("about.devlogChannel") }}</a
				>
			</li>
		</ul>

		<h2>
			{{ t("about.titles.bugReports") }}
			<span class="subheading">
				{{ t("about.subtitles.bugReports") }}
			</span>
		</h2>
		<ul>
			<i18n-t keypath="about.questions.text" tag="li">
				<template #subreddit>
					<a href="https://www.reddit.com/r/deemix" target="_blank">{{
						t("about.questions.subreddit")
					}}</a>
				</template>
			</i18n-t>
			<li>
				{{ t("about.beforeReporting") }}
			</li>
			<li v-html="t('about.beSure')"></li>
			<li>
				{{ t("about.duplicateReports") }}
			</li>
			<li v-html="t('about.dontOpenIssues')"></li>
		</ul>

		<h2>
			{{ t("about.titles.contributing") }}
			<span class="subheading">
				{{ t("about.subtitles.contributing") }}
			</span>
		</h2>
		<ul>
			<i18n-t keypath="about.newUI.text" tag="li">
				<template #repo>
					<span>{{ t("about.newUI.repo") }}</span>
				</template>
			</i18n-t>
			<li>
				{{ t("about.acceptFeatures") }}
			</li>
			<i18n-t keypath="about.contributeWebUI.text" tag="li">
				<template #webui>
					<span>{{ t("about.contributeWebUI.webui") }}</span>
				</template>
			</i18n-t>
			<li>
				{{ t("about.otherLanguages") }}
			</li>
			<li>
				{{ t("about.understandingCode") }}
			</li>
		</ul>

		<h2>
			{{ t("about.titles.donations") }}
			<span class="subheading">
				{{ t("about.subtitles.donations") }}
			</span>
		</h2>
		<ul>
			<li v-html="t('about.itsFree')"></li>
			<li>
				{{ t("about.notObligated") }}
			</li>
		</ul>
		<ul>
			<li>
				<img :src="paypal" class="mr-2 h-4 w-4 align-middle" />
				<strong>PayPal: </strong>
				<a href="https://paypal.me/RemixDev" target="_blank"
					>PayPal.me/RemixDev</a
				>
			</li>
		</ul>

		<h2>{{ t("about.titles.license") }}</h2>
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
		<i18n-t keypath="about.lincensedUnder.text" tag="p">
			<template #gpl3>
				<a
					rel="license"
					href="https://www.gnu.org/licenses/gpl-3.0.en.html"
					target="_blank"
					>{{ t("about.lincensedUnder.gpl3") }}</a
				>
			</template>
		</i18n-t>
	</div>
</template>

<style scoped>
li,
p,
a {
	letter-spacing: 0.4px;
	line-height: 1.2;
}

i {
	vertical-align: middle;
}

.paypal {
	fill: white;
	width: 20px;
}

:link {
	text-decoration: none;
}

#about_tab {
	margin-bottom: 40px;
}

h2 {
	text-transform: capitalize;
}

h2:not(.page_heading) {
	font-size: 2rem;
	border-bottom: 1px solid rgba(51, 51, 51, 0.25);
	padding-top: 2rem;
	padding-bottom: 1rem;
}

h2 .subheading {
	display: block;
	font-size: 0.5em;
	margin-top: 0.5em;
	font-weight: normal;
	opacity: 0.8;
	text-transform: none;
}

p {
	margin: 0 !important;
}

ul li {
	margin-bottom: 7px;
}
h2 + ul {
	margin-top: 1rem;
}
ul + ul {
	margin-top: 1.25rem;
}
ul.no-dots {
	list-style-type: none;
}
ul:not(.no-dots) {
	list-style-type: none;
}
ul:not(.no-dots) li {
	position: relative;
}
ul:not(.no-dots) li::before {
	content: "—";
	position: absolute;
	left: -30px;
	opacity: 0.25;
}
</style>
