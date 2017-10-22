import test from 'blue-tape';
import File from 'vinyl-rw';
import parseCss from '../src/parser-css.js';

const fixture = `
	/**
	 * Hello world.
	 *
	 * @name Demo
	 */
`;

test('should parse a css file', { objectPrintDepth: 20 }, async t => {
	const { docAst } = parseCss(new File('foo.css', fixture));

	t.deepEqual(docAst, {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: 'Hello world.\n\n',
					tags: [
						{
							type: 'Tag',
							tag: 'name',
							kind: '',
							name: '',
							description: 'Demo'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\n'
				}
			}
		]
	});
});

test('should not parse a non css file', async t => {
	const { docAst } = parseCss(new File('foo.js', fixture));

	t.equal(docAst, undefined);
});
