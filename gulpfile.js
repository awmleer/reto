const gulp = require('gulp')
const del = require('del')
const rollupConfig = require('./rollup.config')
const rollup = require('rollup')
const ts = require('gulp-typescript')

gulp.task('clean-lib', async function() {
  await del('lib/**')
})

gulp.task('copy-files', function() {
  return gulp
    .src(['package.json', 'README.md', 'LICENSE'])
    .pipe(gulp.dest('lib/'))
})

gulp.task('ts', function() {
  const tsProject = ts.createProject('tsconfig.json')
  return tsProject.src()
    .pipe(tsProject())
    .pipe(gulp.dest('lib'))
})

gulp.task('rollup', gulp.series(
  function() {
    const tsProject = ts.createProject('tsconfig.json', {
      module: 'esnext',
    })
    return tsProject.src()
      .pipe(tsProject())
      .pipe(gulp.dest('lib/es'))
  },
  async function() {
    const bundle = await rollup.rollup(rollupConfig)
    return await bundle.write(rollupConfig.output)
  },
  async function() {
    await del('lib/es')
  }
))

gulp.task('build', gulp.series('clean-lib', 'rollup', 'ts', 'copy-files'))
