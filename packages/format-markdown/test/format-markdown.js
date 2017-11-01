import test from 'blue-tape';
import { file } from 'spiff';
import { parse } from '@toga/tunic';
import formatMarkdown from '../src/format-markdown.js';

const fixture = `
	/**
	 * # Hello World
	 *
	 * This is my description of this thing.
	 *
	 * @method foo
	 * @param {String} foo - I hope you like it.
	 */
	export function log(foo) {
		console.log(foo);
	}
`;

test('should format descriptions', async t => {
	const doc = parse(file('foo.js', fixture));
	const { docAst } = formatMarkdown(doc);

	t.deepEqual(docAst, {});
});
