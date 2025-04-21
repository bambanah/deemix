import * as crypto from "crypto";
import { Blowfish } from "egoroof-blowfish";

/**
 * Generate MD5 hash of input data
 * @param data Input data to hash
 * @param type Input encoding type
 * @returns Hex string of the MD5 hash
 */
export function _md5(
	data: string,
	type: crypto.BinaryToTextEncoding = "binary"
): string {
	const md5sum = crypto.createHash("md5");
	md5sum.update(Buffer.from(data, type as BufferEncoding));
	return md5sum.digest("hex");
}

/**
 * Encrypt data using AES-128-ECB
 * @param key Encryption key
 * @param data Data to encrypt
 * @returns Encrypted data as hex string
 */
export function _ecbCrypt(key: string, data: string): string {
	const cipher = crypto.createCipheriv(
		"aes-128-ecb",
		Buffer.from(key),
		Buffer.alloc(0)
	);
	cipher.setAutoPadding(false);
	return Buffer.concat([
		cipher.update(Buffer.from(data, "binary")),
		cipher.final(),
	])
		.toString("hex")
		.toLowerCase();
}

/**
 * Decrypt data using AES-128-ECB
 * @param key Decryption key
 * @param data Data to decrypt (hex string)
 * @returns Decrypted data as hex string
 */
export function _ecbDecrypt(key: string, data: string): string {
	const cipher = crypto.createDecipheriv(
		"aes-128-ecb",
		Buffer.from(key),
		Buffer.alloc(0)
	);
	cipher.setAutoPadding(false);
	return Buffer.concat([
		cipher.update(Buffer.from(data, "hex")),
		cipher.final(),
	]).toString("utf-8");
}

/**
 * Generate a Blowfish key for track decryption
 * @param trackId Track ID to generate key for
 * @returns Blowfish key as string
 */
export function generateBlowfishKey(trackId: string | number): string {
	const SECRET = "g4el58wc0zvf9na1";
	const idMd5 = _md5(trackId.toString(), "binary");
	let bfKey = "";

	for (let i = 0; i < 16; i++) {
		bfKey += String.fromCharCode(
			idMd5.charCodeAt(i) ^ idMd5.charCodeAt(i + 16) ^ SECRET.charCodeAt(i)
		);
	}

	return bfKey;
}

/**
 * Decrypt a chunk of data using Blowfish CBC
 * @param chunk Data chunk to decrypt
 * @param blowFishKey Blowfish key to use for decryption
 * @returns Decrypted data as Buffer
 */
export function decryptChunk(chunk: Buffer, blowFishKey: string): Buffer {
	const ciphers = crypto.getCiphers();

	// If Node.js has native Blowfish support
	if (ciphers.includes("bf-cbc")) {
		const cipher = crypto.createDecipheriv(
			"bf-cbc",
			blowFishKey,
			Buffer.from([0, 1, 2, 3, 4, 5, 6, 7])
		);
		cipher.setAutoPadding(false);
		return Buffer.concat([cipher.update(chunk), cipher.final()]);
	}

	// Use egoroof-blowfish implementation
	try {
		// CBC = 1, NULL padding = 3
		const bf = new Blowfish(blowFishKey, 1, 3);
		bf.setIv(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]));

		// UINT8_ARRAY = 1 (for return type)
		return Buffer.from(bf.decode(chunk, 1));
	} catch (err) {
		console.error("Error using Blowfish:", err);
		throw new Error("Can't find a way to decrypt chunks");
	}
}
