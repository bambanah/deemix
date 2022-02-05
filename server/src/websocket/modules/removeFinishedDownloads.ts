import { Server as WsServer } from 'ws'
import { consoleInfo } from '../../helpers/errors'
import { DeemixApp } from '../../app'

const eventName = 'removeFinishedDownloads'

const cb = (_: any, __: any, ___: WsServer, deemix: DeemixApp) => {
	deemix.clearCompletedDownloads()
	consoleInfo('Completed downloads cleared')
}

export default { eventName, cb }
