'use strict';

var gulp = require('gulp');  // Base gulp package
var babelify = require('babelify'); // Used to convert ES6 & JSX to ES5
var browserify = require('browserify'); // Providers "require" support, CommonJS
var notify = require('gulp-notify'); // Provides notification to both the console and Growel
var rename = require('gulp-rename'); // Rename sources
var sourcemaps = require('gulp-sourcemaps'); // Provide external sourcemap files
var livereload = require('gulp-livereload'); // Livereload support for the browser
var gutil = require('gulp-util'); // Provides gulp utilities, including logging and beep
var chalk = require('chalk'); // Allows for coloring for logging
var source = require('vinyl-source-stream'); // Vinyl stream support
var buffer = require('vinyl-buffer'); // Vinyl stream support
var watchify = require('watchify'); // Watchify for source changes
var merge = require('utils-merge'); // Object merge tool
var duration = require('gulp-duration'); // Time aspects of your gulp process

var config = {
  js: {
    src: './src/js/main.js',
    watch: './src/js/**/*',
    outputDir: './build/',
    outputFile: 'build.js',
  },
};


function mapError(err) {
  if (err.fileName) {

    gutil.log(chalk.red(err.name)
      + ': ' + chalk.yellow(err.fileName.replace(__dirname + '/src/js/', ''))
      + ': ' + 'Line ' + chalk.magenta(err.lineNumber)
      + ' & ' + 'Column ' + chalk.magenta(err.columnNumber || err.column)
      + ': ' + chalk.blue(err.description));
  } else {
    gutil.log(chalk.red(err.name)
      + ': '
      + chalk.yellow(err.message));
  }
}

function bundle(bundler) {
  var bundleTimer = duration('Javascript bundle time');

  bundler
    .bundle()
    .on('error', mapError) 
    .pipe(source('main.js')) 
    .pipe(buffer()) 
    .pipe(rename(config.js.outputFile)) 
    .pipe(sourcemaps.init({loadMaps: true})) 
    .pipe(sourcemaps.write('./map')) 
    .pipe(gulp.dest(config.js.outputDir)) 
    .pipe(notify({
      message: 'Generated file: <%= file.relative %>',
    }))
    .pipe(bundleTimer) 
    .pipe(livereload()); 
}

gulp.task('default', function() {
  livereload.listen(); 
  var args = merge(watchify.args, { debug: true }); 

  var bundler = browserify(config.js.src, args) 
    .plugin(watchify, {ignoreWatch: ['**/node_modules/**', '**/bower_components/**']}) 
    .transform(babelify, {presets: ['es2015', 'react']}); 

  bundle(bundler); 

  bundler.on('update', function() {
    bundle(bundler); 
  });
});