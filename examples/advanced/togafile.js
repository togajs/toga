'use strict';

var toga = require('toga'),
    css = require('toga-css'),
    js = require('toga-js'),
    perl = require('toga-perl'),
    md = require('toga-markdown'),
    sample = require('toga-sample'),
    pod = require('toga-pod'),
    pura = require('toga-pura'),

    config = {
        manual: './src/assets/**/*.md',
        css: './src/assets/**/*.css',
        js: './src/assets/**/*.js',
        perl: './lib/**/*.{pl,pm}',
        dest: './web/docs'
    },

    manual = toga
        .src(config.manual)
        .pipe(md.parser())
        .pipe(md.formatter()),

    client = toga
        .src(config.css)
        .pipe(css.parser())
        .pipe(js.parser())
        .pipe(sample.formatter())
        .pipe(md.formatter()),

    server = toga
        .src(config.perl)
        .pipe(perl.parser())
        .pipe(pod.formatter());

toga
    .join(manual, client, server)
    .pipe(pura.compiler())
    .pipe(toga.dest(config.dest));
