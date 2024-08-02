import fs from 'fs'
// @ts-expect-error
import deemix from 'deemix'
import { LoginFile } from '../types'

const configFolder = deemix.utils.localpaths.getConfigFolder()

const DEFAULTS: LoginFile = {
	accessToken: null,
	arl: null
}

let loginData: LoginFile = {
	accessToken: null,
	arl: null
}

export function loadLoginCredentials() {
	if (!fs.existsSync(configFolder)) fs.mkdirSync(configFolder)
	if (!fs.existsSync(configFolder + 'login.json')) resetLoginCredentials()

	try {
		loginData = JSON.parse(fs.readFileSync(configFolder + 'login.json').toString())
	} catch (e:any) {
		if (e.name === 'SyntaxError') resetLoginCredentials()
	}
}

export function getLoginCredentials(): LoginFile {
	if (!loginData.arl) loadLoginCredentials()
	return loginData
}

export function saveLoginCredentials(newLogin: LoginFile) {
	if (newLogin.arl) loginData.arl = newLogin.arl
	if (newLogin.accessToken) loginData.accessToken = newLogin.accessToken
	if (!fs.existsSync(configFolder)) fs.mkdirSync(configFolder)
	fs.writeFileSync(configFolder + 'login.json', JSON.stringify(loginData, null, 2))
}

export function resetLoginCredentials() {
	if (!fs.existsSync(configFolder)) fs.mkdirSync(configFolder)
	fs.writeFileSync(configFolder + 'login.json', JSON.stringify(DEFAULTS, null, 2))
	loginData = JSON.parse(JSON.stringify(DEFAULTS))
}
