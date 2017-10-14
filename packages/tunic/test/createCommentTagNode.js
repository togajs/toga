import test from 'blue-tape';
import { createCommentTagNode } from '../src/tunic';

test('should create an empty comment node', async t => {
	t.deepEqual(createCommentTagNode(), {
		type: 'CommentTag',
		tag: '',
		kind: '',
		name: '',
		description: ''
	});
});

test('should create an unnamed comment node', async t => {
	t.deepEqual(createCommentTagNode('foo', 'bar', 'baz', null, 'qux'), {
		type: 'CommentTag',
		tag: 'foo',
		kind: 'bar',
		name: '',
		description: 'baz qux'
	});
});

test('should create a named comment node', async t => {
	t.deepEqual(createCommentTagNode('foo', 'bar', 'baz', '-', 'qux'), {
		type: 'CommentTag',
		tag: 'foo',
		kind: 'bar',
		name: 'baz',
		description: 'qux'
	});

	t.deepEqual(createCommentTagNode('param', undefined, '[baz]', undefined, 'qux'), {
		type: 'CommentTag',
		tag: 'param',
		kind: '',
		name: '[baz]',
		description: 'qux'
	});

	t.deepEqual(
		createCommentTagNode('param', undefined, '[baz]', undefined, 'qux', { namedTags: ['foo'] }),
		{
			type: 'CommentTag',
			tag: 'param',
			kind: '',
			name: '',
			description: '[baz] qux'
		}
	);
});
