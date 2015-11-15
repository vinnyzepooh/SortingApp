var gulp = require('gulp');
var gutil = require('gulp-util');
var bundle = require('gulp-bundle-assets');
var runSequence = require('run-sequence');
var del = require('del');
var inject = require('gulp-inject');
var series = require('stream-series');

var publishDir = '../backend/src/main/webapp';

gulp.task('clean', function () {
    del.sync([publishDir + "/**/*.js", publishDir + "/**/*.css", publishDir + "/**/*.map", publishDir + "/**/*.html"], {force: true}, function (err, paths) {
        console.log('Deleted files/folders:\n', paths.join('\n'));
    });
});

gulp.task('bundle', ['clean'], function () {
    return gulp.src('./bundle.config.js')
        .pipe(bundle())
        .pipe(gulp.dest(publishDir));
});

gulp.task('inject', function () {
    var target = gulp.src(publishDir + '/index.html');
    var vendorStream = gulp.src([publishDir + '/**/vendor*.js', publishDir + '/**/vendor*.css'], {read: false});
    var appStream = gulp.src([publishDir + '/**/app*.js', publishDir + '/**/app*.css'], {read: false});

    return target.pipe(inject(series(vendorStream, appStream), {relative: true}))
        .pipe(gulp.dest(publishDir));
});

gulp.task('build', function (callback) {
    runSequence(
        'bundle',
        'inject',
        callback);
});