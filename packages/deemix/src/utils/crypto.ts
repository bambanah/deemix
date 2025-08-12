import {
	createCipheriv,
	createHash,
	createDecipheriv,
	getCiphers,
} from "crypto";

let Blowfish;

try {
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	Blowfish = require("./blowfish.cjs");
} catch (e) {
	console.error(e);
}

export function _md5(data, type: BufferEncoding = "binary") {
	const md5sum = createHash("md5");
	md5sum.update(Buffer.from(data, type));
	return md5sum.digest("hex");
}

export function _ecbCrypt(key, data) {
	const cipher = createCipheriv(
		"aes-128-ecb",
		Buffer.from(key),
		Buffer.from("")
	);
	cipher.setAutoPadding(false);
	return Buffer.concat([cipher.update(data, "binary"), cipher.final()])
		.toString("hex")
		.toLowerCase();
}

export function _ecbDecrypt(key, data) {
	const cipher = createDecipheriv(
		"aes-128-ecb",
		Buffer.from(key),
		Buffer.from("")
	);
	cipher.setAutoPadding(false);
	return Buffer.concat([cipher.update(data, "binary"), cipher.final()])
		.toString("hex")
		.toLowerCase();
}

export function generateBlowfishKey(trackId) {
	const SECRET = "g4el58wc0zvf9na1";
	const idMd5 = _md5(trackId.toString(), "ascii");
	let bfKey = "";
	for (let i = 0; i < 16; i++) {
		bfKey += String.fromCharCode(
			idMd5.charCodeAt(i) ^ idMd5.charCodeAt(i + 16) ^ SECRET.charCodeAt(i)
		);
	}
	return String(bfKey);
}

export function decryptChunk(chunk, blowFishKey) {
	const ciphers = getCiphers();
	if (ciphers.includes("bf-cbc")) {
		const cipher = createDecipheriv(
			"bf-cbc",
			blowFishKey,
			Buffer.from([0, 1, 2, 3, 4, 5, 6, 7])
		);
		cipher.setAutoPadding(false);
		return Buffer.concat([cipher.update(chunk), cipher.final()]);
	}
	if (Blowfish) {
		const cipher = new Blowfish(
			blowFishKey,
			Blowfish.MODE.CBC,
			Blowfish.PADDING.NULL
		);
		cipher.setIv(Buffer.from([0, 1, 2, 3, 4, 5, 6, 7]));
		return Buffer.from(cipher.decode(chunk, Blowfish.TYPE.UINT8_ARRAY));
	}
	throw new Error("Can't find a way to decrypt chunks");
}
