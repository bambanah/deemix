// @ts-expect-error
import { Deezer } from 'deezer-js'
import { ApiHandler } from '../../../types'
import { sessionDZ } from '../../../app'

const path: ApiHandler['path'] = '/logout'

const handler: ApiHandler['handler'] = (req, res) => {
	sessionDZ[req.session.id] = new Deezer()
	res.send({ logged_out: true })
}

const apiHandler: ApiHandler = { path, handler }

export default apiHandler
