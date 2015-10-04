/// <reference path="typings/tsd.d.ts" />

import * as gulp from 'gulp';
import * as yargs from 'yargs';

import * as tslint from 'gulp-tslint';

gulp.task('coding-standards', () => {
	
	return gulp.src([
		'**/*.ts',
		'!node_modules/**/*'
	])
		.pipe(tslint());
	
});

import * as tsc from 'gulp-typescript';

gulp.task('build', () => {
	
	return gulp.src([
		'src/**/*.ts'
	])
		.pipe(tsc({
			out: 'resource.js',
			emitDecoratorMetadata: true
		}))
		.pipe(gulp.dest('dest'));
	
});

gulp.task('build:test', () => {
	
	return gulp.src([
		'tests/**/*.ts'
	])
		.pipe(tsc({
			out: 'resource.spec.js',
			emitDecoratorMetadata: true
		}))
		.pipe(gulp.dest('dest'));
	
});


import * as karma from 'karma';

let Server = karma.Server;

gulp.task('test', ['build', 'build:test'], (done) => {
	
	new Server({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done).start();
	
});

gulp.task('ci', ['coding-standards', 'test']);