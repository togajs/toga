import test from 'blue-tape';
import { parse } from '../src/tunic';

test('should create an empty documentation node', async t => {
	t.deepEqual(parse(), {
		type: 'Documentation',
		blocks: []
	});
});

test('should create a plain documentation node', async t => {
	t.deepEqual(parse('var a = 1;'), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: '',
					tags: []
				},
				code: {
					type: 'Code',
					code: 'var a = 1;'
				}
			}
		]
	});
});

test('should create a plain documentation node', async t => {
	t.deepEqual(parse('/** foo */\nvar a = 1;'), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: 'foo',
					tags: []
				},
				code: {
					type: 'Code',
					code: '\nvar a = 1;'
				}
			}
		]
	});
});
