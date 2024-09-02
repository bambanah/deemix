export default class BasePlugin {
	/* constructor () {} */
	setup() {
		return this;
	}

	async parseLink(link: string) {
		return [link, undefined, undefined];
	}

	/* eslint no-unused-vars: ["error", { "args": "none" }] */
	async generateDownloadObject(dz, link, bitrate, listener) {
		return null;
	}
}
