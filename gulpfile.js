var gulp = require('gulp');
var uglifyCss = require('gulp-clean-css');
var uglifyJs = require('gulp-uglify');
var pump = require('pump'); // useful for error handling with gulp-uglify
var es = require('event-stream');
var del = require('del');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();

gulp.task('clean-vendors', function(cb) {
	return del(['css/vendors', 'js/vendors'], {
		force: true
	}, cb);
});

gulp.task('clean-build', function(cb) {
	return del(['dist'], {
		force: true
	}, cb);
});

gulp.task('copy-vendors', function() {
	return es.merge(
		/*gulp.src('node_modules/jquery/dist/jquery.min.js')
			.pipe(gulp.dest('js/vendors/jquery')),*/
		gulp.src('node_modules/font-awesome/css/font-awesome.min.css')
			.pipe(gulp.dest('css/vendors/font-awesome/css')),
		gulp.src('node_modules/font-awesome/fonts/**.*')
			.pipe(gulp.dest('dist/fonts'))
	);
});

gulp.task('minify-css', function(cb) {
	pump(
		[
			gulp.src(['css/vendors/font-awesome/css/font-awesome.min.css', 'css/widget-app.css']),
			concat('widget-app.min.css'),
			gulp.dest('dist/css'),
			uglifyCss(),
			gulp.dest('dist/css')
		],
		cb
	);
});

gulp.task('minify-js', function(cb) {
	pump(
		[
			gulp.src('js/widget-app.js'),
			concat('widget-app.js'),
			rename('widget-app.min.js'),
			uglifyJs(),
			gulp.dest('dist/js')
		],
		cb
	);
});

gulp.task('build', function() {
	runSequence('clean-vendors', 'clean-build', 'copy-vendors', 'minify-css', 'minify-js', 'watch', function() {
		console.log('build - done!');
	});
});

gulp.task('clean-for-build', function() {
	runSequence('clean-vendors', 'clean-build', function() {
		console.log('clean for build - done!');
	});
});

gulp.task('build-app', function() {
	return runSequence('copy-vendors', 'minify-css', 'minify-js', function() {
		console.log('build app - done!');

	});
});

gulp.task('browserSync', function () {
	browserSync.init({
		open: false,
		browser: 'google chrome',
		server: {
			baseDir: './',
			index: 'index-build.html'
		},
		middleware: [
			{
				route: '/feedback',
				handle: function (req, res, next) {
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify({
						data: 'OK',
						status: 'success',
						authorize: true,
						messages: []
					}));
				}
			}
		],
		port: 8082
	});
});

gulp.task('watch', ['browserSync'], function(cb) {
	gulp.watch('js/**/*.js', ['minify-js']);
	gulp.watch('css/**/*.css', ['minify-css']);
	gulp.watch('*.html').on('change', browserSync.reload);
	gulp.watch('dist/js/**/*.js').on('change', browserSync.reload);
	gulp.watch('dist/css/**/*.css').on('change', browserSync.reload);
	cb();
});