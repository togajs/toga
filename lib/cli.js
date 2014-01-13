'use strict';

var cmd = require('commander');
var gulp = require('gulp');
var toga = require('./toga');
var pkg = require('../package.json');

var list = function(str) {
    return str.split(',');
};

cmd
    .version(pkg.version)
    .option('-o, --out [dir]', 'Output directory. [docs]', 'docs')
    .option('-u, --use [plugin,...]', 'Plugins to use.', list, [])
    .parse(process.argv);

if (cmd.args.length === 0) {
    cmd.args.push('*.*');
}

if (cmd.use.length !== 0) {
    toga.use(cmd.use);
}

gulp
    .src(cmd.args)
    .pipe(toga)
    .pipe(gulp.dest(cmd.out));
