// Select tracks inside the original album object, preserving album metadata and slots.
type AlbumSelection = {
	type: string;
	size: number;
	progressNext: number;
	collection?: { tracks: { id: string | number }[] };
};

export function selectAlbumTracks(object: AlbumSelection, input?: string) {
	if (!input) return;
	const values = input.split(",");
	if (!values.length || values.some((id) => !/^[1-9]\d*$/.test(id))) {
		throw new Error(
			"--track-ids requires comma-separated positive Deezer track IDs"
		);
	}
	if (object.type !== "album" || !Array.isArray(object.collection?.tracks)) {
		throw new Error("--track-ids requires an album URL");
	}
	const ids = new Set(values);
	const original = object.collection.tracks;
	const selected = original.filter((track) => ids.has(String(track.id)));
	if (selected.length !== ids.size) {
		throw new Error(
			"A requested track ID is absent from this album; refresh its partial record"
		);
	}
	object.collection.tracks = selected;
	object.progressNext +=
		((original.length - selected.length) / object.size) * 100;
}
