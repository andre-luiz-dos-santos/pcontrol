var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	entry: './app/index',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.coffee', '.js']
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.coffee$/,
				use: 'coffee-loader'
			},
			{
				test: /\.tsx?$/,
				loader: "awesome-typescript-loader"
			},
			{
				enforce: "pre",
				test: /\.js$/,
				loader: "source-map-loader"
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					}
				]
			},
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'PControl',
			template: 'index.html.ejs',
			hash: true
		}),
	]
}
