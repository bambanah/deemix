const SpotifyWebApi = require("./spotify-web-api");
const ServerMethods = require("./server-methods");
SpotifyWebApi._addMethods(ServerMethods);
module.exports = SpotifyWebApi;
