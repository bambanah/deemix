const th = {
  globals: {
    welcome: 'ยินดีต้อนรับสู่ DeemixFix',
    back: 'กลับ',
    loading: 'กำลังโหลด',
    download: 'ดาวน์โหลด {thing}',
    by: 'โดย {artist}',
    in: 'ใน {album}',
    download_hint: 'ดาวน์โหลด',
    play_hint: 'เล่น',
    toggle_download_tab_hint: 'ขยาย/ยุบ',
    clean_queue_hint: 'เคลียร์ที่ดาวน์โหลดเสร็จแล้ว',
    cancel_queue_hint: 'ยกเลิกทั้งหมด',
    open_downloads_folder: 'เปิดโฟลเดอร์ดาวน์โหลด',
    cut: 'ตัด',
    copy: 'คัดลอก',
    copyLink: 'คัดลอกลิงก์',
    copyImageLink: 'คัดลอกลิงค์รูปภาพ',
    copyDeezerLink: 'คัดลอกลิงค์ deezer',
    paste: 'วาง',
    listTabs: {
      empty: '',
      all: 'ทั้งหมด',
      top_result: 'ผลลัพธ์ที่ดีที่สุด',
      album: 'อัลบั้ม | อัลบั้ม',
      artist: 'ศิลปิน | ศิลปิน',
      single: 'ซิงเกิล | ซิงเกิล',
      title: 'ชื่อเพลง | ชื่อเพลง',
      track: 'เพลง | เพลง',
      releaseN: '0 เผยแพร่ | {n} เผยแพร่ | {n} เผยแพร่',
      playlist: 'เพลย์ลิสต์ | เพลย์ลิสต์',
      compile: 'อัลบั้มรวมเพลง | อัลบั้มรวมเพลง',
      ep: 'อีพี  | อีพี ',
      bundle: 'ชุดรวม | ชุดรวม',
      more: 'อัลบั้มเพิ่มเติม',
      featured: 'มีส่วนร่วมใน',
      spotifyPlaylist: 'เพลย์ลิสต์ Spotify | เพลย์ลิสต์ Spotify',
      releaseDate: 'วันที่เผยแพร่',
      error: 'ข้อผิดพลาด',
      trackN: '0 เพลง  | {n} เพลง  | {n} เพลง ',
      albumN: '0 อัลบั้ม | {n} อัลบั้ม | {n} อัลบั้ม',
      artistN: '0 ศิลปิน | {n} ศิลปิน | {n} ศิลปิน',
      playlistN: '0 เพลย์ลิสต์ | {n} เพลย์ลิสต์ | {n} เพลย์ลิสต์'
    }
  },
  about: {
    appStatus: {
      online: 'แอปออนไลน์',
      offline: 'แอปออฟไลน์'
    },
    updates: {
      currentVersion: 'รุ่นปัจจุบัน',
      currentWebuiVersion: 'รุ่น WebUI ปัจจุบัน',
      versionNotAvailable: 'ไม่มี',
      updateAvailable: 'คุณไม่ได้ใช้แอปรุ่นล่าสุดที่มี: {version}',
      deemixVersion: 'รุ่นไลบรารี deemix'
    },
    titles: {
      usefulLinks: 'ลิงก์ที่มีประโยชน์',
      bugReports: 'รายงานบั๊ก',
      contributing: 'การมีส่วนร่วม',
      donations: 'การบริจาค',
      license: 'สัญญาอนุญาต'
    },
    subtitles: {
      bugReports: 'มีบางอย่างใน deemix ที่ใช้งานไม่ได้หรือ บอกเราสิ!',
      contributing: 'คุณต้องการมีส่วนร่วมในโครงการนี้หรือไม่? คุณสามารถทำได้หลายวิธี!',
      donations: 'หากคุณต้องการมีส่วนช่วยเหลือด้านการเงิน? คุณสามารถบริจาคได้!'
    },
    usesLibrary: 'แอปนี้ใช้ไลบรารี <strong>deemix</strong> ซึ่งคุณสามารถใช้เพื่อสร้าง UI ของคุณเองสำหรับ deemix',
    thanks: 'ขอขอบคุณ <strong>rtonno</strong>, <strong>uhwot</strong> และ <strong>lolililol</strong> ที่ช่วยเหลือผมในโครงการนี้และ <strong>BasCurtiz</strong> ที่ช่วยทำไอคอนแอป',
    upToDate: {
      text: 'ติดตามการอัปเดตผ่าน {newsChannel} ใน Telegram.',
      newsChannel: 'แชนแนลข่าวสาร'
    },
    officialWebsite: 'เว็บไซต์หลัก',
    officialRepo: 'พื้นที่เก็บข้อมูลไลบรารีหลัก',
    officialWebuiRepo: 'พื้นที่เก็บข้อมูล WebUI หลัก',
    officialSubreddit: 'ซับเรดดิตหลัก',
    newsChannel: 'แชนแนลข่าวสาร',
    questions: {
      text: 'หากคุณมีข้อสงสัยหรือพบปัญหาเกี่ยวกับแอป ให้ค้นหาแนวทางแก้ไขใน{subreddit}ก่อน ถ้าไม่พบปัญหาที่เหมือนกันกับกรณีของคุณก็ให้คุณสร้างโพสต์ใหม่',
      subreddit: 'ซับเรดดิต'
    },
    beforeReporting: 'ก่อนที่จะรายงานจุดบกพร่อง ตรวจสอบให้แน่ใจว่าคุณกำลังใช้งานแอปเวอร์ชันล่าสุดและสิ่งที่คุณต้องการรายงานนั้นเป็นข้อบกพร่องจริง ๆ และไม่ใช่สิ่งผิดปกติที่เกิดขึ้นในเครื่องของคุณเท่านั้น',
    beSure: 'ตรวจสอบให้แน่ใจว่าสามารถทำบักซ้ำได้บนเครื่องอื่น และ <strong>อย่า</strong> รายงานจุดบกพร่องหากมีการรายงานเข้ามาแล้ว',
    duplicateReports: 'การรายงานข้อผิดพลาดที่ซ้ำกันจะถูกปิด ดังนั้นโปรดดูให้ดี',
    dontOpenIssues: '<strong>ห้าม</strong>Open Issue เพื่อถามคำถาม เรามีซับเรดดิตไว้สำหรับการตอบคำถามแล้ว',
    newUI: {
      text: 'หากคุณถนัดภาษา python คุณสามารถลองสร้าง UI สำหรับแอปโดยใช้งานไลบราลีนี้ได้ หรือแก้บั๊กด้วยการส่ง pull request มายัง {repo}.',
      repo: 'repo'
    },
    acceptFeatures: 'เราเปิดรับคุณสมบัติใหม่ด้วย แต่ต้องไม่ใช่สิ่งที่ซับซ้อน เพราะสามารถปรับใช้งานได้โดยตรงในแอป ไม่ใช่ในไลบรารี',
    otherLanguages: 'หากคุณถนัดการเขียนโปรแกรมด้วยภาษาอื่น คุณสามารถลองพอร์ต deemix เป็นภาษาโปรแกรมอื่น ๆ ได้!',
    understandingCode: 'หากคุณต้องการความช่วยเหลือในการทำความเข้าใจโค้ด สามารถติดต่อ waLplanet ได้ทาง Telegram หรือ Reddit',
    contributeWebUI: {
      text: 'หากคุณถนัดภาษา Vue.js (JavaScript), HTML หรือ CSS คุณสามารถมีส่วนร่วมในการพัฒนา {webui} ได้',
      webui: 'WebUI'
    },
    itsFree: 'พึงระลึกเสมอว่า <strong>นี่เป็นโปรเจ็กต์ฟรี</strong>และ<strong>คุณควรสนับสนุนศิลปินที่คุณรัก</strong> ก่อนที่จะสนับสนุนนักพัฒนาโปรแกรมนี้',
    notObligated: 'อย่ารู้สึกว่าโดนบังคับให้บริจาค ยังไงก็เราก็ขอขอบคุณ!',
    lincensedUnder: {
      text: 'ผลงานนี้ใช้{gpl3}.',
      gpl3: 'สัญญาอนุญาตสาธารณะทั่วไปของกนู 3.0'
    }
  },
  charts: {
    title: 'ชาร์ตเพลง',
    changeCountry: 'เปลี่ยนประเทศ',
    download: 'ดาวน์โหลดเพลงทั้งชาร์ต'
  },
  errors: {
    title: 'ข้อผิดพลาด {name}',
    ids: {
      invalidURL: 'ไม่รู้จัก URL นี้',
      unsupportedURL: 'ยังไม่รองรับ URL นี้',
      ISRCnotOnDeezer: 'ไม่มีรหัส ISRC ของเพลงนี้บน Deezer',
      notYourPrivatePlaylist: 'คุณไม่สามารถดาวน์โหลดเพลย์ลิสต์ส่วนตัวของผู้อื่นได้',
      spotifyDisabled: 'คุณสมบัติ Spotify ไม่ได้รับการตั้งค่าอย่างถูกต้อง',
      trackNotOnDeezer: 'ไม่พบเพลงนี้ใน Deezer!',
      albumNotOnDeezer: 'ไม่พบอัลบั้มนี้ใน Deezer!',
      notOnDeezer: 'เพลงนี้ไม่พร้อมใช้งานใน  Deezer!',
      notEncoded: 'เพลงยังไม่ได้เข้ารหัส!',
      notEncodedNoAlternative: 'เพลงยังไม่ได้เข้ารหัสและไม่พบทางเลือกอื่น!',
      wrongBitrate: 'ไม่พบเพลงที่ต้องการในอัตราบิตเรตนี้',
      wrongBitrateNoAlternative: 'ไม่พบเพลงที่ต้องการในอัตราบิตเรตนี้ และไม่พบตัวเลือกอื่น!',
      no360RA: 'เพลงนี้ไม่มีในรูปแบบ Reality Audio 360.',
      notAvailable: 'เพลงนี้ไม่พร้อมใช้งานบนเซิร์ฟเวอร์ของ Deezer!',
      notAvailableNoAlternative: 'เพลงนี้ไม่พร้อมใช้งานบนเซิร์ฟเวอร์ของ Deezer และไม่พบทางเลือกอื่น!',
      noSpaceLeft: 'ไม่มีพื้นที่เหลือบนอุปกรณ์!',
      albumDoesntExists: 'ไม่มีอัลบั้มของเพลงนี้ ไม่สามารถรวบรวมข้อมูลได้',
      wrongLicense: 'บัญชีของคุณไม่สามารถสตรีมเพลงในบิตเรตที่ต้องการได้',
      wrongGeolocation: 'บัญชีของคุณไม่สามารถสตรีมเพลงจากประเทศปัจจุบันของคุณได้'
    }
  },
  favorites: {
    title: 'รายการที่ชื่นชอบ',
    noPlaylists: 'ไม่พบเพลย์ลิสต์ที่ชื่นชอบ',
    noAlbums: 'ไม่พบอัลบั้มที่ชื่นชอบ',
    noArtists: 'ไม่พบศิลปินที่ชื่นชอบ',
    noTracks: 'ไม่พบเพลงที่ชื่นชอบ'
  },
  home: {
    needTologin: 'คุณต้องลงชื่อเข้าใช้บัญชี Deezer ของคุณก่อนจึงจะสามารถเริ่มการดาวน์โหลดได้',
    openSettings: 'เปิดการตั้งค่า',
    sections: {
      popularPlaylists: 'เพลย์ลิสต์ยอดนิยม',
      popularAlbums: 'อัลบั้มที่มีการสตรีมมากที่สุด'
    }
  },
  linkAnalyzer: {
    info: 'คุณสามารถใช้ส่วนนี้เพื่อค้นหาข้อมูลเพิ่มเติมเกี่ยวกับลิงก์ที่คุณกำลังพยายามดาวน์โหลด',
    useful:
   'หากคุณต้องการดาวน์โหลดเพลงที่ไม่พร้อมงานในประเทศของคุณ และต้องการทราบว่าเพลงเหล่านั้นพร้อมใช้งานในประเทศไหน ตัววิเคราะห์ลิงก์นี้อาจช่วยคุณได้',
    linkNotSupported: 'ลิงก์นี้ยังไม่รองรับ',
    linkNotSupportedYet: 'ดูเหมือนว่าลิงก์นี้ยังไม่รองรับ ลองวิเคราะห์ลิงก์อื่น',
    table: {
      id: 'ID',
      isrc: 'ISRC',
      upc: 'UPC',
      duration: 'ระยะเวลา',
      diskNumber: 'หมายเลขดิสก์',
      trackNumber: 'หมายเลขเพลง',
      releaseDate: 'วันที่เผยแพร่',
      bpm: 'BPM',
      label: 'ค่ายเพลง',
      recordType: 'ประเภทการบันทึกเสียง',
      genres: 'ประเภท',
      tracklist: 'รายชื่อเพลง'
    }
  },
  search: {
    startSearching: 'เริ่มการค้นหา!',
    description: 'คุณสามารถค้นหาเพลงทั้งอัลบั้ม ศิลปิน เพลย์ลิสต์.... อะไรได้ทั้งนั้น! หรือจะวางลิงก์ Deezer ก็ได้',
    fans: 'แฟนเพลง {n} คน',
    noResults: 'ไม่มีผลลัพธ์',
    noResultsTrack: 'ไม่พบเพลง',
    noResultsAlbum: 'ไม่พบอัลบั้ม',
    noResultsArtist: 'ไม่พบศิลปิน',
    noResultsPlaylist: 'ไม่พบเพลย์ลิสต์'
  },
  searchbar: 'ค้นหาเพลงที่คุณต้องการ (หรือจะวางลิงก์ก็ได้)',
  downloads: 'ดาวน์โหลด',
  toasts: {
    restoringQueue: 'กำลังกู้คืนคิวการดาวน์โหลด...',
    queueRestored: 'กู้คืนคิวดาวน์โหลดแล้ว!',
    addedToQueue: '{item} ถูกเพิ่มในคิวแล้ว',
    addedMoreToQueue: 'เพิ่ม {n} รายการในคิวแล้ว',
    alreadyInQueue: '{item} อยู่ในคิวแล้ว!',
    finishDownload: 'ดาวน์โหลด {item} เสร็จแล้ว',
    allDownloaded: 'การดาวน์โหลดทั้งหมดเสร็จสิ้น!',
    refreshFavs: 'รีเฟรชเสร็จแล้ว!',
    loggingIn: 'กำลังเข้าสู่ระบบ...',
    loggedIn: 'เข้าสู่่ระบบแล้ว',
    alreadyLogged: 'เข้าสู่่ระบบอยู่แล้ว',
    loginFailed: 'ไม่สามารถเข้าสู่ระบบได้',
    loggedOut: 'ออกจากระบบแล้ว',
    cancellingCurrentItem: 'กำลังยกเลิกรายการปัจจุบัน',
    currentItemCancelled: 'รายการปัจจุบันถูกยกเลิกแล้ว',
    startAddingArtist: 'กำลังเพิ่มอัลบั้มของ {artist} ไปยังคิว',
    finishAddingArtist: 'เพิ่มอัลบั้มของ {artist} ไปยังคิวแล้ว',
    startConvertingSpotifyPlaylist: 'กำลังแปลงเพลงจาก Spotify เป็นเพลง Deezer',
    finishConvertingSpotifyPlaylist: 'แปลงเพลย์ลิสต์ Spotify แล้ว',
    loginNeededToDownload: 'คุณต้องเข้าสู่ระบบเพื่อดาวน์โหลดแทร็ก!',
    deezerNotAvailable: 'Deezer ไม่มีการให้บริการในประเทศของคุณ คุณควรใช้ VPN',
    startGeneratingItems: 'กำลังประมวลผล {n} รายการ...',
    finishGeneratingItems: 'สร้างแล้ว {n} รายการ'
  },
  settings: {
    title: 'การตั้งค่า',
    language: 'ภาษา',
    login: {
      title: 'เข้าสู่ระบบ',
      loggedIn: 'คุณเข้าสู่ระบบด้วย {username}',
      arl: {
        question: 'ฉันจะหารหัส ARL ของตัวเองได้อย่างไร?',
        update: 'อัปเดต ARL'
      },
      logout: 'ออกจากระบบ',
      login: 'เข้าสู่ระบบผ่าน deezer.com'
    },
    loginWithCredentials: {
      title: 'เข้าสู่ระบบด้วยรหัสรับรองตัวตน',
      login: 'เข้าสู่ระบบ'
    },
    appearance: {
      title: 'หน้าตาแอป',
      slimDownloadTab: 'ลดขนาดแถบดาวน์โหลด',
      slimSidebar: 'ลดขนาดแถบด้านข้าง'
    },
    downloadPath: {
      title: 'ตำแหน่งการดาวน์โหลด'
    },
    templates: {
      title: 'เทมเพลต',
      tracknameTemplate: 'เทมเพลตชื่อเพลง',
      tracknameAvailableVariables: 'ตัวแปรชื่อเพลงที่ใช้ได้',
      albumTracknameTemplate: 'เทมเพลตอัลบั้มเพลง',
      albumTracknameAvailableVariables: 'ตัวแปรชื่ออัลบั้มที่สามารถใช้ได้',
      playlistTracknameTemplate: 'เทมเพลตชื่อเพลย์ลิสต์',
      playlistTracknameAvailableVariables: 'ตัวแปรชื่อเพลย์ลิสต์ที่สามารถใช้ได้'
    },
    folders: {
      title: 'โฟลเดอร์',
      createPlaylistFolder: 'สร้างโฟลเดอร์สำหรับเพลย์ลิสต์',
      playlistNameTemplate: 'เทมเพลตชื่อโฟลเดอร์เพลย์ลิสต์',
      createArtistFolder: 'สร้างโฟลเดอร์สำหรับศิลปิน',
      artistNameTemplate: 'เทมเพลตชื่อโฟลเดอร์ศิลปิน',
      createAlbumFolder: 'สร้างโฟลเดอร์สำหรับอัลบั้ม',
      albumNameTemplate: 'เทมเพลตชื่อโฟลเดอร์อัลบั้ม',
      createCDFolder: 'สร้างโฟลเดอร์สำหรับซีดี',
      createStructurePlaylist: 'สร้างโครงสร้างโฟลเดอร์สำหรับเพลย์ลิสต์',
      createSingleFolder: 'สร้างโครงสร้างโฟลเดอร์สำหรับซิงเกิล'
    },
    trackTitles: {
      title: 'ชื่อเพลง',
      padTracks: 'เพิ่มช่องว่างในชื่อเพลง',
      paddingSize: 'ขนาดช่องว่างบันทึกทับ',
      illegalCharacterReplacer: 'การแทนที่อักขระที่ใช้งานไม่ได้'
    },
    downloads: {
      title: 'ดาวน์โหลด',
      queueConcurrency: 'จำนวนการดาวน์โหลดพร้อมกัน',
      maxBitrate: {
        title: 'บิตเรตที่ต้องการ',
        9: 'FLAC 1411kbps',
        3: 'MP3 320kbps',
        1: 'MP3 128kbps'
      },
      overwriteFile: {
        title: 'อนุญาตให้บันทึกทับไฟล์เดิมหรือไม่?',
        y: 'ใช่ บันทึกทับไฟล์เดิมเลย',
        n: 'ไม่ อย่าบันทึกทับไฟล์เดิม',
        t: 'บันทึกทับเฉพาะแท็ก',
        b: 'ไม่ เก็บทั้งสองไฟล์และเพิ่มหมายเลขลงในสำเนาที่ซ้ำ',
        e: 'ไม่ และไม่ต้องสนใจนามสกุลไฟล์'
      },
      fallbackBitrate: 'บิตเรตทางเลือกสำรอง',
      fallbackSearch: 'การค้นหาทางเลือกสำรอง',
      logErrors: 'สร้างไฟล์บันทึกข้อผิดพลาด',
      logSearched: 'สร้างไฟล์บันทึกรายการเพลงที่ค้นหา',
      createM3U8File: 'สร้างไฟล์เพลย์ลิสต์',
      syncedLyrics: 'สร้างไฟล์ .lrc (เนื้อเพลงซิงโครไนซ์)',
      playlistFilenameTemplate: 'เทมเพลตชื่อไฟล์เพลย์ลิสต์',
      saveDownloadQueue: 'บันทึกคิวดาวน์โหลดเมื่อปิดแอป'
    },
    covers: {
      title: 'ภาพปกอัลบั้ม',
      saveArtwork: 'บันทึกภาพปกอัลบั้ม',
      coverImageTemplate: 'เทมเพลตชื่อภาพปก',
      saveArtworkArtist: 'บันทึกภาพศิลปิน',
      artistImageTemplate: 'เทมเพลตภาพศิลปิน',
      localArtworkSize: 'ขนาดภาพปกอัลบั้มในโฟลเดอร์',
      embeddedArtworkSize: 'ขนาดภาพปกอัลบั้มที่ฝังในไฟล์',
      localArtworkFormat: {
        title: 'คุณต้องการบันทึกภาพปกอัลบั้มในโฟลเดอร์เป็นไฟล์ประเภทใด',
        jpg: 'ภาพ jpeg',
        png: 'ภาพ png',
        both: 'บันทึกทั้งภาพ jpeg และ png'
      },
      jpegImageQuality: '= คุณภาพของภาพ JPEG',
      embeddedArtworkPNG: 'บันทึกภาพปกอัลบั้มที่ฝังในไฟล์เป็นไฟล์  PNG',
      embeddedPNGWarning: 'ไฟล์ PNG ไม่ได้รับการสนับสนุนอย่างเป็นทางการจาก Deezer และอาจทำให้มีปัญหาได้',
      imageSizeWarning: 'ไฟล์ที่ขนาดมากกว่า x1200 ไม่ได้ถูกใช้อย่างเป็นทางการโดย Deezer คุณอาจพบปัญหาได้',
      coverDescriptionUTF8: 'บันทึกคำอธิบายภาพปกโดยใช้ UTF8 (แก้ไขปก iTunes)'
    },
    tags: {
      head: 'แท็กที่ต้องการบันทึก',
      title: 'ชื่อเพลง',
      artist: 'ศิลปิน',
      album: 'อัลบั้ม',
      cover: 'ภาพปกอัลบั้ม',
      trackNumber: 'ลำดับเพลง',
      trackTotal: 'จำนวนเพลง',
      discNumber: 'หมายเลขแผ่น',
      discTotal: 'จำนวนแผ่นทั้งหมด',
      albumArtist: 'ศิลปินในอัลบั้ม',
      genre: 'ประเภท',
      year: 'ปี',
      date: 'วันที่',
      explicit: 'เนื้อเพลงโจ่งแจ้ง',
      isrc: 'ISRC',
      length: 'ความยาวเพลง',
      barcode: 'บาร์โค้ดอัลบั้ม (UPC)',
      bpm: 'BPM',
      replayGain: 'Replay Gain',
      label: 'ค่ายเพลง',
      lyrics: 'เนื้อเพลงที่ไม่ซิงโครไนซ์',
      syncedLyrics: 'เนื้อเพลงซิงโครไนซ์',
      copyright: 'ลิขสิทธิ์',
      composer: 'ผู้แต่งเพลง',
      involvedPeople: 'ผู้มีส่วนร่วม',
      source: 'แหล่งที่มาและรหัสเพลง'
    },
    other: {
      title: 'การตั้งค่าอื่น ๆ',
      savePlaylistAsCompilation: 'บันทึกเพลย์ลิสต์เป็นอัลบั้มรวมเพลง',
      useNullSeparator: 'ใช้ตัวคั่นค่า null',
      saveID3v1: 'บันทึก ID3v1 ด้วย',
      multiArtistSeparator: {
        title: 'คุณต้องการแยกชื่อศิลปินอย่างไร?',
        nothing: 'บันทึกเฉพาะศิลปินหลักเท่านั้น',
        default: 'ใช้การระบุแบบมาตรฐานดั้งเดิม',
        andFeat: 'ใช้ & และ feat.',
        using: 'ใช้ "{separator}"'
      },
      singleAlbumArtist: 'บันทึกเฉพาะศิลปินหลักของอัลบั้ม',
      albumVariousArtists: 'เก็บ "หลายศิลปิน" ไว้ในอัลบั้มของศิลปิน',
      removeAlbumVersion: 'ลบ "อัลบั้มเวอร์ชัน" ออกจากชื่อเพลง',
      removeDuplicateArtists: 'ลบการรวมศิลปิน',
      dateFormat: {
        title: 'รูปแบบวันที่สำหรับไฟล์ FLAC',
        year: 'ปปปป',
        month: 'มม',
        day: 'ดด'
      },
      featuredToTitle: {
        title: 'คุณต้องการจัดการชื่อศิลปินร่วมอย่างไร?',
        0: 'ไม่ต้องเปลี่ยนแปลงอะไร',
        1: 'เอาออกจากชื่อไฟล์',
        3: 'ลบออกจากชื่อไฟล์และชื่ออัลบั้ม',
        2: 'ย้ายไปไว้ในชื่อไฟล์'
      },
      titleCasing: 'ตัวพิมพ์ใหญ่-พิมพ์เล็ก ชื่อเพลง',
      artistCasing: 'ตัวพิมพ์ใหญ่-พิมพ์เล็ก ชื่อศิลปิน',
      casing: {
        nothing: 'ไม่ต้องเปลี่ยนแปลงอะไร',
        lower: 'ตัวพิมพ์เล็ก',
        upper: 'ตัวพิมพ์ใหญ่',
        start: 'อักษรตัวแรกของทุกคำขึ้นต้นด้วยตัวพิมพ์ใหญ่',
        sentence: 'ตัวพิมพ์ใหญ่เฉพาะอักษรตัวแรกเท่านั้นเหมือนในประโยค'
      },
      previewVolume: 'ระดับเสียงตัวอย่างเพลง',
      executeCommand: {
        title: 'รันคำสั่งเมื่อเสร็จสิ้นการดาวน์โหลด',
        description: 'เว้นว่างไว้หากไม่ต้องการทำอะไรเพิ่มเติม'
      }
    },
    spotify: {
      title: 'คุณสมบัติ Spotify',
      clientID: 'Spotify ClientID',
      clientSecret: 'Spotify Client Secret',
      username: 'ชื่อผู้ใช้ Spotify',
      question: 'ฉันจะเปิดใช้งานคุณสมบัติ Spotify ได้อย่างไร?'
    },
    reset: 'รีเซ็ตเป็นค่าเริ่มต้น',
    resetMessage: 'คุณแน่ใจหรือไม่ว่าต้องการกลับไปใช้การตั้งค่าเริ่มต้น?',
    save: 'บันทึก',
    toasts: {
      init: 'โหลดการตั้งค่าแล้ว!',
      update: 'อัปเดตการตั้งค่าแล้ว!',
      reset: 'การตั้งค่าถูกรีเซ็ตเป็นค่าเริ่มต้น!',
      ARLcopied: 'คัดลอก ARL ไปยังคลิปบอร์ดแล้ว'
    },
    logs: {
      title: 'บันทึก',
      areLogsActive: 'เปิดใช้งานอยู่'
    }
  },
  sidebar: {
    home: 'หน้าแรก',
    search: 'ค้นหา',
    charts: 'ชาร์ตเพลง',
    favorites: 'รายการที่ชื่นชอบ',
    linkAnalyzer: 'ตัววิเคราะห์ลิงก์',
    settings: 'การตั้งค่า',
    logs: 'บันทึก',
    about: 'เกี่ยวกับ'
  },
  tracklist: {
    downloadSelection: 'ดาวน์โหลดรายการที่เลือก'
  },
  logs: {
    event: 'เหตุการณ์',
    data: 'ข้อมูล'
  }
}

export default th
