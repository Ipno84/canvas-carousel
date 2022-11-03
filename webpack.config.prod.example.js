const config = require('./webpack.config.prod.common');
const path = require('path');

module.exports = Object.assign(config, {
	entry: { 'canvas-carousel': './src/start.ts' },
	output: {
		path: path.resolve(__dirname, 'serve/js'),
		filename: '[name].min.js',
		libraryTarget: 'umd',
		library: 'canvas-carousel',
	},
	optimization: {
		minimize: true
	}
});
