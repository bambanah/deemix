export interface Listener {
	send: (key: string, data?: any) => void;
}
