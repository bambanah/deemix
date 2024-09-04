import { ref, computed } from "vue";

import { fetchData } from "@/utils/api-utils";
import { toast } from "@/utils/toasts";
import i18n from "@/plugins/i18n";
import { useLoginStore } from "@/stores/login";
import { pinia } from "@/stores";

const loginStore = useLoginStore(pinia);

const favoriteArtists = ref([]);
const favoriteAlbums = ref([]);
const favoriteSpotifyPlaylists = ref([]);
const favoritePlaylists = ref([]);
const favoriteTracks = ref([]);
const lovedTracksPlaylist = ref("");
const isLoggedWithSpotify = computed(() => loginStore.isLoggedWithSpotify);

const isRefreshingFavorites = ref(false);

const setAllFavorites = (data) => {
	const { tracks, albums, artists, playlists, lovedTracks } = data;

	isRefreshingFavorites.value = false;

	favoriteArtists.value = artists || [];
	favoriteAlbums.value = albums || [];
	favoritePlaylists.value = playlists || [];
	favoriteTracks.value = tracks || [];
	lovedTracksPlaylist.value = lovedTracks || [];
};

const setSpotifyPlaylists = (response) => {
	if (response.error) {
		favoriteSpotifyPlaylists.value = [];
		switch (response.error) {
			case "spotifyNotEnabled":
				loginStore.setSpotifyStatus("disabled");
				break;
			case "wrongSpotifyUsername":
				toast(
					i18n.t("toasts.wrongSpotifyUsername", {
						username: response.username,
					}),
					"person_off"
				);
				break;
			default:
				break;
		}
		return;
	}

	favoriteSpotifyPlaylists.value = response || [];
};

const refreshFavorites = async ({ isInitial = false }) => {
	if (!isInitial) {
		isRefreshingFavorites.value = true;
	}

	await loginStore.refreshSpotifyStatus();

	fetchData("getUserFavorites").then(setAllFavorites).catch(console.error);

	if (isLoggedWithSpotify.value) {
		const spotifyUser = loginStore.spotifyUser.id;

		fetchData("getUserSpotifyPlaylists", { spotifyUser })
			.then(setSpotifyPlaylists)
			.catch(console.error);
	} else {
		favoriteSpotifyPlaylists.value = [];
	}
};

export const useFavorites = () => ({
	favoriteArtists,
	favoriteAlbums,
	favoriteSpotifyPlaylists,
	favoritePlaylists,
	favoriteTracks,
	lovedTracksPlaylist,
	isRefreshingFavorites,
	refreshFavorites,
});
