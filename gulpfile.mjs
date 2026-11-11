import { src, dest, parallel, series, watch } from 'gulp';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import concat from 'gulp-concat';
import browserSync from 'browser-sync';

const sassCompiler = gulpSass(dartSass);
const bs = browserSync.create();
const proxyUrl = 'localhost';

const paths = {
    scssEntry: 'assets/scss/main.scss',
    scssWatch: 'assets/scss/**/*.scss',
    jsEntry: 'assets/js/**/*.js',
    jsWatch: 'assets/js/**/*.js',
    distCss: 'public/assets/css',
    distJs: 'public/assets/js',
};

export function css() {
    return src(paths.scssEntry)
        .pipe(sassCompiler({ outputStyle: 'compressed' }).on('error', sassCompiler.logError))
        .pipe(concat('main.css'))
        .pipe(dest(paths.distCss))
        .pipe(bs.stream());
}

export function js() {
    return src(paths.jsEntry)
        .pipe(concat('main.js'))
        .pipe(dest(paths.distJs));
}

function reload(done) {
    bs.reload();
    done();
}

export function watchFiles() {
    bs.init({
        proxy: proxyUrl,
        notify: false,
        open: false,
    });

    watch(paths.scssWatch, css);
    watch(paths.jsWatch, series(js, reload));
}

export { watchFiles as watch };
export default parallel(css, js);
