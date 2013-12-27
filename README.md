# Toga

> Yet another doc-block parser. Based on a customizable regular-expression grammar. Defaults to C-style comment blocks, so it supports JavaScript, C, PHP, Java, and even CSS right out of the box.

Generates a single array of tokens with tags per given blob of text. Tags are parsed greedily. If it looks like a tag, it's a tag. How you handle them is completely up to you.

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

## API

## Example

### Simple

    var toga = require('toga');
    var tokens = toga('/** ... */');

### Custom

    var toga = require('toga');
    var tokens = toga('<!-- ... -->', {
        blockStart: /<!--/,
        blockEnd: /-->/
    });

### Fancy

    var Toga = require('toga');

    var parser = new Toga({
        blockStart: /<!--/,
        blockEnd: /-->/
    });

    var tokens = parser.parse('<!-- ... -->');

## Test

    $ npm test

[![Browser Support](http://ci.testling.com/shannonmoeller/toga.png)](http://ci.testling.com/shannonmoeller/toga)

## License

MIT
