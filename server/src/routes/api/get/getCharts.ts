// @ts-expect-error
import { Deezer } from 'deezer-js'
import { ApiHandler } from '../../../types'
import { sessionDZ } from '../../../app'

const path: ApiHandler['path'] = '/getCharts'

let chartsCache: any

const handler: ApiHandler['handler'] = async (req, res) => {
	if (!chartsCache) {
		if (!sessionDZ[req.session.id]) sessionDZ[req.session.id] = new Deezer()
		const dz = sessionDZ[req.session.id]

		const chartsData = await dz.api.get_countries_charts()
		const countries: any[] = []
		chartsData.forEach((country: any) => {
			countries.push({
				title: country.title.replace('Top ', ''),
				id: country.id,
				picture_small: country.picture_small,
				picture_medium: country.picture_medium,
				picture_big: country.picture_big
			})
		})
		chartsCache = { data: countries }
	}
	res.send(chartsCache)
}

const apiHandler: ApiHandler = { path, handler }

export default apiHandler
