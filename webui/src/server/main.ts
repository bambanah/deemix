import { DeemixApp } from "@/deemixApp.js";
import { logger, removeOldLogs } from "@/helpers/logger.js";
import { loadLoginCredentials } from "@/helpers/loginStorage.js";
import cookieParser from "cookie-parser";
import initDebug from "debug";
import { utils } from "deemix";
import express from "express";
import session from "express-session";
import memorystore from "memorystore";
import morgan from "morgan";
import ViteExpress from "vite-express";
import { WebSocket, WebSocketServer } from "ws";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { normalizePort } from "./helpers/port.js";
import { getErrorCb, getListeningCb } from "./helpers/server-callbacks.js";
import { registerApis } from "./routes/api/register.js";
import indexRouter from "./routes/index.js";
import type { Arguments } from "./types.js";
import type { Listener } from "./types.js";
import { registerWebsocket } from "./websocket/index.js";

const MemoryStore = memorystore(session);

// TODO: Remove type assertion while keeping correct types
const argv = yargs(hideBin(process.argv)).options({
	port: { type: "string", default: "6595" },
	host: { type: "string", default: "0.0.0.0" },
	locationbase: { type: "string", default: "/" },
	singleuser: { type: "boolean", default: false },
}).argv as Arguments;

const serverPort = process.env.DEEMIX_SERVER_PORT ?? argv.port;
const deemixHost = process.env.DEEMIX_HOST ?? argv.host;
const isSingleUser =
	process.env.DEEMIX_SINGLE_USER === undefined
		? !!argv.singleuser
		: process.env.DEEMIX_SINGLE_USER === "true";

const app = express();

if (isSingleUser) loadLoginCredentials();

const debug = initDebug("deemix-gui:server");
app.set("isSingleUser", isSingleUser);

/* === Deemix App === */
const listener: Listener = {
	send: (key: string, data?: any) => {
		const logLine = utils.formatListener(key, data);
		if (logLine) logger.info(logLine);
		if (["downloadInfo", "downloadWarn"].includes(key)) return;
		wss.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify({ key, data }));
			}
		});
	},
};
const deemixApp = new DeemixApp(listener);

/* === Middlewares === */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
	// @ts-expect-error
	session({
		store: new MemoryStore({
			checkPeriod: 86400000, // prune expired entries every 24h
		}),
		secret: "U2hoLCBpdHMgYSBzZWNyZXQh",
		resave: true,
		saveUninitialized: true,
	})
);

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

/* === Routes === */
app.use("/", indexRouter);

/* === APIs === */
registerApis(app);

/* === Config === */
app.set("port", serverPort);
app.set("deemix", deemixApp);

/* === Server port === */
const server = app.listen({
	port: normalizePort(serverPort),
	host: deemixHost,
});
const wss = new WebSocketServer({ server });

ViteExpress.bind(app, server);

/* === Server callbacks === */
server.on("error", getErrorCb(serverPort));
server.on("listening", getListeningCb(server, debug));
registerWebsocket(wss, deemixApp);

/* === Remove Old logs files === */
removeOldLogs(5);

export { app, server, deemixApp };
