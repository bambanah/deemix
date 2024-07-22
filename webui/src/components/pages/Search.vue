<template>
	<div id="search_tab">
		<div v-show="isQueryEmpty && !isSearching">
			<h2>{{ $t('search.startSearching') }}</h2>
			<p>{{ $t('search.description') }}</p>
		</div>

		<BaseLoadingPlaceholder text="Searching..." :hidden="!isSearching" />

		<div v-show="!isQueryEmpty && !isSearching">
			<BaseTabs>
				<BaseTab
					v-for="tab in tabs"
					:key="tab.name"
					:class="{ active: currentTab.name === tab.name }"
					@click="changeSearchTab(tab.searchType)"
				>
					{{ tab.name }}
				</BaseTab>
			</BaseTabs>

			<keep-alive>
				<component
					:is="currentTab.component"
					:view-info="getViewInfo()"
					want-headers
					:items-to-show="Infinity"
					@add-to-queue="addToQueue"
					@change-search-tab="changeSearchTab"
				></component>
			</keep-alive>
		</div>
	</div>
</template>

<script>
import { computed, onMounted, reactive, ref, toRefs, watch, defineComponent } from '@vue/composition-api'
import { uniqWith } from 'lodash-es'

import BaseLoadingPlaceholder from '@/components/globals/BaseLoadingPlaceholder.vue'
import ResultsAll from '@/components/search/ResultsAll.vue'
import ResultsAlbums from '@/components/search/ResultsAlbums.vue'
import ResultsArtists from '@/components/search/ResultsArtists.vue'
import ResultsPlaylists from '@/components/search/ResultsPlaylists.vue'
import ResultsTracks from '@/components/search/ResultsTracks.vue'
import { BaseTabs, BaseTab } from '@/components/globals/BaseTabs'
import { sendAddToQueue } from '@/utils/downloads'
import { numberWithDots, convertDuration } from '@/utils/utils'

import { formatSingleTrack, formatAlbums, formatArtist, formatPlaylist } from '@/data/search'
import { standardizeData } from '@/data/standardize'
import { useMainSearch } from '@/use/main-search'
import { useSearch } from '@/use/search'

const resetObj = { data: [], next: 0, total: 0, hasLoaded: false }

const lastTab = ref(null)

