const gulp = require('gulp')
const del = require('del')

gulp.task('clean-lib', function (callback) {
  del('lib/**')
  callback()
})

gulp.task('prebuild', gulp.series('clean-lib', function() {
  return gulp
    .src(['package.json', 'README.md', 'LICENSE'])
    .pipe(gulp.dest('lib/'))
}))
