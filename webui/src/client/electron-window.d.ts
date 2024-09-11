interface ElectronAPI {
	send: (channel: string, ...args: any[]) => void;
	receive: (channel: string, func: (...args: any[]) => void) => void;
}

declare global {
	interface Window {
		api: ElectronAPI;
	}
}

export {};
