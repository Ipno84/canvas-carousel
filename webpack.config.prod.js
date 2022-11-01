const path = require('path');

module.exports = {
	mode: 'production',
	devtool: 'source-map',
	entry: {
		'canvas-carousel': './src/index.ts',
		'canvas-carousel.min': './src/index.ts'
	},
	output: {
		path: path.resolve(__dirname, '_bundles'),
		filename: '[name].js',
		libraryTarget: 'umd',
		library: 'canvas-carousel',
		umdNamedDefine: true
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	}
};
