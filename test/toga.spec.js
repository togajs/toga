/*eslint-env mocha */

import toga from '..src/toga';
import expect from 'expect';

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

	describe('join', function () {
		it('should return a readable stream', function () {
			var retval = toga.join([]);

			expect(retval.pipe).toBeA(Function);
			expect(retval.readable).toBe(true);
		});
	});
});
