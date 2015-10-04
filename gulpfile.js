/// <reference path="typings/tsd.d.ts" />
var gulp = require('gulp');
var tslint = require('gulp-tslint');
gulp.task('coding-standards', function () {
    return gulp.src([
        '**/*.ts',
        '!node_modules/**/*'
    ])
        .pipe(tslint());
});
var tsc = require('gulp-typescript');
gulp.task('build', function () {
    return gulp.src([
        'src/**/*.ts'
    ])
        .pipe(tsc({
        out: 'resource.js',
        emitDecoratorMetadata: true
    }))
        .pipe(gulp.dest('dest'));
});
gulp.task('build:test', function () {
    return gulp.src([
        'tests/**/*.ts'
    ])
        .pipe(tsc({
        out: 'resource.spec.js',
        emitDecoratorMetadata: true
    }))
        .pipe(gulp.dest('dest'));
});
var karma = require('karma');
var Server = karma.Server;
gulp.task('test', ['build', 'build:test'], function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});
gulp.task('ci', ['coding-standards', 'test']);
