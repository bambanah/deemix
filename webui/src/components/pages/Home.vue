<template>
	<div id="home_tab">
		<h1 class="mb-8 text-5xl">{{ $t('globals.welcome') }}</h1>
		Version published 02/08/2024, see About section for changelog.
		<section v-if="!isLoggedIn" ref="notLogged" class="py-6 border-0 border-t border-solid border-grayscale-500">
			<p id="home_not_logged_text" class="mb-4">{{ $t('home.needTologin') }}</p>
			<router-link custom v-slot="{ navigate }" class="btn btn-primary" name="button" :to="{ name: 'Settings' }">
				<button @click="navigate" @keypress.enter="navigate" role="link">{{ $t('home.openSettings') }}</button>
			</router-link>
		</section>

		<section v-if="playlists.length" class="py-6 border-0 border-t border-solid border-grayscale-500">
			<h2 class="mb-6 text-3xl">{{ $t('home.sections.popularPlaylists') }}</h2>
			<div class="release-grid">
				<router-link
					v-for="release in playlists"
					:key="release.id"
					custom
					v-slot="{ navigate }"
					class="release clickable"
					:to="{ name: 'Playlist', params: { id: release.id } }"
					tabindex="0"
					@keyup.enter.native="$router.push({ name: 'Playlist', params: { id: release.id } })"
				>
					<div @click="navigate" @keypress.enter="navigate" role="link">
						<CoverContainer is-rounded :cover="release.picture_medium" :link="release.link" @click.stop="addToQueue" />
						<p class="primary-text">{{ release.title }}</p>
						<p class="secondary-text">
							{{
								`${$t('globals.by', { artist: release.user.name })} - ${$tc(
									'globals.listTabs.trackN',
									release.nb_tracks
								)}`
							}}
						</p>
					</div>
				</router-link>
			</div>
		</section>

		<section v-if="albums.length" class="py-6 border-0 border-t border-solid border-grayscale-500">
			<h2 class="mb-6 text-3xl">{{ $t('home.sections.popularAlbums') }}</h2>
			<div class="release-grid">
				<router-link
					v-for="release in albums"
					:key="release.id"
					custom
					v-slot="{ navigate }"
					class="release clickable"
					:to="{ name: 'Album', params: { id: release.id } }"
					:data-id="release.id"
					tabindex="0"
					@keyup.enter.native="$router.push({ name: 'Album', params: { id: release.id } })"
				>
					<div @click="navigate" @keypress.enter="navigate" role="link">
						<CoverContainer is-rounded :cover="release.cover_medium" :link="release.link" @click.stop="addToQueue" />
						<p class="primary-text">{{ release.title }}</p>
						<p class="secondary-text">{{ `${$t('globals.by', { artist: release.artist.name })}` }}</p>
					</div>
				</router-link>
			</div>
		</section>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

import { sendAddToQueue } from '@/utils/downloads'
import { getHomeData } from '@/data/home'

import CoverContainer from '@/components/globals/CoverContainer.vue'

export default {
	components: {
		CoverContainer
	},
	data() {
		return {
			playlists: [],
			albums: []
		}
	},
	computed: {
		...mapGetters(['isLoggedIn'])
	},
	async created() {
		const homeData = await getHomeData()

		this.initHome(homeData)
	},
	methods: {
		addToQueue(e) {
			sendAddToQueue(e.currentTarget.dataset.link)
		},
		initHome(data) {
			const {
				playlists: { data: playlistData },
				albums: { data: albumData }
			} = data

			this.playlists = playlistData
			this.albums = albumData
		}
	}
}
</script>

<style></style>
