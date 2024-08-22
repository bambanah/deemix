import Vue from 'vue'

import '@/plugins/composition-api'

import '@/styles/vendor/material-icons.css'
import '@/styles/vendor/OpenSans.css'

import '@/styles/css/tailwind.css'

import '@/styles/css/normalize.css'
import '@/styles/css/base.css'
import '@/styles/css/components.css'
import '@/styles/css/helpers.css'
import '@/styles/css/icons.css'
import '@/styles/css/tables.css'
import '@/styles/css/typography.css'

import App from '@/App.vue'
import i18n from '@/plugins/i18n'
import router from '@/router'
import store from '@/store'

import { socket } from '@/utils/socket'
import { fetchData, postToServer } from '@/utils/api'
import { toast } from '@/utils/toasts'
import { isValidURL } from '@/utils/utils'
import { sendAddToQueue } from '@/utils/downloads'
import { SPOTIFY_STATUS } from '@/constants'

/* ===== Random utils ===== */

 
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1)
}
// Reset if ejs fails
if (location.base == '<%= locationBase %>') location.base = '/'

/* ===== App initialization ===== */
async function startApp () {
  document.getElementById('missingBundle').remove()
  new Vue({
    store,
    router,
    i18n,
    render: h => h(App)
  }).$mount('#app')

  const connectResponse = await fetchData('connect')
  const spotifyStatus = connectResponse.spotifyEnabled ? SPOTIFY_STATUS.ENABLED : SPOTIFY_STATUS.DISABLED

  if (connectResponse.deezerAvailable === 'no-network') {
    document.getElementById('deezer_not_reachable').classList.remove('hide')
  }
  if (connectResponse.deezerAvailable === 'no') {
    document.getElementById('deezer_not_available').classList.remove('hide')
  }

  store.dispatch('setAppInfo', connectResponse.update).catch(console.error)
  store.dispatch('setSpotifyStatus', spotifyStatus).catch(console.error)

  let arl = localStorage.getItem('arl')
  let accessToken = localStorage.getItem('accessToken')

  if (connectResponse.singleUser) {
    if (connectResponse.singleUser.arl) arl = connectResponse.singleUser.arl
    if (connectResponse.singleUser.accessToken) accessToken = connectResponse.singleUser.accessToken
  }

  if (connectResponse.autologin) {
    console.info('Autologin')
    const accountNum = localStorage.getItem('accountNum')

    async function login (arl, accountNum) {
      toast(i18n.t('toasts.loggingIn'), 'loading', false, 'login-toast')
      arl = arl.trim()
      let result

      if (accountNum !== 0) {
        result = await postToServer('loginArl', { arl, force: true, child: accountNum || 0 })
      } else {
        result = await postToServer('loginArl', { arl })
      }

      return result
    }

    if (arl) {
      let result = await login(arl, accountNum)
      if (result.status === 0 && accessToken) {
        const { arl: newArl } = await postToServer('loginWithCredentials', { accessToken })
        if (newArl && newArl !== arl) {
          arl = newArl
          store.dispatch('setARL', { arl })
        }
        result = await login(newArl, accountNum)
      }
      loggedIn(result)
    }
  } else {
    loggedIn({ status: 3, user: connectResponse.currentUser, arl })
  }

  if (connectResponse.checkForUpdates) {
    toast(i18n.t('toasts.checkingUpdates'), 'loading', false, 'updates-toast')
    const updates = await fetchData('checkForUpdates')
    store.dispatch('setUpdateInfo', updates).catch(console.error)
    if (updates.updateAvailable) {
      toast(i18n.t('toasts.updateAvailable'), 'browser_updated', true, 'updates-toast')
    } else {
      toast(i18n.t('toasts.noUpdateAvailable'), 'done', true, 'updates-toast')
    }
  }
}

function initClient () {
  store.dispatch('setClientMode', true)
  setClientModeKeyBindings()
}

document.addEventListener('DOMContentLoaded', startApp)
if (window.api) {
  initClient()
}

/* ===== Global shortcuts ===== */

document.addEventListener('paste', pasteEvent => {
  if (pasteEvent.target.localName === 'input') return

  let pastedText = pasteEvent.clipboardData.getData('Text')

  if (isValidURL(pastedText)) {
    if (router.currentRoute.name === 'Link Analyzer') {
      socket.emit('analyzeLink', pastedText)
    } else {
      if (pastedText.includes('\n')) pastedText = pastedText.replace(/\n/g, ';')
      sendAddToQueue(pastedText)
    }
  } else {
    const searchbar = document.querySelector('#searchbar')
    searchbar.select()
    searchbar.setSelectionRange(0, 99999)
  }
})

