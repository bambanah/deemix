import { Server as WsServer } from 'ws'
import { logger } from '../../helpers/logger'
import { DeemixApp } from '../../app'

const eventName = 'removeFinishedDownloads'

const cb = (_: any, __: any, ___: WsServer, deemix: DeemixApp) => {
	deemix.clearCompletedDownloads()
	logger.info('Completed downloads cleared')
}

export default { eventName, cb }
