import { utils } from "deemix";
import got from "got";
import { pipeline } from "stream/promises";
import { sessionDZ } from "../../../deemixApp.js";
import {
	CHUNK_SIZE,
	createDecryptStream,
	forgetStreamSource,
	getStreamSource,
	parseStreamQuality,
	streamCacheKey,
	parseRangeHeader,
} from "@/helpers/deezerStream.js";
import { logger } from "@/helpers/logger.js";
import { type ApiHandler } from "../../../types.js";

const path: ApiHandler["path"] = "/streamTrack";

const handler: ApiHandler["handler"] = async (req, res) => {
	const trackId = req.query.id;
	if (typeof trackId !== "string" || !/^-?\d+$/.test(trackId)) {
		res.status(400).send({ error: "A valid track id is required." });
		return;
	}

	const dz = sessionDZ[req.session.id];
	if (!dz?.loggedIn) {
		res.status(401).send({ error: "notLoggedIn" });
		return;
	}

	const quality = parseStreamQuality(req.query.quality);
	const cacheKey = streamCacheKey(req.session.id, trackId, quality);
	let source;
	try {
		source = await getStreamSource(dz, cacheKey, trackId, quality);
	} catch (error) {
		logger.error(error);
		res.status(502).send({ error: "Unable to get this track from Deezer." });
		return;
	}
	if (!source) {
		res.status(404).send({ error: "notAvailable" });
		return;
	}

	const range = parseRangeHeader(req.headers.range);
	const start = range?.start ?? 0;
	const alignedStart = start - (start % CHUNK_SIZE);

	const upstream = got.stream(source.url, {
		headers: {
			"User-Agent": utils.USER_AGENT_HEADER,
			Range: `bytes=${alignedStart}-${range?.end ?? ""}`,
		},
		https: { rejectUnauthorized: false },
		throwHttpErrors: false,
	});
	res.on("close", () => upstream.destroy());

	upstream.once("response", (response) => {
		if (response.statusCode >= 400) {
			// The signed URL probably expired, the next request will fetch a new one
			forgetStreamSource(cacheKey);
			upstream.destroy();
			if (response.statusCode === 416) {
				res.status(416).end();
			} else {
				res.status(502).send({ error: "Deezer refused the stream." });
			}
			return;
		}

		// The CDN may ignore the Range header and send the whole file
		const upstreamStart = response.statusCode === 206 ? alignedStart : 0;
		const contentRange = response.headers["content-range"];
		const totalMatch = contentRange && /\/(\d+)$/.exec(contentRange);
		const total = totalMatch
			? parseInt(totalMatch[1], 10)
			: upstreamStart + parseInt(response.headers["content-length"] ?? "0", 10);
		const end = Math.min(range?.end ?? total - 1, total - 1);

		res.setHeader("Content-Type", source.mimeType);
		res.setHeader("Accept-Ranges", "bytes");
		res.setHeader("Cache-Control", "no-store");
		res.setHeader("Content-Length", String(end - start + 1));
		if (range) {
			res.status(206);
			res.setHeader("Content-Range", `bytes ${start}-${end}/${total}`);
		} else {
			res.status(200);
		}

		pipeline(
			upstream,
			createDecryptStream(
				source.sngId,
				upstreamStart / CHUNK_SIZE,
				start - upstreamStart
			),
			res
		).catch((error) => {
			if (error.code !== "ERR_STREAM_PREMATURE_CLOSE") logger.error(error);
		});
	});

	upstream.once("error", (error) => {
		if (res.headersSent) return;
		logger.error(error);
		res.status(502).send({ error: "Unable to stream this track." });
	});
};

const apiHandler: ApiHandler = { path, handler };

export default apiHandler;
