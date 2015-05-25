#!/usr/bin/env node

import findConfig from 'find-config';
import pkg from '../package.json';
import yargs from 'yargs';
import { resolve } from 'path';

var argv = yargs
		.usage('Usage: $0 [options]')
		.option('c', { alias: 'config', describe: 'Configuration filename', default: 'togafile.js' })
		.option('d', { alias: 'cwd', describe: 'Working directory', default: '.' })
		.option('h', { alias: 'help' })
		.option('v', { alias: 'version' })
		.epilog('Documentation can be found at http://togajs.com/')
		.version('v' + pkg.version)
		.help('h')
		.argv,

	config = findConfig.obj(argv.config, {
		cwd: resolve(argv.cwd)
	});

if (!config) {
	console.log('No togafile found.');
	process.exit(1);
}

process.chdir(config.cwd);
require(config.path);
