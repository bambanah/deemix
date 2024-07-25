'use strict'

const Request = require('./base-request')

const DEFAULT_HOST = 'api.spotify.com'
const DEFAULT_PORT = 443
const DEFAULT_SCHEME = 'https'

module.exports.builder = function (accessToken) {
  return Request.builder()
    .withHost(DEFAULT_HOST)
    .withPort(DEFAULT_PORT)
    .withScheme(DEFAULT_SCHEME)
    .withAuth(accessToken)
}
