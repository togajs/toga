/**
 * # Toga
 *
 * @title Toga
 * @name toga
 */

import multistream from 'multistream';
import vinylFs from 'vinyl-fs';

/**
 * @class Toga
 * @static
 */
export default {
	/**
	 * @method src
	 * @param {String|Array.<String>} glob
	 * @param {Object=} options
	 * @return {Stream}
	 */
	src: vinylFs.src,

	/**
	 * @method dest
	 * @param {String} dir
	 * @param {Object=} options
	 * @param {Function=} callback
	 * @return {Stream}
	 */
	dest: vinylFs.dest,

	/**
	 * @method join
	 * @param {Stream...|Array.<Stream>} argv
	 * @return {Stream}
	 */
	join: multistream.obj
};
