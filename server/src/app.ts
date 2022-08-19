import fs from 'fs'
import { sep } from 'path'
import { v4 as uuidv4 } from 'uuid'
// @ts-expect-error
import deemix from 'deemix'
import got from 'got'
import { Settings, Listener } from './types'
import { NotLoggedIn, CantStream } from './helpers/errors'

import { GUI_PACKAGE } from './helpers/paths'
import { logger } from './helpers/logger'

// Types
const Downloader = deemix.downloader.Downloader
const { Single, Collection, Convertable } = deemix.types.downloadObjects

// Functions
export const getAccessToken = deemix.utils.deezer.getAccessToken
export const getArlFromAccessToken = deemix.utils.deezer.getArlFromAccessToken

// Constants
export const configFolder: string = deemix.utils.localpaths.getConfigFolder()
export const defaultSettings: Settings = deemix.settings.DEFAULTS
export const deemixVersion = require('../node_modules/deemix/package.json').version
const currentVersionTemp = JSON.parse(String(fs.readFileSync(GUI_PACKAGE))).version
export const currentVersion = currentVersionTemp === '0.0.0' ? 'continuous' : currentVersionTemp

export const sessionDZ: any = {}

export class DeemixApp {
	queueOrder: string[]
	queue: any
	currentJob: any

	deezerAvailable: string | null
	latestVersion: string | null

	plugins: any
	settings: any

	listener: Listener

	constructor(listener: Listener) {
		this.settings = deemix.settings.load(configFolder)

		this.queueOrder = []
		this.queue = {}
		this.currentJob = null

		this.plugins = {
			// eslint-disable-next-line new-cap
			spotify: new deemix.plugins.spotify()
		}
		this.deezerAvailable = null
		this.latestVersion = null
		this.listener = listener

		this.plugins.spotify.setup()
		this.restoreQueueFromDisk()
	}

	async isDeezerAvailable(): Promise<string> {
		if (this.deezerAvailable === null) {
			let response
			try {
				response = await got.get('https://www.deezer.com/', {
					headers: { Cookie: 'dz_lang=en; Domain=deezer.com; Path=/; Secure; hostOnly=false;' },
					https: {
						rejectUnauthorized: false
					},
					retry: 5
				})
			} catch (e) {
				logger.error(e)
				this.deezerAvailable = 'no-network'
				return this.deezerAvailable
			}
			const title = (response.body.match(/<title[^>]*>([^<]+)<\/title>/)![1] || '').trim()
			this.deezerAvailable = title !== 'Deezer will soon be available in your country.' ? 'yes' : 'no'
		}
		return this.deezerAvailable
	}

	async getLatestVersion(force = false): Promise<string | null> {
		if ((this.latestVersion === null || force) && !this.settings.disableUpdateCheck) {
			let response
			try {
				response = await got.get('https://deemix.app/gui/latest', {
					https: {
						rejectUnauthorized: false
					}
				})
			} catch (e) {
				logger.error(e)
				this.latestVersion = 'NotFound'
				return this.latestVersion
			}
			this.latestVersion = response.body.trim()
		}
		return this.latestVersion
	}

	parseVersion(version: string | null): any {
		if (version === null || version === 'continuous' || version === 'NotFound') return null
		try {
			const matchResult = version.match(/(\d+)\.(\d+)\.(\d+)-r(\d+)\.(.+)/) || []
			return {
				year: parseInt(matchResult[1]),
				month: parseInt(matchResult[2]),
				day: parseInt(matchResult[3]),
				revision: parseInt(matchResult[4]),
				commit: matchResult[5] || ''
			}
		} catch (e) {
			logger.error(e)
			return null
		}
	}

	isUpdateAvailable(): boolean {
		const currentVersionObj: any = this.parseVersion(currentVersion)
		const latestVersionObj: any = this.parseVersion(this.latestVersion)
		if (currentVersionObj === null || latestVersionObj === null) return false
		if (latestVersionObj.year > currentVersionObj.year) return true
		let sameDate = latestVersionObj.year === currentVersionObj.year
		if (sameDate && latestVersionObj.month > currentVersionObj.month) return true
		sameDate = sameDate && latestVersionObj.month === currentVersionObj.month
		if (sameDate && latestVersionObj.day > currentVersionObj.day) return true
		sameDate = sameDate && latestVersionObj.day === currentVersionObj.day
		if (sameDate && latestVersionObj.revision > currentVersionObj.revision) return true
		if (
			latestVersionObj.revision === currentVersionObj.revision &&
			latestVersionObj.commit !== currentVersionObj.commit
		)
			return true
		return false
	}

	getSettings(): any {
		return { settings: this.settings, defaultSettings, spotifySettings: this.plugins.spotify.getSettings() }
	}

