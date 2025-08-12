import { defineStore } from "pinia";

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

export const useErrorStore = defineStore("error", {
	state: (): ErrorState => ({
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
	}),
	actions: {
		setErrors(payload: ErrorState) {
			Object.assign(this, payload);
		},
	},
});
