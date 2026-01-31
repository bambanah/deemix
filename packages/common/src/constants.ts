export const TRACK_NAME_TEMPLATE_VARIABLES = [
	"album",
	"artist",
	"title",
	"explicit",
	"isrc",
	"bpm",
	"position",
	"artists",
	"tagsartists",
	"allartists",
	"mainartists",
	"featartists",
	"albumartist",
	"tracknumber",
	"tracktotal",
	"discnumber",
	"disctotal",
	"genre",
	"year",
	"date",
	"label",
	"upc",
	"track_id",
	"album_id",
	"artist_id",
	"playlist_id",
] as const;

export const ALBUM_FOLDER_TEMPLATE_VARIABLES = [
	"album_id",
	"genre",
	"album",
	"artist",
	"artist_id",
	"root_artist",
	"root_artist_id",
	"tracktotal",
	"disctotal",
	"type",
	"upc",
	"explicit",
	"label",
	"year",
	"date",
	"bitrate",
] as const;

export const ARTIST_FOLDER_TEMPLATE_VARIABLES = [
	"artist",
	"artist_id",
	"root_artist",
	"root_artist_id",
] as const;

export const PLAYLIST_FOLDER_TEMPLATE_VARIABLES = [
	"playlist",
	"playlist_id",
	"owner",
	"owner_id",
	"year",
	"date",
	"explicit",
] as const;

export const PLAYLIST_FILENAME_TEMPLATE_VARIABLES = [
	"title",
	"artist",
	"size",
	"type",
	"id",
	"bitrate",
] as const;
