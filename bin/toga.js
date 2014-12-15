#!/usr/bin/env node
'use strict';

var Liftoff = require('liftoff'),
	argv = require('commander'),
	interpret = require('interpret'),
	pkg = require('../package.json'),
	v8flags = require('v8flags'),

	cli = new Liftoff({
		name: 'toga',
		extensions: interpret.jsVariants,
		nodeFlags: v8flags.fetch()
	});

argv
	.option('-c, --config <file>', 'specify configuration file [togafile.js]', null)
	.option('-d, --cwd <dir>', 'specify working directory [.]', null)
	.option('-v, --verbose', 'log actions as they happen')
	.version('toga v' + pkg.version)
	.parse(process.argv);

cli.launch(
	{
		configPath: argv.config,
		cwd: argv.cwd
	},
	function (env) {
		var file = env.configPath;

		if (!file) {
			console.log('No togafile found');
			process.exit(1);
		}

		process.chdir(env.cwd);
		require(file);
	}
);
