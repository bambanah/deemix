// Explicit Content Lyrics
const LyricsStatus = {
  NOT_EXPLICIT: 0, // Not Explicit
  EXPLICIT: 1, // Explicit
  UNKNOWN: 2, // Unknown
  EDITED: 3, // Edited
  PARTIALLY_EXPLICIT: 4, // Partially Explicit (Album "lyrics" only)
  PARTIALLY_UNKNOWN: 5, // Partially Unknown (Album "lyrics" only)
  NO_ADVICE: 6, // No Advice Available
  PARTIALLY_NO_ADVICE: 7, // Partially No Advice Available (Album "lyrics" only)
};

const ReleaseType = ["single", "album", "compile", "ep", "bundle"];

// TODO: add missing role ids
const RoleID = ["Main", null, null, null, null, "Featured"];

// get explicit lyrics boolean from explicit_content_lyrics
function is_explicit(explicit_content_lyrics) {
  return [LyricsStatus.EXPLICIT, LyricsStatus.PARTIALLY_EXPLICIT].includes(
    parseInt(explicit_content_lyrics) || LyricsStatus.UNKNOWN,
  );
}

// maps gw-light api user/tracks to standard api
function map_user_track(track) {
  const result = {
    id: track.SNG_ID,
    title: track.SNG_TITLE,
    link: "https://www.deezer.com/track/" + track.SNG_ID,
    duration: track.DURATION,
    rank: track.RANK_SNG,
    explicit_lyrics: false,
    explicit_content_lyrics: false,
    explicit_content_cover: false,
    time_add: track.DATE_ADD || track.DATE_FAVORITE,
    album: {
      id: track.ALB_ID,
      title: track.ALB_TITLE,
      cover: "https://api.deezer.com/album/" + track.ALB_ID + "/image",
      cover_small:
        "https://e-cdns-images.dzcdn.net/images/cover/" +
        track.ALB_PICTURE +
        "/56x56-000000-80-0-0.jpg",
      cover_medium:
        "https://e-cdns-images.dzcdn.net/images/cover/" +
        track.ALB_PICTURE +
        "/250x250-000000-80-0-0.jpg",
      cover_big:
        "https://e-cdns-images.dzcdn.net/images/cover/" +
        track.ALB_PICTURE +
        "/500x500-000000-80-0-0.jpg",
      cover_xl:
        "https://e-cdns-images.dzcdn.net/images/cover/" +
        track.ALB_PICTURE +
        "/1000x1000-000000-80-0-0.jpg",
      tracklist: "https://api.deezer.com/album/" + track.ALB_ID + "/tracks",
      type: "album",
    },
    artist: {
      id: track.ART_ID,
      name: track.ART_NAME,
      picture: "https://api.deezer.com/artist/" + track.ART_ID + "/image",
      picture_small: null,
      picture_medium: null,
      picture_big: null,
      picture_xl: null,
      tracklist:
        "https://api.deezer.com/artist/" + track.ART_ID + "/top?limit=50",
      type: "artist",
    },
    type: "track",
  };
  if (parseInt(track.SNG_ID) >= 0) {
    let art_picture = track.ART_PICTURE;
    if (!art_picture) {
      for (const artist of track.ARTISTS) {
        if (artist.ART_ID === track.ART_ID) {
          art_picture = artist.ART_PICTURE;
          break;
        }
      }
    }
    result.explicit_lyrics = is_explicit(track.EXPLICIT_LYRICS);
    result.explicit_content_lyrics =
      track.EXPLICIT_TRACK_CONTENT.EXPLICIT_COVER_STATUS;
    result.explicit_content_cover =
      track.EXPLICIT_TRACK_CONTENT.EXPLICIT_LYRICS_STATUS;

    result.artist.picture_small =
      "https://e-cdns-images.dzcdn.net/images/artist/" +
      art_picture +
      "/56x56-000000-80-0-0.jpg";
    result.artist.picture_medium =
      "https://e-cdns-images.dzcdn.net/images/artist/" +
      art_picture +
      "/250x250-000000-80-0-0.jpg";
    result.artist.picture_big =
      "https://e-cdns-images.dzcdn.net/images/artist/" +
      art_picture +
      "/500x500-000000-80-0-0.jpg";
    result.artist.picture_xl =
      "https://e-cdns-images.dzcdn.net/images/artist/" +
      art_picture +
      "/1000x1000-000000-80-0-0.jpg";
  }
  return result;
}

