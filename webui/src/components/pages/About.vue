<template>
	<div id="about_tab">
		<h1 class="mb-8 text-5xl capitalize">{{ $t('sidebar.about') }}</h1>

		<div class="inline-flex px-4 py-2 mb-8 rounded-full" :class="{ 'bg-green-500': isOnline, 'bg-red-500': !isOnline }">
			<span class="text-sm uppercase-first-letter">
				{{ $t(`about.appStatus.${isOnline ? 'online' : 'offline'}`) }}
			</span>
		</div>

		<ul>
			<li>
				{{ $t('about.updates.currentWebuiVersion') }}:
				<span>{{ __VER__ || $t('about.updates.versionNotAvailable') }}</span>
			</li>
			<li>
				{{ $t('about.updates.currentVersion') }}:
				<span>{{ current || $t('about.updates.versionNotAvailable') }}</span>
			</li>
			<li>{{ $t('about.updates.deemixVersion') }}: {{ deemixVersion }}</li>
			<i18n path="about.updates.updateAvailable" tag="li" v-if="updateAvailable && latest">
				<template #version>
					<a href="https://t.me/DeemixFix" target="_blank">{{ latest }}</a>
				</template>
			</i18n>
		</ul>

		<ul>
			<li v-html="$t('about.usesLibrary')"></li>
			<li v-html="$t('about.thanks')"></li>
			<!-- 			<i18n path="about.upToDate.text" tag="li">
				<template #newsChannel>
					<a href="https://tg.deemix.app" target="_blank">{{ $t('about.upToDate.newsChannel') }}</a>
				</template>
			</i18n> -->
		</ul>

		<h2>Changelog</h2>
		<ul class="no-dots" style="font-size: 15px;">
			<h3>08/08/2024</h3>
			- Icon colors<br>
			- Created <a target="_blank" href="https://t.me/DeemixFix"> Releases Channel </a>Subscribe for
			updates, changelog and Builds.<br>
			- Contributions to developer accepted (all debit and credit cards):<a target="_blank"
				href="https://revolut.me/michelf9a"> Revolut Me </a><br>
			<br>
			<h3>07/08/2024</h3>
			- Restored "Spotify Username" field in Settings, Other, Spotify features.<br>
			- Fix for crash when fetching empty Spotify Playlists or without thumbnail image.<br>
			- New feature! Added the possibility to insert a list of spotify users instead, separated by commas or
			spaces.<br><br>
			How it works:<br>
			Add a list of comma or space separated Spotify user IDs to "follow".<br>
			All the public playlists by the listed users will be displayed in the Favorites section. A user ID is the part
			that comes after 'https://open.spotify.com/user/' and can be a set of alphanumeric characters or a profile name,
			especially for record labels. You can also insert your own Spotify username ID as before.<br>
			<br>
			<h3>02/08/2024</h3>
			- Removed outdated linters and formatters<br>
			- Few fixes in API ts types<br>
			- Removed Spotify UserName requirement and instructions from settings<br>
			<br>
			<h3>31/07/2024</h3>
			- Reverted to spotify-web-api-node<br>
			- Fixed (again) the Buffer method in spotify-web-api-node<br>
			<br>
			<h3>26/07/2024</h3>
			- Moved all scripts to pnpm<br>
			- Fixed a few dependencies<br>
			- Incorporated spotify-web-api-node-plus as local dependency<br>
			- Replaced dateformat with date-fns<br>
			<br>
			<h3>25/07/2024</h3>
			- Moved to spotify-web-api-node-plus<br>
			- Amended spotify-web-api-node-plus Buffer() outdated syntax<br>
			- Incorporated deemix.js as submodule<br>
			- Fixed wrong API error displayed when track unavailable on Deezer<br>
			- Removed bug report section in About<br>
			- Removed reference to subreddit in About, now pointing to Telegram<br>
			<br>
			<h3>23/07/2024</h3>
			- Fixed wrong API check for Deezer APIs<br>
			- Removed email/password login (for now) to avoid confusion<br>
			- Fixed search field background in day mode<br>
			<br>
			<h3>22/07/2024 - part2</h3>
			- Added Dev branch<br>
			- Rebased on RemixDev original project to maintain all commit history<br>
			<br>
			<h3>22/07/2024 - part1</h3>
			- Fixed warning "Failed to make bytecode node20-x64 for file dateformat.js" during build phase<br>
			- Removed server/dist/app.js and webui/public/js/bundle.js from repo, should not be tracked<br>
			- Changelog improvements<br>
			<br>
			<h3>22/07/2024</h3>
			- Fixed update check, it now correctly notifies for new versions on GDrive<br>
			<br>
			<h3>21/07/2024</h3>
			- converted a lot of JS files to ES6<br>
			- removed tabs<br>
			- Modified About section<br>
			- Added working Paypal link for contributions<br>
			- Published on Gitlab Repo<br>
			<br>
			<h3>18/07/2024</h3>
			- Initial sync, JS formatting via Standard-JS for all project files<br>
			- Fixed download playlist from Spotify<br>
			- Created local dependency "deemix 3.6.15', no longer from NPM, added Uh Wot fix<br>
			- Created local dependency "spotify-web-api-node 5.04", no longer from NPM, fixed formatting and moved to ES6<br>
			- Fixed alloc buffer security issue in spotify-web-api-node, was outputting error in server versions<br>
			- Fixed logger errors<br>
			- Upgraded a few dependencies<br>
			- Replaced pkg with yaopkg<br>
			- updated build scripts, removed Production build for now, the DEV build works fine<br>
		</ul>

		<h2>{{ $t('about.titles.usefulLinks') }}</h2>
		<ul class="no-dots">
			<li>
				<a href="https://gitlab.com/deeplydrumming/DeemixFix" target="_blank"> 💻 {{ $t('about.officialWebuiRepo') }}
				</a><br>
				<a href="https://t.me/DeemixFix" target="_blank">
					💻 Builds
				</a><br>
			</li>
		</ul>

		<h2>
			{{ $t('about.titles.bugReports') }}
			<span class="subheading">
				{{ $t('about.subtitles.bugReports') }}
			</span>
		</h2>
		<ul>
			<i18n path="about.questions.text" tag="li">
				<template #telegram>
					<a href="https://t.me/deemixcommunity" target="_blank">{{ $t('about.questions.telegram') }}</a>
				</template>
			</i18n>
			<!-- <li>
				{{ $t('about.beforeReporting') }}
			</li>
			<li v-html="$t('about.beSure')"></li>
			<li>
				{{ $t('about.duplicateReports') }}
			</li>
			<li v-html="$t('about.dontOpenIssues')"></li> -->
		</ul>

		<h2>
			{{ $t('about.titles.contributing') }}
			<span class="subheading">
				{{ $t('about.subtitles.contributing') }}
			</span>
		</h2>
		<ul>
			<!-- 			<li>
				{{ $t('about.acceptFeatures') }}
			</li> -->
			<i18n path="about.contributeWebUI.text" tag="li">
				<template #webui>
					<span>{{ $t('about.contributeWebUI.webui') }}</span>
				</template>
			</i18n>
		</ul>

		<h2>
			{{ $t('about.titles.donations') }}
			<span class="subheading">
				{{ $t('about.subtitles.donations') }}
			</span>
		</h2>
		<ul>
			<li v-html="$t('about.itsFree')"></li>
			<li>
				{{ $t('about.notObligated') }}
			</li>
		</ul>
		<ul>
			<li>
				<!-- <i v-html="paypal" /> -->
				<strong>Revolut (all debit and credit cards accepted)</strong>
				<a href="https://revolut.me/michelf9a" target="_blank">Contribute</a>
			</li>
		</ul>

		<h2>{{ $t('about.titles.license') }}</h2>
		<p>
			<a rel="license" href="https://www.gnu.org/licenses/gpl-3.0.en.html" target="_blank">
				<img alt="GNU General Public License" style="border-width: 0"
					src="https://www.gnu.org/graphics/gplv3-127x51.png" />
			</a>
		</p>
		<i18n path="about.lincensedUnder.text" tag="p">
			<template #gpl3>
				<a rel="license" href="https://www.gnu.org/licenses/gpl-3.0.en.html" target="_blank">{{
					$t('about.lincensedUnder.gpl3')
					}}</a>
			</template>
		</i18n>
	</div>
</template>

<script>
import { computed, defineComponent, onMounted, reactive, toRefs } from '@vue/composition-api'

import { useOnline } from '@/use/online'

export default defineComponent({
	setup(_, ctx) {
		const state = reactive({
			current: null,
			latest: null,
			updateAvailable: false,
			deemixVersion: null
		})
		const { isOnline } = useOnline()

		function initUpdate(appInfo) {
			const { currentCommit, latestCommit, updateAvailable, deemixVersion } = appInfo

			state.current = currentCommit
			state.latest = latestCommit
			state.updateAvailable = updateAvailable
			state.deemixVersion = deemixVersion
		}

		const getAppInfo = computed(() => ctx.root.$store.getters.getAppInfo)

		onMounted(() => {
			initUpdate(getAppInfo.value)
		})

		return {
			...toRefs(state),
			isOnline
		}
	}
})
</script>

<style scoped>
li, p, a {
	letter-spacing: 0.4px;
	font-size: 20px;
	line-height: 1.2;
}

i {
	vertical-align: middle;
}

i::v-deep svg {
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
	content: '—';
	position: absolute;
	left: -30px;
	opacity: 0.25;
}
</style>
