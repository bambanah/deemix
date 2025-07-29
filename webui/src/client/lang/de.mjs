const de = {
	globals: {
		welcome: "Willkommen bei deemix",
		back: "Zurück",
		loading: "Lädt",
		download: "{thing} herunterladen",
		by: "von {artist}",
		in: "in {album}",
		download_hint: "Herunterladen",
		play_hint: "Abspielen",
		toggle_download_tab_hint: "Erweitern/Minimieren",
		clean_queue_hint: "Vollständige entfernen",
		cancel_queue_hint: "Alle abbrechen",
		open_downloads_folder: "Download Ordner öffnen",
		cut: "Ausschneiden",
		copy: "Kopieren",
		copyLink: "Link kopieren",
		copyImageLink: "Bildlink kopieren",
		copyDeezerLink: "Deezer Link kopieren",
		paste: "Einfügen",
		listTabs: {
			empty: "",
			all: "Alle",
			discography: "Diskographie",
			top_result: "Top Ergebnis",
			album: "Album | Alben",
			artist: "Künstler | Künstler",
			single: "Single | Singles",
			title: "Titel | Titel",
			track: "Track | Tracks",
			playlist: "Playlist | Playlists",
			compile: "Sammlung | Sammlungen",
			ep: "EP | EPs",
			bundle: "Bündel | Bündel",
			more: "Weitere Alben",
			featured: "Bekannt in",
			spotifyPlaylist: "Spotify Playlist | Spotify Playlists",
			releaseDate: "Veröffentlichungsdatum",
			error: "Fehler",
			trackN: "0 Tracks | {n} Track | {n} Tracks",
			albumN: "0 Alben | {n} Album | {n} Alben",
			artistN: "0 Künstler | {n} Künstler | {n} Künstler",
			releaseN:
				"0 Veröffentlichungen | {n} Veröffentlichung | {n} Veröffentlichungen",
			playlistN: "0 Playlisten | {n} Playlist | {n} Playlisten",
		},
		yes: "Ja",
		no: "Nein",
		empty: "Leer",
	},
	about: {
		appStatus: {
			online: "App Online",
			offline: "App Offline",
		},
		updates: {
			currentVersion: "Aktuelle Version",
			currentWebuiVersion: "Aktuelle WebUI Version",
			versionNotAvailable: "N/A",
			updateAvailable: `Du verwendest nicht die neuste Version ({version})`,
			deemixVersion: "Deemix Lib Version",
		},
		titles: {
			usefulLinks: "Nützliche Links",
			bugReports: "Fehlermeldung",
			contributing: "Mitwirkende",
			donations: "Spenden",
			license: "Lizenz",
		},
		subtitles: {
			bugReports: "Funktioniert etwas in Deemix nicht? Sag uns bescheid!",
			contributing:
				"Du möchtest bei dem Projekt helfen? Das kannst du auf verschiedene Arten machen!",
			donations:
				"Du möchtest deemix finanziell unterstützen? Dann lasse eine kleine Spende da!",
		},
		usesLibrary:
			"Dieses Programm nutzt die <strong>deemix</strong> Bibliothek, die du dazu nutzen kannst, deine eigene deemix UI zu erstellen.",
		thanks:
			"Ein Dankeschön geht an <strong>rtonno</strong>, <strong>uhwot</strong> and <strong>lollilol</strong> für die Hilfe bei diesem Projekt und an <strong>BasCurtiz</strong> für die Erstellung des Logos.",
		upToDate: {
			text: "Bleib auf dem Laufenden, indem du dem {newsChannel} auf Telegram folgst.",
			newsChannel: "News Channel",
		},
		officialWebsite: "Offizielle Website",
		officialRepo: "Offizielle Bibliotheks Repository",
		officialWebuiRepo: "Offizielle WebUI Repository",
		officialSubreddit: "Offizieller Subreddit",
		newsChannel: "Neuigkeiten Kanal",
		devlogChannel: "Devlog Kanal",
		questions: {
			text: "Suche bei Fragen oder Problemen mit der App als erstes nach einer Lösung im {subreddit}. Wenn du dort nichts findest, kannst du einen Beitrag mit deinen Problem auf dem Subreddit verfassen.",
			subreddit: "Subreddit",
		},
		beforeReporting:
			"Bevor du einen Fehler meldest, stelle sicher, dass die Version deiner App auf dem neusten Stand ist und dass dies, was du melden möchtest, tatsächlich ein Fehler und nicht nur bei dir falsch ist.",
		beSure:
			"Stelle sicher, dass der Fehler auf anderen Computern auch vorhanden ist... <strong>MELDE DEN FEHLER NICHT	</strong>, wenn dieser schon gemeldet worden ist.",
		duplicateReports:
			"Achte darauf, dass doppelte Fehlerberichte geschlossen, werden.",
		dontOpenIssues:
			"<strong>ERSTELLE KEINE</strong> Fehlermeldungen um Fragen zu stellen, es existiert ein Subreddit dafür.",
		newUI: {
			text: "Wenn du Python fließend beherrschst, kannst du versuchen, mithilfe der Basisbibliothek eine neue Benutzeroberfläche für die App zu erstellen oder Fehler in der Bibliothek mit einem Pull-Request in der {repo} zu beheben.",
			repo: "deemix Repo",
		},
		acceptFeatures:
			"Ich akzeptiere auch Funktionen, aber keine komplexen Dinge, da sie direkt in der App und nicht in der Bibliothek implementiert werden können.",
		otherLanguages:
			"Wenn du eine andere Programmiersprache fließend beherrschst, kannst du versuchen, deemix in andere Programmiersprachen zu portieren!",
		contributeWebUI: {
			text: "Wenn du Vue.js (JavaScript) oder HTML und CSS kennst, könntest du etwas zum {webui} beitragen.",
			webui: "WebUI",
		},
		itsFree:
			"Du solltest im Kopf behalten das <strong>dies ein kostenfreies Projekt ist</strong> und <strong>Du die Künstler unterstützen sollst, die du magst</strong> bevor du die Entwickler unterstützt.",
		notObligated:
			"Fühle dich nicht gezwungen zu spenden, danke, dass du deemix verwendest!",
		licencedUnder: {
			text: "Diese Arbeit ist lizensiert unter der {gpl3}.",
			gpl3: "GNU General Public License 3.0",
		},
	},
	charts: {
		title: "Charts",
		changeCountry: "Land wechseln",
		download: "Chart herunterladen",
	},
	errors: {
		title: "Fehler für {name}",
		postTitle: "Nach dem Herunterladen von Fehlern.",
		ids: {
			invalidURL: "URL nicht erkannt",
			unsupportedURL: "URL noch nicht unterstützt",
			ISRCnotOnDeezer: "Track ISRC ist auf Deezer nicht verfügbar",
			notYourPrivatePlaylist:
				"Du kannst keine privaten Playlisten anderer herunterladen.",
			spotifyDisabled: "Spotify-Funktionen sind nicht richtig eingerichtet",
			trackNotOnDeezer: "Track ist auf Deezer nicht verfügbar!",
			albumNotOnDeezer: "Album auf Deezer nicht gefunden!",
			notOnDeezer: "Track auf Deezer nicht verfügbar!",
			notEncoded: "Track noch nicht codiert!",
			notEncodedNoAlternative:
				"Track noch nicht codiert und keine Alternative gefunden!",
			wrongBitrate: "Track mit gewünschter Bitrate nicht gefunden.",
			wrongBitrateNoAlternative:
				"Track mit gewünschter Bitrate nicht gefunden und keine Alternative gefunden!",
			no360RA: "Track ist nicht in Reality Audio 360 verfügbar.",
			notAvailable: "Track ist nicht verfügbar auf den Servern von Deezer!",
			notAvailableNoAlternative:
				"Track ist nicht auf den Servern von Deezer verfügbar, keine Alternativen gefunden!",
			noSpaceLeft: "Kein Speicherplatz auf dem Gerät!",
			albumDoesntExists:
				"Das Album des Tracks ist nicht vorhanden, konnte keine Informationen sammeln.",
			wrongLicense:
				"Dein Account kann die Spur nicht an der gewünschten Bitrate streamen.",
			wrongGeolocation:
				"Dein Account kann den Track nicht aus Deinem aktuellen Land streamen.",
			wrongGeolocationNoAlternative:
				"Dein Account kann den Titel nicht aus Deinem aktuellen Land streamen und es ist keine Alternative verfügbar.",
		},
	},
	favorites: {
		title: "Favoriten",
		noPlaylists: "Keine Playlist gefunden",
		noAlbums: "Keine favorisierten Alben gefunden",
		noArtists: "Keine favorisierten Künstler gefunden",
		noTracks: "Keine favorisierten Tracks gefunden",
	},
	home: {
		needTologin:
			"Du musst dich in deinem Deezer-Account anmelden bevor du mit dem Download starten kannst.",
		openSettings: "Einstellungen öffnen",
		sections: {
			popularPlaylists: "Beliebte Playlists",
			popularAlbums: "Meistgestreamte Alben",
		},
	},
	linkAnalyzer: {
		info: "Diesen Abschnitt kannst du nutzen, um weitere Informationen über den gewünschten Link zu erhalten, den du herunterladen möchtest.",
		useful:
			"Dies ist z.B. nützlich, wenn du versuchst einige Titel herunterzuladen, welche in deinem Land nicht verfügbar sind, und du wissen möchtest, wo sie verfügbar sind.",
		linkNotSupported: "Dieser Link wird noch nicht unterstützt",
		linkNotSupportedYet:
			"Es scheint so, als ob dieser Link noch nicht unterstützt wird. Versuche einen anderen Link zu analysieren.",
		table: {
			id: "ID",
			isrc: "ISRC",
			upc: "UPC",
			duration: "Dauer",
			diskNumber: "CD Nummer",
			trackNumber: "Track Nummer",
			releaseDate: "Veröffentlichungsdatum",
			bpm: "BPM",
			label: "Label",
			recordType: "Art der Aufnahme",
			genres: "Genres",
			tracklist: "Trackliste",
			readable: "Lesbar",
			available: "Verfügbar",
		},
		countries: "Länder",
		noCountries: "Dieser Track ist in keinem Land verfügbar.",
	},
	search: {
		startSearching: "Suche starten!",
		description:
			"Du kannst einen Titel, ein ganzes Album, einen Künstler, eine Playlist suchen ... alles! Du kannst auch einen Deezer-Link einfügen",
		fans: "{n} Fans",
		noResults: "Keine Ergebnisse",
		noResultsTrack: "Keine Tracks gefunden",
		noResultsAlbum: "Keine Alben gefunden",
		noResultsArtist: "Keinen Künstler gefunden",
		noResultsPlaylist: "Keine Playlist gefunden",
		error: "Ein Fehler ist aufgetreten. Bitte versuche es später erneut.",
	},
	searchbar:
		"Suche nach allem, was dir gefällt (oder füge einfach einen Link ein)",
	downloads: "Downloads",
	toasts: {
		restoringQueue: "Download-Warteschlange wiederherstellen...",
		queueRestored: "Download-Warteschlange wiederhergestellt!",
		addedToQueue: "{item} zur Warteschlange hinzugefügt",
		addedMoreToQueue: "{n} Einträge zur Warteschlange hinzugefügt",
		alreadyInQueue: "{item} ist bereits in der Warteschlange!",
		finishDownload: "{item} vollständig heruntergeladen.",
		allDownloaded: "Alle Downloads abgeschlossen!",
		refreshFavs: "Abgeschlossene Downloads neuladen!",
		loggingIn: "Einloggen",
		loggedIn: "Eingeloggt",
		alreadyLogged: "Bereits eingeloggt",
		loginFailed: "Login fehlgeschlagen",
		loggedOut: "Ausgeloggt",
		cancellingCurrentItem: "Aktuelle Auswahl abbrechen.",
		currentItemCancelled: "Aktuelle Auswahl wurde abgebrochen",
		startAddingArtist: "Alben von {artist} werden hinzugefügt",
		finishAddingArtist: "Alben von {artist} wurden hinzugefügt",
		startConvertingSpotifyPlaylist:
			"Konvertierern von Spotify-Tracks zu Deezer-Tracks",
		finishConvertingSpotifyPlaylist: "Spotify Playlist convertiert",
		loginNeededToDownload:
			"Du musst eingeloggt sein, um Tracks herunterladen zu können!",
		queueErrorCantStream: `Dein Konto kann nicht mit {Bitrate} streamen!`,
		deezerNotAvailable:
			"Deezer ist in deinem Land nicht verfügbar. Du solltest eine VPN nutzen.",
		deezerNotReachable:
			"Die App kann Deezer nicht erreichen. Prüfe deine Internet-Verbindung, deine Firewall oder dein Antivirus.",
		startGeneratingItems: "Verarbeite {n} Einträge....",
		finishGeneratingItems: "{n} Einträge generiert.",
		noLovedPlaylist: "Keine Geliebten-Tracks-Wiedergabeliste!",
		checkingUpdates: "Auf Aktualisierungen prüfen...",
		updateAvailable: "Eine Aktualisierung ist verfügbar!",
	},
	settings: {
		title: "Einstellungen",
		languages: "Sprachen",
		login: {
			title: "Einloggen",
			loggedIn: "Du bist eingeloggt als {username}",
			arl: {
				title: "Stattdessen ARL verwenden",
				question: "Wie bekomme ich meine eigene ARL?",
				howTo: {
					prologue: {
						p1: "Deezer verfolgt die Anmeldesitzung mithilfe eines Cookies namens ARL.",
						p2: "Deemix verwendet dieses Cookie, um die Metadaten abzurufen, die es benötigt, um die Tracks von Deezer herunterzuladen.",
						p3: "ARLs sind 3 Monate gültig, danach fordert Deezer Dich auf, sich erneut anzumelden. Die gleiche Methode wird in deemix verwendet.",
						p4: "Wenn Du einer der folgenden Anleitungen folgst, kannst Du deine eigene Account-ARL erhalten.",
						warning:
							"Verwende diese Methode nur, wenn E-Mail und Passwort nicht funktionieren.",
					},
					chromeSteps: {
						title: "Chrome",
						step1: "Öffne Chrome",
						easyWay: {
							title: "Chrome (Einfacher Weg)",
							step3: 'Klicke auf das kleine "Schloss"-Symbol neben der URL',
							step4: "Klicke auf Cookies > deezer.com > cookies > arl",
							step5: "Wähle die Zeichenfolge neben Inhalt und Kopieren aus",
						},
						step4:
							"Gehe zum Application Tab (if you don't see it click the double arrow)",
						videoGuide: {
							text: "Hier ist eine {videoGuide}",
							link: "Video Guide",
						},
					},
					firefoxSteps: {
						title: "Firefox",
						step1: "Öffne Firefox",
						step4:
							"Gehe unter die Registerkarte Speicher (wenn Du sie nicht siehst, klicke auf den Doppelpfeil)",
					},
					commonSteps: {
						step2:
							"Gehe zu www.deezer.com und logge dich in deinen Account ein",
						step3:
							"Drücke nach der Anmeldung F12, um die Entwicklertools zu öffnen",
						step5: "Öffne den Cookie-Dropdown",
						step6: "Wähle www.deezer.com",
						step7: "Finde das `arl` Cookie (It should be 192 chars long)",
						step8:
							"Stelle sicher, dass Du nur den Wert kopierst und nicht das gesamte Cookie",
						lastStep:
							"Das ist Deine ARL, jetzt kannst Du sie in der App verwenden",
					},
				},
				update: "ARL aktualisieren",
			},
			logout: "Ausloggen",
			login: "Über deezer.com einloggen",
			email: "E-Mail",
			password: "Passwort",
		},
		appearance: {
			title: "Design",
			slimDownloadTab: "Schmaler Download-Tab",
			slimSidebar: "Schlanke Seitenleiste",
			searchButton: "Suchschaltfläche anzeigen",
			bitrateTags: "Qualitäts-Tag in Download-Warteschlange anzeigen",
		},
		downloadPath: {
			title: "Download Pfad",
		},
		templates: {
			title: "Vorlagen",
			tracknameTemplate: "Vorlage für den Tracknamen",
			tracknameAvailableVariables: "Verfügbare Trackname Variablen",
			albumTracknameTemplate: "Album-Track-Vorlage.",
			albumTracknameAvailableVariables: "Verfügbare Album-Track-Variablen",
			playlistTracknameTemplate: "Vorlage für Tracks in einer Playlist",
			playlistTracknameAvailableVariables: "Verfügbare Playlist Trackvariablen",
		},
		folders: {
			title: "Ordner",
			createPlaylistFolder: "Ordner für Playlist erstellen",
			playlistNameTemplate: "Vorlage für Playlist-Ordner",
			createArtistFolder: "Ordner für Künstler erstellen",
			artistNameTemplate: "Vorlage für Künstler-Ordner",
			createAlbumFolder: "Ordner für Album erstellen",
			albumNameTemplate: "Vorlage für Album-Ordner",
			createCDFolder: "Ordner für CDs erstellen",
			createStructurePlaylist:
				"Erstellen von Künstler-, Alben- und CD-Ordnern auch für Playlists",
			createSingleFolder: "Ordner für einzelne Titel erstellen",
		},
		trackTitles: {
			title: "Songtitel",
			padTracks:
				"Einheitliche Länge der Titelnummern (voranstehende Nullen werden ergänzt)",
			paddingSize: "Innenabstand überschreiben",
			illegalCharacterReplacer: "Unzulässige Zeichen ersetzen",
		},
		downloads: {
			title: "Downloads",
			queueConcurrency: "Gleichzeitige Downloads",
			maxBitrate: {
				title: "Bevorzugte Bitrate",
				9: "FLAC 1411kbps",
				3: "MP3 320kbps",
				1: "MP3 128kbps",
			},
			overwriteFile: {
				title: "Soll ich die Dateien überchreiben?",
				y: "Ja überschreibe die Dateien",
				n: "Nein überschreibe die Dateien nicht",
				t: "Überschreibe nur die Tags",
				b: "Nein, behalte beide Dateien und füge der Kopie eine Nummer hinzu",
				e: "Nein, und schau nicht auf die Erweiterungen",
			},
			fallbackBitrate:
				"Falls gewünschte Bitrate nicht verfügbar, auf niedrigere Bitrate zurückgreifen",
			fallbackSearch:
				"Zur Suche zurückkehren, wenn der Song nicht verfügbar ist",
			fallbackISRC: "Fallback mit ISRC-Suche",
			feelingLucky: "Spielen mit CDNs und Caches",
			logErrors: "Protokolldatei für Fehler im Download-Ordner erstellen",
			logSearched: "Protokolldatei für gesuchte Titel erstellen",
			createM3U8File: "Erstelle Playlist-Datei (M3U8)",
			syncedLyrics: "Erstelle synchrone Lyrics-Datei (.lrc)",
			playlistFilenameTemplate: "Vorlage für den Namen der Playlist",
			clearQueueOnExit: "Download-Warteschlange beim Schließen der App leeren",
		},
		covers: {
			title: "Album Cover",
			saveArtwork: "Cover speichern",
			coverImageTemplate: "Vorlage für den Covernamen",
			saveArtworkArtist: "Speichere das Künstlerbild",
			artistImageTemplate: "Vorlage des Künstlerbildes",
			localArtworkSize: "Lokale Grafikgröße",
			embeddedArtworkSize: "Eingebettete Grafikgröße",
			localArtworkFormat: {
				title: "Welches Datei-Format soll das Cover haben?",
				jpg: "Ein jpg Bild",
				png: "Ein png Bild",
				both: "Beides (jpg + png)",
			},
			jpegImageQuality: "JPEG Qualität",
			embeddedArtworkPNG: "Eingebettete Grafiken als PNG speichern",
			embeddedPNGWarning:
				"PNGs werden von Deezer nicht offiziell unterstützt und können fehlerhaft sein",
			imageSizeWarning:
				"Alles über x1200 wird nicht offiziell von Deezer verwendet, es können Probleme auftreten",
			coverDescriptionUTF8:
				"Cover-Beschreibung mit UTF8 speichern (iTunes Cover Fix)",
		},
		tags: {
			head: "Welche Tags sollen gespeichert werden?",
			title: "Titel",
			artist: "Künstler",
			artists: "Zusätzlicher ARTISTS Tag",
			album: "Album",
			cover: "Cover",
			trackNumber: "Titelnummer",
			trackTotal: "Titelanzahl",
			discNumber: "CD Nummer",
			discTotal: "CDs insgesamt",
			albumArtist: "Album Künstler",
			genre: "Genre",
			year: "Jahr",
			date: "Datum",
			explicit: "Explizite Lyrics",
			isrc: "ISRC",
			length: "Titel Länge",
			barcode: "Album Barcode (UPC)",
			bpm: "BPM",
			replayGain: "Wiedergabe Lautstärke",
			label: "Album Plattenlabel",
			lyrics: "Nicht synchronisierte Texte",
			syncedLyrics: "Synchronisierte Texte",
			copyright: "Copyright",
			composer: "Komponist",
			involvedPeople: "Mitwirkende Personen",
			source: "Quelle und Song ID",
			artistsWarning:
				"Das Deaktivieren des ARTISTS- Tags, während die Standardspezifikation nicht verwendet wird, wird die Multiartist- Unterstützung nicht erhalten",
		},
		other: {
			title: "Sonstige",
			autoCheckForUpdates: "Beim Start nach Updates suchen",
			savePlaylistAsCompilation: "Speichere Playlist als Zusammenstellung",
			useNullSeparator: "Verwende Nulltrennzeichen",
			saveID3v1: "Speichere ID3v1 ebenfalls",
			multiArtistSeparator: {
				title: "Wie möchtest du die Künstler trennen?",
				nothing: "Speichere nur den Hauptkünstler",
				default: "Verwende Standard Spezifikationen",
				andFeat: "Verwende & und feat.",
				using: 'Verwende "{separator}"',
				warning:
					"Wenn Du ein anderes Trennzeichen als die Standardspezifikation verwendest, wird ein zusätzliches ARTISTS-Tag hinzugefügt, um die Unterstützung mehrerer Künstler zu erhalten",
			},
			singleAlbumArtist: "Nur den Hauptkünstler speichern",
			albumVariousArtists:
				'Verschiedene Künstler" im Album Künstler Tag behalten',
			removeAlbumVersion: 'Entferne die "Album Version" vom Songtitel',
			removeDuplicateArtists: "Kombinationen von Künstlern entfernen",
			dateFormat: {
				title: "Datumsformatierung für FLAC Dateien",
				year: "JJJJ",
				month: "MM",
				day: "TT",
			},
			featuredToTitle: {
				title: "Was soll ich mit featured Artists tun?",
				0: "Nichts",
				1: "Vom Titel entfernen",
				3: "Vom Titel und Albumtitel entfernen",
				2: "Zu dem Titel hinzufügen",
			},
			titleCasing: "Titel-Schreibweise",
			artistCasing: "Künstler-Schreibweise",
			casing: {
				nothing: "Unbearbeitet lassen",
				lower: "klein",
				upper: "GROSS",
				start: "Wortanfang Gross",
				sentence: "Satzanfang gross",
			},
			previewVolume: "Vorschau der Lautstärke",
			executeCommand: {
				title: "Befehl, der nach dem Download ausgeführt werden soll",
				description: "Leer lassen ohne Aktion",
			},
		},
		spotify: {
			title: "Spotify Funktionen",
			clientID: "Spotify Client ID",
			clientSecret: "Spotify Client Secret",
			username: "Spotify Benutzername",
			question: "Wie aktiviere ich die Spotify Funktionen?",
			howTo: {
				prologue: {
					p1: '"Spotify Funktionen" ist eine Reihe von Funktionen, mit denen Du Spotify-Tracks und Alben-Links in Deezer-Links konvertieren kannst.',
					p2: "Wenn Du einen Spotify-Playlist-Link bereitstellst, konvertiert die App automatisch alle Links der darin enthaltenen Titel in Deezer-Titel.",
					p3: 'Wenn Du diese Funktionen aktivierst, kannst Du Deine öffentlichen Spotify-Wiedergabelisten auch auf der Registerkarte "Favoriten" sehen.',
				},
				info: "Aus Sicherheitsgründen musst Du Deine eigene Client-ID und Dein Client-Secret angeben",
				clientSecretQuestion: {
					title: "Wie erhalte ich meine Client-ID und mein Client-Secret?",
					step1: {
						text: "Verbinde dich mit {spotifyDevelopersDashboard} und melde dich mit Deinem Spotify-Account an.",
						spotifyDevelopersDashboard: "Spotify Entwickler-Dashboard",
					},
					step2: {
						text: 'Klicke auf "App erstellen"..',
						imageAlt:
							"Erstelle eine App-Schaltfläche auf Spotify für das Entwickler-Dashboard",
					},
					step3: {
						text: 'Fülle die Felder „App-Name“ und „App-Beschreibung“ aus und aktiviere beide Kontrollkästchen. Klicke dann auf die Schaltfläche "Erstellen".',
						imageAlt: "Erstelle ein App-Formular",
					},
					step4: {
						text: 'Jetzt kannst Du die Client-ID sehen. Wenn Du auf "„"Kundengeheimnis anzeigen"“" klickst, wird das Kundengeheimnis angezeigt.',
						imageAlt: "Screen mit Client-ID und Geheimnis",
					},
					step5:
						"Jetzt kannst Du diese Ergebnisse kopieren und in die entsprechenden Felder in den Einstellungen einfügen.",
				},
				usernameQuestion: {
					title: "Wie erhalte ich meinen Spotify-Benutzernamen?",
					step1: {
						text: "Du kannst Deinen Spotify-Benutzernamen auf der {overviewPage} auf der Spotify-Website abrufen.",
						overviewPage: "Übersichtsseite",
					},
				},
			},
		},
		reset: "Auf Standardwerte zurücksetzen",
		resetMessage:
			"Bist du sicher, dass du zu den Standarteinstellungen zurückkehren willst?",
		save: "Speichern",
		toasts: {
			init: "Einstellungen geladen!",
			update: "Einstellungen aktualisiert!",
			reset: "Einstellungen auf den Standart zurückgesetzt!",
			ARLcopied: "ARL wurde in die Zwischenablage kopiert",
		},
	},
	sidebar: {
		home: "Startseite",
		search: "Suche",
		charts: "Charts",
		favorites: "Favoriten",
		linkAnalyzer: "Link Analyse",
		settings: "Einstellungen",
		logs: "Protokolle",
		about: "Info",
	},
	tracklist: {
		downloadSelection: "Herunterladen",
	},
};

export default de;
