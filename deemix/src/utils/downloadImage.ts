import {
	createWriteStream,
	existsSync,
	mkdirSync,
	readFileSync,
	unlinkSync,
} from "fs";
import { HTTPError, ReadError, TimeoutError, default as got } from "got";
import { tmpdir } from "os";
import { OverwriteOption } from "../settings.js";
import { USER_AGENT_HEADER, pipeline } from "../utils/index.js";

const TEMPDIR = tmpdir() + "/deemix-imgs";
mkdirSync(TEMPDIR, { recursive: true });

export async function downloadImage(
	url: string,
	path: string,
	overwrite = OverwriteOption.DONT_OVERWRITE
) {
	if (
		existsSync(path) &&
		![
			OverwriteOption.OVERWRITE,
			OverwriteOption.ONLY_TAGS,
			OverwriteOption.KEEP_BOTH,
		].includes(overwrite)
	) {
		const file = readFileSync(path);
		if (file.length !== 0) return path;
		unlinkSync(path);
	}
	let timeout: NodeJS.Timeout | null = null;
	let error = "";

	const downloadStream = got
		.stream(url, {
			headers: { "User-Agent": USER_AGENT_HEADER },
			https: { rejectUnauthorized: false },
		})
		.on("data", function () {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				error = "DownloadTimeout";
				downloadStream.destroy();
			}, 5000);
		});
	const fileWriterStream = createWriteStream(path);

	timeout = setTimeout(() => {
		error = "DownloadTimeout";
		downloadStream.destroy();
	}, 5000);

	try {
		await pipeline(downloadStream, fileWriterStream);
	} catch (e) {
		unlinkSync(path);
		if (e instanceof HTTPError) {
			if (url.includes("images.dzcdn.net")) {
				const urlBase = url.slice(0, url.lastIndexOf("/") + 1);
				const pictureURL = url.slice(urlBase.length);
				const pictureSize = parseInt(
					pictureURL.slice(0, pictureURL.indexOf("x"))
				);
				if (pictureSize > 1200) {
					return downloadImage(
						urlBase +
							pictureURL.replace(`${pictureSize}x${pictureSize}`, "1200x1200"),
						path,
						overwrite
					);
				}
			}
			return null;
		}
		if (
			e instanceof ReadError ||
			e instanceof TimeoutError ||
			[
				"ESOCKETTIMEDOUT",
				"ERR_STREAM_PREMATURE_CLOSE",
				"ETIMEDOUT",
				"ECONNRESET",
			].includes(e.code) ||
			(downloadStream.destroyed && error === "DownloadTimeout")
		) {
			return downloadImage(url, path, overwrite);
		}
		console.trace(e);
		throw e;
	}
	return path;
}
