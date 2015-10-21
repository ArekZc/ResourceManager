/// <reference path="typings/gulp/gulp.d.ts" />
/// <reference path="typings/gulp-typescript/gulp-typescript.d.ts" />
/// <reference path="typings/merge2/merge2.d.ts" />
/// <reference path="typings/vinyl-source-stream/vinyl-source-stream.d.ts" />
/// <reference path="typings/browserify/browserify.d.ts" />
/// <reference path="typings/gulp-rename/gulp-rename.d.ts" />
/// <reference path="typings/gulp-uglify/gulp-uglify.d.ts" />
/// <reference path="typings/yargs/yargs.d.ts" />
/// <reference path="typings/gulp-util/gulp-util.d.ts" />
/// <reference path="typings/node/node.d.ts" />
/// <reference path="typings/gulp-sourcemaps/gulp-sourcemaps.d.ts" />

let gulp = require('gulp'),
    vinylSourceStream = require('vinyl-source-stream'),
	sourcemaps = require('gulp-sourcemaps'),
	rename = require('gulp-rename'),
	buffer = require('vinyl-buffer'),
	browserify = require('browserify'),
	tsify = require('tsify'),
	tsc = require('gulp-typescript'),
	karma = require('karma'),
	uglify = require('gulp-uglify'),
	yargs = require('yargs'),
	gutil = require('gulp-util');

let config = {
	publicPath: __dirname + '/release',
	app: {
		path: __dirname,
		main: 'index.ts',
		result: 'resource.js'
	}
};


gulp.task('build', () => {
	let bro: any = browserify;
	
	let bundler = bro({
			debug: true
		})
		.add(config.app.path + '/' + config.app.main)
		.plugin(tsify);
		
	return bundler.bundle()
        .pipe(vinylSourceStream(config.app.result))
		.pipe(buffer())
		.pipe(gulp.dest(config.publicPath))
		.pipe(rename('resource.min.js'))
		.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(uglify())
			.on('error', gutil.log)
		.pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.publicPath));
	
});

gulp.task('build:test', () => {
	
	return gulp.src('tests/**/*.ts')
		.pipe(tsc({
			noEmitOnError: true,
			emitDecoratorMetadata: false
		}))
		.pipe(gulp.dest('tmp/tests'));
	
});

gulp.task('test', ['build:test'], (done) => {
	
	new karma.Server({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done).start();
	
});

gulp.task('start', ['build', 'build:test'], () => {
	
	gulp.watch('src/**/*.ts', ['build']);
	gulp.watch('tests/**/*.ts', ['test']);
	
});

let task = yargs.argv.task || 'build'

gulp.start(task);