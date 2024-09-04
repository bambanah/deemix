/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

declare global {
	interface Location {
		base: string;
	}
	interface String {
		capitalize(): string;
	}
}

export {};
