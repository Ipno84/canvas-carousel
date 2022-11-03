const path = require('path');

module.exports = {
	entry: { 'canvas-carousel': './src/index.ts' },
	mode: 'production',
	devtool: 'source-map',
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
