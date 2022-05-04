var path = require('path'),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	MiniCSSExtractPlugin = require('mini-css-extract-plugin');

var devMode = process.env.NODE_ENV !== 'production';

const clientConfig = (clientCode, lang, navigation, isDefault) => {
	return new HtmlWebpackPlugin({
		inject: false,
		template: './src/views/portfolio.pug',
		filename: lang + '/clients/' + clientCode + '.html',
		minify: false,
		options: {
			local: require('./src/localization/czech.json'),
			client: require('./src/clients/' + clientCode + '/' + lang + '.json'),
			clientCode: clientCode,
			navigation: navigation,
			isDefault: isDefault,
			languages: ['SK', 'CS', 'EN'].sort((a, b) => (a === lang ? -1 : 1)),
		},
	});
}

const articleConfig = (articleCode, lang, isDefault) => {
	return new HtmlWebpackPlugin({
		inject: false,
		template: './src/views/article.pug',
		filename: 'blog/' + articleCode + '.html',
		minify: false,
		options: {
			local: require('./src/localization/slovak.json'),
			article: require('./src/articles/' + articleCode + '/' + lang + '.json'),
			articleCode: articleCode,
			isDefault: isDefault,
			languages: ['SK', 'CS', /*'EN'*/].sort((a, b) => (a === lang ? -1 : 1)),
		},
	});
}

var config = {
	entry: ['./src/index.js', './src/styles/chatbots.scss', './src/styles/article.scss', './src/styles/cookieConset.scss'],
	devServer: {
		host: '0.0.0.0',
		inline: true,
		contentBase: './src/',
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'chatbots.js',
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [MiniCSSExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
			{
				test: /\.pug$/,
				include: path.join(__dirname, 'src/views'),
				use: {
					loader: 'pug-loader',
					options: {},
				},
			},
		],
	},
	plugins: [
		new MiniCSSExtractPlugin({
			filename: devMode ? '[name].css' : '[name].[hash].css',
			chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
		}),
		new HtmlWebpackPlugin({
			inject: false,
			template: './src/views/index.pug',
			minify: false,
			options: {
				local: require('./src/localization/slovak.json'),
				isDefault: false,
				languages: ['SK', 'CS', 'EN'].sort((a, b) => (a === 'SK' ? -1 : 1)),
			},
		}),

		new HtmlWebpackPlugin({
			inject: false,
			template: './src/views/gdpr.pug',
			filename: 'gdpr.html',
			minify: false,
			options: {
				local: require('./src/localization/slovak.json'),
				isDefault: false,
				languages: ['SK', 'CS', 'EN'].sort((a, b) => (a === 'SK' ? -1 : 1)),
			},
		}),

		new HtmlWebpackPlugin({
			inject: false,
			template: './src/views/requestsent.pug',
			filename: 'requestsent.html',
			minify: false,
			options: {
				local: require('./src/localization/slovak.json'),
				isDefault: false,
				languages: ['SK', 'CS', 'EN'].sort((a, b) => (a === 'SK' ? -1 : 1)),
			},
		}),

		clientConfig('comap', 'CS', ['xella', 'viessmann'], false),
		clientConfig('viessmann', 'CS', ['comap', 'xella'], false),
		clientConfig('xella', 'CS', ['viessmann', 'onio'], false),
		clientConfig('onio', 'CS', ['xella', 'mastersport'], false),
		clientConfig('mastersport', 'CS', ['onio', 'comap'], false),

		new HtmlWebpackPlugin({
			inject: false,
			template: './src/views/articles.pug',
			filename: 'blog.html',
			minify: false,
			options: {
				local: require('./src/localization/slovak.json'),
				isDefault: false,
				languages: ['SK', 'CS', /*'EN'*/].sort((a, b) => (a === 'SK' ? -1 : 1)),
			},
		}),

		articleConfig('article-1', 'SK', false),
		articleConfig('article-2', 'SK', false),
		articleConfig('article-3', 'SK', false),
		articleConfig('article-4', 'SK', false),
		articleConfig('article-5', 'SK', false),
		articleConfig('article-6', 'SK', false),
		articleConfig('article-7', 'SK', false),
		articleConfig('article-8', 'SK', false),
	],
};

exports.default = config;
