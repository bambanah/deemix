import type { Module } from "vuex";

interface ErrorState {
	artist: string;
	bitrate: string;
	cover: string;
	downloaded: number;
	errors: any[];
	failed: number;
	id: string;
	progress: number;
	silent: boolean;
	size: number;
	title: string;
	type: string;
	uuid: string;
}

const state = (): ErrorState => ({
	artist: "",
	bitrate: "",
	cover: "",
	downloaded: 0,
	errors: [],
	failed: 0,
	id: "",
	progress: 0,
	silent: true,
	size: 0,
	title: "",
	type: "",
	uuid: "",
});

const actions: Module<ErrorState, any>["actions"] = {
	setErrors({ commit }, payload) {
		commit("SET_ERRORS", payload);
	},
};

const getters: Module<ErrorState, any>["getters"] = {
	getErrors: (state) => state,
};

const mutations: Module<ErrorState, any>["mutations"] = {
	SET_ERRORS(state, payload) {
		Object.assign(state, payload);
	},
};

export default {
	state,
	getters,
	actions,
	mutations,
};
