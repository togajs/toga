import tunic from '@toga/tunic';

const extensions = new Set(['.css', '.less', '.scss']);

const parse = tunic({
	commentStyle: 'slashStarStar',
	tagStyle: 'atCurlyDash'
});

export default function parseCss(file) {
	if (!file.docAst && extensions.has(file.extname)) {
		file.docAst = parse(file.contents);
	}

	return file;
}
