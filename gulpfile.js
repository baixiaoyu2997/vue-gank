var gulp = require("gulp");
// var minimist = require("minimist");
// var fse = require("fs-extra");
var sass = require("gulp-sass");
// var exec = require('child_process').exec;
var babel = require("gulp-babel");
var cleanCss = require("gulp-clean-css");
var uglify = require("gulp-uglify");
var livereload = require('gulp-livereload');

gulp.task("default", ["watch"]);

gulp.task('html', function () {
    return gulp.src('./index.html')
        .pipe(livereload());
});
gulp.task('babel', () => {
    return gulp.src('./src/js/main.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});
//监听
gulp.task('watch', function () {
    livereload.listen(); //这句不能省，它是用来开启 livereload 服务器
    gulp.watch('index.html', ['html']);
    gulp.watch("./src/css/*.scss", ["sass"]);
});

//sass转换成css
gulp.task("sass", function () {
    return gulp.src("./src/css/*.scss").pipe(sass({
            outputStyle: "expanded"
        }).on('error', sass.logError)).pipe(cleanCss())
        .pipe(gulp.dest("./dist/css/"));
});