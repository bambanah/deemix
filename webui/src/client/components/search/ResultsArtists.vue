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
				<h1 class="text-center">{{ t("search.noResultsArtist") }}</h1>
			</div>

			<div v-else class="release-grid">
				<div
					v-for="release in viewInfo.data.slice(0, itemsToShow)"
					:key="release.artistID"
					class="release w-40"
				>
					<router-link
						v-slot="{ navigate }"
						custom
						:to="{ name: 'Artist', params: { id: release.artistID } }"
					>
						<div role="link" class="cursor-pointer" @click="navigate">
							<CoverContainer
								is-circle
								:cover="release.artistPictureMedium"
								:link="release.artistLink"
								@click.stop="$emit('add-to-queue', $event)"
							/>

							<span class="primary-text">
								{{ release.artistName }}
							</span>
						</div>
					</router-link>

					<!-- TODO Fix, depending on the tab there are albums number or fans number -->
					<!-- <p class="secondary-text">{{ t('globals.listTabs.releaseN', release.artistAlbumsNumber) }}</p> -->
				</div>
			</div>
		</template>
	</section>
</template>
