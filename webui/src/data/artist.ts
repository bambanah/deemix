import { getPropertyWithFallback } from "@/utils/utils";
import { fetchData } from "@/utils/api";

export function formatArtistData(artistData: {
	name?: string;
	picture_xl?: string;
	releases?: { [key: string]: any[] };
}) {
	return {
		artistName: artistData.hasOwnProperty("name") ? artistData.name : undefined,
		artistPictureXL: artistData.hasOwnProperty("picture_xl")
			? artistData.picture_xl
			: undefined,
		artistReleases: artistData.hasOwnProperty("releases")
			? formatArtistReleases(artistData.releases)
			: undefined,
	};
}

interface ArtistRelease {
	releaseID: string;
	releaseCover: string;
	releaseTitle: string;
	releaseDate: string;
	releaseTracksNumber: number;
	releaseLink: string;
	releaseType: string;
	isReleaseExplicit: boolean;
}

function formatArtistReleases(
	artistReleases: { [key: string]: any[] } | undefined
) {
	console.log(artistReleases);
	const formattedReleases: Record<string, ArtistRelease[]> = {};

	for (const releaseType in artistReleases) {
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
				isReleaseExplicit: getPropertyWithFallback(release, "explicit_lyrics"),
			});
		}
	}

	return formattedReleases;
}

export function getArtistData(artistID?: string) {
	return fetchData("getTracklist", {
		type: "artist",
		id: artistID,
	});
}
