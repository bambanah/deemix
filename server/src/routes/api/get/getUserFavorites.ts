// @ts-expect-error
import { Deezer } from 'deezer-js'
import { ApiHandler } from '../../../types'
import { sessionDZ } from '../../../app'

const path: ApiHandler['path'] = '/getUserFavorites'

const handler: ApiHandler['handler'] = async (req, res) => {
	if (!sessionDZ[req.session.id]) sessionDZ[req.session.id] = new Deezer()
	const dz = sessionDZ[req.session.id]

	let result: any = {}

	if (dz.logged_in) {
		const userID = dz.current_user.id

		result.playlists = await dz.gw.get_user_playlists(userID, { limit: -1 })
		result.albums = await dz.gw.get_user_albums(userID, { limit: -1 })
		result.artists = await dz.gw.get_user_artists(userID, { limit: -1 })
		result.tracks = await dz.gw.get_my_favorite_tracks({ limit: -1 })
		result.lovedTracks = `https://deezer.com/playlist/${dz.current_user.loved_tracks}`
	} else {
		result = { error: 'notLoggedIn' }
	}
	res.send(result)
}

const apiHandler: ApiHandler = { path, handler }

export default apiHandler
