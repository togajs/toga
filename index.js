'use strict';

/**
 * # Toga
 */

var proto,
	multi = require('multistream'),
	vs = require('vinyl-fs');

/**
 * @class Toga
 *
 * @constructor
 */
function Toga() {
	if (!(this instanceof Toga)) {
		return new Toga();
	}
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
 * @method join
 * @param {Stream...|Array.<Stream>} argv
 * @return {Stream}
 */
proto.join = multi;

/**
 * @property Toga
 * @type {Toga}
 * @static
 */
proto.Toga = Toga;

module.exports = new Toga();
