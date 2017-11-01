/**
 * @class Util
 * @static
 */

/**
 * @method assertString
 * @param {String} key
 * @param {Any} val
 * @param {Object} options
 * @param {Boolean} options.truthy
 * @static
 */
export function assertString(key, val, options) {
	if (typeof val !== 'string') {
		throw new TypeError(`${key} must be a string. Received ${val}`);
	}

	if (options && options.truthy && !val) {
		throw new TypeError(`${key} must not be empty.`);
	}
}

/**
 * @method promisify
 * @param {Function} fn
 * @return {Promise<Any>}
 * @static
 */
export function promisify(fn) {
	return function promisified(...args) {
		return new Promise((resolve, reject) =>
			fn(...args, (err, val) => (err ? reject(err) : resolve(val)))
		);
	};
}
