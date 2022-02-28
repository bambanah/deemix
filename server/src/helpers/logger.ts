import fs from 'fs'
import { join as joinPath } from 'path'
import os from 'os'
import dateFormat from 'dateformat'
import { createLogger, format, transports } from 'winston'
// @ts-expect-error
import deemix from 'deemix'
const { combine, timestamp, errors, colorize, printf } = format

const logFolder: string = joinPath(deemix.utils.localpaths.getConfigFolder(), 'logs')
const logFilename = joinPath(logFolder, `${dateFormat(new Date(), 'yyyy-mm-dd-HH.MM.ss')}.log`)

const logFormat = printf(error => {
	const { level, message, timestamp, stack } = error
	let result = `${timestamp} [${level}] ${message}`
	if (stack && !message.startsWith('uncaughtException')) result += '\n' + stack + '\n'
	return result
})

export const logger = createLogger({
	format: combine(errors({ stack: true }), timestamp(), logFormat),
	transports: [
		new transports.File({
			handleExceptions: true,
			handleRejections: true,
			format: combine(errors({ stack: true }), timestamp(), logFormat),
			filename: logFilename
		}),
		new transports.Console({
			handleExceptions: true,
			handleRejections: true,
			format: combine(errors({ stack: true }), colorize(), timestamp(), logFormat)
		})
	]
})

export function removeOldLogs(logFilesNumber: number) {
	if (!fs.existsSync(logFolder)) fs.mkdirSync(logFolder, { recursive: true })
	fs.appendFileSync(logFilename, `${os.platform()} - ${os.type()} ${os.release()} ${os.arch()}\n\n`)
	const files = fs.readdirSync(logFolder)
	const logs: Array<string> = []
	files.forEach(function (file) {
		logs.push(file.substring(0, file.length - 4))
	})
	logs.sort()
	if (logs.length > logFilesNumber) {
		for (let i = 0; i < logs.length - logFilesNumber; i++) {
			fs.unlinkSync(joinPath(logFolder, logs[i] + '.log'))
		}
	}
}
