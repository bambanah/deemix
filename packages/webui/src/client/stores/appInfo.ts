import { getInitialPreviewVolume } from "@/data/settings.js";
import { defineStore } from "pinia";

interface AppInfoState {
	webuiVersion?: string;
	deemixVersion?: string;
	guiVersion?: string;
	latestVersion?: string;
	updateAvailable: boolean;
	previewVolume: number;
	hasSlimDownloads: boolean;
	hasSlimSidebar: boolean;
	showBitrateTags: boolean;
	showSearchButton: boolean;
	isMobileSidebarOpen: boolean;
	isMobileDownloadsOpen: boolean;
}

export const useAppInfoStore = defineStore("appInfo", {
	state: (): AppInfoState => ({
		updateAvailable: false,
		previewVolume: getInitialPreviewVolume(),
		hasSlimDownloads: localStorage.getItem("slimDownloads") === "true",
		hasSlimSidebar: localStorage.getItem("slimSidebar") === "true",
		showBitrateTags: localStorage.getItem("showBitrateTags") === "true",
		showSearchButton: localStorage.getItem("showSearchButton") === "true",
		isMobileSidebarOpen: false,
		isMobileDownloadsOpen: false,
	}),
	actions: {
		setAppInfo(payload: AppInfoState) {
			this.webuiVersion = payload.webuiVersion;
			this.deemixVersion = payload.deemixVersion;
			this.guiVersion = payload.guiVersion;
		},
		setUpdateInfo(payload: AppInfoState) {
			this.latestVersion = payload.latestVersion;
			this.updateAvailable = payload.updateAvailable;
		},
		setPreviewVolume(previewVolume: number) {
			this.previewVolume = previewVolume;
			localStorage.setItem("previewVolume", previewVolume.toString());
		},
		setSlimDownloads(slimDownloads: AppInfoState["hasSlimDownloads"]) {
			this.hasSlimDownloads = slimDownloads;
			localStorage.setItem("slimDownloads", slimDownloads.toString());
		},
		setSlimSidebar(slimSidebar: AppInfoState["hasSlimSidebar"]) {
			this.hasSlimSidebar = slimSidebar;
			localStorage.setItem("slimSidebar", slimSidebar.toString());

			// Moves all toast messages when the option changes
			Array.from(document.getElementsByClassName("toastify")).forEach(
				(toast) => {
					(toast as HTMLElement).style.transform = `translate(${
						slimSidebar ? "3rem" : "14rem"
					}, 0)`;
				}
			);
		},
		setShowBitrateTags(showBitrateTags: AppInfoState["showBitrateTags"]) {
			this.showBitrateTags = showBitrateTags;
			localStorage.setItem("showBitrateTags", showBitrateTags.toString());
		},
		setShowSearchButton(showSearchButton: AppInfoState["showSearchButton"]) {
			this.showSearchButton = showSearchButton;
			localStorage.setItem("showSearchButton", showSearchButton.toString());
		},
		toggleMobileSidebar() {
			this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
		},
		closeMobileSidebar() {
			this.isMobileSidebarOpen = false;
		},
		toggleMobileDownloads() {
			this.isMobileDownloadsOpen = !this.isMobileDownloadsOpen;
		},
		closeMobileDownloads() {
			this.isMobileDownloadsOpen = false;
		},
	},
});