// maps gw-light api user/artists to standard api
function map_user_artist(artist) {
  return {
    id: artist.ART_ID,
    name: artist.ART_NAME,
    link: "https://www.deezer.com/artist/" + artist.ART_ID,
    picture: "https://api.deezer.com/artist/" + artist.ART_ID + "/image",
    picture_small:
      "https://e-cdns-images.dzcdn.net/images/artist/" +
      artist.ART_PICTURE +
      "/56x56-000000-80-0-0.jpg",
    picture_medium:
      "https://e-cdns-images.dzcdn.net/images/artist/" +
      artist.ART_PICTURE +
      "/250x250-000000-80-0-0.jpg",
    picture_big:
      "https://e-cdns-images.dzcdn.net/images/artist/" +
      artist.ART_PICTURE +
      "/500x500-000000-80-0-0.jpg",
    picture_xl:
      "https://e-cdns-images.dzcdn.net/images/artist/" +
      artist.ART_PICTURE +
      "/1000x1000-000000-80-0-0.jpg",
    nb_fan: artist.NB_FAN,
    tracklist:
      "https://api.deezer.com/artist/" + artist.ART_ID + "/top?limit=50",
    type: "artist",
  };
}

// maps gw-light api user/albums to standard api
function map_user_album(album) {
  return {
    id: album.ALB_ID,
    title: album.ALB_TITLE,
    link: "https://www.deezer.com/album/" + album.ALB_ID,
    cover: "https://api.deezer.com/album/" + album.ALB_ID + "/image",
    cover_small:
      "https://e-cdns-images.dzcdn.net/images/cover/" +
      album.ALB_PICTURE +
      "/56x56-000000-80-0-0.jpg",
    cover_medium:
      "https://e-cdns-images.dzcdn.net/images/cover/" +
      album.ALB_PICTURE +
      "/250x250-000000-80-0-0.jpg",
    cover_big:
      "https://e-cdns-images.dzcdn.net/images/cover/" +
      album.ALB_PICTURE +
      "/500x500-000000-80-0-0.jpg",
    cover_xl:
      "https://e-cdns-images.dzcdn.net/images/cover/" +
      album.ALB_PICTURE +
      "/1000x1000-000000-80-0-0.jpg",
    tracklist: "https://api.deezer.com/album/" + album.ALB_ID + "/tracks",
    explicit_lyrics: is_explicit(
      album.EXPLICIT_ALBUM_CONTENT.EXPLICIT_LYRICS_STATUS,
    ),
    artist: {
      id: album.ART_ID,
      name: album.ART_NAME,
      picture: "https://api.deezer.com/artist/" + album.ART_ID + "image",
      tracklist:
        "https://api.deezer.com/artist/" + album.ART_ID + "/top?limit=50",
    },
    type: "album",
  };
}

