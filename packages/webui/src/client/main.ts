import { useAppInfoStore } from "@/stores/appInfo";
import { useLoginStore } from "@/stores/login";
import { fetchData, postToServer } from "@/utils/api-utils";
import { sendAddToQueue } from "@/utils/downloads";
import { socket } from "@/utils/socket";
import { toast } from "@/utils/toasts";
import { isValidURL } from "@/utils/utils";
import { createApp } from "vue";
import { pinia } from "./stores";

import App from "@/App.vue";
import i18n from "@/plugins/i18n";
import router from "@/router";

import "@/styles/css/global.css";

import "@/styles/vendor/material-icons.css";
import "@/styles/vendor/OpenSans.css";

/* ===== Random utils ===== */

String.prototype.capitalize = function () {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

location.base = "/";

/* ===== App initialization ===== */
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(i18n);

app.mount("#app");

async function startApp() {
	const connectResponse = await fetchData("connect");
	const spotifyStatus = connectResponse.spotifyEnabled ? "enabled" : "disabled";

	if (connectResponse.deezerAvailable === "no-network") {
		document.getElementById("deezer_not_reachable")?.classList.remove("hide");
	}
	if (connectResponse.deezerAvailable === "no") {
		document.getElementById("deezer_not_available")?.classList.remove("hide");
	}

	const appInfoStore = useAppInfoStore(pinia);
	const loginStore = useLoginStore(pinia);

	appInfoStore.setAppInfo(connectResponse.update);
	loginStore.setSpotifyStatus(spotifyStatus);

	let arl = localStorage.getItem("arl");
	let accessToken = localStorage.getItem("accessToken");

	if (connectResponse.singleUser) {
		if (connectResponse.singleUser.arl) arl = connectResponse.singleUser.arl;
		if (connectResponse.singleUser.accessToken)
			accessToken = connectResponse.singleUser.accessToken;
	}

	if (connectResponse.autologin) {
		const accountNum = localStorage.getItem("accountNum");

		async function login(arl: string, accountNum: number) {
			toast(i18n.global.t("toasts.loggingIn"), "loading", false, "login-toast");
			arl = arl.trim();
			let result;

			if (accountNum !== 0) {
				result = await postToServer("loginArl", {
					arl,
					force: true,
					child: accountNum || 0,
				});
			} else {
				result = await postToServer("loginArl", { arl });
			}

			return result;
		}

		if (arl) {
			let result = await login(arl, Number(accountNum));
			if (result.status === 0 && accessToken) {
				const { arl: newArl } = await postToServer("loginWithCredentials", {
					accessToken,
				});
				if (newArl && newArl !== arl) {
					arl = newArl;
					loginStore.setARL(arl);
				}
				result = await login(newArl, Number(accountNum));
			}
			loggedIn(result);
		}
	} else {
		loggedIn({ status: 3, user: connectResponse.currentUser, arl });
	}

	if (connectResponse.checkForUpdates) {
		const updates = await fetchData("checkForUpdates");
		appInfoStore.setUpdateInfo(updates);

		if (updates.updateAvailable) {
			toast(
				i18n.global.t("toasts.updateAvailable"),
				"browser_updated",
				true,
				"updates-toast"
			);
		}
	}
}

function initClient() {
	const loginStore = useLoginStore(pinia);
	loginStore.setClientMode(true);
	setClientModeKeyBindings();
}

document.addEventListener("DOMContentLoaded", startApp);
if (window.api) {
	initClient();
}

/* ===== Global shortcuts ===== */

document.addEventListener("paste", (pasteEvent: ClipboardEvent) => {
	const target = pasteEvent.target as HTMLElement;
	if (target?.tagName.toLowerCase() === "input") return;

	let pastedText = pasteEvent.clipboardData?.getData("Text");

	if (!pastedText) return;

	if (isValidURL(pastedText)) {
		if (router.currentRoute.value.name === "Link Analyzer") {
			socket.emit("analyzeLink", pastedText);
		} else {
			if (pastedText.includes("\n"))
				pastedText = pastedText.replace(/\n/g, ";");
			sendAddToQueue(pastedText);
		}
	} else {
		const searchbar: HTMLInputElement | null =
			document.querySelector("#searchbar");
		searchbar?.select();
		searchbar?.setSelectionRange(0, 99999);
	}
});

/**
 * Sets up key bindings that already work in the browser (server mode)
 */
function setClientModeKeyBindings() {
	document.addEventListener("keyup", (keyEvent) => {
		// ALT + left
		if (keyEvent.altKey && keyEvent.key === "ArrowLeft") {
			router.back();
		}

		// ALT + right
		if (keyEvent.altKey && keyEvent.key === "ArrowRight") {
			router.forward();
		}
	});
}

function loggedIn(data: { status: number; user: any; arl: string | null }) {
	const { status, user } = data;
	const loginStore = useLoginStore(pinia);

	switch (status) {
		case 1:
		case 3:
			// Login ok
			toast(i18n.global.t("toasts.loggedIn"), "done", true, "login-toast");

			loginStore.login(data);
			break;
		case 2:
			// Already logged in
			toast(i18n.global.t("toasts.alreadyLogged"), "done", true, "login-toast");

			loginStore.setUser(user);
			break;
		case 0:
			// Login failed
			toast(i18n.global.t("toasts.loginFailed"), "close", true, "login-toast");

			loginStore.removeARL();
			break;
		case -1:
			toast(
				i18n.global.t("toasts.deezerNotAvailable"),
				"close",
				true,
				"login-toast"
			);

		// TODO
		// $('#open_login_prompt').show()
		// document.getElementById('logged_in_info').classList.add('hide')
		// $('#settings_username').text('Not Logged')
		// $('#settings_picture').attr('src', `https://e-cdns-images.dzcdn.net/images/user/125x125-000000-80-0-0.jpg`)
		// document.getElementById('home_not_logged_in').classList.remove('hide')
	}
}

/* ===== Socketio listeners ===== */

// Debug messages for socketio
socket.on("restoringQueue", function () {
	toast(
		i18n.global.t("toasts.restoringQueue"),
		"loading",
		false,
		"restoring_queue"
	);
});

socket.on("cancellingCurrentItem", function (uuid: string) {
	toast(
		i18n.global.t("toasts.cancellingCurrentItem"),
		"loading",
		false,
		"cancelling_" + uuid
	);
});

socket.on("currentItemCancelled", function ({ uuid }: { uuid: string }) {
	toast(
		i18n.global.t("toasts.currentItemCancelled"),
		"done",
		true,
		"cancelling_" + uuid
	);
});

socket.on("startAddingArtist", function (data: { name: string; id: string }) {
	toast(
		i18n.global.t("toasts.startAddingArtist", { artist: data.name }),
		"loading",
		false,
		"artist_" + data.id
	);
});

socket.on("finishAddingArtist", function (data: { name: string; id: string }) {
	toast(
		i18n.global.t("toasts.finishAddingArtist", { artist: data.name }),
		"done",
		true,
		"artist_" + data.id
	);
});

socket.on("startConvertingSpotifyPlaylist", function (id: string) {
	toast(
		i18n.global.t("toasts.startConvertingSpotifyPlaylist"),
		"loading",
		false,
		"spotifyplaylist_" + id
	);
});

socket.on("finishConvertingSpotifyPlaylist", function (id: string) {
	toast(
		i18n.global.t("toasts.finishConvertingSpotifyPlaylist"),
		"done",
		true,
		"spotifyplaylist_" + id
	);
});

socket.on("errorMessage", function (error: Error) {
	toast(error, "error");
});

socket.on("queueError", function (queueItem: any) {
	if (queueItem.errid) {
		toast(
			queueItem.link + " - " + i18n.global.t(`errors.ids.${queueItem.errid}`),
			"error"
		);
	} else {
		toast(queueItem.link + " - " + queueItem.error, "error");
	}
});

socket.on("alreadyInQueue", function (data: { title: string }) {
	toast(
		i18n.global.t("toasts.alreadyInQueue", { item: data.title }),
		"playlist_add_check"
	);
});

socket.on("queueErrorNotLoggedIn", function () {
	toast(i18n.global.t("toasts.loginNeededToDownload"), "report");
});
const bitrateLabels = {
	15: "360 HQ",
	14: "360 MQ",
	13: "360 LQ",
	9: "FLAC",
	3: "320kbps",
	1: "128kbps",
	8: "128kbps",
	0: "MP3",
};
socket.on(
	"queueErrorCantStream",
	function (bitrate: keyof typeof bitrateLabels) {
		toast(
			i18n.global.t("toasts.queueErrorCantStream", {
				bitrate: bitrateLabels[bitrate],
			}),
			"report"
		);
	}
);

socket.on(
	"startGeneratingItems",
	function (data: { total: number; uuid: string }) {
		toast(
			i18n.global.t("toasts.startGeneratingItems", { n: data.total }),
			"loading",
			false,
			"batch_" + data.uuid
		);
	}
);

socket.on(
	"finishGeneratingItems",
	function (data: { total: number; uuid: string }) {
		toast(
			i18n.global.t("toasts.finishGeneratingItems", { n: data.total }),
			"done",
			true,
			"batch_" + data.uuid
		);
	}
);
socket.on(
	"toast",
	(data: { msg: string; icon: string; dismiss: boolean; id: string }) => {
		const { msg, icon, dismiss, id } = data;
		toast(
			msg,
			icon || null,
			dismiss !== undefined ? dismiss : true,
			id || null
		);
	}
);
