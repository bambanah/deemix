// @ts-expect-error
import { Deezer, utils as dzUtils } from 'deezer-js'
import { ApiHandler } from '../../../types'
import { sessionDZ } from '../../../app'

const path: ApiHandler['path'] = '/getTracklist'

const handler: ApiHandler['handler'] = async (req, res) => {
	if (!sessionDZ[req.session.id]) sessionDZ[req.session.id] = new Deezer()
	const dz = sessionDZ[req.session.id]
	const deemix = req.app.get('deemix')

	const list_id = String(req.query.id)
	const list_type = String(req.query.type)
	switch (list_type) {
		case 'artist': {
			const artistAPI = await dz.api.get_artist(list_id)
			artistAPI.releases = await dz.gw.get_artist_discography_tabs(list_id, { limit: 100 })
			res.send(artistAPI)
			break
		}
		case 'spotifyplaylist':
		case 'spotify_playlist': {
			if (!deemix.plugins.spotify.enabled) {
				res.send({
					collaborative: false,
					description: '',
					external_urls: { spotify: null },
					followers: { total: 0, href: null },
					id: null,
					images: [],
					name: 'Something went wrong',
					owner: {
						display_name: 'Error',
						id: null
					},
					public: true,
					tracks: [],
					type: 'playlist',
					uri: null
				})
				break
			}
			const sp = deemix.plugins.spotify.sp
			let playlist = await sp.getPlaylist(list_id)
			playlist = playlist.body
			let tracklist = playlist.tracks.items
			while (playlist.tracks.next) {
				const regExec = /offset=(\d+)&limit=(\d+)/g.exec(playlist.tracks.next)
				const offset = regExec![1]
				const limit = regExec![2]
				const playlistTracks = await sp.getPlaylistTracks(list_id, { offset, limit })
				playlist.tracks = playlistTracks.body
				tracklist = tracklist.concat(playlist.tracks.items)
			}
			tracklist.forEach((item: any, i: number) => {
				tracklist[i] = item.track
				tracklist[i].selected = false
			})
			playlist.tracks = tracklist
			res.send(playlist)
			break
		}
		default: {
			let releaseAPI, releaseTracksAPI
			try {
				releaseAPI = await dz.api[`get_${list_type}`](list_id)
				releaseTracksAPI = await dz.api[`get_${list_type}_tracks`](list_id)
				releaseTracksAPI = releaseTracksAPI.data
			} catch {
				if (list_type === 'playlist') {
					releaseAPI = dzUtils.map_playlist(await (await dz.gw.get_playlist_page(list_id)).DATA)
					releaseTracksAPI = await dz.gw.get_playlist_tracks(list_id)
				} else {
					releaseAPI = {}
					releaseTracksAPI = []
				}
			}

			const tracks: any[] = []
			const showdiscs =
				list_type === 'album' &&
				releaseTracksAPI.length &&
				releaseTracksAPI[releaseTracksAPI.length - 1].disk_number !== 1
			let current_disk = 0

			releaseTracksAPI.forEach((track: any) => {
				if (track.SNG_ID) track = dzUtils.map_track(track)
				if (showdiscs && parseInt(track.disk_number) !== current_disk) {
					current_disk = parseInt(track.disk_number)
					tracks.push({ type: 'disc_separator', number: current_disk })
				}
				track.selected = false
				tracks.push(track)
			})
			releaseAPI.tracks = tracks
			res.send(releaseAPI)
			break
		}
	}
}

const apiHandler: ApiHandler = { path, handler }

export default apiHandler
