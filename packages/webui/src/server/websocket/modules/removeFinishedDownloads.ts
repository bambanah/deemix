import { DeemixApp } from "@/deemixApp.js";
import { logger } from "@/helpers/logger.js";
import { WebSocketServer } from "ws";

const eventName = "removeFinishedDownloads";

const cb = (_: any, __: any, ___: WebSocketServer, deemix: DeemixApp) => {
	deemix.clearCompletedDownloads();
	logger.info("Completed downloads cleared");
};

export default { eventName, cb };
