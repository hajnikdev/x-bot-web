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
		filename: 'article/' + articleCode + '.html',
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
	entry: ['./src/index.js', './src/styles/chatbots.scss', './src/styles/article.scss'],
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
		clientConfig('comap', 'SK', ['xella', 'viessmann'], false),
		clientConfig('viessmann', 'SK', ['comap', 'xella'], false),
		clientConfig('xella', 'SK', ['viessmann', 'onio'], false),
		clientConfig('onio', 'SK', ['xella', 'comap'], false),

		articleConfig('potencial-umelej-inteligencie-pre-podniky', 'SK', false),
		articleConfig('co-nam-hovoria-aktualne-trendy-o-robotizacii', 'SK', false),
		articleConfig('xolution-academy-pripravuje-studenty-it', 'SK', false),
		articleConfig('prve-miesto-v-microsoft-awards-2019', 'SK', false),
		articleConfig('nova-era-chatbotov', 'SK', false),
		articleConfig('trh-prace-v-roku-2025', 'SK', false),
		articleConfig('virtualny-agent-odpovie-na-otazku-lepsie', 'SK', false),
		articleConfig('5-dovodov-preco-zaviest-virtualneho-agenta', 'SK', false),
	],
};

exports.default = config;
