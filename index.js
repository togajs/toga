'use strict';

var proto,
	vs = require('vinyl-fs');

/**
 * @class Toga
 *
 * @constructor
 * @param {Object} options
 */
function Toga(options) {
	options = options || {};

	/**
	 * @property options
	 * @type {Object}
	 */
	this.options = options;
}

proto = Toga.prototype;

/**
 * @method src
 * @param {String|Array.<String>} glob
 * @return {Stream}
 */
proto.src = vs.src;

/**
 * @method dest
 */
proto.dest = vs.dest;

proto.Toga = Toga;

module.exports = new Toga();
