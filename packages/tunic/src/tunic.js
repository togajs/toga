import rx from 'regx';
import { slashStarStar } from './commentStyles';
import { atCurlyDash } from './tagStyles';

const AST_TYPE_DOCUMENTATION = 'Documentation';
const AST_TYPE_BLOCK = 'Block';
const AST_TYPE_COMMENT = 'Comment';
const AST_TYPE_COMMENT_TAG = 'Tag';
const AST_TYPE_CODE = 'Code';
const RX_NEWLINE_DOS = /\r\n/g;

const rxm = rx('m');
const rxgm = rx('gm');

const defaultNamedTags = [
	'arg',
	'argument',
	'class',
	'exports',
	'extends',
	'imports',
	'method',
	'module',
	'param',
	'parameter',
	'prop',
	'property'
];

// Utilities

function memoize(fn) {
	const cache = new WeakMap();
	const nullKey = {};

	return obj => {
		const key = obj || nullKey;

		if (cache.has(key)) {
			return cache.get(key);
		}

		const value = fn(obj);

		cache.set(key, value);

		return value;
	};
}

const compileCommentMatcher = memoize(options => {
	const { commentStyle } = options || {};

	options = { ...slashStarStar, ...commentStyle };

	return rxm`
		${options.open}
		\s*?
		\n?
		(
			[\s\S]*?
		)
		\n?
		\s*?
		${options.close}
	`;
});

const compileIndentMatcher = memoize(options => {
	const { commentStyle } = options || {};

	options = { ...slashStarStar, ...commentStyle };

	return rxm`
		^
		${options.indent}
	`;
});

const compileTagMatcher = memoize(options => {
	const { tagStyle } = options || {};

	options = { ...atCurlyDash, ...tagStyle };

	return rxgm`
		${options.tag}
		${options.kind}
		${options.name}
		${options.delimiter}
		${options.description}
	`;
});

function unindentComment(comment, options) {
	if (!comment) {
		return comment;
	}

	const indentMatcher = compileIndentMatcher(options);
	const firstIndent = comment.match(indentMatcher);
	const indentLength = firstIndent && firstIndent[0].length;

	if (!indentLength) {
		return comment;
	}

	return comment
		.split('\n')
		.map(x => x.slice(indentLength))
		.join('\n');
}

// Parser

export function createCodeNode(code = '') {
	return {
		type: AST_TYPE_CODE,
		code
	};
}

export function createTagNode(
	tag = '',
	kind = '',
	name = '',
	delimiter = '',
	description = '',
	options
) {
	const namedTags = (options && options.namedTags) || defaultNamedTags;

	if (name && !delimiter && namedTags.indexOf(tag) === -1) {
		description = [name, description]
			.filter(Boolean)
			.join(' ')
			.trim();

		name = '';
	}

	return {
		type: AST_TYPE_COMMENT_TAG,
		tag,
		kind,
		name,
		description
	};
}

export function createCommentNode(comment = '', options) {
	const { tagStyle } = options || {};
	const tagMatcher = compileTagMatcher(options);
	const tagNodes = [];

	function extractTag(match, tag, kind, name, delimiter, description) {
		tagNodes.push(createTagNode(tag, kind, name, delimiter, description, options));

		return '';
	}

	comment = unindentComment(comment, options);

	if (tagStyle !== false) {
		comment = comment.replace(tagMatcher, extractTag);
	}

	return {
		type: AST_TYPE_COMMENT,
		description: comment,
		tags: tagNodes
	};
}

export function createBlockNode(comment = '', code = '', options) {
	return {
		type: AST_TYPE_BLOCK,
		comment: createCommentNode(comment, options),
		code: createCodeNode(code, options)
	};
}

export function parse(documentation = '', options) {
	const commentMatcher = compileCommentMatcher(options);
	const [firstBlock, ...blocks] = documentation.replace(RX_NEWLINE_DOS, '\n').split(commentMatcher);

	// always lead with a comment
	if (firstBlock.trim()) {
		blocks.unshift('', firstBlock);
	}

	const blockNodes = [];
	const blockCount = blocks.length;
	let i = 0;

	while (i < blockCount) {
		blockNodes.push(createBlockNode(blocks[i++], blocks[i++], options));
	}

	return {
		type: AST_TYPE_DOCUMENTATION,
		blocks: blockNodes
	};
}

// API

export default function tunic(opts) {
	return doc => parse(doc, opts);
}
