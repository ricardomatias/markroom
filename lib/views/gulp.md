## Gulp

### Main Methods

#### gulp.src(globs[, options])

Takes a glob and represents a file structure. Can be piped to plugins. (*takes a **glob** and returns an input stream*)

        gulp.src('./client/templates/*.jade')
            .pipe(jade())
            .pipe(minify())
            .pipe(gulp.dest('./build/minified_templates'));

##### options.read

Type: ´Boolean´ Default: ´true´

Setting this to ´false´ will return ´file.contents´ as null and not read the file at all.

---

#### gulp.dest(path)

Can be piped to and it will write files. Re-emits all data passed to it so you can pipe to multiple folders. Folders that don't exist will be created. (*takes a path and returns an output stream*)

        gulp.src('./client/templates/*.jade')
          .pipe(jade())
          .pipe(gulp.dest('./build/templates'))
          .pipe(minify())
          .pipe(gulp.dest('./build/minified_templates'));

**Path**  
Type: `String`
The path (folder) to write files to.  

---

#### gulp.task(name[, deps], fn)  

Define a task using [Orchestrator](https://github.com/robrich/orchestrator).

        gulp.task('somename', function() {
          // Do stuff
        });

more on this in [Gulp’s API](https://github.com/gulpjs/gulp/blob/master/docs/API.md#name)

---

#### gulp.watch(glob[, opts], tasks)

**glob**  
Type: `String` or `Array`  
A single glob or array of globs that indicate which files to watch for changes.

**opts**  
Type: `Object`  
Options, that are passed to [gaze](https://github.com/shama/gaze).

**tasks**
Type: `Array`

Names of task(s) to run when a file changes, added with `gulp.task()`

        var watcher = gulp.watch('js/**/*.js', ['uglify','reload']);
        watcher.on('change', function(event) {
          console.log('File '+event.path+' was '+event.type+', running tasks...');
        });
        
### Learning Gulp  


