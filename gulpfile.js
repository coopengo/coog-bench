var gulp = require('gulp');
gulp.paths = {
  lib: {
    src: ['./**/*.{js,json}', '!./package.json', '!./node_modules/**',
      '!js/main.js'
    ],
    dest: '.',
    jshintrc: './.jshintrc',
    jsbeautifyrc: './.jsbeautifyrc',
  }
};
require('require-dir')('./gulp');
gulp.task('default', ['check']);
