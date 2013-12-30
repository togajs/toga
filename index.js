!function(e){"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define(e):"undefined"!=typeof window?window.toga=e():"undefined"!=typeof global?global.toga=e():"undefined"!=typeof self&&(self.toga=e())}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var copier = require('copier');

/**
 * Matches start of each line. Useful for getting a count of all lines.
 *
 * @type {RegExp}
 */
var linePattern = /^/gm;

/**
 * Matches empty lines. Useful for getting a count of empty lines.
 *
 * @type {RegExp}
 */
var emptyLinePattern = /^$/gm;

/**
 * Matches surrounding empty lines to be trimmed.
 *
 * @type {RegExp}
 */
var edgeEmptyLinesPattern = /^[\t ]*\n|\n[\t ]*$/g;

/**
 * Default C-style grammar.
 *
 * @type {Object.<String,RegExp>}
 */
var defaultGrammar = {
    // Matches block delimiters
    blockSplit: /(^[\t ]*\/\*\*(?!\/)[\s\S]*?\s*\*\/)/m,

    // Matches block content
    blockParse: /^[\t ]*\/\*\*(?!\/)([\s\S]*?)\s*\*\//m,

    // Matches indent characters
    indent: /^[\t \*]/gm,

    // Matches tag delimiters
    tagSplit: /^[\t ]*@/m,

    // Matches tag content `tag {Type} [name] - Description.`
    tagParse: /^(\w+)[\t \-]*(\{[^\}]+\})?[\t \-]*(\[[^\]]*\]\*?|\S*)?[\t \-]*([\s\S]+)?$/m,

    // Matches tags that should include a name property
    named: /^(arg(ument)?|augments|class|extends|method|param|prop(erty)?)$/
};

/**
 * Default options.
 *
 * @type {Object}
 */
var defaultOptions = {
    raw: false
};

/**
 * # Toga
 *
 * The stupid doc-block parser. Generates an abstract syntax tree based on a
 * customizable regular-expression grammar. Defaults to C-style comment blocks,
 * so it supports JavaScript, PHP, C++, and even CSS right out of the box.
 *
 * Tags are parsed greedily. If it looks like a tag, it's a tag. What you do
 * with them is completely up to you. Render something human-readable, perhaps?
 *
 * @class Toga
 * @param {String} [block]
 * @param {Object} [grammar]
 * @constructor
 */
function Toga(block, grammar) {
    // Make `block` optional
    if (arguments.length === 1 && block && typeof block === 'object') {
        grammar = block;
        block = undefined;
    }

    // Support functional execution: `toga(block, grammar)`
    if (!(this instanceof Toga)) {
        return new Toga(grammar).parse(block);
    }

    // Set defaults
    this.grammar = copier({}, defaultGrammar, grammar);
    this.options = copier({}, defaultOptions);

    // Enforce context
    this.parse = this.parse.bind(this);
    this.parseBlock = this.parseBlock.bind(this);
    this.parseCode = this.parseCode.bind(this);
    this.parseDocBlock = this.parseDocBlock.bind(this);
    this.parseTag = this.parseTag.bind(this);
}

/**
 * @method parse
 * @param {String} block
 * @param {String} [options]
 * @return {String}
 */
Toga.prototype.parse = function(block, options) {
    if (arguments.length === 2) {
        this.options = copier({}, defaultOptions, options);
    }

    return String(block)
        .split(this.grammar.blockSplit)
        .map(this.parseBlock);
};

/**
 * @method parseBlock
 * @param {String} [block]
 * @return {Object}
 */
Toga.prototype.parseBlock = function(block) {
    if (this.grammar.blockParse.test(block)) {
        return this.parseDocBlock(block);
    }

    return this.parseCode(block);
};

/**
 * @method parseCode
 * @param {String} [block]
 * @return {Object}
 */
Toga.prototype.parseCode = function(block) {
    return {
        type: 'Code',
        body: String(block)
    };
};

/**
 * @method parseDocBlock
 * @param {String} [block]
 * @return {Object}
 */
Toga.prototype.parseDocBlock = function(block) {
    block = String(block);

    var tags = this
        .normalizeDocBlock(block)
        .split(this.grammar.tagSplit);

    var token = {
        type: 'DocBlock',
        description: tags.shift(),
        tags: tags.map(this.parseTag)
    };

    if (this.options.raw) {
        token.raw = block;
    }

    return token;
};

/**
 * @method normalizeDocBlock
 * @param {String} block
 * @return {String}
 */
Toga.prototype.normalizeDocBlock = function(block) {
    var grammar = this.grammar;

    // Trim comment wrappers
    var blockParse = grammar.blockParse;

    block = String(block)
        .replace(blockParse, '$1')
        .replace(edgeEmptyLinesPattern, '');

    // Unindent content
    var emptyLines;
    var indentedLines;
    var indent = grammar.indent;
    var lines = block.match(linePattern).length;

    while (lines > 0) {
        emptyLines = (block.match(emptyLinePattern) || []).length;
        indentedLines = (block.match(indent) || []).length;

        if (indentedLines && (emptyLines + indentedLines === lines)) {
            // Strip leading indent character
            block = block.replace(indent, '');
        } else {
            // Not indented anymore
            break;
        }
    }

    return block;
};

/**
 * @method parseTag
 * @param {String} [block]
 * @return {Object}
 */
Toga.prototype.parseTag = function(block) {
    var grammar = this.grammar;
    var parts = String(block).match(grammar.tagParse);
    var id = parts[1];
    var type = parts[2];
    var name = parts[3] || '';
    var description = parts[4] || '';
    var token = {};

    // Handle named tags
    if (!grammar.named.test(id)) {
        if (name && description) {
            description = name + ' ' + description;
        } else if (name) {
            description = name;
        }

        name = undefined;
    }

    // Keep tokens light

    if (id) {
        token.tag = id;
    }

    if (type) {
        token.type = type;
    }

    if (name) {
        token.name = name;
    }

    if (description) {
        token.description = description;
    }

    return token;
};

module.exports = Toga;

},{"copier":2}],2:[function(require,module,exports){
/*jshint node:true */
/**
 * @fileOverview
 * copy Declaration File
 *
 * @author Shannon Moeller
 * @version 1.0
 */

'use strict';

/**
 * Copies the enumerable properties of one or more objects to a target object.
 *
 * @param {Object} target Target object.
 * @param {...Object} objs Objects with properties to copy.
 * @return {Object} Target object, augmented.
 */
module.exports = function copy(target) {
    var arg, i, key, len;
    var args = arguments;

    for (i = 1, len = args.length; i < len; i += 1) {
        arg = args[i];

        for (key in arg) {
            if (arg.hasOwnProperty(key)) {
                target[key] = arg[key];
            }
        }
    }

    return target;
};

},{}]},{},[1])
(1)
});