'use strict';

var gulp = require('gulp'),
    babel = require('gulp-babel'),
    run = require('gulp-run'),
    rename = require('gulp-rename'),
    sequence = require('gulp-sequence'),
    electron = require('electron-connect').server.create();


gulp.task('serve', function () {

  // Start browser process
  electron.start();

  // Restart browser process
  gulp.watch([ 'index.js', 'app/**/*.js'], electron.restart);

  // Reload renderer process
  gulp.watch(['./lib/**/*.js', 'index.html', 'styles.css'], electron.reload);
});

gulp.task('babel', function() {
  return gulp.src('app/index.js')
             .pipe(babel())
             .pipe(rename('browser.js'))
             .pipe(gulp.dest('app'));
});

gulp.task('run', [ 'babel' ], function() {
  return run('electron .').exec();
});

gulp.task('debug', [ 'babel' ], function() {
  return run('electron --debug-brk=5858 .').exec();
});

gulp.task('default', sequence('babel', 'serve'));
