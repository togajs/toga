import test from 'blue-tape';
import { parse } from '../src/tunic.js';
import * as commentStyles from '../src/comment-styles.js';

test('angleBangDashDash', async t => {
	const src = `
		<!--
		 ! # Description
		 !
		 ! Long description that spans multiple
		 ! lines and even has markdown type things.
		 !
		 ! @arg {Type} name Description.
		 !-->
		hello world
	`;

	t.deepEqual(parse(src, { commentStyle: commentStyles.angleBangDashDash }), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description:
						'# Description\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'Tag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\n\t\thello world\n\t'
				}
			}
		]
	});
});

test('bangBang', async t => {
	const src = `
		!> # Description
		!!
		!! Long description that spans multiple
		!! lines and even has markdown type things.
		!!
		!! @arg {Type} name Description.
		hello world
	`;

	t.deepEqual(parse(src, { commentStyle: commentStyles.bangBang }), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description:
						'# Description\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'Tag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\t\thello world\n\t'
				}
			}
		]
	});
});

test('beginEnd', async t => {
	const src = `
=begin
# Description

Long description that spans multiple
lines and even has markdown type things.

@arg {Type} name Description.
=end
hello world
	`;

	t.deepEqual(parse(src, { commentStyle: commentStyles.beginEnd }), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description:
						'# Description\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'Tag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\nhello world\n\t'
				}
			}
		]
	});
});

test('curlyDashPipe', async t => {
	const src = `
		{-|
		 - # Description
		 -
		 - Long description that spans multiple
		 - lines and even has markdown type things.
		 -
		 - @arg {Type} name Description.
		 -}
		hello world
	`;

	t.deepEqual(parse(src, { commentStyle: commentStyles.curlyDashPipe }), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description:
						'# Description\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'Tag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\n\t\thello world\n\t'
				}
			}
		]
	});
});

test('curlyHashHash', async t => {
	const src = `
		{##
		 # Description
		 # ===========
		 #
		 # Long description that spans multiple
		 # lines and even has markdown type things.
		 #
		 # @arg {Type} name Description.
		 #}
		hello world
	`;

	t.deepEqual(parse(src, { commentStyle: commentStyles.curlyHashHash }), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description:
						'Description\n===========\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'Tag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\n\t\thello world\n\t'
				}
			}
		]
	});
});

test('curlyPercPerc', async t => {
	const src = `
		{%%
		 % # Description
		 %
		 % Long description that spans multiple
		 % lines and even has markdown type things.
		 %
		 % @arg {Type} name Description.
		 %}
		hello world
	`;

	t.deepEqual(parse(src, { commentStyle: commentStyles.curlyPercPerc }), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description:
						'# Description\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'Tag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\n\t\thello world\n\t'
				}
			}
		]
	});
});

test('dashDashBang', async t => {
	const src = `
		--! # Description
		--!
		--! Long description that spans multiple
		--! lines and even has markdown type things.
		--!
		--! @arg {Type} name Description.
		hello world
	`;

	t.deepEqual(parse(src, { commentStyle: commentStyles.dashDashBang }), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description:
						'# Description\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'Tag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\t\thello world\n\t'
				}
			}
		]
	});
});

test('doubleDouble', async t => {
	const src = `
		""
		" # Description
		"
		" Long description that spans multiple
		" lines and even has markdown type things.
		"
		" @arg {Type} name Description.
		hello world
	`;

	t.deepEqual(parse(src, { commentStyle: commentStyles.doubleDouble }), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description:
						'# Description\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'Tag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\t\thello world\n\t'
				}
			}
		]
	});
});

test('doubleDoubleDouble', async t => {
	const src = `
		"""
		" # Description
		"
		" Long description that spans multiple
		" lines and even has markdown type things.
		"
		" @arg {Type} name Description.
		"""
		hello world
	`;

	t.deepEqual(
		parse(src, { commentStyle: commentStyles.doubleDoubleDouble }),
		{
			type: 'Documentation',
			blocks: [
				{
					type: 'Block',
					comment: {
						type: 'Comment',
						description:
							'# Description\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
						tags: [
							{
								type: 'Tag',
								tag: 'arg',
								kind: 'Type',
								name: 'name',
								description: 'Description.'
							}
						]
					},
					code: {
						type: 'Code',
						code: '\n\t\thello world\n\t'
					}
				}
			]
		}
	);
});

test('hashHash', async t => {
	const src = `
		##
		# Description
		# ===========
		#
		# Long description that spans multiple
		# lines and even has markdown type things.
		#
		# @arg {Type} name Description.
		hello world
	`;

	t.deepEqual(parse(src, { commentStyle: commentStyles.hashHash }), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description:
						'Description\n===========\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'Tag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\t\thello world\n\t'
				}
			}
		]
	});
});

