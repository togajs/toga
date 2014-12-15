'use strict';

var toga = require('../index'),
	es = require('event-stream'),
	expect = require('expect.js'),
	fs = require('fs'),

	config = {
		src: __dirname + '/fixtures/**/*.*',
		css: __dirname + '/fixtures/**/*.css',
		js: __dirname + '/fixtures/**/*.js',
		perl: __dirname + '/fixtures/**/*.{pl,pm}',
		dest: __dirname + '/actual'
	};

describe('toga e2e', function () {
	var count;

	function toEqualExpected(file, cb) {
		count++;

		var expected = file.path.replace('fixtures', 'expected'),
			retval = file.contents.toString();

		expect(retval).to.be(fs.readFileSync(expected, 'utf8'));

		cb(null, file);
	}

	it('should generate docs via a streaming interface', function (done) {
		count = 0;

		var js = require('toga-js'),
			md = require('toga-markdown'),
			pura = require('toga-pura');

		toga
			.src(config.js)
			.pipe(js.parser())
			.pipe(md.formatter())
			.pipe(pura.compiler())
			.pipe(es.map(toEqualExpected))
			.pipe(toga.dest(config.dest))
			.on('error', done)
			.on('end', function () {
				expect(count).to.be(1);
				done();
			});

	});

	it('TODO: should handle joining multiple streams', function (done) {
		done();

	// 	var css = require('toga-css'),
	// 		js = require('toga-js'),
	// 		perl = require('toga-perl'),
	// 		md = require('toga-markdown'),
	// 		sample = require('toga-sample'),
	// 		pod = require('toga-pod'),
	// 		pura = require('toga-pura'),
    //
	// 		api = toga
	// 			.pipe(md.parser())
	// 			.pipe(md.formatter()),
    //
	// 		client = toga
	// 			.src(config.css)
	// 			.pipe(css.parser())
	// 			.pipe(js.parser())
	// 			.pipe(md.formatter())
	// 			.pipe(sample.formatter()),
    //
	// 		server = toga
	// 			.src(config.perl)
	// 			.pipe(perl.parser())
	// 			.pipe(pod.formatter());
    //
	// 	toga
	// 		.join(api, client, server)
	// 		.pipe(pura.compiler())
	// 		.pipe(es.map(toEqualExpected))
	// 		.pipe(toga.dest(config.dest))
	// 		.on('error', done)
	// 		.on('end', done);
	});
});
