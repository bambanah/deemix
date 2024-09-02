import type { Application } from "express";
import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";

import { WEBUI_DIR } from "./helpers/paths";
import { Deezer } from "deezer-js";

const MemoryStore = require("memorystore")(session);

declare module "express-session" {
	export interface SessionData {
		dz: Deezer;
	}
}

export function registerMiddlewares(app: Application) {
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(cookieParser());
	app.use(
		session({
			store: new MemoryStore({
				checkPeriod: 86400000, // prune expired entries every 24h
			}),
			secret: "U2hoLCBpdHMgYSBzZWNyZXQh",
			resave: true,
			saveUninitialized: true,
		})
	);
	app.use(express.static(WEBUI_DIR));

	if (process.env.NODE_ENV === "development") {
		app.use(logger("dev"));
	}
}
