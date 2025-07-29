const es = {
	globals: {
		welcome: "Bienvenido a deemix",
		back: "atrás",
		loading: "cargando",
		download: "Descarga {thing}",
		by: "por {artist}",
		in: "en {album}",
		download_hint: "Descargar",
		play_hint: "Reproducir",
		toggle_download_tab_hint: "Expandir/Colapsar",
		clean_queue_hint: "Limpieza terminada",
		cancel_queue_hint: "Cancelar todo",
		open_downloads_folder: "Abrir la carpeta de descargas",
		cut: "cortar",
		copy: "copiar",
		copyLink: "copiar vinculo",
		copyImageLink: "copiar el vínculo de la imagen",
		copyDeezerLink: "copiar el vínculo de Deezer",
		paste: "pegar",
		listTabs: {
			empty: "",
			all: "todo",
			top_result: "mejor resultado",
			album: "álbum | álbumes",
			artist: "artista | artistas",
			single: "single | singles",
			title: "título | títulos",
			track: "pista | pistas",
			trackN: "0 pistas | {n} pista | {n} pistas",
			releaseN: "0 entregas | {n} entrega | {n} entregas",
			playlist: "lista de reproducción | listas de reproducción",
			compile: "compilación | compilaciones",
			ep: "ep | eps",
			more: "Más álbumes",
			featured: "Aparece en",
			spotifyPlaylist:
				"lista de reproducción spotify | listas de reproducción spotify",
			releaseDate: "fecha de publicación",
			error: "error",
		},
	},
	about: {
		updates: {
			currentVersion: "Versión actual",
			versionNotAvailable: "N/D",
			updateAvailable: `No estás ejecutando la última versión disponible: {version}`,
			deemixVersion: "versión de la biblioteca deemix",
		},
		titles: {
			usefulLinks: "Enlaces útiles",
			bugReports: "Reportar fallos",
			contributing: "Contribuye",
			donations: "Donaciones",
			license: "Licencia",
		},
		subtitles: {
			bugReports: "¿Hay algo que no funcione en Deemix? ¡Díganoslo!",
			contributing:
				"¿Quieres contribuir a este proyecto? ¡Puedes hacerlo de diferentes maneras!",
			donations:
				"¿Quiere contribuir monetariamente? ¡Puedes hacer una donación!",
		},
		usesLibrary:
			"Esta aplicación usa la biblioteca <strong>deemix</strong>, que puedes usar para hacer tu propia interfaz de usuario para deemix.",
		thanks: `Gracias a <strong>rtonno</strong>, <strong>uhwot</strong> y <strong>lollilol</strong> por ayudarme con este proyecto, a <strong>BasCurtiz</strong> por hacer el icono.`,
		upToDate: {
			text: `Mantente al día con las actualizaciones siguiendo el {newsChannel} en Telegram.`,
			newsChannel: "canal de noticias",
		},
		officialWebsite: "Página web oficial",
		officialRepo: "Repositorio de la biblioteca oficial",
		officialWebuiRepo: "Repositorio oficial de WebUI",
		officialSubreddit: "Subreddit oficial",
		newsChannel: "Canal de noticias",
		questions: {
			text: `Si tienes preguntas o problemas con la aplicación, busca una solución en el {subreddit} primero. Luego, si no encuentras nada puedes hacer un post con tu problema en el subreddit.`,
			subreddit: "subreddit",
		},
		beforeReporting:
			"Antes de informar de un error asegúrese de que está ejecutando la última versión de la aplicación y que lo que quiere informar es en realidad un error y no algo que está mal sólo en su extremo.",
		beSure:
			"Asegúrate de que el fallo es reproducible en otras máquinas y también <strong>NO</strong> reporte un fallo si ya ha sido reportado.",
		duplicateReports:
			"Los informes de errores duplicados se cerrarán, así que manténgase al tanto de eso.",
		dontOpenIssues:
			"<strong>NO</strong> abra problemas para hacer preguntas, hay un subreddit para eso.",
		newUI: {
			text: `Si tienes fluidez en Python podrías intentar hacer una nueva interfaz de usuario para la aplicación usando la biblioteca base, o arreglar los errores de la biblioteca con una petición pull en el {repo}.`,
			repo: "repo",
		},
		acceptFeatures:
			"También acepto características, pero no cosas complejas, ya que se pueden implementar directamente en la aplicación y no en la biblioteca.",
		otherLanguages:
			"¡Si dominas otro lenguaje de programación podrías intentar portar Deemix a otros lenguajes de programación!",
		contributeWebUI: {
			text: `Si conoces Vue.js (JavaScript), HTML o CSS podrías contribuir a la {webui}.`,
			webui: "WebUI",
		},
		itsFree:
			"Debes recordar que <strong>este es un proyecto libre</strong> y <strong>debes apoyar a los artistas que amas</strong> antes de apoyar a los desarrolladores.",
		notObligated:
			"No te sientas obligado a donar, ¡te aprecio de todas formas!",
		licencedUnder: {
			text: `Esta obra está autorizada bajo una {gpl3}.`,
			gpl3: "GNU Licencia Pública General 3.0",
		},
	},
	charts: {
		title: "Listas",
		changeCountry: "Cambiar país",
		download: "Descargar la lista",
	},
	errors: {
		title: "Errores para {name}",
		ids: {
			invalidURL: "No se reconoce la URL",
			unsupportedURL: "La URL aún no está soportada",
			ISRCnotOnDeezer: "La pista ISRC no está disponible en Deezer",
			notYourPrivatePlaylist:
				"No puedes descargar otras listas de reproducción privadas.",
			spotifyDisabled:
				"Las funciones de Spotify no está configurado correctamente.",
			trackNotOnDeezer: "¡No se encontró la pista en Deezer!",
			albumNotOnDeezer: "¡El álbum no se encuentra en Deezer!",
			notOnDeezer: "¡Pista no disponible en Deezer!",
			notEncoded: "¡Pista aún no codificada!",
			notEncodedNoAlternative:
				"¡Pista aún no codificada y no se ha encontrado ninguna alternativa!",
			wrongBitrate:
				"La pista no se encuentra a la velocidad de bitrate deseada.",
			wrongBitrateNoAlternative:
				"¡Pista no encontrada a la tasa de bits deseada y no se ha encontrado ninguna alternativa!",
			no360RA: "La pista no está disponible en Reality Audio 360.",
			notAvailable: "¡La pista no está disponible en los servidores de Deezer!",
			notAvailableNoAlternative:
				"¡La pista no está disponible en los servidores de Deezer y no se ha encontrado ninguna alternativa!",
			noSpaceLeft: "¡No queda espacio en el dispositivo!",
		},
	},
	favorites: {
		title: "Favoritos",
		noPlaylists: "No se han encontrado listas de reproducción",
		noAlbums: "No se han encontrado álbumes favoritos",
		noArtists: "No se han encontrado artistas favoritos",
		noTracks: "No se han encontrado pistas favoritas",
	},
	home: {
		needTologin:
			"Necesitas entrar en tu cuenta de Deezer antes de poder empezar a descargar.",
		openSettings: "Abrir la configuración",
		sections: {
			popularPlaylists: "Listas de reproducción populares",
			popularAlbums: "Los álbumes más stremeados",
		},
	},
	linkAnalyzer: {
		info: "Puedes usar esta sección para encontrar más información sobre el enlace que estás tratando de descargar.",
		useful:
			"Esto es útil si está tratando de descargar algunas pistas que no están disponibles en su país y quiere saber dónde están disponibles, por ejemplo.",
		linkNotSupported: "Este enlace aún no está soportado",
		linkNotSupportedYet:
			"Parece que este enlace aún no está soportado, intenta analizar otro.",
		table: {
			id: "ID",
			isrc: "ISRC",
			upc: "UPC",
			duration: "Duración",
			diskNumber: "Número del disco",
			trackNumber: "Número de la pista",
			releaseDate: "Fecha de lanzamiento",
			bpm: "BPM",
			label: "Etiqueta",
			recordType: "Tipo de grabación",
			genres: "Géneros",
			tracklist: "Lista de pista",
		},
	},
	search: {
		startSearching: "¡Comienza a buscar!",
		description:
			"Puedes buscar un tema, un álbum entero, un artista, una lista de reproducción... ¡todo! También puedes pegar un enlace de Deezer",
		fans: "{n} fans",
		noResults: "Ningun resultado",
		noResultsTrack: "No se encontraron pistas",
		noResultsAlbum: "No se encontraron álbumes",
		noResultsArtist: "No se encontraron artistas",
		noResultsPlaylist: "No se encontraron listas de reproducción",
	},
	searchbar: "Busca lo que quieras (o simplemente pega un enlace)",
	downloads: "descargas",
	toasts: {
		restoringQueue: "Restaurando la cola de descarga...",
		queueRestored: "¡Cola de descarga restaurada!",
		addedToQueue: "{item} añadidos a la cola",
		addedMoreToQueue: "{n} elementos añadidos a la cola",
		alreadyInQueue: "¡{item} ya está en la cola!",
		finishDownload: "{item} terminado de descargar.",
		allDownloaded: "¡Todas las descargas se han completado!",
		refreshFavs: "¡Actualización completada!",
		loggingIn: "Conectando...",
		loggedIn: "Conectado",
		alreadyLogged: "Ya está conectado",
		loginFailed: "No se puede conectar",
		loggedOut: "Desconectado",
		cancellingCurrentItem: "Cancelando el elemento actual.",
		currentItemCancelled: "El elemento actual se ha cancelado.",
		startAddingArtist: "Añadiendo los álbumes de {artist} a la cola",
		finishAddingArtist: "Se ha añadido los álbumes de {artist} a la cola",
		startConvertingSpotifyPlaylist:
			"Convertir las pistas de Spotify en pistas de Deezer",
		finishConvertingSpotifyPlaylist:
			"Lista de reproducción de Spotify convertida",
		loginNeededToDownload: "¡Necesitas iniciar sesión para descargar títulos!",
		deezerNotAvailable:
			"Deezer no está disponible en su país. Deberías usar una VPN.",
	},
	settings: {
		title: "Configuración",
		languages: "Idiomas",
		login: {
			title: "Iniciar Sesión",
			loggedIn: "Usted está conectado como {nombre de usuario}",
			arl: {
				question: "¿Cómo consigo mi propio ARL?",
				update: "Actualiza la ARL",
			},
			logout: "Cerrar Sesión",
			login: "Inicia sesión a través de deezer.com",
		},
		appearance: {
			title: "Apariencia",
			slimDownloadTab: "Pestaña de descargas fina",
		},
		downloadPath: {
			title: "Ruta de descarga",
		},
		templates: {
			title: "Plantillas",
			tracknameTemplate: "Plantilla de nombres de pista",
			albumTracknameTemplate: "Plantilla de pista del álbum",
			playlistTracknameTemplate:
				"Plantilla de pista de la lista de reproducción",
		},
		folders: {
			title: "Carpetas",
			createPlaylistFolder: "Crear una carpeta para las listas de reproducción",
			playlistNameTemplate:
				"Plantilla de la carpeta de la lista de reproducción",
			createArtistFolder: "Crear carpeta para el artista",
			artistNameTemplate: "Plantilla de la carpeta del artista",
			createAlbumFolder: "Crear carpeta para el álbum",
			albumNameTemplate: "Plantilla de la carpeta del álbum",
			createCDFolder: "Crear una carpeta para los CDs",
			createStructurePlaylist:
				"Crear una estructura de carpetas para las listas de reproducción",
			createSingleFolder: "Crear una estructura de carpetas para individuales",
		},
		trackTitles: {
			title: "Títulos de las pistas",
			padTracks: "Pad de pistas",
			paddingSize: "Sobrescribir el tamaño del pad",
			illegalCharacterReplacer: "Reemplazo del carácter ilegal",
		},
		downloads: {
			title: "Descargas",
			queueConcurrency: "Descargas simultáneas",
			maxBitrate: {
				title: "Tasa de bits preferida",
				9: "FLAC 1411kbps",
				3: "MP3 320kbps",
				1: "MP3 128kbps",
			},
			overwriteFile: {
				title: "¿Desea que se sobreescriban los archivos?",
				y: "Sí, sobrescribir el archivo",
				n: "No, no sobrescribir el archivo",
				t: "Sobrescribir sólo las etiquetas",
				b: "No, mantener los dos archivos y agregar un número al archivo duplicado",
				e: "No, y no mirar las extensiones",
			},
			fallbackBitrate: "La solución alternativa de bitrate",
			fallbackSearch: "Búsqueda de la segunda opción",
			logErrors: "Crear archivos de registro de errores",
			logSearched: "Crear archivos de registro para las pistas buscadas",
			createM3U8File: "Crear archivo de la lista de reproducción",
			syncedLyrics: "Crear archivos .lrc (lyrics sincronizadas)",
			playlistFilenameTemplate:
				"Plantilla de nombres de archivos de la lista de reproducción",
			saveDownloadQueue: "Guardar la cola de descarga al cerrar la aplicación",
		},
		covers: {
			title: "Portadas de álbumes",
			saveArtwork: "Guardar las portadas",
			coverImageTemplate: "Plantilla de nombres de portada",
			saveArtworkArtist: "Guardar imagen de artista",
			artistImageTemplate: "Plantilla de imagen de artista",
			localArtworkSize: "El tamaño de la portada local",
			embeddedArtworkSize: "El tamaño de la portada incorporada",
			localArtworkFormat: {
				title: "¿Qué formato quieres que tenga la portada local?",
				jpg: "Una imagen jpeg",
				png: "Una imagen png",
				both: "Ambos, jpeg y png",
			},
			jpegImageQuality: "Calidad de la imagen JPEG",
			embeddedArtworkPNG: "Guardar las imágenes incrustadas como PNG",
			embeddedPNGWarning:
				"Las PNG no están oficialmente soportadas por Deezer y puedes encontrar errores.",
			imageSizeWarning:
				"Nada por encima de x1200 no es usado oficialmente por Deezer, puede que encuentres inconvenientes",
			coverDescriptionUTF8:
				"Guardar la descripción de la portada usando UTF8 (arregla la portada de iTunes)",
		},
		tags: {
			head: "¿Qué etiquetas guardar?",
			title: "Título",
			artist: "Artista",
			album: "Álbum",
			cover: "Portada",
			trackNumber: "Número de pista",
			trackTotal: "Total de pistas",
			discNumber: "Número del disco",
			discTotal: "Total del disco",
			albumArtist: "Artista del álbum",
			genre: "Género",
			year: "Año",
			date: "Fecha",
			explicit: "Letras explícitas",
			isrc: "ISRC",
			length: "Duración de la pista",
			barcode: "Código de barras del álbum (UPC)",
			bpm: "BPM",
			replayGain: "Ganancia de la reproducción",
			label: "Etiqueta del álbum",
			lyrics: "Lyrics no sincronizadas",
			syncedLyrics: "Lyrics sincronizadas",
			copyright: "Derechos de autor",
			composer: "Compositor",
			involvedPeople: "Personas involucradas",
		},
		other: {
			title: "Otro",
			savePlaylistAsCompilation:
				"Guardar las listas de reproducción como una compilación",
			useNullSeparator: "Usar separador nulo",
			saveID3v1: "Guarda la ID3v1 también",
			multiArtistSeparator: {
				title: "¿Cómo le gustaría separar a sus artistas?",
				nothing: "Guardar sólo el artista principal",
				default: "Usar la especificación estándar",
				andFeat: "Usar & y feat.",
				using: 'Usar "{separator}"',
			},
			singleAlbumArtist: "Guardar sólo el artista principal del álbum",
			albumVariousArtists:
				'Mantener "Various Artists" en los artistas del álbum',
			removeAlbumVersion: 'Eliminar "Album Version" del título de la pista',
			removeDuplicateArtists: "Eliminar las combinaciones de artistas",
			dateFormat: {
				title: "Formato de fecha para los archivos FLAC",
				year: "AAAA",
				month: "MM",
				day: "DD",
			},
			featuredToTitle: {
				title: "¿Qué debo hacer con los artistas destacados?",
				0: "Nada",
				1: "Quitarlo del título",
				3: "Quitarlo del título y del título del álbum",
				2: "Moverlo al título",
			},
			titleCasing: "Capitalizar título",
			artistCasing: "Capitalizar artista",
			casing: {
				nothing: "Manténer sin cambios",
				lower: "minúsculas",
				upper: "MAYÚSCULAS",
				start: "Al Principio De Cada Palabra",
				sentence: "Como una frase",
			},
			previewVolume: "Volumen de previsualización",
			executeCommand: {
				title: "Comando a ejecutar después de la descarga",
				description: "Dejar en blanco para no hacer nada",
			},
		},
		spotify: {
			title: "Funciones de Spotify",
			clientID: "ID del cliente de Spotify",
			clientSecret: "Cliente Secreto Spotify",
			username: "Nombre de usuario de Spotify",
		},
		reset: "Restablecer el valor por defecto",
		save: "Guardar",
		toasts: {
			init: "¡Configuraciones cargadas!",
			update: "¡Ajustes actualizados!",
			ARLcopied: "ARL copiado al portapapeles",
		},
	},
	sidebar: {
		home: "inicio",
		search: "buscar",
		charts: "charts",
		favorites: "favoritos",
		linkAnalyzer: "analizar enlaces",
		settings: "ajustes",
		about: "acerca de",
	},
	tracklist: {
		downloadSelection: "Descargar selección",
	},
};

export default es;
