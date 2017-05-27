var gulp = require('gulp'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync').create(),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	gulpIf = require('gulp-if'),
	autoprefix = require('gulp-autoprefixer'),
	cssnano = require('gulp-cssnano'),
	sourcemaps = require('gulp-sourcemaps'),
	imagemin = require('gulp-imagemin'),
	cache = require('gulp-cache'),
	del = require('del'),
	runSequence = require('run-sequence');

// SASS
gulp.task('sass', function() {
  	return gulp.src('lib/scss/style.scss') 
  		.pipe(sourcemaps.init())
		    .pipe(sass())
		    .pipe(autoprefix())
		    .pipe(cssnano())
		.pipe(sourcemaps.write())
	    .pipe(gulp.dest('./'))
	    .pipe(browserSync.reload({
	    	stream:true
    }))
})

// Scripts
gulp.task('scripts', function() {
	return gulp.src([
			'./lib/js/vendor/jquery-3.2.1.min.js', 
			'./lib/js/custom/*.js'
		])
		.pipe(sourcemaps.init())
			// Enqueued in functions.php 
			.pipe(concat('app.js'))
			// Minify JS
			.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./lib/js'));
})

// Minify Images
gulp.task('images', function() {
	return gulp.src('lib/images/**/*.+(png|jpg|gif|svg)')
		// Caching images that ran through imagemin
		.pipe(cache(imagemin({
			interlaced: true
		})))
		.pipe(gulp.dest('./dist/images'))
});

// Delete dist folder
gulp.task('clean:dist', function() {
	return del.sync('dist');
});

// BrowserSync
gulp.task('browserSync', function() {
	browserSync.init({
		proxy: 'http://localhost:8888/'
	})
})

// Build
gulp.task('build', function(callback) {
	runSequence('clean:dist',
		['sass', 'scripts', 'images'],
		callback
	)
});

// Watch TODO: app.js is looping, need to watch for js changes but not watch the file that ultimately gets created
gulp.task('watch', ['browserSync', 'sass', 'scripts'], function(){
	gulp.watch('lib/scss/**/*.scss', ['sass']).on('change', browserSync.reload);
	gulp.watch('template-parts/**/*.php', browserSync.reload);
	gulp.watch('lib/js/**/*.js', ['scripts']).on('change', browserSync.reload);
})