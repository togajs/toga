**NOTE: This project is under active development. No guarantees. APIs may change.**

# `toga`

> The streaming documentation generator.

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url] [![Build Status][travis-img]][travis-url] [![Coverage Status][coveralls-img]][coveralls-url]

One tool and one destination for all project documentation including user guides, developer guides, styleguides, and api documentation for both front and back-end technologies. Source code for an entire project is streamed into documentation, via [Transform Streams](http://nodejs.org/api/stream.html#stream_class_stream_transform), a la [gulp](http://gulpjs.com/).

## Install

Module:

    $ npm install toga

CLI:

    $ npm install --global toga
    
## Usage

```
Usage: toga [options]

Options:

    -h, --help           output usage information
    -c, --config <file>  specify configuration file [togafile.js]
    -d, --cwd <dir>      specify working directory [.]
    -v, --verbose        log actions as they happen
    -V, --version        output the version number
```

## API

```js
var toga = require('toga'); // Loads toga.

toga.src(files);      // Just `require('vinyl-fs').src`.
toga.dest(directory); // Just `require('vinyl-fs').dest`.
toga.join(stream...); // Just `require('multistream')`.
```

### togafile.js

#### Basic

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

#### Advanced

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
```

## Contribute

[![Tasks][waffle-img]][waffle-url] [![Chat][gitter-img]][gitter-url] [![Tip][gittip-img]][gittip-url]

Standards for this project, including tests, code coverage, and semantics are enforced with a build tool. Pull requests must include passing tests with 100% code coverage and no linting errors.

## Test

    $ npm test

## License

MIT

[coveralls-img]: http://img.shields.io/coveralls/togajs/toga/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/togajs/toga
[downloads-img]: http://img.shields.io/npm/dm/toga.svg?style=flat-square
[gitter-img]:    http://img.shields.io/badge/chat-togajs/toga-blue.svg?style=flat-square
[gitter-url]:    https://gitter.im/togajs/toga
[gittip-img]:    http://img.shields.io/gittip/shannonmoeller.svg?style=flat-square
[gittip-url]:    https://www.gittip.com/shannonmoeller
[npm-img]:       http://img.shields.io/npm/v/toga.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/toga
[travis-img]:    http://img.shields.io/travis/togajs/toga.svg?style=flat-square
[travis-url]:    https://travis-ci.org/togajs/toga
[waffle-img]:    http://img.shields.io/github/issues/togajs/toga.svg?style=flat-square
[waffle-url]:    http://waffle.io/togajs/toga
