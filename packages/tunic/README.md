# `tunic`

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url] [![Build Status][travis-img]][travis-url] [![Coverage Status][coveralls-img]][coveralls-url] [![Chat][gitter-img]][gitter-url] [![Tip][amazon-img]][amazon-url]

A documentation-block parser. Generates a [DocTree][doctree] abstract syntax tree using a customizable regular-expression grammar. Defaults to parsing C-style comment blocks, so it supports C, C++, Java, JavaScript, PHP, and even CSS right out of the box.

Documentation blocks follow the conventions of other standard tools such as Javadoc, JSDoc, Google Closure, PHPDoc, etc. The primary difference is that nothing is inferred from the code. If you want it documented, _you_ must document it. This is why you can use `tunic` to parse inline documentation out of almost any language that supports multi-line comments.

Tags are parsed greedily. If it looks like a tag, it's a tag. What you do with them is completely up to you. Render something human-readable, perhaps?

## Install

```
$ npm install --save tunic
```

## Usage

```js
var tunic = require('tunic');

// parse javadoc-style comments
var jsDocAst = tunic.parse('/** ... */');

// parse Mustache and Handlebars comments
var hbDocAst = tunic.parse('{{!--- ... --}}', {
    blockIndent: /^[\t !]/gm,
    blockParse: /^[\t ]*\{\{!---(?!-)([\s\S]*?)\s*--\}\}/m,
    blockSplit: /(^[\t ]*\{\{!---(?!-)[\s\S]*?\s*--\}\})/m,
    namedTags: ['element', 'attribute']
});
```

Or with ES6:

```js
import {parse} from 'tunic';

// parse perlpod-style comments
const perlDocAst = parse('=pod\n ... \n=cut', {
    blockParse: /^=pod\n([\s\S]*?)\n=cut$/m,
    blockSplit: /(^=pod\n[\s\S]*?\n=cut$)/m,
    tagSplit: false
});
```

## API

### `tunic.parse(code[, grammar]) : DocTree`

- `code` `{String}` - Block of code containing comments to parse.
- `grammar` `{?Object}` - Optional grammar definition.
  - `blockIndent` `{RegExp}` - Matches any valid leading indentation characters, such as whitespace or asterisks. Used for unwrapping comment blocks.
  - `blockParse` `{RegExp}` - Matches the content of a comment block, where the first capturing group is the content without the start and end comment characters. Used for normalization.
  - `blockSplit` `{RegExp}` - Splits code and docblocks into alternating chunks.
  - `tagParse` `{RegExp}` - Matches the various parts of a tag where parts are captured in the following order:
    - 1: `tag`
    - 2: `type`
    - 3: `name`
    - 4: `description`
  - `tagSplit` `{RegExp}` - Matches characters used to split description and tags from each other.
  - `namedTags` `{Array.<String>}` - Which tags should be considered "named" tags. Non-named tags will have their name prepended to the description and set to `undefined`.

Parses a given string and returns the resulting DocTree AST object. Defaults to parsing C-style comment blocks.

## Languages

Several pre-defined [grammars][grammars] are available. To use, import the desired grammar and pass it to the parser.

```js
var parse = require('tunic').parse;
var grammar = require('tunic/grammars/css');

var cssDocAst = parse('/** ... */', grammar); // -> ast object
```

Or with ES6:

```js
import {parse} from 'tunic';
import * as grammar from 'tunic/grammars/css';

const cssDocAst = parse('/** ... */', grammar); // -> ast object
```

## Test

```
$ npm test
```

## Contribute

[![Tasks][waffle-img]][waffle-url]

Standards for this project, including tests, code coverage, and semantics are enforced with a build tool. Pull requests must include passing tests with 100% code coverage and no linting errors.

----

© 2016 Shannon Moeller <me@shannonmoeller.com>

Licensed under [MIT](http://shannonmoeller.com/mit.txt)

[doctree]:       https://github.com/togajs/doctree
[grammars]:      https://github.com/togajs/tunic/tree/master/src/grammars
[jsnext]:        https://github.com/rollup/rollup/wiki/jsnext:main

[amazon-img]:    https://img.shields.io/badge/amazon-tip_jar-yellow.svg?style=flat-square
[amazon-url]:    https://www.amazon.com/gp/registry/wishlist/1VQM9ID04YPC5?sort=universal-price
[coveralls-img]: http://img.shields.io/coveralls/togajs/tunic/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/togajs/tunic
[downloads-img]: http://img.shields.io/npm/dm/tunic.svg?style=flat-square
[gitter-img]:    http://img.shields.io/badge/gitter-join_chat-1dce73.svg?style=flat-square
[gitter-url]:    https://gitter.im/togajs/toga
[npm-img]:       http://img.shields.io/npm/v/tunic.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/tunic
[travis-img]:    http://img.shields.io/travis/togajs/tunic.svg?style=flat-square
[travis-url]:    https://travis-ci.org/togajs/tunic
[waffle-img]:    http://img.shields.io/github/issues/togajs/tunic.svg?style=flat-square
[waffle-url]:    http://waffle.io/togajs/tunic
