import { src, dest, watch, series, parallel } from "gulp";
import babel from "gulp-babel";
import sourcemaps from "gulp-sourcemaps";
import sass from "gulp-sass";
import concat from "gulp-concat";
import uglify from "gulp-uglify";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import del from "del";
import imagemin from "gulp-imagemin";
import cssnano from "cssnano";
import browserSync from "browser-sync";

const server = browserSync.create();
const clean = () => del(["dist"]);

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: "./",
    },
  });
  done();
}

const path = {
  scss: {
    src: "src/static/styless/*.scss",
    dest: "dist/css",
    vendor: "dist/vendor/css",
  },
  // css: "src/static/styles/css",
  js: {
    src: "src/static/js/*.js",
    dest: "dist/js",
    vendor: "dist/vendor/js",
  },
  html: "./*.html",
  img: {
    src: "src/static/img/*",
    dest: "dist/img",
  },
  fonts: {
    src: "src/static/fonts/*",
    dest: "dist/fonts",
    vendor: {
      src: "node_modules/font-awesome/fonts/*",
      dest: "dist/vendor/fonts",
    },
  },
};

// move vendor (bootsrap) css
function moveScss() {
  return src([
    "node_modules/bootstrap/scss/bootstrap.scss",
    "node_modules/font-awesome/scss/font-awesome.scss",
  ])
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()])) // PostCSS plugins
    .pipe(dest(path.scss.vendor));
}

// Compile sass into CSS
function sassTask() {
  return src(path.scss.src)
    .pipe(sourcemaps.init()) // initialize sourcemaps first
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()])) // PostCSS plugins
    .pipe(sourcemaps.write(".")) // write sourcemaps file in current directory
    .pipe(dest(path.scss.dest));
  // .pipe(browserSync.reload({ stream: true }));
}

// move vendor js files
function moveJs() {
  return src([
    "node_modules/bootstrap/dist/js/bootstrap.min.js",
    "node_modules/tether/dist/js/tether.min.js",
    "node_modules/jquery/dist/jquery.min.js",
    "node_modules/popper.js/dist/popper.min.js",
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
    .pipe(dest(path.js.dest));
  // .pipe(browserSync.reload({ stream: true }));
}

function moveImg() {
  return src(path.img.src)
    .pipe(
      imagemin({
        verbose: true,
      }),
    )
    .pipe(dest(path.img.dest));
}

function mvFont_awesome() {
  return src([path.fonts.vendor.src]).pipe(dest(path.fonts.vendor.dest));
}
// Cachebust
// let cbString = new Date().getTime();
// function cacheBustTask() {
//   return src(["index.html"])
//     .pipe(replace(/cb=\d+/g, `cb=${cbString}`))
//     .pipe(dest("."));
// }

const watchall = () =>
  watch([path.scss.src, path.js.src, path.html], series(parallel(sassTask, jsTask), reload));

exports.default = series(
  clean,
  moveJs,
  moveScss,
  mvFont_awesome,
  moveImg,
  parallel(sassTask, jsTask),
  serve,
  watchall,
);
