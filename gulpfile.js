var gulp = require('gulp');
var gutil = require('gulp-util');
var bundle = require('gulp-bundle-assets');
var runSequence = require('run-sequence');
var del = require('del');
var inject = require('gulp-inject');
var series = require('stream-series');
var ftp = require('vinyl-ftp');

var publishDir = 'out';

gulp.task('deploy', function () {

    var conn = ftp.create({
        host: '185.28.20.145',
        user: 'u193138375',
        password: '12345677__',
        parallel: 1,
        log: gutil.log
    });

    var globs = [
        'out/**'
    ];

    // using base = '.' will transfer everything to /public_html correctly
    // turn off buffering in gulp.src for best performance

    return gulp.src(globs, {buffer: false})
        .pipe(conn.newer('/public_html/SortingApp')) // only upload newer files
        .pipe(conn.dest('/public_html/SortingApp'));

});


gulp.task('clean', function () {
    del.sync(publishDir, {force: true}, function (err, paths) {
        console.log('Deleted files/folders:\n', paths.join('\n'));
    });
});

gulp.task('bundle', ['clean'], function () {
    return gulp.src('./bundle.config.js')
        .pipe(bundle())
        .pipe(gulp.dest(publishDir));
});

gulp.task('inject', function () {
    var target = gulp.src('./out/index.html');
    var vendorStream = gulp.src(['./out/**/vendor*.js', './out/**/vendor*.css'], {read: false});
    var appStream = gulp.src(['./out/**/app*.js', './out/**/app*.css'], {read: false});

    return target.pipe(inject(series(vendorStream, appStream), {relative: true}))
        .pipe(gulp.dest('./out'));
});

gulp.task('build', function (callback) {
    runSequence(
        'bundle',
        'inject',
        'deploy',
        callback);
});