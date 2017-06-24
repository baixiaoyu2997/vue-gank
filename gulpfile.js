var gulp = require("gulp");
// var minimist = require("minimist");
// var fse = require("fs-extra");
var sass = require("gulp-sass");
// var exec = require('child_process').exec;
var livereload = require('gulp-livereload');

gulp.task("default", ["watch"]);

gulp.task('html', function () {
    return gulp.src('./index.html')
        .pipe(livereload());
});
//监听
gulp.task('watch', function () {
    livereload.listen(); //这句不能省，它是用来开启 livereload 服务器
    gulp.watch('index.html', ['html']);
    gulp.watch("./style/css/*.scss", ["sass"]);
});

//sass转换成css
gulp.task("sass", function () {
    return gulp.src("./style/css/*.scss").pipe(sass({
            outputStyle: "expanded"
        }).on('error', sass.logError))
        .pipe(gulp.dest("./style/css/"));
});

