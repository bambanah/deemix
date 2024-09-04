import initDebug from "debug";
import * as deemix from "deemix";
import express, { type Express } from "express";
import ViteExpress from "vite-express";
import { WebSocketServer } from "ws";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { DeemixApp } from "./deemixApp";
import { logger, removeOldLogs } from "./helpers/logger";
import { loadLoginCredentials } from "./helpers/loginStorage";
import { normalizePort } from "./helpers/port";
import { getErrorCb, getListeningCb } from "./helpers/server-callbacks";
import { registerMiddlewares } from "./middlewares";
import indexRouter from "./routes";
import { registerApis } from "./routes/api/register";
import type { Arguments } from "./types";
import { Listener } from "./types";
import { registerWebsocket } from "./websocket";

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

const app: Express = express();

if (isSingleUser) loadLoginCredentials();

const debug = initDebug("deemix-gui:server");
app.set("isSingleUser", isSingleUser);

/* === Deemix App === */
const listener: Listener = {
	send: (key: string, data?: any) => {
		const logLine = deemix.utils.formatListener(key, data);
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
registerMiddlewares(app);

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

export { app, server };
