// @tag {kind} name - description
export const atCurlyDash = {
	tag: /^[\t ]*?@(\w+)[\t -]*/,
	kind: /(?:\{(.*[^\\])?\})?[\t -]*/,
	name: /(\[[^\]]*\]\*?|\S*)?[\t ]*/,
	delimiter: /(-?)[\t ]*/,
	description: /(.*(?:\n+[\t ]+.*)*)/
};

// \tag {kind} name - description
export const backslashCurlyDash = {
	tag: /^[\t ]*?\\(\w+)[\t -]*/,
	kind: /(?:\{(.*[^\\])?\})?[\t -]*/,
	name: /(\[[^\]]*\]\*?|\S*)?[\t ]*/,
	delimiter: /(-?)[\t ]*/,
	description: /(.*(?:\n+[\t ]+.*)*)/
};

// tag : description
export const colon = {
	tag: /^[\t ]*?(\w+)[\t ]*/,
	kind: /()/,
	name: /()/,
	delimiter: /(:)[\t ]*/,
	description: /(.*(?:\n+[\t ]+.*)*)/
};
