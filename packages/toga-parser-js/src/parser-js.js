import tunic from '@toga/tunic';

const parseJs = tunic({
	commentStyle: 'slashStarStar',
	tagStyle: 'atCurlyDash'
});

const extensions = Object.assign(Object.create(null), {
	'.js': true,
	'.jsx': true,
	'.mjs': true,
	'.sjs': true,
	'.ts': true
});

export default function(file) {
	if (file.docAst || !extensions[file.extname]) {
		return file;
	}

	file.docAst = parseJs(file.contents);

	return file;
}