	saveSettings(newSettings: any, newSpotifySettings: any) {
		newSettings.executeCommand = this.settings.executeCommand
		deemix.settings.save(newSettings, configFolder)
		this.settings = newSettings
		this.plugins.spotify.saveSettings(newSpotifySettings)
	}

	getQueue() {
		const result: any = {
			queue: this.queue,
			queueOrder: this.queueOrder
		}
		if (this.currentJob && this.currentJob !== true) {
			result.current = this.currentJob.downloadObject.getSlimmedDict()
		}
		return result
	}

	async addToQueue(dz: any, url: string[], bitrate: number, retry: boolean = false) {
		if (!dz.logged_in) throw new NotLoggedIn()
		if (
			!this.settings.feelingLucky &&
			((!dz.current_user.can_stream_lossless && bitrate === 9) || (!dz.current_user.can_stream_hq && bitrate === 3))
		)
			throw new CantStream(bitrate)

		let downloadObjs: any[] = []
		const downloadErrors: any[] = []
		let link: string = ''
		const requestUUID = uuidv4()

		if (url.length > 1) {
			this.listener.send('startGeneratingItems', { uuid: requestUUID, total: url.length })
		}

		for (let i = 0; i < url.length; i++) {
			link = url[i]
			logger.info(`Adding ${link} to queue`)
			let downloadObj
			try {
				downloadObj = await deemix.generateDownloadObject(dz, link, bitrate, this.plugins, this.listener)
			} catch (e) {
				downloadErrors.push(e)
			}
			if (Array.isArray(downloadObj)) {
				downloadObjs = downloadObjs.concat(downloadObj)
			} else if (downloadObj) downloadObjs.push(downloadObj)
		}

		if (downloadErrors.length) {
			downloadErrors.forEach((e: any) => {
				if (!e.errid) logger.error(e)
				this.listener.send('queueError', { link: e.link, error: e.message, errid: e.errid })
			})
		}

		if (url.length > 1) {
			this.listener.send('finishGeneratingItems', { uuid: requestUUID, total: downloadObjs.length })
		}

		const slimmedObjects: any[] = []

		downloadObjs.forEach((downloadObj: any) => {
			// Check if element is already in queue
			if (Object.keys(this.queue).includes(downloadObj.uuid) && !retry) {
				this.listener.send('alreadyInQueue', downloadObj.getEssentialDict())
				return
			}

			// Save queue status when adding something to the queue
			if (!fs.existsSync(configFolder + 'queue')) fs.mkdirSync(configFolder + 'queue')

			this.queueOrder.push(downloadObj.uuid)
			fs.writeFileSync(configFolder + `queue${sep}order.json`, JSON.stringify(this.queueOrder))
			this.queue[downloadObj.uuid] = downloadObj.getEssentialDict()
			this.queue[downloadObj.uuid].status = 'inQueue'

			const savedObject = downloadObj.toDict()
			savedObject.status = 'inQueue'
			fs.writeFileSync(configFolder + `queue${sep}${downloadObj.uuid}.json`, JSON.stringify(savedObject))

			slimmedObjects.push(downloadObj.getSlimmedDict())
		})
		if (slimmedObjects.length === 1) this.listener.send('addedToQueue', slimmedObjects[0])
		else this.listener.send('addedToQueue', slimmedObjects)

		this.startQueue(dz)
		return slimmedObjects
	}

	async startQueue(dz: any): Promise<any> {
		do {
			if (this.currentJob !== null || this.queueOrder.length === 0) {
				// Should not start another download
				return null
			}
			this.currentJob = true // lock currentJob

			let currentUUID: string
			do {
				currentUUID = this.queueOrder.shift() || ''
			} while (this.queue[currentUUID] === undefined && this.queueOrder.length)
			if (this.queue[currentUUID] === undefined) {
				fs.writeFileSync(configFolder + `queue${sep}order.json`, JSON.stringify(this.queueOrder))
				this.currentJob = null
				return null
			}
			this.queue[currentUUID].status = 'downloading'
			const currentItem: any = JSON.parse(fs.readFileSync(configFolder + `queue${sep}${currentUUID}.json`).toString())
			let downloadObject: any
			switch (currentItem.__type__) {
				case 'Single':
					downloadObject = new Single(currentItem)
					break
				case 'Collection':
					downloadObject = new Collection(currentItem)
					break
				case 'Convertable':
					downloadObject = new Convertable(currentItem)
					downloadObject = await this.plugins[downloadObject.plugin].convert(
						dz,
						downloadObject,
						this.settings,
						this.listener
					)
					fs.writeFileSync(
						configFolder + `queue${sep}${downloadObject.uuid}.json`,
						JSON.stringify({ ...downloadObject.toDict(), status: 'inQueue' })
					)
					break
			}
			this.currentJob = new Downloader(dz, downloadObject, this.settings, this.listener)
			this.listener.send('startDownload', currentUUID)
			await this.currentJob.start()

			if (!downloadObject.isCanceled) {
				// Set status
				if (downloadObject.failed === downloadObject.size && downloadObject.size !== 0) {
					this.queue[currentUUID].status = 'failed'
				} else if (downloadObject.failed > 0) {
					this.queue[currentUUID].status = 'withErrors'
				} else {
					this.queue[currentUUID].status = 'completed'
				}

				const savedObject = downloadObject.getSlimmedDict()
				savedObject.status = this.queue[currentUUID].status

				// Save queue status
				this.queue[currentUUID] = savedObject
				fs.writeFileSync(configFolder + `queue${sep}${currentUUID}.json`, JSON.stringify(savedObject))
			}
			logger.info(this.queueOrder)
			fs.writeFileSync(configFolder + `queue${sep}order.json`, JSON.stringify(this.queueOrder))

			this.currentJob = null
		} while (this.queueOrder.length)
	}

