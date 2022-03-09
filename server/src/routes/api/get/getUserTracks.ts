// @ts-expect-error
import { Deezer } from 'deezer-js'
import { ApiHandler } from '../../../types'
import { sessionDZ } from '../../../app'

const path: ApiHandler['path'] = '/getUserTracks'

const handler: ApiHandler['handler'] = async (req, res) => {
	if (!sessionDZ[req.session.id]) sessionDZ[req.session.id] = new Deezer()
	const dz = sessionDZ[req.session.id]
	let data

	if (dz.logged_in) {
		data = await dz.gw.get_my_favorite_tracks({ limit: -1 })
	} else {
		data = { error: 'notLoggedIn' }
	}
	res.send(data)
}

const apiHandler: ApiHandler = { path, handler }

export default apiHandler
