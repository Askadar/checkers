module.exports = {
	entry: './app/App.jsx',
	output: {
		path: 'public/',
		filename: 'bundle.js',
		publicPath: '//checkers/'
	},
	module: {
		loaders: [{
			test: /\.jsx?$/,
			exclude: / (node_modules | bower_components) /,
			loader: 'babel',
			query: {
				presets: ['es2016', 'react', 'latest', 'stage-2', 'es2015'],
				plugins: ['transform-object-rest-spread']
			}
		}]
	},
	devServer: {
		contentBase: 'public/',
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	cache: {}
};
