import type { Application } from "express";
import type { ApiHandler } from "../../types.js";
import getEndpoints from "./get/index.js";
import deleteEndpoints from "./delete/index.js";
import postEndpoints from "./post/index.js";
import patchEndpoints from "./patch/index.js";

const prependApiPath = (path: string) => `*/api${path}`;

interface Method {
	method: string;
	endpoints: ApiHandler[];
}

const methods: Method[] = [
	{
		method: "get",
		endpoints: getEndpoints,
	},
	{
		method: "delete",
		endpoints: deleteEndpoints,
	},
	{
		method: "post",
		endpoints: postEndpoints,
	},
	{
		method: "patch",
		endpoints: patchEndpoints,
	},
];

export function registerApis(app: Application) {
	methods.forEach(({ method, endpoints }) => {
		endpoints.forEach((endpoint) => {
			app[method](prependApiPath(endpoint.path), endpoint.handler);
		});
	});
}
