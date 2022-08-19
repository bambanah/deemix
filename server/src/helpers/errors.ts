const { TrackFormats } = require('deezer-js')

const bitrateLabels = {
	[TrackFormats.MP4_RA3]: '360 HQ',
	[TrackFormats.MP4_RA2]: '360 MQ',
	[TrackFormats.MP4_RA1]: '360 LQ',
	[TrackFormats.FLAC]: 'FLAC',
	[TrackFormats.MP3_320]: '320kbps',
	[TrackFormats.MP3_128]: '128kbps',
	[TrackFormats.DEFAULT]: '128kbps',
	[TrackFormats.LOCAL]: 'MP3'
}

export class BadRequestError extends Error {
	constructor() {
		super()
		this.message = 'Bad request!'
	}
}

export const isBadRequestError = (error: any) => error instanceof BadRequestError

export class QueueError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'QueueError'
	}
}

export class AlreadyInQueue extends QueueError {
	item: any
	silent: boolean
	constructor(dwObj: any, silent: boolean) {
		super(`${dwObj.artist} - ${dwObj.title} is already in queue.`)
		this.name = 'AlreadyInQueue'
		this.item = dwObj
		this.silent = silent
	}
}

export class NotLoggedIn extends QueueError {
	constructor() {
		super(`You must be logged in to start a download.`)
		this.name = 'NotLoggedIn'
	}
}

export class CantStream extends QueueError {
	bitrate: number
	constructor(bitrate: number) {
		super(`Your account can't stream at ${bitrateLabels[bitrate]}.`)
		this.name = 'CantStream'
		this.bitrate = bitrate
	}
}
