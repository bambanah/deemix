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
const main_1 = require("../../../main");
const path = '/removeFromQueue';
const handler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uuid } = req.query;
    if (uuid) {
        main_1.cancelDownload(uuid);
        res.send({ result: true });
    }
    else {
        res.send({ result: false });
    }
});
const apiHandler = { path, handler };
exports.default = apiHandler;
