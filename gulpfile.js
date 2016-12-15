const gulp = require('gulp');
const sass = require('gulp-sass');
const del = require('del');
// const babel = require('gulp-babel');
const webpack = require('webpack-stream');
const nodemon = require('gulp-nodemon');
const autoprefixer = require('gulp-autoprefixer');

const paths = {
	sass: './app/sass/**/*.sass',
	sassMain: './app/sass/style.sass',
	del: { sass: './public/style.css', js: './public/bundle.js' },
	webpack: ['./app/App.jsx', './app/**/*.jsx']
};

gulp.task('default', ['clean', 'sass', 'webpack']);

gulp.task('clean', () => {
	del([paths.del.js, paths.del.sass]);
});
// gulp.task('babel', () => {
// 	gulp.src(paths.webpack[1])
// 		.pipe(babel({
// 			presets: ['es2016', 'react', 'latest', 'stage-2', 'es2015'],
// 			plugins: ['transform-object-rest-spread']
// 		}))
// 		.pipe(gulp.dest('./app/built'));
// });

gulp.task('webpack', () => {
	del(paths.del.js).then(() => {
		gulp.src(paths.webpack[0])
			.pipe(webpack(require('./webpack.config.js')))
			.pipe(gulp.dest('public/'));
	});
});

gulp.task('sass', () => {
	del(['public/style.css']).then(() => {
		gulp.src(paths.sassMain)
			.pipe(sass({ includePaths: ['./node_modules/bootstrap-sass/assets/stylesheets'] }).on('error', sass.logError))
			.pipe(autoprefixer())
			.pipe(gulp.dest('public/'));
	});
});

gulp.task('watch', () => {
	gulp.watch(paths.sass, ['sass']);
	// gulp.watch(paths.webpack[1], ['webpack']);
});

gulp.task('watch-node', ['watch'], () => {
	nodemon({
		script: './ws/index.js'
	});
});