	cancelDownload(uuid: string) {
		if (Object.keys(this.queue).includes(uuid)) {
			switch (this.queue[uuid].status) {
				case 'downloading':
					this.currentJob.downloadObject.isCanceled = true
					this.listener.send('cancellingCurrentItem', uuid)
					break
				case 'inQueue':
					this.queueOrder.splice(this.queueOrder.indexOf(uuid), 1)
					fs.writeFileSync(configFolder + `queue${sep}order.json`, JSON.stringify(this.queueOrder))
				// break
				// eslint-disable-next-line no-fallthrough
				default:
					// This gets called even in the 'inQueue' case. Is this the expected behaviour? If no, de-comment the break
					this.listener.send('removedFromQueue', uuid)
					break
			}
			fs.unlinkSync(configFolder + `queue${sep}${uuid}.json`)
			delete this.queue[uuid]
		}
	}

	cancelAllDownloads() {
		this.queueOrder = []
		let currentItem: string | null = null
		Object.values(this.queue).forEach((downloadObject: any) => {
			if (downloadObject.status === 'downloading') {
				this.currentJob.downloadObject.isCanceled = true
				this.listener.send('cancellingCurrentItem', downloadObject.uuid)
				currentItem = downloadObject.uuid
			}
			fs.unlinkSync(configFolder + `queue${sep}${downloadObject.uuid}.json`)
			delete this.queue[downloadObject.uuid]
		})
		fs.writeFileSync(configFolder + `queue${sep}order.json`, JSON.stringify(this.queueOrder))
		this.listener.send('removedAllDownloads', currentItem)
	}

	clearCompletedDownloads() {
		Object.values(this.queue).forEach((downloadObject: any) => {
			if (downloadObject.status === 'completed') {
				fs.unlinkSync(configFolder + `queue${sep}${downloadObject.uuid}.json`)
				delete this.queue[downloadObject.uuid]
			}
		})
		this.listener.send('removedFinishedDownloads')
	}

	restoreQueueFromDisk() {
		if (!fs.existsSync(configFolder + 'queue')) fs.mkdirSync(configFolder + 'queue')
		const allItems: string[] = fs.readdirSync(configFolder + 'queue')
		allItems.forEach((filename: string) => {
			if (filename === 'order.json') {
				try {
					this.queueOrder = JSON.parse(fs.readFileSync(configFolder + `queue${sep}order.json`).toString())
				} catch {
					this.queueOrder = []
					fs.writeFileSync(configFolder + `queue${sep}order.json`, JSON.stringify(this.queueOrder))
				}
			} else {
				let currentItem: any
				try {
					currentItem = JSON.parse(fs.readFileSync(configFolder + `queue${sep}${filename}`).toString())
				} catch {
					fs.unlinkSync(configFolder + `queue${sep}${filename}`)
					return
				}
				if (currentItem.status === 'inQueue') {
					let downloadObject: any
					switch (currentItem.__type__) {
						case 'Single':
							downloadObject = new Single(currentItem)
							// Remove old incompatible queue items
							if (downloadObject.single.trackAPI_gw) {
								fs.unlinkSync(configFolder + `queue${sep}${filename}`)
								return
							}
							break
						case 'Collection':
							downloadObject = new Collection(currentItem)
							// Remove old incompatible queue items
							if (downloadObject.collection.tracks_gw) {
								fs.unlinkSync(configFolder + `queue${sep}${filename}`)
								return
							}
							break
						case 'Convertable':
							downloadObject = new Convertable(currentItem)
							break
					}
					this.queue[downloadObject.uuid] = downloadObject.getEssentialDict()
					this.queue[downloadObject.uuid].status = 'inQueue'
				} else {
					this.queue[currentItem.uuid] = currentItem
				}
			}
		})
	}
}
