'use strict';

/**
 * # Toga
 */

var proto,
	vs = require('vinyl-fs');

/**
 * @class Toga
 *
 * @constructor
 * @param {Object} options
 */
function Toga(options) {
	if (!(this instanceof Toga)) {
		return new Toga(options);
	}

	options = options || {};

	/**
	 * @property options
	 * @type {Object}
	 */
	this.options = options;

	/**
	 * @property stream
	 * @type {Stream}
	 */
	this.stream = null;
}

proto = Toga.prototype;

/**
 * @method src
 * @param {String|Array.<String>} glob
 * @param {Object=} options
 * @return {Stream}
 */
proto.src = vs.src;

/**
 * @method dest
 * @param {String} dir
 * @param {Object=} options
 * @param {Function=} callback
 * @return {Stream}
 */
proto.dest = vs.dest;

/**
 * @method parser
 * @return {Stream}
 */
proto.parser = function (name, options) {
	if (typeof name !== 'string') {
		return name;
	}

	var parser = module.parent.require('toga-parser-' + name);

	return parser(options);
};

/**
 * @method formatter
 * @return {Stream}
 */
proto.formatter = function (name, options) {
	if (typeof name !== 'string') {
		return name;
	}

	var formatter = module.parent.require('toga-formatter-' + name);

	return formatter(options);
};

/**
 * @method compiler
 * @return {Stream}
 */
proto.compiler = function (name, options) {
	if (typeof name !== 'string') {
		return name;
	}

	var compiler = module.parent.require('toga-compiler-' + name);

	return compiler(options);
};

/**
 * @method read
 * @chainable
 */
proto.read = function (glob) {
	var reader = this.src(glob);

	this.stream = reader;

	return this;
};

/**
 * @method parse
 * @chainable
 */
proto.parse = function (name, options) {
	var parser = this.parser(name, options);

	this.stream = this.stream.pipe(parser);

	return this;
};

/**
 * @method format
 * @chainable
 */
proto.format = function (name, options) {
	var formatter = this.formatter(name, options);

	this.stream = this.stream.pipe(formatter);

	return this;
};

/**
 * @method compile
 * @chainable
 */
proto.compile = function (name, options) {
	var compiler = this.compiler(name, options);

	this.stream = this.stream.pipe(compiler);

	return this;
};

/**
 * @method write
 * @chainable
 */
proto.write = function (dir) {
	var writer = this.dest(dir);

	this.stream = this.stream.pipe(writer);

	return this;
};

/**
 * @property Toga
 * @type {Toga}
 * @static
 */
proto.Toga = Toga;

module.exports = new Toga();
