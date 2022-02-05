import { Server as WsServer } from 'ws'
import { consoleInfo } from '../../helpers/errors'
import { DeemixApp } from '../../app'

const eventName = 'cancelAllDownloads'

const cb = (_: any, __: any, ___: WsServer, deemix: DeemixApp) => {
	deemix.cancelAllDownloads()
	consoleInfo(`Queue cleared`)
}

export default { eventName, cb }
