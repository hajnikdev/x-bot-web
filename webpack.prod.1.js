var webpack = require('webpack'),
	path = require('path'),
	CopyWebpackPlugin = require('copy-webpack-plugin'),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	ReloadPlugin = require('reload-html-webpack-plugin');

var ExtractText = new ExtractTextPlugin({
	filename: '[name].[sha256:contenthash:hex:16].css'
});

var config = {
	// context: path.resolve(__dirname, './'),
	entry: [
		'./src/index.js',
		'./src/styles/chatbots.scss'
	],
	devServer: {
		host: '0.0.0.0',
		hot: true,
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
				use: ExtractText.extract({
					use: [
						{
							loader: 'css-loader',
							options: {
								minimize: true,
								url: false
							}
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: true
							}
						}
					]
				})
			},
			{
				test: /\.pug$/,
				include: path.join(__dirname, 'src/views'),
				loaders: ['pug-loader']
			}
		]
	},
	plugins: [
		ExtractText,
		new HtmlWebpackPlugin({
			inject: true,
			template: './src/views/index.pug',
			minify: false
		}),
		new CopyWebpackPlugin([
			{
				from: 'src/assets',
				to: 'assets'
			}
		]),
		new webpack.optimize.UglifyJsPlugin({
			minimize: true
		}),
	]
};

exports.default = config;