import { readFileSync, writeFileSync } from "fs";

const pack = JSON.parse(readFileSync("package.json"));
pack.version = "0.0.0";

writeFileSync("package.json", JSON.stringify(pack, null, 2) + "\n");
