var webpack = require('webpack'),
	path = require('path'),
	CopyWebpackPlugin = require('copy-webpack-plugin'),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	MiniCSSExtractPlugin = require('mini-css-extract-plugin'),
	ReloadPlugin = require('reload-html-webpack-plugin'),
	UglifyJsPlugin = require('uglifyjs-webpack-plugin'),
	OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

var languages = {
	CS: 'czech.json',
	EN: 'english.json',
	SK: 'slovak.json',
};

var languagesKeys = Object.keys(languages);
console.log(languagesKeys);

var devMode = process.env.NODE_ENV !== 'production';

function htmlConfig(local, localCode, isDefault) {
	return {
		inject: false,
		template: './src/views/index.pug',
		filename: isDefault ? 'index.html' : localCode + '/' + 'index.html',
		minify: true,
		options: {
			local: require('./src/localization/' + local),
			isDefault: isDefault,
			languages: Object.keys(languages).sort((a, b) => (a === localCode ? -1 : 1)),
		},
	};
}

function clientConfig(clientCode, localCode, navigation, isDefault) {
	var sortedLangs = Object.keys(languages).sort((a, b) => (a === localCode ? -1 : 1));
	console.log(localCode + ' - ' + sortedLangs.join(';'));
	return new HtmlWebpackPlugin({
		inject: false,
		template: './src/views/portfolio.pug',
		filename: (isDefault ? '' : localCode + '/') + 'clients/' + clientCode + '.html',
		minify: false,
		options: {
			local: require('./src/localization/' + languages[localCode]),
			client: require('./src/clients/' + clientCode + '/' + localCode + '.json'),
			clientCode: clientCode,
			navigation: navigation,
			isDefault: isDefault,
			languages: Object.keys(languages).sort((a, b) => (a === localCode ? -1 : 1)),
		},
	});
}

var pugLoader = {
	test: /\.pug$/,
	include: path.join(__dirname, 'src/views'),
	use: {
		loader: 'pug-loader',
		options: {},
	},
};

var config = [
	{
		// context: path.resolve(__dirname, './'),
		entry: ['./src/index.js', './src/styles/chatbots.scss'],
		optimization: {
			minimizer: [
				new UglifyJsPlugin({
					cache: true,
					parallel: true,
					sourceMap: false, // set to true if you want JS source maps
				}),
				new OptimizeCSSAssetsPlugin({}),
			],
		},
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: 'chatbots.js',
		},
		module: {
			rules: [
				pugLoader,
				{
					test: /\.scss$/,
					use: [MiniCSSExtractPlugin.loader, 'css-loader', 'sass-loader'], // resolve-url-loader
				},
			],
		},
		plugins: [
			new MiniCSSExtractPlugin({
				filename: devMode ? '[name].css' : '[name].[hash].css',
				chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
			}),
			new CopyWebpackPlugin([
				{
					from: 'src/assets',
					to: 'assets',
				},
			]),
			new webpack.optimize.ModuleConcatenationPlugin(),

			new HtmlWebpackPlugin(htmlConfig(languages['SK'], 'SK', true)),
			clientConfig('comap', 'SK', ['onio', 'viessmann'], true),
			clientConfig('viessmann', 'SK', ['comap', 'xella'], false),
			clientConfig('xella', 'SK', ['viessmann', 'onio'], false),
			clientConfig('onio', 'SK', ['xella', 'comap'], false),
		],
	},
].concat(
	Object.keys(languages).map(function(l) {
		return {
			output: {
				path: path.resolve(__dirname, 'dist'),
				filename: 'chatbots.js',
			},
			module: {
				rules: [pugLoader],
			},
			plugins: [
				new HtmlWebpackPlugin(htmlConfig(languages[l], l, false)),
				clientConfig('comap', l, ['onio', 'viessmann'], false),
				clientConfig('viessmann', l, ['comap', 'xella'], false),
				clientConfig('xella', l, ['viessmann', 'onio'], false),
				clientConfig('onio', l, ['xella', 'comap'], false),
			],
		};
	})
);

exports.default = config;
