import test from 'blue-tape';
import { file } from 'spiff';
import parseJs from '../src/parse-js.js';

const fixture = `
	/**
	 * Hello world.
	 *
	 * @param {String} foo - Lorem ipsum.
	 */
`;

test('should parse a javascript file', async t => {
	const { docAst } = parseJs(file('foo.js', fixture));

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
							tag: 'param',
							kind: 'String',
							name: 'foo',
							description: 'Lorem ipsum.'
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

test('should not parse a non javascript file', async t => {
	const { docAst } = parseJs(file('foo.css', fixture));

	t.equal(docAst, undefined);
});
