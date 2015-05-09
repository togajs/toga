#!/usr/bin/env node

import Liftoff from 'liftoff';
import interpret from 'interpret';
import pkg from '../package.json';
import yargs from 'yargs';

var argv = yargs
		.usage('Usage: $0 [options]')
		.option('c', { alias: 'config', describe: 'Configuration file [togafile.js]' })
		.option('d', { alias: 'cwd', describe: 'Working directory [.]' })
		.option('h', { alias: 'help' })
		.option('v', { alias: 'version' })
		.epilog('Documentation can be found at http://togajs.com/')
		.version('v' + pkg.version)
		.help('h')
		.argv,

	app = new Liftoff({
		name: 'toga',
		extensions: interpret.jsVariants
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
