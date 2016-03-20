/**
 * Created by Hernan Y.Ke on 2016/3/20.
 */
var gulp = require('gulp');
var tslint = require('gulp-tslint');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var transform = require('vinyl-transform');


var karma = require('gulp-karma');

gulp.task('karma',function(cb){
    gulp.src('./dist/test/**/**.test.js').pipe(karma({
        configFile: 'karma.conf.js',
        action:'run'
    })).on('end',cb).on('error',function(err){
        throw err;
    })
})
var ts = require('gulp-typescript');
var tsPj = ts.createProject({
    noImplicitAny:true,
    target:'ES5',
    module:'commonjs',
    declarationFiles:false
})

var browserified = transform(function(filenm){
    var b = browserify({entries:filenm,debug});
    return b.bundle();
})

gulp.task('bundle-js',function(){
    return gulp.src('./temp/source/js/main.js').pipe(browserified).pipe(sourcemaps.init({loadMaps:true}).pipe(uglify()).pipe(sourcemaps.write('./')).pipe(gulp.dest('./dist/source/js/')))
})

gulp.task('bundle-test',function(){
    return gulp.src('./temp/test/**/**.test.js').pipe(browserified).pipe(gulp.dest('./dist/test/'));
})

gulp.task('sync',function(){
})


gulp.task('lint',function(){
    return gulp.src(['./source/ts/**/**.ts','./test/**/**.test.ts']).pipe(tslint()).pipe(tslint.report('verbose'));
})

gulp.task('tsc',function(){
    return gulp.src('./source/ts/**/**.ts').pipe(ts(tsPj)).js.pipe(gulp.dest('./temp/source.js'));
})

gulp.task('tsc-tests',function(){
    return gulp.src('./test/**/**.test.ts').pipe(ts(tsPj)).js.pipe(gulp.dest('./temp/test/'));
})

gulp.task('default',gulp.series('lint','tsc','tsc-tests','bundle-js','bundle-test','karma'));