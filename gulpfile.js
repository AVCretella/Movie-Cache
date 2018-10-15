//grab the dependencies that we need
var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concatCss = require('gulp-concat-css');
var run = require('gulp-run'); //allows us to run a start command with gulp

//where information will be sent to. Our working folders basically
var src = './process';
var app = './app';

gulp.task('js', function() {
  return gulp.src( src + '/js/renderer.js' ) //will look for renderer.js in the js folder
    .pipe(browserify({ //using browserify, will do several things
      transform: 'reactify', //convert react code to javascript
      extensions: 'browserify-css', //allow you to use css files within the document
      debug: true
    }))
    .on('error', function (err) {
      console.error('Error!', err.message);
    })
    .pipe(gulp.dest(app + '/js')); //will send all the results to the js folder in for th ebuilt app
});

gulp.task('html', function() {
  gulp.src( src + '/**/*.html'); //look for changes in html documents (maybe minify when going to prod)
});

gulp.task('css', function() {
  gulp.src( src + '/css/*.css') //looks for all css folders
  .pipe(concatCss('app.css')) //concatinates all of them
  .pipe(gulp.dest(app + '/css')); //and puts it into the css folder for the built app
});

gulp.task('fonts', function() {
    gulp.src('node_modules/bootstrap/dist/fonts/**/*') //take all of the fonts from the node modules folder
    .pipe(gulp.dest(app + '/fonts')); //and put it into the fonts folder for the built app for organization
});

gulp.task('watch', ['serve'], function() { //will look for any changes and reprocess each
  gulp.watch( src + '/js/**/*', ['js']);
  gulp.watch( src + '/css/**/*.css', ['css']);
  gulp.watch([ app + '/**/*.html'], ['html']); //kind of just a placeholder
});

gulp.task('serve', ['html', 'js', 'css'], function() { //will actually run the application
  run('electron app/main.js').exec(); //renamed app.js for React standard continuity
});

gulp.task('default', ['watch', 'fonts', 'serve']); //run all of the tasks that we defined above with one command