// maps gw-light api user/playlists to standard api
function map_user_playlist(playlist, default_user_name = "") {
  return {
    id: playlist.PLAYLIST_ID,
    title: playlist.TITLE,
    description: playlist.DESCRIPTION || "",
    nb_tracks: playlist.NB_SONG,
    link: "https://www.deezer.com/playlist/" + playlist.PLAYLIST_ID,
    picture:
      "https://api.deezer.com/playlist/" + playlist.PLAYLIST_ID + "/image",
    picture_small:
      "https://e-cdns-images.dzcdn.net/images/" +
      playlist.PICTURE_TYPE +
      "/" +
      playlist.PLAYLIST_PICTURE +
      "/56x56-000000-80-0-0.jpg",
    picture_medium:
      "https://e-cdns-images.dzcdn.net/images/" +
      playlist.PICTURE_TYPE +
      "/" +
      playlist.PLAYLIST_PICTURE +
      "/250x250-000000-80-0-0.jpg",
    picture_big:
      "https://e-cdns-images.dzcdn.net/images/" +
      playlist.PICTURE_TYPE +
      "/" +
      playlist.PLAYLIST_PICTURE +
      "/500x500-000000-80-0-0.jpg",
    picture_xl:
      "https://e-cdns-images.dzcdn.net/images/" +
      playlist.PICTURE_TYPE +
      "/" +
      playlist.PLAYLIST_PICTURE +
      "/1000x1000-000000-80-0-0.jpg",
    tracklist:
      "https://api.deezer.com/playlist/" + playlist.PLAYLIST_ID + "/tracks",
    creation_date: playlist.DATE_ADD,
    creator: {
      id: playlist.PARENT_USER_ID,
      name: playlist.PARENT_USERNAME || default_user_name,
    },
    type: "playlist",
  };
}

