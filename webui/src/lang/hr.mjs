const hr = {
  globals: {
    welcome: 'Dobrodošli u DeemixFix',
    back: 'nazad',
    loading: 'učitavanje',
    download: 'Preuzmi {thing}',
    by: 'by {artist}',
    in: 'u {album}',
    download_hint: 'Preuzmi',
    play_hint: 'Play',
    toggle_download_tab_hint: 'Proširi/Smanji',
    clean_queue_hint: 'Čišćenje završeno',
    cancel_queue_hint: 'Zaustavi sve',
    listTabs: {
      empty: '',
      all: 'sve',
      top_result: 'Najbolji rezultat',
      album: 'album | albumi',
      artist: 'izvođač | izvođači',
      single: 'singl | singlovi',
      title: 'naslov | naslovi',
      track: 'pjesma | pjesme',
      trackN: '0 pjesmi | {n} pjesma | {n} pjesme',
      releaseN: '0 izdanja | {n} izdanje | {n} izdanja',
      playlist: 'playlista | playliste',
      compile: 'kompilacija | kompilacije',
      ep: 'ep | eps',
      spotifyPlaylist: 'spotify playlista | spotify playliste',
      releaseDate: 'datum izdavanja',
      error: 'greška'
    }
  },
  about: {
    titles: {
      usefulLinks: 'Korisne poveznice',
      bugReports: 'Prijave grešaka',
      contributing: 'Doprinosi',
      donations: 'Donacije',
      license: 'Licenca'
    },
    subtitles: {
      bugReports: 'Postoji nešto što ne radi u deemixu? Reci nam!',
      contributing: 'Želiš doprinijeti ovom projektu? Možeš i to čak u više načina!',
      donations: 'Želiš doprijeniti odmah? Možeš donirati!'
    },
    usesLibrary:
   'Ova aplikacija koristi <strong>deemix</strong> biblioteku, koju možeš koristiti i ti kako bi napravio svoj UI za demix.',
    thanks: 'Hvala <strong>rtonno</strong>, <strong>uhwot</strong> i <strong>lollilol</strong> što su mi pomogli s ovim projektom te <strong>BasCurtiz</strong> što su napravili ikonu.',
    upToDate: {
      text: 'Ostani u tijeku s nadogradnjama prateći {newsChannel} na Telegramu.',
      newsChannel: 'kanal s novostima'
    },
    officialWebsite: 'Službena web stranica',
    officialRepo: 'Službeni repozitorij biblioteke',
    officialWebuiRepo: 'Službeni WebUI repozitorij',
    officialSubreddit: 'Službeni subreddit',
    newsChannel: 'Kanal s novostima',
    questions: {
      text: 'Ukoliko imate pitanja o aplikaciji, prvo potražite riješenje na {subreddit}. Tada, ako ne pronađete ništa, možete objaviti svoj problem na subredditu.',
      subreddit: 'subreddit'
    },
    beforeReporting: 'Prije prijavljivanja greške provjerite imate li instaliranu zadnju verziju aplikacije i da to što želite prijaviti je ustvari pogreška, a ne nešto što samo vama ne radi.',
    beSure: 'Provjerite može li se pogreška reproducirati i na drugim uređajima i također <strong>NEMOJTE</strong> prijavljivati grešku ako je već prijavljena.',
    duplicateReports: 'Duplicirane prijave o greški bit će zatvorene, tako da pripazite na to.',
    dontOpenIssues: '<strong>NEMOJTE</strong> otvarati issue za postavljanje pitanja, za to postoji subreddit.',
    newUI: {
      text: 'Ako ste vješti u pythonu možete probati napraviti novi UI za aplikaciju koristeći osnovnu biblioteku ili ispraviti pogrešku u biblioteci sa pull zahtjevom na {repo}.',
      repo: 'repozitoriju'
    },
    acceptFeatures: 'Prihavaćam i značajke, ali bez kompleksnih stvari, jer one mogu biti implementirane direktno u aplikaciji, a ne u biblioteci.',
    otherLanguages: 'Ako ste vješti u drugom programskom jezikumožete probati portati deemix u drugi programski jezik!',
    understandingCode: 'Trebate pomoć s razumijevanjem koda? Samo potraži waLplanet na Telegramu ili Redditu.',
    contributeWebUI: {
      text: 'Ako znaš Vue.js (JavaScript), HTML ili CSS možete doprinijeti za {webui}.',
      webui: 'WebUI'
    },
    itsFree: 'Trebate zapamtiti da je ovo <strong>besplatni projekt</strong> i <strong>trebali biste podržati autore koje volite</strong> prije podržavanja developera.',
    notObligated: 'Nemojte se osjećati obveznim darivati, svejedno vas cijenim!',
    lincensedUnder: {
      text: 'Ovaj rad licenciran je unutar {gpl3}.',
      gpl3: 'GNU General Public License 3.0'
    }
  },
  charts: {
    title: 'Ljestvice',
    changeCountry: 'Promijeni državu',
    download: 'Preuzmi ljestvicu'
  },
  errors: {
    title: 'Greške za {name}',
    ids: {
      invalidURL: 'URL nije prepoznat',
      unsupportedURL: 'URL još nije podržan',
      ISRCnotOnDeezer: 'Zapis ISRC još nije podržan na Deezeru',
      notYourPrivatePlaylist: 'Ne možete preuzeti tuđe privatne playliste.',
      spotifyDisabled: 'Spotify značajke nisu podešene ispravno.',
      trackNotOnDeezer: 'Pjesma nije pronađena na Deezeru!',
      albumNotOnDeezer: 'Album nije pronađen na Deezeru!',
      notOnDeezer: 'Pjesma nije dostupna na Deezeru!',
      notEncoded: 'Pjesma još nije enkodirana!',
      notEncodedNoAlternative: 'Pjesma još nije enkodirana i nije pronađena alternativa!',
      wrongBitrate: 'Pjesma nije pronađena u željenom bitrateu.',
      wrongBitrateNoAlternative: 'Pjesma nije pronađena u željenom bitrateu i nije pronađena alternativa!',
      no360RA: 'Pjesma nije dostupna u Reality Audio 360.',
      notAvailable: 'Pjesma nije dostupna na Deezerovim serverima!',
      notAvailableNoAlternative: 'Pjesma nije dostupna na Deezerovim serverima i alternativa nije pronađena!'
    }
  },
  favorites: {
    title: 'Favoriti',
    noPlaylists: 'Nisu pronađene playliste',
    noAlbums: 'Omiljeni albumi nisu pronađeni',
    noArtists: 'Omiljeni glazbenici nisu pronađeni',
    noTracks: 'Omiljene pjesme nisu pronađene'
  },
  home: {
    needTologin: 'Trebate se prijaviti sa svojim Deezer računom kako biste mogli početi preuzimati pjesme.',
    openSettings: 'Otvori postavke',
    sections: {
      popularPlaylists: 'Popularne playliste',
      popularAlbums: 'Najpreslušaniji album'
    }
  },
  linkAnalyzer: {
    info: 'Ovu sekciju možete koristiti kako biste saznali više informacija o linku koji pokušavate preuzeti.',
    useful:
   'Ovo je korisno ako pokušavate preuzeti pjesme koje još nisu dostupne u vašoj zemlji i želite, na primjer, znati gdje su dostupne.',
    linkNotSupported: 'Ovaj link još nije podržan',
    linkNotSupportedYet: 'Čini se da ovaj link još nije podržan, pokušaj analizirati neki drugi.',
    table: {
      id: 'ID',
      isrc: 'ISRC',
      upc: 'UPC',
      duration: 'Trajanje',
      diskNumber: 'Broj diska',
      trackNumber: 'Broj pjesme',
      releaseDate: 'Datum izadavanja',
      bpm: 'BPM',
      label: 'Izdavačka kuća',
      recordType: 'Vrsta zapisa',
      genres: 'Žanrovi',
      tracklist: 'Popis pjesama'
    }
  },
  search: {
    startSearching: 'Počni pretraživati!',
    description:
   'Možete pretražiti pjesmu, cijeli album, izvođača, playlistu... sve! Također, možete i zalijepiti Deezer link',
    fans: '{n} obožavatelja',
    noResults: 'Nema rezultata',
    noResultsTrack: 'Pjesme nisu pronađene',
    noResultsAlbum: 'Albumi nisu pronađeni',
    noResultsArtist: 'Izvođači nisu pronađeni',
    noResultsPlaylist: 'Playliste nisu pronađene'
  },
  searchbar: 'Pretraži bilo što (ili samo zalijepi link)',
  downloads: 'preuzimanja',
  toasts: {
    addedToQueue: '{item} dodan u red',
    alreadyInQueue: '{item} je već u redu!',
    finishDownload: '{item} završeno preuzimanje.',
    allDownloaded: 'Sva preuzimanja završena!',
    refreshFavs: 'Osvježavanje završeno!',
    loggingIn: 'Prijavljivanje...',
    loggedIn: 'Prijavljeni',
    alreadyLogged: 'Već prijavljeni',
    loginFailed: 'Prijava nije bila moguća',
    loggedOut: 'Odjavljeni',
    cancellingCurrentItem: 'Otkazujem trenutnu stavku.',
    currentItemCancelled: 'Trenutna stavka otkazana.',
    startAddingArtist: 'Dodajem {artist} album u red',
    finishAddingArtist: 'Dodan {artist} album u red',
    startConvertingSpotifyPlaylist: 'Pretvaram Spotify pjesme u Deezer pjesme',
    finishConvertingSpotifyPlaylist: 'Spotify playlista pretvorena',
    loginNeededToDownload: 'Trebate se prijaviti kako bi preuzeli pjesme!'
  },
  settings: {
    title: 'Postavke',
    language: 'Jezik',
    login: {
      title: 'Prijava',
      loggedIn: 'Prijavljeni ste kao {username}',
      arl: {
        question: 'Kako da dobijem svoj ARL?',
        update: 'Ažuriraj ARL'
      },
      logout: 'Odjavi se'
    },
    appearance: {
      title: 'Izgled',
      slimDownloadTab: 'Tanka kartica za preuzimanje'
    },
    downloadPath: {
      title: 'Putanja za preuzimanja'
    },
    templates: {
      title: 'Predlošci',
      tracknameTemplate: 'Naziv pjesme predložak',
      albumTracknameTemplate: 'Pjesma albuma predložak',
      playlistTracknameTemplate: 'Pjesma playliste predložak'
    },
    folders: {
      title: 'Mape',
      createPlaylistFolder: 'Izradi mapu za playliste',
      playlistNameTemplate: 'Mapa za playliste predložak',
      createArtistFolder: 'Izradi mapu za izvođača',
      artistNameTemplate: 'Izvođač mapa predložak',
      createAlbumFolder: 'Izradi mapu za album',
      albumNameTemplate: 'Album mapa predložak',
      createCDFolder: 'Izradi mapu za CD',
      createStructurePlaylist: 'Strkturiraj mape za playliste',
      createSingleFolder: 'Strukturiraj mape za singlove'
    },
    trackTitles: {
      title: 'Naslovi pjesama',
      padTracks: 'Pad tracks',
      paddingSize: 'Prepiši veličinu paddinga',
      illegalCharacterReplacer: 'Zamjena za nedozvoljeni znak'
    },
    downloads: {
      title: 'Preuzimanja',
      queueConcurrency: 'Istovremena preuzimanja',
      maxBitrate: {
        title: 'Željeni bitrate',
        9: 'FLAC 1411kbps',
        3: 'MP3 320kbps',
        1: 'MP3 128kbps'
      },
      overwriteFile: {
        title: 'Trebam li prepisati datoteke?',
        y: 'Da, prepiši datoteke',
        n: 'Ne, nemoj prepisati datoteke',
        t: 'Prepiši samo oznake',
        b: 'Ne, zadrži obje datoteke i dodaj broj duplikatu'
      },
      fallbackBitrate: 'Bitrate fallback',
      fallbackSearch: 'Pretraživanje fallback',
      logErrors: 'Izradi zapisnik datoteku za greške',
      logSearched: 'Izradi zapisnik datoteku za pretražene pjesme',
      createM3U8File: 'Izradi playlist datoteku',
      syncedLyrics: 'Izradi .lrc datoteke (sinkronizirani lyrics)',
      playlistFilenameTemplate: 'Naziv playliste predložak',
      saveDownloadQueue: 'Spremi red za preuzimanje prilikom zatvaranja aplikacije'
    },
    covers: {
      title: 'Omoti albuma',
      saveArtwork: 'Spremi omote',
      coverImageTemplate: 'Naziv omota predložak',
      saveArtworkArtist: 'Spremi sliku izvođača',
      artistImageTemplate: 'Slika izvođača predložak',
      localArtworkSize: 'Veličina lokalnog omota',
      embeddedArtworkSize: 'Veličina ugrađenog omota',
      localArtworkFormat: {
        title: 'U kojem formatu želite lokalni omot?',
        jpg: 'Jpeg slika',
        png: 'Png slika',
        both: 'I jpeg i png'
      },
      jpegImageQuality: 'JPEG kvaliteta slike'
    },
    tags: {
      head: 'Koja oznake spremam',
      title: 'Naslovi',
      artist: 'Izvođač',
      album: 'Album',
      cover: 'Omot',
      trackNumber: 'Broj pjesme',
      trackTotal: 'Ukupno pjesama',
      discNumber: 'Broj diska',
      discTotal: 'Ukupno diskova',
      albumArtist: 'Izvođač albuma',
      genre: 'Žanr',
      year: 'Godina',
      date: 'Datum',
      explicit: 'Eksplicitni lyrics',
      isrc: 'ISRC',
      length: 'Dužina pjesme',
      barcode: 'Album barkod (UPC)',
      bpm: 'BPM',
      replayGain: 'Replay Gain',
      label: 'Izdavačka kuća albuma',
      lyrics: 'Nesinkronizirani lyrics',
      copyright: 'Autorska prava',
      composer: 'Skladatelj',
      involvedPeople: 'Uključeni ljudi'
    },
    other: {
      title: 'Ostalo',
      savePlaylistAsCompilation: 'Spremi playliste kao kompilacije',
      useNullSeparator: 'Koristi null razdvojnik',
      saveID3v1: 'Spremi i ID3v1 također',
      multiArtistSeparator: {
        title: 'Kako biste željeli razdvojiti izvođače?',
        nothing: 'Spremi samo glavnog izvođača',
        default: 'Koristeći standardnu specifikaciju',
        andFeat: 'Koristeći & i feat.',
        using: 'Koristeći "{separator}"'
      },
      singleAlbumArtist: 'Spremi samo izvođača glavnog albuma',
      albumVariousArtists: 'Zadrži "Various Artists" u Izvođačima albuma',
      removeAlbumVersion: 'Izbriši "Album Version" iz naziva pjesme',
      removeDuplicateArtists: 'Izbriši kombinacije izvođača',
      dateFormat: {
        title: 'Format datuma za FLAC datoteke',
        year: 'YYYY',
        month: 'MM',
        day: 'DD'
      },
      featuredToTitle: {
        title: 'Što trebam napraviti s istaknutim izvođačima? (feat. i ft.)',
        0: 'Ništa',
        1: 'Izbriši ih iz naziva',
        3: 'Izbriši ih iz naziva i iz naziva albuma',
        2: 'Premjesti ih u naziv'
      },
      titleCasing: 'Veličina slova naslova',
      artistCasing: 'Veličina slova izvođača',
      casing: {
        nothing: 'Zadrži nepromijenjeno',
        lower: 'sve malo',
        upper: 'sve VELIKO',
        start: 'Početak Svake Riječi',
        sentence: 'Kao rečenica'
      },
      previewVolume: 'Volumen pregleda',
      executeCommand: {
        title: 'Naredba za izvršenje nakon preuzimanja',
        description: 'Ostavi prazno za bez akcije'
      }
    },
    spotify: {
      title: 'Spotify značajke',
      clientID: 'Spotify ClientID',
      clientSecret: 'Spotify Client Secret',
      username: 'Spotify korisničko ime'
    },
    reset: 'Resetiraj na zadano',
    save: 'Spremi',
    toasts: {
      init: 'Postavke učitane!',
      update: 'Postavke ažurirane!',
      ARLcopied: 'ARL kopiran u međuspremnik'
    }
  },
  sidebar: {
    home: 'početna',
    search: 'pretraživanje',
    charts: 'ljestvice',
    favorites: 'favoriti',
    linkAnalyzer: 'analizator linka',
    settings: 'postavke',
    about: 'o programu'
  },
  tracklist: {
    downloadSelection: 'Preuzmi selekciju'
  }
}

export default hr
