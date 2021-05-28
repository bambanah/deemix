"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-expect-error
const deezer_js_1 = require("deezer-js");
const main_1 = require("../../../main");
const path = '/getTracklist';
const handler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!main_1.sessionDZ[req.session.id])
        main_1.sessionDZ[req.session.id] = new deezer_js_1.Deezer();
    const dz = main_1.sessionDZ[req.session.id];
    const list_id = String(req.query.id);
    const list_type = String(req.query.type);
    switch (list_type) {
        case 'artist': {
            const artistAPI = yield dz.api.get_artist(list_id);
            artistAPI.releases = yield dz.gw.get_artist_discography_tabs(list_id, { limit: 100 });
            res.send(artistAPI);
            break;
        }
        default: {
            const releaseAPI = yield dz.api[`get_${list_type}`](list_id);
            let releaseTracksAPI = yield dz.api[`get_${list_type}_tracks`](list_id);
            releaseTracksAPI = releaseTracksAPI.data;
            const tracks = [];
            const showdiscs = list_type === 'album' &&
                releaseTracksAPI.length &&
                releaseTracksAPI[releaseTracksAPI.length - 1].disk_number !== 1;
            let current_disk = 0;
            releaseTracksAPI.forEach((track) => {
                if (showdiscs && parseInt(track.disk_number) !== current_disk) {
                    current_disk = parseInt(track.disk_number);
                    tracks.push({ type: 'disc_separator', number: current_disk });
                }
                track.selected = false;
                tracks.push(track);
            });
            releaseAPI.tracks = tracks;
            res.send(releaseAPI);
            break;
        }
    }
});
const apiHandler = { path, handler };
exports.default = apiHandler;