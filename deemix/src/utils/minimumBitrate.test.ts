import { expect, test, describe, beforeEach, vi } from "vitest";
import { TrackFormats } from "deezer-sdk";
import { getPreferredBitrate } from "./getPreferredBitrate.js";
import { PreferredBitrateNotFound } from "../errors.js";
import Track from "../types/Track.js";

describe("getPreferredBitrate minimumBitrate tests", () => {
	let mockDeezer;
	let mockTrack;
	let mockListener;

	beforeEach(() => {
		// Mock Deezer instance
		mockDeezer = {
			currentUser: {
				can_stream_lossless: true,
				can_stream_hq: true,
				country: "US",
			},
			get_track_url: vi.fn(),
			gw: {
				get_track_with_fallback: vi.fn(),
			},
		};

		// Mock Track
		mockTrack = new Track();
		mockTrack.id = 12345;
		mockTrack.title = "Test Track";
		mockTrack.MD5 = "abc123";
		mockTrack.mediaVersion = 1;
		mockTrack.trackToken = "token123";
		mockTrack.urls = {};
		mockTrack.filesizes = {
			flac: "20000000",
			mp3_320: "10000000",
			mp3_128: "5000000",
		};
		mockTrack.mainArtist = { name: "Test Artist" };
		mockTrack.fallbackID = 0;
		mockTrack.checkAndRenewTrackToken = vi.fn().mockResolvedValue(undefined);

		// Mock listener
		mockListener = {
			send: vi.fn(),
		};
	});

	test("should not fall below minimum bitrate of MP3_320", async () => {
		// Setup: Make FLAC and MP3_320 unavailable, only MP3_128 is available
		mockDeezer.get_track_url.mockImplementation((token, format) => {
			if (format === "FLAC" || format === "MP3_320")
				return Promise.resolve(undefined);

			const urls = {
				MP3_128: "https://example.com/128",
			};
			return Promise.resolve(urls[format]);
		});

		// Test with minimum bitrate of MP3_320
		await expect(
			getPreferredBitrate(
				mockDeezer,
				mockTrack,
				TrackFormats.FLAC,
				true, // shouldFallback
				false, // feelingLucky
				"test-uuid",
				mockListener,
				TrackFormats.MP3_320 // minimum bitrate
			)
		).rejects.toThrow(PreferredBitrateNotFound);
	});

	test("should respect minimumBitrate when preferred bitrate is lower", async () => {
		// Setup: Make all formats available
		mockDeezer.get_track_url.mockImplementation((token, format) => {
			const urls = {
				FLAC: "https://example.com/flac",
				MP3_320: "https://example.com/320",
				MP3_128: "https://example.com/128",
			};
			return Promise.resolve(urls[format]);
		});

		// Attempting to request MP3_128 but with MP3_320 as minimum
		// According to the implementation, this should throw PreferredBitrateNotFound
		// because the preferred bitrate is lower than the minimum
		await expect(
			getPreferredBitrate(
				mockDeezer,
				mockTrack,
				TrackFormats.MP3_128, // Preferred bitrate is lower than minimum
				true, // shouldFallback
				false, // feelingLucky
				"test-uuid",
				mockListener,
				TrackFormats.MP3_320 // Minimum bitrate is MP3_320
			)
		).rejects.toThrow(PreferredBitrateNotFound);
	});

	test("should use default minimum of MP3_128 when not specified", async () => {
		// Setup: Make FLAC unavailable, MP3_320 and MP3_128 available
		mockDeezer.get_track_url.mockImplementation((token, format) => {
			if (format === "FLAC") return Promise.resolve(undefined);

			const urls = {
				MP3_320: "https://example.com/320",
				MP3_128: "https://example.com/128",
			};
			return Promise.resolve(urls[format]);
		});

		// Request FLAC with no minimum specified (defaults to MP3_128)
		const result = await getPreferredBitrate(
			mockDeezer,
			mockTrack,
			TrackFormats.FLAC, // Preferred bitrate
			true, // shouldFallback
			false, // feelingLucky
			"test-uuid",
			mockListener
			// No minimum bitrate specified, defaults to MP3_128
		);

		// Should fallback to MP3_320 since it's the highest available
		expect(result).toBe(TrackFormats.MP3_320);
		expect(mockTrack.urls.MP3_320).toBe("https://example.com/320");
	});

	test("example: using MP3_320 as global minimum in application settings", async () => {
		// This test demonstrates how you would use the minimumBitrate setting in your app

		// 1. Import TrackFormats in your settings file
		// import { TrackFormats } from 'deezer-sdk';

		// 2. Define the minimum bitrate in your settings
		const settings = {
			minimumBitrate: TrackFormats.MP3_320, // MP3_320 = 3
			fallbackBitrate: true, // Enable fallback, but respect the minimum
			// ...other settings
		};

		// Setup: Make all formats available
		mockDeezer.get_track_url.mockImplementation((token, format) => {
			const urls = {
				FLAC: "https://example.com/flac",
				MP3_320: "https://example.com/320",
				MP3_128: "https://example.com/128",
			};
			return Promise.resolve(urls[format]);
		});

		// 3. When making the call, pass the minimum bitrate from settings
		const result = await getPreferredBitrate(
			mockDeezer,
			mockTrack,
			TrackFormats.FLAC, // User's preferred bitrate
			settings.fallbackBitrate,
			false, // feelingLucky
			"test-uuid",
			mockListener,
			settings.minimumBitrate // Pass the minimum from settings
		);

		// Should try FLAC first, but if unavailable would only fall back to MP3_320 or higher
		expect(result).toBe(TrackFormats.FLAC);
		expect(mockTrack.urls.FLAC).toBe("https://example.com/flac");
	});
});
