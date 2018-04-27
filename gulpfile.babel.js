'use strict';

import fs from 'fs';
import gulp from 'gulp4';
import plugins from 'gulp-load-plugins';
import yargs from 'yargs';

// Load all Gulp plugins into one variable
const $ = plugins();

// Check for --production flag
const PRODUCTION = !!(yargs.argv.production);
if (PRODUCTION) console.log($.util.colors.inverse.cyan('--- Production version in progress ---'));

const hint = () => {
  return gulp.src(['./cockpit/import.js'])
    .pipe($.jshint(Object.assign(
      {}, 
      require('./.jshintrc'),
      { esversion: 6, browser: false, latedef: false, node: true }
    ))) // ES6 (target is Node)
    .pipe($.jshint.reporter('jshint-stylish', { beep: false }));
};

const getVersion = () => {
  return getPackageJson().version;
};

const getPackageJson = () => {
  return JSON.parse(fs.readFileSync('./package.json'));
};

gulp.task('default', hint);
