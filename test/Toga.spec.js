'use strict';

var toga = require('../index'),
	expect = require('expect.js');

describe('toga spec', function () {
	it('should create an instance', function () {
		var Toga = toga.Toga,
			a = new Toga(),
			b = Toga(); // jshint ignore:line

		expect(a).to.be.a(Toga);
		expect(b).to.be.a(Toga);
		expect(toga).to.be.a(Toga);

		expect(a).not.to.be(b);
		expect(b).not.to.be(toga);
	});

	describe('prototype', function () {
		describe('src', function () {
			it('should return a readable stream', function () {
				var retval = toga.src('*.*');

				expect(retval.pipe).to.be.a(Function);
				expect(retval.readable).to.be(true);
			});
		});

		describe('dest', function () {
			it('should return a writable stream', function () {
				var retval = toga.dest('.');

				expect(retval.pipe).to.be.a(Function);
				expect(retval.writable).to.be(true);
			});
		});

		describe('join', function () {
			it('should return a readable stream', function () {
				var retval = toga.join([]);

				expect(retval.pipe).to.be.a(Function);
				expect(retval.readable).to.be(true);
			});
		});
	});
});
