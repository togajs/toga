'use strict';

var copier = require('copier');

/**
 * @type {RegExp}
 */
var linePattern = /^/gm;

/**
 * @type {RegExp}
 */
var emptyLinePattern = /^$/gm;

/**
 * @type {RegExp}
 */
var edgeEmptyLinesPattern = /^[\t ]*\n|\n[\t ]*$/g;

/**
 * Default C-style grammar.
 * @type {Object}
 */
var defaults = {
    // Matches block delimiters
    blockSplit: /(^[\t ]*\/\*\*(?!\/)[\s\S]*?\s*\*\/)/m,

    // Matches block content
    blockParse: /^[\t ]*\/\*\*(?!\/)([\s\S]*?)\s*\*\//m,

    // Matches indent characters
    indent: /^[\t \*]/gm,

    // Matches tag delimiters
    tagSplit: /^[\t ]*@/m,

    // Matches tag content `tag {Type} [name] - Description.`
    tagParse: /^(\w+)[\t ]*(\{[^\}]+\})?[\t ]*(\[[^\]]*\]\*?|\S*)?[\t -]*([\s\S]+)?$/m,

    // Matches tags that should include a name property
    named: /^(arg(ument)?|augments|class|extends|method|param|prop(erty)?)$/
};

/**
 * # Toga
 *
 * Yet another doc-block parser. Based on a customizable regular-expression
 * grammar. Defaults to C-style comment blocks, so it supports JavaScript, C,
 * PHP, Java, and even CSS right out of the box.
 *
 * Generates a single array of tokens with tags per given blob of text. Tags are
 * parsed greedily. If it looks like a tag, it's a tag. How you handle them is
 * completely up to you.
 *
 * @class Toga
 * @param {String} [block]
 * @param {Object} [options]
 * @constructor
 */
function Toga(block, options) {
    if (!(this instanceof Toga)) {
        return new Toga(options).parse(block);
    }

    if (options === undefined && typeof block === 'object') {
        options = block;
        block = null;
    }

    this.parse = this.parse.bind(this);
    this.parseBlock = this.parseBlock.bind(this);
    this.parseCode = this.parseCode.bind(this);
    this.parseDocs = this.parseDocs.bind(this);
    this.parseTag = this.parseTag.bind(this);

    this.setOptions(options);
}

/**
 * @method setOptions
 * @param {Object} options
 * @chainable
 */
Toga.prototype.setOptions = function(options) {
    this.options = copier({}, options, defaults);

    return this;
};

/**
 * @method parse
 * @param {String} [block]
 * @return {String}
 */
Toga.prototype.parse = function(block) {
    return block
        .split(this.options.blockSplit)
        .map(this.parseBlock);
};

/**
 * @method parseBlock
 * @param {String} [block]
 * @return {Object}
 */
Toga.prototype.parseBlock = function(block) {
    if (this.options.blockParse.test(block)) {
        return this.parseDocs(block);
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
        type: 'code',
        raw: block
    };
};

/**
 * @method parseDocs
 * @param {String} [block]
 * @return {Object}
 */
Toga.prototype.parseDocs = function(block) {
    var clean = this.normalizeDocs(block);
    var tags = clean.split(this.options.tagSplit);
    var description = tags.shift();

    return {
        type: 'docs',
        description: description,
        tags: tags.map(this.parseTag),
        raw: block
    };
};

/**
 * @method normalizeDocs
 * @param {String} block
 * @return {String}
 */
Toga.prototype.normalizeDocs = function(block) {
    var options = this.options;
    var blockParse = options.blockParse;
    var indent = options.indent;

    // Trim comment wrappers
    block = block.replace(blockParse, '$1');
    block = block.replace(edgeEmptyLinesPattern, '');

    // Unindent content
    var emptyLines;
    var indentedLines;
    var lines = (block.match(linePattern) || []).length;

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
    var parts = block.match(this.options.tagParse);
    var id = parts[1];
    var type = parts[2];
    var name = parts[3];
    var description = parts[4] || '';
    var tag = {};

    if (name && !this.options.named.test(id)) {
        description = name + ' ' + description;
        name = undefined;
    }

    if (id) {
        tag.tag = id;
    }

    if (type) {
        tag.type = type;
    }

    if (name) {
        tag.name = name;
    }

    if (description) {
        tag.description = description;
    }

    return tag;
};

module.exports = Toga;
