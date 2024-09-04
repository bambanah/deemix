import { WebSocketServer } from "ws";
import { logger } from "../../helpers/logger";
import { DeemixApp } from "../../deemixApp";

const eventName = "cancelAllDownloads";

const cb = (_: any, __: any, ___: WebSocketServer, deemix: DeemixApp) => {
	deemix.cancelAllDownloads();
	logger.info(`Queue cleared`);
};

export default { eventName, cb };
