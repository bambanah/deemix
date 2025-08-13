const pt = {
	globals: {
		welcome: "Bem-vindo ao deemix",
		back: "voltar",
		loading: "A carregar",
		download: "Transferir {thing}",
		by: "por {artist}",
		in: "em {album}",
		download_hint: "Transferir",
		play_hint: "Tocar",
		toggle_download_tab_hint: "Expandir/Recolher",
		clean_queue_hint: "Limpar Finalizados",
		cancel_queue_hint: "Cancelar Tudo",
		open_downloads_folder: "Abrir pasta Transferências",
		cut: "cortar",
		copy: "copiar",
		copyLink: "copiar ligação",
		copyImageLink: "copiar ligação da imagem",
		copyDeezerLink: "copiar ligação do deezer",
		paste: "colar",
		listTabs: {
			empty: "",
			all: "Tudo",
			top_result: "melhor resultado",
			album: "álbum | álbums",
			artist: "artista | artistas",
			single: "single | singles",
			title: "título | títulos",
			track: "faixa | faixas",
			playlist: "lista de reprodução | listas de reprodução",
			compile: "compilação | compilações",
			ep: "ep | eps",
			bundle: "pacote | pacotes",
			more: "Mais álbuns",
			featured: "Featured in",
			spotifyPlaylist:
				"lista de reprodução spotify | listas de reprodução spotify",
			releaseDate: "data de lançamento",
			error: "erro",
			trackN: "0 faixas | {n} faixa | {n} faixas",
			albumN: "0 albuns | {n} album | {n} albuns",
			artistN: "0 artistas | {n} artista | {n} artistas",
			releaseN: "0 lançamentos | {n} lançamento | {n} lançamento",
			playlistN:
				"0 listas de reprodução | {n} lista de reprodução | {n} listas de reprodução",
		},
		yes: "sim",
		no: "no",
		empty: "vazio",
	},
	about: {
		appStatus: {
			online: "app online",
			offline: "app offline",
		},
		updates: {
			currentVersion: "Versão Atual",
			currentWebuiVersion: "Versão Atual do WebUI",
			versionNotAvailable: "N/D",
			updateAvailable: `Não estás a usar a versão mais recente: {version}`,
			deemixVersion: "versão deemix lib",
		},
		titles: {
			usefulLinks: "Ligações Úteis",
			bugReports: "Relatório de erros",
			contributing: "Contribuir",
			donations: "Doações",
			license: "Licenças",
		},
		subtitles: {
			bugReports:
				"Existe alguma coisa que não funciona no deemix? Informa-nos!",
			contributing:
				"Queres contribuir para o projecto? Podes fazê-lo de diferentes formas!",
			donations: "Desejas contribuir monetariamente? Faz uma doação!",
		},
		usesLibrary:
			"Esta aplicação usa a biblioteca <strong>deemix</strong>, que poderás usar para desenvolver o teu proprio UI para o deemix.",
		thanks: `Agradeço a <strong>rtonno</strong>, <strong>uhwot</strong> and <strong>lollilol</strong> por me ajudarem neste projeto e a <strong>BasCurtiz</strong> por elaborarem o ícone.`,
		upToDate: {
			text: `Mantém-te atualizado seguindo o {newsChannel} no Telegram.`,
			newsChannel: "canal de notícias",
		},
		officialWebsite: "Site Oficial",
		officialRepo: "Repositório Oficial da Biblioteca",
		officialWebuiRepo: "Repositório Oficial WebUI",
		officialSubreddit: "Subreddit Oficial",
		newsChannel: "Canal de Notícias",
		questions: {
			text: `Caso tenhas alguma duvida ou problema com a app, primeiro procura por uma solução no {subreddit}. Caso não encontres nada podes criar uma publicação com a tua questão.`,
			subreddit: "subreddit",
		},
		beforeReporting: `Antes de reportares um bug certifica-te que estás a correr a versão mais recente e que se trata realmentede um bug e não apenas algo que não funciona do teu lado.`,
		beSure: `Certifica-te que o erro é reprodutivel noutros dispositivos e <strong>NÃO</strong> reportes um bug que já tenha sido reportado.`,
		duplicateReports:
			"Bug reports duplicados serão fechados, mantém-te atento a isso.",
		dontOpenIssues: `<strong>NÃO</strong> abras issues para colocar questões, existe um subreddit para isso.`,
		newUI: {
			text: `Caso sejas fluente em python podes tentar criar um novo UI para a aplicação recorrendo à biblioteca base ou corrigir erros na biblioteca com um pull request no {repo}.`,
			repo: "repositório",
		},
		acceptFeatures: `Também aceito funcionalidades não complexas caso possam ser implementadas directamente na app e não na biblioteca.`,
		otherLanguages: `Caso sejas fluente noutra linguagem de programação podes tentar migrar o deemix para outra linguagem de programação!`,
		contributeWebUI: {
			text: `Caso saibas Vue.js (JavaScript), HTML ou CSS podes contribuir para o {webui}.`,
			webui: "WebUI",
		},
		itsFree: `Deves ter em conta que <strong>que este projeto é gratuito</strong> e <strong>deverás apoiar os artistas que aprecias</strong> antes de apoiares os programadores.`,
		notObligated: `Não te sintas obrigado a doar, agradeço-te na mesma!`,
		licencedUnder: {
			text: `Este trabalho esta licenciado sobre a {gpl3}.`,
			gpl3: "GNU Licença publica geral 3.0",
		},
	},
	charts: {
		title: "Tabelas",
		changeCountry: "Alterar país",
		download: "Transferir tabela",
	},
	errors: {
		title: "Erros para {name}",
		postTitle: "Erros após transferência",
		ids: {
			invalidURL: "URL não reconhecido",
			unsupportedURL: "URL ainda não suportado",
			ISRCnotOnDeezer: "Faixa ISRC não disponível no deezer",
			notYourPrivatePlaylist:
				"Nao podes baixar listas de reprodução privadas de outros.",
			spotifyDisabled:
				"Funcionalidades do Spotify não estão definidas corretamente.",
			trackNotOnDeezer: "Faixa não encontrada no deezer!",
			albumNotOnDeezer: "Álbum não encontrado no deezer!",
			notOnDeezer: "Faixa não encontrada no Deezer!",
			notEncoded: "Faixa ainda não codificada!",
			notEncodedNoAlternative:
				"Faixa ainda não codificada e não foi encontrada alternativa!",
			wrongBitrate: "Faixa não encontrada no bitrate desejado.",
			wrongBitrateNoAlternative:
				"Faixa não encontrada no bitrate desejado e não foi encontrada alternativa!",
			no360RA: "Faixa não disponível em Reality Audio 360.",
			notAvailable: "Faixa não disponível nos servidores do deezer!",
			notAvailableNoAlternative:
				"Faixa não disponível nos servidores do deezer e não foi encontrada alternativa!",
			noSpaceLeft: "O dispositivo não tem armazenamento disponível!",
			albumDoesntExists:
				"A faixa do álbum não existe, recolha de informação falhou.",
			wrongLicense:
				"A tua conta não permite fazer streaming da faixa com o bitrate desejado.",
			wrongGeolocation:
				"A tua conta não permite fazer streaming da faixa a partir do teu país.",
			wrongGeolocationNoAlternative:
				"A tua conta não permite fazer streaming da faixa a partir do teu país e não foi encontrada nenhuma alternativa.",
		},
	},
	favorites: {
		title: "Favoritos",
		noPlaylists: "Listas de reprodução não encontradas",
		noAlbums: "Álbuns favoritos não encontrados",
		noArtists: "Artistas favoritos não encontrados",
		noTracks: "Faixas favoritas não encontradas",
	},
	home: {
		needTologin:
			"Antes de iniciar transferências é necessário efetuar autenticação na conta Deezer.",
		openSettings: "Abrir Definições",
		sections: {
			popularPlaylists: "Listas de reprodução populares",
			popularAlbums: "Álbuns mais ouvidos",
		},
	},
	linkAnalyzer: {
		info: "Podes usar esta secção para obteres mais informação sobre o link que estás a tentar transferir.",
		useful:
			"Isto é útil caso estejas a tentar transferir faixas que não estão disponíveis no teu país e queres saber onde estão disponíveis, por exemplo.",
		linkNotSupported: "Este link ainda não é suportado",
		linkNotSupportedYet:
			"Parece que este link ainda não é suportado, tenta analisar outro.",
		table: {
			id: "ID",
			isrc: "ISRC",
			upc: "UPC",
			duration: "Duração",
			diskNumber: "Número do disco",
			trackNumber: "Número da faixa",
			releaseDate: "Data de lançamento",
			bpm: "BPM",
			label: "Editora",
			recordType: "Tipo de Disco",
			genres: "Géneros",
			tracklist: "Lista de faixas",
			readable: "Legível",
			available: "Disponível",
		},
		countries: "Países",
		noCountries: "Esta faixa não está disponível em nenhum país.",
	},
	search: {
		startSearching: "Começa a pesquisar!",
		description:
			"Podes perquisar uma música, um álbum inteiro, um artista, uma lista de reprodução... tudo! Também podes colar um link do Deezer",
		fans: "{n} fãs",
		noResults: "Sem resultados",
		noResultsTrack: "Faixa não encontrada",
		noResultsAlbum: "Álbum não encontrado",
		noResultsArtist: "Artista não encontrado",
		noResultsPlaylist: "Lista de reprodução não encontrada",
		error: "Ocorreu um erro, tenta novamente mais tarde.",
	},
	searchbar: "Procura o que quiseres (ou cola uma ligação)",
	downloads: "transferências",
	toasts: {
		addedToQueue: "{item} adicionados à fila",
		alreadyInQueue: "{item} já está na fila!",
		finishDownload: "{item} foi transferido.",
		allDownloaded: "Todas as transferências terminadas!",
		refreshFavs: "Recarregamento terminado!",
		loggingIn: "A autenticar",
		loggedIn: "Autenticado",
		alreadyLogged: "Já estás autenticado",
		loginFailed: "Não foi possível iniciar sessão",
		loggedOut: "Sessão encerrada",
		cancellingCurrentItem: "A cancelar item atual.",
		currentItemCancelled: "Item atual cancelado.",
		startAddingArtist: "A adicionar {artist} álbuns à fila",
		finishAddingArtist: "Adicionados {artist} álbuns à fila",
		startConvertingSpotifyPlaylist:
			"A converter faixas do spotify em faixas do deezer",
		finishConvertingSpotifyPlaylist:
			"Lista de reprodução do Spotify convertida.",
		loginNeededToDownload:
			"É necessário iniciar sessão para transferir faixas!",
		deezerNotAvailable:
			"O Deezer não está disponível no teu país. Deverás utilizar uma VPN.",
		deezerNotReachable:
			"A app não consegue ligar-se ao Deezer. Verifica a tua ligação à internet, a tua firewall ou o teu antivirus.",
		startGeneratingItems: "A processar {n} itens...",
		finishGeneratingItems: "{n} itens gerados.",
		noLovedPlaylist: "No loved tracks playlist!",
		checkingUpdates: "A procurar atualizações...",
		updateAvailable: "Existe uma atualização disponível!",
		wrongSpotifyUsername:
			"{username} não é um nome de utilizador válido no spotify",
	},
	settings: {
		title: "Definições",
		languages: "Idioma",
		login: {
			title: "Inicio de Sessão",
			loggedIn: "Estás autenticado como {username}",
			arl: {
				question: "Como obter o meu ARL?",
				update: "Atualizar ARL",
				howTo: {
					prologue: {
						p1: "O Deezer monitoriza sessões abertas utilizando um cookie chamado ARL.",
						p2: "O Deemix utiliza este cookie para obter metadata necessária para transferir faixas do Deezer.",
						p3: "Os ARL duram 3 meses, após esse período o Deezer solicita novo inicio de sessão. O mesmo método é usado no deemix.",
						p4: "Seguindo um dos guias mais abaixo poderás obter o teu próprio ARL.",
						warning:
							"Utiliza este método apenas no caso do email e palavra-passe não funcionarem.",
					},
					chromeSteps: {
						title: "Chrome",
						step1: "Abrir Chrome",
						easyWay: {
							title: "Chrome (Método simples)",
							step3: "Clique no pequeno cadeado ao lado do URL",
							step4: "Clique em Cookies > deezer.com > cookies > arl",
							step5: "Seleciona o texto após Conteúdo, e faz cópia",
						},
						step4:
							"Vai ao separador Aplicação (caso não o vejas clique na seta dupla)",
						videoGuide: {
							text: "Aqui tens um {videoGuide}",
							link: "guia em vídeo",
						},
					},
					firefoxSteps: {
						title: "Firefox",
						step1: "Abrir Firefox",
						step4:
							"Ir ao separador Armazenamento (caso não o vejas clique na seta dupla)",
					},
					commonSteps: {
						step2: "Acede a www.deezer.com e inicia a sessão na tua conta",
						step3:
							"Após inicio de sessão carrega no F12 para abrir as Ferramentas de Programador",
						step5: "Expandir cookie",
						step6: "Seleciona www.deezer.com",
						step7: "Procura o cookie `arl` (Deverá ter 192 caracteres)",
						step8:
							"Certifica-te que apenas copias o valor e não o cookie completo",
						lastStep:
							"E isso é o teu ARL que agora poderás utilizar na tua app",
					},
				},
			},
			logout: "Sair",
			login: "Iniciar sessão",
			email: "E-mail",
			password: "Palavra-passe",
		},
		appearance: {
			title: "Aspeto",
			slimDownloadTab: "Separador de transferências estreito",
			slimSidebar: "Barra lateral estreita",
			searchButton: "Mostrar botão de pesquisa",
			bitrateTags: "Mostrar etiqueta de qualidade na fila de transferências",
		},
		downloadPath: {
			title: "Caminho das transferências",
		},
		templates: {
			title: "Formatos",
			tracknameTemplate: "Formato do nome de faixa",
			tracknameAvailableVariables: "Variáveis associadas ao nome das faixas",
			albumTracknameTemplate: "Formato do nome de Álbum",
			albumTracknameAvailableVariables:
				"Variáveis associadas ao nome dos álbuns",
			playlistTracknameTemplate: "Formato do nome de lista de reprodução",
			playlistTracknameAvailableVariables:
				"Variáveis associadas ao nome das listas de reprodução",
		},
		folders: {
			title: "Pastas",
			createPlaylistFolder: "Criar pasta para lista de reprodução",
			playlistNameTemplate: "Formato da pasta de lista de reprodução",
			createArtistFolder: "Criar pasta para artista",
			artistNameTemplate: "Formato da pasta de artista",
			createAlbumFolder: "Criar pasta para álbum",
			albumNameTemplate: "Formato da pasta de álbum",
			createCDFolder: "Criar pasta para CDs",
			createStructurePlaylist:
				"Criar estrutura de pastas para listas reprodução",
			createSingleFolder: "Criar estrutura de pastas para singles",
		},
		trackTitles: {
			title: "Título",
			padTracks: "Bloco de Faixas",
			paddingSize: "Substituir tamanho do preenchimento",
			illegalCharacterReplacer: "Substituir caractere inválido",
		},
		downloads: {
			title: "Transferências",
			queueConcurrency: "Transferências concorrentes",
			maxBitrate: {
				title: "Bitrate preferencial",
				9: "FLAC 1411kbps",
				3: "MP3 320kbps",
				1: "MP3 128kbps",
			},
			overwriteFile: {
				title: "Ficheiros existentes. Substituir?",
				y: "Sim, substituir o ficheiro",
				n: "Não substituir o ficheiro",
				t: "Substituir apenas as etiquetas",
				b: "Não, manter ambos os ficheiros e numerar o ficheiro duplicado",
				e: "Não e ignorar as extensões",
			},
			fallbackBitrate: "Bitrate fallback",
			fallbackSearch: "Fallback de pesquisa",
			fallbackISRC: "Fallback com pesquisa ISRC",
			feelingLucky: "Arriscar com CDNs e caches",
			logErrors: "Criar histórico para erros",
			logSearched: "Criar histórico para faixas pesquisadas",
			createM3U8File: "Criar ficheiro de lista de reprodução",
			syncedLyrics: "Criar ficheiro .lrc (Letra Sincronizada)",
			playlistFilenameTemplate:
				"Formato do nome de ficheiro da lista de reprodução",
			clearQueueOnExit: "Limpar fila de transferências ao fechar a aplicação",
		},
		covers: {
			title: "Capas do Álbum",
			saveArtwork: "Guardar capas",
			coverImageTemplate: "Modelo do nome da capa",
			saveArtworkArtist: "Salvar imagem do artista",
			artistImageTemplate: "Modelo de imagem do artista",
			localArtworkSize: "Tamanho da arte gráfica local",
			embeddedArtworkSize: "Tamanho da arte gráfica incorporada",
			localArtworkFormat: {
				title: "Em que formato desejas guardar localmente a arte gráfica?",
				jpg: "Em jpeg",
				png: "Em png",
				both: "Em jpeg e em png",
			},
			jpegImageQuality: "Qualidade de imagem JPEG",
			embeddedArtworkPNG: "Guardar arte gráfica incorporada como PNG",
			embeddedPNGWarning:
				"PNGs não são oficialmente suportados pelo Deezer e podem ocorrer erros",
			imageSizeWarning:
				"Qualquer resolução acima de x1200 não são oficialmente suportados pelo Deezer e podem ocorrer erros",
			coverDescriptionUTF8:
				"Guardar descrição da capa como UTF8? (iTunes Cover Fix)",
		},
		tags: {
			head: "Etiquetas a guardar",
			title: "Título",
			artist: "Artista",
			artists: "Etiqueta extra ARTISTAS",
			album: "Álbum",
			cover: "Capa",
			trackNumber: "Número de faixa",
			trackTotal: "Total de faixas",
			discNumber: "Número do Disco",
			discTotal: "Total de Discos",
			albumArtist: "Artista do Álbum",
			genre: "Género",
			year: "Ano",
			date: "Data",
			explicit: "Letra Explícita",
			isrc: "ISRC",
			length: "Duração da faixa",
			barcode: "Código de barras do álbum (UPC)",
			bpm: "BPM",
			replayGain: "ReplayGain",
			label: "Editora do álbum",
			lyrics: "Letra da música não sincronizada",
			syncedLyrics: "Letra da música sincronizada",
			copyright: "Direitos de Autor",
			composer: "Compositor",
			involvedPeople: "Pessoas envolvidas",
			artistsWarning:
				"Desativar a etiqueta ARTISTAS ao não usar especificações padrão, não preservará o suporte a multi-artistas",
		},
		other: {
			title: "Outros",
			autoCheckForUpdates: "Procurar novas atualizações ao iniciar",
			savePlaylistAsCompilation: "Guardar listas de reprodução como compilação",
			useNullSeparator: "Usar separador nulo",
			saveID3v1: "Também guardar ID3v1",
			multiArtistSeparator: {
				title: "Como queres separarar os artistas?",
				nothing: "Guardar apenas o artista principal",
				default: "Usar especificação padrão",
				andFeat: "Usar & e feat.",
				using: 'Usar "{separator}"',
				warning:
					"Utilizar outro separador para além das especificações standard irão adicionar uma etiqueta extra ARTISTAS para perservar o suporte a multi-artistas",
			},
			singleAlbumArtist: "Guardar apenas o artista principal do álbum",
			albumVariousArtists: 'Manter "Various Artists" nos Artistas do Álbum',
			removeAlbumVersion: 'Remover "Album Version" do título da faixa',
			removeDuplicateArtists: "Remover combinação de artistas",
			dateFormat: {
				title: "Formato de data nos ficheiros FLAC",
				year: "AAAA",
				month: "MM",
				day: "DD",
			},
			featuredToTitle: {
				title: "O que devo fazer com artistas convidados/participações?",
				0: "Nada",
				1: "Remover do título",
				3: "Remover do título e do título do album",
				2: "Movê-lo para o título",
			},
			titleCasing: "Caixa do Título",
			artistCasing: "Caixa do Artista",
			casing: {
				nothing: "Manter inalterado",
				lower: "minusculas",
				upper: "MAIÚSCULAS",
				start: "Início De Cada Palavra",
				sentence: "Como uma frase",
			},
			previewVolume: "Volume de Pré-visualização",
			executeCommand: {
				title: "Comando a executar após transferir",
				description: "Deixar em branco para nenhuma acção",
			},
		},
		spotify: {
			title: "Funcionalidades Spotify",
			clientID: "Spotify clientID",
			clientSecret: "Spotify Client Secret",
			username: "nome de utilizador Spotify",
			question: "Como ativo as funcionalidades Spotify?",
			howTo: {
				prologue: {
					p1: '"Funcionalidades Spotify" são um conjunto de funcionalidades que permitem converter ligações de faixas e álbuns do Spotify em ligações do Deezer.',
					p2: "Caso forneças uma ligação para uma lista de reprodução Spotify a aplicação converterá automaticamente tosas as ligações de faixas em ligações de faixas Deezer.",
					p3: "Ao ativar estas funcionalidades também permitirá ver as tuas listas de reprodução públicas no separator Favoritos.",
				},
				info: "Por razões de segurança, deverás fornecer o teu próprio Client ID e Client Secret",
				clientSecretQuestion: {
					title: "Como obtenho o meu Client ID e Client Secret?",
					step1: {
						text: "Ligar a {spotifyDevelopersDashboard} e iniciar sessão com a tua conta Spotify.",
						spotifyDevelopersDashboard: "Spotify for Developers's Dashboard",
					},
					step2: {
						text: 'Clique em "Create an App".',
						imageAlt:
							"Botão 'Create an App' no 'Spotify for Developers's Dashboard'",
					},
					step3: {
						text: 'Preenche os campos "App name" e "App description" e marca ambas as caixas de seleção. E depois clique no botão "Create".',
						imageAlt: 'Formulário "Create an app form"',
					},
					step4: {
						text: 'O Client ID já está visível. Caso clique em "Show Client Secret" o segredo do cliente será revelado.',
						imageAlt: "Imagem do client ID e Secret",
					},
					step5:
						"Copia e cola os resultados nos campos correspondentes das definições.",
				},
				usernameQuestion: {
					title: "Como obtenho o meu nome de utilizador Spotify?",
					step1: {
						text: "Podes obter o teu nome de utilizador na {overviewPage} no site do Spotify.",
						overviewPage: "Overview page",
					},
				},
			},
		},
		reset: "Repor definições padrão",
		resetMessage: "Tens a certeza que queres repor as definições padrão?",
		save: "Guardar",
		toasts: {
			init: "Definições carregadas!",
			update: "Definições atualizadas",
			reset: "Definições padrão repostas!",
			ARLcopied: "ARL copiado para area de transferencia",
		},
	},
	sidebar: {
		home: "início",
		search: "pesquisa",
		charts: "tabelas",
		favorites: "favoritos",
		linkAnalyzer: "analizador de links",
		settings: "definições",
		logs: "logs",
		about: "sobre",
	},
	tracklist: {
		downloadSelection: "Transferir selecionados",
	},
};

export default pt;
