import { RequestHandler } from 'express'

/* === Utilities === */
// https://github.com/Microsoft/TypeScript/issues/25760#issuecomment-614417742
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>

export type Port = number | string | boolean

export interface ApiHandler {
	path: string
	handler: RequestHandler<any, any, any, any>
}

export interface Tags {
	title: boolean
	artist: boolean
	album: boolean
	cover: boolean
	trackNumber: boolean
	trackTotal: boolean
	discNumber: boolean
	discTotal: boolean
	albumArtist: boolean
	genre: boolean
	year: boolean
	date: boolean
	explicit: boolean
	isrc: boolean
	length: boolean
	barcode: boolean
	bpm: boolean
	replayGain: boolean
	label: boolean
	lyrics: boolean
	syncedLyrics: boolean
	copyright: boolean
	composer: boolean
	involvedPeople: boolean
	source: boolean
	savePlaylistAsCompilation: boolean
	useNullSeparator: boolean
	saveID3v1: boolean
	multiArtistSeparator: string
	singleAlbumArtist: boolean
	coverDescriptionUTF8: boolean
}

export interface Settings {
	downloadLocation: string
	tracknameTemplate: string
	albumTracknameTemplate: string
	playlistTracknameTemplate: string
	createPlaylistFolder: boolean
	playlistNameTemplate: string
	createArtistFolder: boolean
	artistNameTemplate: string
	createAlbumFolder: boolean
	albumNameTemplate: string
	createCDFolder: boolean
	createStructurePlaylist: boolean
	createSingleFolder: boolean
	padTracks: boolean
	paddingSize: string
	illegalCharacterReplacer: string
	queueConcurrency: number
	maxBitrate: string
	fallbackBitrate: boolean
	fallbackSearch: boolean
	logErrors: boolean
	logSearched: boolean
	saveDownloadQueue: boolean
	overwriteFile: string
	createM3U8File: boolean
	playlistFilenameTemplate: string
	syncedLyrics: boolean
	embeddedArtworkSize: number
	embeddedArtworkPNG: boolean
	localArtworkSize: number
	localArtworkFormat: string
	saveArtwork: boolean
	coverImageTemplate: string
	saveArtworkArtist: boolean
	artistImageTemplate: string
	jpegImageQuality: number
	dateFormat: string
	albumVariousArtists: boolean
	removeAlbumVersion: boolean
	removeDuplicateArtists: boolean
	tagsLanguage: string
	featuredToTitle: string
	titleCasing: string
	artistCasing: string
	executeCommand: string
	tags: Tags
}

// TODO
export interface SpotifySettings {}

interface BaseDeezerObject {
	id: number
	type: string
}

interface NamedDeezerObject extends BaseDeezerObject {
	name: string
}

interface PicturedDeezerObject extends BaseDeezerObject {
	picture: string
	picture_small: string
	picture_medium: string
	picture_big: string
	picture_xl: string
}

interface CoveredDeezerObject extends BaseDeezerObject {
	cover: string
	cover_small: string
	cover_medium: string
	cover_big: string
	cover_xl: string
}

interface DeezerWrapper<Type> {
	data: Type[]
}

export interface DeezerContributor extends NamedDeezerObject, PicturedDeezerObject {
	link: string
	share: string
	radio: boolean
	tracklist: string
	role: string
}

export interface DeezerTrackArtist extends NamedDeezerObject, PicturedDeezerObject {
	link: string
	share: string
	radio: boolean
	tracklist: string
}

export interface DeezerAlbumArtist extends NamedDeezerObject, PicturedDeezerObject {
	tracklist: string
}

export interface DeezerAlbum extends BaseDeezerObject, CoveredDeezerObject {
	title: string
	link: string
	md5_image: string
	release_date: string
	tracklist: string
}

export interface DeezerGenre extends NamedDeezerObject {
	picture: string
}

type DeezerGenres = DeezerWrapper<DeezerGenre>

export interface GetAlbumTrackArtist extends NamedDeezerObject {
	tracklist: string
}

export interface DeezerTrack extends BaseDeezerObject {
	readable: boolean
	title: string
	title_short: string
	title_version: string
	link: string
	duration: number
	rank: number
	explicit_lyrics: boolean
	explicit_content_lyrics: number
	explicit_content_cover: number
	preview: string
	md5_image: string
	artist: GetAlbumTrackArtist
}

type DeezerTracks = DeezerWrapper<DeezerTrack>

export interface GetTrackResponse extends BaseDeezerObject {
	readable: boolean
	title: string
	title_short: string
	title_version: string
	isrc: string
	link: string
	share: string
	duration: number
	track_position: number
	disk_number: number
	rank: number
	release_date: string
	explicit_lyrics: boolean
	explicit_content_lyrics: number
	explicit_content_cover: number
	preview: string
	bpm: number
	gain: number
	available_countries: string[]
	contributors: DeezerContributor[]
	md5_image: string
	artist: DeezerTrackArtist
	album: DeezerAlbum
}

export interface GetAlbumResponse extends BaseDeezerObject, CoveredDeezerObject {
	title: string
	upc: string
	link: string
	share: string
	md5_image: string
	genre_id: number
	genres: DeezerGenres
	label: string
	nb_tracks: number
	duration: number
	fans: number
	rating: number
	release_date: string
	record_type: string
	available: boolean
	tracklist: string
	explicit_lyrics: boolean
	explicit_content_lyrics: number
	explicit_content_cover: number
	contributors: DeezerContributor[]
	artist: DeezerAlbumArtist
	tracks: DeezerTracks
}

export interface Arguments {
	port: string
	host: string
	locationbase: string
	singleuser: boolean

	[x: string]: unknown
	$0: string
}

export interface Listener {
	send: (key: string, data?: any) => void
}

export interface LoginFile {
	arl: string | null
	accessToken: string | null
}
