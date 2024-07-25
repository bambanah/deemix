const pt_br = {
  globals: {
    welcome: 'bem-vindo ao DeemixFix',
    back: 'voltar',
    loading: 'carregando',
    download: 'Baixar {thing}',
    by: 'por {artist}',
    in: 'em {album}',
    download_hint: 'Baixar',
    play_hint: 'Reproduzir',
    toggle_download_tab_hint: 'Expandir/Recolher',
    clean_queue_hint: 'Limpar',
    cancel_queue_hint: 'Cancelar todos',
    open_downloads_folder: 'Abrir pasta de downloads',
    cut: 'recortar',
    copy: 'copiar',
    copyLink: 'copiar link',
    copyImageLink: 'copiar link da imagem',
    copyDeezerLink: 'copiar link do deezer',
    paste: 'colar',
    listTabs: {
      empty: '',
      all: 'todos',
      discography: 'discografia',
      top_result: 'resultado principal',
      album: 'álbum | álbuns',
      artist: 'artista | artistas',
      single: 'single | singles',
      title: 'título | títulos',
      track: 'faixa | faixas',
      playlist: 'playlist | playlists',
      compile: 'compilação | compilações',
      ep: 'ep | eps',
      bundle: 'pacote | pacotes',
      more: 'Mais álbuns',
      featured: 'Participação em',
      spotifyPlaylist: 'playlist do Spotify | playlists do Spotify',
      releaseDate: 'data de lançamento',
      error: 'erro',
      trackN: '0 faixas | {n} faixa | {n} faixas',
      albumN: '0 álbuns | {n} álbum | {n} álbuns',
      artistN: '0 artistas | {n} artista | {n} artistas',
      releaseN: '0 lançamentos | {n} lançamento | {n} lançamentos',
      playlistN: '0 playlists | {n} playlist | {n} playlists'
    },
    yes: 'sim',
    no: 'não',
    empty: 'vazio'
  },
  about: {
    appStatus: {
      online: 'app online',
      offline: 'app offline'
    },
    updates: {
      currentVersion: 'Versão atual',
      currentWebuiVersion: 'Versão WebUI atual',
      versionNotAvailable: 'N/A',
      updateAvailable: 'Você está executando a versão mais recente: {version}',
      deemixVersion: 'versão do deemix lib'
    },
    titles: {
      usefulLinks: 'Links úteis',
      bugReports: 'Reportar bugs',
      contributing: 'Contribuições',
      donations: 'Doações',
      license: 'Licença'
    },
    subtitles: {
      bugReports: 'Algo não funcionando no deemix? Nos diga!',
      contributing: 'Você quer contribuir para este projeto? Você pode fazer isso de diferentes maneiras!',
      donations: 'Você quer contribuir monetariamente? Você pode fazer uma doação!'
    },
    usesLibrary:
   'Esse app usa a biblioteca do <strong>deemix</strong>, no qual você pode usar para criar sua própria UI para o deemix',
    thanks: 'Agradecimentos para <strong>rtonno</strong>, <strong>uhwot</strong> e <strong>lollilol</strong> por ajudar neste projeto, e para <strong>BasCurtiz</strong> por fazer o ícone',
    upToDate: {
      text: 'Para mais novidades siga o {newsChannel} no Telegram.',
      newsChannel: 'canal de notícias'
    },
    officialWebsite: 'Site oficial',
    officialRepo: 'Repositório oficial da biblioteca',
    officialWebuiRepo: 'Repositório oficial da WebUI',
    officialSubreddit: 'Subreddit oficial',
    newsChannel: 'Canal de notícias',
    devlogChannel: 'Canal Devlog',
    questions: {
      text: 'Se você tiver dúvidas ou problemas com o app, procure uma solução em {telegram} primeiro. Caso você não encontre, você pode fazer um post explicando seu problema no {telegram}.',
      telegram: 'Telegram'
    },
    beforeReporting: 'Antes de reportar um bug, tenha certeza que você está rodando a versão mais recente do app, e o que você quer reportar seja realmente um bug e não algo que esteja acontecendo especialmente com você.',
    beSure: 'Certifique-se que o bug é reproduzivel em outras máquinas e também <strong>NÃO</strong> reporte um bug se ele já foi reportado.',
    duplicateReports: 'Reportes de bugs duplicados serão fechados, então fique atento a isso.',
    dontOpenIssues: '<strong>NÃO</strong> abra tópicos para fazer perguntas, há o subreddit para isso.',
    newUI: {
      text: 'Se você é fluente em Phython, você pode tentar fazer uma nova UI para o app usando a biblioteca base, ou consertar bugs da biblioteca com um pull request em {repo}.',
      repo: 'repo'
    },
    acceptFeatures: 'Eu aceito funcionalidades extras também, mas nada de coisas complexas, desde que ela possa ser implementada no app, e não na biblioteca.',
    otherLanguages: 'Se você for fluente em outra linguagem de programação, você pode tentar portar o deemix para outra linguagem!',
    understandingCode: 'Você precisa de ajuda para entender o código? Mande mensagem no RemixDex pelo Telegram ou pelo Reddit.',
    contributeWebUI: {
      text: 'Se você souber Vue.js (JavaScript), HTML ou CSS você pode contribuir para o {webui}.',
      webui: 'WebUI'
    },
    itsFree: 'Lembre-se que <strong>este projeto é livre</strong> e <strong>você deve dar suporte aos artistas que você ama</strong> antes de dar suporte aos desenvolvedores.',
    notObligated: 'Não se sinta na obrigação de doar, eu agradeço de qualquer maneira!',
    lincensedUnder: {
      text: 'Esse é um projeto licenciado através da {gpl3}.',
      gpl3: 'GNU General Public License 3.0'
    }
  },
  charts: {
    title: 'Mais ouvidas',
    changeCountry: 'Mudar país',
    download: 'Baixar mais ouvidas'
  },
  errors: {
    title: 'Erros para {name}',
    postTitle: 'Após erros de download',
    ids: {
      invalidURL: 'URL inválido',
      unsupportedURL: 'URL não suportado ainda',
      ISRCnotOnDeezer: 'Faixa ISRC não está disponível ainda no Deezer',
      notYourPrivatePlaylist: 'Você não pode baixar playlists privadas.',
      spotifyDisabled: 'Os Recursos do Spotify não foram configurados corretamente.',
      trackNotOnDeezer: 'Faixa não encontrada no Deezer!',
      albumNotOnDeezer: 'Álbum não encontrado no Deezer!',
      notOnDeezer: 'Faixa indisponível no Deezer!',
      notEncoded: 'Faixa ainda não codificada!',
      notEncodedNoAlternative: 'Faixa ainda não codificada e sem alternativas encontradas!',
      wrongBitrate: 'Faixa não encontrada no bitrate desejado.',
      wrongBitrateNoAlternative: 'Faixa não encontrada no bitrate desejado e nenhuma outra alternativa encontrada!',
      no360RA: 'Faixa não disponível na qualidade Reality Audio 360.',
      notAvailable: 'Faixa não disponível nos servidores do Deezer!',
      notAvailableNoAlternative:
    'Faixa não disponível nos servidores do Deezer e nenhuma outra alternativa encontrada!',
      noSpaceLeft: 'Espaço insuficiente no dispositivo!',
      albumDoesntExists: 'O álbum da faixa não exite, falha ao obter informações.',
      wrongLicense: 'A sua conta não permite reproduzir a faixa na qualidade desejada.',
      wrongGeolocation: 'A sua conta não permite reproduzir a faixa a partir do país atual.',
      wrongGeolocationNoAlternative:
    'A sua conta não permite reproduzir a faixa a partir do país atual e nenhuma alternativa foi encontrada.'
    }
  },
  favorites: {
    title: 'Favoritos',
    noPlaylists: 'Nenhuma playlist encontrada',
    noAlbums: 'Nenhum álbum favorito encontrado',
    noArtists: 'Nenhum artista favorito encontrado',
    noTracks: 'Nenhuma faixa favorita encontrada'
  },
  home: {
    needTologin: 'Você precisa logar na sua conta do Deezer antes de começar a baixar músicas.',
    openSettings: 'Abrir Configurações',
    sections: {
      popularPlaylists: 'Playlists populares',
      popularAlbums: 'Álbuns mais ouvidos'
    }
  },
  linkAnalyzer: {
    info: 'Você pode usar essa seção para encontrar mais informações sobre o link que você quer baixar.',
    useful:
   'Isso é útil se você está tentando baixar algumas faixas que não estão disponíveis no seu país, e quer saber onde elas estão disponíveis, por exemplo.',
    linkNotSupported: 'Esse link não é suportado ainda',
    linkNotSupportedYet: 'Parece que esse link não é suportado ainda, tente analisar outro.',
    table: {
      id: 'ID',
      isrc: 'ISRC',
      upc: 'UPC',
      duration: 'Duração',
      diskNumber: 'Número do disco',
      trackNumber: 'Número da faixa',
      releaseDate: 'Data de lançamento',
      bpm: 'BPM',
      label: 'Gravadora',
      recordType: 'Tipo de gravação',
      genres: 'Gêneros',
      tracklist: 'Tracklist',
      readable: 'Leitura possível',
      available: 'Disponível'
    },
    countries: 'Países',
    noCountries: 'Esta faixa não está disponível em qualquer país.'
  },
  search: {
    startSearching: 'Comece pesquisando!',
    description:
   'Você pode pesquisar uma música, um álbum, um artista, uma playlist.... tudo! Você também pode colar um link do Deezer',
    fans: '{n} fãs',
    noResults: 'Nenhum resultado',
    noResultsTrack: 'Nenhuma faixa encontrada',
    noResultsAlbum: 'Nenhum álbum encontrado',
    noResultsArtist: 'Nenhum artista encontrado',
    noResultsPlaylist: 'Nenhuma playlist encontrada',
    error: 'Ocorreu um erro. Tente novamente mais tarde.'
  },
  searchbar: 'Pesquise algo (ou apenas cole um link)',
  downloads: 'downloads',
  toasts: {
    restoringQueue: 'Restaurando fila de downloads...',
    queueRestored: 'Fila de downloads restaurada!',
    addedToQueue: '{item} adicionado à fila',
    addedMoreToQueue: '{n} itens adicionados à fila',
    alreadyInQueue: '{item} já está na fila!',
    finishDownload: '{item} download concluído.',
    allDownloaded: 'Todos os downloads foram concluídos!',
    refreshFavs: 'Atualização concluída!',
    loggingIn: 'Logando',
    loggedIn: 'Logado',
    alreadyLogged: 'Você já está logado',
    loginFailed: 'Não foi possível entrar',
    loggedOut: 'Desconectando',
    cancellingCurrentItem: 'Cancelando item atual.',
    currentItemCancelled: 'Item atual cancelado.',
    startAddingArtist: 'Adicionando álbuns de {artist} à fila',
    finishAddingArtist: 'Álbuns de {artist}adicionados a fila',
    startConvertingSpotifyPlaylist: 'Convertendo faixas do Spotify para faixas do Deezer',
    finishConvertingSpotifyPlaylist: 'Playlists do Spotify convertidas',
    loginNeededToDownload: 'Você precisa fazer login para baixar faixas!',
    queueErrorCantStream: 'Sua conta não pode reproduzir a {bitrate}!',
    deezerNotAvailable: 'Deezer não disponível no seu país. Você precisa usar uma VPN.',
    deezerNotReachable: 'O aplicativo não consegue conectar-se ao Deezer. Verifique sua conexão com a Internet, firewall ou antivírus.',
    startGeneratingItems: 'Processando {n} itens...',
    finishGeneratingItems: '{n} itens gerados.',
    noLovedPlaylist: 'Nenhuma playlist de músicas curtidas!',
    checkingUpdates: 'Verificando por atualizações...',
    noUpdateAvailable: 'Nenhuma atualização disponível',
    updateAvailable: 'Uma atualização está disponível!',
    wrongSpotifyUsername: '{username} não é um nome de usuário válido do Spotify'
  },
  settings: {
    title: 'Configurações',
    language: 'Idioma',
    login: {
      title: 'Login',
      loggedIn: 'Você está logado como {username}',
      arl: {
        title: 'Usar ARL',
        question: 'Como eu consigo o meu ARL?',
        howTo: {
          prologue: {
            p1: 'O Deezer mantém o registro de login da sessão usando um cookie chamado ARL.',
            p2: 'O Deemix usa este cookie para obter os metadados necessários para fazer o download das faixas do Deezer.',
            p3: 'ARLs duram por 3 meses, após isto o Deezer solicita que você faça login novamente. O mesmo método é usado no Deemix.',
            p4: 'Seguindo um dos guias abaixo, você pode obter o ARL da sua conta.',
            warning: 'Use este método somente se e-mail/senha não funcionar.'
          },
          chromeSteps: {
            title: 'Chrome',
            step1: 'Abra o Chrome',
            easyWay: {
              title: 'Chrome (Modo fácil)',
              step3: 'Clique no pequeno ícone de "cadeado" próximo ao URL',
              step4: 'Clique em Cookies > deezer.com > cookies > arl',
              step5: 'Selecione a string ao lado de Conteúdo, e Copiar'
            },
            step4: 'Acesse a aba Aplicativo (se você não ver, clique na seta dupla)',
            videoGuide: {
              text: 'Aqui está um {videoGuide}',
              link: 'guia em vídeo'
            }
          },
          firefoxSteps: {
            title: 'Firefox',
            step1: 'Abra o Firefox',
            step4: 'Acesse a aba Armazenamento (se você não ver, clique na seta dupla)'
          },
          commonSteps: {
            step2: 'Acesse www.deezer.com e faça login na sua conta',
            step3: 'Após fazer login, pressione F12 para abrir as Ferramentas de Desenvolvedor',
            step5: 'Abra a lista Cookies',
            step6: 'Selecione www.deezer.com',
            step7: 'Encontre o cookie `arl` (Ele deve ter 192 caracteres de comprimento)',
            step8: 'Certifique-se de copiar somente o valor e não o cookie completo',
            lastStep: 'Este é o seu ARL, agora você pode usá-lo no aplicativo'
          }
        },
        update: 'Forçar atualizar ARL'
      },
      logout: 'Sair',
      login: 'Entrar',
      email: 'E-mail',
      password: 'Senha'
    },
    appearance: {
      title: 'Aparência',
      slimDownloadTab: 'Aba de downloads pequena',
      slimSidebar: 'Barra lateral pequena',
      searchButton: 'Mostrar botão de pesquisa',
      bitrateTags: 'Mostrar tag de qualidade na fila de downloads'
    },
    downloadPath: {
      title: 'Pasta de downloads'
    },
    templates: {
      title: 'Modelos',
      tracknameTemplate: 'Modelo do nome da faixa',
      tracknameAvailableVariables: 'Variáveis de nomes de faixas disponíveis',
      albumTracknameTemplate: 'Modelo da faixa do álbum',
      albumTracknameAvailableVariables: 'Variáveis de faixa do álbum disponíveis',
      playlistTracknameTemplate: 'Modelo da faixa da playlist',
      playlistTracknameAvailableVariables: 'Variáveis de faixa da playlist disponíveis'
    },
    folders: {
      title: 'Pastas',
      createPlaylistFolder: 'Criar pasta para playlists',
      playlistNameTemplate: 'Modelo da pasta de playlist',
      createArtistFolder: 'Criar pasta para artista',
      artistNameTemplate: 'Modelo da pasta de artistas',
      createAlbumFolder: 'Criar pasta para álbuns',
      albumNameTemplate: 'Modelo da pasta de álbuns',
      createCDFolder: 'Criar pasta para CDs',
      createStructurePlaylist: 'Criar estrutura de pastas para playlists',
      createSingleFolder: 'Criar estrutura de pastas para singles'
    },
    trackTitles: {
      title: 'Título das faixas',
      padTracks: 'Faixas com pad',
      paddingSize: 'Sobrescrever tamanho do padding',
      illegalCharacterReplacer: 'Substituir caracteres inválidos'
    },
    downloads: {
      title: 'Downloads',
      queueConcurrency: 'Downloads simultâneos',
      maxBitrate: {
        title: 'Escolher taxa de bits',
        9: 'FLAC 1411kbps',
        3: 'MP3 320kbps',
        1: 'MP3 128kbps'
      },
      overwriteFile: {
        title: 'Sobrescrever arquivos?',
        y: 'Sim, sobrescrever arquivos',
        n: 'Não, não sobrescrever arquivos',
        t: 'Sobrescrever apenas as tags',
        b: 'Não, manter ambos os arquivos e adicionar número ao duplicado',
        e: 'Não, e não olhar para as extensões',
        l: 'Sobrescrever somente se atualizar o bitrate (somente MP3)'
      },
      fallbackBitrate: 'Taxa de bits reserva',
      fallbackSearch: 'Procurar reserva',
      fallbackISRC: 'Reserva com pesquisa ISRC',
      feelingLucky: 'Negociar com CDNs e caches',
      logErrors: 'Criar arquivos de log para erros',
      logSearched: 'Criar arquivos de log para faixas pesquisadas',
      createM3U8File: 'Criar arquivo de playlist',
      syncedLyrics: 'Criar arquivos .lrc (Letras sincronizadas)',
      playlistFilenameTemplate: 'Modelo do nome do arquivo da playlist',
      clearQueueOnExit: 'Limpar a fila de downloads quando fechar o app'
    },
    covers: {
      title: 'Capa dos álbuns',
      saveArtwork: 'Salvar capas',
      coverImageTemplate: 'Modelo do nome da capa',
      saveArtworkArtist: 'Salvar imagem do artista',
      artistImageTemplate: 'Modelo da imagem do artista',
      localArtworkSize: 'Tamanho da capa local',
      embeddedArtworkSize: 'Tamanho da capa embutida',
      localArtworkFormat: {
        title: 'Qual o formato da imagem você quer para a capa local?',
        jpg: '.jpeg',
        png: '.png',
        both: 'Ambas, .jpeg e .png'
      },
      jpegImageQuality: 'Qualidade da imagem JPEG',
      embeddedArtworkPNG: 'Salvar capa embutida como PNG',
      embeddedPNGWarning: 'PNGs não são oficialmente suportados pelo Deezer e podem ficar bugados',
      imageSizeWarning: 'Tudo acima de x1200 não é oficialmente usado pelo Deezer,  você pode encontrar problemas',
      coverDescriptionUTF8: 'Salvar descrição da capa usando UTF-8 (correção para capa do iTunes)'
    },
    tags: {
      head: 'Quais tags salvar',
      title: 'Título',
      artist: 'Artista',
      artists: 'Tag de ARTISTAS extras',
      album: 'Álbum',
      cover: 'Capa',
      trackNumber: 'Número da faixa',
      trackTotal: 'Total de faixas',
      discNumber: 'Número de discos',
      discTotal: 'Total de discos',
      albumArtist: 'Artista do álbum',
      genre: 'Gênero',
      year: 'Ano',
      date: 'Data',
      explicit: 'Letras explícitas',
      isrc: 'ISRC',
      length: 'Tamanho da faixa',
      barcode: 'Código de barras do álbum (UPC)',
      bpm: 'BPM',
      replayGain: 'Replay Gain',
      label: 'Gravadora',
      lyrics: 'Letras não sincronizadas',
      syncedLyrics: 'Letras sincronizadas',
      copyright: 'Copyright',
      composer: 'Compositor',
      involvedPeople: 'Pessoas envolvidas',
      source: 'Fonte e ID da música',
      artistsWarning:
    'Desabilitar a tag ARTISTAS embora não use a especificação padrão, não preservará o suporte para vários artistas'
    },
    other: {
      title: 'Outros',
      autoCheckForUpdates: 'Verificar por atualizações ao iniciar',
      savePlaylistAsCompilation: 'Salvar playlists como uma compilação',
      useNullSeparator: 'Usar separador nulo',
      saveID3v1: 'Salvar ID3v1',
      multiArtistSeparator: {
        title: 'Como você gostaria de separar os artistas?',
        nothing: 'Salvar apenas o artista principal',
        default: 'Usar a especificação padrão',
        andFeat: 'Usar & e feat.',
        using: 'Usar "{separator}"',
        warning:
     'Usar qualquer separador diferente do que a especificação padrão irá adicionar uma tag de ARTISTAS extra para preservar o suporte a vários artistas'
      },
      singleAlbumArtist: 'Salvar apenas o artista principal',
      albumVariousArtists: 'Manter "Various Artists" nos Artistas do Álbum',
      removeAlbumVersion: 'Remover "Album Version" do título da faixa',
      removeDuplicateArtists: 'Remover combinação de artistas',
      dateFormat: {
        title: 'Formato da data para arquivos FLAC',
        year: 'AAAA',
        month: 'MM',
        day: 'DD'
      },
      featuredToTitle: {
        title: 'O que devo fazer com artistas participantes?',
        0: 'Nada',
        1: 'Remover do título da faixa',
        3: 'Remover do título da faixa e do álbum',
        2: 'Mover para o título da faixa'
      },
      titleCasing: 'Formatação do título',
      artistCasing: 'Formatação do artista',
      casing: {
        nothing: 'Manter inalterado',
        lower: 'minúsculo',
        upper: 'MAIÚSCULO',
        start: 'Começo De Cada Palavra',
        sentence: 'Como uma frase'
      },
      previewVolume: 'Volume da prévia',
      executeCommand: {
        title: 'Comando para executar depois de baixar',
        description: 'Deixe em branco para nenhuma ação'
      }
    },
    spotify: {
      title: 'Recursos do Spotify',
      clientID: 'Spotify clientID',
      clientSecret: 'Spotify Client Secret',
      username: 'Usuário do Spotify',
      question: 'Como habilitar os Recursos do Spotify?',
      howTo: {
        prologue: {
          p1: '"Recursos do Spotify" é um conjunto de recursos que lhe permite converter links de faixas e álbuns do Spotify para links do Deezer.',
          p2: 'Se você fornecer um link para uma playlist do Spotify, o aplicativo vai automaticamente converter todos os links das faixas dentro dela para faixas do Deezer.',
          p3: 'Ativar este conjunto de recursos irá permitir que você veja as suas playlists públicas do Spotify também na aba Favoritos.'
        },
        info: 'Por motivos de segurança, você vai precisar fornecer o seu próprio Client ID e Client Secret',
        clientSecretQuestion: {
          title: 'Como obtenho o meu Client ID e Client Secret?',
          step1: {
            text: 'Acesse o {spotifyDevelopersDashboard} e faça login com a sua conta do Spotify.',
            spotifyDevelopersDashboard: "Spotify for Developers's Dashboard"
          },
          step2: {
            text: 'Clique em "Create an App".',
            imageAlt: "Create an App button on Spotify for Developers's Dashboard"
          },
          step3: {
            text: 'Preencha os campos "App name" e "App description" e marque ambas as caixas de seleção. Então clique em "Create".',
            imageAlt: 'Create an app form'
          },
          step4: {
            text: 'Agora você poderá ver o Client ID. Se você clicar em "Show Client Secret" ele será revelado.',
            imageAlt: 'Screen of client ID and Secret'
          },
          step5: 'Agora você pode copiar e colar estes resultados nos campos apropriados nas configurações.'
        },
        usernameQuestion: {
          title: 'Como obtenho meu nome de usuário do Spotify?',
          step1: {
            text: 'Você pode obter o seu nome de usuário do Spotify na página {overviewPage} no site do Spotify.',
            overviewPage: 'Visão geral da conta'
          }
        }
      }
    },
    reset: 'Restaurar padrão',
    resetMessage: 'Deseja realmente restaurar as configurações padrão?',
    save: 'Salvar',
    toasts: {
      init: 'Configurações carregadas!',
      update: 'Configurações atualizadas!',
      reset: 'Configurações restauradas para o padrão!',
      ARLcopied: 'ARL copiado para a área de transferência'
    }
  },
  sidebar: {
    home: 'início',
    search: 'pesquisar',
    charts: 'paradas',
    favorites: 'favoritos',
    linkAnalyzer: 'analisar links',
    settings: 'configurações',
    logs: 'logs',
    about: 'sobre'
  },
  tracklist: {
    downloadSelection: 'Baixar seleção'
  }
}

export default pt_br
