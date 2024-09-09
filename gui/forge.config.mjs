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
			name: "@electron-forge/maker-dmg",
			config: {
				bin: "Deemix",
			},
		},
		{
			name: "@electron-forge/maker-deb",
			config: {
				bin: "Deemix",
			},
		},
		{
			name: "@electron-forge/maker-rpm",
			config: {
				bin: "Deemix",
			},
		},
	],
	plugins: [
		{
			name: "@electron-forge/plugin-auto-unpack-natives",
			config: {},
		},
	],
};
