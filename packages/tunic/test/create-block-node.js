import test from 'blue-tape';
import { createBlockNode } from '../src/tunic.js';

test('should create an empty block node', async t => {
	t.deepEqual(createBlockNode(), {
		type: 'Block',
		comment: {
			type: 'Comment',
			description: '',
			tags: []
		},
		code: {
			type: 'Code',
			code: ''
		}
	});
});

test('should create a plain block node', async t => {
	t.deepEqual(createBlockNode('foo', 'var a = 1;'), {
		type: 'Block',
		comment: {
			type: 'Comment',
			description: 'foo',
			tags: []
		},
		code: {
			type: 'Code',
			code: 'var a = 1;'
		}
	});
});
