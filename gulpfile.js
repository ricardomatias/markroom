'use strict';

var spawn = require('child_process').spawn,
    existsSync = require('fs').existsSync;

var gulp = require('gulp'),
    less = require('gulp-less'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    watchify = require('watchify'),
    errorify = require('errorify'),
    gutil = require('gulp-util'),
    browserify = require('browserify'),
    runSequence = require('gulp-sequence');

var packager = require('electron-packager'),
    electron = require('electron-prebuilt'),
    copyRecursive = require('ncp'),
    app = require('electron-connect').server.create();

var assign = require('lodash/object/assign'),
    forEach = require('lodash/collection/forEach');

var PACKAGE_JSON = require('./package.json'),
    ELECTRON_VERSION = '0.33.0';


function buildDistroIgnore() {

  var ignore = [
    'client',
    'resources',
    '.editorconfig',
    '.gitignore',
    '.jshintrc',
    'gulpfile.js',
    'README.md'
  ];


  forEach(PACKAGE_JSON.devDependencies, function(version, name) {
    ignore.push('node_modules/' + name);
  });

  return new RegExp('(' + ignore.join('|') + ')');
}

var archiver = require('archiver'),
    fs = require('fs');

function createArchive(platform, path, done) {

  return function(err) {

    if (err) {
      return done(err);
    }

    var archive,
        dest = path,
        output;

    if (platform === 'win32') {
      archive = archiver('zip', {});
      dest += '.zip';
    } else {
      archive = archiver('tar', { gzip: true });
      dest += '.tar.gz';
    }

    output = fs.createWriteStream(dest);

    archive.pipe(output);
    archive.on('end', done);
    archive.on('error', done);

    archive.directory(path, 'camunda-modeler').finalize();
  };
}

function amendAndArchive(platform, paths, done) {

  var idx = 0;

  var platformAssets = __dirname + '/resources/' + platform;

  function processNext(err) {

    if (err) {
      return done(err);
    }

    var currentPath = paths[idx++];

    if (!currentPath) {
      return done(err, paths);
    }

    var archive = createArchive(platform, currentPath, processNext);

    if (existsSync(platformAssets)) {
      copyRecursive(platformAssets, currentPath, archive);
    } else {
      archive();
    }
  }

  processNext();
}

// package pre-built electron application for the given platform

function electronPackage(platform) {
  var opts = {
    name: PACKAGE_JSON.name,
    version: ELECTRON_VERSION,
    dir: '.',
    out: 'distro',
    overwrite: true,
    asar: true,
    arch: 'all',
    platform: platform,
    icon: __dirname + '/resources/icons/icon_128'
  };

  opts['app-version'] = PACKAGE_JSON.version;
  opts.ignore = buildDistroIgnore();

  return function(done) {
    packager(opts, function(err, paths) {

      if (err) {
        return done(err);
      }

      return amendAndArchive(platform, paths, done);
    });
  };
}

// add custom browserify options here
var browserifyOptions = {
  entries: [ './client/index.js' ],
  debug: true,
  transform: [ 'stringify' ]
};

// add transformations here
// i.e. b.transform(coffeeify);

function bundle(options) {

  var bundler,
      bundleOptions;

  function build() {
    return bundler
             .bundle()
             .pipe(source('index.js'))
             .pipe(buffer())
             .pipe(gulp.dest('dist'));
  }

  if (options && options.watch) {

    bundleOptions = assign({}, watchify.args, browserifyOptions);

    bundler = watchify(browserify(bundleOptions));

    bundler.plugin(errorify);

    bundler.on('update', build);

    bundler.on('log', gutil.log);
  } else {
    bundler = browserify(browserifyOptions);
  }

  bundler.build = build;

  return bundler;
}

gulp.task('serve', function () {

  // Start browser process
  app.start();

  // Restart browser process
  gulp.watch([ 'index.js', 'app/**/*.js'], app.restart);

  // Reload renderer process
  gulp.watch([ 'client/**/*.js', 'index.html'], [ 'client:build', app.reload ]);
});

gulp.task('client:build:watch', function() {
  return bundle({ watch: true }).build();
});

gulp.task('client:build', function() {
  return bundle().build();
});

gulp.task('client:less', function() {
  return gulp.src('client/less/app.less')
        .pipe(less({
          paths: [ './node_modules/' ]
        }))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('debug', function() {
  return spawn(electron, [ '--debug-brk=5858' ], { stdio: 'inherit' });
});


gulp.task('package:windows', electronPackage('win32'));
gulp.task('package:darwin', electronPackage('darwin'));
gulp.task('package:linux', electronPackage('linux'));

gulp.task('dist', runSequence([ 'dist-darwin', 'dist-linux' ]));

gulp.task('auto-build', runSequence('client:build', 'serve'));

gulp.task('distro', runSequence('client:build', 'package'));

gulp.task('default', runSequence('client:build'));
