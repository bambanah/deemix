export default {
	packagerConfig: {
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
			platforms: ["darwin"],
		},
		{
			name: "@electron-forge/maker-deb",
			config: {},
		},
		{
			name: "@electron-forge/maker-rpm",
			config: {},
		},
	],
	plugins: [],
};
