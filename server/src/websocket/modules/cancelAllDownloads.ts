import { Server as WsServer } from 'ws'
import { logger } from '../../helpers/logger'
import { DeemixApp } from '../../app'

const eventName = 'cancelAllDownloads'

const cb = (_: any, __: any, ___: WsServer, deemix: DeemixApp) => {
	deemix.cancelAllDownloads()
	logger.info(`Queue cleared`)
}

export default { eventName, cb }
