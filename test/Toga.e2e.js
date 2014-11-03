'use strict';

var toga = require('../index'),
	expect = require('expect.js'),
	fs = require('fs'),
	map = require('map-stream'),
	config = {
		src: __dirname + '/fixtures/**/*.*',
		dest: __dirname + '/actual',
		css: __dirname + '/fixtures/**/*.css',
		js: __dirname + '/fixtures/**/*.js',
		perl: __dirname + '/fixtures/**/*.perl'
	};

describe('Toga', function () {
	function toEqualExpected(file, cb) {
		var expected = file.path.replace('fixtures', 'expected'),
			retval = file.contents.toString();

		expect(retval).to.be(fs.readFileSync(expected, 'utf8'));

		cb(null, file);
	}

	it('should generate docs via a streaming interface', function (done) {
		var js = require('toga-js'),
			md = require('toga-markdown'),
			pura = require('toga-pura');

		toga
			.src(config.src)
			.pipe(js.parser())
			.pipe(md.formatter())
			.pipe(pura.compiler())
			.pipe(map(toEqualExpected))
			.pipe(toga.dest(config.dest))
			.on('error', done)
			.on('end', done);
	});

	// TODO: Merged streams
    //
	// it('should handle joining multiple streams', function (done) {
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
	// 		.pipe(map(toEqualExpected))
	// 		.pipe(toga.dest(config.dest))
	// 		.on('error', done)
	// 		.on('end', done);
	// });
});
