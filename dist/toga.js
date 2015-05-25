/**
 * # Toga
 *
 * @title Toga
 * @name toga
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _duplexify = require('duplexify');

var _duplexify2 = _interopRequireDefault(_duplexify);

var _mergeStream = require('merge-stream');

var _mergeStream2 = _interopRequireDefault(_mergeStream);

var _through2 = require('through2');

var _through22 = _interopRequireDefault(_through2);

var _vinylFs = require('vinyl-fs');

/**
 * @class Toga
 * @static
 */
var Toga = {
	/**
  * The `src` method of [`vinyl-fs`](https://www.npmjs.com/package/vinyl-fs).
  *
  * @method src
  * @param {String|Array.<String>} glob
  * @param {Object=} options
  * @return {Stream}
  */
	src: _vinylFs.src,

	/**
  * The `dest` method of [`vinyl-fs`](https://www.npmjs.com/package/vinyl-fs).
  *
  * @method dest
  * @param {String} dir
  * @param {Object=} options
  * @param {Function=} callback
  * @return {Stream}
  */
	dest: _vinylFs.dest,

	/**
  * Turns multiple readable streams into one.
  *
  * @method merge
  * @param {Stream...|Array.<Stream>} streams
  * @return {Stream}
  */
	merge: _mergeStream2['default'],

	/**
  * Turns a map function into a transform stream.
  *
  * @method map
  * @param {Function(Object):Object} fn
  * @return {Stream}
  */
	map: function map(fn) {
		function transform(file, enc, cb) {
			fn(file, cb);
		}

		return _through22['default'].obj(transform);
	},

	/**
  * Turns streams into tributaries of another.
  *
  * @method push
  * @param {Stream...|Array.<Stream>} streams
  * @return {Stream}
  */
	push: function push() {
		for (var _len = arguments.length, streams = Array(_len), _key = 0; _key < _len; _key++) {
			streams[_key] = arguments[_key];
		}

		var headwater = _through22['default'].obj();

		streams.unshift(headwater);

		return _duplexify2['default'].obj(headwater, (0, _mergeStream2['default'])(streams));
	}
};

exports['default'] = Toga;
module.exports = exports['default'];