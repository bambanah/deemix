const tr = {
  globals: {
    welcome: 'DeemixFix\'e hoş geldin.',
    back: 'geri',
    loading: 'yükleniyor',
    download: 'İndir {thing}',
    by: '{artist} tarafından',
    in: '{album} içinde',
    download_hint: 'İndir',
    play_hint: 'Oynat',
    toggle_download_tab_hint: 'Genişlet/Daralt',
    clean_queue_hint: 'Tamamlananları Temizle',
    cancel_queue_hint: 'Hepsini ',
    listTabs: {
      empty: '',
      all: 'Tümü',
      top_result: 'top result',
      album: 'albüm | albümler',
      artist: 'sanatçı | sanatçılar',
      single: 'single | singlelar',
      title: 'başlık | başlıklar',
      track: 'Parça | Parçalar',
      trackN: '0 parça | {n} parça | {n} parça',
      releaseN: '0 yayınlanan | {n} yayınlanan | {n} yayınlanan',
      playlist: 'oynatma listesi | oynatma listeleri',
      compile: 'derleme | derlemeler',
      ep: 'kayıt | kayıtlar',
      spotifyPlaylist: 'spotify oynatma listesi | oynatma listeleri',
      releaseDate: 'yayınlanma tarihi',
      error: 'hata'
    }
  },
  about: {
    titles: {
      usefulLinks: 'Yararlı Bağlantılar',
      bugReports: 'Hata Raporları',
      contributing: 'Katkı Sağlayanlar',
      donations: 'Bağışlar',
      license: 'Lisans'
    },
    subtitles: {
      bugReports: "Deemix'te çalışmayan bir şey mi var?, Bize bildirin!",
      contributing: 'Projeye katkı sağlamak mı istiyorsun? Farklı yollardan sağlayabilirsin!',
      donations: 'Bütçe yardımı mı yapmak istiyorsun? Bağış yapabilirsin!'
    },
    usesLibrary:
   '<strong>deemix</strong> kendi kullanıcı arabiriminizi oluşturabileceğiniz, kendine özgü kütüphanesini kullanıyor.',
    thanks: ' <strong>rtonno</strong>, <strong>uhwot</strong> ve <strong>lollilol</strong>\'a bu projeye yaptığı katkılardan ve <strong>BasCurtiz</strong>\'e ikonlardan dolayı teşekkür ederim.',
    upToDate: {
      text: '{newsChannel} takip ederek güncellemelerden haberdar olun.',
      newsChannel: 'Telegramdaki haber kanalını'
    },
    officialWebsite: 'İlgili İnternet Sitemiz',
    officialRepo: 'İlgili Kütüphanemiz',
    officialWebuiRepo: 'İlgili Web Kullanıcı Arayüzü Kütüphanemiz.',
    officialSubreddit: 'İlgili Subreddit adresimiz',
    newsChannel: 'Haber Kanalı',
    questions: {
      text: 'Eğer uygulama ile ilgili sorularınız veya bir probleminiz varsa,ilk önce {subreddit} sorununuzu arayın. Eğer bir şey bulamazsanız, sorununuz ile ilgili bir gönderi paylaşabilirsiniz.',
      subreddit: 'subreddit adresinden'
    },
    beforeReporting: 'Bir hatayı bildirmeden önce, uygulamanın son sürümünde olduğunuza veya sorunun sizden kaynaklı olmayıp bir hata olduğuna emin olduktan sonra emin olun.',
    beSure: 'Hatanın başka cihazlarda da olduğunu doğrulayın ve <strong>Bildirilen</strong> bir hatayı tekrar bildirmeyin.',
    duplicateReports: 'Birbirinin aynısı olan hata bildirileri kapatılacaktır, o yüzden dikkatli olun.',
    dontOpenIssues: '<strong>Soru sormak</strong> için hata bildirisi yollamayın, bunun için bir subreddit adresimiz var.',
    newUI: {
      text: 'Eğer Phython kullanmakta iyiysen, ana kütüphaneyi kullanan bir kullanıcı arayüzü yapmayı deneyebilir, veya kütüphanedeki hataları düzeltmek için {repo}.',
      repo: 'deposuna değişiklik isteği yollayabilirsin'
    },
    acceptFeatures: 'Yeni özellikleri de kabul ediyorum, fakat karışık şeyleri kütüphaneye değil uygulamaya eklendiği için kabul edemiyorum.',
    otherLanguages: 'Eğer diğer programlama dillerinde kendine güveniyorsan, deemix\'i farklı dillere port etmeye çalışabilirsin!',
    understandingCode: 'Kodu anlamak için yardım mı lazım? Reddit üzerinden veya Telegramdan waLplanet\'e ulaş.',
    contributeWebUI: {
      text: 'Eğer Vue.js (JavaScript), HTML veya CSS biliyorsan, {webui}.',
      webui: 'Web Kullanıcı Arayüzüne katkıda bulanabilirsin'
    },
    itsFree: 'Bunun <strong>ücretsiz bir proje olduğunu</strong> ve <strong>geliştiricilerden önce</strong> sevdiğiniz sanatçıları desteklemeniz gerektiğini unutmayın.',
    notObligated: 'Kendinizi bağış yapmak zorunda hissetmeyin!, Sizi her halinizle seviyorum!',
    lincensedUnder: {
      text: 'Bu çalışma lisanslıdır: {gpl3}.',
      gpl3: 'GNU General Public License 3.0'
    }
  },
  charts: {
    title: 'Grafikler',
    changeCountry: 'Ülke Değiştir',
    download: 'Grafiği İndir'
  },
  errors: {
    title: '{name} Hatalı bulundu',
    ids: {
      invalidURL: 'URL geçersiz.',
      unsupportedURL: 'URL şimdilik desteklenmiyor',
      ISRCnotOnDeezer: 'ISRC parça deezerda bulunmuyor',
      notYourPrivatePlaylist: 'Başkalarının özel oynatma listelerini indiremezsin.',
      spotifyDisabled: 'Spotify Özellikleri doğru şekilde ayarlanmamış.',
      trackNotOnDeezer: 'Parça Deezer\'da bulunamadı!',
      albumNotOnDeezer: 'Albüm Deezer\'da bulunamadı!',
      notOnDeezer: 'Parça Deezer\'da yok!',
      notEncoded: 'Parça henüz dönüştürülmedi!',
      notEncodedNoAlternative: 'Parça henüz dönüştürülmedi ve alternatifi bulunamadı!',
      wrongBitrate: 'Parça, istenen kalitede bulunamadı!',
      wrongBitrateNoAlternative: 'Parça veya alternatifler istenen kalitede bulunamadı!',
      no360RA: 'Parça 360 Derece gerçekçi ses olarak bulunamadı!',
      notAvailable: 'Parça Deezer sunucularında bulunamadı!',
      notAvailableNoAlternative: 'Parça veya Alternatifleri Deezer sunucularında bulunamadı.!'
    }
  },
  favorites: {
    title: 'Favoriler',
    noPlaylists: 'Oynatma listesi bulunamadı.',
    noAlbums: 'Favori albümler bulunamadı.',
    noArtists: 'Favori sanatçılar bulunamadı.',
    noTracks: 'Favori parçalar bulunamadı.'
  },
  home: {
    needTologin: 'İndirmeden önce Deezer hesabına giriş yapmalısın.',
    openSettings: 'Ayarları Aç',
    sections: {
      popularPlaylists: 'Popüler Oynatma Listeleri',
      popularAlbums: 'En çok dinlenen albümler'
    }
  },
  linkAnalyzer: {
    info: 'İndirmeye çalıştığın link hakkında daha fazla bilgi için burayı kullanabilirsin.',
    useful: 'Mesela, ülkende dinlenebilir olmayan parçaların nerelerde var olduğunu bulmak için kullanabilirsin.',
    linkNotSupported: 'Bu link şimdilik desteklenmemektedir.',
    linkNotSupportedYet: 'Bu link şimdilik desteklenmiyor gibi duruyor, başkasını analiz etmeyi dene.',
    table: {
      id: 'ID',
      isrc: 'ISRC',
      upc: 'UPC',
      duration: 'Süre',
      diskNumber: 'Sıra numarası',
      trackNumber: 'Parça numarası',
      releaseDate: 'Yayınlanma tarihi',
      bpm: 'BPM',
      label: 'Etiketi',
      recordType: 'Kayıt Şekli',
      genres: 'Türü',
      tracklist: 'Parça listesi'
    }
  },
  search: {
    startSearching: 'Aramayı Başlat!',
    description:
   'Bir parçayı, tüm albümü, bir sanatçıyı, bir oynatma listesini... kısaca her şeyi aratabilirsin! Ayrıca Deezer Linki de yapıştırabilirsin!',
    fans: '{n} Hayranlar',
    noResults: 'Sonuç Bulunamadı',
    noResultsTrack: 'Parça bulunamadı',
    noResultsAlbum: 'Albüm bulunamadı',
    noResultsArtist: 'Sanatçı bulunamadı',
    noResultsPlaylist: 'Oynatma Listesi bulunamadı'
  },
  searchbar: 'İstediğin bir şeyi arat (ya da bir link yapıştır.)',
  downloads: 'İndirilenler',
  toasts: {
    addedToQueue: '{item} kuyruğa eklendi',
    alreadyInQueue: '{item} çoktan kuyrukta!',
    finishDownload: '{item} indirmesi tamamlandı.',
    allDownloaded: 'Tüm indirmeler tamamlandı!',
    refreshFavs: 'Yenileme tamamlandı.!',
    loggingIn: 'Giriş yapılıyor',
    loggedIn: 'Giriş yapıldı',
    alreadyLogged: 'Çoktan giriş yapıldı',
    loginFailed: 'Giriş yapılamadı',
    loggedOut: 'Oturum kapatıldı.',
    cancellingCurrentItem: 'Geçerli öğe iptal ediliyor.',
    currentItemCancelled: 'Geçerli öğe iptal edildi.',
    startAddingArtist: '{artist} albüm kuyruğa ekleniyor',
    finishAddingArtist: '{artist} albüm kuyruğa eklendi.',
    startConvertingSpotifyPlaylist: 'Spotify parçaları deezer parçalarına dönüştürülüyor.',
    finishConvertingSpotifyPlaylist: 'Spotify oynatma listesi dönüştürüldü.'
  },
  settings: {
    title: 'Ayarlar',
    language: 'Dil',
    login: {
      title: 'Giriş',
      loggedIn: '{username} olarak giriş yaptın.',
      arl: {
        question: 'Kendi ARL\'mi nasıl alırım?',
        update: 'ARL güncelle.'
      },
      logout: 'Çıkış'
    },
    appearance: {
      title: 'Görünüm',
      slimDownloadTab: 'İnce indirme sekmesi'
    },
    downloadPath: {
      title: 'İndirilen dizin'
    },
    templates: {
      title: 'Şablonlar',
      tracknameTemplate: 'Parça ismi şablonu',
      albumTracknameTemplate: 'Albüm parçası şablonu',
      playlistTracknameTemplate: 'Oynatma listesi parça şablonu'
    },
    folders: {
      title: 'Dosyalar',
      createPlaylistFolder: 'Oynatma listesi için dosya oluştur',
      playlistNameTemplate: 'Oynatma listesi dosyası şablonu',
      createArtistFolder: 'Sanatçı için dosya oluştur',
      artistNameTemplate: 'Sanatçı dosyası şablonu',
      createAlbumFolder: 'Albüm için dosya oluştur',
      albumNameTemplate: 'Albüm dosyası şablonu',
      createCDFolder: 'CDler için dosya oluştur',
      createStructurePlaylist: 'Oynatma  listeleri için dosya kökü oluştur',
      createSingleFolder: 'Singlelar için dosya kökü oluştur'
    },
    trackTitles: {
      title: 'Parça başlıkları',
      padTracks: 'İz Numaraları',
      paddingSize: 'İz Numaralarını değiştir',
      illegalCharacterReplacer: 'Illegal Karakter Düzenleyici'
    },
    downloads: {
      title: 'İndirilenler',
      queueConcurrency: 'Devam eden indirmeler',
      maxBitrate: {
        title: 'Tercih edilmiş Bitrateler (kaliteler)',
        9: 'FLAC 1411kbps',
        3: 'MP3 320kbps',
        1: 'MP3 128kbps'
      },
      overwriteFile: {
        title: 'Dosyaların üstüne yazmalı mıyım?',
        y: 'Evet, üstüne yaz',
        n: 'Hayır, üstüne yazma',
        t: 'Sadece izleri üstüne yaz'
      },
      fallbackBitrate: 'Bitrate düşürme',
      fallbackSearch: 'Düşürme ara',
      logErrors: 'Hatalar için günlük tut',
      logSearched: 'Aranmış parçalar için günlük tut',
      createM3U8File: 'Oynatma sıra listesi oluştur',
      syncedLyrics: '.lrc dosyaları oluştur (Senkronize şarkı sözleri)',
      playlistFilenameTemplate: 'Oynatma listesi şablonu',
      saveDownloadQueue: 'Uygulamayı kapatırken indirme kuyruğunu kaydet'
    },
    covers: {
      title: 'Albüm kapakları',
      saveArtwork: 'Kapakları kaydet',
      coverImageTemplate: 'Kapak ismi şablonu',
      saveArtworkArtist: 'Sanatçı fotoğrafını kaydet',
      artistImageTemplate: 'Şarkıcı fotoğraf şablonu',
      localArtworkSize: 'Yerel fotoğraf boyutu',
      embeddedArtworkSize: 'Gömülü fotoğraf boyutu',
      localArtworkFormat: {
        title: 'Yerel fotoğrafın hangi formatta olmasını istersin?',
        jpg: 'Jpeg dosyası',
        png: 'Png dosyası',
        both: 'Her ikisi'
      },
      jpegImageQuality: 'JPEG görüntü kalitesi'
    },
    tags: {
      head: 'Hangi izler kayıt edilsin?',
      title: 'Başlık',
      artist: 'Sanatçı',
      album: 'Albüm',
      cover: 'Kapak',
      trackNumber: 'Parça Numarası',
      trackTotal: 'Tüm Parça',
      discNumber: 'Plak Sayısı',
      discTotal: 'Tüm Plak',
      albumArtist: 'Sanatçı Albümü',
      genre: 'Tür',
      year: 'Yıl',
      date: 'Tarih',
      explicit: 'Cinsel içerikli şarkı sözleri',
      isrc: 'ISRC',
      length: 'Parça Uzunluğu',
      barcode: 'Albüm Barkodu (UPC)',
      bpm: 'BPM',
      replayGain: 'Ses Yüksekliği Normalleştirici',
      label: 'Albüm Etiketi',
      lyrics: 'Senkronize edilmemiş şarkı sözleri',
      copyright: 'Telif hakkı',
      composer: 'Besteleyen',
      involvedPeople: 'Alakalı Kişiler'
    },
    other: {
      title: 'Diğer',
      savePlaylistAsCompilation: 'Oynatma listelerini derleme olarak kaydet',
      useNullSeparator: 'Boşluk ayırıcı kullan',
      saveID3v1: 'ID3v1 dosyasını da kaydet',
      multiArtistSeparator: {
        title: 'Sanatçılarınızı nasıl ayırmak istersiniz?',
        nothing: 'Sadece ana sanatçıyı kaydet',
        default: 'Genel prosedür uygulansın',
        andFeat: 'Kullanılanlar & ve Feat.',
        using: 'Kullanılan "{separator}"'
      },
      singleAlbumArtist: 'Sadece ana albüm sanatçısını kaydet',
      albumVariousArtists: '"Çeşitli sanatçılar"ı sanatçı albümlerinde tut',
      removeAlbumVersion: '"Albüm Sürümü"nü parça başlığından çıkart',
      removeDuplicateArtists: 'Sanatçı topluluğunu çıkart',
      dateFormat: {
        title: 'FLAC dosyalar için zaman formatı',
        year: 'YYYY',
        month: 'AA',
        day: 'GG'
      },
      featuredToTitle: {
        title: 'Öne çıkan sanatçıları ne yapmalıyım?',
        0: 'Elleme',
        1: 'Başlıktan çıkart',
        3: 'Başlıktan ve albüm başlığından çıkart',
        2: 'Başlığa taşı'
      },
      titleCasing: 'Albüm harfi',
      artistCasing: 'Sanatçı harfi',
      casing: {
        nothing: 'Değiştirmeden bırak',
        lower: 'küçük harf',
        upper: 'BÜYÜK HARF',
        start: 'Kelimenin başı ile başla',
        sentence: 'Cümle gibi yap'
      },
      previewVolume: 'Ses önizlemesi',
      executeCommand: {
        title: 'İndirdikten sonra komut uygula',
        description: 'Bir şey yapmamak için boş bırak'
      }
    },
    spotify: {
      title: 'Spotify Özelliği',
      clientID: 'Spotify clientID',
      clientSecret: 'Spotify Client Secret',
      username: 'Spotify Kullanıcı Adı'
    },
    reset: 'Varsayılana sıfırla',
    save: 'Kaydet',
    toasts: {
      init: 'Ayarlar yüklendi!',
      update: 'Ayarlar güncellendi!',
      ARLcopied: 'ARL panoya kopyalandı!'
    }
  },
  sidebar: {
    home: 'Ana sayfa',
    search: 'Ara',
    charts: 'Grafikler',
    favorites: 'Favoriler',
    linkAnalyzer: 'Link Analizörü',
    settings: 'Ayarlar',
    about: 'Hakkında'
  },
  tracklist: {
    downloadSelection: 'İndirme bölümü'
  }
}

export default tr
