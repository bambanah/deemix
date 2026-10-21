import { defineStore } from "pinia";

export interface QueueTrack {
	id: string;
	title: string;
	artist: string;
	artistId: string | null;
	albumArtist: string;
	album: string;
	albumId: string | null;
	cover: string;
	duration: number;
}

/** Which tag is sent to Last.fm as the artist: the track artist or the album artist */
export type ScrobbleArtistTag = "artist" | "albumArtist";

/** Best quality to stream, Deezer falls back to a lower one when the account or track lacks it */
export type StreamQuality = "FLAC" | "MP3_320" | "MP3_128";

const STREAM_QUALITIES: StreamQuality[] = ["FLAC", "MP3_320", "MP3_128"];

function getInitialStreamQuality(): StreamQuality {
	const stored = localStorage.getItem(
		"deemix-stream-quality"
	) as StreamQuality | null;
	return stored && STREAM_QUALITIES.includes(stored) ? stored : "FLAC";
}

interface PlayerState {
	queue: QueueTrack[];
	index: number;
	isPlaying: boolean;
	volume: number;
	scrobbleArtistTag: ScrobbleArtistTag;
	streamQuality: StreamQuality;
}

function getInitialVolume() {
	const stored = parseInt(
		localStorage.getItem("deemix-player-volume") ?? "",
		10
	);
	return Number.isNaN(stored) ? 100 : stored;
}

function getInitialScrobbleArtistTag(): ScrobbleArtistTag {
	return localStorage.getItem("deemix-scrobble-artist-tag") === "albumArtist"
		? "albumArtist"
		: "artist";
}

export const usePlayerStore = defineStore("player", {
	state: (): PlayerState => ({
		queue: [],
		index: -1,
		isPlaying: false,
		volume: getInitialVolume(),
		scrobbleArtistTag: getInitialScrobbleArtistTag(),
		streamQuality: getInitialStreamQuality(),
	}),
	getters: {
		currentTrack: (state): QueueTrack | null =>
			state.queue[state.index] ?? null,
		hasNext: (state) => state.index < state.queue.length - 1,
		hasPrevious: (state) => state.index > 0,
	},
	actions: {
		playQueue(queue: QueueTrack[], startIndex = 0) {
			if (queue.length === 0) return;
			this.queue = queue;
			this.index = Math.min(Math.max(startIndex, 0), queue.length - 1);
			this.isPlaying = true;
		},
		playAt(index: number) {
			if (index < 0 || index >= this.queue.length) return;
			this.index = index;
			this.isPlaying = true;
		},
		next() {
			if (this.hasNext) this.playAt(this.index + 1);
			else this.isPlaying = false;
		},
		previous() {
			if (this.hasPrevious) this.playAt(this.index - 1);
		},
		setPlaying(isPlaying: boolean) {
			this.isPlaying = isPlaying;
		},
		togglePlay() {
			if (this.currentTrack) this.isPlaying = !this.isPlaying;
		},
		setVolume(volume: number) {
			this.volume = volume;
			localStorage.setItem("deemix-player-volume", String(volume));
		},
		setScrobbleArtistTag(tag: ScrobbleArtistTag) {
			this.scrobbleArtistTag = tag;
			localStorage.setItem("deemix-scrobble-artist-tag", tag);
		},
		setStreamQuality(quality: StreamQuality) {
			this.streamQuality = quality;
			localStorage.setItem("deemix-stream-quality", quality);
		},
		stop() {
			this.$patch({ queue: [], index: -1, isPlaying: false });
		},
	},
});
