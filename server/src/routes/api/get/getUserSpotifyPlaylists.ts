import { ApiHandler } from '../../../types'

const path: ApiHandler['path'] = '/getUserSpotifyPlaylists'

const handler: ApiHandler['handler'] = async (req, res) => {
	let data
	const deemix = req.app.get('deemix')

	if (deemix.plugins.spotify.enabled) {
		const sp = deemix.plugins.spotify.sp
		const usernames = req.query.spotifyUser.split(/[\s,]+/)
		data = []
		let playlistList: any
		playlistList = []
		for (let username of usernames) {
			username = username.trim()
			let playlists
			try {
				playlists = await sp.getUserPlaylists(username)
			} catch (e) {
				res.send({ error: 'wrongSpotifyUsername', username })
				return
			}
			playlists = playlists.body
			playlistList = playlistList.concat(playlists.items)
			while (playlists.next) {
				const regExec = /offset=(\d+)/g.exec(playlists.next)
				const offset = regExec![1]
				// const limit = regExec![2]
				const newPlaylists = await sp.getUserPlaylists(username, { offset })
				playlists = newPlaylists.body
				playlistList = playlistList.concat(playlists.items)
			}
		}
		playlistList.forEach((playlist: any) => {
			data.push(deemix.plugins.spotify._convertPlaylistStructure(playlist))
		})
	} else {
		data = { error: 'spotifyNotEnabled' }
	}
	res.send(data)
}

const apiHandler: ApiHandler = { path, handler }

export default apiHandler
