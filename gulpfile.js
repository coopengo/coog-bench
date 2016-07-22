var gulp = require('gulp');
gulp.paths = {
  lib: {
    src: [
    	'./sources/*.{js,json}',
    	'./sources/**/*.{js,json}',
    	'./sources/**/**/*.{js,json}'
    ],
    dest: './dist',
    jshintrc: './.jshintrc',
    jsbeautifyrc: './.jsbeautifyrc',
  }
};
require('require-dir')('./gulp');
gulp.task('default', ['check']);
