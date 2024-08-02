const stream = require('stream')
const { promisify } = require('util')
const pipeline = promisify(stream.pipeline)
const { accessSync, constants } = require('fs')
const { ErrorMessages } = require('../errors.js')

const USER_AGENT_HEADER = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'

function canWrite (path) {
  try {
    accessSync(path, constants.R_OK | constants.W_OK)
  } catch {
    return false
  }
  return true
}

function generateReplayGainString (trackGain) {
  return `${Math.round((parseFloat(trackGain) + 18.4) * -100) / 100} dB`
}

function changeCase (txt, type) {
  switch (type) {
    case 'lower': return txt.toLowerCase()
    case 'upper': return txt.toUpperCase()
    case 'start':
      txt = txt.trim().split(' ')
      for (let i = 0; i < txt.length; i++) {
        if (['(', '{', '[', "'", '"'].some(bracket => (txt[i].length > 1 && txt[i].startsWith(bracket)))) {
          txt[i] = txt[i][0] + txt[i][1].toUpperCase() + txt[i].substr(2).toLowerCase()
        } else if (txt[i].length > 1) {
          txt[i] = txt[i][0].toUpperCase() + txt[i].substr(1).toLowerCase()
        } else {
          txt[i] = txt[i][0].toUpperCase()
        }
      }
      return txt.join(' ')
    case 'sentence': return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
    default: return txt
  }
}

function removeFeatures (title) {
  let clean = title
  let found = false
  let pos
  if (clean.search(/[\s(]\(?\s?feat\.?\s/gi) !== -1) {
    pos = clean.search(/[\s(]\(?\s?feat\.?\s/gi)
    found = true
  }
  if (clean.search(/[\s(]\(?\s?ft\.?\s/gi) !== -1) {
    pos = clean.search(/[\s(]\(?\s?ft\.?\s/gi)
    found = true
  }
  const openBracket = clean[pos] === '(' || clean[pos + 1] === '('
  const otherBracket = clean.indexOf('(', pos + 2)
  if (found) {
    let tempTrack = clean.slice(0, pos)
    if (clean.includes(')') && openBracket) { tempTrack += clean.slice(clean.indexOf(')', pos + 2) + 1) }
    if (!openBracket && otherBracket !== -1) { tempTrack += ` ${clean.slice(otherBracket)}` }
    clean = tempTrack.trim()
    clean = clean.replace(/\s\s+/g, ' ') // remove extra spaces
  }
  return clean
}

function andCommaConcat (lst) {
  const tot = lst.length
  let result = ''
  lst.forEach((art, i) => {
    result += art
    if (tot !== i + 1) {
      if (tot - 1 === i + 1) {
        result += ' & '
      } else {
        result += ', '
      }
    }
  })
  return result
}

function uniqueArray (arr) {
  arr.forEach((namePrinc, iPrinc) => {
    arr.forEach((nameRest, iRest) => {
      if (iPrinc !== iRest && nameRest.toLowerCase().includes(namePrinc.toLowerCase())) {
        arr.splice(iRest, 1)
      }
    })
  })
  return arr
}

function shellEscape (s) {
  if (typeof s !== 'string') return ''
  if (!(/[^\w@%+=:,./-]/g.test(s))) return s
  return "'" + s.replaceAll("'", "'\"'\"'") + "'"
}

function removeDuplicateArtists (artist, artists) {
  artists = uniqueArray(artists)
  Object.keys(artist).forEach((role) => {
    artist[role] = uniqueArray(artist[role])
  })
  return [artist, artists]
}

function formatListener (key, data) {
  let message = ''
  switch (key) {
    case 'startAddingArtist': return `Started gathering ${data.name}'s albums (${data.id})`
    case 'finishAddingArtist': return `Finished gathering ${data.name}'s albums (${data.id})`
    case 'updateQueue':
      message = `[${data.uuid}]`
      if (data.downloaded) message += ` Completed download of ${data.downloadPath.slice(data.extrasPath.length + 1)}`
      if (data.failed) message += ` ${data.data.artist} - ${data.data.title} :: ${data.error}`
      if (data.progress) message += ` Download at ${data.progress}%`
      if (data.conversion) message += ` Conversion at ${data.conversion}%`
      return message
    case 'downloadInfo':
      message = data.state
      switch (data.state) {
        case 'getTags': message = 'Getting tags.'; break
        case 'gotTags': message = 'Tags got.'; break
        case 'getBitrate': message = 'Getting download URL.'; break
        case 'bitrateFallback': message = 'Desired bitrate not found, falling back to lower bitrate.'; break
        case 'searchFallback': message = 'This track has been searched for, result might not be 100% exact.'; break
        case 'gotBitrate': message = 'Download URL got.'; break
        case 'getAlbumArt': message = 'Downloading album art.'; break
        case 'gotAlbumArt': message = 'Album art downloaded.'; break
        case 'downloading':
          message = 'Downloading track.'
          if (data.alreadyStarted) message += ` Recovering download from ${data.value}.`
          else message += ` Downloading ${data.value} bytes.`
          break
        case 'downloadTimeout': message = 'Deezer timedout when downloading track, retrying...'; break
        case 'downloaded': message = 'Track downloaded.'; break
        case 'alreadyDownloaded': message = 'Track already downloaded.'; break
        case 'tagging': message = 'Tagging track.'; break
        case 'tagged': message = 'Track tagged.'; break
        case 'stderr': return `ExecuteCommand Error: ${data.data.stderr}`
        case 'stdout': return `ExecuteCommand Output: ${data.data.stdout}`
      }
      return `[${data.uuid}] ${data.data.artist} - ${data.data.title} :: ${message}`
    case 'downloadWarn':
      message = `[${data.uuid}] ${data.data.artist} - ${data.data.title} :: ${ErrorMessages[data.state]} `
      switch (data.solution) {
        case 'fallback': message += 'Using fallback id.'; break
        case 'search': message += 'Searching for alternative.'; break
      }
      return message
    case 'currentItemCancelled': return `Current item cancelled (${data})`
    case 'removedFromQueue': return `[${data}] Removed from the queue`
    case 'finishDownload': return `[${data}] Finished downloading`
    case 'startConversion': return `[${data}] Started converting`
    case 'finishConversion': return `[${data.uuid}] Finished converting`
    default: return message
  }
}

module.exports = {
  USER_AGENT_HEADER,
  generateReplayGainString,
  removeFeatures,
  andCommaConcat,
  uniqueArray,
  removeDuplicateArtists,
  pipeline,
  canWrite,
  changeCase,
  shellEscape,
  formatListener
}
