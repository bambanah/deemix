const path = require('path')
const webpack = require('webpack')
const NodemonPlugin = require('nodemon-webpack-plugin')

module.exports = env => {
	const isProduction = !!env.production
	const generateSourceMap = !!env.sourcemap
	let devtool = 'eval'
	if (isProduction) {
		devtool = generateSourceMap ? 'source-map' : false
	}
	const config = {
		mode: isProduction ? 'production' : 'development',
		entry: './src/index.ts',
		devtool,
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					use: 'ts-loader',
					exclude: /node_modules/
				}
			]
		},
		resolve: {
			extensions: ['.tsx', '.ts', '.js']
		},
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: 'app.js',
			sourceMapFilename: '[file].map',
			library: {
				name: 'DeemixServer',
				type: 'umd'
			}
		},
		target: 'node',
		plugins: [
			new NodemonPlugin(),
			new webpack.DefinePlugin({ 'global.GENTLY': false }),
			new webpack.ContextReplacementPlugin(/[/\\](express|keyv)[/\\]/, data => {
				delete data.dependencies[0].critical
				return data
			}),
			new webpack.ContextReplacementPlugin(/yargs/)
		]
	}

	return config
}
