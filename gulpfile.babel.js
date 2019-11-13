import { src, dest, watch, series, parallel } from "gulp";
import babel from "gulp-babel";
import sass from "gulp-sass";
import concat from "gulp-concat";
import uglify from "gulp-uglify";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import del from "del";
import imagemin from "gulp-imagemin";
import cssnano from "cssnano";
import browserSync from "browser-sync";
import cond from "gulp-cond";
import cleanCSS from "gulp-clean-css";

sass.compiler = require("node-sass");

const PROD = process.env.NODE_ENV === "production";
const baseDir = PROD ? "build" : "dist";
const server = browserSync.create();
const clean = () => del(["dist/**/*", "build/**/*"]);

const path = {
  scss: {
    src: "src/static/styless/**/*.scss",
    dest: `${baseDir}/css`,
    vendor: `${baseDir}/vendor/css`
  },
  // css: "src/static/styles/css",
  js: {
    src: "src/static/js/**/*.*",
    dest: `${baseDir}/js`,
    vendor: `${baseDir}/vendor/js`
  },
  html: "./*.html",
  img: {
    src: "src/static/img/**/*",
    dest: `${baseDir}/img`
  },
  fonts: {
    src: "src/static/fonts/*",
    dest: `${baseDir}/fonts`,
    vendor: {
      src: "node_modules/font-awesome/fonts/*"
    }
  }
};

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: "./"
    },
    port: PROD ? 8000 : 3000
  });
  done();
}

// move vendor (bootsrap) css
// function moveScss() {
//   return src(["node_modules/font-awesome/scss/font-awesome.scss"])
//     .pipe(sass())
//     .pipe(cond(PROD, postcss([autoprefixer(), cssnano()]))) // PostCSS plugins
//     .pipe(dest(path.scss.vendor));
// }

// Compile sass into CSS
function sassTask() {
  return (
    src(path.scss.src, { sourcemaps: !PROD })
      // .pipe(cond(!PROD, sourcemaps.init()))
      .pipe(sass().on("error", sass.logError))
      .pipe(cleanCSS())
      .pipe(cond(PROD, postcss([autoprefixer(), cssnano()])))
      // .pipe(cond(!PROD, sourcemaps.write())) // PostCSS plugins
      .pipe(dest(path.scss.dest))
  );
  // .pipe(browserSync.reload({ stream: true }));
}

// move vendor js files
function moveJs() {
  return src([
    "node_modules/bootstrap/dist/js/bootstrap.min.js",
    "node_modules/tether/dist/js/tether.min.js",
    "node_modules/jquery/dist/jquery.min.js",
    "node_modules/popper.js/dist/popper.min.js"
  ]).pipe(dest(path.js.vendor));
}

// JS task: concatenates and uglifies JS files to script.js
function jsTask() {
  return (
    src(
      [
        path.js.src
        // ,'!' + 'includes/js/jquery.min.js', // to exclude any specific files
      ],
      { sourcemaps: !PROD }
    )
      // .pipe(cond(!PROD, sourcemaps.init()))
      .pipe(babel())
      .pipe(cond(PROD, uglify()))
      .pipe(cond(PROD, concat("main.min.js"), concat("main.js")))
      // .pipe(cond(!PROD, sourcemaps.write()))
      .pipe(dest(path.js.dest))
  );
}

function moveImg() {
  return src(path.img.src)
    .pipe(
      cond(
        PROD,
        imagemin({
          verbose: true
        })
      )
    )
    .pipe(dest(path.img.dest));
}

function mvFontAwesome() {
  return src([path.fonts.vendor.src, path.fonts.src]).pipe(
    dest(path.fonts.dest)
  );
}
// Cachebust
// let cbString = new Date().getTime();
// function cacheBustTask() {
//   return src(["index.html"])
//     .pipe(replace(/cb=\d+/g, `cb=${cbString}`))
//     .pipe(dest("."));
// }

const watchall = () =>
  watch(
    [path.scss.src, path.js.src, path.html],
    series(parallel(sassTask, jsTask), reload)
  );

exports.default = series(
  clean,
  moveJs,
  mvFontAwesome,
  moveImg,
  parallel(sassTask, jsTask),
  serve,
  watchall
);
