import type { RequestHandler } from 'express'
// @ts-expect-error
import deemix from 'deemix'
// @ts-expect-error
import { Deezer } from 'deezer-js'

import type { ApiHandler, GetTrackResponse, GetAlbumResponse } from '../../../types'
import { sessionDZ } from '../../../app'

export interface AnalyzeQuery {
	term?: string
}

type ResBody = GetAlbumResponse | GetTrackResponse

const path: ApiHandler['path'] = '/analyzeLink'

const handler: RequestHandler<ResBody, {}, {}, AnalyzeQuery> = async (req, res) => {
	try {
		if (!req.query || !req.query.term) {
			return res.status(400).send({ errorMessage: 'No term specified', errorCode: 'AL01' })
		}

		const { term: linkToAnalyze } = req.query
		const [, linkType, linkId] = await deemix.parseLink(linkToAnalyze)
		const isTrackOrAlbum = ['track', 'album'].includes(linkType)

		if (isTrackOrAlbum) {
			if (!sessionDZ[req.session.id]) sessionDZ[req.session.id] = new Deezer()
			const dz = sessionDZ[req.session.id]
			const apiMethod = linkType === 'track' ? 'get_track' : 'get_album'
			const resBody: ResBody = await dz.api[apiMethod](linkId)

			return res.status(200).send(resBody)
		}

		return res.status(400).send({ errorMessage: 'Not supported', errorCode: 'AL02' })
	} catch (error) {
		return res
			.status(500)
			.send({ errorMessage: 'The server had a problem. Please try again', errorObject: error, errorCode: 'AL03' })
	}
}

const apiHandler: ApiHandler = { path, handler }

export default apiHandler
