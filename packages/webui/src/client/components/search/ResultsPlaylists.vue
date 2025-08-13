<script setup lang="ts">
import BaseLoadingPlaceholder from "@/components/globals/BaseLoadingPlaceholder.vue";
import CoverContainer from "@/components/globals/CoverContainer.vue";
import ResultsError from "@/components/search/ResultsError.vue";
import { useI18n } from "vue-i18n";

interface Props {
	viewInfo: {
		error: string;
		data: any[];
		hasLoaded: boolean;
	};
	itemsToShow?: number;
	wantHeaders?: boolean;
}

const { viewInfo, itemsToShow = 6 } = defineProps<Props>();

const { t } = useI18n();
</script>

<template>
	<section>
		<BaseLoadingPlaceholder v-if="!viewInfo?.hasLoaded" />

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
							@keypress.enter="() => navigate()"
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
