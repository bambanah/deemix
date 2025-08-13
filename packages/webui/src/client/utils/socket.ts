class CustomSocket extends WebSocket {
	listeners: Record<string, (this: WebSocket, ev: MessageEvent<any>) => any>;

	constructor(args: string | URL) {
		super(args);
		this.listeners = {};
	}

	emit(key: string, data?: any) {
		if (this.readyState !== WebSocket.OPEN) return false;

		this.send(JSON.stringify({ key, data }));
	}

	on(key: string, cb: (ev: any) => any) {
		if (!Object.keys(this.listeners).includes(key)) {
			this.listeners[key] = cb;

			this.addEventListener("message", (event) => {
				const messageData = JSON.parse(event.data);

				if (messageData.key === key) {
					cb(messageData.data);
				}
			});
		}
	}

	off(key: string) {
		if (Object.keys(this.listeners).includes(key)) {
			this.removeEventListener("message", this.listeners[key]);
			delete this.listeners[key];
		}
	}
}

export const socket = new CustomSocket(
	(location.protocol === "https:" ? "wss://" : "ws://") + location.host + "/"
);
