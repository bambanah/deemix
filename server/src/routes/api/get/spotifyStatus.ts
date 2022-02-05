import { ApiHandler } from '../../../types'

const path: ApiHandler['path'] = '/spotifyStatus'

const handler: ApiHandler['handler'] = (req, res) => {
	const deemix = req.app.get('deemix')
	res.send({ spotifyEnabled: deemix.plugins.spotify.enabled })
}

const apiHandler: ApiHandler = { path, handler }

export default apiHandler
