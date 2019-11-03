import { src, dest, watch, series, parallel } from "gulp";
import babel from 'gulp-babel';
import sourcemaps from "gulp-sourcemaps";
import sass from "gulp-sass";
import concat from "gulp-concat";
import uglify from "gulp-uglify";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import browserSync from "browser-sync";

// const { reload } = browserSync;
const path = {
  scss: {
    src: "src/static/styless/*.scss",
    dest: "src/build/css",
    vendor: "src/build/vendor/css",
  },
  // css: "src/static/styles/css",
  js: {
    src: "src/static/js/*.js",
    dest: "src/build/js",
    vendor: "src/build/vendor/js",
  },
  html: "src/*.html",
};

// move bootsrap css
function moveScss() {
  return src("node_modules/bootstrap/scss/bootstrap.scss")
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()])) // PostCSS plugins
    .pipe(dest(path.scss.vendor));
}

// Compile sass into CSS
function sassTask() {
  return src(path.scss.src)
    .pipe(sourcemaps.init()) // initialize sourcemaps first
    .pipe(sass().on("error", sass.logError))
    .pipe(sourcemaps.write(".")) // write sourcemaps file in current directory
    .pipe(dest(path.scss.dest))
    .pipe(browserSync.reload({ stream: true }));
}

// move the js files
function moveJs() {
  return src([
    "node_modules/bootstrap/dist/js/bootstrap.min.js",
    "node_modules/tether/dist/js/tether.min.js",
    "node_modules/jquery/dist/jquery.min.js",
  ]).pipe(dest(path.js.vendor));
}

// JS task: concatenates and uglifies JS files to script.js
function jsTask() {
  return src([
    path.js.src,
    // ,'!' + 'includes/js/jquery.min.js', // to exclude any specific files
  ])
    .pipe(babel())
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(dest(path.js.dest))
    .pipe(browserSync.reload({ stream: true }));
}

function htmlTask() {
  return src(path.html)
    .pipe(browserSync.reload({ stream: true }));
}

// Cachebust
// let cbString = new Date().getTime();
// function cacheBustTask() {
//   return src(["index.html"])
//     .pipe(replace(/cb=\d+/g, `cb=${cbString}`))
//     .pipe(dest("."));
// }

function watchTask() {
  browserSync.init({
    server: "./src",
  });
  watch([path.scss.src, path.js.src, path.html], series(parallel(sassTask, jsTask, htmlTask)));
}

exports.default = series(moveJs, moveScss, parallel(sassTask, jsTask), watchTask);
