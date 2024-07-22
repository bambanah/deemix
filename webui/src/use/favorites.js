import { ref, computed } from '@vue/composition-api'
import store from '@/store'
import { fetchData } from '@/utils/api'
import { toast } from '@/utils/toasts'
import i18n from '@/plugins/i18n'
import { SPOTIFY_STATUS } from '@/constants'

const favoriteArtists = ref([])
const favoriteAlbums = ref([])
const favoriteSpotifyPlaylists = ref([])
const favoritePlaylists = ref([])
const favoriteTracks = ref([])
const lovedTracksPlaylist = ref('')
const isLoggedWithSpotify = computed(() => store.getters.isLoggedWithSpotify)

const isRefreshingFavorites = ref(false)

const setAllFavorites = data => {
  const { tracks, albums, artists, playlists, lovedTracks } = data

  isRefreshingFavorites.value = false
  favoriteArtists.value = artists || []
  favoriteAlbums.value = albums || []
  favoritePlaylists.value = playlists || []
  favoriteTracks.value = tracks || []
  lovedTracksPlaylist.value = lovedTracks || []
}

const setSpotifyPlaylists = response => {
  if (response.error) {
    favoriteSpotifyPlaylists.value = []
    switch (response.error) {
      case 'spotifyNotEnabled':
        store.dispatch('setSpotifyStatus', SPOTIFY_STATUS.DISABLED).catch(console.error)
        break
      case 'wrongSpotifyUsername':
        toast(i18n.t('toasts.wrongSpotifyUsername', { username: response.username }), 'person_off')
        break
      default:
        break
    }
    return
  }

  favoriteSpotifyPlaylists.value = response || []
}

const refreshFavorites = async () => {
  isRefreshingFavorites.value = true

  await store.dispatch('refreshSpotifyStatus')

  fetchData('getUserFavorites').then(setAllFavorites).catch(console.error)

  if (isLoggedWithSpotify.value) {
    const spotifyUser = store.getters.getSpotifyUser.id

    fetchData('getUserSpotifyPlaylists', { spotifyUser }).then(setSpotifyPlaylists).catch(console.error)
  } else {
    favoriteSpotifyPlaylists.value = []
  }
}

export const useFavorites = () => ({
  favoriteArtists,
  favoriteAlbums,
  favoriteSpotifyPlaylists,
  favoritePlaylists,
  favoriteTracks,
  lovedTracksPlaylist,
  isRefreshingFavorites,
  refreshFavorites
})