// maps gw-light api albums to standard api
function map_album(album) {
  const result = {
    id: album.ALB_ID,
    title: album.ALB_TITLE,
    title_short: album.ALB_TITLE,
    link: `https://www.deezer.com/album/${album.ALB_ID}`,
    share: `https://www.deezer.com/album/${album.ALB_ID}`,
    cover: `https://api.deezer.com/album/${album.ALB_ID}/image`,
    cover_small: `https://cdns-images.dzcdn.net/images/cover/${album.ALB_PICTURE}/56x56-000000-80-0-0.jpg`,
    cover_medium: `https://cdns-images.dzcdn.net/images/cover/${album.ALB_PICTURE}/250x250-000000-80-0-0.jpg`,
    cover_big: `https://cdns-images.dzcdn.net/images/cover/${album.ALB_PICTURE}/500x500-000000-80-0-0.jpg`,
    cover_xl: `https://cdns-images.dzcdn.net/images/cover/${album.ALB_PICTURE}/1000x1000-000000-80-0-0.jpg`,
    md5_image: album.ALB_PICTURE,
    genres: {}, // not provided
    label: album.LABEL_NAME,
    duration: null, // not provided
    fans: album.NB_FAN,
    release_date: album.PHYSICAL_RELEASE_DATE,
    record_type: null, // not provided
    alternative: null, // not provided
    contributors: [],
    tracklist: `https://api.deezer.com/album/${album.ALB_ID}/tracks`,
    explicit_lyrics: is_explicit(
      album.EXPLICIT_ALBUM_CONTENT.EXPLICIT_LYRICS_STATUS,
    ),
    explicit_content_lyrics:
      album.EXPLICIT_ALBUM_CONTENT.EXPLICIT_LYRICS_STATUS,
    explicit_content_cover: album.EXPLICIT_ALBUM_CONTENT.EXPLICIT_COVER_STATUS,
    artist: {
      id: album.ART_ID,
      name: album.ART_NAME,
      link: `https://www.deezer.com/artist/${album.ART_ID}`,
      type: "artist",
      // Extras
      rank: album.RANK_ART,
    },
    type: album.__TYPE__,
    tracks: [], // not provided
    // Extras
    rating: album.RANK,
    digital_release_date: album.DIGITAL_RELEASE_DATE,
    physical_release_date: album.PHYSICAL_RELEASE_DATE,
    original_release_date: album.ORIGINAL_RELEASE_DATE,
  };
  result.title_version = (album.VERSION || "").trim();
  if (
    result.title_version &&
    result.title_short.includes(result.title_version)
  ) {
    result.title_short = result.title_short
      .replace(result.title_version, "")
      .trim();
  }
  result.title = `${result.title_short} ${result.title_version}`.trim();
  if (album.UPC) result.upc = album.UPC; // page only
  if (album.GENRE_ID) result.genre_id = album.GENRE_ID; // gw only
  if (album.NUMBER_TRACK) result.nb_tracks = album.NUMBER_TRACK; // gw only
  if (album.AVAILABLE) result.available = album.AVAILABLE; // page only
  if (album.ALB_CONTRIBUTORS)
    result.album_contributors = album.ALB_CONTRIBUTORS; // page only
  if (album.NUMBER_DISK) result.nb_disk = album.NUMBER_DISK; // gw only
  if (album.COPYRIGHT) result.copyright = album.COPYRIGHT; // gw only
  if (album.ARTISTS) {
    album.ARTISTS.forEach((contributor) => {
      if (contributor.ART_ID === result.artist.id) {
        result.artist = {
          ...result.artist,
          picture_small: `https://e-cdns-images.dzcdn.net/images/artist/${contributor.ART_PICTURE}/56x56-000000-80-0-0.jpg`,
          picture_medium: `https://e-cdns-images.dzcdn.net/images/artist/${contributor.ART_PICTURE}/250x250-000000-80-0-0.jpg`,
          picture_big: `https://e-cdns-images.dzcdn.net/images/artist/${contributor.ART_PICTURE}/500x500-000000-80-0-0.jpg`,
          picture_xl: `https://e-cdns-images.dzcdn.net/images/artist/${contributor.ART_PICTURE}/1000x1000-000000-80-0-0.jpg`,
          md5_image: contributor.ART_PICTURE,
        };
      }
      result.contributors.push({
        id: contributor.ART_ID,
        name: contributor.ART_NAME,
        link: `https://www.deezer.com/artist/${contributor.ART_ID}`,
        share: `https://www.deezer.com/artist/${contributor.ART_ID}`,
        picture: `https://www.deezer.com/artist/${contributor.ART_ID}/image`,
        picture_small: `https://e-cdns-images.dzcdn.net/images/artist/${contributor.ART_PICTURE}/56x56-000000-80-0-0.jpg`,
        picture_medium: `https://e-cdns-images.dzcdn.net/images/artist/${contributor.ART_PICTURE}/250x250-000000-80-0-0.jpg`,
        picture_big: `https://e-cdns-images.dzcdn.net/images/artist/${contributor.ART_PICTURE}/500x500-000000-80-0-0.jpg`,
        picture_xl: `https://e-cdns-images.dzcdn.net/images/artist/${contributor.ART_PICTURE}/1000x1000-000000-80-0-0.jpg`,
        md5_image: contributor.ART_PICTURE,
        tracklist: `https://api.deezer.com/artist/${contributor.ART_ID}/top?limit=50`,
        type: "artist",
        role: RoleID[contributor.ROLE_ID],
        // Extras
        order: contributor.ARTISTS_SONGS_ORDER,
        rank: contributor.RANK,
      });
    });
  }

  return result;
}

