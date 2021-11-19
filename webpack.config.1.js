var webpack = require('webpack'),
	path = require('path'),
	CopyWebpackPlugin = require('copy-webpack-plugin'),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	ReloadPlugin = require('reload-html-webpack-plugin');

var ExtractText = new ExtractTextPlugin({
	filename: '[name].[sha256:contenthash:hex:16].css',
	// disable: process.env.NODE_ENV === 'production'
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
								/*modules: true,
								sourceMap: true,
								localIdentName: '[path][name]__[local]--[hash:base64:5]'*/
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
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			inject: true,
			template: './src/views/index.pug',
			minify: false
		}),
		new ReloadPlugin(),
		/*new CopyWebpackPlugin([
			{
				from: 'src/assets'
			}
		])*/
	]
};

exports.default = config;