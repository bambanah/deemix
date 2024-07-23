const { map_track, map_album } = require('deezer-js').utils
const { Artist } = require('./Artist.js')
const { Album } = require('./Album.js')
const { Playlist } = require('./Playlist.js')
const { Picture } = require('./Picture.js')
const { Lyrics } = require('./Lyrics.js')
const { Date: dzDate } = require('./Date.js')
const { VARIOUS_ARTISTS } = require('./index.js')
const { changeCase } = require('../utils/index.js')
const { FeaturesOption } = require('../settings.js')
const { NoDataToParse, AlbumDoesntExists } = require('../errors.js')

const {
  generateReplayGainString,
  removeDuplicateArtists,
  removeFeatures,
  andCommaConcat
} = require('../utils/index.js')

class Track {
  constructor () {
    this.id = '0'
    this.title = ''
    this.MD5 = ''
    this.mediaVersion = ''
    this.trackToken = ''
    this.trackTokenExpiration = 0
    this.duration = 0
    this.fallbackID = '0'
    this.albumsFallback = []
    this.filesizes = {}
    this.local = false
    this.mainArtist = null
    this.artist = { Main: [] }
    this.artists = []
    this.album = null
    this.trackNumber = '0'
    this.discNumber = '0'
    this.date = new dzDate()
    this.lyrics = null
    this.bpm = 0
    this.contributors = {}
    this.copyright = ''
    this.explicit = false
    this.ISRC = ''
    this.replayGain = ''
    this.playlist = null
    this.position = null
    this.searched = false
    this.bitrate = 0
    this.dateString = ''
    this.artistsString = ''
    this.mainArtistsString = ''
    this.featArtistsString = ''
    this.fullArtistsString = ''
    this.urls = {}
  }

  parseEssentialData (trackAPI) {
    this.id = String(trackAPI.id)
    this.duration = trackAPI.duration
    this.trackToken = trackAPI.track_token
    this.trackTokenExpiration = trackAPI.track_token_expire
    this.MD5 = trackAPI.md5_origin
    this.mediaVersion = trackAPI.media_version
    this.filesizes = trackAPI.filesizes
    this.fallbackID = '0'
    if (trackAPI.fallback_id) this.fallbackID = trackAPI.fallback_id
    this.local = parseInt(this.id) < 0
    this.urls = {}
  }

  async parseData (dz, id, trackAPI, albumAPI, playlistAPI) {
    /*     if (id && (!trackAPI || (trackAPI && !trackAPI.trackToken))) { */
    if (id) {
      let trackAPI_new = await dz.gw.get_track_with_fallback(id)
      trackAPI_new = map_track(trackAPI_new)
      if (!trackAPI) trackAPI = {}
      trackAPI = { ...trackAPI, ...trackAPI_new }
    } else if (!trackAPI) { throw new NoDataToParse() }

    this.parseEssentialData(trackAPI)

    // only public api has bpm
    if (!trackAPI.bpm && !this.local) {
      try {
        const trackAPI_new = await dz.api.get_track(trackAPI.id)
        trackAPI_new.release_date = trackAPI.release_date
        trackAPI = { ...trackAPI, ...trackAPI_new }
      } catch { /* empty */ }
    }

    if (this.local) {
      this.parseLocalTrackData(trackAPI)
    } else {
      this.parseTrack(trackAPI)

      // Get Lyrics Data
      if (!trackAPI.lyrics && this.lyrics.id !== '0') {
        try { trackAPI.lyrics = await dz.gw.get_track_lyrics(this.id) } catch { this.lyrics.id = '0' }
      }
      if (this.lyrics.id !== '0') { this.lyrics.parseLyrics(trackAPI.lyrics) }

      // Parse Album Data
      this.album = new Album(trackAPI.album.id, trackAPI.album.title, trackAPI.album.md5_origin || '')

      // Get album Data
      if (!albumAPI) {
        try { albumAPI = await dz.api.get_album(this.album.id) } catch { albumAPI = null }
      }

      // Get album_gw Data
      // Only gw has disk number
      if (!albumAPI || (albumAPI && !albumAPI.nb_disk)) {
        let albumAPI_gw
        try {
          albumAPI_gw = await dz.gw.get_album(this.album.id)
          albumAPI_gw = map_album(albumAPI_gw)
        } catch { albumAPI_gw = {} }
        if (!albumAPI) albumAPI = {}
        albumAPI = { ...albumAPI_gw, ...albumAPI }
      }

      if (!albumAPI) throw new AlbumDoesntExists()
      this.album.parseAlbum(albumAPI)

      // albumAPI_gw doesn't contain the artist cover
      // Getting artist image ID
      // ex: https://e-cdns-images.dzcdn.net/images/artist/f2bc007e9133c946ac3c3907ddc5d2ea/56x56-000000-80-0-0.jpg
      if (!this.album.mainArtist.pic.md5) {
        const artistAPI = await dz.api.get_artist(this.album.mainArtist.id)
        this.album.mainArtist.pic.md5 = artistAPI.picture_small.slice(artistAPI.picture_small.search('artist/') + 7, -24)
      }

      // Fill missing data
      if (this.album.date && !this.date) this.date = this.album.date
      if (trackAPI.genres) {
        trackAPI.genres.forEach((genre) => {
          if (!this.album.genre.includes(genre)) this.album.genre.push(genre)
        })
      }
    }

    // Remove unwanted charaters in track name
    // Example: track/127793
    this.title = this.title.replace(/\s\s+/g, ' ')

    // Make sure there is at least one artist
    if (!this.artist.Main.length) {
      this.artist.Main = [this.mainArtist.name]
    }
    this.position = trackAPI.position

    if (playlistAPI) { this.playlist = new Playlist(playlistAPI) }

    this.generateMainFeatStrings()
    return this
  }

