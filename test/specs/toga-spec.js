/*jshint node:true */
'use strict';

var fs = require('fs');
var toga = require('../../lib/toga');

var fixture = fs.readFileSync(__dirname + '/../fixtures/all.js', 'utf8');
var tokens = toga(fixture);

console.log(JSON.stringify(tokens, null, 4));
