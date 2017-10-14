module.exports = {
	root: true,
	extends: ['whim', 'prettier'],
	parser: 'babel-eslint',
	parserOptions: {
		ecmaVersion: 8
	},
	env: {
		browser: true,
		es6: true,
		node: true
	}
};
