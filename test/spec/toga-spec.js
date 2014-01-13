'use strict';

var assert = require('assert');
var path = require('path');
var toga = require('../../lib/toga');
var Toga = toga.Toga;

describe('Toga', function() {
    describe('constructor', function() {
        it('should create an instance', function() {
            assert.ok(toga instanceof Toga);
            assert.ok(new Toga() instanceof Toga);
        });
    });

    describe('prototype.open', function() {
        it('should create a Vinyl representation of a file', function() {
            var inst = new Toga();
            var fixture = path.resolve(__dirname, '../fixtures/open.txt');
            var opened = inst.open(fixture);

            assert.ok(opened instanceof Object);
            assert.equal(opened.path, fixture);
            assert.ok(opened.contents instanceof Buffer);
            assert.equal(opened.contents.toString(), 'open\n');
        });
    });

    describe('prototype.parse', function() {
        it('should parse a file using plugins', function() {
            var parsed;
            var count = 0;
            var inst = new Toga();
            var fixture = path.resolve(__dirname, '../fixtures/parse.txt');

            inst.use(function(file, toga) {
                assert.equal(file.contents.toString(), 'source\n');
                assert.equal(toga, inst);

                // mock ast
                file.ast = { foo: 'bar' };

                count++;
            });

            inst.use(function(file, toga) {
                assert.deepEqual(file.ast, { foo: 'bar' });
                assert.equal(toga, inst);

                // mock generated content
                file.contents = new Buffer('docs\n');

                count++;
            });

            parsed = inst.parse(fixture);
            assert.equal(parsed, 'docs\n');
            assert.equal(count, 2);
        });
    });

    describe('prototype.use', function() {
        it('should register a plugin', function() {
            var inst = new Toga();
            var mockA = function(){};
            var mockB = function(){};

            inst
                .use(mockA)
                .use(mockB);

            assert.deepEqual(inst.plugins, [mockA, mockB]);
        });
    });

    describe('prototype._transform', function() {
        it('should parse a file', function() {
            var count = 0;
            var inst = new Toga();
            var fixture = { foo: 'bar' };

            inst.parse = function(file) {
                assert.deepEqual(file, fixture);

                count++;
            };

            inst.push = function(file) {
                assert.deepEqual(file, fixture);

                count++;
            };

            inst.write(fixture);

            assert.equal(count, 2);
        });

        it('should handle errors', function() {
            var count = 0;
            var inst = new Toga();
            var fixture = { foo: 'bar' };

            var write = function() {
                inst.write(fixture);
            };

            inst.parse = function() {
                count++;
                throw new Error('foo');
            };

            inst.push = function() {
                count++;
            };

            assert.throws(write);
            assert.equal(count, 1);
        });
    });
});
