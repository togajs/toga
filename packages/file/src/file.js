import fs from 'fs';
import path from 'path';
import { assertString, promisify } from './util.js';

const mkdir = promisify(fs.mkdir);
const read = promisify(fs.readFile);
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);
const write = promisify(fs.writeFile);

function mkdirp(dirs, i = 1) {
	if (i > dirs.length) {
		return;
	}

	const dir = dirs.slice(0, i).join(path.sep);

	return stat(dir)
		.catch(() => mkdir(dir))
		.then(() => mkdirp(dirs, i + 1));
}

/**
 * @class File
 */
export class File {
	/**
	 * @constructor
	 * @param {Object} options
	 * @param {String} options.cwd
	 * @param {String} options.path
	 * @param {Buffer|String} options.contents
	 */
	constructor({ cwd = process.cwd(), path, contents } = {}) {
		this.history = [];

		this.cwd = cwd;
		this.path = path;
		this.contents = contents;
	}

	/**
	 * @property {String} cwd
	 */
	set cwd(val) {
		val = val && path.normalize(val);

		this._cwd = val;
	}
	get cwd() {
		return this._cwd;
	}

	/**
	 * @property {String} path
	 */
	set path(val) {
		val = val && path.normalize(val);

		this.history.push(val);
	}
	get path() {
		const { history } = this;

		return history[history.length - 1];
	}

	/**
	 * @property {String} dirname
	 */
	set dirname(val) {
		val = val && path.normalize(val);

		this.path = path.join(val, this.basename);
	}
	get dirname() {
		return path.dirname(this.path);
	}

	/**
	 * @property {String} basename
	 */
	set basename(val) {
		this.path = path.join(this.dirname, val);
	}
	get basename() {
		return path.basename(this.path);
	}

	/**
	 * @property {String} stem
	 */
	set stem(val) {
		assertString('Stem', val);

		this.basename = val + this.extname;
	}
	get stem() {
		return path.basename(this.path, this.extname);
	}

	/**
	 * @property {String} extname
	 */
	set extname(val) {
		assertString('Extname', val);

		this.basename = this.stem + val;
	}
	get extname() {
		return path.extname(this.path);
	}

	/**
	 * @method delete
	 * @param {Object} options
	 * @param {String} options.cwd
	 * @return {Promise<FileFs>}
	 */
	delete({ cwd = '' } = {}) {
		assertString('Basename', this.basename, { truthy: true });

		const pathname = path.resolve(this.cwd, cwd, this.path);

		return unlink(pathname).then(() => this);
	}

	/**
	 * @method read
	 * @param {Object} options
	 * @param {String} options.cwd
	 * @param {String} options.encoding
	 * @param {String} options.flag
	 * @return {Promise<FileFs>}
	 */
	read({ cwd = '', ...options } = {}) {
		assertString('Basename', this.basename, { truthy: true });

		const pathname = path.resolve(this.cwd, cwd, this.path);
		const readOptions = {
			encoding: 'utf8',
			flag: 'r',
			...options
		};

		return read(pathname, readOptions)
			.then(x => (this.contents = x))
			.then(() => this);
	}

	/**
	 * @method stat
	 * @param {Object} options
	 * @param {String} options.cwd
	 * @return {Promise<Object>}
	 */
	stat({ cwd = '' } = {}) {
		assertString('Basename', this.basename, { truthy: true });

		const pathname = path.resolve(this.cwd, cwd, this.path);

		return stat(pathname);
	}

	/**
	 * @method write
	 * @param {Object} options
	 * @param {String} options.cwd
	 * @param {String} options.encoding
	 * @param {String} options.flag
	 * @param {Number} options.mode
	 * @return {Promise<FileFs>}
	 */
	write({ cwd = '', ...options } = {}) {
		assertString('Basename', this.basename, { truthy: true });

		const pathname = path.resolve(this.cwd, cwd, this.path);
		const writeOptions = {
			encoding: 'utf8',
			flag: 'w',
			mode: 0o666,
			...options
		};

		return mkdirp(path.dirname(pathname).split(path.sep))
			.then(() => write(pathname, this.contents, writeOptions))
			.then(() => this);
	}

	/**
	 * @method toJSON
	 * @return {Object}
	 */
	toJSON() {
		return {
			cwd: this.cwd,
			path: this.path,
			contents: this.contents
		};
	}

	/**
	 * @method toString
	 * @return {Object}
	 */
	toString() {
		let { contents } = this;

		if (contents && contents.length > 30) {
			contents = `${contents.slice(0, 32)}...`;
		}

		return `<File "${this.path}" "${contents}">`;
	}
}

export default function file(options) {
	return new File(options);
}
