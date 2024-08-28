import { fetchData } from "@/utils/api";
import type { Module } from "vuex";

interface LoginState {
	arl: string;
	accessToken: string;
	status: string | null;
	user: {
		id: string | null;
		name: string;
		picture: string;
	};
	spotifyUser: {
		id: string | null;
		name: string | null;
		picture: string | null;
	};
	spotifyStatus: "enabled" | "disabled";
	clientMode: boolean;
}

const getDefaultState = (): LoginState => ({
	arl: localStorage.getItem("arl") || "",
	accessToken: localStorage.getItem("accessToken") || "",
	status: null,
	user: {
		id: null,
		name: "",
		picture: "",
	},
	spotifyUser: {
		id: localStorage.getItem("spotifyUser"),
		name: null,
		picture: null,
	},
	// This does not always represent the truth because the status update on the server is async
	// and at the moment there's no way to notice the status change. Therefore a fetch of the status
	// is needed everytime we need to use it
	spotifyStatus: "disabled",
	clientMode: false,
});

const state = () => {
	return getDefaultState();
};

const actions: Module<LoginState, unknown>["actions"] = {
	login({ commit, dispatch }, payload) {
		const { arl, user, status } = payload;

		dispatch("setARL", { arl });
		commit("SET_USER", user);
		commit("SET_STATUS", status);
	},
	logout({ commit }) {
		localStorage.removeItem("arl");
		localStorage.removeItem("accessToken");

		commit("RESET_LOGIN");
	},
	setARL({ commit }, payload) {
		let { saveOnLocalStorage } = payload;
		const { arl } = payload;

		saveOnLocalStorage =
			typeof saveOnLocalStorage === "undefined" ? true : saveOnLocalStorage;

		commit("SET_ARL", arl);

		if (saveOnLocalStorage) {
			localStorage.setItem("arl", arl);
		}
	},
	setAccessToken({ commit }, payload) {
		let { saveOnLocalStorage } = payload;
		const { accessToken } = payload;

		saveOnLocalStorage =
			typeof saveOnLocalStorage === "undefined" ? true : saveOnLocalStorage;

		commit("SET_ACCESS_TOKEN", accessToken);

		if (saveOnLocalStorage) {
			localStorage.setItem("accessToken", accessToken);
		}
	},
	removeARL({ commit }) {
		commit("SET_ARL", "");

		localStorage.removeItem("arl");
	},
	removeAccessToken({ commit }) {
		commit("SET_ACCESS_TOKEN", "");

		localStorage.removeItem("accessToken");
	},
	setUser({ commit }, payload) {
		commit("SET_USER", payload);
	},
	setClientMode({ commit }, payload) {
		commit("SET_CLIENT_MODE", payload);
	},
	setSpotifyStatus({ commit }, newSpotifyStatus: LoginState["spotifyStatus"]) {
		commit("SET_SPOTIFY_STATUS", newSpotifyStatus);
	},
	setSpotifyUserId({ commit }, newSpotifyUserId) {
		commit("SET_SPOTIFY_USER_ID", newSpotifyUserId);
	},
	/**
	 * Returning a Promise so that who calls this action is sure that
	 * the fetching is complete after the statement
	 *
	 * @example
	 * await store.dispatch('refreshSpotifyStatus')
	 * // From here the status is refreshed
	 */
	refreshSpotifyStatus({ commit }) {
		return fetchData("spotifyStatus").then((response) => {
			commit(
				"SET_SPOTIFY_STATUS",
				response.spotifyEnabled ? "enabled" : "disabled"
			);
		});
	},
};

const getters: Module<LoginState, unknown>["getters"] = {
	getARL: (state) => state.arl,
	getAccessToken: (state) => state.accessToken,
	getUser: (state) => state.user,
	getSpotifyUser: (state) => state.spotifyUser,
	getClientMode: (state) => state.clientMode,

	isLoggedIn: (state) => !!state.arl,
	isLoggedWithSpotify: (state) =>
		!!state.spotifyUser.id && state.spotifyStatus === "enabled",
};

const mutations: Module<LoginState, unknown>["mutations"] = {
	SET_ARL(state, payload: LoginState["arl"]) {
		state.arl = payload;
	},
	SET_ACCESS_TOKEN(state, payload: LoginState["accessToken"]) {
		state.accessToken = payload;
	},
	SET_STATUS(state, payload: LoginState["status"]) {
		state.status = payload;
	},
	SET_USER(state, payload: LoginState["user"]) {
		state.user = payload;
	},
	SET_CLIENT_MODE(state, payload: LoginState["clientMode"]) {
		state.clientMode = payload;
	},
	RESET_LOGIN(state) {
		// Needed for reactivity
		const clientMode = state.clientMode;
		Object.assign(state, getDefaultState());
		state.clientMode = clientMode;
	},
	SET_SPOTIFY_STATUS(state, newSpotifyStatus: LoginState["spotifyStatus"]) {
		state.spotifyStatus = newSpotifyStatus;
	},
	SET_SPOTIFY_USER_ID(
		state,
		newSpotifyUserId: LoginState["spotifyUser"]["id"]
	) {
		state.spotifyUser = {
			...state.spotifyUser,
			id: newSpotifyUserId,
		};
	},
};

export default {
	state,
	getters,
	actions,
	mutations,
};
