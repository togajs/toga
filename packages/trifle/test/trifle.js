import test from 'blue-tape';
import trifle from '../src/trifle.js';

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
				code: '    stringify(val) {\n        return String(val);\n    }\n};'
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
				isLeaf: false
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
						isLeaf: false
					}
				],
				isLeaf: false
			},
			code: {
				type: 'Code',
				code: '    stringify(val) {\n        return String(val);\n    }\n};'
			}
		}
	]
};

test('should modify ast nodes', { objectPrintDepth: 20 }, async t => {
	const actual = trifle(ast, (node, meta) => {
		const { description, name } = node;
		const { isLeaf } = meta;

		// should drop nodes
		if (name === 'html') {
			return;
		}

		// should not modify nodes
		if (!description) {
			return node;
		}

		// should modify nodes
		return {
			...node,
			description: description.toUpperCase(),
			isLeaf
		};
	});

	t.notEqual(actual, ast);
	t.deepEqual(actual, expected);
});
