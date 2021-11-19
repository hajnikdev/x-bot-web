var webpack = require('webpack'),
	path = require('path'),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	MiniCSSExtractPlugin = require('mini-css-extract-plugin'),

var devMode = process.env.NODE_ENV !== 'production';

function clientConfig(clientCode, lang, navigation, isDefault) {
	return new HtmlWebpackPlugin({
		inject: false,
		template: './src/views/portfolio.pug',
		filename: 'clients/' + clientCode + '.html',
		minify: false,
		options: {
			local: require('./src/localization/czech.json'),
			client: require('./src/clients/' + clientCode + '/' + lang + '.json'),
			clientCode: clientCode,
			navigation: navigation,
			isDefault: isDefault,
			languages: ['SK', 'CS', 'EN'].sort((a, b) => a === lang ? -1 : 1)
		}
	});
}

var config = {
	entry: [
		'./src/index.js',
		'./src/styles/chatbots.scss'
	],
	devServer: {
		host: '0.0.0.0',
		// hot: true,
		inline: true,
		contentBase: './src/'
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'chatbots.js'
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [MiniCSSExtractPlugin.loader, 'css-loader', 'sass-loader']
			},
			{
				test: /\.pug$/,
				include: path.join(__dirname, 'src/views'),
				use: {
					loader: 'pug-loader',
					options: {}
				}
			}
		]
	},
	plugins: [
		new MiniCSSExtractPlugin({
			filename: devMode ? '[name].css' : '[name].[hash].css',
			chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
		}),
		new HtmlWebpackPlugin({
			inject: false,
			template: './src/views/index.pug',
			minify: false,
			options: {
				local: require('./src/localization/english.json'),
				isDefault: true,
				languages: ['SK', 'CS', 'EN'].sort((a, b) => a === 'CS' ? -1 : 1)
			}
		}),
		clientConfig('comap', 'CS', ['prbot', 'viessmann'], true),
		clientConfig('viessmann', 'CS', ['comap', 'prbot'], false),
		clientConfig('prbot', 'CS', ['viessmann', 'comap'], false),
	]
};

exports.default = config;
