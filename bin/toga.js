#!/usr/bin/env node

'use strict';

var Liftoff = require('liftoff'),
	interpret = require('interpret'),
	v8flags = require('v8flags'),

	options = {
		name: 'toga',
		extensions: interpret.jsVariants,
		nodeFlags: v8flags.fetch()
	},

	args = {};

new Liftoff(options).launch(args, function (env) {
	if (this.configPath) {
		process.chdir(this.configBase);
		require(env.configPath);
	}
	else {
		console.log('No Togafile found.');
		process.exit(1);
	}
});
