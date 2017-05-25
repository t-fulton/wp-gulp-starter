var gulp = require('gulp'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync').create(),
	useref = require('gulp-useref'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	gulpIf = require('gulp-if'),
	cssnano = require('gulp-cssnano'),
	imagemin = require('gulp-imagemin'),
	cache = require('gulp-cache'),
	del = require('del'),
	runSequence = require('run-sequence');

// SASS
gulp.task('sass', function() {
  return gulp.src('lib/scss/style.scss') 
    .pipe(sass())
    .pipe(gulp.dest('./'))
    pipe(browserSync.reload({
    	stream:true
    }))
})

// Scripts
gulp.task('scripts', function() {
	return gulp.src([
			'./lib/js/vendor/jquery-3.2.1.min.js', 
			'./lib/js/custom/*.js'
		])
		.pipe(concat('app.js'))
		.pipe(gulp.dest('./lib/js'));
})

// BrowserSync
gulp.task('browserSync', function() {
	browserSync.init({
		proxy: 'http://localhost:8888/'
	})
})

// Watch
gulp.task('watch', ['browserSync', 'sass', 'scripts'], function(){
	gulp.watch('lib/scss/**/*.scss', ['sass']).on('change', browserSync.reload);
	gulp.watch('template-parts/**/*.php', browserSync.reload);
	gulp.watch('lib/js/**/*.js', ['scripts']).on('change', browserSync.reload);
})