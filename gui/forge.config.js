export default {
	packagerConfig: {
		name: "Deemix",
		asar: true,
		prune: false,
		ignore: [
			/^\/node_modules/,
			/^\/out/,
			/^\/src/,
			/^\/public/,
			/^\/scripts/,
			/^\/.gitignore/,
			/^\/forge.config.js/,
			/^\/tsconfig.json/,
		],
		icon: "./build/icon.ico",
	},
	rebuildConfig: {},
	makers: [
		{
			name: "@electron-forge/maker-squirrel",
			config: {},
		},
		{
			name: "@electron-forge/maker-zip",
			config: {},
		},
	],
	plugins: [
		{
			name: "@electron-forge/plugin-auto-unpack-natives",
			config: {},
		},
	],
};
