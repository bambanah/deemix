import path from "path";

export const ROOT_DIR = path.resolve(path.join(__dirname, "..", ".."));
export const WEBUI_DIR = path.join(ROOT_DIR, "webui", "public");
export const GUI_PACKAGE = path.join(ROOT_DIR, "package.json");
