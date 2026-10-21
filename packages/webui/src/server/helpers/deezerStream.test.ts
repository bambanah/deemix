import { randomBytes } from "crypto";
import { Readable } from "stream";
import {
	CHUNK_SIZE,
	createDecryptStream,
	parseRangeHeader,
	parseStreamQuality,
} from "./deezerStream.js";

async function decrypt(data: Buffer, firstChunkIndex = 0, skipBytes = 0) {
	const output: Buffer[] = [];
	// Feed odd sized pieces to exercise the internal buffering
	const pieces: Buffer[] = [];
	for (let i = 0; i < data.length; i += 1000)
		pieces.push(data.subarray(i, i + 1000));
	const stream = Readable.from(pieces).pipe(
		createDecryptStream("3135556", firstChunkIndex, skipBytes)
	);
	for await (const chunk of stream) output.push(chunk);
	return Buffer.concat(output);
}

describe("deezer stream decryption", () => {
	const encrypted = randomBytes(CHUNK_SIZE * 7 + 123);

	test("keeps the size and leaves the unencrypted chunks untouched", async () => {
		const decrypted = await decrypt(encrypted);

		expect(decrypted.length).toBe(encrypted.length);
		expect(
			decrypted
				.subarray(0, CHUNK_SIZE)
				.equals(encrypted.subarray(0, CHUNK_SIZE))
		).toBe(false);
		expect(
			decrypted
				.subarray(CHUNK_SIZE, CHUNK_SIZE * 3)
				.equals(encrypted.subarray(CHUNK_SIZE, CHUNK_SIZE * 3))
		).toBe(true);
		expect(
			decrypted
				.subarray(CHUNK_SIZE * 7)
				.equals(encrypted.subarray(CHUNK_SIZE * 7))
		).toBe(true);
	});

	test("decrypting from an offset matches the same bytes of the full stream", async () => {
		const full = await decrypt(encrypted);
		const start = CHUNK_SIZE * 3 + 500;
		const alignedStart = CHUNK_SIZE * 3;

		const partial = await decrypt(
			encrypted.subarray(alignedStart),
			alignedStart / CHUNK_SIZE,
			start - alignedStart
		);

		expect(partial.equals(full.subarray(start))).toBe(true);
	});
});

describe("range header parsing", () => {
	test("parses open and closed ranges", () => {
		expect(parseRangeHeader("bytes=0-")).toEqual({ start: 0, end: undefined });
		expect(parseRangeHeader("bytes=100-199")).toEqual({ start: 100, end: 199 });
	});

	test("ignores missing, suffix and invalid ranges", () => {
		expect(parseRangeHeader(undefined)).toBeNull();
		expect(parseRangeHeader("bytes=-500")).toBeNull();
		expect(parseRangeHeader("bytes=10-5")).toBeNull();
		expect(parseRangeHeader("items=0-1")).toBeNull();
	});
});

describe("stream quality parsing", () => {
	test("accepts the known formats and defaults to the best one", () => {
		expect(parseStreamQuality("MP3_320")).toBe("MP3_320");
		expect(parseStreamQuality("MP3_128")).toBe("MP3_128");
		expect(parseStreamQuality(undefined)).toBe("FLAC");
		expect(parseStreamQuality("MP4_RA3")).toBe("FLAC");
	});
});
