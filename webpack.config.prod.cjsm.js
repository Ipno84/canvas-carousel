const config = require('./webpack.config.prod.common');
const path = require('path');

module.exports = Object.assign(config, {
	output: {
		path: path.resolve(__dirname, '_bundles'),
		filename: '[name].cjsm.js',
		libraryTarget: 'commonjs-module',
		library: 'canvas-carousel',
	},
	optimization: {
		minimize: false
	}
});
