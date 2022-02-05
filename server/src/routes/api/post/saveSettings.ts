import { ApiHandler, Settings, SpotifySettings } from '../../../types'

const path = '/saveSettings'

export interface SaveSettingsData {
	settings: Settings
	spotifySettings: SpotifySettings
}

const handler: ApiHandler['handler'] = (req, res) => {
	const deemix = req.app.get('deemix')
	const { settings, spotifySettings }: SaveSettingsData = req.query
	deemix.saveSettings(settings, spotifySettings)
	deemix.listener.send('updateSettings', { settings, spotifySettings })
	res.send({ result: true })
}

const apiHandler = { path, handler }

export default apiHandler
