var gulp = require('gulp');
var uglifyCss = require('gulp-clean-css');
var uglifyJs = require('gulp-uglify');
var pump = require('pump'); // useful for error handling with gulp-uglify
var es = require('event-stream');
var del = require('del');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

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
	runSequence('clean-vendors', 'clean-build', 'copy-vendors', 'minify-css', 'minify-js', function() {
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