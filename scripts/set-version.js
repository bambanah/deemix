const fs = require("fs");
const generateVersion = require("./gen-version.js");

const pack = JSON.parse(fs.readFileSync("package.json"));
pack.version = generateVersion();
fs.writeFileSync("package.json", JSON.stringify(pack, null, 2) + "\n");
