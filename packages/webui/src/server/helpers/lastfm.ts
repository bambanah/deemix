import { createHash } from "crypto";
import { readFileSync } from "fs";
import { mkdir, readFile, rm, writeFile } from "fs/promises";
import got from "got";
import { join } from "path";
import { configFolder } from "@/deemixApp.js";

const lastfmApiUrl = "https://ws.audioscrobbler.com/2.0/";
const lastfmSessionPath = join(configFolder, "lastfm-session.json");
const lastfmCredentialsPath = join(configFolder, "lastfm.json");

interface LastfmCredentials {
	apiKey: string;
	apiSecret: string;
}

interface LastfmSession {
	name: string;
	key: string;
}

interface LastfmTokenResponse {
	token?: string;
	error?: number;
	message?: string;
}

interface LastfmSessionResponse {
	session?: LastfmSession;
	error?: number;
	message?: string;
}

// Fallback to a file so the keys don't have to be exported on every server start
function readCredentialsFile(): Partial<LastfmCredentials> {
	try {
		const { apiKey, apiSecret } = JSON.parse(
			readFileSync(lastfmCredentialsPath, "utf8")
		);
		return {
			apiKey: typeof apiKey === "string" ? apiKey : undefined,
			apiSecret: typeof apiSecret === "string" ? apiSecret : undefined,
		};
	} catch {
		return {};
	}
}

function findCredentials(): Partial<LastfmCredentials> {
	const { LASTFM_API_KEY, LASTFM_API_SECRET } = process.env;
	if (LASTFM_API_KEY && LASTFM_API_SECRET)
		return { apiKey: LASTFM_API_KEY, apiSecret: LASTFM_API_SECRET };
	return readCredentialsFile();
}

function getCredentials(): LastfmCredentials {
	const { apiKey, apiSecret } = findCredentials();
	if (!apiKey || !apiSecret) {
		throw new Error(
			`LASTFM_API_KEY and LASTFM_API_SECRET must be configured (or set apiKey/apiSecret in ${lastfmCredentialsPath}).`
		);
	}
	return { apiKey, apiSecret };
}

export function signParameters(
	parameters: Record<string, string>,
	apiSecret: string
): string {
	const signature = Object.keys(parameters)
		.sort()
		.map((key) => `${key}${parameters[key]}`)
		.join("");

	return createHash("md5").update(`${signature}${apiSecret}`).digest("hex");
}

function assertLastfmResponse<T extends { error?: number; message?: string }>(
	response: T
): T {
	if (response.error) {
		throw new Error(`Last.fm API error ${response.error}: ${response.message}`);
	}
	return response;
}

async function readSession(): Promise<LastfmSession | null> {
	try {
		const session = JSON.parse(
			await readFile(lastfmSessionPath, { encoding: "utf8" })
		) as LastfmSession;
		if (typeof session.name !== "string" || typeof session.key !== "string") {
			throw new Error("Stored Last.fm session is invalid.");
		}
		return session;
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
		throw error;
	}
}

async function saveSession(session: LastfmSession) {
	await mkdir(configFolder, { recursive: true });
	await writeFile(lastfmSessionPath, JSON.stringify(session), { mode: 0o600 });
}

async function signedRequest(
	parameters: Record<string, string>,
	credentials: LastfmCredentials
) {
	return got
		.post(lastfmApiUrl, {
			form: {
				...parameters,
				api_key: credentials.apiKey,
				api_sig: signParameters(
					{ ...parameters, api_key: credentials.apiKey },
					credentials.apiSecret
				),
				format: "json",
			},
			// Last.fm explains errors (bad key, invalid session...) in a 4xx body
			throwHttpErrors: false,
		})
		.json<{ error?: number; message?: string }>()
		.then(async (response) => {
			// Error 9: the session was revoked or created with another API key,
			// drop it so the UI asks to connect again instead of failing silently
			if (response.error === 9) await disconnectLastfm();
			return assertLastfmResponse(response);
		});
}

export async function getLastfmAuthorizationUrl() {
	const credentials = getCredentials();
	const parameters = {
		method: "auth.getToken",
		api_key: credentials.apiKey,
	};
	const response = assertLastfmResponse(
		await got
			.get(lastfmApiUrl, {
				searchParams: {
					...parameters,
					api_sig: signParameters(parameters, credentials.apiSecret),
					format: "json",
				},
			})
			.json<LastfmTokenResponse>()
	);

	if (!response.token)
		throw new Error("Last.fm did not return an authorization token.");

	const url = new URL("https://www.last.fm/api/auth/");
	url.searchParams.set("api_key", credentials.apiKey);
	url.searchParams.set("token", response.token);
	return { token: response.token, url: url.href };
}

export async function connectLastfm(token: string) {
	const credentials = getCredentials();
	const response = assertLastfmResponse(
		await signedRequest(
			{
				method: "auth.getSession",
				token,
			},
			credentials
		)
	) as LastfmSessionResponse;

	if (!response.session?.name || !response.session.key) {
		throw new Error("Last.fm did not return a valid user session.");
	}

	await saveSession(response.session);
	return { username: response.session.name };
}

export async function getLastfmStatus() {
	const session = await readSession();
	const { apiKey, apiSecret } = findCredentials();
	const configured = !!apiKey && !!apiSecret;
	return {
		configured,
		connected: session !== null,
		username: session?.name ?? null,
	};
}

export async function disconnectLastfm() {
	await rm(lastfmSessionPath, { force: true });
}

export async function updateLastfmNowPlaying(track: {
	artist: string;
	title: string;
	album?: string;
	albumArtist?: string;
	duration?: number;
}) {
	const credentials = getCredentials();
	const session = await readSession();
	if (!session) throw new Error("No Last.fm account is connected.");

	const parameters: Record<string, string> = {
		method: "track.updateNowPlaying",
		sk: session.key,
		artist: track.artist,
		track: track.title,
	};
	if (track.album) parameters.album = track.album;
	if (track.albumArtist) parameters.albumArtist = track.albumArtist;
	if (track.duration && Number.isFinite(track.duration))
		parameters.duration = String(Math.round(track.duration));

	await signedRequest(parameters, credentials);
}

export async function scrobbleLastfmTrack(track: {
	artist: string;
	title: string;
	timestamp: number;
	album?: string;
	albumArtist?: string;
	duration?: number;
}) {
	const credentials = getCredentials();
	const session = await readSession();
	if (!session) throw new Error("No Last.fm account is connected.");

	const parameters: Record<string, string> = {
		method: "track.scrobble",
		sk: session.key,
		"artist[0]": track.artist,
		"track[0]": track.title,
		"timestamp[0]": String(track.timestamp),
	};
	if (track.album) parameters["album[0]"] = track.album;
	if (track.albumArtist) parameters["albumArtist[0]"] = track.albumArtist;
	if (track.duration && Number.isFinite(track.duration))
		parameters["duration[0]"] = String(Math.round(track.duration));

	const response = (await signedRequest(parameters, credentials)) as {
		scrobbles?: {
			"@attr"?: { accepted?: number | string };
			scrobble?: { ignoredMessage?: { code?: string; "#text"?: string } };
		};
	};
	// Last.fm answers 200 even when it silently drops a scrobble
	const accepted = Number(response.scrobbles?.["@attr"]?.accepted ?? 0) > 0;
	const ignored = response.scrobbles?.scrobble?.ignoredMessage;
	return {
		accepted,
		ignoredReason: accepted
			? null
			: ignored?.["#text"] || `code ${ignored?.code ?? "unknown"}`,
	};
}
