import { extname, relative, resolve, sep } from "path";
import { readdir, realpath, stat } from "fs/promises";

const audioExtensions = new Set([
	".aac",
	".aiff",
	".alac",
	".flac",
	".m4a",
	".mp3",
	".ogg",
	".opus",
	".wav",
	".wma",
]);

export interface PlayerTrack {
	path: string;
	artist: string;
	title: string;
}

function isInsideDirectory(directory: string, target: string) {
	const relativePath = relative(directory, target);
	return (
		relativePath === "" ||
		(!relativePath.startsWith(`..${sep}`) &&
			relativePath !== ".." &&
			!relativePath.startsWith(sep))
	);
}

export async function listPlayerTracks(directory: string) {
	const root = await realpath(directory);
	const tracks: PlayerTrack[] = [];

	async function visit(currentDirectory: string) {
		const entries = await readdir(currentDirectory, { withFileTypes: true });

		for (const entry of entries) {
			const entryPath = resolve(currentDirectory, entry.name);

			if (entry.isDirectory()) {
				await visit(entryPath);
				continue;
			}

			if (
				!entry.isFile() ||
				!audioExtensions.has(extname(entry.name).toLowerCase())
			)
				continue;

			const filePath = await realpath(entryPath);
			if (!isInsideDirectory(root, filePath)) continue;

			const relativePath = relative(root, filePath).split(sep).join("/");
			const title = entry.name.slice(0, -extname(entry.name).length);
			const artistAndTitle = title.match(/^(.+?)\s+-\s+(.+)$/);
			const artistFromAlbumFolder = relativePath
				.split("/")
				.slice(0, -1)
				.map((segment) => segment.match(/^(.+?)\s+-\s+.+$/)?.[1])
				.find(Boolean);
			tracks.push({
				path: relativePath,
				artist: artistAndTitle?.[1] ?? artistFromAlbumFolder ?? "",
				title: artistAndTitle?.[2] ?? title,
			});
		}
	}

	await visit(root);
	return tracks.sort((first, second) => first.path.localeCompare(second.path));
}

export async function resolvePlayerTrack(directory: string, trackPath: string) {
	const root = await realpath(directory);
	const candidate = resolve(root, trackPath);

	if (!isInsideDirectory(root, candidate) || candidate === root) return null;

	const filePath = await realpath(candidate);
	if (!isInsideDirectory(root, filePath)) return null;

	const fileStats = await stat(filePath);
	if (
		!fileStats.isFile() ||
		!audioExtensions.has(extname(filePath).toLowerCase())
	)
		return null;

	return filePath;
}
