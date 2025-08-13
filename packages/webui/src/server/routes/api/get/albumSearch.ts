import { Deezer } from "deezer-sdk";
import type { RequestHandler } from "express";
import { sessionDZ } from "@/deemixApp.js";
import type { ApiHandler } from "@/types.js";

export interface RawAlbumQuery {
	term: string;
	start?: string;
	nb?: string;
}

export interface AlbumSearchParams extends Omit<RawAlbumQuery, "start" | "nb"> {
	start: number;
	nb: number;
}

export interface AlbumResponse {
	data: any[];
	total: number;
}

const path: ApiHandler["path"] = "/album-search/";

const handler: RequestHandler<any, any, any, RawAlbumQuery> = async (
	req,
	res
) => {
	if (!sessionDZ[req.session.id]) sessionDZ[req.session.id] = new Deezer();
	const dz = sessionDZ[req.session.id];

	if (!req.query) {
		res.status(400).send();
	}

	const { term, start, nb } = parseQuery(req.query);

	if (!term || term.trim() === "") {
		res.status(400).send();
	}

	const results = await dz.gw.search_music(term, "ALBUM", {
		index: start,
		limit: nb,
	});

	const albums = await Promise.all(
		results.data.map((c: any) => getAlbumDetails(dz, c.ALB_ID))
	);

	const output: AlbumResponse = {
		data: albums,
		total: albums.length,
	};

	res.send(output);
};

export const apiHandler = { path, handler };

function parseQuery(query: RawAlbumQuery): AlbumSearchParams {
	let startingPoint = 0;

	if (typeof query.start !== "undefined") {
		startingPoint = parseInt(query.start);
	}

	let newNb = 30;

	if (typeof query.nb !== "undefined") {
		newNb = parseInt(query.nb);
	}

	return {
		term: query.term,
		start: startingPoint,
		nb: newNb,
	};
}

export async function getAlbumDetails(
	dz: Deezer,
	albumId: string
): Promise<any> {
	const result = await dz.gw.get_album_page(albumId);
	const output = result.DATA;

	let duration = 0;
	result.SONGS.data.forEach((s: any) => {
		if ("DURATION" in s) {
			duration += parseInt(s.DURATION);
		}
	});

	output.DURATION = duration;
	output.NUMBER_TRACK = result.SONGS.total;
	output.LINK = `https://deezer.com/album/${output.ALB_ID}`;

	return output;
}
