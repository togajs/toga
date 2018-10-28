import test from 'blue-tape';
import { parse } from '@toga/tunic';
import formatMarkdown from '../src/format-markdown.js';

const fixture = `
	/**
	 * # Hello World
	 *
	 * This is my description of this thing.
	 *
	 * @method foo
	 * @param {String} foo - I hope you like it.
	 */
	export function log(foo) {
		console.log(foo);
	}
`;

test('should ignore files with no ast', { objectPrintDepth: 20 }, async t => {
	const { docAst } = await formatMarkdown({});

	t.equal(docAst, undefined);
});

test('should format descriptions', { objectPrintDepth: 20 }, async t => {
	const { docAst } = await formatMarkdown({
		docAst: parse(fixture)
	});

	t.deepEqual(docAst, {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description:
						'<h1 id="hello-world">Hello World</h1>\n<p>This is my description of this thing.</p>\n',
					tags: [
						{
							type: 'Tag',
							tag: 'method',
							kind: '',
							name: 'foo',
							description: ''
						},
						{
							type: 'Tag',
							tag: 'param',
							kind: 'String',
							name: 'foo',
							description: '<p>I hope you like it.</p>\n'
						}
					]
				},
				code: {
					type: 'Code',
					code:
						'\n\texport function log(foo) {\n\t\tconsole.log(foo);\n\t}\n'
				}
			}
		]
	});
});
