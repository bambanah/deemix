import { ApiHandler } from '../../../types'
import { getAccessToken, getArlFromAccessToken } from '../../../app'

const path = '/loginEmail'

const handler: ApiHandler['handler'] = async (req, res) => {
	const { email, password } = req.body
	let accessToken = req.body.accessToken

	if (!accessToken) {
		accessToken = await getAccessToken(email, password)
		if (accessToken === 'undefined') accessToken = undefined
	}
	let arl
	if (accessToken) arl = await getArlFromAccessToken(accessToken)

	res.send({ accessToken, arl })
}

const apiHandler = { path, handler }

export default apiHandler
