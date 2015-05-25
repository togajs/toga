#!/usr/bin/env node
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _findConfig = require('find-config');

var _findConfig2 = _interopRequireDefault(_findConfig);

var _packageJson = require('../package.json');

var _packageJson2 = _interopRequireDefault(_packageJson);

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _path = require('path');

var argv = _yargs2['default'].usage('Usage: $0 [options]').option('c', { alias: 'config', describe: 'Configuration filename', 'default': 'togafile.js' }).option('d', { alias: 'cwd', describe: 'Working directory', 'default': '.' }).option('h', { alias: 'help' }).option('v', { alias: 'version' }).epilog('Documentation can be found at http://togajs.com/').version('v' + _packageJson2['default'].version).help('h').argv,
    config = _findConfig2['default'].obj(argv.config, {
	cwd: (0, _path.resolve)(argv.cwd)
});

if (!config) {
	console.log('No togafile found.');
	process.exit(1);
}

process.chdir(config.cwd);
require(config.path);