import { fetchData } from "@/utils/api";
import EventBus from "@/utils/EventBus";
import {
	createRouter,
	createWebHistory,
	type RouteComponent,
	type RouteRecordRaw,
} from "vue-router";

// Pages
import About from "@/components/pages/About.vue";
import Artist from "@/components/pages/Artist.vue";
import Charts from "@/components/pages/Charts.vue";
import Errors from "@/components/pages/Errors.vue";
import Favorites from "@/components/pages/Favorites.vue";
import Home from "@/components/pages/Home.vue";
import InfoArl from "@/components/pages/InfoArl.vue";
import InfoSpotifyFeatures from "@/components/pages/InfoSpotifyFeatures.vue";
import LinkAnalyzer from "@/components/pages/LinkAnalyzer.vue";
import Search from "@/components/pages/Search.vue";
import Settings from "@/components/pages/Settings.vue";
import Tracklist from "@/components/pages/Tracklist.vue";

const routes: RouteRecordRaw[] = [
	{
		path: "/",
		name: "Home",
		component: Home,
		meta: {
			notKeepAlive: true,
		},
	},
	{
		path: "/tracklist/:type/:id",
		name: "Tracklist",
		component: Tracklist,
	},
	{
		path: "/artist/:id",
		name: "Artist",
		component: Artist,
		meta: {
			notKeepAlive: true,
		},
	},
	{
		path: "/album/:id",
		name: "Album",
		component: Tracklist,
	},
	{
		path: "/playlist/:id",
		name: "Playlist",
		component: Tracklist,
	},
	{
		path: "/spotify-playlist/:id",
		name: "Spotify Playlist",
		component: Tracklist,
	},
	{
		path: "/charts",
		name: "Charts",
		component: Charts,
		meta: {
			notKeepAlive: true,
		},
	},
	{
		path: "/favorites",
		name: "Favorites",
		component: Favorites,
		meta: {
			notKeepAlive: true,
		},
	},
	{
		path: "/errors",
		name: "Errors",
		component: Errors,
	},
	{
		path: "/link-analyzer",
		name: "Link Analyzer",
		component: LinkAnalyzer,
	},
	{
		path: "/about",
		name: "About",
		component: About,
	},
	{
		path: "/info-arl",
		name: "ARL",
		component: InfoArl,
	},
	{
		path: "/info-spotify",
		name: "Spotify Features",
		component: InfoSpotifyFeatures,
	},
	{
		path: "/settings",
		name: "Settings",
		component: Settings,
	},
	{
		path: "/search",
		name: "Search",
		component: Search,
		meta: {
			notKeepAlive: true,
		},
	},
	// 404 client side
	{
		path: "/",
		component: Home,
	},
];

const router = createRouter({
	history: createWebHistory(location.base),
	routes,
	scrollBehavior() {
		return { left: 0, right: 0 };
	},
});

router.beforeEach((to, _, next) => {
	if (to.name && to.name !== "Home") {
		document.title = to.name.toString() + " · Deemix";
	} else {
		document.title = "Deemix";
	}

	switch (to.name) {
		case "Tracklist": {
			// const getTracklistParams = {
			// 	type: to.params.type,
			// 	id: to.params.id
			// }
			console.warn("This should never happen.");
			break;
		}
		case "Album": {
			const getTracklistParams = {
				type: "album",
				id: to.params.id,
			};
			fetchData("getTracklist", getTracklistParams).then((albumData) => {
				EventBus.$emit("showAlbum", albumData);
			});
			break;
		}
		case "Playlist": {
			const getTracklistParams = {
				type: "playlist",
				id: to.params.id,
			};
			fetchData("getTracklist", getTracklistParams).then((playlistData) => {
				EventBus.$emit("showPlaylist", playlistData);
			});
			break;
		}
		case "Spotify Playlist": {
			const getTracklistParams = {
				type: "spotifyplaylist",
				id: to.params.id,
			};
			fetchData("getTracklist", getTracklistParams).then(
				(spotifyPlaylistData) => {
					EventBus.$emit("showSpotifyPlaylist", spotifyPlaylistData);
				}
			);
			break;
		}

		default:
			break;
	}

	next();
});

export default router;
