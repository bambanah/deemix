class Plugin {
	/* constructor () {} */
	async setup() {}

	async parseLink(link) {
		return [link, undefined, undefined];
	}

	/* eslint no-unused-vars: ["error", { "args": "none" }] */
	async generateDownloadObject(dz, link, bitrate, listener) {
		return null;
	}
}

module.exports = Plugin;