test('hashHashHash', async t => {
	const src = `
		###
		# Description
		# ===========
		#
		# Long description that spans multiple
		# lines and even has markdown type things.
		#
		# @arg {Type} name Description.
		###
		hello world
	`;

	t.deepEqual(parse(src, { commentStyle: commentStyles.hashHashHash }), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description:
						'Description\n===========\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'Tag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\n\t\thello world\n\t'
				}
			}
		]
	});
});

test('parenStarStar', async t => {
	const src = `
		(**
		 * # Description
		 *
		 * Long description that spans multiple
		 * lines and even has markdown type things.
		 *
		 * @arg {Type} name Description.
		 *)
		hello world
	`;

	t.deepEqual(parse(src, { commentStyle: commentStyles.parenStarStar }), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description:
						'# Description\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'Tag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\n\t\thello world\n\t'
				}
			}
		]
	});
});

test('percPerc', async t => {
	const src = `
		%%
		% # Description
		%
		% Long description that spans multiple
		% lines and even has markdown type things.
		%
		% @arg {Type} name Description.
		hello world
	`;

	t.deepEqual(parse(src, { commentStyle: commentStyles.percPerc }), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description:
						'# Description\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'Tag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\t\thello world\n\t'
				}
			}
		]
	});
});

test('percPercPerc', async t => {
	const src = `
		%%%
		% # Description
		%
		% Long description that spans multiple
		% lines and even has markdown type things.
		%
		% @arg {Type} name Description.
		%%%
		hello world
	`;

	t.deepEqual(parse(src, { commentStyle: commentStyles.percPercPerc }), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description:
						'# Description\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'Tag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\n\t\thello world\n\t'
				}
			}
		]
	});
});

test('podCut', async t => {
	const src = `
=pod
# Description

Long description that spans multiple
lines and even has markdown type things.

@arg {Type} name Description.
=cut
hello world
	`;

	t.deepEqual(parse(src, { commentStyle: commentStyles.podCut }), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description:
						'# Description\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'Tag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\nhello world\n\t'
				}
			}
		]
	});
});

test('singleSingle', async t => {
	const src = `
		''
		' # Description
		'
		' Long description that spans multiple
		' lines and even has markdown type things.
		'
		' @arg {Type} name Description.
		hello world
	`;

	t.deepEqual(parse(src, { commentStyle: commentStyles.singleSingle }), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description:
						'# Description\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'Tag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\t\thello world\n\t'
				}
			}
		]
	});
});

test('singleSingleSingle', async t => {
	const src = `
		'''
		' # Description
		'
		' Long description that spans multiple
		' lines and even has markdown type things.
		'
		' @arg {Type} name Description.
		'''
		hello world
	`;

	t.deepEqual(
		parse(src, { commentStyle: commentStyles.singleSingleSingle }),
		{
			type: 'Documentation',
			blocks: [
				{
					type: 'Block',
					comment: {
						type: 'Comment',
						description:
							'# Description\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
						tags: [
							{
								type: 'Tag',
								tag: 'arg',
								kind: 'Type',
								name: 'name',
								description: 'Description.'
							}
						]
					},
					code: {
						type: 'Code',
						code: '\n\t\thello world\n\t'
					}
				}
			]
		}
	);
});

test('slashSlashSlash', async t => {
	const src = `
		/// # Description
		///
		/// Long description that spans multiple
		/// lines and even has markdown type things.
		///
		/// @arg {Type} name Description.
		hello world
	`;

	t.deepEqual(parse(src, { commentStyle: commentStyles.slashSlashSlash }), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description:
						'# Description\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'Tag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\t\thello world\n\t'
				}
			}
		]
	});
});

test('slashStarStar', async t => {
	const src = `
		/**
		 * # Description
		 *
		 * Long description that spans multiple
		 * lines and even has markdown type things.
		 *
		 * @arg {Type} name Description.
		 */
		hello world
	`;

	t.deepEqual(parse(src, { commentStyle: commentStyles.slashStarStar }), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description:
						'# Description\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'Tag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\n\t\thello world\n\t'
				}
			}
		]
	});
});

test('should select style by name', async t => {
	const src = `
		/**
		 * # Description
		 *
		 * Long description that spans multiple
		 * lines and even has markdown type things.
		 *
		 * @arg {Type} name Description.
		 */
		hello world
	`;

	t.deepEqual(parse(src, { commentStyle: 'slashStarStar' }), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description:
						'# Description\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'Tag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\n\t\thello world\n\t'
				}
			}
		]
	});
});
