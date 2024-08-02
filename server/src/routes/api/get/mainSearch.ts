// @ts-expect-error
import { Deezer } from 'deezer-js'
import { ApiHandler } from '../../../types'
import { sessionDZ } from '../../../app'

const path: ApiHandler['path'] = '/mainSearch'

const emptyResult = {
	QUERY: '',
	FUZZINNESS: true,
	AUTOCORRECT: false,
	ORDER: ['TOP_RESULT', 'TRACK', 'ARTIST', 'ALBUM', 'PLAYLIST'],
	TOP_RESULT: [],
	ARTIST: {
		data: [],
		count: 0,
		total: 0,
		filtered_count: 0,
		filtered_items: [],
		next: 20
	},
	ALBUM: {
		data: [],
		count: 0,
		total: 0,
		filtered_count: 0,
		filtered_items: [],
		next: 20
	},
	TRACK: {
		data: [],
		count: 0,
		total: 0,
		filtered_count: 0,
		filtered_items: [],
		next: 10
	},
	PLAYLIST: {
		data: [],
		count: 0,
		total: 0,
		filtered_count: 0,
		filtered_items: [],
		next: 20
	},
	RADIO: {
		data: [],
		count: 0,
		total: 0,
		filtered_count: 0,
		filtered_items: [],
		next: 20
	},
	USER: {
		data: [],
		count: 0,
		total: 0,
		filtered_count: 0,
		filtered_items: [],
		next: 20
	},
	SHOW: {
		data: [],
		count: 0,
		total: 0,
		filtered_count: 0,
		filtered_items: [],
		next: 20
	},
	CHANNEL: {
		data: [],
		count: 0,
		total: 0
	},
	LIVESTREAM: {
		data: [],
		count: 0,
		total: 0,
		filtered_count: 0,
		filtered_items: [],
		next: 20
	},
	EPISODE: {
		data: [],
		count: 0,
		total: 0,
		filtered_count: 0,
		filtered_items: [],
		next: 20
	},
	LYRICS: {
		data: [],
		count: 0,
		total: 0,
		filtered_count: 0,
		filtered_items: [],
		next: 20
	},
	ERROR: ''
}

const handler: ApiHandler['handler'] = async (req, res) => {
	if (!sessionDZ[req.session.id]) sessionDZ[req.session.id] = new Deezer()
	const dz = sessionDZ[req.session.id]

	const term = String(req.query.term)
	let results
	try {
		results = await dz.gw.search(term)
	} catch (e:any) {
		results = { ...emptyResult }
		results.QUERY = term
		results.ERROR = e.message
	}
	const order: string[] = []
	results.ORDER.forEach((element: string) => {
		if (['TOP_RESULT', 'TRACK', 'ALBUM', 'ARTIST', 'PLAYLIST'].includes(element)) order.push(element)
	})
	if (results.TOP_RESULT && results.TOP_RESULT.length) {
		const originalTopResult = results.TOP_RESULT[0]
		const topResult: any = {
			type: originalTopResult.__TYPE__
		}
		switch (topResult.type) {
			case 'artist':
				topResult.id = originalTopResult.ART_ID
				topResult.picture = `https://e-cdns-images.dzcdn.net/images/artist/${originalTopResult.ART_PICTURE}`
				topResult.title = originalTopResult.ART_NAME
				topResult.nb_fan = originalTopResult.NB_FAN
				break
			case 'album':
				topResult.id = originalTopResult.ALB_ID
				topResult.picture = `https://e-cdns-images.dzcdn.net/images/cover/${originalTopResult.ALB_PICTURE}`
				topResult.title = originalTopResult.ALB_TITLE
				topResult.artist = originalTopResult.ART_NAME
				topResult.nb_song = originalTopResult.NUMBER_TRACK
				break
			case 'playlist':
				topResult.id = originalTopResult.PLAYLIST_ID
				topResult.picture = `https://e-cdns-images.dzcdn.net/images/${originalTopResult.PICTURE_TYPE}/${originalTopResult.PLAYLIST_PICTURE}`
				topResult.title = originalTopResult.TITLE
				topResult.artist = originalTopResult.PARENT_USERNAME
				topResult.nb_song = originalTopResult.NB_SONG
				break
			default:
				topResult.id = '0'
				topResult.picture = 'https://e-cdns-images.dzcdn.net/images/cover'
				break
		}
		topResult.picture += '/156x156-000000-80-0-0.jpg'
		topResult.link = `https://deezer.com/${topResult.type}/${topResult.id}`
		results.TOP_RESULT = [topResult]
	}
	results.ORDER = order
	res.send(results)
}

const apiHandler: ApiHandler = { path, handler }

export default apiHandler
