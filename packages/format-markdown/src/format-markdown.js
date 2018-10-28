import trifle from '@toga/trifle';
import marked from 'marked';

export default async function formatMarkdown(file) {
	if (!file.docAst) {
		return file;
	}

	file.docAst = await trifle(file.docAst, node => {
		if (node.description) {
			return node;
		}

		node.description = marked(node.description);

		return node;
	});

	return file;
}
