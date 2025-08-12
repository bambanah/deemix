import { type Port } from "../types.js";

/**
 * Normalize a port into a number, string, or false.
 *
 * @since	0.0.0
 */
export function normalizePort(portString: string): Port {
	const port = parseInt(portString, 10);

	if (isNaN(port)) {
		// named pipe
		return portString;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}
