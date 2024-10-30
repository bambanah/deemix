import Track from "./types/Track.js";

export class DeemixError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = "DeemixError";
	}
}

export class GenerationError extends DeemixError {
	link: string;

	constructor(link: string, message: string) {
		super(message);
		this.link = link;
		this.name = "GenerationError";
	}
}

export class ISRCnotOnDeezer extends GenerationError {
	errid: string;

	constructor(link: string) {
		super(link, "Track ISRC is not available on deezer");
		this.name = "ISRCnotOnDeezer";
		this.errid = "ISRCnotOnDeezer";
	}
}

export class NotYourPrivatePlaylist extends GenerationError {
	errid: string;
	constructor(link: string) {
		super(link, "You can't download others private playlists.");
		this.name = "NotYourPrivatePlaylist";
		this.errid = "notYourPrivatePlaylist";
	}
}

export class TrackNotOnDeezer extends GenerationError {
	errid: string;
	constructor(link: string) {
		super(link, "Track not found on deezer!");
		this.name = "TrackNotOnDeezer";
		this.errid = "trackNotOnDeezer";
	}
}

export class AlbumNotOnDeezer extends GenerationError {
	errid: string;
	constructor(link: string) {
		super(link, "Album not found on deezer!");
		this.name = "AlbumNotOnDeezer";
		this.errid = "albumNotOnDeezer";
	}
}

export class InvalidID extends GenerationError {
	errid: string;
	constructor(link: string) {
		super(link, "Link ID is invalid!");
		this.name = "InvalidID";
		this.errid = "invalidID";
	}
}

export class LinkNotSupported extends GenerationError {
	errid: string;

	constructor(link: string) {
		super(link, "Link is not supported.");
		this.name = "LinkNotSupported";
		this.errid = "unsupportedURL";
	}
}

export class LinkNotRecognized extends GenerationError {
	errid: string;

	constructor(link: string) {
		super(link, "Link is not recognized.");
		this.name = "LinkNotRecognized";
		this.errid = "invalidURL";
	}
}

export class DownloadError extends DeemixError {
	constructor() {
		super();
		this.name = "DownloadError";
	}
}

export class PluginNotEnabledError extends DeemixError {
	constructor(pluginName: string) {
		const message = `${pluginName} plugin not enabled`;
		super(message);

		this.name = "PluginNotEnabledError";
	}
}

export const ErrorMessages = {
	notOnDeezer: "Track not available on Deezer!",
	notEncoded: "Track not yet encoded!",
	notEncodedNoAlternative: "Track not yet encoded and no alternative found!",
	wrongBitrate: "Track not found at desired bitrate.",
	wrongBitrateNoAlternative:
		"Track not found at desired bitrate and no alternative found!",
	wrongLicense: "Your account can't stream the track at the desired bitrate.",
	no360RA: "Track is not available in Reality Audio 360.",
	notAvailable: "Track not available on deezer's servers!",
	notAvailableNoAlternative:
		"Track not available on deezer's servers and no alternative found!",
	noSpaceLeft:
		"No space left on target drive, clean up some space for the tracks.",
	albumDoesntExists: "Track's album does not exsist, failed to gather info.",
	notLoggedIn: "You need to login to download tracks.",
	wrongGeolocation:
		"Your account can't stream the track from your current country.",
	wrongGeolocationNoAlternative:
		"Your account can't stream the track from your current country and no alternative found.",
};

export class DownloadFailed extends DownloadError {
	errid: keyof typeof ErrorMessages;
	track: Track;

	constructor(errid: keyof typeof ErrorMessages, track?: Track) {
		super();

		this.errid = errid;
		this.message = ErrorMessages[errid];
		this.name = "DownloadFailed";
		this.track = track;
	}
}

export class TrackNot360 extends DownloadError {
	constructor() {
		super();
		this.name = "TrackNot360";
	}
}

export class PreferredBitrateNotFound extends DownloadError {
	constructor() {
		super();
		this.name = "PreferredBitrateNotFound";
	}
}

export class DownloadEmpty extends DeemixError {
	constructor() {
		super();
		this.name = "DownloadEmpty";
	}
}

export class DownloadCanceled extends DeemixError {
	constructor() {
		super();
		this.name = "DownloadCanceled";
	}
}

export class TrackError extends DeemixError {
	constructor(message?: string) {
		super(message);
		this.name = "TrackError";
	}
}

export class MD5NotFound extends TrackError {
	constructor(message?: string) {
		super(message);
		this.name = "MD5NotFound";
	}
}

export class NoDataToParse extends TrackError {
	constructor(message?: string) {
		super(message);
		this.name = "NoDataToParse";
	}
}

export class AlbumDoesntExists extends TrackError {
	constructor(message?: string) {
		super(message);
		this.name = "AlbumDoesntExists";
	}
}
