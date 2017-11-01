import test from 'blue-tape';
import { createCommentNode } from '../src/tunic.js';

test('should create an empty comment node', async t => {
	t.deepEqual(createCommentNode(), {
		type: 'Comment',
		description: '',
		tags: []
	});
});

test('should create a plain comment node', async t => {
	t.deepEqual(createCommentNode('foo'), {
		type: 'Comment',
		description: 'foo',
		tags: []
	});
});

test('should create a tagged comment node', async t => {
	t.deepEqual(createCommentNode(' * foo\n * @bar\n *   baz\n * qux'), {
		type: 'Comment',
		description: 'foo\n\nqux',
		tags: [
			{
				type: 'Tag',
				tag: 'bar',
				kind: '',
				name: '',
				description: '\n  baz'
			}
		]
	});
});

test('should create an untagged comment node', async t => {
	t.deepEqual(
		createCommentNode(' * foo\n * @bar\n *   baz\n * qux', {
			tagStyle: false
		}),
		{
			type: 'Comment',
			description: 'foo\n@bar\n  baz\nqux',
			tags: []
		}
	);
});
