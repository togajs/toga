'use strict';

var Transform = require('stream').Transform;
var Vinyl = require('vinyl');
var fs = require('fs');
var mixIn = require('mout/object/mixIn');
var path = require('path');

/**
 * Default options.
 *
 * @type {Object}
 */
var defaultOptions = {
    use: []
};

/**
 * # Toga
 *
 * Clothe your code in something presentable.
 *
 * @class Toga
 * @extends Stream.Transform
 *
 * @constructor
 * @param {Object} options
 * @param {Array.<String>=} options.use
 */
function Toga(options) {
    // Enable functional style `toga(options)`
    if (!(this instanceof Toga)) {
        return new Toga(options);
    }

    /**
     * @property plugins
     * @type {Array.<Function(Vinyl,Function(Error=))>}
     */
    this.plugins = [];

    /**
     * @property options
     * @type {Object.<String,RegExp|*>}
     */
    this.options = mixIn({}, defaultOptions, options);

    // Use plugins
    if (options && options.use) {
        this.use(options.use);
    }

    // Super constructor
    Transform.call(this, {
        objectMode: true
    });
}

var base = Transform.prototype;
var proto = Toga.prototype = Object.create(base);
proto.constructor = Toga;

/**
 * @method open
 * @param {String} file
 * @return {Vinyl}
 */
proto.open = function(file) {
    var resolved = path.resolve(file);

    return new Vinyl({
        path: resolved,
        contents: fs.readFileSync(resolved)
    });
};

/**
 * @method parse
 * @param {String|Vinyl} file
 * @return {?String}
 */
proto.parse = function(file) {
    var plugins = this.plugins;
    var length = plugins.length;
    var i = 0;

    // Create file object, if needed
    if (typeof file === 'string') {
        file = this.open(file);
    }

    // Apply registered plugins
    for (; i < length; i++) {
        plugins[i](file, this);
    }

    // Return file contents, if any
    if (file.contents) {
        return file.contents.toString();
    }
};

/**
 * @method use
 * @param {String|Function(Vinyl,Function(Error=))|Array} plugin
 * @chainable
 */
proto.use = function(plugin) {
    var plugins = this.plugins;

    // Load plugin by name
    if (typeof plugin === 'string') {
        plugin = require('toga-' + plugin);
    }

    // Use multiple plugins
    if (typeof plugin === 'object' && typeof plugin.forEach === 'function') {
        plugin.forEach(this.use.bind(this));

        return this;
    }

    // Valid plugins are functions
    if (typeof plugin !== 'function') {
        return this;
    }

    // Only register new plugins
    if (plugins.indexOf(plugin) < 0) {
        plugins.push(plugin);
    }

    return this;
};

/**
 * @method _transform
 * @param {String|Vinyl} file
 * @param {?String} encoding
 * @param {Function(?err=)} done
 * @private
 */
proto._transform = function(file, encoding, done) {
    try {
        this.parse(file);
        this.push(file);
        done();
    } catch (e) {
        done(e);
    }
};

/**
 * Lets people use the class if they don't want to use the provided instance.
 *
 * @property Toga
 * @type {Toga}
 */
proto.Toga = Toga;

module.exports = new Toga();
