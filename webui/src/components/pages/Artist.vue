<template>
  <div class="relative fixed-footer image-header">
    <header
      class="flex items-center"
      :style="headerStyle"
    >
      <h1 class="m-0">
        {{ artistName }}
      </h1>

      <div
        class="grid w-16 h-16 ml-auto rounded-full cursor-pointer bg-primary text-grayscale-870 place-items-center"
        aria-label="download"
        role="button"
        :data-cm-link="downloadLink"
        @click.stop="sendAddToQueue(downloadLink)"
      >
        <i
          class="text-4xl material-icons"
          :title="$t('globals.download_hint')"
        >get_app</i>
      </div>
    </header>

    <BaseTabs>
      <BaseTab
        v-for="(item, name) in artistReleases"
        :key="name"
        :class="{ active: currentTab === name }"
        @click="currentTab = name"
      >
        {{ $tc(`globals.listTabs.${name}`, 2) }}
      </BaseTab>
    </BaseTabs>

    <table class="table">
      <thead>
        <tr>
          <th
            v-for="data in head"
            :key="data.title"
            :style="{ width: data.width ? data.width : 'auto' }"
            class="uppercase-first-letter"
            :class="{
              'sort-asc': data.sortKey === sortKey && sortOrder == 'asc',
              'sort-desc': data.sortKey === sortKey && sortOrder == 'desc',
              sortable: data.sortKey,
              clickable: data.sortKey
            }"
            @click="data.sortKey ? sortBy(data.sortKey) : null"
          >
            <!-- Need to change this behaviour for translations -->
            {{ data.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="release in sortedData"
          :key="release.releaseID"
        >
          <router-link
            v-slot="{ navigate }"
            custom
            class="flex items-center clickable"
            :data-cm-link="release.releaseLink"
            :to="{ name: 'Album', params: { id: release.releaseID } }"
          >
            <td
              role="link"
              @click="navigate"
              @keypress.enter="navigate"
            >
              <img
                class="mr-4 rounded coverart"
                :src="release.releaseCover"
                style="width: 56px; height: 56px"
              >
              <i
                v-if="release.isReleaseExplicit"
                class="material-icons title-icon title-icon--explicit"
              >explicit</i>
              <div>
                <span class="flex hover:text-primary">
                  {{ release.releaseTitle }}
                  <i
                    v-if="checkNewRelease(release.releaseDate)"
                    class="material-icons title-icon title-icon--right title-icon--new"
                  >
                    fiber_new
                  </i>
                </span>
                <span
                  v-show="currentTab === 'all'"
                  class="block text-xs opacity-50 uppercase-first-letter"
                >
                  {{ $tc(`globals.listTabs.${release.releaseType}`) }}
                </span>
              </div>
            </td>
          </router-link>
          <td class="w-32 text-center xl:w-40">
            {{ release.releaseDate }}
          </td>
          <td class="w-20 text-center xl:w-32">
            {{ release.releaseTracksNumber }}
          </td>
          <td
            :data-cm-link="release.releaseLink"
            class="w-8 cursor-pointer"
            @click.stop="sendAddToQueue(release.releaseLink)"
          >
            <i
              class="material-icons hover:text-primary"
              :title="$t('globals.download_hint')"
            >file_download</i>
          </td>
        </tr>
      </tbody>
    </table>
    <footer class="bg-background-main">
      <div style="flex-grow: 1;">
        <button
          :data-link="downloadLink+'/discography'"
          class="btn btn-flat"
          @click.stop="sendAddToQueue(downloadLink)"
        >
          {{ `${$t('globals.download', { thing: $t('globals.listTabs.discography') })}` }}
        </button>
      </div>
      <button
        :data-link="downloadLink+'/'+currentTab"
        class="flex items-center btn btn-primary"
        @click.stop="sendAddToQueue(downloadLink+'/'+currentTab)"
      >
        {{ `${$t('globals.download', { thing: $tc(`globals.listTabs.${currentTab}`, 2) })}` }}<i class="ml-2 material-icons">file_download</i>
      </button>
    </footer>
  </div>
</template>

<script>
import { defineComponent, ref, unref, reactive, computed, toRefs } from '@vue/composition-api'
import { orderBy } from 'lodash-es'

import { BaseTabs, BaseTab } from '@/components/globals/BaseTabs'

import { sendAddToQueue } from '@/utils/downloads'
import { checkNewRelease } from '@/utils/dates'
import { formatArtistData, getArtistData } from '@/data/artist'
import { standardizeData } from '@/data/standardize'

export default defineComponent({
	components: {
		BaseTabs,
		BaseTab
	},
	setup(_, ctx) {
		const state = reactive({
			currentTab: '',
			sortKey: 'releaseDate',
			sortOrder: 'desc',
			artistReleases: {},
			artistName: '',
			artistPicture: '',
			currentRelease: computed(() => state.artistReleases[state.currentTab])
		})

		const artistID = computed(() => ctx.root.$router.currentRoute.params.id)
		const hasDataLoaded = ref(false)

		getArtistData(unref(artistID))
			.then(artistData => {
				hasDataLoaded.value = true

				const rawData = {
					data: [artistData],
					hasLoaded: unref(hasDataLoaded)
				}
				const {
					data: [{ artistName, artistPictureXL, artistReleases }]
				} = standardizeData(rawData, formatArtistData)

				Object.assign(state, {
					artistName,
					artistPicture: artistPictureXL,
					artistReleases,
					currentTab: Object.keys(artistReleases)[0]
				})
			})
			.catch(err => console.error(err))

		const sortedData = computed(() => {
			if (!unref(hasDataLoaded)) {
				return []
			}

			let sortKey = state.sortKey

			if (sortKey === 'releaseTracksNumber') {
				sortKey = o => Number(o.releaseTracksNumber)
			}

			return orderBy(state.currentRelease, sortKey, state.sortOrder)
		})

		return {
			...toRefs(state),
			downloadLink: computed(() => `https://www.deezer.com/artist/${unref(artistID)}`),
			headerStyle: computed(() => ({
				backgroundImage: `linear-gradient(to bottom, transparent 0%, var(--main-background) 100%), url(${state.artistPicture})`
			})),
			sortedData,
			sendAddToQueue,
			checkNewRelease
		}
	},
	data() {
		const $t = this.$t.bind(this)
		const $tc = this.$tc.bind(this)

		return {
			head: [
				{ title: $tc('globals.listTabs.title', 1), sortKey: 'releaseTitle' },
				{ title: $t('globals.listTabs.releaseDate'), sortKey: 'releaseDate' },
				{ title: $tc('globals.listTabs.track', 2), sortKey: 'releaseTracksNumber' },
				// { title: '', width: '32px' }
				{ title: '', width: null }
			]
		}
	},
	methods: {
		sortBy(key) {
			if (key === this.sortKey) {
				this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
			} else {
				this.sortKey = key
				this.sortOrder = 'asc'
			}
		}
	}
})
</script>
