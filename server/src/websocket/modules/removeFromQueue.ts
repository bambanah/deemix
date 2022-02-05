import { Server as WsServer } from 'ws'
import { consoleInfo } from '../../helpers/errors'
import { DeemixApp } from '../../app'

const eventName = 'removeFromQueue'

const cb = (data: any, __: any, ___: WsServer, deemix: DeemixApp) => {
	deemix.cancelDownload(data)
	consoleInfo(`Cancelled ${data}`)
}

export default { eventName, cb }
