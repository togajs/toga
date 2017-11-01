import test from 'blue-tape';
import { assertString, promisify } from '../src/util.js';

test('should', async t => {
	t.ok(assertString);
	t.ok(promisify);
});
