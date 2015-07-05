/**
 * # Toga
 *
 * One tool and one destination for all project documentation including user
 * guides, developer guides, api documentation, styleguides, and pattern
 * libraries for both front and back-end technologies. Source code for an entire
 * project is streamed into documentation via [Transform Streams][ts] a la
 * [gulp][gulp].
 *
 * [gulp]: http://gulpjs.com/
 * [ts]: http://nodejs.org/api/stream.html#stream_class_stream_transform
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
  * Turns streams into tributaries of another.
  *
  * @method add
  * @param {Stream...|Array.<Stream>} streams
  * @return {Stream}
  */
	add: function add() {
		var headwater = _through22['default'].obj();

		for (var _len = arguments.length, streams = Array(_len), _key = 0; _key < _len; _key++) {
			streams[_key] = arguments[_key];
		}

		streams.push(headwater);

		return _duplexify2['default'].obj(headwater, (0, _mergeStream2['default'])(streams));
	},

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
	}
};

exports['default'] = Toga;
module.exports = exports['default'];