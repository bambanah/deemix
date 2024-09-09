<template>
	<section>
		<BaseLoadingPlaceholder v-if="isLoading" />

		<template v-else>
			<ResultsError
				v-if="viewInfo.error"
				:error="viewInfo.error"
			></ResultsError>
			<div v-else-if="viewInfo.data.length === 0">
				<h1 class="text-center">{{ t("search.noResultsPlaylist") }}</h1>
			</div>
			<div v-else class="release-grid">
				<div
					v-for="playlist in viewInfo.data.slice(0, itemsToShow)"
					:key="playlist.playlistID"
					class="release w-40"
				>
					<router-link
						v-slot="{ navigate }"
						custom
						:to="{ name: 'Playlist', params: { id: playlist.playlistID } }"
					>
						<div
							role="link"
							class="cursor-pointer"
							@click="navigate"
							@keypress.enter="navigate"
						>
							<CoverContainer
								is-rounded
								:cover="playlist.playlistPictureMedium"
								:link="playlist.playlistLink"
								@click.stop="$emit('add-to-queue', $event)"
							/>

							<span class="primary-text">
								{{ playlist.playlistTitle }}
							</span>
						</div>
					</router-link>

					<p class="secondary-text">
						{{
							`${t("globals.by", { artist: playlist.artistName })} - ${t(
								"globals.listTabs.trackN",
								playlist.playlistTracksNumber
							)}`
						}}
					</p>
				</div>
			</div>
		</template>
	</section>
</template>

<script>
import BaseLoadingPlaceholder from "@/components/globals/BaseLoadingPlaceholder.vue";
import CoverContainer from "@/components/globals/CoverContainer.vue";
import ResultsError from "@/components/search/ResultsError.vue";
import { useI18n } from "vue-i18n";

export default {
	components: {
		BaseLoadingPlaceholder,
		CoverContainer,
		ResultsError,
	},
	props: {
		viewInfo: {
			validator(value) {
				const isNull = Object.is(value, null);
				const isObject =
					Object.prototype.toString.call(value) === "[object Object]";

				return isNull || isObject;
			},
			required: true,
		},
		itemsToShow: {
			type: Number,
			default: 6,
		},
		wantHeaders: {
			type: Boolean,
			required: false,
			default: false,
		},
	},
	setup() {
		const { t } = useI18n();
		return { t };
	},
	computed: {
		isLoading() {
			return !this.viewInfo || !this.viewInfo.hasLoaded;
		},
	},
};
</script>
