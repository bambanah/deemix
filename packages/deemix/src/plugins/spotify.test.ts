import { describe, expect, it, vi } from "vitest";

import SpotifyPlugin from "./spotify.js";

const { gotGetMock } = vi.hoisted(() => ({ gotGetMock: vi.fn() }));

vi.mock("got", () => {
	return {
		default: {
			get: gotGetMock,
		},
	};
});

describe("SpotifyPlugin playlist fallback", () => {
	it("uses embed page IDs when playlist page only has preview items", async () => {
		const mainHtml = `
			<html>
				<head>
					<meta property="og:title" content="70s Rock Drive" />
					<meta property="og:image" content="https://img.test/cover.jpg" />
					<meta name="music:creator" content="https://open.spotify.com/user/spotify" />
					<meta name="description" content="Playlist · Spotify · 3 items" />
					<meta name="music:song" content="https://open.spotify.com/track/TRACK001" />
					<meta name="music:song" content="https://open.spotify.com/track/TRACK002" />
				</head>
			</html>
		`;

		// Embed page has all IDs, including TRACK003 missing from main HTML.
		const embedHtml = `
			<html>
				<body>
					<script>
						window.__EMBED_STATE__ = {
							tracks: [
								"spotify:track:TRACK001",
								"spotify:track:TRACK002",
								"spotify:track:TRACK003"
							]
						};
					</script>
				</body>
			</html>
		`;

		gotGetMock.mockImplementation(async (url: string) => {
			if (url.includes("/embed/playlist/")) return { body: embedHtml };
			return { body: mainHtml };
		});

		const plugin = new SpotifyPlugin("/tmp/deemix-spotify-test/").setup();
		plugin.getPlaylistFromWebApi = vi.fn().mockResolvedValue(null);
		plugin.sp = {
			tracks: {
				get: vi.fn(async (id: string) => ({
					id,
					explicit: false,
					name: `Track ${id}`,
					artists: [{ name: "Artist" }],
					album: { name: "Album" },
				})),
			},
		} as any;
		plugin.enabled = true;

		const dz = {
			api: {
				get_artist: vi.fn(async () => ({ id: 5080, name: "Various Artists" })),
			},
		} as any;

		const result = await plugin.generatePlaylistItemFromPage(dz, "test", 1);
		const ids = result.conversionData.map((track) => track.id).sort();

		expect(result.size).toBe(3);
		expect(ids).toEqual(["TRACK001", "TRACK002", "TRACK003"]);
		expect(gotGetMock).toHaveBeenCalledWith(
			expect.stringContaining("/embed/playlist/"),
			expect.any(Object)
		);
	});
});
