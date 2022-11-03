const config = require('./webpack.config.prod.common');
const path = require('path');

module.exports = Object.assign(config, {
	output: {
		path: path.resolve(__dirname, '_bundles'),
		filename: '[name].umd.js',
		libraryTarget: 'umd',
		library: 'canvas-carousel',
		umdNamedDefine: true
	},
	optimization: {
		minimize: false
	}
});
