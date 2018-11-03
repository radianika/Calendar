'use strict';

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	uglify = require('gulp-uglify'),
	autoprefixer = require('gulp-autoprefixer'),
	sourcemaps = require('gulp-sourcemaps'),
	browserSync = require("browser-sync"),
	babel = require('gulp-babel'),
	reload = browserSync.reload;;

var path = {
	build: {
		html: 'build/',
		js: 'build/js/',
		css: 'build/css/',
		img: 'build/images/',

	},
	src: {
		html: 'src/index.html',
		js: 'src/js/*.js',
		style: 'src/sass/main.scss',
		img: 'src/images/**/*.*',
	},
	watch: {
		html: 'src/**/*.html',
		js: 'src/js/**/*.js',
		style: 'src/sass/**/*.scss',
		css: 'src/sass/**/*.css',
		img: 'src/images/*.*',
	}

};


gulp.task('scripts', function () {
	gulp.src(path.src.js)
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(uglify())
		.pipe(gulp.dest(path.build.js));
});


gulp.task('html', function () {
	gulp.src(path.src.html)
		.pipe(gulp.dest(path.build.html));
});


gulp.task('styles', function () {
	gulp.src(path.src.style)
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.css));
});

gulp.task('images', function () {
	gulp.src(path.src.img)
		.pipe(gulp.dest(path.build.img));
});


gulp.task('browser-sync', function () {
	browserSync({
		server: {
			baseDir: 'build'
		},
		notify: false
	});
});
gulp.task('build', ['scripts', 'html', 'styles', 'images', 'browser-sync']);

gulp.task('watch', function () {
	gulp.watch(path.watch.style, ['styles']);
	gulp.watch(path.watch.css, ['styles']);
	gulp.watch(path.watch.html, ['html']);
	gulp.watch(path.watch.img, ['images']);
	gulp.watch(path.watch.js, ['scripts']);
	gulp.watch(path.watch.html, browserSync.reload);
	gulp.watch(path.watch.style, browserSync.reload);
	gulp.watch(path.watch.js, browserSync.reload);
});

gulp.task('default', ['build', 'watch']);
