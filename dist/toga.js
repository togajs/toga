'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * # Toga
 *
 * @title Toga
 * @name toga
 */

var _multistream = require('multistream');

var _multistream2 = _interopRequireDefault(_multistream);

var _vinylFs = require('vinyl-fs');

var _vinylFs2 = _interopRequireDefault(_vinylFs);

/**
 * @class Toga
 * @static
 */
exports['default'] = {
	/**
  * @method src
  * @param {String|Array.<String>} glob
  * @param {Object=} options
  * @return {Stream}
  */
	src: _vinylFs2['default'].src,

	/**
  * @method dest
  * @param {String} dir
  * @param {Object=} options
  * @param {Function=} callback
  * @return {Stream}
  */
	dest: _vinylFs2['default'].dest,

	/**
  * @method join
  * @param {Stream...|Array.<Stream>} argv
  * @return {Stream}
  */
	join: _multistream2['default'].obj
};
module.exports = exports['default'];