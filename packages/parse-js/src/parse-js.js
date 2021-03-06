import tunic from '@toga/tunic';

const extensions = new Set(['.js', '.jsx', '.mjs', '.sjs', '.ts']);

const parse = tunic({
	commentStyle: 'slashStarStar',
	tagStyle: 'atCurlyDash'
});

export default function parseJs(file) {
	if (!file.docAst && extensions.has(file.extname)) {
		file.docAst = parse(file.contents);
	}

	return file;
}
