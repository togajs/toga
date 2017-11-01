import trifle from '@toga/trifle';
import remark from 'remark';
import html from 'remark-html';
import slug from 'remark-slug';

const processor = remark()
	.use(slug)
	.use(html);

export default function formatMarkdown(file) {
	if (!file.docAst) {
		return file;
	}

	file.docAst = trifle(file.docAst, node => {
		if (!node.description) {
			return node;
		}

		node.description = processor.process(node.description);

		return node;
	});

	return file;
}
