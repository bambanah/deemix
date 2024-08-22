class DeemixError extends Error {
  constructor(message) {
    super(message);
    this.name = "DeemixError";
  }
}

class GenerationError extends DeemixError {
  constructor(link, message) {
    super(message);
    this.link = link;
    this.name = "GenerationError";
  }
}

class ISRCnotOnDeezer extends GenerationError {
  constructor(link) {
    super(link, "Track ISRC is not available on deezer");
    this.name = "ISRCnotOnDeezer";
    this.errid = "ISRCnotOnDeezer";
  }
}

class NotYourPrivatePlaylist extends GenerationError {
  constructor(link) {
    super(link, "You can't download others private playlists.");
    this.name = "NotYourPrivatePlaylist";
    this.errid = "notYourPrivatePlaylist";
  }
}

class TrackNotOnDeezer extends GenerationError {
  constructor(link) {
    super(link, "Track not found on deezer!");
    this.name = "TrackNotOnDeezer";
    this.errid = "trackNotOnDeezer";
  }
}

class AlbumNotOnDeezer extends GenerationError {
  constructor(link) {
    super(link, "Album not found on deezer!");
    this.name = "AlbumNotOnDeezer";
    this.errid = "albumNotOnDeezer";
  }
}

class InvalidID extends GenerationError {
  constructor(link) {
    super(link, "Link ID is invalid!");
    this.name = "InvalidID";
    this.errid = "invalidID";
  }
}

class LinkNotSupported extends GenerationError {
  constructor(link) {
    super(link, "Link is not supported.");
    this.name = "LinkNotSupported";
    this.errid = "unsupportedURL";
  }
}

class LinkNotRecognized extends GenerationError {
  constructor(link) {
    super(link, "Link is not recognized.");
    this.name = "LinkNotRecognized";
    this.errid = "invalidURL";
  }
}

class DownloadError extends DeemixError {
  constructor() {
    super();
    this.name = "DownloadError";
  }
}

const ErrorMessages = {
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

class DownloadFailed extends DownloadError {
  constructor(errid, track) {
    super();
    this.errid = errid;
    this.message = ErrorMessages[errid];
    this.name = "DownloadFailed";
    this.track = track;
  }
}

class TrackNot360 extends DownloadError {
  constructor() {
    super();
    this.name = "TrackNot360";
  }
}

class PreferredBitrateNotFound extends DownloadError {
  constructor() {
    super();
    this.name = "PreferredBitrateNotFound";
  }
}

class DownloadEmpty extends DeemixError {
  constructor() {
    super();
    this.name = "DownloadEmpty";
  }
}

class DownloadCanceled extends DeemixError {
  constructor() {
    super();
    this.name = "DownloadCanceled";
  }
}

class TrackError extends DeemixError {
  constructor(message) {
    super(message);
    this.name = "TrackError";
  }
}

class MD5NotFound extends TrackError {
  constructor(message) {
    super(message);
    this.name = "MD5NotFound";
  }
}

class NoDataToParse extends TrackError {
  constructor(message) {
    super(message);
    this.name = "NoDataToParse";
  }
}

class AlbumDoesntExists extends TrackError {
  constructor(message) {
    super(message);
    this.name = "AlbumDoesntExists";
  }
}

module.exports = {
  DeemixError,
  GenerationError,
  ISRCnotOnDeezer,
  NotYourPrivatePlaylist,
  TrackNotOnDeezer,
  AlbumNotOnDeezer,
  InvalidID,
  LinkNotSupported,
  LinkNotRecognized,
  ErrorMessages,
  DownloadError,
  DownloadFailed,
  TrackNot360,
  PreferredBitrateNotFound,
  DownloadEmpty,
  DownloadCanceled,
  TrackError,
  MD5NotFound,
  NoDataToParse,
  AlbumDoesntExists,
};
