import { Server as WsServer } from 'ws'
import { logger } from '../../helpers/logger'
import { DeemixApp } from '../../app'
import { Settings, SpotifySettings } from '../../types'

const eventName = 'saveSettings'

export interface SaveSettingsData {
	settings: Settings
	spotifySettings: SpotifySettings
}

const cb = (data: SaveSettingsData, _: any, __: WsServer, deemix: DeemixApp) => {
	const { settings, spotifySettings } = data
	deemix.saveSettings(settings, spotifySettings)
	logger.info('Settings saved')
	deemix.listener.send('updateSettings', { settings, spotifySettings })
}

export default { eventName, cb }
