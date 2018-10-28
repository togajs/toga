export async function visit(node, fn) {
	// Not interested
	if (!node || typeof node !== 'object') {
		return node;
	}

	// Update AST-like nodes
	if (typeof node.type === 'string') {
		return await fn(node);
	}

	return node;
}

export async function walk(node, fn) {
	// Not interested
	if (!node || typeof node !== 'object') {
		return node;
	}

	// Shallow clone
	if (Array.isArray(node)) {
		node = node.slice();
	} else {
		node = { ...node };
	}

	// Map and walk children
	const keys = Object.keys(node);
	const length = keys.length;
	let i = 0;

	for (; i < length; i++) {
		const key = keys[i];
		const newValue = await visit(node[key], fn);

		node[key] = await walk(newValue, fn);
	}

	// Drop undefined items
	if (Array.isArray(node)) {
		node = node.filter(x => x !== undefined);
	}

	return node;
}
