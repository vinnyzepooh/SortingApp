var coffee = require('gulp-coffee');
var lazypipe = require('lazypipe');
var sass = require('gulp-sass');
var less = require('gulp-less');
var gif = require('gulp-if');

var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});


function stringEndsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

// only run transforms against certain file types.
// This is only necessary if your bundle has a mix of file types in it
function isScssFile(file) {
    return stringEndsWith(file.relative, 'scss');
}

function isLessFile(file) {
    return stringEndsWith(file.relative, 'less');
}

var scriptTransforms = lazypipe()
    .pipe(coffee);

// pipe as many transforms together as you like
var styleTransforms = lazypipe()
    .pipe(function () {
        // when using lazy pipe you need to call gulp-if from within an anonymous func
        // https://github.com/robrich/gulp-if#works-great-inside-lazypipe
        return gif(isScssFile, sass());
    })
    .pipe(function () {
        return gif(isLessFile, less());
    });

module.exports = {
    bundle: {
        app: {
            scripts: [
                './src/**/*.js'
            ],
            styles: './src/**/*.scss',
            options: {
                uglify: false,
                order: {
                    scripts: [
                        '**/app.js'
                    ]
                },
                transforms: {
                    styles: styleTransforms
                }
            }
        },
        vendor: {
            scripts: [
                './bower_components/jquery/dist/jquery.js',
                './bower_components/jquery-ui/ui/jquery-ui.js',
                './bower_components/angular/angular.js',
                './bower_components/angular-ui-router/release/angular-ui-router.js',
                './bower_components/angular-animate/angular-animate.js',
                './bower_components/angular-aria/angular-aria.js',
                './bower_components/angular-material/angular-material.js',
                './bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js',
                './bower_components/angular-ui-tree/dist/angular-ui-tree.js',
                './bower_components/angular-resource/angular-resource.js',
                './bower_components/ngDraggable/ngDraggable.js'
                //'./bower_components/angular-ui-sortable/sortable.js'
            ],
            styles: [
                './bower_components/angular-material/angular-material.scss',
                './bower_components/angular-ui-tree/dist/angular-ui-tree.min.css'
            ],
            options: {
                uglify: false,
                order: {
                    scripts: [
                        'bower_components/jquery/dist/jquery.js',
                        'bower_components/jquery-ui/ui/jquery-ui.js',
                        'bower_components/angular/angular.js',
                        'bower_components/angular-animate/angular-animate.js',
                        'bower_components/angular-aria/angular-aria.js',
                        'bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js',
                        'bower_components/angular-resource/angular-resource.js',
                        'bower_components/ngDraggable/ngDraggable.js',
                        //'bower_components/angular-ui-sortable/sortable.js',
                        '*.js'
                    ]
                },
                transforms: {
                    styles: styleTransforms
                }
            }
        }
    },

    copy: [
        {
            src: [
                './src/**/*.html',
                './src/**/*.svg',
                './src/**/*.json',
                './src/**/*.gif',
                './src/**/*.png'
            ],
            base: './src',
            watch: true
        }
    ]
}
;