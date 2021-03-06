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

function gdprConfig(localCode, isDefault) {
	return new HtmlWebpackPlugin({
		inject: false,
		template: './src/views/gdpr.pug',
		filename: (isDefault ? '' : localCode + '/') + 'gdpr.html',
		minify: false,
		options: {
			local: require('./src/localization/' + languages[localCode]),
			isDefault: isDefault,
			languages: Object.keys(languages)
				.sort((a, b) => (a === localCode ? -1 : 1)),
		},
	});
}

function requestsentConfig(localCode, isDefault) {
	return new HtmlWebpackPlugin({
		inject: false,
		template: './src/views/requestsent.pug',
		filename: (isDefault ? '' : localCode + '/') + 'requestsent.html',
		minify: false,
		options: {
			local: require('./src/localization/' + languages[localCode]),
			isDefault: isDefault,
			languages: Object.keys(languages)
				.sort((a, b) => (a === localCode ? -1 : 1)),
		},
	});
}

function clientConfig(clientCode, localCode, navigation, isDefault) {
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

function articlesConfig(localCode, isDefault) {
	return new HtmlWebpackPlugin({
		inject: false,
		template: './src/views/articles.pug',
		filename: (isDefault ? '' : localCode + '/') + 'blog.html',
		minify: false,
		options: {
			local: require('./src/localization/' + languages[localCode]),
			isDefault: isDefault,
			languages: Object.keys(languages)
				.filter((a) => a !== 'EN')
				.sort((a, b) => (a === localCode ? -1 : 1)),
		},
	});
}

const blogConfig = (articleCode, localCode, isDefault) => {
	return new HtmlWebpackPlugin({
		inject: false,
		template: './src/views/article.pug',
		filename: (isDefault ? '' : localCode + '/') + 'blog/' + articleCode + '.html',
		minify: false,
		options: {
			local: require('./src/localization/' + languages[localCode]),
			article: require('./src/articles/' + articleCode + '/' + localCode + '.json'),
			articleCode: articleCode,
			isDefault: isDefault,
			languages: Object.keys(languages)
				.filter((a) => a !== 'EN')
				.sort((a, b) => (a === localCode ? -1 : 1)),
		},
	});
};

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
		entry: ['./src/index.js', './src/styles/chatbots.scss', './src/styles/article.scss', './src/styles/cookieConset.scss'],
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
				{
					from: 'public',
					to: path.resolve(__dirname, 'dist'),
				},
				{
					from: 'public/CS',
					to: path.resolve(__dirname, 'dist/CS'),
				},
				{
					from: 'public/php',
					to: path.resolve(__dirname, 'dist/SK/php'),
				},
				{
					from: 'public/php',
					to: path.resolve(__dirname, 'dist/CS/php'),
				},
				{
					from: 'public/php',
					to: path.resolve(__dirname, 'dist/EN/php'),
				},
			]),

			new webpack.optimize.ModuleConcatenationPlugin(),

			new HtmlWebpackPlugin(htmlConfig(languages['SK'], 'SK', true)),

			gdprConfig('SK', true),
			requestsentConfig('SK', true),

			clientConfig('comap', 'SK', ['onio', 'viessmann'], true),
			clientConfig('viessmann', 'SK', ['comap', 'xella'], true),
			clientConfig('xella', 'SK', ['viessmann', 'onio'], true),
			clientConfig('onio', 'SK', ['xella', 'mastersport'], true),
			clientConfig('mastersport', 'SK', ['onio', 'comap'], true),

			articlesConfig('SK', true),
			blogConfig('article-1', 'SK', true),
			blogConfig('article-2', 'SK', true),
			blogConfig('article-3', 'SK', true),
			blogConfig('article-4', 'SK', true),
			blogConfig('article-5', 'SK', true),
			blogConfig('article-6', 'SK', true),
			blogConfig('article-7', 'SK', true),
			blogConfig('article-8', 'SK', true),
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

				gdprConfig(l, false),
				requestsentConfig(l, false),

				clientConfig('comap', l, ['onio', 'viessmann'], false),
				clientConfig('viessmann', l, ['comap', 'xella'], false),
				clientConfig('xella', l, ['viessmann', 'onio'], false),
				clientConfig('onio', l, ['xella', 'mastersport'], false),
				clientConfig('mastersport', l, ['onio', 'comap'], false),

				articlesConfig(l, false),
				blogConfig('article-1', l, false),
				blogConfig('article-2', l, false),
				blogConfig('article-3', l, false),
				blogConfig('article-4', l, false),
				blogConfig('article-5', l, false),
				blogConfig('article-6', l, false),
				blogConfig('article-7', l, false),
				blogConfig('article-8', l, false),

			],
		};
	})
);

exports.default = config;
