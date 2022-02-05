// import { Deezer } from 'deezer-js'
import { ApiHandler } from '../../../types'

const path: ApiHandler['path'] = '/getQueue'

// let homeCache: any

const handler: ApiHandler['handler'] = (req, res) => {
	const deemix = req.app.get('deemix')
	const result: any = deemix.getQueue()
	res.send(result)
}

const apiHandler: ApiHandler = { path, handler }

export default apiHandler
