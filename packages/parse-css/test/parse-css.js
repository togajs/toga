import test from 'blue-tape';
import { file } from 'spiff';
import parseCss from '../src/parse-css.js';

const fixture = `
	/**
	 * Hello world.
	 *
	 * @name Demo
	 */
`;

test('should parse a css file', { objectPrintDepth: 20 }, async t => {
	const { docAst } = parseCss(file('foo.css', fixture));

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
	const { docAst } = parseCss(file('foo.js', fixture));

	t.equal(docAst, undefined);
});
