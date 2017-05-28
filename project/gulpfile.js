/**
 * Created by LaBestia on 11.05.2017.
 */

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var minify = require('gulp-minify-css');
var browserSync = require("browser-sync");
reload = browserSync.reload;

var config = {
                server: { baseDir: "./build" },
                //tunnel: true,
                host: 'localhost',
                port: 9000,
                logPrefix: "LaBestia"
            };


gulp.task('build:js', function()
                    {
                        gulp.src('src/js/**/*.js')
                            .pipe(uglify())
                            .pipe(concat('main.js'))
                            .pipe(gulp.dest('build/js'))
                            .pipe(reload({stream: true}));
                    });

gulp.task('style', function ()
                    {
                        gulp.src('src/style/style.scss')
                            .pipe(sass())
                            .pipe(minify())
                            .pipe(gulp.dest('build/style'))
                            .pipe(reload({stream: true}));
                    });

gulp.task('libs', function ()
                    {
                        gulp.src('src/style/additional/libs.scss')
                            .pipe(sass())
                            .pipe(minify())
                            .pipe(gulp.dest('build/style/additional'))
                            .pipe(reload({stream: true}));
                    });

gulp.task('build:css', function()
                        {
                           gulp.src('src/style/**/*.scss')
                               .pipe(sass())
                               .pipe(minify())
                               .pipe(gulp.dest('build/style'))
                               .pipe(reload({stream: true}));
                        });

gulp.task('build:html', function()
                        {
                            gulp.src('src/*.html')
                                .pipe(gulp.dest('build'))
                                .pipe(reload({stream: true}));
                        });

gulp.task('build:json', function()
                        {
                            gulp.src('src/*.json')
                                .pipe(gulp.dest('build'))
                                .pipe(reload({stream:true}));
                        });

gulp.task('build', ['build:html', 'build:js', 'build:css', 'build:json']);

gulp.task('watch', function()
                    {
                        watch('src/*.html', function ()
                                            {
                                                gulp.start('build:html');
                                            });
                        watch('src/js/**/*.js', function ()
                                                {
                                                    gulp.start('build:js');
                                                });
                        watch('src/style/**/*.scss', function()
                                                        {
                                                            gulp.start('build:css');
                                                        });
                    });

gulp.task('webserver', function ()
                        {
                            browserSync(config);
                        });

gulp.task('default', ['build', 'webserver', 'watch']);