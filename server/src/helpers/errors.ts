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
