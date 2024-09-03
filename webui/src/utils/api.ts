export function fetchData(
	key: string,
	data: Record<string, any> = {},
	method = "GET"
) {
	const url = new URL(`${window.location.origin}${location.base}api/${key}`);

	Object.keys(data).forEach((key) => {
		url.searchParams.append(key, data[key]);
	});

	return fetch(url.href, { method })
		.then((response) => response.json())
		.catch((error) => {
			console.error(
				"There has been a problem with your fetch operation:",
				error
			);
			return Promise.reject(error);
		});
}

export function sendToServer(key: string, data: Record<string, any>) {
	const url = new URL(`${window.location.origin}${location.base}api/${key}`);

	Object.keys(data).forEach((key) => {
		url.searchParams.append(key, data[key]);
	});

	fetch(url.href).catch((error) => {
		console.error("There has been a problem with your fetch operation:", error);
	});
}

export function postToServer(endpoint: string, data?: Record<string, any>) {
	const url = new URL(
		`${window.location.origin}${location.base}api/${endpoint}`
	);

	return fetch(url, {
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		})
		.catch((error) => {
			console.error(
				"There has been a problem with your fetch operation:",
				error
			);
		});
}
