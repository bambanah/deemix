<template>
	<section>
		<BaseLoadingPlaceholder v-if="isLoading" />

		<template v-else>
			<ResultsError v-if="viewInfo.error" :error="viewInfo.error"></ResultsError>
			<div v-else-if="viewInfo.data.length === 0">
				<h1 class="text-center">{{ $t('search.noResultsTrack') }}</h1>
			</div>

			<table v-else class="table w-full table--tracks">
				<thead v-if="wantHeaders">
					<tr class="capitalize">
						<th class="h-12 pb-3" colspan="2">{{ $tc('globals.listTabs.title', 1) }}</th>
						<th class="h-12 pb-3">{{ $tc('globals.listTabs.artist', 1) }}</th>
						<th class="h-12 pb-3">{{ $tc('globals.listTabs.album', 1) }}</th>
						<th class="h-12 pb-3">
							<i class="material-icons">timer</i>
						</th>
						<th class="h-12 pb-3" style="width: 3.5rem"></th>
					</tr>
				</thead>

				<tbody>
					<tr v-for="track in viewInfo.data.slice(0, itemsToShow)" :key="track.trackLink">
						<td class="table__icon table__icon--big">
							<span
								class="relative inline-block rounded cursor-pointer"
								:data-preview="track.trackPreview"
								@click="playPausePreview($event)"
							>
								<PreviewControls v-if="track.trackPreview" />

								<img class="rounded coverart" :src="track.albumPicture" />
							</span>
						</td>

						<td class="table__cell table__cell--large">
							<div class="break-words table__cell-content table__cell-content--vertical-center">
								<i v-if="track.isTrackExplicit" class="material-icons title-icon">explicit</i>
								{{ formatTitle(track) }}
							</div>
						</td>

						<router-link
							custom
							v-slot="{ navigate }"
							class="break-words table__cell table__cell--medium table__cell--center"
							:to="{ name: 'Artist', params: { id: track.artistID } }"
						>
							<td @click="navigate" @keypress.enter="navigate" role="link">
								<span class="cursor-pointer hover:underline">
									{{ track.artistName }}
								</span>
							</td>
						</router-link>

						<router-link
							custom
							v-slot="{ navigate }"
							class="break-words table__cell table__cell--medium table__cell--center"
							:to="{ name: 'Album', params: { id: track.albumID } }"
						>
							<td @click="navigate" @keypress.enter="navigate" role="link">
								<span class="cursor-pointer hover:underline">
									{{ track.albumTitle }}
								</span>
							</td>
						</router-link>

						<td class="table__cell table__cell--small table__cell--center">
							{{ convertDuration(track.trackDuration) }}
						</td>

						<td
							class="cursor-pointer table__cell--center group"
							:data-link="track.trackLink"
							aria-label="download"
							@click.stop="$emit('add-to-queue', $event)"
						>
							<i
								class="transition-colors duration-150 ease-in-out material-icons group-hover:text-primary"
								:title="$t('globals.download_hint')"
							>
								get_app
							</i>
						</td>
					</tr>
				</tbody>
			</table>
		</template>
	</section>
</template>

<script>
import BaseLoadingPlaceholder from '@/components/globals/BaseLoadingPlaceholder.vue'
import PreviewControls from '@/components/globals/PreviewControls.vue'
import ResultsError from '@/components/search/ResultsError.vue'
import { playPausePreview } from '@/components/globals/TheTrackPreview.vue'

import { convertDuration } from '@/utils/utils'

import { formatTitle } from '@/data/search'

export default {
	components: {
		BaseLoadingPlaceholder,
		PreviewControls,
		ResultsError
	},
	props: {
		viewInfo: {
			validator(value) {
				const isNull = Object.is(value, null)
				const isObject = Object.prototype.toString.call(value) === '[object Object]'

				return isNull || isObject
			},
			required: true
		},
		itemsToShow: {
			type: Number,
			default: 6
		},
		wantHeaders: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	computed: {
		isLoading() {
			return !this.viewInfo || !this.viewInfo.hasLoaded
		}
	},
	methods: {
		convertDuration,
		formatTitle,
		playPausePreview
	}
}
</script>
