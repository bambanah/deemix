import { Collection, Convertable } from "@/download-objects/Collection.js";
import { PluginNotEnabledError } from "@/errors.js";
import { type Settings } from "@/types/Settings.js";
import { getConfigFolder } from "@/utils/localpaths.js";
import { queue } from "async";
import { Deezer, type DeezerTrack } from "deezer-sdk";
import fs from "fs";
import got from "got";
import { sep } from "path";
import BasePlugin from "./base.js";

interface ListenBrainzTrack {
	creator: string;
	title: string;
	album: string;
	duration: number;
	extension: {
		additional_metadata: {
			artist_mbids: string[];
			recording_mbid: string;
			release_mbid: string;
			track_mbid: string;
		};
	};
	identifier: string;
}

export default class ListenBrainzPlugin extends BasePlugin {
	enabled: boolean;
	configFolder: string;

	constructor(configFolder = undefined) {
		super();
		this.enabled = false;
		this.configFolder = configFolder || getConfigFolder();
		this.configFolder += `listenbrainz${sep}`;
		return this;
	}

	override setup() {
		fs.mkdirSync(this.configFolder, { recursive: true });
		this.enabled = true;
		return this;
	}

	override async parseLink(link: string) {
		if (link.includes("listenbrainz.org/playlist/")) {
			const match = /playlist\/([a-f0-9-]+)/.exec(link);
			if (match) {
				return [link, "playlist", match[1]];
			}
		}
		return [link, undefined, undefined];
	}

	override async generateDownloadObject(dz, link, bitrate) {
		let link_type, link_id;
		[link, link_type, link_id] = await this.parseLink(link);

		if (link_type == null || link_id == null) return null;

		switch (link_type) {
			case "playlist":
				return this.generatePlaylistItem(dz, link_id, bitrate, link);
		}
	}

	async generatePlaylistItem(dz: Deezer, link_id: string, bitrate: number, link: string) {
		if (!this.enabled) throw new PluginNotEnabledError("ListenBrainz");

		const response = await got
			.post(link, {
				headers: {
					Accept: "application/json",
				},
			})
			.json<any>();

		// The playlist data is nested under a 'playlist' key, which is also nested
		const listenBrainzPlaylist = response.playlist.playlist;

		const playlistAPI: any = this._convertPlaylistStructure(listenBrainzPlaylist);
		playlistAPI.various_artist = await dz.api.get_artist(5080); // Useful for save as compilation

		const tracklist: ListenBrainzTrack[] = listenBrainzPlaylist.track || [];

		return new Convertable({
			type: "listenbrainz_playlist",
			id: link_id,
			bitrate,
			title: listenBrainzPlaylist.title,
			artist: listenBrainzPlaylist.creator,
			cover: playlistAPI.picture_thumbnail,
			explicit: false, // ListenBrainz does not provide this
			size: tracklist.length,
			collection: {
				tracks: [],
				playlistAPI,
			},
			plugin: "listenbrainz",
			conversion_data: tracklist,
		});
	}

	async convert(
		dz: Deezer,
		downloadObject: Convertable,
		settings: Settings,
		listener: any = null
	): Promise<Collection> {
		const collection = [];

		if (listener)
			listener.send("startConversion", {
				uuid: downloadObject.uuid,
				title: downloadObject.title,
			});

		const q = queue(
			async (data: { track: ListenBrainzTrack; pos: number }, callback) => {
				const { track, pos } = data;
				if (downloadObject.isCanceled) return;

				if (listener) {
					const progress = ((pos + 1) / downloadObject.size) * 100;
					listener.send("updateQueue", {
						uuid: downloadObject.uuid,
						title: downloadObject.title,
						conversion: Math.round(progress),
					});
				}

				let trackAPI: DeezerTrack;

				const artist = track.creator || "";
				const title = track.title || "";
				const album = track.album || "";

				const trackID = await dz.api.get_track_id_from_metadata(
					artist,
					title,
					album
				);

				if (trackID !== "0") trackAPI = await dz.api.getTrack(trackID);

				if (!trackAPI) {
					trackAPI = {
						id: "0",
						title: title,
						duration: 0,
						md5_origin: 0,
						media_version: 0,
						filesizes: {},
						album: {
							title: album,
							md5_image: "",
						},
						artist: {
							id: 0,
							name: artist,
							md5_image: "",
						},
					};
				}

				trackAPI.position = pos + 1;
				collection[pos] = trackAPI;

				callback();
			},
			settings.queueConcurrency
		);

		(downloadObject.conversionData as any[]).forEach(
			(track: ListenBrainzTrack, pos) => {
				q.push({ track, pos }, () => {});
			}
		);

		await q.drain();

		downloadObject.collection.tracks = collection;
		downloadObject.size = collection.length;

		const returnCollection = new Collection(downloadObject.toDict());
		if (listener)
			listener.send("finishConversion", returnCollection.getSlimmedDict());

		return returnCollection;
	}

	_convertPlaylistStructure(listenBrainzPlaylist) {
		const cover = listenBrainzPlaylist.meta?.artwork;

		let creation_date = "0000-00-00";
		if (listenBrainzPlaylist.date) {
			try {
				const date = new Date(listenBrainzPlaylist.date);
				if (date && !isNaN(date.getTime()))
					creation_date = date.toISOString().split("T")[0];
			} catch (e) {
				console.error("Error parsing date:", e);
				console.error("Original date value:", listenBrainzPlaylist.date);
			}
		}

		const deezerPlaylist = {
			checksum: listenBrainzPlaylist.identifier,
			collaborative: false,
			creation_date,
			creator: {
				id: listenBrainzPlaylist.creator,
				name: listenBrainzPlaylist.creator,
				tracklist: listenBrainzPlaylist.identifier,
				type: "user",
			},
			description: listenBrainzPlaylist.annotation,
			duration: 0,
			fans: 0,
			id: listenBrainzPlaylist.identifier,
			is_loved_track: false,
			link: listenBrainzPlaylist.identifier,
			nb_tracks: listenBrainzPlaylist.track
				? listenBrainzPlaylist.track.length
				: 0,
			picture: cover,
			picture_small:
				cover ||
				"https://e-cdns-images.dzcdn.net/images/cover/d41d8cd98f00b204e9800998ecf8427e/56x56-000000-80-0-0.jpg",
			picture_medium:
				cover ||
				"https://e-cdns-images.dzcdn.net/images/cover/d41d8cd98f00b204e9800998ecf8427e/250x250-000000-80-0-0.jpg",
			picture_big:
				cover ||
				"https://e-cdns-images.dzcdn.net/images/cover/d41d8cd98f00b204e9800998ecf8427e/500x500-000000-80-0-0.jpg",
			picture_xl:
				cover ||
				"https://e-cdns-images.dzcdn.net/images/cover/d41d8cd98f00b204e9800998ecf8427e/1000x1000-000000-80-0-0.jpg",
			picture_thumbnail:
				cover ||
				"https://e-cdns-images.dzcdn.net/images/cover/d41d8cd98f00b204e9800998ecf8427e/75x75-000000-80-0-0.jpg",
			public: true,
			share: listenBrainzPlaylist.identifier,
			title: listenBrainzPlaylist.title,
			tracklist: listenBrainzPlaylist.identifier,
			type: "playlist",
		};

		return deezerPlaylist;
	}
}
