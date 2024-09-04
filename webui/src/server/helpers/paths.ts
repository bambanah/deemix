import path from "path";
import { fileURLToPath } from "node:url";

export const ROOT_DIR = path.resolve(
	path.join(fileURLToPath(import.meta.url), "..", "..", "..", "..")
);
export const WEBUI_PACKAGE = path.join(ROOT_DIR, "package.json");
