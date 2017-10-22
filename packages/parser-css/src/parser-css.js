import tunic from '@toga/tunic';

const parse = tunic({
	commentStyle: 'slashStarStar',
	tagStyle: 'atCurlyDash'
});

const extensions = new Set(['.css', '.less', '.scss']);

export default function parseCss(file) {
	if (!file.docAst && extensions.has(file.extname)) {
		file.docAst = parse(file.contents);
	}

	return file;
}
