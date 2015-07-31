/* eslint-env mocha */

import toga from '../src/toga';
import expect from 'expect';
import streamArray from 'stream-array';
import supply from 'mtil/function/supply';

describe('toga spec', function () {
	describe('src', function () {
		it('should return a readable stream', function () {
			var retval = toga.src('*.*');

			expect(retval.pipe).toBeA(Function);
			expect(retval.readable).toBe(true);
		});
	});

	describe('dest', function () {
		it('should return a writable stream', function () {
			var retval = toga.dest('.');

			expect(retval.pipe).toBeA(Function);
			expect(retval.writable).toBe(true);
		});
	});

	describe('merge', function () {
		it('should return a readable stream', function () {
			var retval = toga.merge([]);

			expect(retval.pipe).toBeA(Function);
			expect(retval.readable).toBe(true);
		});
	});

	describe('add', function () {
		it('should return a duplex stream', function () {
			var retval = toga.add();

			expect(retval.pipe).toBeA(Function);
			expect(retval.readable).toBe(true);
			expect(retval.writable).toBe(true);
		});

		it('should add streamed objects', function (done) {
			var expectChunk = supply(
				function (chunk) {
					expect(chunk).toEqual('qux');
				},
				function (chunk) {
					expect(chunk).toEqual('baz');
				},
				function (chunk) {
					expect(chunk).toEqual('bat');
				},
				function (chunk) {
					expect(chunk).toEqual('foo');
				},
				function (chunk) {
					expect(chunk).toEqual('bar');
				}
			);

			streamArray(['foo', 'bar'])
				.pipe(toga.add(streamArray(['baz', 'bat'])))
				.pipe(toga.add(streamArray(['qux'])))
				.on('data', expectChunk)
				.on('error', done)
				.on('end', done);
		});
	});

	describe('map', function () {
		it('should return a duplex stream', function () {
			var retval = toga.map();

			expect(retval.pipe).toBeA(Function);
			expect(retval.readable).toBe(true);
			expect(retval.writable).toBe(true);
		});

		it('should map streamed objects', function (done) {
			var expectChunk = supply(
				function (chunk) {
					expect(chunk).toEqual('HELLO');
				},
				function (chunk) {
					expect(chunk).toEqual('WORLD');
				}
			);

			streamArray(['hello', 'world'])
				.pipe(toga.map(function (value, cb) {
					cb(null, value.toUpperCase());
				}))
				.on('data', expectChunk)
				.on('error', done)
				.on('end', done);
		});
	});
});
