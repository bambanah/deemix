import { fetchData } from "@/utils/api-utils.js";
import { defineStore } from "pinia";

interface LoginState {
	arl: string;
	accessToken: string;
	status: number | null;
	user: {
		id: string | null;
		name: string;
		picture: string;
		country?: string;
		can_stream_lossless?: boolean;
		can_stream_hq?: boolean;
	};
	spotifyUser: {
		id: string | null;
		name: string | null;
		picture: string | null;
	};
	spotifyStatus: "enabled" | "disabled";
	clientMode: boolean;
}

export const useLoginStore = defineStore("login", {
	state: (): LoginState => ({
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
	}),
	getters: {
		isLoggedIn: (state) => !!state.arl,
		isLoggedWithSpotify: (state) =>
			!!state.spotifyUser.id && state.spotifyStatus === "enabled",
	},
	actions: {
		login({ status, user, arl }: Pick<LoginState, "status" | "user" | "arl">) {
			this.user = user;
			this.status = status;

			this.setARL(arl);
		},
		logout() {
			localStorage.removeItem("arl");
			localStorage.removeItem("accessToken");

			this.$reset();
		},
		setARL(arl: string, saveOnLocalStorage: boolean = true) {
			this.arl = arl;

			if (saveOnLocalStorage) {
				localStorage.setItem("arl", arl);
			}
		},
		setAccessToken(accessToken: string, saveOnLocalStorage: boolean = true) {
			this.accessToken = accessToken;

			if (saveOnLocalStorage) {
				localStorage.setItem("accessToken", accessToken);
			}
		},
		removeARL() {
			this.arl = "";
			localStorage.removeItem("arl");
		},
		removeAccessToken() {
			this.accessToken = "";
			localStorage.removeItem("accessToken");
		},
		setUser(user: LoginState["user"]) {
			this.user = user;
		},
		setClientMode(clientMode: LoginState["clientMode"]) {
			this.clientMode = clientMode;
		},
		setSpotifyStatus(spotifyStatus: LoginState["spotifyStatus"]) {
			this.spotifyStatus = spotifyStatus;
		},
		setSpotifyUserId(spotifyUserId: LoginState["spotifyUser"]["id"]) {
			this.spotifyUser.id = spotifyUserId;
		},
		async refreshSpotifyStatus() {
			const status = await fetchData("spotifyStatus");
			this.spotifyStatus = status.spotifyEnabled ? "enabled" : "disabled";
		},
	},
});
