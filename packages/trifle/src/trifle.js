/* eslint-disable array-callback-return, no-invalid-this */
import traverse from 'traverse';

function visit(fn, node, meta) {
	// not interested
	if (node === null || typeof node !== 'object') {
		return;
	}

	// remove deleted nodes
	if (Array.isArray(node)) {
		meta.after(() => {
			meta.update(node.filter(x => x !== undefined));
		});

		return;
	}

	// update ast nodes
	if (typeof node.type === 'string') {
		const result = fn(node, meta);

		if (result) {
			meta.update(result);
		} else {
			meta.delete();
		}
	}
}

export default function trifle(ast, fn) {
	return traverse(ast).map(function map(node) {
		visit(fn, node, this);
	});
}
