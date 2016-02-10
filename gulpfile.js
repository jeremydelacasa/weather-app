var gulp = require('gulp');
var livereload = require('gulp-livereload');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var webserver = require('gulp-webserver');
var concat = require('gulp-concat');
var ngConstant = require('gulp-ng-constant');

livereload({ start: true });

gulp.task('config', function() {

  gulp.src('app/config.json')
    .pipe(ngConstant())
    .pipe(gulp.dest('app'));

});

gulp.task('sass', function() {

  return gulp.src('scss/all.scss')
    .pipe(plumber())
    .pipe(sass({outputStyle:'compressed'}))
    .pipe(autoprefixer())
    .pipe(gulp.dest('app/css'))
    .pipe(livereload());

});

gulp.task('app', function(){

  return gulp.src([
    'app/js/app.js',
    'app/js/controllers/globalCtrl.js',
    'app/js/controllers/settingsCtrl.js',
    'app/js/services/settingsServ.js',
    'app/js/controllers/homeCtrl.js',
    'app/js/services/homeServ.js',
    'app/js/directives/timer.js',
    'app/js/directives/icon.js'
  ])
  .pipe(concat('app-concat.js'))
  .pipe(gulp.dest('app/js'))
  .pipe(livereload());

});

gulp.task('webserver', function() {
  gulp.src('app')
    .pipe(webserver({
      livereload: true,
      //directoryListing: true,
      open: true
    }));
});

gulp.task('watch', function(){
  livereload.listen();
  gulp.watch('scss/*.scss', ['sass']);
  gulp.watch('app/js/**/*.js', ['app']);
});

gulp.task('default',['sass','watch','webserver','app','config']);