export default defineComponent({
	components: {
		BaseLoadingPlaceholder,
		BaseTabs,
		BaseTab
	},
	props: {
		performScrolledSearch: {
			type: Boolean,
			required: false
		}
	},
	setup(_, ctx) {
		const state = reactive({
			currentTab: {
				name: '',
				searchType: '',
				component: {},
				viewInfo: '',
				formatFunc: () => {}
			},
			results: {
				query: '',
				allTab: {
					ORDER: [],
					TOP_RESULT: [],
					ALBUM: {
						hasLoaded: false
					},
					ARTIST: {
						hasLoaded: false
					},
					TRACK: {
						hasLoaded: false
					},
					PLAYLIST: {
						hasLoaded: false
					}
				},
				trackTab: { ...resetObj },
				albumTab: { ...resetObj },
				artistTab: { ...resetObj },
				playlistTab: { ...resetObj }
			},
			tabs: [
				{
					name: ctx.root.$i18n.t('globals.listTabs.all'),
					searchType: 'all',
					component: ResultsAll,
					viewInfo: 'allTab'
				},
				{
					name: ctx.root.$i18n.tc('globals.listTabs.track', 2),
					searchType: 'track',
					component: ResultsTracks,
					viewInfo: 'trackTab',
					formatFunc: formatSingleTrack
				},
				{
					name: ctx.root.$i18n.tc('globals.listTabs.album', 2),
					searchType: 'album',
					component: ResultsAlbums,
					viewInfo: 'albumTab',
					formatFunc: formatAlbums
				},
				{
					name: ctx.root.$i18n.tc('globals.listTabs.artist', 2),
					searchType: 'artist',
					component: ResultsArtists,
					viewInfo: 'artistTab',
					formatFunc: formatArtist
				},
				{
					name: ctx.root.$i18n.tc('globals.listTabs.playlist', 2),
					searchType: 'playlist',
					component: ResultsPlaylists,
					viewInfo: 'playlistTab',
					formatFunc: formatPlaylist
				}
			]
		})
		const { searchResult, performMainSearch } = useMainSearch()
		const { result, performSearch } = useSearch()
		const cachedSearchedTerm = computed(() => searchResult.value.QUERY)
		const searchedTerm = computed(() => ctx.root.$route.query.term || cachedSearchedTerm.value)
		const isQueryEmpty = computed(() => state.results.query === '')
		const isSearching = ref(false)
		const isMainSearchCached = computed(() => Object.keys(searchResult.value).length !== 0)
		const isNewSearch = computed(() => cachedSearchedTerm.value !== searchedTerm.value)

		if (isMainSearchCached.value && !isNewSearch.value) {
			onMounted(() => {
				handleMainSearch(searchResult.value)
			})
		}

		if (searchedTerm.value && (!isMainSearchCached.value || isNewSearch.value)) {
			performMainSearch(searchedTerm.value)
			isSearching.value = true
		}

		function handleMainSearch(newValue) {
			// Hide loading placeholder
			isSearching.value = false

			state.results.query = newValue.QUERY

			state.results.allTab = newValue
			state.results.allTab.TRACK.hasLoaded = true
			state.results.allTab.ALBUM.hasLoaded = true
			state.results.allTab.ARTIST.hasLoaded = true
			state.results.allTab.PLAYLIST.hasLoaded = true

			if (lastTab.value && lastTab.value.searchType !== 'all') {
				state.currentTab = lastTab.value

				performSearch({
					term: newValue.QUERY,
					type: state.currentTab.searchType
				})
			} else {
				state.currentTab = state.tabs.find(tab => tab.searchType === 'all')
			}
		}

		// Main search watcher
		watch(searchResult, handleMainSearch)

		// Search watcher
		watch(result, newValue => {
			const { next: nextResult, total, type, data: newData, error } = newValue

			const currentTabKey = `${type}Tab`
			let next = total
			state.results[currentTabKey].error = error

			if (nextResult) {
				next = parseInt(nextResult.match(/index=(\d*)/)[1])
			}

			if (state.results[currentTabKey].total !== total) {
				state.results[currentTabKey].total = total
			}

			if (state.results[currentTabKey].next !== next) {
				state.results[currentTabKey].next = next

				// Preventing duplicate entries by filtering them by ID
				const rawData = state.results[currentTabKey].data.concat(newData)
				const filteredData = uniqWith(rawData, (obj1, obj2) => {
					return obj1.id === obj2.id
				})

				state.results[currentTabKey].data = filteredData
			}

			state.results[currentTabKey].hasLoaded = true
		})

		state.currentTab = state.tabs.find(tab => tab.searchType === 'all')

		return {
			...toRefs(state),
			isSearching,
			isQueryEmpty,
			searchResult,
			performMainSearch,
			performSearch
		}
	},
	computed: {
		loadedTabs() {
			const tabsLoaded = []

			for (const resultKey in this.results) {
				if (this.results.hasOwnProperty(resultKey) && resultKey !== 'query') {
					const currentResult = this.results[resultKey]

					if (currentResult.hasLoaded) {
						tabsLoaded.push(resultKey.replace(/Tab/g, ''))
					}
				}
			}

			return tabsLoaded
		}
	},
	watch: {
		performScrolledSearch(needToSearch) {
			if (!needToSearch) return

			this.scrolledSearch(needToSearch)
		},
		currentTab(newTab) {
			if (this.isTabLoaded(newTab)) return

			this.performSearch({
				term: this.results.query,
				type: newTab.searchType,
				start: this.results[`${newTab.searchType}Tab`].next
			})
		}
	},
	methods: {
		numberWithDots,
		convertDuration,
		addToQueue(e) {
			sendAddToQueue(e.currentTarget.dataset.link)
		},
		getViewInfo() {
			if (this.currentTab.searchType === 'all') {
				return this.results.allTab
			}

			return standardizeData(this.results[this.currentTab.viewInfo], this.currentTab.formatFunc)
		},
		changeSearchTab(tabName) {
			tabName = tabName.toLowerCase()

			const newTab = this.tabs.find(tab => {
				return tab.searchType === tabName
			})

			if (!newTab) {
				console.error(`No tab ${tabName} found`)
				return
			}

			window.scrollTo(0, 0)
			this.currentTab = newTab
			lastTab.value = newTab
		},
		scrolledSearch() {
			if (this.currentTab.searchType === 'all') return

			const currentTabKey = `${this.currentTab.searchType}Tab`
			const needToPerformScrolledSearch = this.results[currentTabKey].next < this.results[currentTabKey].total

			if (needToPerformScrolledSearch) {
				this.performSearch({
					term: this.results.query,
					type: this.currentTab.searchType,
					start: this.results[`${this.currentTab.searchType}Tab`].next
				})
			}
		},
		isTabLoaded(tab) {
			return this.loadedTabs.includes(tab.searchType) || tab.searchType === 'all'
		}
	}
})
</script>

<style></style>