  parseLocalTrackData (trackAPI) {
    // Local tracks has only the trackAPI_gw page and
    // contains only the tags provided by the file
    this.title = trackAPI.title
    this.album = new Album(trackAPI.album.title)
    this.album.pic = new Picture(
      trackAPI.md5_image || '',
      'cover'
    )
    this.mainArtist = new Artist('0', trackAPI.artist.name, 'Main')
    this.artists = [trackAPI.artist.name]
    this.artist = {
      Main: [trackAPI.artist.name]
    }
    this.album.artist = this.artist
    this.album.artists = this.artists
    this.album.date = this.date
    this.album.mainArtist = this.mainArtist
  }

  parseTrack (trackAPI) {
    this.title = trackAPI.title

    this.discNumber = trackAPI.disk_number
    this.explicit = trackAPI.explicit_lyrics
    this.copyright = trackAPI.copyright
    if (trackAPI.gain) this.replayGain = generateReplayGainString(trackAPI.gain)
    this.ISRC = trackAPI.isrc
    this.trackNumber = trackAPI.track_position
    this.contributors = trackAPI.song_contributors
    this.rank = trackAPI.rank
    this.bpm = trackAPI.bpm

    this.lyrics = new Lyrics(trackAPI.lyrics_id || '0')

    this.mainArtist = new Artist(
      trackAPI.artist.id,
      trackAPI.artist.name,
      'Main',
      trackAPI.artist.md5_image
    )

    if (trackAPI.physical_release_date) {
      this.date.day = trackAPI.physical_release_date.slice(8, 10)
      this.date.month = trackAPI.physical_release_date.slice(5, 7)
      this.date.year = trackAPI.physical_release_date.slice(0, 4)
      this.date.fixDayMonth()
    }

    trackAPI.contributors.forEach(artist => {
      const isVariousArtists = String(artist.id) === VARIOUS_ARTISTS
      const isMainArtist = artist.role === 'Main'

      if (trackAPI.contributors.length > 1 && isVariousArtists) return

      if (!this.artists.includes(artist.name)) { this.artists.push(artist.name) }

      if (isMainArtist || (!this.artist.Main.includes(artist.name) && !isMainArtist)) {
        if (!this.artist[artist.role]) { this.artist[artist.role] = [] }
        this.artist[artist.role].push(artist.name)
      }
    })

    if (trackAPI.alternative_albums) {
      trackAPI.alternative_albums.data.forEach(album => {
        if (album.RIGHTS.STREAM_ADS_AVAILABLE || album.RIGHTS.STREAM_SUB_AVAILABLE) { this.albumsFallback.push(album.ALB_ID) }
      })
    }
  }

  removeDuplicateArtists () {
    [this.artist, this.artists] = removeDuplicateArtists(this.artist, this.artists)
  }

  getCleanTitle () {
    return removeFeatures(this.title)
  }

  getFeatTitle () {
    if (this.featArtistsString && !this.title.toLowerCase().includes('feat.')) {
      return `${this.title} (${this.featArtistsString})`
    }
    return this.title
  }

