'use strict';

var copier = require('copier');
var marked = require('marked');

/**
 * @type Object
 */
var defaults = {
    // Matches `/**`
    blockStart: /\/\*\*/,

    // Matches `*/`
    blockEnd: /\*\//,

    // Matches leading tabs and spaces
    indent: /^[\t ]*/,

    // Matches leading whitespace and ` * `
    leader: /[\t ]*(\*[\t ]?)?/,

    // Matches leading whitespace and `@`
    tagSplit: /[\t ]*@/,

    // Matches:
    // - `tag {Type} [name] Description.`
    // - `tag {Type} Description.`
    // - `tag [name] Description.`
    // - `tag Description.`
    // - `tag`
    tagParse: /^(\w+)[\t ]*(\{[^\}]+\})?[\t ]*(\[[^\]]*\]\*?|\S*)?[\t ]*([\s\S]+)?$/,

    // Matches tags that should include a name property
    named: /^(class|method|property|param)$/
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
    this.parseComment = this.parseComment.bind(this);
    this.parseTag = this.parseTag.bind(this);

    this.setOptions(options);
}

/**
 * @method setOptions
 * @param {Object} options
 * @chainable
 */
Toga.prototype.setOptions = function(options) {
    options = copier({}, options, defaults);

    var blockStart = String(options.blockStart).slice(1, -1);
    var blockEnd = String(options.blockEnd).slice(1, -1);

    options.blockSplit = new RegExp(
        '([\\t ]*' + blockStart + '[\\s\\S]+?' + blockEnd + ')'
    );

    options.blockWrap = new RegExp(
        '(^\\s*' + blockStart + '|' + blockEnd + '\\s*$)',
        'g'
    );

    this.options = options;

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
    if (!this.options.blockSplit.test(block)) {
        return this.parseCode(block);
    }

    return this.parseComment(block);
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
 * @method parseComment
 * @param {String} [block]
 * @return {Object}
 */
Toga.prototype.parseComment = function(block) {
    var clean = this.normalizeComment(block);
    var tags = clean.split(this.options.tagSplit);
    var description = tags.shift();

    return {
        type: 'comment',
        description: marked(description),
        tags: tags.map(this.parseTag),
        raw: block
    };
};

/**
 * @method normalizeComment
 * @param {String} block
 * @return {String}
 */
Toga.prototype.normalizeComment = function(block) {
    var options = this.options;
    var indent = block.match(options.indent)[0];

    var leader = new RegExp(
        '^' + indent + String(options.leader).slice(1, -1),
        'gm'
    );

    return block
        .replace(options.blockWrap, '')
        .replace(leader, '');
};

/**
 * @method parseTag
 * @param {String} [block]
 * @return {Object}
 */
Toga.prototype.parseTag = function(block) {
    var parts = block.match(this.options.tagParse);
    var tag = parts[1] || '';
    var type = parts[2] || '';
    var name = parts[3] || '';
    var description = parts[4];

    if (!this.options.named.test(tag)) {
        description = name + ' ' + description;
        name = undefined;
    }

    return {
        tag: tag || undefined,
        type: type || undefined,
        name: name || undefined,
        description: marked(description) || undefined,
        raw: '@' + block
    };
};

module.exports = Toga;