// maps gw-light api artist/albums to standard api
function map_artist_album(album) {
  return {
    id: album.ALB_ID,
    title: album.ALB_TITLE,
    link: `https://www.deezer.com/album/${album.ALB_ID}`,
    cover: `https://api.deezer.com/album/${album.ALB_ID}/image`,
    cover_small: `https://cdns-images.dzcdn.net/images/cover/${album.ALB_PICTURE}/56x56-000000-80-0-0.jpg`,
    cover_medium: `https://cdns-images.dzcdn.net/images/cover/${album.ALB_PICTURE}/250x250-000000-80-0-0.jpg`,
    cover_big: `https://cdns-images.dzcdn.net/images/cover/${album.ALB_PICTURE}/500x500-000000-80-0-0.jpg`,
    cover_xl: `https://cdns-images.dzcdn.net/images/cover/${album.ALB_PICTURE}/1000x1000-000000-80-0-0.jpg`,
    md5_image: album.ALB_PICTURE,
    genre_id: album.GENRE_ID,
    fans: null, // not provided
    release_date: album.PHYSICAL_RELEASE_DATE,
    record_type: ReleaseType[parseInt(album.TYPE)] || "unknown",
    tracklist: `https://api.deezer.com/album/${album.ALB_ID}/tracks`,
    explicit_lyrics: is_explicit(album.EXPLICIT_LYRICS),
    type: album.__TYPE__,
    // Extras
    nb_tracks: album.NUMBER_TRACK,
    nb_disk: album.NUMBER_DISK,
    copyright: album.COPYRIGHT,
    rank: album.RANK,
    digital_release_date: album.DIGITAL_RELEASE_DATE,
    original_release_date: album.ORIGINAL_RELEASE_DATE,
    physical_release_date: album.PHYSICAL_RELEASE_DATE,
    is_official: album.ARTISTS_ALBUMS_IS_OFFICIAL,
    explicit_content_cover: album.EXPLICIT_ALBUM_CONTENT.EXPLICIT_LYRICS_STATUS,
    explicit_content_lyrics: album.EXPLICIT_ALBUM_CONTENT.EXPLICIT_COVER_STATUS,
    artist_role: RoleID[album.ROLE_ID],
  };
}

// maps gw-light api playlists to standard api
function map_playlist(playlist) {
  return {
    id: playlist.PLAYLIST_ID,
    title: playlist.TITLE,
    description: playlist.DESCRIPTION,
    duration: playlist.DURATION,
    public: playlist.STATUS === 1,
    is_loved_track: playlist.TYPE === 4,
    collaborative: playlist.STATUS === 2,
    nb_tracks: playlist.NB_SONG,
    fans: playlist.NB_FAN,
    link: "https://www.deezer.com/playlist/" + playlist.PLAYLIST_ID,
    share: "https://www.deezer.com/playlist/" + playlist.PLAYLIST_ID,
    picture:
      "https://api.deezer.com/playlist/" + playlist.PLAYLIST_ID + "/image",
    picture_small:
      "https://cdns-images.dzcdn.net/images/" +
      playlist.PICTURE_TYPE +
      "/" +
      playlist.PLAYLIST_PICTURE +
      "/56x56-000000-80-0-0.jpg",
    picture_medium:
      "https://cdns-images.dzcdn.net/images/" +
      playlist.PICTURE_TYPE +
      "/" +
      playlist.PLAYLIST_PICTURE +
      "/250x250-000000-80-0-0.jpg",
    picture_big:
      "https://cdns-images.dzcdn.net/images/" +
      playlist.PICTURE_TYPE +
      "/" +
      playlist.PLAYLIST_PICTURE +
      "/500x500-000000-80-0-0.jpg",
    picture_xl:
      "https://cdns-images.dzcdn.net/images/" +
      playlist.PICTURE_TYPE +
      "/" +
      playlist.PLAYLIST_PICTURE +
      "/1000x1000-000000-80-0-0.jpg",
    checksum: playlist.CHECKSUM,
    tracklist:
      "https://api.deezer.com/playlist/" + playlist.PLAYLIST_ID + "/tracks",
    creation_date: playlist.DATE_ADD,
    md5_image: playlist.PLAYLIST_PICTURE,
    picture_type: playlist.PICTURE_TYPE,
    creator: {
      id: playlist.PARENT_USER_ID,
      name: playlist.PARENT_USERNAME,
      tracklist:
        "https://api.deezer.com/user/" + playlist.PARENT_USER_ID + "/flow",
      type: "user",
    },
    type: "playlist",
  };
}