  generateMainFeatStrings () {
    this.mainArtistsString = andCommaConcat(this.artist.Main)
    this.fullArtistsString = `${this.mainArtistsString}`
    this.featArtistsString = ''
    if (this.artist.Featured) {
      this.featArtistsString = `feat. ${andCommaConcat(this.artist.Featured)}`
      this.fullArtistsString += ` ${this.featArtistsString}`
    }
  }

  async checkAndRenewTrackToken (dz) {
    const now = new Date()
    const expiration = new Date(this.trackTokenExpiration * 1000)
    if (now > expiration) {
      const newTrack = await dz.gw.get_track_with_fallback(this.id)
      this.trackToken = newTrack.TRACK_TOKEN
      this.trackTokenExpiration = newTrack.TRACK_TOKEN_EXPIRE
    }
  }

  applySettings (settings) {
    // Check if should save the playlist as a compilation
    if (settings.tags.savePlaylistAsCompilation && this.playlist) {
      this.trackNumber = this.position
      this.discNumber = '1'
      this.album.makePlaylistCompilation(this.playlist)
    } else {
      if (this.album.date) this.date = this.album.date
    }
    this.dateString = this.date.format(settings.dateFormat)
    this.album.dateString = this.album.date.format(settings.dateFormat)
    if (this.playlist) this.playlist.dateString = this.playlist.date.format(settings.dateFormat)

    // Check various artist option
    if (settings.albumVariousArtists && this.album.variousArtists) {
      const artist = this.album.variousArtists
      const isMainArtist = artist.role === 'Main'

      if (!this.album.artists.includes(artist.name)) { this.album.artists.push(artist.name) }

      if (isMainArtist || (!this.album.artist.Main.includes(artist.name) && !isMainArtist)) {
        if (!this.album.artist[artist.role]) { this.album.artist[artist.role] = [] }
        this.album.artist[artist.role].push(artist.name)
      }
    }
    this.album.mainArtist.save = (!this.album.mainArtist.isVariousArtists() || (settings.albumVariousArtists && this.album.mainArtist.isVariousArtists()))

    // Check removeDuplicateArtists
    if (settings.removeDuplicateArtists) {
      this.removeDuplicateArtists()
      this.generateMainFeatStrings()
    }

    // Check if user wants the feat in the title
    if (settings.featuredToTitle === FeaturesOption.REMOVE_TITLE) {
      this.title = this.getCleanTitle()
    } else if (settings.featuredToTitle === FeaturesOption.MOVE_TITLE) {
      this.title = this.getFeatTitle()
    } else if (settings.featuredToTitle === FeaturesOption.REMOVE_TITLE_ALBUM) {
      this.title = this.getCleanTitle()
      this.album.title = this.album.getCleanTitle()
    }

    // Remove (Album Version) from tracks that have that
    if (settings.removeAlbumVersion && this.title.includes('Album Version')) {
      this.title = this.title.replace(/ ?\(Album Version\)/g, '').trim()
    }

    // Change title and artist casing if needed
    if (settings.titleCasing !== 'nothing') {
      this.title = changeCase(this.title, settings.titleCasing)
    }
    if (settings.artistCasing !== 'nothing') {
      this.mainArtist.name = changeCase(this.mainArtist.name, settings.artistCasing)
      this.artists.forEach((artist, i) => {
        this.artists[i] = changeCase(artist, settings.artistCasing)
      })
      Object.keys(this.artist).forEach((art_type) => {
        this.artist[art_type].forEach((artist, i) => {
          this.artist[art_type][i] = changeCase(artist, settings.artistCasing)
        })
      })
      this.generateMainFeatStrings()
    }

    // Generate artist tag
    if (settings.tags.multiArtistSeparator === 'default') {
      if (settings.featuredToTitle === FeaturesOption.MOVE_TITLE) {
        this.artistsString = this.artist.Main.join(', ')
      } else {
        this.artistString = this.artists.join(', ')
      }
    } else if (settings.tags.multiArtistSeparator === 'andFeat') {
      this.artistsString = this.mainArtistsString
      if (this.featArtistsString && settings.featuredToTitle !== FeaturesOption.MOVE_TITLE) { this.artistsString += ` ${this.featArtistsString}` }
    } else {
      const separator = settings.tags.multiArtistSeparator
      if (settings.featuredToTitle === FeaturesOption.MOVE_TITLE) {
        this.artistsString = this.artist.Main.join(separator)
      } else {
        this.artistsString = this.artists.join(separator)
      }
    }
  }
}

module.exports = {
  Track
}
