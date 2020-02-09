const gulp = require('gulp'), // Подключаем Gulp
    sass = require('gulp-sass'), //Подключаем Sass пакет,
    browserSync = require('browser-sync'), // Подключаем Browser Sync
    concat = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    uglify = require('gulp-uglify-es').default, // Подключаем gulp-uglify-es (для сжатия JS, можно сжимать es-6 файлы)
    cleanCss = require('gulp-clean-css'), // Подключаем пакет для минификации CSS
    rename = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
    del = require('del'), // Подключаем библиотеку для удаления файлов и папок
    imagemin = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
    cache = require('gulp-cache'), // Подключаем библиотеку кеширования
    autoprefix = require('gulp-autoprefixer'),// Подключаем библиотеку для автоматического добавления префиксов
    gcmq = require('gulp-group-css-media-queries'),// Подключаем библиотеку для автоматическоской группировки медиа запросов
    processhtml = require('gulp-processhtml'), //Подключаем библиотеку для html коментариев, которая при билде выполняет действия
    smartgrid = require('smart-grid'); // smart-grid

/* Для установки всех плагинов в консоли прописать "npm i"
*  Для правок в консоли прописать "gulp", для билда "gulp build, все правки делать в папке app/"
*  Билд находится в папке dist
*  Новые плагины можно устанавливать через bower, или просто закинуть файлы (js, css) в папку app/libs
*  Если в плагине есть .css стили, то в файле libs.scss можно их импортировать с папки app/libs
*  Для того, что бы сгенерировать сетку в консоли прописать "gulp grid", потом переименовать файл sass/smartgrid.scss в sass/_smartgrid
*  Все переменные и миксины в файле _vars.scss
*  Шрифты в папке fonts/ и подключать в файле fonts.scss
*  В папке templates/ находятся html, которые одинаковые на нескольких страницах, подключаются через processhtml
*  Про processhtml читать тут https://npmjs.com/package/grunt-processhtml
*  Cтили для этих html в файле sass/templates-styles
*  Пути писать вручную к библиотекам js в таске 'scripts-libs'
*  На выходе минифицированый js и css код
*/


function grid() {
    let smartGridSettings = {
        outputStyle: 'scss',
        /* less || scss || sass || styl */
        columns: 12,
        /* number of grid columns */
        offset: '20px',
        /* gutter width px || % || rem */
        mobileFirst: false,
        /* mobileFirst ? 'min-width' : 'max-width' */
        container: {
            maxWidth: '1650px',
            fields: '15px',
            /* max-width оn very large screen */
            /*fields: '15px'*/ /* side fields */
        },
        breakPoints: {

            lg: {
                width: '1100px',
                fields: '15px',
            },
            md: {
                width: '960px',
                fields: '15px',
            },
            sm: {
                width: '780px',
                fields: '15px',
            },
            xs: {
                width: '560px',
                fields: '15px',
            },
            xxs: {
                width: '420px',
                fields: '15px',
            },
            /*	We can create any quantity of break points.
                some_name: {
                    width: 'Npx',
                    fields: 'N(px|%|rem)',
                    offset: 'N(px|%|rem)'
                } */
        }
    };
    smartgrid('app/sass', smartGridSettings); //генерация smart-grid
}

gulp.task('grid', async function () {
    grid(); // если нужно перебилдить сетку, то в терминал gulp smart-grid  и потом переименовать файл в _smart-grid.scss
});

gulp.task('sass', function () { // Создаем таск Sass
    return gulp.src('app/sass/**/*.scss', ['sass']) // Берем источник
        .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
        .pipe(autoprefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true})) // Создаем префиксы
        .pipe(gcmq()) // Групируем медиа запросы
        .pipe(cleanCss({level: 2})) // Сжимаем
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
});

/*gulp.task('browser-sync', function () { // Создаем таск browser-sync
    browserSync.init({ // Выполняем browserSync
        proxy: "comments",
        notify: true, // Отключаем уведомления
    });
});*/

gulp.task('scripts-libs', function () {
    return gulp.src([ // Берем все необходимые библиотеки, библиотеки устанавливать через bower
        'app/libs/jquery/dist/jquery.min.js',
        'app/libs/materialize/dist/js/materialize.js'
    ])
        .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
        .pipe(uglify({
            output: {
                comments:  undefined
            }
        })) // Сжимаем JS файл
        .pipe(gulp.dest('app/js')) // Выгружаем в папку app/js
});

gulp.task('scripts-min', function () {
    return gulp.src('app/js/**/*[!libs.min]*.js')
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('dist/js')); // Выгружаем в папку dist/js
});

gulp.task('code', function () {
    return gulp.src('app/*.php')
});

gulp.task('css-libs', function () {
    return gulp.src('app/sass/libs.scss') // Выбираем файл для минификации
        .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(gcmq()) //Групируем медиа запросы
        .pipe(cleanCss({level: 2})) // Сжимаем
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});

gulp.task('clean', async function () {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('img', function () {
    return gulp.src('app/img/**/*') // Берем все изображения из app
        .pipe(cache(imagemin({ // С кешированием
            // .pipe(imagemin({ // Сжимаем изображения без кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))/**/)
        .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});

gulp.task('prebuild', async function () {

    var buildCss = gulp.src( // Переносим css в продакшен
        'app/css/**/*.min.css',
    )
        .pipe(gulp.dest('dist/css'));

    var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
        .pipe(gulp.dest('dist/fonts'));

    var buildJs = gulp.src('app/js/libs.min.js') // Переносим скрипты в продакшен
        .pipe(gulp.dest('dist/js'));

   /* var buildHtml = gulp.src('app/!*.html') // Переносим HTML в продакшен
        .pipe(processhtml())
        .pipe(gulp.dest('dist'));*/

    var buildMain = gulp.src('app/*.php') // Переносим PHP в продакшен
        .pipe(gulp.dest('dist/'));

    var buildPhp = gulp.src('app/php/**/*') // Переносим PHP в продакшен
        .pipe(gulp.dest('dist/php'));

});

gulp.task('clear', function (callback) {
    return cache.clearAll();
});

gulp.task('reload', function (done) { //Этот таск для того, что бы browserSync не перезагружал раньше времени
    browserSync.reload();
    done();
});

gulp.task('watch', function () {
    gulp.watch('app/sass/**/*.scss', gulp.series('sass'/*, 'reload'*/));// Наблюдение за sass файлами
    gulp.watch('app/*.php', gulp.series('code'/*, 'reload'*/));// Наблюдение за PHP файлами в корне проекта
    gulp.watch(['app/js/common.js', 'app/libs/**/*.js'], gulp.series('scripts-libs'/*, 'reload'*/));// Наблюдение за главным JS файлом и за библиотеками
});

gulp.task('default', gulp.parallel('css-libs', 'sass', 'scripts-libs'/*, 'browser-sync'*/, 'watch'));
gulp.task('build', gulp.series(gulp.parallel('prebuild', 'clean', 'img', 'sass', 'scripts-libs'), 'scripts-min'));
