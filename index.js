'use strict';

/**
 * # Toga
 */

var proto,
	multistream = require('multistream'),
	vinyl = require('vinyl-fs');

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
proto.src = vinyl.src;

/**
 * @method dest
 * @param {String} dir
 * @param {Object=} options
 * @param {Function=} callback
 * @return {Stream}
 */
proto.dest = vinyl.dest;

/**
 * @method join
 * @param {Stream...|Array.<Stream>} argv
 * @return {Stream}
 */
proto.join = multistream.obj;

/**
 * @property Toga
 * @type {Toga}
 * @static
 */
proto.Toga = Toga;

module.exports = new Toga();
