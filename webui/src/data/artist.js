import { getPropertyWithFallback } from "@/utils/utils";
import { fetchData } from "@/utils/api";

export function formatArtistData(artistData) {
	return {
		artistName: getPropertyWithFallback(artistData, "name"),
		artistPictureXL: getPropertyWithFallback(artistData, "picture_xl"),
		artistReleases: formatArtistReleases(
			getPropertyWithFallback(artistData, "releases")
		),
	};
}

function formatArtistReleases(artistReleases) {
	const formattedReleases = {};

	for (const releaseType in artistReleases) {
		if (artistReleases.hasOwnProperty(releaseType)) {
			const releases = artistReleases[releaseType];
			formattedReleases[releaseType] = [];

			for (const release of releases) {
				formattedReleases[releaseType].push({
					releaseID: getPropertyWithFallback(release, "id"),
					releaseCover: getPropertyWithFallback(release, "cover_small"),
					releaseTitle: getPropertyWithFallback(release, "title"),
					releaseDate: getPropertyWithFallback(release, "release_date"),
					releaseTracksNumber: getPropertyWithFallback(release, "nb_tracks"),
					releaseLink: getPropertyWithFallback(release, "link"),
					releaseType: getPropertyWithFallback(release, "record_type"),
					isReleaseExplicit: getPropertyWithFallback(
						release,
						"explicit_lyrics"
					),
				});
			}
		}
	}

	return formattedReleases;
}

export function getArtistData(artistID) {
	return fetchData("getTracklist", {
		type: "artist",
		id: artistID,
	});
}
