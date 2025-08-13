const fr = {
	globals: {
		welcome: "Bienvenue dans deemix",
		back: "retour",
		loading: "chargement en cours",
		download: "Télécharger {thing}",
		by: "par {artist}",
		in: "dans {album}",
		download_hint: "Télécharger",
		play_hint: "Lire",
		toggle_download_tab_hint: "Développer/Réduire",
		clean_queue_hint: "Retirer Les Tâches Terminées",
		cancel_queue_hint: "Tout Annuler",
		open_downloads_folder: "Ouvrir Le Dossier De Téléchargements",
		cut: "couper",
		copy: "copier",
		copyLink: "copier le lien",
		copyImageLink: "copier le lien de l'image",
		copyDeezerLink: "copier le lien deezer",
		paste: "coller",
		listTabs: {
			empty: "",
			all: "tout",
			discography: "discographie",
			top_result: "meilleur résultat",
			album: "album | albums",
			artist: "artiste | artistes",
			single: "single | singles",
			title: "titre | titres",
			track: "piste | pistes",
			playlist: "playlist | playlists",
			compile: "compilation | compilations",
			ep: "ep | eps",
			bundle: "bundle | bundles",
			more: "Plus d'albums",
			featured: "Apparaît dans",
			spotifyPlaylist: "playlist spotify | playlists spotify",
			releaseDate: "date de sortie",
			error: "erreur",
			trackN: "0 piste | {n} piste | {n} pistes",
			albumN: "0 album | {n} album | {n} albums",
			artistN: "0 artiste | {n} artiste | {n} artistes",
			releaseN: "0 sortie | {n} sortie | {n} sorties",
			playlistN: "0 playlist | {n} playlist | {n} playlists",
		},
		yes: "oui",
		no: "non",
		empty: "vide",
	},
	about: {
		appStatus: {
			online: "application en ligne",
			offline: "application hors ligne",
		},
		updates: {
			currentVersion: "Version Actuelle Du Logiciel",
			currentWebuiVersion: "Version Actuelle De La WebUI",
			versionNotAvailable: "N/A",
			updateAvailable:
				"Vous n'utilisez pas la dernière version disponible : {version}",
			deemixVersion: "Version Actuelle De La Bibliothèque deemix",
		},
		titles: {
			usefulLinks: "Liens Utiles",
			bugReports: "Rapports De Bug",
			contributing: "Contribution",
			donations: "Dons",
			license: "Licence",
		},
		subtitles: {
			bugReports:
				"Quelque chose ne fonctionne pas dans deemix ? Contactez-nous !",
			contributing:
				"Vous souhaitez contribuer à ce projet ? Vous pouvez le faire de différentes manières !",
			donations:
				"Vous souhaitez contribuer financièrement ? Vous pouvez faire un don !",
		},
		usesLibrary:
			"Cette application utilise la bibliothèque <strong>deemix</strong>, que vous pouvez exploiter afin de créer votre propre interface utilisateur pour deemix.",
		thanks:
			"Merci à <strong>rtonno</strong>, <strong>uhwot</strong> et <strong>lollilol</strong> de m'avoir aidé dans ce projet ainsi qu'à <strong>BasCurtiz</strong> pour la création de l'icône.",
		upToDate: {
			text: `Restez informé des mises à jour en suivant le {newsChannel} sur Telegram.`,
			newsChannel: "canal d'informations",
		},
		officialWebsite: "Site Officiel",
		officialRepo: "Répertoire De Dépôt Officiel De La Bibliothèque",
		officialWebuiRepo: "Répertoire De Dépôt Officiel De La WebUI",
		officialSubreddit: "Subreddit Officiel",
		newsChannel: "Canal d'Informations",
		devlogChannel: "Canal De Développement",
		questions: {
			text: `Si vous avez des questions ou des problèmes avec l'application, cherchez d'abord une solution dans le {subreddit}. Ensuite, si la solution ne s'y trouve pas, vous pouvez publier un message dans le subreddit en décrivant votre problème.`,
			subreddit: "subreddit",
		},
		beforeReporting:
			"Avant de signaler un bug, assurez-vous que vous utilisez la version la plus récente de l'application. Vérifiez que vous souhaitez nous rapporter un bug et non quelque chose qui ne fonctionne pas uniquement de votre côté.",
		beSure:
			"Assurez-vous que le bug soit reproductible sur d'autres appareils mais aussi de <strong>NE PAS</strong> signaler un bug si celui-ci a déjà été recensé.",
		duplicateReports:
			"Les rapports de bug répétitifs seront supprimés, merci d'en prendre bonne note.",
		dontOpenIssues:
			"<strong>NE PAS</strong> rapporter de problème s'il ne s'agit que de simples questions. Un subreddit existe pour ces questions.",
		newUI: {
			text: `Si vous maîtrisez python, vous pouvez essayer de créer une nouvelle interface utilisateur pour l'application à l'aide de la bibliothèque de base, ou corriger des bugs dans la bibliothèque à l'aide d'une demande de fusion de branches (pull request) sur le {repo}.`,
			repo: "répertoire de dépôt",
		},
		acceptFeatures:
			"J'accepte également les nouvelles fonctionnalités, mais pas de choses complexes, dans la mesure où elles peuvent être implémentées directement dans l'application et non dans la bibliothèque.",
		otherLanguages:
			"Si vous maîtrisez un autre langage de programmation, vous pouvez essayer de transposer deemix dans ce dernier !",
		contributeWebUI: {
			text: `Si vous vous y connaissez en Vue.js (JavaScript), HTML ou CSS, vous pouvez contribuer à la {webui}.`,
			webui: "WebUI",
		},
		itsFree:
			"N'oubliez pas que <strong>ce projet est libre</strong> et qu'il est important de <strong>soutenir vos artistes préférés</strong> avant de supporter les développeurs.",
		notObligated:
			"Ne vous sentez pas obligé de faire un don, vous êtes tout de même apprécié !",
		licencedUnder: {
			text: `Ce projet s'inscrit dans le cadre de la {gpl3}.`,
			gpl3: "Licence publique générale GNU, version 3",
		},
	},
	charts: {
		title: "Classements",
		changeCountry: "Changer De Pays",
		download: "Télécharger Le Classement",
	},
	errors: {
		title: "Erreurs pour {name}",
		postTitle: "Erreurs survenues après le téléchargement",
		ids: {
			invalidURL: "Cette URL n'est pas reconnue",
			unsupportedURL: "Cette URL n'est actuellement pas supportée",
			ISRCnotOnDeezer: "L'ISRC de la piste est indisponible sur Deezer",
			notYourPrivatePlaylist:
				"Vous n'êtes pas autorisé à télécharger les playlists privées de quelqu'un d'autre.",
			spotifyDisabled:
				"Les Fonctionnalités Spotify ne sont pas configurées correctement.",
			trackNotOnDeezer: "La piste est introuvable sur Deezer !",
			albumNotOnDeezer: "L'album est introuvable sur Deezer !",
			notOnDeezer: "La piste est indisponible sur Deezer !",
			notEncoded: "La piste n'a pas encore été encodée !",
			notEncodedNoAlternative:
				"La piste n'a pas encore été encodée et aucune alternative n'a été trouvée !",
			wrongBitrate: "La piste est introuvable au débit souhaité.",
			wrongBitrateNoAlternative:
				"La piste est introuvable au débit souhaité et aucune alternative n'a été trouvée !",
			no360RA: "La piste est indisponible au format Reality Audio 360.",
			notAvailable: "La piste est indisponible sur les serveurs de Deezer !",
			notAvailableNoAlternative:
				"La piste est indisponible sur les serveurs de Deezer et aucune alternative n'a été trouvée !",
			noSpaceLeft: "L'espace disponible sur cet appareil est insuffisant !",
			albumDoesntExists:
				"Aucun album n'existe pour cette piste, impossible de collecter les informations nécessaires.",
			wrongLicense:
				"Votre compte ne prend pas en charge les pistes en {bitrate}.",
			wrongGeolocation:
				"Votre compte ne prend pas en charge la piste depuis votre pays actuel.",
			wrongGeolocationNoAlternative:
				"Votre compte ne prend pas en charge la piste depuis votre pays actuel et aucune alternative n'a été trouvée.",
		},
	},
	favorites: {
		title: "Favoris",
		noPlaylists: "Aucune Playlist Favorite n'a été trouvée",
		noAlbums: "Aucun Album Favori n'a été trouvé",
		noArtists: "Aucun Artiste Favori n'a été trouvé",
		noTracks: "Aucune Piste Favorite n'a été trouvée",
	},
	home: {
		needTologin:
			"Vous devez vous connecter à votre compte Deezer avant de pouvoir démarrer un téléchargement.",
		openSettings: "Ouvrir Les Paramètres",
		sections: {
			popularPlaylists: "Playlists les plus écoutées",
			popularAlbums: "Albums les plus écoutés",
		},
	},
	linkAnalyzer: {
		info: "Vous pouvez utiliser cette section pour obtenir davantage d'informations sur le lien que vous essayez de télécharger.",
		useful:
			"C'est utile si vous essayez, par exemple, de télécharger des pistes indisponibles dans votre pays et que vous souhaitez savoir où elles sont disponibles.",
		linkNotSupported: "Ce lien n'est pas encore pris en charge",
		linkNotSupportedYet:
			"Il semble que ce lien ne soit pas encore pris en charge, essayez d'en analyser un autre.",
		table: {
			id: "ID",
			isrc: "ISRC",
			upc: "UPC",
			duration: "Durée",
			diskNumber: "Numéro De Disque",
			trackNumber: "Numéro De Piste",
			releaseDate: "Date De Sortie",
			bpm: "BPM",
			label: "Label",
			recordType: "Type d'Enregistrement",
			genres: "Genres",
			tracklist: "Liste Des Pistes",
			readable: "Lisible",
			available: "Disponible",
		},
		countries: "Pays",
		noCountries: "Cette piste n'est disponible dans aucun pays.",
	},
	search: {
		startSearching: "Démarrer une recherche !",
		description:
			"Vous pouvez rechercher une piste, un album entier, un artiste, une playlist... tout ce que vous voulez ! Vous pouvez également coller un lien Deezer.",
		fans: "{n} fans",
		noResults: "Aucun résultat",
		noResultsTrack: "Aucune piste n'a été trouvée",
		noResultsAlbum: "Aucun album n'a été trouvé",
		noResultsArtist: "Aucun artiste n'a été trouvé",
		noResultsPlaylist: "Aucune playlist n'a été trouvée",
		error: "Une erreur est survenue, veuillez réessayer ultérieurement.",
	},
	searchbar: "Saisissez une requête (ou collez simplement un lien)",
	downloads: "téléchargements",
	toasts: {
		restoringQueue: "Restauration de la file d'attente de téléchargement...",
		queueRestored: "La file d'attente de téléchargement a été restaurée !",
		addedToQueue: "{item} ajouté à la file d'attente",
		addedMoreToQueue: "{n} éléments ajoutés à la file d'attente",
		alreadyInQueue: "{item} est déjà dans la file d'attente !",
		finishDownload: "{item} a été téléchargé.",
		allDownloaded: "Tous les téléchargements sont terminés !",
		refreshFavs: "Actualisation terminée !",
		loggingIn: "Connexion en cours...",
		loggedIn: "Connecté",
		alreadyLogged: "Déjà connecté",
		loginFailed: "Connexion impossible",
		loggedOut: "Déconnecté",
		cancellingCurrentItem: "Annulation de l'élément actuel.",
		currentItemCancelled: "Élément actuel annulé.",
		startAddingArtist: "Ajout des albums de {artist} à la file d'attente",
		finishAddingArtist:
			"Les albums de {artist} ont été ajoutés à la file d'attente",
		startConvertingSpotifyPlaylist:
			"Conversion de pistes Spotify en équivalents Deezer",
		finishConvertingSpotifyPlaylist: "Playlist Spotify convertie",
		loginNeededToDownload:
			"Vous devez vous connecter pour pouvoir télécharger des pistes !",
		queueErrorCantStream:
			"Votre compte ne prend pas en charge les téléchargements en {bitrate}.",
		deezerNotAvailable:
			"Deezer est indisponible dans votre pays. Vous devez utiliser un VPN.",
		deezerNotReachable:
			"L'application ne semble pas pouvoir communiquer avec Deezer. Vérifiez votre connexion internet, votre pare-feu ou votre antivirus.",
		startGeneratingItems: "Traitement de {n} éléments...",
		finishGeneratingItems: "{n} éléments ont été générés.",
		noLovedPlaylist: "Aucune playlist de pistes favorites !",
		checkingUpdates: "Recherche des mises à jour...",
		updateAvailable: "Une mise à jour est disponible !",
		wrongSpotifyUsername:
			"{username} n'est pas un nom d'utilisateur Spotify valide",
	},
	settings: {
		title: "Paramètres",
		languages: "Langues",
		login: {
			title: "Connexion",
			loggedIn: "Vous êtes connecté en tant que {username}",
			arl: {
				title: "Utiliser de préférence la connexion via ARL",
				question: "Comment obtenir mon ARL personnel ?",
				howTo: {
					prologue: {
						p1: "Deezer conserve une trace de votre connexion en utilisant un cookie appelé ARL.",
						p2: "Deemix utilise ce cookie pour obtenir les métadonnées dont il a besoin pour télécharger les pistes depuis Deezer.",
						p3: "Les ARLs restent valables pendant 3 mois, après quoi Deezer vous demande de vous reconnecter. La même méthode est utilisée dans deemix.",
						p4: "En suivant l'un des modes opératoires ci-dessous, vous pouvez obtenir votre ARL personnel.",
						warning:
							"N'utilisez cette méthode que si l'e-mail et le mot de passe ne fonctionnent pas.",
					},
					chromeSteps: {
						title: "Chrome",
						step1: "Ouvrez Chrome",
						easyWay: {
							title: "Chrome (Méthode simple)",
							step3:
								"Cliquez sur la petite icône représentant un cadenas située à côté de l'URL.",
							step4: "Cliquez sur Cookies > deezer.com > cookies > arl",
							step5:
								"Sélectionnez la chaîne de caractères située à côté de Contenu, et copiez-la",
						},
						step4:
							"Allez sous l'onglet Application (si vous ne le voyez pas, cliquez sur la double flèche).",
						videoGuide: {
							text: "Voici un {videoGuide}",
							link: "tutoriel vidéo",
						},
					},
					firefoxSteps: {
						title: "Firefox",
						step1: "Ouvrez Firefox",
						step4:
							"Allez sous l'onglet Stockage (si vous ne le voyez pas, cliquez sur la double flèche).",
					},
					commonSteps: {
						step2: "Allez sur www.deezer.com et connectez-vous à votre compte",
						step3:
							"Une fois la connexion effectuée, appuyez sur F12 pour ouvrir les outils du développeur.",
						step5: "Ouvrez le menu déroulant Cookies",
						step6: "Sélectionnez www.deezer.com",
						step7:
							"Recherchez le cookie `arl` (il doit comporter 192 caractères).",
						step8:
							"Assurez-vous de ne copier que la valeur et non l'intégralité du cookie.",
						lastStep:
							"Il s'agit de votre ARL personnel, vous pouvez maintenant l'utiliser dans l'application.",
					},
				},
				update: "Forcer la réactualisation de l'ARL",
			},
			logout: "Déconnexion",
			login: "Connexion",
			email: "E-mail",
			password: "Mot de passe",
		},
		appearance: {
			title: "Apparence",
			slimDownloadTab: "Onglet de téléchargement compact",
			slimSidebar: "Barre latérale compacte",
			searchButton: "Afficher le bouton de recherche",
			bitrateTags:
				"Afficher l'indicateur de qualité audio dans la file d'attente de téléchargement",
		},
		downloadPath: {
			title: "Emplacement De Téléchargement",
		},
		templates: {
			title: "Modèles",
			tracknameTemplate: "Modèle pour le nom de piste",
			tracknameAvailableVariables: "Variables disponibles pour le nom de piste",
			albumTracknameTemplate: "Modèle pour le nom de piste de l'album",
			albumTracknameAvailableVariables:
				"Variables disponibles pour le nom de piste de l'album",
			playlistTracknameTemplate: "Modèle pour le nom de piste de la playlist",
			playlistTracknameAvailableVariables:
				"Variables disponibles pour le nom de piste de la playlist",
		},
		folders: {
			title: "Dossiers",
			createPlaylistFolder: "Générer des dossiers par playlist",
			playlistNameTemplate: "Modèle pour le nom du dossier de playlist",
			createArtistFolder: "Générer des dossiers par artiste",
			artistNameTemplate: "Modèle pour le nom du dossier d'artiste",
			createAlbumFolder: "Générer des dossiers par album",
			albumNameTemplate: "Modèle pour le nom du dossier d'album",
			createCDFolder: "Générer des dossiers par CD",
			createStructurePlaylist:
				"Générer une structure de dossiers pour les playlists",
			createSingleFolder: "Générer une structure de dossiers pour les singles",
		},
		trackTitles: {
			title: "Titres des pistes",
			padTracks:
				"Longueur uniforme des numéros de piste (ajoute automatiquement des zéros devant le numéro initial de la piste)",
			paddingSize:
				"Nombre de zéros à ajouter en permanence devant le numéro initial de la piste",
			illegalCharacterReplacer:
				"Substitut aux caractères non autorisés (dans les noms de fichiers et de dossiers)",
		},
		downloads: {
			title: "Téléchargements",
			queueConcurrency: "Téléchargements Simultanés",
			maxBitrate: {
				title: "Débit Préféré",
				9: "FLAC 1411kbps",
				3: "MP3 320kbps",
				1: "MP3 128kbps",
			},
			overwriteFile: {
				title: "Les fichiers doivent-ils être écrasés ?",
				y: "Oui, écraser le fichier",
				n: "Non, ne pas écraser le fichier",
				t: "Écraser uniquement les métadonnées",
				b: "Non, conserver les deux fichiers et ajouter un numéro au doublon",
				e: "Non, et ne pas tenir compte de l'extension du fichier",
				l: "Écraser uniquement si le débit est plus élevé (mp3 seulement)",
			},
			fallbackBitrate:
				"Recourir à un débit plus faible si le débit préféré n'est pas disponible",
			fallbackSearch:
				"Rechercher la piste ailleurs si le lien original n'est pas disponible",
			fallbackISRC:
				"Rechercher la piste à l'aide de son ISRC si le lien original n'est pas disponible",
			feelingLucky:
				"Utiliser les CDNs et les caches (ancienne méthode de téléchargement des pistes)",
			logErrors: "Créer un fichier journal d'erreurs",
			logSearched: "Créer un fichier journal des pistes recherchées",
			createM3U8File: "Créer un fichier de playlist",
			syncedLyrics: "Créer des fichiers .lrc (Paroles Synchronisées)",
			playlistFilenameTemplate: "Modèle du nom de fichier de la playlist",
			clearQueueOnExit:
				"Effacer la file d'attente de téléchargement lors de la fermeture de l'application",
		},
		covers: {
			title: "Pochettes d'albums",
			saveArtwork: "Enregistrer Les Pochettes",
			coverImageTemplate: "Modèle pour le nom de la pochette",
			saveArtworkArtist: "Enregistrer l'image de l'artiste",
			artistImageTemplate: "Modèle pour le nom de l'image de l'artiste",
			localArtworkSize: "Taille de l'illustration locale",
			embeddedArtworkSize:
				"Taille de l'illustration incorporée aux fichiers audio",
			localArtworkFormat: {
				title: "Dans quel format souhaitez-vous l'illustration locale ?",
				jpg: "Une image jpeg",
				png: "Une image png",
				both: "À la fois jpeg et png",
			},
			jpegImageQuality: "Qualité de l'image JPEG",
			embeddedArtworkPNG:
				"Enregistrer l'illustration incorporée aux fichiers audio en tant que PNG",
			embeddedPNGWarning:
				"Les images PNG ne sont pas officiellement utilisées par Deezer et pourraient causer des problèmes.",
			imageSizeWarning:
				"Toute valeur supérieure à x1200 n'est pas officiellement supportée par Deezer, vous pourriez donc rencontrer des problèmes.",
			coverDescriptionUTF8:
				"Enregistrer la description de la pochette au format UTF8 (iTunes Cover Fix)",
		},
		tags: {
			head: "Métadonnées à sauvegarder",
			title: "Titre",
			artist: "Artiste",
			artists: "Métadonnée supplémentaire ARTISTS",
			album: "Album",
			cover: "Pochette",
			trackNumber: "Numéro De Piste",
			trackTotal: "Nombre De Pistes",
			discNumber: "Numéro Du Disque",
			discTotal: "Nombre De Disques",
			albumArtist: "Artiste De l'Album",
			genre: "Genre",
			year: "Année",
			date: "Date",
			explicit: "Paroles Explicites",
			isrc: "ISRC",
			length: "Longueur De La Piste",
			barcode: "Code-Barres De l'Album (UPC)",
			bpm: "BPM",
			replayGain: "Gain En Relecture (Replay Gain)",
			label: "Label De l'Album",
			lyrics: "Paroles Non-Synchronisées",
			syncedLyrics: "Paroles Synchronisées",
			copyright: "Droits d'Auteur (Copyright)",
			composer: "Compositeur",
			involvedPeople: "Personnes Impliquées",
			source: "ID de la source et de la piste",
			artistsWarning:
				"La désactivation de la métadonnée ARTISTS sans utiliser la spécification standard ne préservera pas le support multi-artiste.",
		},
		other: {
			title: "Autre",
			autoCheckForUpdates:
				"Vérifier les mises à jour au démarrage de l'application",
			savePlaylistAsCompilation:
				"Enregistrer les playlists en tant que compilation",
			useNullSeparator: "Utiliser le caractère NULL comme séparateur",
			saveID3v1: "Enregistrer également les métadonnées ID3v1",
			multiArtistSeparator: {
				title: "Comment aimeriez-vous séparer les artistes ?",
				nothing: "Enregistrer uniquement l'artiste principal",
				default: "En utilisant la spécification standard",
				andFeat: "En utilisant & et feat.",
				using: 'En utilisant "{separator}"',
				warning:
					"L'utilisation d'un séparateur autre que la spécification standard nécessitera l'ajout d'une métadonnée ARTISTS afin de préserver le support multi-artiste.",
			},
			singleAlbumArtist:
				"Enregistrer uniquement l'artiste principal de l'album",
			albumVariousArtists: `Conserver "Various Artists" dans les Artistes de l'Album`,
			removeAlbumVersion: `Supprimer "Album Version" du titre de la piste`,
			removeDuplicateArtists: "Supprimer les combinaisons d'artistes",
			dateFormat: {
				title: "Format de date pour les fichiers FLAC",
				year: "AAAA",
				month: "MM",
				day: "JJ",
			},
			featuredToTitle: {
				title: "Que faire des artistes participants (featuring) ?",
				0: "Ne rien faire",
				1: "Les retirer du titre de la piste",
				3: "Les supprimer du titre de la piste et du titre de l'album",
				2: "Les déplacer vers le titre de la piste",
			},
			titleCasing: "Casse pour le titre",
			artistCasing: "Casse pour l'artiste",
			casing: {
				nothing: "Conserver inchangé",
				lower: "minuscules",
				upper: "MAJUSCULES",
				start: "Majuscule Au Début De Chaque Mot",
				sentence: "Majuscule seulement au début de la phrase",
			},
			previewVolume: "Volume sonore des aperçus de pistes",
			executeCommand: {
				title: "Commande à exécuter après le téléchargement",
				description: "Laisser vide pour qu'aucune action n'ait lieu",
			},
		},
		spotify: {
			title: "Fonctionnalités Spotify",
			clientID: "Client ID Spotify",
			clientSecret: "Client Secret Spotify",
			username: "Nom d'utilisateur Spotify",
			question: "Comment activer les Fonctionnalités Spotify ?",
			howTo: {
				prologue: {
					p1: 'Les "Fonctionnalités Spotify" sont un ensemble de fonctionnalités qui vous permet de convertir les liens des pistes et albums Spotify en équivalents Deezer.',
					p2: "Si vous introduisez un lien d'une Playlist Spotify, l'application convertira automatiquement tous les liens des pistes qu'elle contient en pistes Deezer correspondantes.",
					p3: "En activant ces fonctionnalités, vous pourrez également consulter vos Playlists Spotify publiques dans l'onglet Favoris.",
				},
				info: "Pour des raisons de sécurité, vous devrez fournir votre Client ID et votre Client Secret personnels.",
				clientSecretQuestion: {
					title:
						"Comment obtenir mon Client ID ainsi que mon Client Secret personnels ?",
					step1: {
						text: "Rendez-vous sur le {spotifyDevelopersDashboard} et connectez-vous avec votre compte Spotify.",
						spotifyDevelopersDashboard:
							"Tableau de bord Spotify pour les développeurs",
					},
					step2: {
						text: 'Cliquez sur "Create an App".',
						imageAlt: "Bouton Create an App",
					},
					step3: {
						text: 'Remplissez les champs "App name" et "App description" et cochez les deux cases. Cliquez ensuite sur le bouton "Create".',
						imageAlt: "Formulaire Create an App",
					},
					step4: {
						text: 'Vous pouvez maintenant visualiser le Client ID. Si vous cliquez sur "Show Client Secret", le Client Secret vous sera révélé.',
						imageAlt: "Ecran Client ID et Client Secret",
					},
					step5:
						"Vous pouvez maintenant copier-coller ces données dans les champs appropriés des paramètres.",
				},
				usernameQuestion: {
					title: "Comment obtenir mon nom d'utilisateur Spotify ?",
					step1: {
						text: "Vous pouvez obtenir votre nom d'utilisateur Spotify à partir de la page {overviewPage} sur site Web de Spotify.",
						overviewPage: "Vue d'ensemble du compte",
					},
				},
			},
		},
		reset: "Rétablir les valeurs par défaut",
		resetMessage:
			"Souhaitez-vous vraiment rétablir les paramètres par défaut ?",
		save: "Sauvegarder",
		toasts: {
			init: "Paramètres chargés !",
			update: "Paramètres mis à jour !",
			reset: "Paramètres réinitialisés à leur valeur par défaut !",
			ARLcopied: "ARL copié dans le presse-papier",
		},
	},
	sidebar: {
		home: "accueil",
		search: "recherche",
		charts: "classements",
		favorites: "favoris",
		linkAnalyzer: "analyseur de lien",
		settings: "paramètres",
		logs: "journaux (logs)",
		about: "à propos",
	},
	tracklist: {
		downloadSelection: "Télécharger la sélection",
	},
};

export default fr;
