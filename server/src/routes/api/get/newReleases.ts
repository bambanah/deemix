// @ts-expect-error
import { Deezer } from 'deezer-js'
import { ApiHandler } from '../../../types'
import { sessionDZ } from '../../../app'
import { getAlbumDetails } from './albumSearch'

const path: ApiHandler['path'] = '/newReleases'

const handler: ApiHandler['handler'] = async (req, res) => {
	if (!sessionDZ[req.session.id]) sessionDZ[req.session.id] = new Deezer()
	const dz = sessionDZ[req.session.id]

	const results = await dz.gw.get_page('channels/explore')

	const music_section = results.sections.find((e: any) =>
		e.section_id.includes('module_id=83718b7b-5503-4062-b8b9-3530e2e2cefa')
	)

	const channels = music_section.items.map((e: any) => e.target)

	const newReleasesByChannel = <any[][]>await Promise.all(channels.map((c: string) => channelNewReleases(dz, c)))

	const seen = new Set()
	const distinct: any[] = []

	newReleasesByChannel.forEach(l => {
		l.forEach(r => {
			if (!seen.has(r.ALB_ID)) {
				seen.add(r.ALB_ID)
				distinct.push(r)
			}
		})
	})

	distinct.sort((a, b) =>
		a.DIGITAL_RELEASE_DATE < b.DIGITAL_RELEASE_DATE ? 1 : b.DIGITAL_RELEASE_DATE < a.DIGITAL_RELEASE_DATE ? -1 : 0
	)

	const now = Date.now()
	const delta = 8 * 24 * 60 * 60 * 1000

	const recent = distinct.filter((x: any) => now - Date.parse(x.DIGITAL_RELEASE_DATE) < delta)

	const albums = await Promise.all(recent.map((c: any) => getAlbumDetails(dz, c.ALB_ID)))

	const output = {
		data: albums,
		total: albums.length
	}

	return res.send(output)
}

const apiHandler: ApiHandler = { path, handler }

export default apiHandler

async function channelNewReleases(dz: any, channelName: string): Promise<any[]> {
	const channelData = await dz.gw.get_page(channelName)
	const re = /^New.*releases$/

	const newReleases = channelData.sections.find((e: any) => re.test(e.title))

	if (!newReleases) {
		return []
	} else if ('target' in newReleases) {
		const showAll = await dz.gw.get_page(newReleases.target)
		return showAll.sections[0].items.map((e: any) => e.data)
	} else if ('items' in newReleases) {
		return newReleases.items.map((e: any) => e.data)
	} else {
		return []
	}
}
