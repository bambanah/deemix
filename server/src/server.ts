import http, { Server } from 'http'
import path from 'path'
import fs from 'fs'
import express, { Application } from 'express'
import ejs from 'ejs'
import { Server as WsServer, OPEN as WsOpen } from 'ws'
import initDebug from 'debug'
// @ts-expect-error
import deemix from 'deemix'
import { registerMiddlewares } from './middlewares'
import indexRouter from './routes'
import { getErrorCb, getListeningCb } from './helpers/server-callbacks'
import { registerApis } from './routes/api/register'
import { registerWebsocket } from './websocket'
import { logger, removeOldLogs } from './helpers/logger'
import { loadLoginCredentials } from './helpers/loginStorage'
import { Port, Listener } from './types'
import { DeemixApp } from './app'
import { normalizePort } from './helpers/port'
import { WEBUI_DIR } from './helpers/paths'

export class DeemixServer {
	host: string
	port: Port
	locationBase: string
	isSingleUser: boolean

	wss: WsServer
	app: Application
	server: Server
	deemixApp: DeemixApp

	constructor(host: string, port: string, locationBase: string, singleuser: boolean = false) {
		this.host = host
		this.port = normalizePort(port)
		this.locationBase = locationBase
		this.isSingleUser = singleuser

		this.wss = new WsServer({ noServer: true })
		this.app = express()
		this.server = http.createServer(this.app)

		const listener: Listener = {
			send: (key: string, data?: any) => {
				const logLine = deemix.utils.formatListener(key, data)
				if (logLine) logger.info(logLine)
				if (['downloadInfo', 'downloadWarn'].includes(key)) return
				this.wss.clients.forEach(client => {
					if (client.readyState === WsOpen) {
						client.send(JSON.stringify({ key, data }))
					}
				})
			}
		}

		this.deemixApp = new DeemixApp(listener)
		if (this.isSingleUser) loadLoginCredentials()
	}

	init() {
		const debug = initDebug('deemix-gui:server')
		this.app.set('deemix', this.deemixApp)
		this.app.set('isSingleUser', this.isSingleUser)

		/* === Middlewares === */
		registerMiddlewares(this.app)

		/* === Routes === */
		this.app.use('/', indexRouter)

		/* === APIs === */
		registerApis(this.app)

		/* === Fallback === */
		this.app.get('*/favicon.ico', (_, res) => {
			res.sendFile(path.join(WEBUI_DIR, 'favicon.ico'))
		})
		this.app.get('*/js/*', (req, res) => {
			const link = req.url.substr(req.url.indexOf('/js/'))
			res.sendFile(path.join(WEBUI_DIR, link))
		})
		this.app.get('*/fonts/*', (req, res) => {
			const link = req.url.substr(req.url.indexOf('/fonts/'))
			res.sendFile(path.join(WEBUI_DIR, link))
		})
		this.app.get('*/res/*', (req, res) => {
			const link = req.url.substr(req.url.indexOf('/res/'))
			res.sendFile(path.join(WEBUI_DIR, link))
		})
		this.app.get('*', (req, res) => {
			console.log(req.url)
			fs.readFile(path.join(WEBUI_DIR, 'index.ejs'), (_, html) => {
				res.send(ejs.render(html.toString(), { locationBase: this.locationBase }))
			})
		})

		/* === Config === */
		this.app.set('port', this.port)

		/* === Server port === */
		if (process.env.NODE_ENV !== 'test') {
			this.server.listen({ port: this.port, host: this.host })
		}

		registerWebsocket(this.wss, this.deemixApp)

		/* === Server callbacks === */
		this.app.on('mount', a => {
			logger.info(a)
		})
		this.server.on('connect', () => {
			logger.info('Server connected')
		})
		this.server.on('upgrade', (request, socket, head) => {
			this.wss.handleUpgrade(request, socket, head, socket => {
				this.wss.emit('connection', socket, request)
			})
		})
		this.server.on('error', getErrorCb(this.port))
		this.server.on('listening', getListeningCb(this.server, debug))

		/* === Remove Old logs files === */
		removeOldLogs(5)
	}
}
