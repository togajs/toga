'use strict';

var toga = require('../index'),
	config = {
		src: 'fixtures/**/*.*',
		dest: 'actual'
	};

describe('Toga', function () {
	it('should generate docs via a streaming interface', function () {
		// // stream
		// toga.src(config.src)
		// 	.pipe(toga.parser('js'))
		// 	.pipe(toga.formatter('markdown'))
		// 	.pipe(toga.compiler('pura'))
		// 	.pipe(toga.dest(config.dest));
	});

	it('should generate docs via a fluent interface', function () {
		// // fluent
		// toga.read(config.src)
		// 	.parse('js')
		// 	.format('markdown')
		// 	.compile('pura')
		// 	.write(config.dest);
	});

	it('should handle merged streams', function () {
		// var merge = require('merge-stream');
        //
		// var css = toga
		// 	.src(config.css)
		// 	.pipe(toga.parser('css'))
		// 	.pipe(toda.formatter('markdown'))
		// 	.pipe(toda.formatter('sample'));
        //
		// var js = toga
		// 	.src(config.js)
		// 	.pipe(toga.parser('js'))
		// 	.pipe(toda.formatter('markdown'));
        //
		// var perl = toga
		// 	.src(config.perl)
		// 	.pipe(toga.parser('perl'))
		// 	.pipe(toda.formatter('pod'));
        //
		// merge(css, js, perl)
		// 	.pipe(toga.compiler('pura'))
		// 	.pipe(toga.dest(config.dest));
	});
});
