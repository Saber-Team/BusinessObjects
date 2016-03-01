/**
 * @author jinwei01
 * @file gulpfile
 */
var gulp         = require('gulp')
var less         = require('gulp-less')
var comb         = require('gulp-csscomb')
var autoprefixer = require('gulp-autoprefixer')
var plumber      = require('gulp-plumber')
var notify       = require('gulp-notify')

// autoprefixer conf
var autoprefixerConf = {
    browsers: ['ie >= 9', 'chrome > 30', 'Safari >= 6', 'ff >= 30', 'last 2 versions']
}

// static dir
var srcDir  = 'src/'
var distDir = 'dist/'

// glob pattens
var pattens = {
    'less': [
        srcDir + '**/*.less'
    ]
}

// build css
gulp.task('build-css', function () {
    return gulp.src(pattens.less)
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(less())
        .pipe(autoprefixer(autoprefixerConf))
        .pipe(comb())
        .pipe(gulp.dest(distDir))
})

// watch css
gulp.task('watch-css', ['build-css'], function () {
    gulp.watch(pattens.less, ['build-css'])
})

gulp.task('watch', ['watch-css'], function () {})
