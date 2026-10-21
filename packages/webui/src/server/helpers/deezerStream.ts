import { utils } from "deemix";
import { type Deezer } from "deezer-sdk";
import { Transform } from "stream";

export const CHUNK_SIZE = 2048;

const STREAM_URL_TTL = 30 * 60 * 1000;

export interface StreamSource {
	url: string;
	sngId: string;
	format: string;
	mimeType: string;
	expiresAt: number;
}

const streamSourceCache = new Map<string, StreamSource>();

/**
 * Decrypts a Deezer BF_CBC_STRIPE stream: every third 2048 byte chunk is
 * blowfish encrypted, the rest is plain. Each chunk is decrypted on its own,
 * so decryption can start at any chunk boundary (used for HTTP Range requests).
 */
export function createDecryptStream(
	sngId: string,
	firstChunkIndex = 0,
	skipBytes = 0
) {
	const blowfishKey = utils.generateBlowfishKey(sngId);
	let buffered = Buffer.alloc(0);
	let chunkIndex = firstChunkIndex;
	let bytesToSkip = skipBytes;

	function emit(stream: Transform, chunk: Buffer) {
		if (bytesToSkip > 0) {
			const skipped = Math.min(bytesToSkip, chunk.length);
			bytesToSkip -= skipped;
			chunk = chunk.subarray(skipped);
		}
		if (chunk.length > 0) stream.push(chunk);
	}

	return new Transform({
		transform(data: Buffer, _encoding, callback) {
			buffered = Buffer.concat([buffered, data]);
			while (buffered.length >= CHUNK_SIZE) {
				let chunk = buffered.subarray(0, CHUNK_SIZE);
				buffered = buffered.subarray(CHUNK_SIZE);
				if (chunkIndex % 3 === 0)
					chunk = utils.decryptChunk(chunk, blowfishKey);
				chunkIndex++;
				emit(this, chunk);
			}
			callback();
		},
		flush(callback) {
			// A trailing partial chunk is never encrypted
			emit(this, buffered);
			callback();
		},
	});
}

export interface ByteRange {
	start: number;
	end?: number;
}

export function parseRangeHeader(header: string | undefined): ByteRange | null {
	if (!header) return null;
	const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
	if (!match || match[1] === "") return null;
	const start = parseInt(match[1], 10);
	const end = match[2] === "" ? undefined : parseInt(match[2], 10);
	if (end !== undefined && end < start) return null;
	return { start, end };
}

const STREAM_FORMATS = [
	{ name: "FLAC", mimeType: "audio/flac", needs: "can_stream_lossless" },
	{ name: "MP3_320", mimeType: "audio/mpeg", needs: "can_stream_hq" },
	{ name: "MP3_128", mimeType: "audio/mpeg", needs: null },
] as const;

export type StreamQuality = (typeof STREAM_FORMATS)[number]["name"];

/** The best quality the player asked for, the account may only allow a lower one */
export function parseStreamQuality(value: unknown): StreamQuality {
	return STREAM_FORMATS.find((format) => format.name === value)?.name ?? "FLAC";
}

export function streamCacheKey(
	sessionId: string,
	trackId: string,
	quality: StreamQuality
) {
	return `${sessionId}:${trackId}:${quality}`;
}

async function resolveTrackUrl(
	dz: Deezer,
	gwTrack: any,
	maxQuality: StreamQuality
) {
	const firstFormat = STREAM_FORMATS.findIndex(
		(format) => format.name === maxQuality
	);
	for (const format of STREAM_FORMATS.slice(firstFormat)) {
		if (format.needs && !dz.currentUser?.[format.needs]) continue;
		const filesize = gwTrack[`FILESIZE_${format.name}`];
		if (!filesize || filesize === "0") continue;

		try {
			const url = await dz.get_track_url(gwTrack.TRACK_TOKEN, format.name);
			if (url) return { url, format: format.name, mimeType: format.mimeType };
		} catch {
			/* try the next format */
		}
	}
	return null;
}

export async function getStreamSource(
	dz: Deezer,
	cacheKey: string,
	trackId: string,
	maxQuality: StreamQuality
): Promise<StreamSource | null> {
	const cached = streamSourceCache.get(cacheKey);
	if (cached && cached.expiresAt > Date.now()) return cached;

	let gwTrack: any = await dz.gw.get_track_with_fallback(trackId);
	let resolved = await resolveTrackUrl(dz, gwTrack, maxQuality);

	// Unavailable tracks may have a playable alternative version
	if (!resolved && gwTrack.FALLBACK?.SNG_ID) {
		gwTrack = await dz.gw.get_track_with_fallback(gwTrack.FALLBACK.SNG_ID);
		resolved = await resolveTrackUrl(dz, gwTrack, maxQuality);
	}
	if (!resolved) return null;

	const source: StreamSource = {
		...resolved,
		sngId: String(gwTrack.SNG_ID),
		expiresAt: Date.now() + STREAM_URL_TTL,
	};
	for (const [key, entry] of streamSourceCache) {
		if (entry.expiresAt <= Date.now()) streamSourceCache.delete(key);
	}
	streamSourceCache.set(cacheKey, source);
	return source;
}

export function forgetStreamSource(cacheKey: string) {
	streamSourceCache.delete(cacheKey);
}
