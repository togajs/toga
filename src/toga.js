/**
 * # Toga
 *
 * @title Toga
 * @name toga
 */

import duplex from 'duplexify';
import merge from 'merge-stream';
import through from 'through2';
import { src, dest } from 'vinyl-fs';

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
	src,

	/**
	 * The `dest` method of [`vinyl-fs`](https://www.npmjs.com/package/vinyl-fs).
	 *
	 * @method dest
	 * @param {String} dir
	 * @param {Object=} options
	 * @param {Function=} callback
	 * @return {Stream}
	 */
	dest,

	/**
	 * Turns multiple readable streams into one.
	 *
	 * @method merge
	 * @param {Stream...|Array.<Stream>} streams
	 * @return {Stream}
	 */
	merge,

	/**
	 * Turns a map function into a transform stream.
	 *
	 * @method map
	 * @param {Function(Object):Object} fn
	 * @return {Stream}
	 */
	map(fn) {
		function transform(file, enc, cb) {
			fn(file, cb);
		}

		return through.obj(transform);
	},

	/**
	 * Turns streams into tributaries of another.
	 *
	 * @method push
	 * @param {Stream...|Array.<Stream>} streams
	 * @return {Stream}
	 */
	push(...streams) {
		var headwater = through.obj();

		streams.unshift(headwater);

		return duplex.obj(headwater, merge(streams));
	}
};

export default Toga;
