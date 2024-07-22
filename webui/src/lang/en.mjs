const en = {
  globals: {
    welcome: 'Welcome to DeemixFix',
    back: 'back',
    loading: 'loading',
    download: 'Download {thing}',
    by: 'by {artist}',
    in: 'in {album}',
    download_hint: 'Download',
    play_hint: 'Play',
    toggle_download_tab_hint: 'Expand/Collapse',
    clean_queue_hint: 'Clear Finished',
    cancel_queue_hint: 'Cancel All',
    open_downloads_folder: 'Open Downloads Folder',
    cut: 'cut',
    copy: 'copy',
    copyLink: 'copy link',
    copyImageLink: 'copy image link',
    copyDeezerLink: 'copy deezer link',
    paste: 'paste',
    listTabs: {
      empty: '',
      all: 'all',
      discography: 'discography',
      top_result: 'top result',
      album: 'album | albums',
      artist: 'artist | artists',
      single: 'single | singles',
      title: 'title | titles',
      track: 'track | tracks',
      playlist: 'playlist | playlists',
      compile: 'compilation | compilations',
      ep: 'ep | eps',
      bundle: 'bundle | bundles',
      more: 'More albums',
      featured: 'Featured in',
      spotifyPlaylist: 'spotify playlist | spotify playlists',
      releaseDate: 'release date',
      error: 'error',
      trackN: '0 tracks | {n} track | {n} tracks',
      albumN: '0 albums | {n} album | {n} albums',
      artistN: '0 artists | {n} artist | {n} artists',
      releaseN: '0 releases | {n} release | {n} releases',
      playlistN: '0 playlists | {n} playlist | {n} playlists'
    },
    yes: 'yes',
    no: 'no',
    empty: 'empty'
  },
  about: {
    appStatus: {
      online: 'app online',
      offline: 'app offline'
    },
    updates: {
      currentVersion: 'Current Version',
      currentWebuiVersion: 'Current WebUI Version',
      versionNotAvailable: 'N/A',
      updateAvailable: 'You\'re not running the latest version available: {version}',
      deemixVersion: 'deemix lib version'
    },
    titles: {
      usefulLinks: 'Useful Links',
      bugReports: 'Bug Reports',
      contributing: 'Contributing',
      donations: 'Donations',
      license: 'License'
    },
    subtitles: {
      bugReports: "Is there something that isn't working in deemix? Tell us!",
      contributing: 'You want to contribute to this project? You can do it in different ways!',
      donations: 'You want to contribute monetarily? You could make a donation!'
    },
    usesLibrary: 'This app uses the <strong>deemix</strong> library, which you can use to make your own UI for deemix.',
    thanks: 'Thanks to <strong>rtonno</strong>, <strong>uhwot</strong> and <strong>lollilol</strong> for helping me with this project and to <strong>BasCurtiz</strong> for making the icon.',
    upToDate: {
      text: 'Stay up to date with the updates by following the {newsChannel} on Telegram.',
      newsChannel: 'news channel'
    },
    officialWebsite: 'Official Website',
    officialRepo: 'Official Library Repository',
    officialWebuiRepo: 'Official WebUI Repository',
    officialSubreddit: 'Official Subreddit',
    newsChannel: 'News Channel',
    devlogChannel: 'Devlog Channel',
    questions: {
      text: 'If you have questions or problems with the app, search for a solution on the {subreddit} first. Then, if you don\'t find anything you can make a post with your issue on the subreddit.',
      subreddit: 'subreddit'
    },
    beforeReporting: 'Before reporting a bug make sure you\'re running the latest version of the app and that what you want to report is actually a bug and not something that\'s wrong only on your end.',
    beSure: 'Make sure the bug is reproducible on other machines and also <strong>DO NOT</strong> report a bug if it\'s already been reported.',
    duplicateReports: 'Duplicate bug reports will be closed, so keep an eye out on that.',
    dontOpenIssues: '<strong>DO NOT</strong> open issues for asking questions, there is a subreddit for that.',
    newUI: {
      text: 'If you\'re fluent in python you could try to make a new UI for the app using the base library, or fix bugs in the library with a pull request on the {repo}.',
      repo: 'repo'
    },
    acceptFeatures: 'I accept features as well, but no complex things, as they can be implementend directly in the app and not the library.',
    otherLanguages: 'If you\'re fluent in another programming language you could try to port deemix into other programming languages!',
    understandingCode: 'You need help understanding the code? Just hit waLplanet up on Telegram or Reddit.',
    contributeWebUI: {
      text: 'If you know Vue.js (JavaScript), HTML or CSS you could contribute to the {webui}.',
      webui: 'WebUI'
    },
    itsFree: 'You should remember that <strong>this is a free project</strong> and <strong>you should support the artists you love</strong> before supporting the developers.',
    notObligated: 'Don\'t feel obligated to donate, I appreciate you anyway!',
    lincensedUnder: {
      text: 'This work is licensed under the {gpl3}.',
      gpl3: 'GNU General Public License 3.0'
    }
  },
  charts: {
    title: 'Charts',
    changeCountry: 'Change Country',
    download: 'Download Chart'
  },
  errors: {
    title: 'Errors for {name}',
    postTitle: 'After download errors',
    ids: {
      invalidURL: 'URL not recognized',
      unsupportedURL: 'URL not supported yet',
      ISRCnotOnDeezer: 'Track ISRC is not available on Deezer',
      notYourPrivatePlaylist: "You can't download others private playlists.",
      spotifyDisabled: 'Spotify Features is not setted up correctly.',
      trackNotOnDeezer: 'Track not found on Deezer!',
      albumNotOnDeezer: 'Album not found on Deezer!',
      notOnDeezer: 'Track not available on Deezer!',
      notEncoded: 'Track not yet encoded!',
      notEncodedNoAlternative: 'Track not yet encoded and no alternative found!',
      wrongBitrate: 'Track not found at desired bitrate.',
      wrongBitrateNoAlternative: 'Track not found at desired bitrate and no alternative found!',
      no360RA: 'Track is not available in Reality Audio 360.',
      notAvailable: "Track not available on Deezer's servers!",
      notAvailableNoAlternative: "Track not available on Deezer's servers and no alternative found!",
      noSpaceLeft: 'No space left on the device!',
      albumDoesntExists: "Track's album doesn't exist, failed to gather info.",
      wrongLicense: "Your account can't stream tracks in {bitrate}.",
      wrongGeolocation: "Your account can't stream the track from your current country.",
      wrongGeolocationNoAlternative:
    "Your account can't stream the track from your current country and no alternative found."
    }
  },
  favorites: {
    title: 'Favorites',
    noPlaylists: 'No Playlists found',
    noAlbums: 'No Favorite Albums found',
    noArtists: 'No Favorite Artists found',
    noTracks: 'No Favorite Tracks found'
  },
  home: {
    needTologin: 'You need to log into your Deezer account before you can start downloading.',
    openSettings: 'Open Settings',
    sections: {
      popularPlaylists: 'Popular playlists',
      popularAlbums: 'Most streamed albums'
    }
  },
  linkAnalyzer: {
    info: 'You can use this section to find more information about the link you are trying to download.',
    useful: "This is useful if you're trying to download some tracks that are not available in your country and want to know where they are available, for instance.",
    linkNotSupported: 'This link is not yet supported',
    linkNotSupportedYet: 'Seems like this link is not yet supported, try analyzing another one.',
    table: {
      id: 'ID',
      isrc: 'ISRC',
      upc: 'UPC',
      duration: 'Duration',
      diskNumber: 'Disk Number',
      trackNumber: 'Track Number',
      releaseDate: 'Release Date',
      bpm: 'BPM',
      label: 'Label',
      recordType: 'Record Type',
      genres: 'Genres',
      tracklist: 'Tracklist',
      readable: 'Readable',
      available: 'Available'
    },
    countries: 'Countries',
    noCountries: 'This track is not available in any country.'
  },
  search: {
    startSearching: 'Start searching!',
    description: 'You can search a track, a whole album, an artist, a playlist.... everything! You can also paste a Deezer link',
    fans: '{n} fans',
    noResults: 'No results',
    noResultsTrack: 'No Tracks found',
    noResultsAlbum: 'No Albums found',
    noResultsArtist: 'No Artists found',
    noResultsPlaylist: 'No Playlists found',
    error: 'An error occurred, please try again later.'
  },
  searchbar: 'Search anything you want (or just paste a link)',
  downloads: 'downloads',
  toasts: {
    restoringQueue: 'Restoring download queue...',
    queueRestored: 'Download queue restored!',
    addedToQueue: '{item} added to queue',
    addedMoreToQueue: '{n} items added to queue',
    alreadyInQueue: '{item} is already in queue!',
    finishDownload: '{item} finished downloading.',
    allDownloaded: 'All downloads completed!',
    refreshFavs: 'Refresh completed!',
    loggingIn: 'Logging in...',
    loggedIn: 'Logged in',
    alreadyLogged: 'Already logged in',
    loginFailed: "Couldn't log in",
    loggedOut: 'Logged out',
    cancellingCurrentItem: 'Cancelling current item.',
    currentItemCancelled: 'Current item cancelled.',
    startAddingArtist: 'Adding {artist} albums to queue',
    finishAddingArtist: 'Added {artist} albums to queue',
    startConvertingSpotifyPlaylist: 'Converting spotify tracks to Deezer tracks',
    finishConvertingSpotifyPlaylist: 'Spotify playlist converted',
    loginNeededToDownload: 'You need to log in to download tracks!',
    queueErrorCantStream: 'Your account can\'t stream at {bitrate}!',
    deezerNotAvailable: 'Deezer is not available in your country. You should use a VPN.',
    deezerNotReachable: "The app can't reach Deezer. Check your internet connection, your firewall or your antivirus.",
    startGeneratingItems: 'Processing {n} items...',
    finishGeneratingItems: 'Generated {n} items.',
    noLovedPlaylist: 'No loved tracks playlist!',
    checkingUpdates: 'Checking for updates...',
    noUpdateAvailable: 'No updates found',
    updateAvailable: 'An update is available!',
    wrongSpotifyUsername: '{username} is not a valid spotify username'
  },
  settings: {
    title: 'Settings',
    language: 'Language',
    login: {
      title: 'Login',
      loggedIn: 'You are logged in as {username}',
      arl: {
        title: 'Use ARL instead',
        question: 'How do I get my own ARL?',
        howTo: {
          prologue: {
            p1: 'Deezer keeps track of login session by using a cookie called ARL.',
            p2: 'Deemix uses that cookie to get the metadata that it needs to download the tracks from Deezer.',
            p3: 'ARLs last for 3 months, after that Deezer asks you to log in again. The same method is used in deemix.',
            p4: 'Following one of the guides below you can get your own account ARL.',
            warning: 'Use this method only if email and password doesn\'t work.'
          },
          chromeSteps: {
            title: 'Chrome',
            step1: 'Open Chrome',
            easyWay: {
              title: 'Chrome (Easy way)',
              step3: 'Click on the little "lock" icon next the URL',
              step4: 'Click on Cookies > deezer.com > cookies > arl',
              step5: 'Select the string next to Content, and Copy'
            },
            step4: "Go under the Application tab (if you don't see it click the double arrow)",
            videoGuide: {
              text: "Here's a {videoGuide}",
              link: 'video guide'
            }
          },
          firefoxSteps: {
            title: 'Firefox',
            step1: 'Open Firefox',
            step4: "Go under the Storage tab (if you don't see it click the double arrow)"
          },
          commonSteps: {
            step2: 'Go to www.deezer.com and log into your account',
            step3: 'After logging in press F12 to open up Developer Tools',
            step5: 'Open the cookie dropdown',
            step6: 'Select www.deezer.com',
            step7: 'Find the `arl` cookie (It should be 192 chars long)',
            step8: 'Make sure only copy the value and not the entire cookie',
            lastStep: "That's your ARL, now you can use it in the app"
          }
        },
        update: 'Force Update ARL'
      },
      logout: 'Logout',
      login: 'Login',
      email: 'E-mail',
      password: 'Password'
    },
    appearance: {
      title: 'Appearance',
      slimDownloadTab: 'Slim download tab',
      slimSidebar: 'Slim Sidebar',
      searchButton: 'Show search button',
      bitrateTags: 'Show quality tag in download queue'
    },
    downloadPath: {
      title: 'Download Path'
    },
    templates: {
      title: 'Templates',
      tracknameTemplate: 'Trackname template',
      tracknameAvailableVariables: 'Available trackname variables',
      albumTracknameTemplate: 'Album track template',
      albumTracknameAvailableVariables: 'Available album track variables',
      playlistTracknameTemplate: 'Playlist track template',
      playlistTracknameAvailableVariables: 'Available playlist track variables'
    },
    folders: {
      title: 'Folders',
      createPlaylistFolder: 'Create folder for playlists',
      playlistNameTemplate: 'Playlist folder template',
      createArtistFolder: 'Create folder for artist',
      artistNameTemplate: 'Artist folder template',
      createAlbumFolder: 'Create folder for album',
      albumNameTemplate: 'Album folder template',
      createCDFolder: 'Create folder for CDs',
      createStructurePlaylist: 'Create folder structure for playlists',
      createSingleFolder: 'Create folder structure for singles'
    },
    trackTitles: {
      title: 'Track titles',
      padTracks: 'Pad tracks',
      paddingSize: 'Overwrite padding size',
      illegalCharacterReplacer: 'Illegal Character replacer'
    },
    downloads: {
      title: 'Downloads',
      queueConcurrency: 'Concurrent Downloads',
      maxBitrate: {
        title: 'Preferred Bitrate',
        9: 'FLAC 1411kbps',
        3: 'MP3 320kbps',
        1: 'MP3 128kbps'
      },
      overwriteFile: {
        title: 'Should I overwrite the files?',
        y: 'Yes, overwrite the file',
        n: "No, don't overwrite the file",
        t: 'Overwrite only the tags',
        b: 'No, keep both files and add a number to the duplicate',
        e: "No, and don't look at the extensions",
        l: 'Overwrite only if upgrading bitrate (mp3 only)'
      },
      fallbackBitrate: 'Bitrate fallback',
      fallbackSearch: 'Search fallback',
      fallbackISRC: 'Fallback with ISRC search',
      feelingLucky: 'Gamble with CDNs and caches',
      logErrors: 'Create log files for errors',
      logSearched: 'Create log files for searched tracks',
      createM3U8File: 'Create playlist file',
      syncedLyrics: 'Create .lrc files (Sync Lyrics)',
      playlistFilenameTemplate: 'Playlist filename template',
      clearQueueOnExit: 'Clear download queue when closing the app'
    },
    covers: {
      title: 'Album covers',
      saveArtwork: 'Save Covers',
      coverImageTemplate: 'Cover name template',
      saveArtworkArtist: 'Save artist image',
      artistImageTemplate: 'Artist image template',
      localArtworkSize: 'Local artwork size',
      embeddedArtworkSize: 'Embedded artwork size',
      localArtworkFormat: {
        title: 'What format do you want the local artwork to be?',
        jpg: 'A jpeg image',
        png: 'A png image',
        both: 'Both a jpeg and a png'
      },
      jpegImageQuality: 'JPEG image quality',
      embeddedArtworkPNG: 'Save embedded artwork as PNG',
      embeddedPNGWarning: 'PNGs are not officialy supported by Deezer and can be buggy',
      imageSizeWarning: 'Anything above x1200 is not officialy used by Deezer, you may encounter issues',
      coverDescriptionUTF8: 'Save cover description using UTF8 (iTunes Cover Fix)'
    },
    tags: {
      head: 'Which tags to save',
      title: 'Title',
      artist: 'Artist',
      artists: 'Extra ARTISTS tag',
      album: 'Album',
      cover: 'Cover',
      trackNumber: 'Track Number',
      trackTotal: 'Track Total',
      discNumber: 'Disc Number',
      discTotal: 'Disc Total',
      albumArtist: 'Album Artist',
      genre: 'Genre',
      year: 'Year',
      date: 'Date',
      explicit: 'Explicit Lyrics',
      isrc: 'ISRC',
      length: 'Track Length',
      barcode: 'Album Barcode (UPC)',
      bpm: 'BPM',
      replayGain: 'Replay Gain',
      label: 'Album Label',
      lyrics: 'Unsynchronized Lyrics',
      syncedLyrics: 'Synchronized Lyrics',
      copyright: 'Copyright',
      composer: 'Composer',
      involvedPeople: 'Involved People',
      source: 'Source and song ID',
      artistsWarning:
    'Disabling the ARTISTS tag while not using standard specification won\'t preserve multiartist support'
    },
    other: {
      title: 'Other',
      autoCheckForUpdates: 'Check for updates on startup',
      savePlaylistAsCompilation: 'Save playlists as compilation',
      useNullSeparator: 'Use null separator',
      saveID3v1: 'Save ID3v1 as well',
      multiArtistSeparator: {
        title: 'How would you like to separate your artists?',
        nothing: 'Save only the main artist',
        default: 'Using standard specification',
        andFeat: 'Using & and feat.',
        using: 'Using "{separator}"',
        warning: 'Using any separator other than the standard specification will add a extra ARTISTS tag to preserve multiartist support'
      },
      singleAlbumArtist: 'Save only the main album artist',
      albumVariousArtists: 'Keep "Various Artists" in the Album Artists',
      removeAlbumVersion: 'Remove "Album Version" from track title',
      removeDuplicateArtists: 'Remove combinations of artists',
      dateFormat: {
        title: 'Date format for FLAC files',
        year: 'YYYY',
        month: 'MM',
        day: 'DD'
      },
      featuredToTitle: {
        title: 'What should I do with featured artists?',
        0: 'Nothing',
        1: 'Remove it from the title',
        3: 'Remove it from the title and the album title',
        2: 'Move it to the title'
      },
      titleCasing: 'Title casing',
      artistCasing: 'Artist casing',
      casing: {
        nothing: 'Keep unchanged',
        lower: 'lowercase',
        upper: 'UPPERCASE',
        start: 'Start Of Each Word',
        sentence: 'Like a sentence'
      },
      previewVolume: 'Preview Volume',
      executeCommand: {
        title: 'Command to execute after download',
        description: 'Leave blank for no action'
      }
    },
    spotify: {
      title: 'Spotify Features',
      clientID: 'Spotify ClientID',
      clientSecret: 'Spotify Client Secret',
      username: 'Spotify Username',
      question: 'How do I enable Spotify Features?',
      howTo: {
        prologue: {
          p1: '"Spotify Features" is a set of features that lets you convert Spotify tracks and albums links into Deezer ones.',
          p2: 'If you provide a Spotify Playlist link the app will automatically convert all the links of the tracks inside it into deezer tracks.',
          p3: 'Enabling this set of features will let you see your public Spotify playlists in the favorites tab as well.'
        },
        info: 'For security reasons you will need to provide your own Client ID and Client Secret',
        clientSecretQuestion: {
          title: 'How do I get my Client ID and Client Secret?',
          step1: {
            text: 'Connect to {spotifyDevelopersDashboard} and login with your Spotify account.',
            spotifyDevelopersDashboard: "Spotify for Developers's Dashboard"
          },
          step2: {
            text: 'Click on "Create an App".',
            imageAlt: "Create an App button on Spotify for Developers's Dashboard"
          },
          step3: {
            text: 'Fill out the "App name" and "App description" fields and check both checkboxes. Then click on the "Create" button.',
            imageAlt: 'Create an app form'
          },
          step4: {
            text: 'Now you can see the Client ID. If you click on "Show Client Secret" the client secret will be revealed.',
            imageAlt: 'Screen of client ID and Secret'
          },
          step5: 'Now you can copy-paste those results in the appropriate fields in the settings.'
        },
        usernameQuestion: {
          title: 'How do I get my Spotify Username?',
          step1: {
            text: "You can get your Spotify Username from the {overviewPage} on Spotify's Website.",
            overviewPage: 'Overview page'
          }
        }
      }
    },
    reset: 'Reset to Default',
    resetMessage: 'Are you sure you want to go back to default settings?',
    save: 'Save',
    toasts: {
      init: 'Settings loaded!',
      update: 'Settings updated!',
      reset: 'Settings reset to default!',
      ARLcopied: 'ARL copied to clipboard'
    }
  },
  sidebar: {
    home: 'home',
    search: 'search',
    charts: 'charts',
    favorites: 'favorites',
    linkAnalyzer: 'link analyzer',
    settings: 'settings',
    logs: 'logs',
    about: 'about'
  },
  tracklist: {
    downloadSelection: 'Download selection'
  }
}

export default en
