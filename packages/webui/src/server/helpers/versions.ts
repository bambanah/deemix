import deemixPackage from "deemix/package.json" with { type: "json" };
import { version } from "./web-version.js";

export const DEEMIX_PACKAGE_VERSION = deemixPackage.version;
export const WEBUI_PACKAGE_VERSION = version;
export const GUI_VERSION = process.env.GUI_VERSION || undefined;
