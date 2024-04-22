const gulp = require('gulp')
const fileInclude = require('gulp-file-include')
const sass = require('gulp-sass')(require('sass'))
const sassGlob = require('gulp-sass-glob')
const server = require('gulp-server-livereload')
const clean = require('gulp-clean')
const fs = require('fs')
const sourceMaps = require('gulp-sourcemaps')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const webpack = require('webpack-stream')
const babel = require('gulp-babel')
const imagemin = require('gulp-imagemin')
const changed = require('gulp-changed')
const typograf = require('gulp-typograf')
const svgsprite = require('gulp-svg-sprite')
const replace = require('gulp-replace')
const imageminWebp = require('imagemin-webp')
const rename = require('gulp-rename')
const prettier = require('@bdchauvette/gulp-prettier')

gulp.task('clean:docs', function(done) {
  if (fs.existsSync('./docs/')) {
    return gulp.src('./docs/', { read: false }).pipe(clean({ force: true }))
  }
  done()
})

const fileIncludeSetting = {
  prefix: '@@',
  basepath: '@file',
}

const plumberNotify = (title) => {
  return {
    errorHandler: notify.onError({
      title: title,
      message: 'Error <%= error.message %>',
      sound: false,
    }),
  }
}

gulp.task('html:docs', function() {
  return gulp
    .src([
      './src/html/**/*.html',
      '!./**/blocks/**/*.*',
      '!./src/html/docs/**/*.*',
    ])
    .pipe(changed('./docs/', { hasChanged: changed.compareContents }))
    .pipe(plumber(plumberNotify('HTML')))
    .pipe(fileInclude(fileIncludeSetting))
    .pipe(
      replace(/<img(?:.|\n|\r)*?>/g, function(match) {
        return match.replace(/\r?\n|\r/g, '').replace(/\s{2,}/g, ' ')
      })
    ) //удаляет лишние пробелы и переводы строк внутри тега <img>
    .pipe(
      replace(
        /(?<=src=|href=|srcset=)(['"])(\.(\.)?\/)*(img|images|fonts|css|scss|sass|js|files|audio|video)(\/[^\/'"]+(\/))?([^'"]*)\1/gi,
        '$1./$4$5$7$1'
      )
    )
    .pipe(
      typograf({
        locale: ['ru', 'en-US'],
        htmlEntity: { type: 'digit' },
        safeTags: [
          ['<\\?php', '\\?>'],
          ['<no-typography>', '</no-typography>'],
        ],
      })
    )

    .pipe(
      prettier({
        tabWidth: 4,
        useTabs: true,
        printWidth: 182,
        trailingComma: 'es5',
        bracketSpacing: false,
      })
    )
    .pipe(gulp.dest('./docs/'))
})

gulp.task('sass:docs', function() {
  return gulp
    .src('./src/scss/*.scss')
    .pipe(changed('./docs/css/'))
    .pipe(plumber(plumberNotify('SCSS')))
    .pipe(sourceMaps.init())
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(
      replace(
        /(['"]?)(\.\.\/)+(img|images|fonts|css|scss|sass|js|files|audio|video)(\/[^\/'"]+(\/))?([^'"]*)\1/gi,
        '$1$2$3$4$6$1'
      )
    )
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('./docs/css/'))
})

gulp.task('images:docs', function() {
  return (
    gulp
      .src(['./src/img/**/*', '!./src/img/svgicons/**/*'])
      .pipe(changed('./docs/img/'))
      .pipe(
        imagemin([
          imageminWebp({
            quality: 85,
          }),
        ])
      )
      .pipe(rename({ extname: '.webp' }))
      .pipe(gulp.dest('./docs/img/'))
      .pipe(gulp.src(['./src/img/**/*', '!./src/img/svgicons/**/*']))
      .pipe(changed('./docs/img/'))
      // .pipe(imagemin({ verbose: true }))
      .pipe(gulp.dest('./docs/img/'))
  )
})

const svgStack = {
  mode: {
    stack: {
      example: true,
    },
  },
  shape: {
    transform: [
      {
        svgo: {
          js2svg: { indent: 4, pretty: true },
        },
      },
    ],
  },
}

const svgSymbol = {
  mode: {
    symbol: {
      sprite: '../sprite.symbol.svg',
    },
  },
  shape: {
    transform: [
      {
        svgo: {
          js2svg: { indent: 4, pretty: true },
          plugins: [
            {
              name: 'removeAttrs',
              params: {
                attrs: '(fill|stroke)',
              },
            },
          ],
        },
      },
    ],
  },
}

gulp.task('svgStack:docs', function() {
  return gulp
    .src('./src/img/svgicons/**/*.svg')
    .pipe(plumber(plumberNotify('SVG:docs')))
    .pipe(svgsprite(svgStack))
    .pipe(gulp.dest('./docs/img/svgsprite/'))
})

gulp.task('svgSymbol:docs', function() {
  return gulp
    .src('./src/img/svgicons/**/*.svg')
    .pipe(plumber(plumberNotify('SVG:docs')))
    .pipe(svgsprite(svgSymbol))
    .pipe(gulp.dest('./docs/img/svgsprite/'))
})

gulp.task('files:docs', function() {
  return gulp
    .src('./src/files/**/*')
    .pipe(changed('./docs/files/'))
    .pipe(gulp.dest('./docs/files/'))
})

gulp.task('js:docs', function() {
  return (
    gulp
      .src('../src/js/*.js')
      .pipe(changed('./docs/js/'))
      .pipe(plumber(plumberNotify('JS')))
      // .pipe(babel())
      .pipe(webpack(require('./../webpack.config.js')))
      .pipe(gulp.dest('./docs/js/'))
  )
})

const serverOptions = {
  livereload: true,
  open: true,
}

gulp.task('server:docs', function() {
  return gulp.src('./docs/').pipe(server(serverOptions))
})

gulp.task('watch:docs', function() {
  gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:docs'))
  gulp.watch(
    ['./src/html/**/*.html', './src/html/**/*.json'],
    gulp.parallel('html:docs')
  )
  gulp.watch('./src/img/**/*', gulp.parallel('images:docs'))
  gulp.watch('./src/files/**/*', gulp.parallel('files:docs'))
  gulp.watch('./src/js/**/*.js', gulp.parallel('js:docs'))
  gulp.watch(
    './src/img/svgicons/*',
    gulp.series('svgStack:docs', 'svgSymbol:docs')
  )
})
