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

import duplex from 'duplexify';
import merge from 'merge-stream';
import plumber from 'gulp-plumber';
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
	src(...args) {
		return src(...args)
			.pipe(plumber({
				handleError(err) {
					console.log(err);
					this.emit('end');
				}
			}));
	},

	/**
	 * The `dest` method of [`vinyl-fs`](https://www.npmjs.com/package/vinyl-fs).
	 *
	 * @method dest
	 * @param {String} dir
	 * @param {Object=} options
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
	 * Turns streams into tributaries of another.
	 *
	 * @method add
	 * @param {Stream...|Array.<Stream>} streams
	 * @return {Stream}
	 */
	add(...streams) {
		var headwater = through.obj();

		streams.push(headwater);

		return duplex.obj(headwater, merge(streams));
	},

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
	}
};

export default Toga;
