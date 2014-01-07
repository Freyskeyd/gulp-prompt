# Gulp prompt

Add interaction to gulp tasks.

## Confirm

Default message and false value as default value:
```javascript
gulp.task('default', function () {

  gulp.src('test.js')
      .pipe(prompt.confirm())
      .pipe(gulp.dest('dest'));

});
```

Custom message and false value as default value:
```javascript
gulp.task('default', function () {

  gulp.src('test.js')
      .pipe(prompt.confirm('Are you ready for Gulp?'))
      .pipe(gulp.dest('dest'));
});
```

Custom message and true value as default value:
```javascript
gulp.task('default', function () {

  gulp.src('test.js')
      .pipe(prompt.confirm(
        {
          message: 'Are you ready for Gulp?',
          default: true
        })
      )
      .pipe(gulp.dest('dest'));

});
```

Example Checkbox:
```javascript
var gulp = require('gulp'),
    prompt = require('./index'),
    _ = require('lodash');

gulp.task('testJS', function () {
    console.log('testJS');
});

gulp.task('testCss', function () {
    console.log('testCSS');
});

gulp.task('default', function () {

    var tasks = _.chain(gulp.tasks).keys().without('default').value();
    
    gulp.src('gulpfile.js')
        .pipe(prompt.checkbox('choice', tasks, function (val, file, async) {
            
            gulp.run.apply(gulp, val);

        }));
});
```