module.exports = {
	entry: './app/App.jsx',
	output: {
		filename: 'bundle.js',
		publicPath: 'http://localhost:8080/checkers/'
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
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	cache: {}
};
