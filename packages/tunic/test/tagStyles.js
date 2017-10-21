import test from 'blue-tape';
import { parse } from '../src/tunic';
import * as tagStyles from '../src/tagStyles';

test('atCurlyDash', async t => {
	const src = `
		/**
		 * Description.
		 * @arg {Type} name - Description.
		 * @arg {Type} name Description.
		 * @arg {Type} - Description.
		 * @arg {Type} Description.
		 * @arg name - Description.
		 * @arg name Description.
		 * @arg - Description.
		 * @arg Description.
		 * @arg
		 *   Description.
		 * @arg
		 * Description.
		 */
		hello

		/**
		 * Description.
		 * @tag {Type} name - Description.
		 * @tag {Type} name Description.
		 * @tag {Type} - Description.
		 * @tag {Type} Description.
		 * @tag name - Description.
		 * @tag name Description.
		 * @tag - Description.
		 * @tag Description.
		 * @tag
		 *   Description.
		 * @tag
		 * Description.
		 */
		world
	`;

	t.deepEqual(parse(src, { tagStyle: tagStyles.atCurlyDash }), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: 'Description.\n\n\n\n\n\n\n\n\n\n\nDescription.',
					tags: [
						{
							type: 'Tag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						},
						{
							type: 'Tag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						},
						{ type: 'Tag', tag: 'arg', kind: 'Type', name: 'Description.', description: '' },
						{ type: 'Tag', tag: 'arg', kind: 'Type', name: 'Description.', description: '' },
						{ type: 'Tag', tag: 'arg', kind: '', name: 'name', description: 'Description.' },
						{ type: 'Tag', tag: 'arg', kind: '', name: 'name', description: 'Description.' },
						{ type: 'Tag', tag: 'arg', kind: '', name: 'Description.', description: '' },
						{ type: 'Tag', tag: 'arg', kind: '', name: 'Description.', description: '' },
						{ type: 'Tag', tag: 'arg', kind: '', name: '', description: '\n  Description.' },
						{ type: 'Tag', tag: 'arg', kind: '', name: '', description: '' }
					]
				},
				code: {
					type: 'Code',
					code: '\n\t\thello\n\n'
				}
			},
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: 'Description.\n\n\n\n\n\n\n\n\n\n\nDescription.',
					tags: [
						{
							type: 'Tag',
							tag: 'tag',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						},
						{
							type: 'Tag',
							tag: 'tag',
							kind: 'Type',
							name: '',
							description: 'name Description.'
						},
						{ type: 'Tag', tag: 'tag', kind: 'Type', name: '', description: 'Description.' },
						{ type: 'Tag', tag: 'tag', kind: 'Type', name: '', description: 'Description.' },
						{ type: 'Tag', tag: 'tag', kind: '', name: 'name', description: 'Description.' },
						{
							type: 'Tag',
							tag: 'tag',
							kind: '',
							name: '',
							description: 'name Description.'
						},
						{ type: 'Tag', tag: 'tag', kind: '', name: '', description: 'Description.' },
						{ type: 'Tag', tag: 'tag', kind: '', name: '', description: 'Description.' },
						{ type: 'Tag', tag: 'tag', kind: '', name: '', description: '\n  Description.' },
						{ type: 'Tag', tag: 'tag', kind: '', name: '', description: '' }
					]
				},
				code: {
					type: 'Code',
					code: '\n\t\tworld\n\t'
				}
			}
		]
	});
});

