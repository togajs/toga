'use strict';

var Transform = require('stream').Transform;
var Vinyl = require('vinyl');
var deepMixIn = require('mout/object/deepMixIn');
var fs = require('fs');
var path = require('path');

var defaults = {
    use: []
};

/**
 *
 */
function Toga(options) {
    if (!(this instanceof Toga)) {
        return new Toga(options);
    }

    /**
     *
     */
    this.plugins = [];

    /**
     *
     */
    this.options = deepMixIn({}, defaults, options);

    this.use(this.options.use);

    Transform.call(this, {
        objectMode: true
    });
}

var base = Transform.prototype;
var proto = Toga.prototype = Object.create(base);
proto.constructor = Toga;

/**
 *
 */
proto.open = function(file) {
    var resolved = path.resolve(file);

    return new Vinyl({
        path: resolved,
        contents: fs.readFileSync(resolved)
    });
};

/**
 *
 */
proto.parse = function(file) {
    var plugins = this.plugins;
    var length = plugins.length;
    var i = 0;

    if (typeof file === 'string') {
        file = this.open(file);
    }

    for (; i < length; i++) {
        plugins[i](file, this);
    }

    if (file.contents) {
        return file.contents.toString();
    }
};

/**
 *
 */
proto.use = function(plugin) {
    if (typeof plugin === 'string') {
        plugin = require('toga-' + plugin);
    }

    if (plugin && typeof plugin.forEach === 'function') {
        plugin.forEach(this.use.bind(this));
        return this;
    }

    this.plugins.push(plugin);

    return this;
};

/**
 *
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
 *
 */
proto.Toga = Toga;

module.exports = new Toga();
