# `toga`

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url]

<!--
One tool and one destination for all project documentation including user guides, developer guides, styleguides, and api documentation for both front and back-end technologies. Source code for an entire project is streamed into documentation via [Transform Streams](http://nodejs.org/api/stream.html#stream_class_stream_transform) a la [gulp](http://gulpjs.com/).

## Install

Module:

    $ npm install --save-dev toga

CLI:

    $ npm install --global toga

## Usage

```
Usage: toga [options]

Options:
  -c, --config   Specify configuration file [togafile.js]
  -d, --cwd      Specify working directory [.]
  -h, --help     Show help
  -v, --version  Show version number
```

## API

```js
var toga = require('toga'); // Loads toga.

toga.src(files);        // Just `require('vinyl-fs').src`.
toga.dest(directory);   // Just `require('vinyl-fs').dest`.

toga.add(...streams);   // Turns streams into tributaries of another.
toga.map(callback);     // Turns a map function into a transform stream.
toga.merge(...streams); // Turns multiple readable streams into one.
```

## Example `togafile.js`

### Basic

```js
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
```

### Advanced

```js
var toga = require('toga'),
    css = require('toga-css'),
    js = require('toga-js'),
    perl = require('toga-perl'),
    md = require('toga-markdown'),
    sample = require('toga-sample'),
    pod = require('toga-pod'),
    pura = require('toga-pura'),

    config = {
        manual: [
            './README.md',
            './src/assets/docs/*.md',
        ],
        css: './src/assets/css/*.css',
        js: './src/assets/js/*.js',
        perl: './lib/**/*.{pl,pm}',
        dest: './web/docs'
    },

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
    .src(config.manual)
    .pipe(md.parser())
    .pipe(md.formatter())
    .pipe(toga.add(client, server))
    .pipe(pura.compiler({
        index: './README.md'
    }))
    .pipe(toga.dest(config.dest));
```
-->

[downloads-img]: http://img.shields.io/npm/dm/toga.svg?style=flat-square
[npm-img]:       http://img.shields.io/npm/v/toga.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/toga
