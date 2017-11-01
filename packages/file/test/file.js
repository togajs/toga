import test from 'blue-tape';
import mockFs from 'mock-fs';
import fs from 'fs';
import file from '../src/file.js';

test('should represent an empty file', async t => {
	const foo = file();

	t.equal(foo.cwd, process.cwd());
	t.equal(foo.path, undefined);
	t.deepEqual(foo.history, [undefined]);
	t.equal(foo.contents, undefined);

	t.throws(() => foo.dirname);
	t.throws(() => foo.basename);
	t.throws(() => foo.stem);
	t.throws(() => foo.extname);

	t.deepEqual(foo.toJSON(), {
		cwd: process.cwd(),
		path: undefined,
		contents: undefined
	});

	t.deepEqual(foo.toString(), '<File "undefined" "undefined">');
});

test('should represent a full file', async t => {
	const foo = file({
		cwd: '/',
		path: 'a/b/file.ext',
		contents: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
	});

	t.equal(foo.cwd, '/');
	t.equal(foo.path, 'a/b/file.ext');
	t.deepEqual(foo.history, ['a/b/file.ext']);
	t.equal(
		foo.contents,
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
	);

	t.equal(foo.dirname, 'a/b');
	t.equal(foo.basename, 'file.ext');
	t.equal(foo.stem, 'file');
	t.equal(foo.extname, '.ext');

	t.deepEqual(foo.toJSON(), {
		cwd: '/',
		path: 'a/b/file.ext',
		contents: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
	});

	t.deepEqual(
		foo.toString(),
		'<File "a/b/file.ext" "Lorem ipsum dolor sit amet, cons...">'
	);
});

test('should manage dirnames', async t => {
	const foo = file({ path: '/a/b/file.ext' });

	t.equal(foo.dirname, '/a/b');

	foo.dirname = '/c/d';

	t.equal(foo.dirname, '/c/d');

	t.throws(() => {
		foo.dirname = null;
	});

	t.equal(foo.path, '/c/d/file.ext');

	t.deepEqual(foo.history, ['/a/b/file.ext', '/c/d/file.ext']);
});

test('should manage basenames', async t => {
	const foo = file({ path: '/a/b/file.ext' });

	t.equal(foo.basename, 'file.ext');

	foo.basename = 'foo.bar';

	t.equal(foo.basename, 'foo.bar');

	t.throws(() => {
		foo.basename = null;
	});

	t.equal(foo.path, '/a/b/foo.bar');

	t.deepEqual(foo.history, ['/a/b/file.ext', '/a/b/foo.bar']);
});

test('should manage stems', async t => {
	const foo = file({ path: '/a/b/file.ext' });

	t.equal(foo.stem, 'file');

	foo.stem = 'foo';

	t.equal(foo.stem, 'foo');

	t.throws(() => {
		foo.stem = null;
	});

	t.equal(foo.path, '/a/b/foo.ext');

	t.deepEqual(foo.history, ['/a/b/file.ext', '/a/b/foo.ext']);
});

test('should manage extnames', async t => {
	const foo = file({ path: '/a/b/file.ext' });

	t.equal(foo.extname, '.ext');

	foo.extname = '.bar';

	t.equal(foo.extname, '.bar');

	t.throws(() => {
		foo.extname = null;
	});

	t.equal(foo.path, '/a/b/file.bar');

	t.deepEqual(foo.history, ['/a/b/file.ext', '/a/b/file.bar']);
});

test('should delete', async t => {
	mockFs({
		foo: {
			'bar.ext': 'hello world'
		}
	});

	const foo = file({ path: 'foo/bar.ext' });
	const bar = await foo.delete();

	t.equal(foo, bar);

	try {
		await file({ path: 'foo/bar.ext' }).stat();
		t.fail('should throw');
	} catch (e) {
		t.pass('should throw');
	}

	mockFs.restore();
});

test('should read', async t => {
	mockFs({
		foo: {
			'bar.ext': 'hello world'
		}
	});

	const foo = file({ path: 'foo/bar.ext' });

	t.equal(foo.contents, undefined);

	const bar = await foo.read();

	t.equal(foo, bar);
	t.equal(foo.contents, 'hello world');

	try {
		await file({ path: 'bogus.ext' }).read();
		t.fail('should throw');
	} catch (e) {
		t.pass('should throw');
	}

	mockFs.restore();
});

test('should stat', async t => {
	mockFs({
		foo: {
			'bar.ext': 'hello world'
		}
	});

	const foo = file({ path: 'foo/bar.ext' });
	const stat = await foo.stat();

	t.ok(stat.hasOwnProperty('atime'));
	t.ok(stat.hasOwnProperty('ctime'));
	t.ok(stat.hasOwnProperty('mtime'));

	try {
		await file({ path: 'bogus.ext' }).stat();
		t.fail('should throw');
	} catch (e) {
		t.pass('should throw');
	}

	mockFs.restore();
});

test('should write', async t => {
	mockFs({});

	const foo = file({ path: 'foo/bar/baz.ext', contents: 'hello world' });

	t.equal(foo.contents, 'hello world');

	const bar = await foo.write();

	t.equal(foo, bar);
	t.equal(fs.readFileSync('foo/bar/baz.ext', 'utf8'), 'hello world');

	mockFs.restore();
});
