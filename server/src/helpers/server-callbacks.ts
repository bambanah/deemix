import http from 'http'
import type { Debugger } from 'debug'
import { logger } from './logger'

/**
 * Event listener for HTTP server "error" event.
 *
 * @since	0.0.0
 */
export function getErrorCb(port: number | string | boolean) {
	return (error: any) => {
		if (error.syscall !== 'listen') {
			throw error
		}

		const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

		// handle specific listen errors with friendly messages
		switch (error.code) {
			case 'EACCES': {
				logger.error(bind + ' requires elevated privileges')
				process.exit(1)
			}
			case 'EADDRINUSE': {
				logger.error(bind + ' is already in use')
				process.exit(1)
			}
			default:
				throw error
		}
	}
}

/**
 * Event listener for HTTP server "listening" event.
 *
 * @since	0.0.0
 */
export function getListeningCb(server: http.Server, debug: Debugger) {
	return () => {
		const addr = server.address()

		if (addr) {
			const ip = typeof addr === 'string' ? 'pipe ' + addr : addr.address
			const port = typeof addr === 'string' ? 'pipe ' + addr : addr.port

			debug(`Listening on ${ip}:${port}`)
			logger.info(`Listening on ${ip}:${port}`)
		}
	}
}
