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
      .pipe(prompt.confirm({
        message: 'Are you ready for Gulp?',
        default:true
        }))
      .pipe(gulp.dest('dest'));

});
```