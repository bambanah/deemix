import {
	getInitialPreviewVolume,
	checkInitialSlimDownloads,
	checkInitialSlimSidebar,
	checkInitialShowBitrateTags,
	checkInitialShowSearchButton,
} from "@/data/settings";
import type { Module } from "vuex";

interface AppInfoState {
	currentCommit: string | null;
	latestCommit: string | null;
	updateAvailable: boolean;
	deemixVersion: string | null;
	previewVolume: number;
	hasSlimDownloads: boolean;
	hasSlimSidebar: boolean;
	showBitrateTags: boolean;
	showSearchButton: boolean;
}

const state = (): AppInfoState => ({
	currentCommit: null,
	latestCommit: null,
	updateAvailable: false,
	deemixVersion: null,
	previewVolume: getInitialPreviewVolume(),
	hasSlimDownloads: checkInitialSlimDownloads(),
	hasSlimSidebar: checkInitialSlimSidebar(),
	showBitrateTags: checkInitialShowBitrateTags(),
	showSearchButton: checkInitialShowSearchButton(),
});

const actions: Module<AppInfoState, any>["actions"] = {
	setAppInfo({ commit }, payload: AppInfoState) {
		commit("SET_CURRENT_COMMIT", payload.currentCommit);
		commit("SET_DEEMIX_VERSION", payload.deemixVersion);
	},
	setUpdateInfo({ commit }, payload: AppInfoState) {
		commit("SET_LATEST_COMMIT", payload.latestCommit);
		commit("SET_UPDATE_AVAILABLE", payload.updateAvailable);
	},
	setPreviewVolume({ commit }, payload: AppInfoState) {
		commit("SET_PREVIEW_VOLUME", payload);
		localStorage.setItem("previewVolume", payload.toString());
	},
	setSlimDownloads({ commit }, payload: AppInfoState) {
		commit("SET_SLIM_DOWNLOADS", payload);
		localStorage.setItem("slimDownloads", payload.toString());
	},
	setSlimSidebar({ commit }, payload: AppInfoState["hasSlimSidebar"]) {
		commit("SET_SLIM_SIDEBAR", payload);
		localStorage.setItem("slimSidebar", payload.toString());

		// Moves all toast messages when the option changes
		Array.from(document.getElementsByClassName("toastify")).forEach((toast) => {
			(toast as HTMLElement).style.transform = `translate(${
				payload ? "3rem" : "14rem"
			}, 0)`;
		});
	},
	setShowBitrateTags({ commit }, payload: AppInfoState["showBitrateTags"]) {
		commit("SET_SHOW_BITRATE_TAGS", payload);
		localStorage.setItem("showBitrateTags", payload.toString());
	},
	setShowSearchButton({ commit }, payload: AppInfoState["showBitrateTags"]) {
		commit("SET_SHOW_SEARCH_BUTTON", payload);
		localStorage.setItem("showSearchButton", payload.toString());
	},
};

const getters: Module<AppInfoState, unknown>["getters"] = {
	getAppInfo: (state) => state,
	getPreviewVolume: (state) => state.previewVolume,
	getSlimDownloads: (state) => state.hasSlimDownloads,
	getSlimSidebar: (state) => state.hasSlimSidebar,
	getShowBitrateTags: (state) => state.showBitrateTags,
	getShowSearchButton: (state) => state.showSearchButton,
};

const mutations: Module<AppInfoState, unknown>["mutations"] = {
	SET_CURRENT_COMMIT(state, payload: AppInfoState["currentCommit"]) {
		state.currentCommit = payload;
	},
	SET_LATEST_COMMIT(state, payload: AppInfoState["latestCommit"]) {
		state.latestCommit = payload;
	},
	SET_UPDATE_AVAILABLE(state, payload: AppInfoState["updateAvailable"]) {
		state.updateAvailable = payload;
	},
	SET_DEEMIX_VERSION(state, payload: AppInfoState["deemixVersion"]) {
		state.deemixVersion = payload;
	},
	SET_PREVIEW_VOLUME(state, payload: AppInfoState["previewVolume"]) {
		state.previewVolume = payload;
	},
	SET_SLIM_DOWNLOADS(state, payload: AppInfoState["hasSlimDownloads"]) {
		state.hasSlimDownloads = payload;
	},
	SET_SLIM_SIDEBAR(state, payload: AppInfoState["hasSlimSidebar"]) {
		state.hasSlimSidebar = payload;
	},
	HOW_BITRATE_TAGS(state, payload: AppInfoState["showBitrateTags"]) {
		state.showBitrateTags = payload;
	},
	SET_SHOW_SEARCH_BUTTON(state, payload: AppInfoState["showSearchButton"]) {
		state.showSearchButton = payload;
	},
};

export default {
	state,
	getters,
	actions,
	mutations,
};