/**
 * Sets up key bindings that already work in the browser (server mode)
 */
function setClientModeKeyBindings () {
  document.addEventListener('keyup', keyEvent => {
    // ALT + left
    if (keyEvent.altKey && keyEvent.key === 'ArrowLeft') {
      router.back()
    }

    // ALT + right
    if (keyEvent.altKey && keyEvent.key === 'ArrowRight') {
      router.forward()
    }
  })
}
function loggedIn (data) {
  const { status, user } = data

  switch (status) {
    case 1:
    case 3:
      // Login ok
      toast(i18n.t('toasts.loggedIn'), 'done', true, 'login-toast')

      store.dispatch('login', data)
      break
    case 2:
      // Already logged in
      toast(i18n.t('toasts.alreadyLogged'), 'done', true, 'login-toast')

      store.dispatch('setUser', user)
      break
    case 0:
      // Login failed
      toast(i18n.t('toasts.loginFailed'), 'close', true, 'login-toast')

      store.dispatch('removeARL')
      break
    case -1:
      toast(i18n.t('toasts.deezerNotAvailable'), 'close', true, 'login-toast')

		// TODO
		// $('#open_login_prompt').show()
		// document.getElementById('logged_in_info').classList.add('hide')
		// $('#settings_username').text('Not Logged')
		// $('#settings_picture').attr('src', `https://e-cdns-images.dzcdn.net/images/user/125x125-000000-80-0-0.jpg`)
		// document.getElementById('home_not_logged_in').classList.remove('hide')
  }
}

/* ===== Socketio listeners ===== */

// Debug messages for socketio
socket.on('message', function (msg) {
  console.log(msg)
})
socket.on('restoringQueue', function () {
  toast(i18n.t('toasts.restoringQueue'), 'loading', false, 'restoring_queue')
})

socket.on('cancellingCurrentItem', function (uuid) {
  toast(i18n.t('toasts.cancellingCurrentItem'), 'loading', false, 'cancelling_' + uuid)
})

socket.on('currentItemCancelled', function (uuid) {
  toast(i18n.t('toasts.currentItemCancelled'), 'done', true, 'cancelling_' + uuid)
})

socket.on('startAddingArtist', function (data) {
  toast(i18n.t('toasts.startAddingArtist', { artist: data.name }), 'loading', false, 'artist_' + data.id)
})

socket.on('finishAddingArtist', function (data) {
  toast(i18n.t('toasts.finishAddingArtist', { artist: data.name }), 'done', true, 'artist_' + data.id)
})

socket.on('startConvertingSpotifyPlaylist', function (id) {
  toast(i18n.t('toasts.startConvertingSpotifyPlaylist'), 'loading', false, 'spotifyplaylist_' + id)
})

socket.on('finishConvertingSpotifyPlaylist', function (id) {
  toast(i18n.t('toasts.finishConvertingSpotifyPlaylist'), 'done', true, 'spotifyplaylist_' + id)
})

socket.on('errorMessage', function (error) {
  toast(error, 'error')
})

socket.on('queueError', function (queueItem) {
  if (queueItem.errid) {
    toast(queueItem.link + ' - ' + i18n.t(`errors.ids.${queueItem.errid}`), 'error')
  } else {
    toast(queueItem.link + ' - ' + queueItem.error, 'error')
  }
})

socket.on('alreadyInQueue', function (data) {
  toast(i18n.t('toasts.alreadyInQueue', { item: data.title }), 'playlist_add_check')
})

socket.on('queueErrorNotLoggedIn', function () {
  toast(i18n.t('toasts.loginNeededToDownload'), 'report')
})
const bitrateLabels = {
  15: '360 HQ',
  14: '360 MQ',
  13: '360 LQ',
  9: 'FLAC',
  3: '320kbps',
  1: '128kbps',
  8: '128kbps',
  0: 'MP3'
}
socket.on('queueErrorCantStream', function (bitrate) {
  toast(i18n.t('toasts.queueErrorCantStream', { bitrate: bitrateLabels[bitrate] }), 'report')
})

socket.on('startGeneratingItems', function (data) {
  toast(i18n.t('toasts.startGeneratingItems', { n: data.total }), 'loading', false, 'batch_' + data.uuid)
})

socket.on('finishGeneratingItems', function (data) {
  toast(i18n.t('toasts.finishGeneratingItems', { n: data.total }), 'done', true, 'batch_' + data.uuid)
})
socket.on('toast', data => {
  const { msg, icon, dismiss, id } = data
  toast(msg, icon || null, dismiss !== undefined ? dismiss : true, id || null)
})
