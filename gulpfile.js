// Define webserver variables
var host =  'localhost';
var port =  '8000';
var documentRoot = 'dist/';

// grab all our packages
var gulp = require('gulp');
var connect_php = require('gulp-connect-php');

// gulp jshint run-sequence gulp-filter main-bower-files gulp-print gulp-jshint gulp-sass  gulp-autoprefixer gulp-concat gulp-uglify gulp-rename gulp-webserver gulp-connect-php opn gulp-imagemin gulp-fontgen

// Include npm del gulp


// Run squenced tasks
var runSequence = require('run-sequence');

//Include our plugins for gulp
var filter = require('gulp-filter');
var mainBowerFiles = require('main-bower-files');
var print = require('gulp-print');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');
// var webserver = require('gulp-webserver');
var opn = require('opn');
var livereload = require('gulp-livereload');
var imagemin = require('gulp-imagemin');
var fontgen = require('gulp-fontgen');


// Process bower components css files
gulp.task('bower-css', function () {

    gulp.src(mainBowerFiles({
        paths: {
            bowerDirectory: './src/bower_components',
            bowerrc: '.bowerrc',
            bowerJson: 'bower.json'
        },
        includeDev: 'inclusive'
    }))

    // Filter styles files out of bower components
        .pipe(filter(['**/*.css']))
        .pipe(print(function (filepath) {
            return "built vendor css: " + filepath;
        }))
        .pipe(concat('vendors.css'))
        //.pipe(uglify())
        .pipe(gulp.dest('dist/css'))
});

// Process bower components js files
gulp.task('bower-js', function () {

    gulp.src(mainBowerFiles({
        paths: {
            bowerDirectory: './src/bower_components',
            bowerrc: '.bowerrc',
            bowerJson: 'bower.json'
        },
        includeDev: 'inclusive'
    }))

    // Filter javascript files out of bower components
        .pipe(filter('**/*.js'))
        .pipe(print(function (filepath) {
            return "built vendor js: " + filepath;
        }))
        .pipe(concat('vendors.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
});

// Lint task
gulp.task('lint', function () {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile our sass files & export them
gulp.task('sass', function () {
    return gulp.src('src/sass/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/css/'));
});

// Collect & Move php files
gulp.task('php', function () {
    return gulp.src('src/php/*.php')
        .pipe(gulp.dest('dist/php/'));
});

// compress & minify js & export them
gulp.task('scripts', function () {
    return gulp.src('src/js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename('all.min.js'))
        // .pipe(uglify())
        .pipe(gulp.dest('dist/js/'));
});

// Minify images & export them
gulp.task('imagemin', function () {
    return gulp.src('src/assets/*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('dist/images'));
});

// Creates webfonts from src/fonts/ & src/vendors/ folders
gulp.task('fontgen', function () {
    return gulp.src([
        "./src/fonts/*.{ttf,otf,woff}", // look up for font files
        "./src/bower_components/**/*.{ttf,otf,woff}", // look up here
        "!./src/bootstrap-sass/assets/fonts/**/*.{ttf,otf,woff}", // dont look up here
        "!./src/bower_components/bootstrap-sass/**/*.{ttf,otf,woff}"])// dont look up here
        .pipe(fontgen({
            dest: "./dist/fonts/"
        }));
});

// // Easily delete created dist/ files
gulp.task('clean', function () {
    return del.sync(['./dist/css', './dist/images', './dist/js', './dist/fonts']);
});


// Open Browser
gulp.task('openbrowser', function () {
    opn('http://' + host + ':' + port);
});

// create a task to serve the app
gulp.task('server', function() {

    // start the php server
    // make sure we use the public directory since this is Laravel
    php.server({
        base: documentRoot
    });

});

// Here comes watchmen
gulp.task('watch', function () {
    gulp.watch('src/js/*.js', ['lint', 'scripts']);
    gulp.watch('src/sass/*.scss', ['sass']);
    gulp.watch('src/php/*.php', ['php']);
});

// create a task to serve the app
gulp.task('server', function() {

    // start the php server
    connect_php.server({
        base: documentRoot
    });

});

// Add build task
gulp.task('build', ['sass']);

// Default task
gulp.task('default', [
        'watch',
        'build',
        'clean',
        'lint',
        'bower-css',
        'bower-js',
        'sass',
        'fontgen',
        'imagemin',
        'scripts',
        'php',
        'server',
        'openbrowser'
    ],
    function () {
        console.log('Building files');
    }
);

livereload.listen();