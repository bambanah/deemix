import http, { Server } from 'http'
import express, { Application } from 'express'
import { Server as WsServer } from 'ws'
import initDebug from 'debug'
// @ts-expect-error
import deemix from 'deemix'
import { registerMiddlewares } from './middlewares'
import indexRouter from './routes'
import { getErrorCb, getListeningCb } from './helpers/server-callbacks'
import { registerApis } from './routes/api/register'
import { registerWebsocket } from './websocket'
import { consoleInfo } from './helpers/errors'
import { Port, Listener } from './types'
import { DeemixApp } from './app'
import { normalizePort } from './helpers/port'

export class DeemixServer {
	host: string
	port: Port

	wss: WsServer
	app: Application
	server: Server
	deemixApp: DeemixApp

	constructor(host: string, port: string) {
		this.host = host
		this.port = normalizePort(port)

		this.wss = new WsServer({ noServer: true })
		this.app = express()
		this.server = http.createServer(this.app)

		const listener: Listener = {
			send: (key: string, data?: any) => {
				const logLine = deemix.utils.formatListener(key, data)
				if (logLine) console.log(logLine)
				if (['downloadInfo', 'downloadWarn'].includes(key)) return
				this.wss.clients.forEach(client => {
					if (client.readyState === WebSocket.OPEN) {
						client.send(JSON.stringify({ key, data }))
					}
				})
			}
		}

		this.deemixApp = new DeemixApp(listener)
	}

	init() {
		const debug = initDebug('deemix-gui:server')
		this.app.set('deemix', this.deemixApp)

		/* === Middlewares === */
		registerMiddlewares(this.app)

		/* === Routes === */
		this.app.use('/', indexRouter)

		/* === APIs === */
		registerApis(this.app)

		/* === Config === */
		this.app.set('port', this.port)

		/* === Server port === */
		if (process.env.NODE_ENV !== 'test') {
			this.server.listen({ port: this.port, host: this.host })
		}

		registerWebsocket(this.wss, this.deemixApp)

		/* === Server callbacks === */
		this.app.on('mount', a => {
			console.log(a)
		})
		this.server.on('connect', () => {
			consoleInfo('Server connected')
		})
		this.server.on('upgrade', (request, socket, head) => {
			this.wss.handleUpgrade(request, socket, head, socket => {
				this.wss.emit('connection', socket, request)
			})
		})
		this.server.on('error', getErrorCb(this.port))
		this.server.on('listening', getListeningCb(this.server, debug))
	}
}
