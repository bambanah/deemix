class CustomSocket extends WebSocket {
	constructor(args) {
		super(args);
		this.listeners = {};
	}

	emit(key, data) {
		if (this.readyState !== WebSocket.OPEN) return false;

		this.send(JSON.stringify({ key, data }));
	}

	on(key, cb) {
		if (!Object.keys(this.listeners).includes(key)) {
			// console.log('on:', key)
			this.listeners[key] = cb;

			this.addEventListener("message", (event) => {
				const messageData = JSON.parse(event.data);

				if (messageData.key === key) {
					cb(messageData.data);
				}
			});
		}
	}

	off(key) {
		if (Object.keys(this.listeners).includes(key)) {
			// console.log('off:', key)
			this.removeEventListener("message", this.listeners[key]);
			delete this.listeners[key];
		}
	}
}

console.log(location);

export const socket = new CustomSocket(
	(location.protocol === "https:" ? "wss://" : "ws://") + location.host + "/"
);
