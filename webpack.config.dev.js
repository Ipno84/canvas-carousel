const path = require('path');

module.exports = {
	mode: 'development',
	devtool: 'inline-source-map',
	entry: './src/start.ts',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/assets/'
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	devServer: {
		static: {
			directory: path.join(__dirname, 'public'),
			serveIndex: true,
			watch: true
		},
		client: {
			progress: true,
			overlay: {
				errors: true,
				warnings: false
			}
		},
		compress: true,
		liveReload: true,
		historyApiFallback: true,
		hot: true,
		https: false,
		port: 8080,
		open: true
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
