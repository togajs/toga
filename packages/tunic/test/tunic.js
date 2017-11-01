import test from 'blue-tape';
import tunic from '../src/tunic';
import { hashHashHash } from '../src/comment-styles.js';

test('should create a reusable parser', async t => {
	const parser = tunic({ commentStyle: hashHashHash });

	t.deepEqual(parser(), {
		type: 'Documentation',
		blocks: []
	});

	t.deepEqual(parser('###\n# foo\n###\na = 1'), {
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
					code: '\na = 1'
				}
			}
		]
	});
});
