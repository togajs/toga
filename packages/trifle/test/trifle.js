import test from 'blue-tape';
import { walk } from '../src/trifle.js';

const ast = {
	type: 'Documentation',
	blocks: [
		{ foo: 'bar' },
		{
			type: 'Block',
			comment: {
				type: 'Comment',
				description: '# Utilities\n\nA library of utility methods.',
				tags: [
					{
						type: 'Tag',
						tag: 'class',
						name: 'Utilities'
					},
					{
						type: 'Tag',
						tag: 'static'
					}
				]
			},
			code: {
				type: 'Code',
				code: 'export const Utilities = {'
			}
		},
		{
			type: 'Block',
			comment: {
				type: 'Comment',
				description: 'Escapes the given `html`.',
				tags: [
					{
						type: 'Tag',
						tag: 'method',
						name: 'escape'
					},
					{
						type: 'Tag',
						tag: 'param',
						kind: 'String',
						name: 'html',
						description: 'String to escape.'
					},
					{
						type: 'Tag',
						tag: 'return',
						kind: 'String',
						description: 'Escaped html.'
					}
				]
			},
			code: {
				type: 'Code',
				code:
					'    stringify(val) {\n        return String(val);\n    }\n};'
			}
		}
	]
};

const expected = {
	type: 'Documentation',
	blocks: [
		{ foo: 'bar' },
		{
			type: 'Block',
			comment: {
				type: 'Comment',
				description: '# UTILITIES\n\nA LIBRARY OF UTILITY METHODS.',
				tags: [
					{
						type: 'Tag',
						tag: 'class',
						name: 'Utilities'
					},
					{
						type: 'Tag',
						tag: 'static'
					}
				],
				foo: 'bar'
			},
			code: {
				type: 'Code',
				code: 'export const Utilities = {'
			}
		},
		{
			type: 'Block',
			comment: {
				type: 'Comment',
				description: 'ESCAPES THE GIVEN `HTML`.',
				tags: [
					{
						type: 'Tag',
						tag: 'method',
						name: 'escape'
					},
					{
						type: 'Tag',
						tag: 'return',
						kind: 'String',
						description: 'ESCAPED HTML.',
						foo: 'bar'
					}
				],
				foo: 'bar'
			},
			code: {
				type: 'Code',
				code:
					'    stringify(val) {\n        return String(val);\n    }\n};'
			}
		}
	]
};

test('should modify ast nodes', { objectPrintDepth: 20 }, async t => {
	const actual = await walk(ast, async node => {
		const { description, name, type } = node;

		t.equal(typeof type, 'string');

		// Should drop nodes
		if (name === 'html') {
			return;
		}

		// Should not modify nodes
		if (!description) {
			return node;
		}

		// Should modify nodes
		return {
			...node,
			description: description.toUpperCase(),
			foo: 'bar'
		};
	});

	t.notEqual(actual, ast);
	t.deepEqual(actual, expected);
});
