// @ts-expect-error
import { Deezer } from 'deezer-js'
import { ApiHandler } from '../../../types'
import { sessionDZ } from '../../../app'
import { logger } from '../../../helpers/logger'

const path: ApiHandler['path'] = '/addToQueue'

const handler: ApiHandler['handler'] = async (req, res) => {
	if (!sessionDZ[req.session.id]) sessionDZ[req.session.id] = new Deezer()
	const deemix = req.app.get('deemix')
	const dz = sessionDZ[req.session.id]

	const url = req.body.url.split(/[\s;]+/)
	let bitrate = req.body.bitrate
	if (bitrate === 'null' || bitrate === null) bitrate = deemix.getSettings().settings.maxBitrate
	bitrate = Number(bitrate)
	let obj: any

	try {
		obj = await deemix.addToQueue(dz, url, bitrate)
	} catch (e:any) {
		res.send({ result: false, errid: e.name, data: { url, bitrate } })
		switch (e.name) {
			case 'NotLoggedIn':
				deemix.listener.send('queueError' + e.name)
				break
			case 'CantStream':
				deemix.listener.send('queueError' + e.name, e.bitrate)
				break
			default:
				logger.error(e)
				break
		}
		return
	}

	res.send({ result: true, data: { url, bitrate, obj } })
}

const apiHandler: ApiHandler = { path, handler }

export default apiHandler
