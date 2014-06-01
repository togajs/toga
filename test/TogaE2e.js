'use strict';

var toga = require('../index'),
	config = {
		src: 'fixtures/**/*.*',
		dest: 'actual'
	};

describe('Toga', function () {
	it('should', function () {
		// stream
		toga.src(config.src)
			.pipe(toga.parser('js'))
			.pipe(toga.formatter('markdown'))
			.pipe(toga.compiler('pura'))
			.pipe(toga.dest(config.dest));

		// // fluent
		// toga.read(config.src)
		// 	.parse('js')
		// 	.format('markdown')
		// 	.compile('pura')
		// 	.write(config.dest);

		// // config
		// toga({
		// 	src: config.src,
		// 	parsers: ['js'],
		// 	formatters: ['markdown'],
		// 	compilers: ['pura'],
		// 	dest: config.dest
		// });

		/* */
	});
});
