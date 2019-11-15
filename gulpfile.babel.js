/* eslint-disable no-unused-vars */
import { src, dest, watch, series, parallel } from "gulp";
import sourcemaps from "gulp-sourcemaps";
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
import babelify from "babelify";
import bro from "gulp-bro";
import rename from "gulp-rename";
import buffer from "vinyl-buffer";

sass.compiler = require("node-sass");

const PROD = process.env.NODE_ENV === "production";
const buildDir = PROD ? "build" : "dist";
const server = browserSync.create();
const clean = () => del(["dist/**/*", "build/**/*"]);

const path = {
  scss: {
    src: "src/static/styless/**/*.scss",
    dest: `${buildDir}/css`
  },
  js: {
    site: "src/static/js/site.js",
    src: "src/static/js/**/*.*",
    dest: `${buildDir}/js`,
    vendor: `${buildDir}/vendor/js`
  },
  html: "./*.html",
  img: {
    src: "src/static/img/**/*",
    dest: `${buildDir}/img`
  },
  fonts: {
    src: "src/static/fonts/*",
    dest: `${buildDir}/fonts`,
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
      buildDir: "./"
    },
    port: PROD ? 8000 : 3000
  });
  done();
}

// Compile sass into CSS
function sassTask() {
  return src(path.scss.src)
    .pipe(cond(!PROD, sourcemaps.init({ loadMaps: true })))
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS())
    .pipe(cond(PROD, postcss([autoprefixer(), cssnano()])))
    .pipe(cond(!PROD, sourcemaps.write(".")))
    .pipe(dest(path.scss.dest));
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
  return src(path.js.site)
    .pipe(cond(!PROD, sourcemaps.init({ loadMaps: true })))
    .pipe(babel())
    .pipe(cond(PROD, uglify()))
    .pipe(cond(PROD, concat("main.min.js"), concat("main.js")))
    .pipe(cond(!PROD, sourcemaps.write(".")))
    .pipe(dest(path.js.dest));
}

function buildReact() {
  return src("./src/static/js/index.js")
    .pipe(
      bro({
        basedir: "./src/static/js/",
        extensions: [".js", ".jsx"],
        debug: !PROD,
        transform: [babelify]
      })
    )
    .pipe(rename("bundle.js"))
    .pipe(cond(PROD, buffer())) // Stream files
    .pipe(cond(PROD, uglify()))
    .pipe(dest(path.js.dest));
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

const watchall = () =>
  watch(
    [path.scss.src, path.js.src, path.html],
    series(parallel(sassTask, jsTask, buildReact), reload)
  );

module.exports.default = series(
  clean,
  moveJs,
  mvFontAwesome,
  moveImg,
  parallel(sassTask, jsTask, buildReact),
  serve,
  watchall
);
