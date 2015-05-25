'use strict';

var toga = require('toga'),
    css = require('toga-css'),
    js = require('toga-js'),
    md = require('toga-markdown'),
    pura = require('toga-pura'),

    config = {
        src: [
            './src/docs/**/*.md',
            './src/assets/**/*.css',
            './src/assets/**/*.js'
        ],
        dest: './web/docs'
    };

toga
    .src(config.src)
    .pipe(css.parser())
    .pipe(js.parser())
    .pipe(md.formatter())
    .pipe(pura.compiler())
    .pipe(toga.dest(config.dest));