// maps gw-light api tracks to standard api
function map_track(track) {
  let result = {
    id: track.SNG_ID,
    readable: true, // not provided
    title: track.SNG_TITLE,
    title_short: track.SNG_TITLE,
    isrc: track.ISRC,
    link: `https://www.deezer.com/track/${track.SNG_ID}`,
    share: `https://www.deezer.com/track/${track.SNG_ID}`,
    duration: track.DURATION,
    bpm: null, // not provided
    available_countries: [], // not provided
    contributors: [],
    md5_image: track.ALB_PICTURE,
    artist: {
      id: track.ART_ID,
      name: track.ART_NAME,
      link: `https://www.deezer.com/artist/${track.ART_ID}`,
      share: `https://www.deezer.com/artist/${track.ART_ID}`,
      picture: `https://www.deezer.com/artist/${track.ART_ID}/image`,
      radio: null, // not provided
      tracklist: `https://api.deezer.com/artist/${track.ART_ID}/top?limit=50`,
      type: "artist",
    },
    album: {
      id: track.ALB_ID,
      title: track.ALB_TITLE,
      link: `https://www.deezer.com/album/${track.ALB_ID}`,
      cover: `https://api.deezer.com/album/${track.ALB_ID}/image`,
      cover_small: `https://e-cdns-images.dzcdn.net/images/cover/${track.ALB_PICTURE}/56x56-000000-80-0-0.jpg`,
      cover_medium: `https://e-cdns-images.dzcdn.net/images/cover/${track.ALB_PICTURE}/250x250-000000-80-0-0.jpg`,
      cover_big: `https://e-cdns-images.dzcdn.net/images/cover/${track.ALB_PICTURE}/500x500-000000-80-0-0.jpg`,
      cover_xl: `https://e-cdns-images.dzcdn.net/images/cover/${track.ALB_PICTURE}/1000x1000-000000-80-0-0.jpg`,
      md5_image: track.ALB_PICTURE,
      release_date: null, // not provided
      tracklist: `https://api.deezer.com/album/${track.ALB_ID}/tracks`,
      type: "album",
    },
    type: "track",
    // Extras
    md5_origin: track.MD5_ORIGIN,
    filesizes: {
      default: track.FILESIZE,
    },
    media_version: track.MEDIA_VERSION,
    track_token: track.TRACK_TOKEN,
    track_token_expire: track.TRACK_TOKEN_EXPIRE,
  };
  if (parseInt(track.SNG_ID) > 0) {
    result.title_version = (track.VERSION || "").trim();
    if (
      result.title_version &&
      result.title_short.includes(result.title_version)
    ) {
      result.title_short = result.title_short
        .replace(result.title_version, "")
        .trim();
    }
    result.title = `${result.title_short} ${result.title_version}`.trim();
    result.track_position = track.TRACK_NUMBER;
    result.disk_number = track.DISK_NUMBER;
    result.rank = track.RANK || track.RANK_SNG;
    result.release_date = track.PHYSICAL_RELEASE_DATE;
    result.explicit_lyrics = is_explicit(track.EXPLICIT_LYRICS);
    result.explicit_content_lyrics =
      track.EXPLICIT_TRACK_CONTENT.EXPLICIT_LYRICS_STATUS;
    result.explicit_content_cover =
      track.EXPLICIT_TRACK_CONTENT.EXPLICIT_COVER_STATUS;
    result.preview = track.MEDIA[0].HREF;
    result.gain = track.GAIN;
    if (track.ARTISTS) {
      track.ARTISTS.forEach((contributor) => {
        if (contributor.ART_ID === result.artist.id) {
          result.artist = {
            ...result.artist,
            picture_small: `https://e-cdns-images.dzcdn.net/images/artist/${contributor.ART_PICTURE}/56x56-000000-80-0-0.jpg`,
            picture_medium: `https://e-cdns-images.dzcdn.net/images/artist/${contributor.ART_PICTURE}/250x250-000000-80-0-0.jpg`,
            picture_big: `https://e-cdns-images.dzcdn.net/images/artist/${contributor.ART_PICTURE}/500x500-000000-80-0-0.jpg`,
            picture_xl: `https://e-cdns-images.dzcdn.net/images/artist/${contributor.ART_PICTURE}/1000x1000-000000-80-0-0.jpg`,
            md5_image: contributor.ART_PICTURE,
          };
        }
        result.contributors.push({
          id: contributor.ART_ID,
          name: contributor.ART_NAME,
          link: `https://www.deezer.com/artist/${contributor.ART_ID}`,
          share: `https://www.deezer.com/artist/${contributor.ART_ID}`,
          picture: `https://www.deezer.com/artist/${contributor.ART_ID}/image`,
          picture_small: `https://e-cdns-images.dzcdn.net/images/artist/${contributor.ART_PICTURE}/56x56-000000-80-0-0.jpg`,
          picture_medium: `https://e-cdns-images.dzcdn.net/images/artist/${contributor.ART_PICTURE}/250x250-000000-80-0-0.jpg`,
          picture_big: `https://e-cdns-images.dzcdn.net/images/artist/${contributor.ART_PICTURE}/500x500-000000-80-0-0.jpg`,
          picture_xl: `https://e-cdns-images.dzcdn.net/images/artist/${contributor.ART_PICTURE}/1000x1000-000000-80-0-0.jpg`,
          md5_image: contributor.ART_PICTURE,
          tracklist: `https://api.deezer.com/artist/${contributor.ART_ID}/top?limit=50`,
          type: "artist",
          role: RoleID[contributor.ROLE_ID],
          // Extras
          order: contributor.ARTISTS_SONGS_ORDER,
          rank: contributor.RANK,
        });
      });
    }
    // Extras
    result = {
      ...result,
      lyrics_id: track.LYRICS_ID,
      physical_release_date: track.PHYSICAL_RELEASE_DATE,
      song_contributors: track.SNG_CONTRIBUTORS,
    };
    if (track.FALLBACK) result.fallback_id = track.FALLBACK.SNG_ID;
    if (track.DIGITAL_RELEASE_DATE)
      result.digital_release_date = track.DIGITAL_RELEASE_DATE;
    if (track.GENRE_ID) result.genre_id = track.GENRE_ID;
    if (track.COPYRIGHT) result.copyright = track.COPYRIGHT;
    if (track.LYRICS) result.lyrics = track.LYRICS;
    if (track.ALBUM_FALLBACK) result.alternative_albums = track.ALBUM_FALLBACK;
    result.filesizes = {
      ...result.filesizes,
      aac_64: track.FILESIZE_AAC_64,
      mp3_64: track.FILESIZE_MP3_64,
      mp3_128: track.FILESIZE_MP3_128,
      mp3_256: track.FILESIZE_MP3_256,
      mp3_320: track.FILESIZE_MP3_320,
      mp4_ra1: track.FILESIZE_MP4_RA1,
      mp4_ra2: track.FILESIZE_MP4_RA2,
      mp4_ra3: track.FILESIZE_MP4_RA3,
      flac: track.FILESIZE_FLAC,
    };
  } else {
    result.token = track.TOKEN;
    result.user_id = track.USER_ID;
    result.filesizes.mp3_misc = track.FILESIZE_MP3_MISC;
  }
  return result;
}

// Cleanup terms that can hurt search results
function clean_search_query(term) {
  term = term.replaceAll(/ feat[\.]? /g, " ");
  term = term.replaceAll(/ ft[\.]? /g, " ");
  term = term.replaceAll(/\(feat[\.]? /g, " ");
  term = term.replaceAll(/\(ft[\.]? /g, " ");
  term = term.replace(" & ", " ").replace("–", "-").replace("—", "-");
  return term;
}

module.exports = {
  LyricsStatus,
  ReleaseType,
  RoleID,
  is_explicit,
  map_user_track,
  map_user_artist,
  map_user_album,
  map_user_playlist,
  map_album,
  map_artist_album,
  map_playlist,
  map_track,
  clean_search_query,
};
