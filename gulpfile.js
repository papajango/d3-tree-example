'use strict';

var gulp = require('gulp'),
    cleanCSS = require('gulp-clean-css'),
    concatCss = require('gulp-concat-css'),
    minify = require('gulp-minify');

gulp.task('minify-css', function() {
    return gulp.src('*.css')
        .pipe(concatCss("styles.min.css"))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest('dist'));
});

gulp.task('minify-js', function() {
    gulp.src('script.js')
        .pipe(minify())
        .pipe(gulp.dest('dist'))
});
