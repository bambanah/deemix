import { WebSocketServer } from "ws";

import { logger } from "../helpers/logger";
import { DeemixApp } from "../deemixApp";
import wsModules from "./modules";

export const registerWebsocket = (wss: WebSocketServer, deemix: DeemixApp) => {
	wss.on("connection", (ws) => {
		ws.on("message", (message) => {
			const data = JSON.parse(message.toString());

			wsModules.forEach((module) => {
				if (data.key === module.eventName) {
					module.cb(data.data, ws, wss, deemix);
				}
			});
		});

		ws.send("Hello");
	});

	wss.on("error", () => {
		logger.error("An error occurred to the WebSocket server.");
	});

	wss.on("close", () => {
		logger.info("Connection to the WebSocket server closed.");
	});
};
