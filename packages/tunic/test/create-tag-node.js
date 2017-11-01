import test from 'blue-tape';
import { createTagNode } from '../src/tunic.js';

test('should create an empty comment node', async t => {
	t.deepEqual(createTagNode(), {
		type: 'Tag',
		tag: '',
		kind: '',
		name: '',
		description: ''
	});
});

test('should create an unnamed comment node', async t => {
	t.deepEqual(createTagNode('foo', 'bar', 'baz', null, 'qux'), {
		type: 'Tag',
		tag: 'foo',
		kind: 'bar',
		name: '',
		description: 'baz qux'
	});
});

test('should create a named comment node', async t => {
	t.deepEqual(createTagNode('foo', 'bar', 'baz', '-', 'qux'), {
		type: 'Tag',
		tag: 'foo',
		kind: 'bar',
		name: 'baz',
		description: 'qux'
	});

	t.deepEqual(createTagNode('param', undefined, '[baz]', undefined, 'qux'), {
		type: 'Tag',
		tag: 'param',
		kind: '',
		name: '[baz]',
		description: 'qux'
	});

	t.deepEqual(
		createTagNode('param', undefined, '[baz]', undefined, 'qux', {
			namedTags: ['foo']
		}),
		{
			type: 'Tag',
			tag: 'param',
			kind: '',
			name: '',
			description: '[baz] qux'
		}
	);
});
