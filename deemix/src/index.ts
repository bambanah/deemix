import { Deezer } from "deezer-js";
import got from "got";
import { Downloader } from "./downloader";
import { LinkNotRecognized, LinkNotSupported } from "./errors";
import {
	generateAlbumItem,
	generateArtistItem,
	generateArtistTopItem,
	generatePlaylistItem,
	generateTrackItem,
} from "./itemgen";
import BasePlugin from "@/plugins/base";

async function parseLink(link: string) {
	if (link.includes("deezer.page.link")) {
		const response = await got.get(link, {
			https: { rejectUnauthorized: false },
		}); // Resolve URL shortner
		link = response.url;
	}
	// Remove extra stuff
	if (link.includes("?")) link = link.slice(0, link.indexOf("?"));
	if (link.includes("&")) link = link.slice(0, link.indexOf("&"));
	if (link.endsWith("/")) link = link.slice(0, -1); // Remove last slash if present

	let link_type, link_id;
	let link_data;

	if (!link.includes("deezer")) return [link, link_type, link_id]; // return if not a deezer link

	if (link.search(/\/track\/(.+)/g) !== -1) {
		link_type = "track";
		link_id = /\/track\/(.+)/g.exec(link)[1];
	} else if (link.search(/\/playlist\/(\d+)/g) !== -1) {
		link_type = "playlist";
		link_id = /\/playlist\/(\d+)/g.exec(link)[1];
	} else if (link.search(/\/album\/(.+)/g) !== -1) {
		link_type = "album";
		link_id = /\/album\/(.+)/g.exec(link)[1];
	} else if (link.search(/\/artist\/(\d+)\/top_track/g) !== -1) {
		link_type = "artist_top";
		link_id = /\/artist\/(\d+)\/top_track/g.exec(link)[1];
	} else if (link.search(/\/artist\/(\d+)\/(.+)/g) !== -1) {
		link_data = /\/artist\/(\d+)\/(.+)/g.exec(link);
		link_type = `artist_${link_data[2]}`;
		link_id = link_data[1];
	} else if (link.search(/\/artist\/(\d+)/g) !== -1) {
		link_type = "artist";
		link_id = /\/artist\/(\d+)/g.exec(link)[1];
	}

	return [link, link_type, link_id];
}

async function generateDownloadObject(
	dz: Deezer,
	link: string,
	bitrate: number,
	plugins: Record<string, BasePlugin> = {},
	listener: any
) {
	let link_type, link_id;
	[link, link_type, link_id] = await parseLink(link);

	if (link_type == null || link_id == null) {
		const pluginNames = Object.keys(plugins);
		let currentPlugin;
		let item = null;
		for (let i = 0; i < pluginNames.length; i++) {
			currentPlugin = plugins[pluginNames[i]];

			item = await currentPlugin.generateDownloadObject(
				dz,
				link,
				bitrate,
				listener
			);
			if (item) break;
		}
		if (item) return item;
		throw new LinkNotRecognized(link);
	}

	if (link_type === "track") return generateTrackItem(dz, link_id, bitrate);
	if (link_type === "album") return generateAlbumItem(dz, link_id, bitrate);
	if (link_type === "playlist")
		return generatePlaylistItem(dz, link_id, bitrate);
	if (link_type === "artist")
		return generateArtistItem(dz, link_id, bitrate, listener, "all");
	if (link_type === "artist_top")
		return generateArtistTopItem(dz, link_id, bitrate);
	if (link_type.startsWith("artist_")) {
		const tab = link_type.slice(7);
		return generateArtistItem(dz, link_id, bitrate, listener, tab);
	}
	throw new LinkNotSupported(link);
}

const itemgen = {
	generateTrackItem,
	generateAlbumItem,
	generatePlaylistItem,
	generateArtistItem,
	generateArtistTopItem,
};

export * as decryption from "./decryption";
export * as plugins from "./plugins";
export * as settings from "./settings";
export * as tagger from "./tagger";
export * from "./types";
export * as utils from "./utils";

// Exporting the organized objects
export { Downloader, generateDownloadObject, itemgen, parseLink };
