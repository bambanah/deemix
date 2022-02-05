import { RequestHandler } from 'express'
// @ts-expect-error
import { Deezer } from 'deezer-js'

import { ApiHandler } from '../../../types'
import { sessionDZ } from '../../../app'

const path: ApiHandler['path'] = '/changeAccount'

interface ChangeAccountQuery {
	child: number
}

const handler: RequestHandler<{}, {}, {}, ChangeAccountQuery> = (req, res) => {
	if (!req.query || !req.query.child) {
		return res.status(400).send({ errorMessage: 'No child specified', errorCode: 'CA01' })
	}

	const { child: accountNum } = req.query

	if (!sessionDZ[req.session.id]) sessionDZ[req.session.id] = new Deezer()
	const dz = sessionDZ[req.session.id]

	const accountData = dz.change_account(accountNum)

	return res.status(200).send(accountData)
}

const apiHandler: ApiHandler = { path, handler }

export default apiHandler