test('backslashCurlyDash', async t => {
	const src = `
		/**
		 * Description.
		 * \\arg {Type} name - Description.
		 * \\arg {Type} name Description.
		 * \\arg {Type} - Description.
		 * \\arg {Type} Description.
		 * \\arg name - Description.
		 * \\arg name Description.
		 * \\arg - Description.
		 * \\arg Description.
		 * \\arg
		 *   Description.
		 * \\arg
		 * Description.
		 */
		hello

		/**
		 * Description.
		 * \\tag {Type} name - Description.
		 * \\tag {Type} name Description.
		 * \\tag {Type} - Description.
		 * \\tag {Type} Description.
		 * \\tag name - Description.
		 * \\tag name Description.
		 * \\tag - Description.
		 * \\tag Description.
		 * \\tag
		 *   Description.
		 * \\tag
		 * Description.
		 */
		world
	`;

	t.deepEqual(parse(src, { tagStyle: tagStyles.backslashCurlyDash }), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: 'Description.\n\n\n\n\n\n\n\n\n\n\nDescription.',
					tags: [
						{
							type: 'Tag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						},
						{
							type: 'Tag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						},
						{ type: 'Tag', tag: 'arg', kind: 'Type', name: 'Description.', description: '' },
						{ type: 'Tag', tag: 'arg', kind: 'Type', name: 'Description.', description: '' },
						{ type: 'Tag', tag: 'arg', kind: '', name: 'name', description: 'Description.' },
						{ type: 'Tag', tag: 'arg', kind: '', name: 'name', description: 'Description.' },
						{ type: 'Tag', tag: 'arg', kind: '', name: 'Description.', description: '' },
						{ type: 'Tag', tag: 'arg', kind: '', name: 'Description.', description: '' },
						{ type: 'Tag', tag: 'arg', kind: '', name: '', description: '\n  Description.' },
						{ type: 'Tag', tag: 'arg', kind: '', name: '', description: '' }
					]
				},
				code: {
					type: 'Code',
					code: '\n\t\thello\n\n'
				}
			},
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: 'Description.\n\n\n\n\n\n\n\n\n\n\nDescription.',
					tags: [
						{
							type: 'Tag',
							tag: 'tag',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						},
						{
							type: 'Tag',
							tag: 'tag',
							kind: 'Type',
							name: '',
							description: 'name Description.'
						},
						{ type: 'Tag', tag: 'tag', kind: 'Type', name: '', description: 'Description.' },
						{ type: 'Tag', tag: 'tag', kind: 'Type', name: '', description: 'Description.' },
						{ type: 'Tag', tag: 'tag', kind: '', name: 'name', description: 'Description.' },
						{
							type: 'Tag',
							tag: 'tag',
							kind: '',
							name: '',
							description: 'name Description.'
						},
						{ type: 'Tag', tag: 'tag', kind: '', name: '', description: 'Description.' },
						{ type: 'Tag', tag: 'tag', kind: '', name: '', description: 'Description.' },
						{ type: 'Tag', tag: 'tag', kind: '', name: '', description: '\n  Description.' },
						{ type: 'Tag', tag: 'tag', kind: '', name: '', description: '' }
					]
				},
				code: {
					type: 'Code',
					code: '\n\t\tworld\n\t'
				}
			}
		]
	});
});

test('colon', async t => {
	const src = `
		/**
		 * Description.
		 * arg : Description.
		 * arg: Description.
		 * arg :
		 *   Description.
		 * arg :
		 * Description.
		 */
		hello

		/**
		 * Description.
		 * tag : Description.
		 * tag: Description.
		 * tag :
		 *   Description.
		 * tag :
		 * Description.
		 */
		world
	`;

	t.deepEqual(parse(src, { tagStyle: tagStyles.colon }), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: 'Description.\n\n\n\n\nDescription.',
					tags: [
						{ type: 'Tag', tag: 'arg', kind: '', name: '', description: 'Description.' },
						{ type: 'Tag', tag: 'arg', kind: '', name: '', description: 'Description.' },
						{ type: 'Tag', tag: 'arg', kind: '', name: '', description: '\n  Description.' },
						{ type: 'Tag', tag: 'arg', kind: '', name: '', description: '' }
					]
				},
				code: {
					type: 'Code',
					code: '\n\t\thello\n\n'
				}
			},
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: 'Description.\n\n\n\n\nDescription.',
					tags: [
						{ type: 'Tag', tag: 'tag', kind: '', name: '', description: 'Description.' },
						{ type: 'Tag', tag: 'tag', kind: '', name: '', description: 'Description.' },
						{ type: 'Tag', tag: 'tag', kind: '', name: '', description: '\n  Description.' },
						{ type: 'Tag', tag: 'tag', kind: '', name: '', description: '' }
					]
				},
				code: {
					type: 'Code',
					code: '\n\t\tworld\n\t'
				}
			}
		]
	});
});
