import { Server as WsServer } from "ws";
import { logger } from "../../helpers/logger";
import { DeemixApp } from "../../deemixApp";

const eventName = "removeFromQueue";

const cb = (data: any, __: any, ___: WsServer, deemix: DeemixApp) => {
	deemix.cancelDownload(data);
	logger.info(`Cancelled ${data}`);
};

export default { eventName, cb };
