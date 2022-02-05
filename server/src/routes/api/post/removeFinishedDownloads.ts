import { ApiHandler } from '../../../types'

const path = '/removeFinishedDownloads'

const handler: ApiHandler['handler'] = (req, res) => {
	const deemix = req.app.get('deemix')
	deemix.clearCompletedDownloads()
	res.send({ result: true })
}

const apiHandler = { path, handler }

export default apiHandler
