import { WebSocketServer } from "ws";
import { logger } from "../../helpers/logger";
import { DeemixApp } from "../../deemixApp";

const eventName = "removeFinishedDownloads";

const cb = (_: any, __: any, ___: WebSocketServer, deemix: DeemixApp) => {
	deemix.clearCompletedDownloads();
	logger.info("Completed downloads cleared");
};

export default { eventName, cb };
