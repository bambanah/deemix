<script setup lang="ts">
import CoverContainer from "@/components/globals/CoverContainer.vue";
import { getHomeData } from "@/data/home";
import { pinia } from "@/stores";
import { useLoginStore } from "@/stores/login";
import { sendAddToQueue } from "@/utils/downloads";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const loginStore = useLoginStore(pinia);

const { t } = useI18n();

const playlists = ref([]);
const albums = ref([]);

const isLoggedIn = computed(() => loginStore.isLoggedIn);

function addToQueue(e) {
	sendAddToQueue(e.currentTarget.dataset.link);
}
function initHome(data) {
	const {
		playlists: { data: playlistData },
		albums: { data: albumData },
	} = data;

	playlists.value = playlistData;
	albums.value = albumData;
}

onMounted(async () => {
	const homeData = await getHomeData();

	initHome(homeData);
});
</script>

<template>
	<div id="home_tab">
		<h1 class="mb-8 text-5xl">{{ t("globals.welcome") }}</h1>

		<section
			v-if="!isLoggedIn"
			ref="notLogged"
			class="border-grayscale-500 border-0 border-t border-solid py-6"
		>
			<p id="home_not_logged_text" class="mb-4">{{ t("home.needTologin") }}</p>
			<router-link
				v-slot="{ navigate }"
				custom
				name="button"
				:to="{ name: 'Settings' }"
			>
				<button
					role="link"
					class="btn btn-primary"
					@click="navigate"
					@keypress.enter="() => navigate()"
				>
					{{ t("home.openSettings") }}
				</button>
			</router-link>
		</section>

		<section
			v-if="playlists.length"
			class="border-grayscale-500 border-0 border-t border-solid py-6"
		>
			<h2 class="mb-6 text-3xl">{{ t("home.sections.popularPlaylists") }}</h2>
			<div class="release-grid">
				<router-link
					v-for="release in playlists"
					:key="release.id"
					v-slot="{ navigate }"
					custom
					:to="{ name: 'Playlist', params: { id: release.id } }"
					tabindex="0"
					@keyup.enter="
						$router.push({ name: 'Playlist', params: { id: release.id } })
					"
				>
					<div
						role="link"
						class="release cursor-pointer"
						@click="navigate"
						@keypress.enter="() => navigate()"
					>
						<CoverContainer
							is-rounded
							:cover="release.picture_medium"
							:link="release.link"
							@click.stop="addToQueue"
						/>
						<p class="primary-text">{{ release.title }}</p>
						<p class="secondary-text">
							{{
								`${t("globals.by", { artist: release.user.name })} - ${t(
									"globals.listTabs.trackN",
									release.nb_tracks
								)}`
							}}
						</p>
					</div>
				</router-link>
			</div>
		</section>

		<section
			v-if="albums.length"
			class="border-grayscale-500 border-0 border-t border-solid py-6"
		>
			<h2 class="mb-6 text-3xl">{{ t("home.sections.popularAlbums") }}</h2>
			<div class="release-grid">
				<router-link
					v-for="release in albums"
					:key="release.id"
					v-slot="{ navigate }"
					custom
					:to="{ name: 'Album', params: { id: release.id } }"
					:data-id="release.id"
					tabindex="0"
					@keyup.enter="
						$router.push({ name: 'Album', params: { id: release.id } })
					"
				>
					<div
						role="link"
						class="release cursor-pointer"
						@click="navigate"
						@keypress.enter="() => navigate()"
					>
						<CoverContainer
							is-rounded
							:cover="release.cover_medium"
							:link="release.link"
							@click.stop="addToQueue"
						/>
						<p class="primary-text">{{ release.title }}</p>
						<p class="secondary-text">
							{{ `${t("globals.by", { artist: release.artist.name })}` }}
						</p>
					</div>
				</router-link>
			</div>
		</section>
	</div>
</template>
