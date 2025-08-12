export default class BasePlugin {
	/* constructor () {} */
	setup() {
		return this;
	}

	async parseLink(link: string) {
		return [link, undefined, undefined];
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async generateDownloadObject(dz, link, bitrate, listener) {
		return null;
	}
}
