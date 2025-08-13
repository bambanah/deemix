import { formatDate } from "date-fns";
import fs from "fs";
import os from "os";
import { join as joinPath } from "path";
import { createLogger, format, transports } from "winston";
import * as deemix from "deemix";

const { combine, timestamp, errors, colorize, printf } = format;

const logFolder: string = joinPath(deemix.utils.getConfigFolder(), "logs");

const logFilename = joinPath(
	logFolder,
	`${formatDate(new Date(), "yyyy-MM-dd-hh.mm.ss")}.log`
);

const logFormat = printf((error) => {
	const { level, message } = error;

	return `[${level}] ${message}`;
});

export const logger = createLogger({
	format: combine(errors({ stack: true }), timestamp(), logFormat),
	transports: [
		new transports.File({
			handleExceptions: true,
			handleRejections: true,
			format: combine(errors({ stack: true }), timestamp(), logFormat),
			filename: logFilename,
		}),
		new transports.Console({
			handleExceptions: true,
			handleRejections: true,
			format: combine(
				errors({ stack: true }),
				colorize(),
				timestamp(),
				logFormat
			),
		}),
	],
});

export function removeOldLogs(logFilesNumber: number) {
	if (!fs.existsSync(logFolder)) fs.mkdirSync(logFolder, { recursive: true });
	fs.appendFileSync(
		logFilename,
		`${os.platform()} - ${os.type()} ${os.release()} ${os.arch()}\n\n`
	);
	const files = fs.readdirSync(logFolder);
	const logs: Array<string> = [];
	files.forEach(function (file) {
		logs.push(file.substring(0, file.length - 4));
	});
	logs.sort();
	if (logs.length > logFilesNumber) {
		for (let i = 0; i < logs.length - logFilesNumber; i++) {
			fs.unlinkSync(joinPath(logFolder, logs[i] + ".log"));
		}
	}
}
