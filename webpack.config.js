module.exports = {
	entry: './app/App',
	output: {
		path: 'public/',
		filename: 'bundle.js',
		publicPath: '//checkers/',
	},
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM',
		rxjs: 'Rx',
		'rxjs/Rx': 'Rx'
	},
	module: {
		rules: [{
			test: /\.jsx?$/,
			exclude: / (node_modules | bower_components) /,
			use: [{
				loader: 'babel-loader',
				options: {
					presets: ['es2016', 'react', 'latest', 'stage-2', 'es2015'],
					plugins: ['transform-object-rest-spread']
				}
			}]
		}]
	},
	devServer: {
		contentBase: 'public/',
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	cache: {}
};
