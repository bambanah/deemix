import { WebSocketServer } from "ws";
import { logger } from "@/helpers/logger.js";
import { DeemixApp } from "@/deemixApp.js";

const eventName = "removeFromQueue";

const cb = (data: any, __: any, ___: WebSocketServer, deemix: DeemixApp) => {
	deemix.cancelDownload(data);
	logger.info(`Cancelled ${data}`);
};

export default { eventName, cb };
