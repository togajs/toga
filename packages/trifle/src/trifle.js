import traverse from 'traverse';

function visit(fn, node, meta) {
	// Not interested
	if (node === null || typeof node !== 'object') {
		return;
	}

	// Remove deleted nodes
	if (Array.isArray(node)) {
		meta.after(() => {
			meta.update(node.filter(x => x !== undefined));
		});

		return;
	}

	// Update AST nodes
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
	function map(node) {
		// The traverse module sets the meta object as `this`.
		// eslint-disable-next-line no-invalid-this
		visit(fn, node, this);
	}

	return traverse(ast).map(map);
}
