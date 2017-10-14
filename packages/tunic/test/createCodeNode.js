import test from 'blue-tape';
import { createCodeNode } from '../src/tunic';

test('should create an empty comment node', async t => {
	t.deepEqual(createCodeNode(), {
		type: 'Code',
		code: ''
	});
});

test('should create a plain comment node', async t => {
	t.deepEqual(createCodeNode('foo'), {
		type: 'Code',
		code: 'foo'
	});
});
