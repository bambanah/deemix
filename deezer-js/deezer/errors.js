class DeezerError extends Error {
  constructor(message) {
    super(message);
    this.name = "DeezerError";
  }
}

class WrongLicense extends DeezerError {
  constructor(format) {
    super();
    this.name = "WrongLicense";
    this.message = `Your account can't request urls for ${format} tracks`;
    this.format = format;
  }
}

class WrongGeolocation extends DeezerError {
  constructor(country) {
    super();
    this.name = "WrongGeolocation";
    this.message = `The track you requested can't be streamed in country ${country}`;
    this.country = country;
  }
}

// APIError
class APIError extends DeezerError {
  constructor(message) {
    super(message);
    this.name = "APIError";
  }
}
class ItemsLimitExceededException extends APIError {
  constructor(message) {
    super(message);
    this.name = "ItemsLimitExceededException";
  }
}
class PermissionException extends APIError {
  constructor(message) {
    super(message);
    this.name = "PermissionException";
  }
}
class InvalidTokenException extends APIError {
  constructor(message) {
    super(message);
    this.name = "InvalidTokenException";
  }
}
class WrongParameterException extends APIError {
  constructor(message) {
    super(message);
    this.name = "WrongParameterException";
  }
}
class MissingParameterException extends APIError {
  constructor(message) {
    super(message);
    this.name = "MissingParameterException";
  }
}
class InvalidQueryException extends APIError {
  constructor(message) {
    super(message);
    this.name = "InvalidQueryException";
  }
}
class DataException extends APIError {
  constructor(message) {
    super(message);
    this.name = "DataException";
  }
}
class IndividualAccountChangedNotAllowedException extends APIError {
  constructor(message) {
    super(message);
    this.name = "IndividualAccountChangedNotAllowedException";
  }
}
class GWAPIError extends DeezerError {
  constructor(message) {
    super(message);
    this.name = "GWAPIError";
    this.message = "Track unavailable on Deezer";
  }
}

module.exports = {
  DeezerError,
  WrongLicense,
  WrongGeolocation,
  APIError,
  ItemsLimitExceededException,
  PermissionException,
  InvalidTokenException,
  WrongParameterException,
  MissingParameterException,
  InvalidQueryException,
  DataException,
  IndividualAccountChangedNotAllowedException,
  GWAPIError,
};
