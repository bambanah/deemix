import { RequestHandler } from 'express'
// @ts-expect-error
import { Deezer } from 'deezer-js'
import { sessionDZ } from '../../../app'
import { ApiHandler } from '../../../types'
import { logger } from '../../../helpers/logger'
import { saveLoginCredentials, resetLoginCredentials } from '../../../helpers/loginStorage'

export interface RawLoginArlBody {
	arl: string
	child?: number
}

const LoginStatus = {
	NOT_AVAILABLE: -1,
	FAILED: 0,
	SUCCESS: 1,
	ALREADY_LOGGED: 2,
	FORCED_SUCCESS: 3
}

const path: ApiHandler['path'] = '/loginArl'

const handler: RequestHandler<{}, {}, RawLoginArlBody, {}> = async (req, res, _) => {
	if (!sessionDZ[req.session.id]) sessionDZ[req.session.id] = new Deezer()
	const deemix = req.app.get('deemix')
	const dz = sessionDZ[req.session.id]
	const isSingleUser = req.app.get('isSingleUser')

	if (!req.body) {
		return res.status(400).send()
	}

	if (!req.body.arl) {
		return res.status(400).send()
	}

	const loginParams: (string | number)[] = [req.body.arl]

	// TODO Handle the child === 0 case, don't want to rely on the login_via_arl default param (it may change in the
	//  future)
	if (req.body.child) {
		loginParams.push(req.body.child)
	}

	let response

	if (process.env.NODE_ENV !== 'test') {
		if (!dz.logged_in) {
			try {
				response = await dz.login_via_arl(...loginParams)
			} catch (e) {
				logger.error(e)
				response = false
			}
			response = response ? 1 : 0
		} else {
			response = LoginStatus.ALREADY_LOGGED
		}
	} else {
		const testDz = new Deezer()
		response = await testDz.login_via_arl(...loginParams)
	}
	if (response === LoginStatus.FAILED) sessionDZ[req.session.id] = new Deezer()
	if (!(await deemix.isDeezerAvailable())) response = LoginStatus.NOT_AVAILABLE
	const returnValue = {
		status: response,
		arl: req.body.arl,
		user: dz.current_user,
		childs: dz.childs,
		currentChild: dz.selected_account
	}

	if (response !== LoginStatus.NOT_AVAILABLE && response !== LoginStatus.FAILED) {
		deemix.startQueue(dz)
		if (isSingleUser)
			saveLoginCredentials({
				accessToken: null,
				arl: returnValue.arl
			})
	} else if (isSingleUser) resetLoginCredentials()
	return res.status(200).send(returnValue)
}

const apiHandler = { path, handler }

export default apiHandler
