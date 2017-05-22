var gulp = require('gulp');
var sass = require('gulp-sass');
var importer = require('sass-importer-npm');
var cssImporter = require('node-sass-css-importer')({
	import_paths: ['node_modules']
});
var bulkSass = require('gulp-sass-bulk-import');
var rollup = require('gulp-rollup');
var buble = require('rollup-plugin-buble');
var nodeResolve = require('rollup-plugin-node-resolve');
var customPaths = require('rollup-plugin-includepaths');
var bs = require('browser-sync');
var autoprefix = require('gulp-autoprefixer');
var jsonSass = require('gulp-json-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var merge = require('merge-stream');
var debug = require('gulp-debug');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var commonjs = require('rollup-plugin-commonjs');

var config = require('./gulp.config.json');

var includePaths = {
	paths: ['src/js'],
	extensions: ['.js']
}

gulp.task('sass', function() {
	return gulp.src(config.src.styles.app)
		.pipe(debug({
			title: 'Processing'
		}))
		.pipe(bulkSass())
		.pipe(sass({
			importer: [cssImporter, importer],
			includePaths: ['src/scss']
		}))
		.pipe(gulp.dest(config.dist.build))
		.pipe(bs.stream())
		.pipe(debug({
			title: 'Compiled'
		}))
});

gulp.task('sass-build', ['sass'], function() {
	return gulp.src(config.dist.build + '/application.css')
		.pipe(autoprefixer({
			browsers: ['> 1%', 'IE 10']
		}))
		.pipe(cssnano())
		.pipe(gulp.dest(config.dist.build));
});


gulp.task('js', function() {
	return gulp.src(config.src.js.app)
		.pipe(debug({
			title: 'Processing'
		}))
		.pipe(rollup({
			plugins: [
				customPaths(includePaths),
				nodeResolve({ jsnext: true, main: true }),
				buble()
			]
		}))
		.pipe(gulp.dest(config.dist.build))
		.pipe(bs.stream())
		.pipe(debug({
			title: 'Transpiled'
		}))
});

gulp.task('watch', ['sass', 'js'], function() {
	gulp.watch([config.src.styles.root + '/*.scss'], ['sass']);
	gulp.watch([config.src.js.root + '/*.js', config.src.js.root + '/utils/*.js'], ['js']);
});

gulp.task('serve', ['watch', 'build'], function() {
	bs.init({
		server: {
			baseDir: "./"
		}
	});
});

gulp.task('build-js', ['js'], function() {
	return gulp.src(config.dist.build + '/application.js')
		.pipe(plumber(function(err) {
			gutil.log(err, gutil.colors.magenta('123'));
			this.emit('end');
		}))
		.pipe(uglify())
		.pipe(gulp.dest(config.dist.build));
});

gulp.task('build', ['sass-build', 'build-js']);
