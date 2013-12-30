# Toga

The stupid doc-block parser. Generates an abstract syntax tree based on a customizable regular-expression grammar. Defaults to C-style comment blocks, so it supports JavaScript, PHP, C++, and even CSS right out of the box.

Tags are parsed greedily. If it looks like a tag, it's a tag. What you do with them is completely up to you. Render something human-readable, perhaps?

[![Build Status](https://travis-ci.org/shannonmoeller/toga.png?branch=master)](https://travis-ci.org/shannonmoeller/toga)
[![NPM version](https://badge.fury.io/js/toga.png)](http://badge.fury.io/js/toga)
[![Dependency Status](https://gemnasium.com/shannonmoeller/toga.png)](https://gemnasium.com/shannonmoeller/toga)
[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/shannonmoeller/toga/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

## Install

With [Node.js](http://nodejs.org):

    $ npm install toga

With [Bower](http://bower.io):

    $ bower install shannonmoeller/toga

With [Component](http://component.io):

    $ component install shannonmoeller/toga

## Documentation Blocks

Documentation blocks follow the conventions of other standard tools such as JSDoc, Google Closure, YUIDoc, PHPDoc, JavaDoc, etc. The primary difference is that nothing is inferred from the code. If you want it documented, you must document it. This is why you can use Toga to parse inline documentation out of almost any language that supports multi-line comments.

## API

### `new Toga([grammar])`

- `grammar` `{Object}` Optional grammar overrides.
  - `grammar.blockSplit` `{RegExp}`
  - `grammar.blockParse` `{RegExp}`
  - `grammar.tagSplit` `{RegExp}`
  - `grammar.tagParse` `{RegExp}`
  - `grammar.indent` `{RegExp}`
  - `grammar.named` `{RegExp}`

Creates a reusable parser based on the given grammar. Defaults to parsing C-style comment blocks.

#### `.parse(block, [options]) : Array.<Object>`

- `block` `{String}` Block of code containing comments to parse.
- `options` `{Object}` Parsing options.
  - `options.raw` `{Boolean}` Whether to include the raw source with tokens. _Default: false_

Generates a sensible syntax tree format of doc-blocks and surrounding code.

### `toga(block, [grammar]) : Array.<Object>`

Functional shorthand, if that's how you operate.

## Example

### Shorthand

    var toga = require('toga');
    var tokens = toga('/** ... */');

### Shorthand with Custom Grammar

    var toga = require('toga');
    var tokens = toga('{{!--- ... --}}\n<div> ...', {
        blockSplit: /(^[\t ]*\{\{!---(?!-)[\s\S]*?\s*--\}\})/m,
        blockParse: /^[\t ]*\{\{!---(?!-)([\s\S]*?)\s*--\}\}/m,
        indent: /^[\t !]/gm,
        named: /^(arg(gument)?|data|prop(erty)?)$/
    });

### Full Example with Reusable Parser

    var Toga = require('toga');

    var parser = new Toga({
        blockSplit: /(^=doc\n[\s\S]*?\n=cut$)/m,
        blockParse: /^=doc\n([\s\S]*?)\n=cut$/m,
        named: /^(arg(gument)?|data|prop(erty)?)$/
    });

    var tokens = parser.parse('=doc\n ... \n=cut');

## Test

    $ npm test

[![Browser Support](http://ci.testling.com/shannonmoeller/toga.png)](http://ci.testling.com/shannonmoeller/toga)

## License

MIT
