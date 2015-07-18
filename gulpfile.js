'use strict';

var gulp = require('gulp'),
    babel = require('gulp-babel'),
    run = require('gulp-run'),
    rename = require('gulp-rename'),
    electron = require('electron-connect').server.create();


gulp.task('serve', [ 'babel' ], function () {

  // Start browser process
  electron.start();

  // Restart browser process
  gulp.watch('browser.js', [ electron.restart ]);

  // Reload renderer process
  gulp.watch(['main.js', 'index.html', 'styles.css'], [ electron.reload ]);
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

gulp.task('default', [ 'serve' ]);
