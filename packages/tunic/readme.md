# tunic

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url]

A documentation-block parser. Generates a [DocTree][doctree] abstract syntax tree using customizable regular-expression grammars. Defaults to parsing C-style comment blocks, so it supports C, C++, Java, JavaScript, PHP, and even CSS right out of the box.

Documentation blocks follow the conventions of other standard tools such as Javadoc, JSDoc, Google Closure, PHPDoc, etc. The primary difference is that nothing is inferred from the code. If you want it documented, _you_ must document it. This is why you can use `tunic` to parse inline documentation out of almost any language that supports multi-line comments.

Tags are parsed greedily. If it looks like a tag, it's a tag. What you do with them is completely up to you. Render something human-readable, perhaps?

## Install

```
$ npm install --save @toga/tunic
```

<!--
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

-->

----

MIT © [Shannon Moeller](http://shannonmoeller.com)

[doctree]:       https://github.com/togajs/doctree

[downloads-img]: http://img.shields.io/npm/dm/@toga/toga.svg?style=flat-square
[npm-img]:       http://img.shields.io/npm/v/@toga/toga.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/@toga/toga
