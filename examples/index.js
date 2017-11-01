import { exec } from 'child-process-promise';
import { pathExists } from 'fs-extra';
import { read, write } from 'spiff';

import parseCss from '../packages/parse-css/dist/parse-css';
import parseJs from '../packages/parse-js/dist/parse-js';

async function clone(dir) {
	console.time(`${dir} clone`);

	if (!await pathExists(dir)) {
		await exec(`git clone git@github.com:${dir}/${dir}.git`);
	}

	console.timeEnd(`${dir} clone`);
}

async function generate(dir) {
	console.time(`${dir} generate`);

	const list = await read(`${dir}/**/*.{css,js}`)
		.map(parseCss)
		.map(parseJs)
		.mapProp('contents', (contents, i, file) =>
			JSON.stringify(file.docAst, null, 2)
		)
		.mapProp('path', x => x + '/index.html')
		.map(write(`docs/${dir}`));

	console.timeEnd(`${dir} generate`);
	console.log(dir, 'files:', list.length);
}

async function main() {
	process.chdir(__dirname);

	await clone('eslint');
	await generate('eslint');

	await clone('jquery');
	await generate('jquery');
}

main().catch(console.error);
