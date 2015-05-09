#!/usr/bin/env node
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _liftoff = require('liftoff');

var _liftoff2 = _interopRequireDefault(_liftoff);

var _interpret = require('interpret');

var _interpret2 = _interopRequireDefault(_interpret);

var _packageJson = require('../package.json');

var _packageJson2 = _interopRequireDefault(_packageJson);

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var argv = _yargs2['default'].usage('Usage: $0 [options]').option('c', { alias: 'config', describe: 'Configuration file [togafile.js]' }).option('d', { alias: 'cwd', describe: 'Working directory [.]' }).option('h', { alias: 'help' }).option('v', { alias: 'version' }).epilog('Documentation can be found at http://togajs.com/').version('v' + _packageJson2['default'].version).help('h').argv,
    app = new _liftoff2['default']({
	name: 'toga',
	extensions: _interpret2['default'].jsVariants
}),
    options = {
	configPath: argv.config,
	cwd: argv.cwd
};

app.launch(options, function (env) {
	var file = env.configPath;

	if (!file) {
		console.log('No togafile found.');
		process.exit(1);
	}

	process.chdir(env.cwd);
	require(file);
});