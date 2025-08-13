/* eslint-disable no-console */
async function loadLang(lang_id) {
	let language_module;
	const result = [];
	try {
		language_module = await import(`../lang/${lang_id}.mjs`);
		language_module = language_module.default;
	} catch {
		language_module = {};
	}
	function parseObject(obj, root = "") {
		for (const [key, value] of Object.entries(obj)) {
			if (typeof value === "string") {
				result.push(root + key);
			} else {
				parseObject(value, root + key + ".");
			}
		}
	}
	parseObject(language_module);
	return result;
}

async function testLang(lang_id) {
	const baseLangFile = await loadLang("en");
	const comparedLangFile = await loadLang(lang_id);

	if (comparedLangFile.length === 0) {
		console.log(`Language file ${lang_id} doesn't exist!`);
		return;
	}

	console.log("\nMissing Keys:");
	baseLangFile.forEach((key) => {
		if (!comparedLangFile.includes(key)) console.log(key);
	});

	console.log("\nExtra Keys:");
	comparedLangFile.forEach((key) => {
		if (!baseLangFile.includes(key)) console.log(key);
	});
}

(async () => {
	const args = process.argv.slice(2);
	if (args.length !== 1) {
		console.log("Usage:\nyarn testlang [COUNTRY_ID]\n");
		return;
	}
	console.log(`Testing language file ${args[0]}`);
	await testLang(args[0]);
	console.log("");
})();
