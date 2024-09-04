import { Deezer } from "deezer-js";
import { RequestHandler } from "express";
import { sessionDZ } from "../../../deemixApp";
import { BadRequestError } from "../../../helpers/errors";
import { logger } from "../../../helpers/logger";
import { isObjectEmpy } from "../../../helpers/primitive-checks";
import { ApiHandler } from "../../../types";

export interface RawChartTracksQuery {
	id: string;
	index?: number;
	limit?: number;
}

const path: ApiHandler["path"] = "/getChartTracks";

const handler: RequestHandler<{}, {}, {}, RawChartTracksQuery> = async (
	req,
	res,
	next
) => {
	try {
		if (!sessionDZ[req.session.id]) sessionDZ[req.session.id] = new Deezer();
		const dz = sessionDZ[req.session.id];

		if (isObjectEmpy(req.query) || !req.query.id) {
			throw new BadRequestError();
		}

		const playlistId = req.query.id;
		const index = req.query.index;
		const limit = req.query.limit;

		const response = await dz.api.get_playlist_tracks(playlistId, {
			index,
			limit,
		});
		return res.status(200).send(response);
	} catch (error) {
		if (error instanceof BadRequestError) {
			logger.error(error.message);
			res.status(400).send();
			return next();
		}
	}
};

const apiHandler: ApiHandler = { path, handler };

export default apiHandler;
