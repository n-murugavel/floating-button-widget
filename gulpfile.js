var gulp = require('gulp');
var es = require('event-stream');
var del = require('del');
gulp.task('clean-vendors', function(cb) {
	return del(['css/vendors', 'js/vendors'], {
		force: true
	}, cb);
});
gulp.task('copy-vendors', ['clean-vendors'], function() {
	return es.concat(
		gulp.src('node_modules/jquery/dist/jquery.min.js')
			.pipe(gulp.dest('js/vendors/jquery')),
		gulp.src('node_modules/font-awesome/css/font-awesome.min.css')
			.pipe(gulp.dest('css/vendors/font-awesome/css')),
		gulp.src('node_modules/font-awesome/fonts/**.*')
			.pipe(gulp.dest('css/vendors/font-awesome/fonts'))
	);
});