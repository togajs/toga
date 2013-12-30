(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
console.log("COVERAGE " + "\"/Users/smoeller/Repos/github/shannonmoeller/toga/lib/toga.js\"" + " " + "[[0,13],[28,45],[28,45],[15,46],[167,172],[149,173],[294,300],[271,301],[410,432],[382,433],[529,1116],[529,1116],[508,1117],[1189,1207],[1189,1207],[1168,1208],[1782,1798],[1782,1804],[1782,1813],[1817,1829],[1817,1842],[1782,1842],[1854,1869],[1854,1870],[1879,1896],[1879,1897],[1975,1979],[1975,1995],[1973,1996],[2015,2032],[2015,2045],[2078,2082],[2100,2102],[2078,2128],[2078,2129],[2134,2138],[2156,2158],[2134,2175],[2134,2176],[2205,2209],[2218,2222],[2218,2228],[2234,2238],[2205,2239],[2205,2240],[2245,2249],[2263,2267],[2263,2278],[2284,2288],[2245,2289],[2245,2290],[2295,2299],[2312,2316],[2312,2326],[2332,2336],[2295,2337],[2295,2338],[2343,2347],[2364,2368],[2364,2382],[2388,2392],[2343,2393],[2343,2394],[2399,2403],[2415,2419],[2415,2428],[2434,2438],[2399,2439],[2399,2440],[2543,2557],[2601,2617],[2601,2623],[2635,2639],[2657,2659],[2635,2685],[2635,2686],[2705,2718],[2734,2738],[2734,2746],[2705,2758],[2772,2776],[2705,2788],[2543,2791],[2543,2792],[2871,2885],[2925,2929],[2925,2937],[2925,2948],[2925,2960],[2979,2983],[2979,3004],[3024,3028],[3024,3045],[2871,3048],[2871,3049],[3127,3141],[3221,3234],[3183,3240],[3127,3243],[3127,3244],[3326,3340],[3379,3400],[3379,3401],[3418,3422],[3418,3456],[3472,3476],[3472,3484],[3418,3494],[3418,3494],[3407,3495],[3562,3574],[3599,3603],[3590,3613],[3513,3619],[3513,3619],[3501,3620],[3630,3634],[3630,3642],[3630,3646],[3658,3675],[3658,3676],[3326,3703],[3326,3704],[3788,3802],[3859,3863],[3859,3871],[3859,3871],[3845,3872],[3924,3942],[3924,3942],[3907,3943],[3957,3970],[3957,4005],[3949,4049],[3949,4050],[4080,4095],[4100,4118],[4136,4150],[4136,4150],[4123,4151],[4168,4192],[4168,4199],[4168,4199],[4156,4200],[4213,4222],[4248,4277],[4281,4283],[4248,4283],[4234,4291],[4234,4292],[4318,4337],[4341,4343],[4318,4343],[4301,4351],[4301,4352],[4384,4410],[4384,4420],[4366,4421],[4483,4516],[4483,4517],[3788,4626],[3788,4627],[4704,4718],[4766,4770],[4766,4778],[4766,4778],[4752,4779],[4796,4809],[4796,4833],[4796,4833],[4784,4834],[4848,4856],[4848,4856],[4839,4857],[4873,4881],[4873,4881],[4862,4882],[4898,4906],[4898,4912],[4898,4912],[4887,4913],[4936,4944],[4936,4950],[4936,4950],[4918,4951],[4968,4970],[4968,4970],[4956,4971],[5007,5020],[5007,5029],[5006,5029],[5045,5064],[5094,5104],[5080,5118],[5080,5119],[5159,5177],[5159,5178],[5198,5214],[5198,5215],[5271,5285],[5271,5286],[5318,5335],[5318,5336],[5368,5385],[5368,5386],[5425,5456],[5425,5457],[4704,5484],[4704,5485],[5487,5508],[5487,5509]]");var __coverage = {"0":[0,13],"1":[28,45],"2":[28,45],"3":[15,46],"4":[167,172],"5":[149,173],"6":[294,300],"7":[271,301],"8":[410,432],"9":[382,433],"10":[529,1116],"11":[529,1116],"12":[508,1117],"13":[1189,1207],"14":[1189,1207],"15":[1168,1208],"16":[1782,1798],"17":[1782,1804],"18":[1782,1813],"19":[1817,1829],"20":[1817,1842],"21":[1782,1842],"22":[1854,1869],"23":[1854,1870],"24":[1879,1896],"25":[1879,1897],"26":[1975,1979],"27":[1975,1995],"28":[1973,1996],"29":[2015,2032],"30":[2015,2045],"31":[2078,2082],"32":[2100,2102],"33":[2078,2128],"34":[2078,2129],"35":[2134,2138],"36":[2156,2158],"37":[2134,2175],"38":[2134,2176],"39":[2205,2209],"40":[2218,2222],"41":[2218,2228],"42":[2234,2238],"43":[2205,2239],"44":[2205,2240],"45":[2245,2249],"46":[2263,2267],"47":[2263,2278],"48":[2284,2288],"49":[2245,2289],"50":[2245,2290],"51":[2295,2299],"52":[2312,2316],"53":[2312,2326],"54":[2332,2336],"55":[2295,2337],"56":[2295,2338],"57":[2343,2347],"58":[2364,2368],"59":[2364,2382],"60":[2388,2392],"61":[2343,2393],"62":[2343,2394],"63":[2399,2403],"64":[2415,2419],"65":[2415,2428],"66":[2434,2438],"67":[2399,2439],"68":[2399,2440],"69":[2543,2557],"70":[2601,2617],"71":[2601,2623],"72":[2635,2639],"73":[2657,2659],"74":[2635,2685],"75":[2635,2686],"76":[2705,2718],"77":[2734,2738],"78":[2734,2746],"79":[2705,2758],"80":[2772,2776],"81":[2705,2788],"82":[2543,2791],"83":[2543,2792],"84":[2871,2885],"85":[2925,2929],"86":[2925,2937],"87":[2925,2948],"88":[2925,2960],"89":[2979,2983],"90":[2979,3004],"91":[3024,3028],"92":[3024,3045],"93":[2871,3048],"94":[2871,3049],"95":[3127,3141],"96":[3221,3234],"97":[3183,3240],"98":[3127,3243],"99":[3127,3244],"100":[3326,3340],"101":[3379,3400],"102":[3379,3401],"103":[3418,3422],"104":[3418,3456],"105":[3472,3476],"106":[3472,3484],"107":[3418,3494],"108":[3418,3494],"109":[3407,3495],"110":[3562,3574],"111":[3599,3603],"112":[3590,3613],"113":[3513,3619],"114":[3513,3619],"115":[3501,3620],"116":[3630,3634],"117":[3630,3642],"118":[3630,3646],"119":[3658,3675],"120":[3658,3676],"121":[3326,3703],"122":[3326,3704],"123":[3788,3802],"124":[3859,3863],"125":[3859,3871],"126":[3859,3871],"127":[3845,3872],"128":[3924,3942],"129":[3924,3942],"130":[3907,3943],"131":[3957,3970],"132":[3957,4005],"133":[3949,4049],"134":[3949,4050],"135":[4080,4095],"136":[4100,4118],"137":[4136,4150],"138":[4136,4150],"139":[4123,4151],"140":[4168,4192],"141":[4168,4199],"142":[4168,4199],"143":[4156,4200],"144":[4213,4222],"145":[4248,4277],"146":[4281,4283],"147":[4248,4283],"148":[4234,4291],"149":[4234,4292],"150":[4318,4337],"151":[4341,4343],"152":[4318,4343],"153":[4301,4351],"154":[4301,4352],"155":[4384,4410],"156":[4384,4420],"157":[4366,4421],"158":[4483,4516],"159":[4483,4517],"160":[3788,4626],"161":[3788,4627],"162":[4704,4718],"163":[4766,4770],"164":[4766,4778],"165":[4766,4778],"166":[4752,4779],"167":[4796,4809],"168":[4796,4833],"169":[4796,4833],"170":[4784,4834],"171":[4848,4856],"172":[4848,4856],"173":[4839,4857],"174":[4873,4881],"175":[4873,4881],"176":[4862,4882],"177":[4898,4906],"178":[4898,4912],"179":[4898,4912],"180":[4887,4913],"181":[4936,4944],"182":[4936,4950],"183":[4936,4950],"184":[4918,4951],"185":[4968,4970],"186":[4968,4970],"187":[4956,4971],"188":[5007,5020],"189":[5007,5029],"190":[5006,5029],"191":[5045,5064],"192":[5094,5104],"193":[5080,5118],"194":[5080,5119],"195":[5159,5177],"196":[5159,5178],"197":[5198,5214],"198":[5198,5215],"199":[5271,5285],"200":[5271,5286],"201":[5318,5335],"202":[5318,5336],"203":[5368,5385],"204":[5368,5386],"205":[5425,5456],"206":[5425,5457],"207":[4704,5484],"208":[4704,5485],"209":[5487,5508],"210":[5487,5509]};var __coverageWrap = function (index, value) {if (__coverage[index]) console.log("COVERED " + "\"/Users/smoeller/Repos/github/shannonmoeller/toga/lib/toga.js\"" + " " + index);delete __coverage[index];return value};
{ __coverageWrap(0);'use strict';};

{ __coverageWrap(3);var copier = __coverageWrap(2,__coverageWrap(1,require('copier')));};

/**
 * Matches start of each line. Useful for getting a count of all lines.
 *
 * @type {RegExp}
 */
{ __coverageWrap(5);var linePattern = __coverageWrap(4,/^/gm);};

/**
 * Matches empty lines. Useful for getting a count of empty lines.
 *
 * @type {RegExp}
 */
{ __coverageWrap(7);var emptyLinePattern = __coverageWrap(6,/^$/gm);};

/**
 * Matches surrounding empty lines to be trimmed.
 *
 * @type {RegExp}
 */
{ __coverageWrap(9);var edgeEmptyLinesPattern = __coverageWrap(8,/^[\t ]*\n|\n[\t ]*$/g);};

/**
 * Default C-style grammar.
 *
 * @type {Object.<String,RegExp>}
 */
{ __coverageWrap(12);var defaultGrammar = __coverageWrap(11,__coverageWrap(10,{
    // Matches block delimiters
    blockSplit: /(^[\t ]*\/\*\*(?!\/)[\s\S]*?\s*\*\/)/m,

    // Matches block content
    blockParse: /^[\t ]*\/\*\*(?!\/)([\s\S]*?)\s*\*\//m,

    // Matches indent characters
    indent: /^[\t \*]/gm,

    // Matches tag delimiters
    tagSplit: /^[\t ]*@/m,

    // Matches tag content `tag {Type} [name] - Description.`
    tagParse: /^(\w+)[\t \-]*(\{[^\}]+\})?[\t \-]*(\[[^\]]*\]\*?|\S*)?[\t \-]*([\s\S]+)?$/m,

    // Matches tags that should include a name property
    named: /^(arg(ument)?|augments|class|extends|method|param|prop(erty)?)$/
}));};

/**
 * Default options.
 *
 * @type {Object}
 */
{ __coverageWrap(15);var defaultOptions = __coverageWrap(14,__coverageWrap(13,{
    raw: false
}));};

/**
 * # Toga
 *
 * The stupid doc-block parser. Generates an abstract syntax tree based on a
 * customizable regular-expression grammar. Defaults to C-style comment blocks,
 * so it supports JavaScript, PHP, C++, and even CSS right out of the box.
 *
 * Tags are parsed greedily. If it looks like a tag, it's a tag. What you do
 * with them is completely up to you. Render something human-readable, perhaps?
 *
 * @class Toga
 * @param {String} [block]
 * @param {Object} [grammar]
 * @constructor
 */
function Toga(block, grammar) {
    // Make `block` optional
    if (__coverageWrap(21,__coverageWrap(18,__coverageWrap(17,__coverageWrap(16,arguments.length) === 1) && block) && __coverageWrap(20,__coverageWrap(19,typeof block) === 'object'))) {
        { __coverageWrap(23);__coverageWrap(22,grammar = block);};
        { __coverageWrap(25);__coverageWrap(24,block = undefined);};
    }

    // Support functional execution: `toga(block, grammar)`
    if (__coverageWrap(28,!(__coverageWrap(27,__coverageWrap(26,this) instanceof Toga)))) {
        return __coverageWrap(30,__coverageWrap(29,new Toga(grammar)).parse(block));
    }

    // Set defaults
    { __coverageWrap(34);__coverageWrap(33,__coverageWrap(31,this).grammar = copier(__coverageWrap(32,{}), defaultGrammar, grammar));};
    { __coverageWrap(38);__coverageWrap(37,__coverageWrap(35,this).options = copier(__coverageWrap(36,{}), defaultOptions));};

    // Enforce context
    { __coverageWrap(44);__coverageWrap(43,__coverageWrap(39,this).parse = __coverageWrap(41,__coverageWrap(40,this).parse).bind(__coverageWrap(42,this)));};
    { __coverageWrap(50);__coverageWrap(49,__coverageWrap(45,this).parseBlock = __coverageWrap(47,__coverageWrap(46,this).parseBlock).bind(__coverageWrap(48,this)));};
    { __coverageWrap(56);__coverageWrap(55,__coverageWrap(51,this).parseCode = __coverageWrap(53,__coverageWrap(52,this).parseCode).bind(__coverageWrap(54,this)));};
    { __coverageWrap(62);__coverageWrap(61,__coverageWrap(57,this).parseDocBlock = __coverageWrap(59,__coverageWrap(58,this).parseDocBlock).bind(__coverageWrap(60,this)));};
    { __coverageWrap(68);__coverageWrap(67,__coverageWrap(63,this).parseTag = __coverageWrap(65,__coverageWrap(64,this).parseTag).bind(__coverageWrap(66,this)));};
}

/**
 * @method parse
 * @param {String} block
 * @param {String} [options]
 * @return {String}
 */
{ __coverageWrap(83);__coverageWrap(82,__coverageWrap(69,Toga.prototype).parse = function(block, options) {
    if (__coverageWrap(71,__coverageWrap(70,arguments.length) === 2)) {
        { __coverageWrap(75);__coverageWrap(74,__coverageWrap(72,this).options = copier(__coverageWrap(73,{}), defaultOptions, options));};
    }

    return __coverageWrap(81,__coverageWrap(79,__coverageWrap(76,String(block))
        .split(__coverageWrap(78,__coverageWrap(77,this).grammar).blockSplit))
        .map(__coverageWrap(80,this).parseBlock));
});};

/**
 * @method parseBlock
 * @param {String} [block]
 * @return {Object}
 */
{ __coverageWrap(94);__coverageWrap(93,__coverageWrap(84,Toga.prototype).parseBlock = function(block) {
    if (__coverageWrap(88,__coverageWrap(87,__coverageWrap(86,__coverageWrap(85,this).grammar).blockParse).test(block))) {
        return __coverageWrap(90,__coverageWrap(89,this).parseDocBlock(block));
    }

    return __coverageWrap(92,__coverageWrap(91,this).parseCode(block));
});};

/**
 * @method parseCode
 * @param {String} [block]
 * @return {Object}
 */
{ __coverageWrap(99);__coverageWrap(98,__coverageWrap(95,Toga.prototype).parseCode = function(block) {
    return __coverageWrap(97,{
        type: 'Code',
        body: __coverageWrap(96,String(block))
    });
});};

/**
 * @method parseDocBlock
 * @param {String} [block]
 * @return {Object}
 */
{ __coverageWrap(122);__coverageWrap(121,__coverageWrap(100,Toga.prototype).parseDocBlock = function(block) {
    { __coverageWrap(102);__coverageWrap(101,block = String(block));};

    { __coverageWrap(109);var tags = __coverageWrap(108,__coverageWrap(107,__coverageWrap(104,__coverageWrap(103,this)
        .normalizeDocBlock(block))
        .split(__coverageWrap(106,__coverageWrap(105,this).grammar).tagSplit)));};

    { __coverageWrap(115);var token = __coverageWrap(114,__coverageWrap(113,{
        type: 'DocBlock',
        description: __coverageWrap(110,tags.shift()),
        tags: __coverageWrap(112,tags.map(__coverageWrap(111,this).parseTag))
    }));};

    if (__coverageWrap(118,__coverageWrap(117,__coverageWrap(116,this).options).raw)) {
        { __coverageWrap(120);__coverageWrap(119,token.raw = block);};
    }

    return token;
});};

/**
 * @method normalizeDocBlock
 * @param {String} block
 * @return {String}
 */
{ __coverageWrap(161);__coverageWrap(160,__coverageWrap(123,Toga.prototype).normalizeDocBlock = function(block) {
    { __coverageWrap(127);var grammar = __coverageWrap(126,__coverageWrap(125,__coverageWrap(124,this).grammar));};

    // Trim comment wrappers
    { __coverageWrap(130);var blockParse = __coverageWrap(129,__coverageWrap(128,grammar.blockParse));};

    { __coverageWrap(134);__coverageWrap(133,block = __coverageWrap(132,__coverageWrap(131,String(block))
        .replace(blockParse, '$1'))
        .replace(edgeEmptyLinesPattern, ''));};

    // Unindent content
    { __coverageWrap(135);var emptyLines;};
    { __coverageWrap(136);var indentedLines;};
    { __coverageWrap(139);var indent = __coverageWrap(138,__coverageWrap(137,grammar.indent));};
    { __coverageWrap(143);var lines = __coverageWrap(142,__coverageWrap(141,__coverageWrap(140,block.match(linePattern)).length));};

    while (__coverageWrap(144,lines > 0)) {
        { __coverageWrap(149);__coverageWrap(148,emptyLines = (__coverageWrap(147,__coverageWrap(145,block.match(emptyLinePattern)) || __coverageWrap(146,[]))).length);};
        { __coverageWrap(154);__coverageWrap(153,indentedLines = (__coverageWrap(152,__coverageWrap(150,block.match(indent)) || __coverageWrap(151,[]))).length);};

        if (__coverageWrap(157,indentedLines && (__coverageWrap(156,__coverageWrap(155,emptyLines + indentedLines) === lines)))) {
            // Strip leading indent character
            { __coverageWrap(159);__coverageWrap(158,block = block.replace(indent, ''));};
        } else {
            // Not indented anymore
            break;
        }
    }

    return block;
});};

/**
 * @method parseTag
 * @param {String} [block]
 * @return {Object}
 */
{ __coverageWrap(208);__coverageWrap(207,__coverageWrap(162,Toga.prototype).parseTag = function(block) {
    { __coverageWrap(166);var grammar = __coverageWrap(165,__coverageWrap(164,__coverageWrap(163,this).grammar));};
    { __coverageWrap(170);var parts = __coverageWrap(169,__coverageWrap(168,__coverageWrap(167,String(block)).match(grammar.tagParse)));};
    { __coverageWrap(173);var id = __coverageWrap(172,__coverageWrap(171,parts[1]));};
    { __coverageWrap(176);var type = __coverageWrap(175,__coverageWrap(174,parts[2]));};
    { __coverageWrap(180);var name = __coverageWrap(179,__coverageWrap(178,__coverageWrap(177,parts[3]) || ''));};
    { __coverageWrap(184);var description = __coverageWrap(183,__coverageWrap(182,__coverageWrap(181,parts[4]) || ''));};
    { __coverageWrap(187);var token = __coverageWrap(186,__coverageWrap(185,{}));};

    // Handle named tags
    if (__coverageWrap(190,!__coverageWrap(189,__coverageWrap(188,grammar.named).test(id)))) {
        if (__coverageWrap(191,name && description)) {
            { __coverageWrap(194);__coverageWrap(193,description = __coverageWrap(192,name + ' ') + description);};
        } else if (name) {
            { __coverageWrap(196);__coverageWrap(195,description = name);};
        }

        { __coverageWrap(198);__coverageWrap(197,name = undefined);};
    }

    // Keep tokens light

    if (id) {
        { __coverageWrap(200);__coverageWrap(199,token.tag = id);};
    }

    if (type) {
        { __coverageWrap(202);__coverageWrap(201,token.type = type);};
    }

    if (name) {
        { __coverageWrap(204);__coverageWrap(203,token.name = name);};
    }

    if (description) {
        { __coverageWrap(206);__coverageWrap(205,token.description = description);};
    }

    return token;
});};

{ __coverageWrap(210);__coverageWrap(209,module.exports = Toga);};

},{"copier":4}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"PcZj9L":[function(require,module,exports){
var TA = require('typedarray')
var xDataView = typeof DataView === 'undefined'
  ? TA.DataView : DataView
var xArrayBuffer = typeof ArrayBuffer === 'undefined'
  ? TA.ArrayBuffer : ArrayBuffer
var xUint8Array = typeof Uint8Array === 'undefined'
  ? TA.Uint8Array : Uint8Array

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

var browserSupport

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 *
 * Firefox is a special case because it doesn't allow augmenting "native" object
 * instances. See `ProxyBuffer` below for more details.
 */
function Buffer (subject, encoding) {
  var type = typeof subject

  // Work-around: node's base64 implementation
  // allows for non-padded strings while base64-js
  // does not..
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // Assume object is an array
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf = augment(new xUint8Array(length))
  if (Buffer.isBuffer(subject)) {
    // Speed optimization -- use set if we're copying from a Uint8Array
    buf.set(subject)
  } else if (isArrayIsh(subject)) {
    // Treat array-ish objects as a byte array.
    for (var i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function(encoding) {
  switch ((encoding + '').toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
    case 'raw':
      return true

    default:
      return false
  }
}

Buffer.isBuffer = function isBuffer (b) {
  return b && b._isBuffer
}

Buffer.byteLength = function (str, encoding) {
  switch (encoding || 'utf8') {
    case 'hex':
      return str.length / 2

    case 'utf8':
    case 'utf-8':
      return utf8ToBytes(str).length

    case 'ascii':
    case 'binary':
      return str.length

    case 'base64':
      return base64ToBytes(str).length

    default:
      throw new Error('Unknown encoding')
  }
}

Buffer.concat = function (list, totalLength) {
  if (!Array.isArray(list)) {
    throw new Error('Usage: Buffer.concat(list, [totalLength])\n' +
        'list should be an Array.')
  }

  var i
  var buf

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      buf = list[i]
      totalLength += buf.length
    }
  }

  var buffer = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    buf = list[i]
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

// INSTANCE METHODS
// ================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) {
    throw new Error('Invalid hex string')
  }
  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(byte)) throw new Error('Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var bytes, pos
  return Buffer._charsWritten = blitBuffer(utf8ToBytes(string), buf, offset, length)
}

function _asciiWrite (buf, string, offset, length) {
  var bytes, pos
  return Buffer._charsWritten = blitBuffer(asciiToBytes(string), buf, offset, length)
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var bytes, pos
  return Buffer._charsWritten = blitBuffer(base64ToBytes(string), buf, offset, length)
}

function BufferWrite (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  switch (encoding) {
    case 'hex':
      return _hexWrite(this, string, offset, length)

    case 'utf8':
    case 'utf-8':
      return _utf8Write(this, string, offset, length)

    case 'ascii':
      return _asciiWrite(this, string, offset, length)

    case 'binary':
      return _binaryWrite(this, string, offset, length)

    case 'base64':
      return _base64Write(this, string, offset, length)

    default:
      throw new Error('Unknown encoding')
  }
}

function BufferToString (encoding, start, end) {
  var self = (this instanceof ProxyBuffer)
    ? this._proxy
    : this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  switch (encoding) {
    case 'hex':
      return _hexSlice(self, start, end)

    case 'utf8':
    case 'utf-8':
      return _utf8Slice(self, start, end)

    case 'ascii':
      return _asciiSlice(self, start, end)

    case 'binary':
      return _binarySlice(self, start, end)

    case 'base64':
      return _base64Slice(self, start, end)

    default:
      throw new Error('Unknown encoding')
  }
}

function BufferToJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
function BufferCopy (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  if (end < start)
    throw new Error('sourceEnd < sourceStart')
  if (target_start < 0 || target_start >= target.length)
    throw new Error('targetStart out of bounds')
  if (start < 0 || start >= source.length)
    throw new Error('sourceStart out of bounds')
  if (end < 0 || end > source.length)
    throw new Error('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  // copy!
  for (var i = 0; i < end - start; i++)
    target[i + target_start] = this[i + start]
}

function _base64Slice (buf, start, end) {
  var bytes = buf.slice(start, end)
  return require('base64-js').fromByteArray(bytes)
}

function _utf8Slice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  var tmp = ''
  var i = 0
  while (i < bytes.length) {
    if (bytes[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(bytes[i])
      tmp = ''
    } else {
      tmp += '%' + bytes[i].toString(16)
    }

    i++
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var ret = ''
  for (var i = 0; i < bytes.length; i++)
    ret += String.fromCharCode(bytes[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

// TODO: add test that modifying the new buffer slice will modify memory in the
// original buffer! Use code from:
// http://nodejs.org/api/buffer.html#buffer_buf_slice_start_end
function BufferSlice (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)
  return augment(this.subarray(start, end)) // Uint8Array built-in method
}

function BufferReadUInt8 (offset, noAssert) {
  var buf = this
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < buf.length, 'Trying to read beyond buffer length')
  }

  if (offset >= buf.length)
    return

  return buf[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len) {
    return
  } else if (offset + 1 === len) {
    var dv = new xDataView(new xArrayBuffer(2))
    dv.setUint8(0, buf[len - 1])
    return dv.getUint16(0, littleEndian)
  } else {
    return buf._dataview.getUint16(offset, littleEndian)
  }
}

function BufferReadUInt16LE (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

function BufferReadUInt16BE (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len) {
    return
  } else if (offset + 3 >= len) {
    var dv = new xDataView(new xArrayBuffer(4))
    for (var i = 0; i + offset < len; i++) {
      dv.setUint8(i, buf[i + offset])
    }
    return dv.getUint32(0, littleEndian)
  } else {
    return buf._dataview.getUint32(offset, littleEndian)
  }
}

function BufferReadUInt32LE (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

function BufferReadUInt32BE (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

function BufferReadInt8 (offset, noAssert) {
  var buf = this
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < buf.length, 'Trying to read beyond buffer length')
  }

  if (offset >= buf.length)
    return

  return buf._dataview.getInt8(offset)
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len) {
    return
  } else if (offset + 1 === len) {
    var dv = new xDataView(new xArrayBuffer(2))
    dv.setUint8(0, buf[len - 1])
    return dv.getInt16(0, littleEndian)
  } else {
    return buf._dataview.getInt16(offset, littleEndian)
  }
}

function BufferReadInt16LE (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

function BufferReadInt16BE (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len) {
    return
  } else if (offset + 3 >= len) {
    var dv = new xDataView(new xArrayBuffer(4))
    for (var i = 0; i + offset < len; i++) {
      dv.setUint8(i, buf[i + offset])
    }
    return dv.getInt32(0, littleEndian)
  } else {
    return buf._dataview.getInt32(offset, littleEndian)
  }
}

function BufferReadInt32LE (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

function BufferReadInt32BE (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return buf._dataview.getFloat32(offset, littleEndian)
}

function BufferReadFloatLE (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

function BufferReadFloatBE (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return buf._dataview.getFloat64(offset, littleEndian)
}

function BufferReadDoubleLE (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

function BufferReadDoubleBE (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

function BufferWriteUInt8 (value, offset, noAssert) {
  var buf = this
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= buf.length) return

  buf[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len) {
    return
  } else if (offset + 1 === len) {
    var dv = new xDataView(new xArrayBuffer(2))
    dv.setUint16(0, value, littleEndian)
    buf[offset] = dv.getUint8(0)
  } else {
    buf._dataview.setUint16(offset, value, littleEndian)
  }
}

function BufferWriteUInt16LE (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

function BufferWriteUInt16BE (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len) {
    return
  } else if (offset + 3 >= len) {
    var dv = new xDataView(new xArrayBuffer(4))
    dv.setUint32(0, value, littleEndian)
    for (var i = 0; i + offset < len; i++) {
      buf[i + offset] = dv.getUint8(i)
    }
  } else {
    buf._dataview.setUint32(offset, value, littleEndian)
  }
}

function BufferWriteUInt32LE (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

function BufferWriteUInt32BE (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

function BufferWriteInt8 (value, offset, noAssert) {
  var buf = this
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= buf.length) return

  buf._dataview.setInt8(offset, value)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len) {
    return
  } else if (offset + 1 === len) {
    var dv = new xDataView(new xArrayBuffer(2))
    dv.setInt16(0, value, littleEndian)
    buf[offset] = dv.getUint8(0)
  } else {
    buf._dataview.setInt16(offset, value, littleEndian)
  }
}

function BufferWriteInt16LE (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

function BufferWriteInt16BE (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len) {
    return
  } else if (offset + 3 >= len) {
    var dv = new xDataView(new xArrayBuffer(4))
    dv.setInt32(0, value, littleEndian)
    for (var i = 0; i + offset < len; i++) {
      buf[i + offset] = dv.getUint8(i)
    }
  } else {
    buf._dataview.setInt32(offset, value, littleEndian)
  }
}

function BufferWriteInt32LE (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

function BufferWriteInt32BE (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len) {
    return
  } else if (offset + 3 >= len) {
    var dv = new xDataView(new xArrayBuffer(4))
    dv.setFloat32(0, value, littleEndian)
    for (var i = 0; i + offset < len; i++) {
      buf[i + offset] = dv.getUint8(i)
    }
  } else {
    buf._dataview.setFloat32(offset, value, littleEndian)
  }
}

function BufferWriteFloatLE (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

function BufferWriteFloatBE (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len) {
    return
  } else if (offset + 7 >= len) {
    var dv = new xDataView(new xArrayBuffer(8))
    dv.setFloat64(0, value, littleEndian)
    for (var i = 0; i + offset < len; i++) {
      buf[i + offset] = dv.getUint8(i)
    }
  } else {
    buf._dataview.setFloat64(offset, value, littleEndian)
  }
}

function BufferWriteDoubleLE (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

function BufferWriteDoubleBE (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
function BufferFill (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error('value is not a number')
  }

  if (end < start) throw new Error('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) {
    throw new Error('start out of bounds')
  }

  if (end < 0 || end > this.length) {
    throw new Error('end out of bounds')
  }

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

function BufferInspect () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

// Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
// Added in Node 0.12.
function BufferToArrayBuffer () {
  return (new Buffer(this)).buffer
}


// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

/**
 * Check to see if the browser supports augmenting a `Uint8Array` instance.
 * @return {boolean}
 */
function _browserSupport () {
  var arr = new xUint8Array(0)
  arr.foo = function () { return 42 }

  try {
    return (42 === arr.foo())
  } catch (e) {
    return false
  }
}

/**
 * Class: ProxyBuffer
 * ==================
 *
 * Only used in Firefox, since Firefox does not allow augmenting "native"
 * objects (like Uint8Array instances) with new properties for some unknown
 * (probably silly) reason. So we'll use an ES6 Proxy (supported since
 * Firefox 18) to wrap the Uint8Array instance without actually adding any
 * properties to it.
 *
 * Instances of this "fake" Buffer class are the "target" of the
 * ES6 Proxy (see `augment` function).
 *
 * We couldn't just use the `Uint8Array` as the target of the `Proxy` because
 * Proxies have an important limitation on trapping the `toString` method.
 * `Object.prototype.toString.call(proxy)` gets called whenever something is
 * implicitly cast to a String. Unfortunately, with a `Proxy` this
 * unconditionally returns `Object.prototype.toString.call(target)` which would
 * always return "[object Uint8Array]" if we used the `Uint8Array` instance as
 * the target. And, remember, in Firefox we cannot redefine the `Uint8Array`
 * instance's `toString` method.
 *
 * So, we use this `ProxyBuffer` class as the proxy's "target". Since this class
 * has its own custom `toString` method, it will get called whenever `toString`
 * gets called, implicitly or explicitly, on the `Proxy` instance.
 *
 * We also have to define the Uint8Array methods `subarray` and `set` on
 * `ProxyBuffer` because if we didn't then `proxy.subarray(0)` would have its
 * `this` set to `proxy` (a `Proxy` instance) which throws an exception in
 * Firefox which expects it to be a `TypedArray` instance.
 */
function ProxyBuffer (arr) {
  this._arr = arr

  if (arr.byteLength !== 0)
    this._dataview = new xDataView(arr.buffer, arr.byteOffset, arr.byteLength)
}

ProxyBuffer.prototype.write = BufferWrite
ProxyBuffer.prototype.toString = BufferToString
ProxyBuffer.prototype.toLocaleString = BufferToString
ProxyBuffer.prototype.toJSON = BufferToJSON
ProxyBuffer.prototype.copy = BufferCopy
ProxyBuffer.prototype.slice = BufferSlice
ProxyBuffer.prototype.readUInt8 = BufferReadUInt8
ProxyBuffer.prototype.readUInt16LE = BufferReadUInt16LE
ProxyBuffer.prototype.readUInt16BE = BufferReadUInt16BE
ProxyBuffer.prototype.readUInt32LE = BufferReadUInt32LE
ProxyBuffer.prototype.readUInt32BE = BufferReadUInt32BE
ProxyBuffer.prototype.readInt8 = BufferReadInt8
ProxyBuffer.prototype.readInt16LE = BufferReadInt16LE
ProxyBuffer.prototype.readInt16BE = BufferReadInt16BE
ProxyBuffer.prototype.readInt32LE = BufferReadInt32LE
ProxyBuffer.prototype.readInt32BE = BufferReadInt32BE
ProxyBuffer.prototype.readFloatLE = BufferReadFloatLE
ProxyBuffer.prototype.readFloatBE = BufferReadFloatBE
ProxyBuffer.prototype.readDoubleLE = BufferReadDoubleLE
ProxyBuffer.prototype.readDoubleBE = BufferReadDoubleBE
ProxyBuffer.prototype.writeUInt8 = BufferWriteUInt8
ProxyBuffer.prototype.writeUInt16LE = BufferWriteUInt16LE
ProxyBuffer.prototype.writeUInt16BE = BufferWriteUInt16BE
ProxyBuffer.prototype.writeUInt32LE = BufferWriteUInt32LE
ProxyBuffer.prototype.writeUInt32BE = BufferWriteUInt32BE
ProxyBuffer.prototype.writeInt8 = BufferWriteInt8
ProxyBuffer.prototype.writeInt16LE = BufferWriteInt16LE
ProxyBuffer.prototype.writeInt16BE = BufferWriteInt16BE
ProxyBuffer.prototype.writeInt32LE = BufferWriteInt32LE
ProxyBuffer.prototype.writeInt32BE = BufferWriteInt32BE
ProxyBuffer.prototype.writeFloatLE = BufferWriteFloatLE
ProxyBuffer.prototype.writeFloatBE = BufferWriteFloatBE
ProxyBuffer.prototype.writeDoubleLE = BufferWriteDoubleLE
ProxyBuffer.prototype.writeDoubleBE = BufferWriteDoubleBE
ProxyBuffer.prototype.fill = BufferFill
ProxyBuffer.prototype.inspect = BufferInspect
ProxyBuffer.prototype.toArrayBuffer = BufferToArrayBuffer
ProxyBuffer.prototype._isBuffer = true
ProxyBuffer.prototype.subarray = function () {
  return this._arr.subarray.apply(this._arr, arguments)
}
ProxyBuffer.prototype.set = function () {
  return this._arr.set.apply(this._arr, arguments)
}

var ProxyHandler = {
  get: function (target, name) {
    if (name in target) return target[name]
    else return target._arr[name]
  },
  set: function (target, name, value) {
    target._arr[name] = value
  }
}

function augment (arr) {
  if (browserSupport === undefined) {
    browserSupport = _browserSupport()
  }

  if (browserSupport) {
    // Augment the Uint8Array *instance* (not the class!) with Buffer methods
    arr.write = BufferWrite
    arr.toString = BufferToString
    arr.toLocaleString = BufferToString
    arr.toJSON = BufferToJSON
    arr.copy = BufferCopy
    arr.slice = BufferSlice
    arr.readUInt8 = BufferReadUInt8
    arr.readUInt16LE = BufferReadUInt16LE
    arr.readUInt16BE = BufferReadUInt16BE
    arr.readUInt32LE = BufferReadUInt32LE
    arr.readUInt32BE = BufferReadUInt32BE
    arr.readInt8 = BufferReadInt8
    arr.readInt16LE = BufferReadInt16LE
    arr.readInt16BE = BufferReadInt16BE
    arr.readInt32LE = BufferReadInt32LE
    arr.readInt32BE = BufferReadInt32BE
    arr.readFloatLE = BufferReadFloatLE
    arr.readFloatBE = BufferReadFloatBE
    arr.readDoubleLE = BufferReadDoubleLE
    arr.readDoubleBE = BufferReadDoubleBE
    arr.writeUInt8 = BufferWriteUInt8
    arr.writeUInt16LE = BufferWriteUInt16LE
    arr.writeUInt16BE = BufferWriteUInt16BE
    arr.writeUInt32LE = BufferWriteUInt32LE
    arr.writeUInt32BE = BufferWriteUInt32BE
    arr.writeInt8 = BufferWriteInt8
    arr.writeInt16LE = BufferWriteInt16LE
    arr.writeInt16BE = BufferWriteInt16BE
    arr.writeInt32LE = BufferWriteInt32LE
    arr.writeInt32BE = BufferWriteInt32BE
    arr.writeFloatLE = BufferWriteFloatLE
    arr.writeFloatBE = BufferWriteFloatBE
    arr.writeDoubleLE = BufferWriteDoubleLE
    arr.writeDoubleBE = BufferWriteDoubleBE
    arr.fill = BufferFill
    arr.inspect = BufferInspect
    arr.toArrayBuffer = BufferToArrayBuffer
    arr._isBuffer = true

    if (arr.byteLength !== 0)
      arr._dataview = new xDataView(arr.buffer, arr.byteOffset, arr.byteLength)

    return arr

  } else {
    // This is a browser that doesn't support augmenting the `Uint8Array`
    // instance (*ahem* Firefox) so use an ES6 `Proxy`.
    var proxyBuffer = new ProxyBuffer(arr)
    var proxy = new Proxy(proxyBuffer, ProxyHandler)
    proxyBuffer._proxy = proxy
    return proxy
  }
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArrayIsh (subject) {
  return Array.isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++)
    if (str.charCodeAt(i) <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var h = encodeURIComponent(str.charAt(i)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }

  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }

  return byteArray
}

function base64ToBytes (str) {
  return require('base64-js').toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos, i = 0
  while (i < length) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break

    dst[i + offset] = src[i]
    i++
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 *
 *      value           The number to check for validity
 *
 *      max             The maximum value
 */
function verifuint (value, max) {
  assert(typeof (value) == 'number', 'cannot write a non-number as a number')
  assert(value >= 0,
      'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

/*
 * A series of checks to make sure we actually have a signed 32-bit number
 */
function verifsint(value, max, min) {
  assert(typeof (value) == 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754(value, max, min) {
  assert(typeof (value) == 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

},{"base64-js":3,"typedarray":4}],"native-buffer-browserify":[function(require,module,exports){
module.exports=require('PcZj9L');
},{}],3:[function(require,module,exports){
(function (exports) {
	'use strict';

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	function b64ToByteArray(b64) {
		var i, j, l, tmp, placeHolders, arr;
	
		if (b64.length % 4 > 0) {
			throw 'Invalid string. Length must be a multiple of 4';
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		placeHolders = b64.indexOf('=');
		placeHolders = placeHolders > 0 ? b64.length - placeHolders : 0;

		// base64 is 4/3 + up to two characters of the original data
		arr = [];//new Uint8Array(b64.length * 3 / 4 - placeHolders);

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length;

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (lookup.indexOf(b64[i]) << 18) | (lookup.indexOf(b64[i + 1]) << 12) | (lookup.indexOf(b64[i + 2]) << 6) | lookup.indexOf(b64[i + 3]);
			arr.push((tmp & 0xFF0000) >> 16);
			arr.push((tmp & 0xFF00) >> 8);
			arr.push(tmp & 0xFF);
		}

		if (placeHolders === 2) {
			tmp = (lookup.indexOf(b64[i]) << 2) | (lookup.indexOf(b64[i + 1]) >> 4);
			arr.push(tmp & 0xFF);
		} else if (placeHolders === 1) {
			tmp = (lookup.indexOf(b64[i]) << 10) | (lookup.indexOf(b64[i + 1]) << 4) | (lookup.indexOf(b64[i + 2]) >> 2);
			arr.push((tmp >> 8) & 0xFF);
			arr.push(tmp & 0xFF);
		}

		return arr;
	}

	function uint8ToBase64(uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length;

		function tripletToBase64 (num) {
			return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
		};

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
			output += tripletToBase64(temp);
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1];
				output += lookup[temp >> 2];
				output += lookup[(temp << 4) & 0x3F];
				output += '==';
				break;
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1]);
				output += lookup[temp >> 10];
				output += lookup[(temp >> 4) & 0x3F];
				output += lookup[(temp << 2) & 0x3F];
				output += '=';
				break;
		}

		return output;
	}

	module.exports.toByteArray = b64ToByteArray;
	module.exports.fromByteArray = uint8ToBase64;
}());

},{}],4:[function(require,module,exports){
var undefined = (void 0); // Paranoia

// Beyond this value, index getters/setters (i.e. array[0], array[1]) are so slow to
// create, and consume so much memory, that the browser appears frozen.
var MAX_ARRAY_LENGTH = 1e5;

// Approximations of internal ECMAScript conversion functions
var ECMAScript = (function() {
  // Stash a copy in case other scripts modify these
  var opts = Object.prototype.toString,
      ophop = Object.prototype.hasOwnProperty;

  return {
    // Class returns internal [[Class]] property, used to avoid cross-frame instanceof issues:
    Class: function(v) { return opts.call(v).replace(/^\[object *|\]$/g, ''); },
    HasProperty: function(o, p) { return p in o; },
    HasOwnProperty: function(o, p) { return ophop.call(o, p); },
    IsCallable: function(o) { return typeof o === 'function'; },
    ToInt32: function(v) { return v >> 0; },
    ToUint32: function(v) { return v >>> 0; }
  };
}());

// Snapshot intrinsics
var LN2 = Math.LN2,
    abs = Math.abs,
    floor = Math.floor,
    log = Math.log,
    min = Math.min,
    pow = Math.pow,
    round = Math.round;

// ES5: lock down object properties
function configureProperties(obj) {
  if (getOwnPropertyNames && defineProperty) {
    var props = getOwnPropertyNames(obj), i;
    for (i = 0; i < props.length; i += 1) {
      defineProperty(obj, props[i], {
        value: obj[props[i]],
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  }
}

// emulate ES5 getter/setter API using legacy APIs
// http://blogs.msdn.com/b/ie/archive/2010/09/07/transitioning-existing-code-to-the-es5-getter-setter-apis.aspx
// (second clause tests for Object.defineProperty() in IE<9 that only supports extending DOM prototypes, but
// note that IE<9 does not support __defineGetter__ or __defineSetter__ so it just renders the method harmless)
var defineProperty = Object.defineProperty || function(o, p, desc) {
  if (!o === Object(o)) throw new TypeError("Object.defineProperty called on non-object");
  if (ECMAScript.HasProperty(desc, 'get') && Object.prototype.__defineGetter__) { Object.prototype.__defineGetter__.call(o, p, desc.get); }
  if (ECMAScript.HasProperty(desc, 'set') && Object.prototype.__defineSetter__) { Object.prototype.__defineSetter__.call(o, p, desc.set); }
  if (ECMAScript.HasProperty(desc, 'value')) { o[p] = desc.value; }
  return o;
};

var getOwnPropertyNames = Object.getOwnPropertyNames || function getOwnPropertyNames(o) {
  if (o !== Object(o)) throw new TypeError("Object.getOwnPropertyNames called on non-object");
  var props = [], p;
  for (p in o) {
    if (ECMAScript.HasOwnProperty(o, p)) {
      props.push(p);
    }
  }
  return props;
};

// ES5: Make obj[index] an alias for obj._getter(index)/obj._setter(index, value)
// for index in 0 ... obj.length
function makeArrayAccessors(obj) {
  if (!defineProperty) { return; }

  if (obj.length > MAX_ARRAY_LENGTH) throw new RangeError("Array too large for polyfill");

  function makeArrayAccessor(index) {
    defineProperty(obj, index, {
      'get': function() { return obj._getter(index); },
      'set': function(v) { obj._setter(index, v); },
      enumerable: true,
      configurable: false
    });
  }

  var i;
  for (i = 0; i < obj.length; i += 1) {
    makeArrayAccessor(i);
  }
}

// Internal conversion functions:
//    pack<Type>()   - take a number (interpreted as Type), output a byte array
//    unpack<Type>() - take a byte array, output a Type-like number

function as_signed(value, bits) { var s = 32 - bits; return (value << s) >> s; }
function as_unsigned(value, bits) { var s = 32 - bits; return (value << s) >>> s; }

function packI8(n) { return [n & 0xff]; }
function unpackI8(bytes) { return as_signed(bytes[0], 8); }

function packU8(n) { return [n & 0xff]; }
function unpackU8(bytes) { return as_unsigned(bytes[0], 8); }

function packU8Clamped(n) { n = round(Number(n)); return [n < 0 ? 0 : n > 0xff ? 0xff : n & 0xff]; }

function packI16(n) { return [(n >> 8) & 0xff, n & 0xff]; }
function unpackI16(bytes) { return as_signed(bytes[0] << 8 | bytes[1], 16); }

function packU16(n) { return [(n >> 8) & 0xff, n & 0xff]; }
function unpackU16(bytes) { return as_unsigned(bytes[0] << 8 | bytes[1], 16); }

function packI32(n) { return [(n >> 24) & 0xff, (n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff]; }
function unpackI32(bytes) { return as_signed(bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3], 32); }

function packU32(n) { return [(n >> 24) & 0xff, (n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff]; }
function unpackU32(bytes) { return as_unsigned(bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3], 32); }

function packIEEE754(v, ebits, fbits) {

  var bias = (1 << (ebits - 1)) - 1,
      s, e, f, ln,
      i, bits, str, bytes;

  function roundToEven(n) {
    var w = floor(n), f = n - w;
    if (f < 0.5)
      return w;
    if (f > 0.5)
      return w + 1;
    return w % 2 ? w + 1 : w;
  }

  // Compute sign, exponent, fraction
  if (v !== v) {
    // NaN
    // http://dev.w3.org/2006/webapi/WebIDL/#es-type-mapping
    e = (1 << ebits) - 1; f = pow(2, fbits - 1); s = 0;
  } else if (v === Infinity || v === -Infinity) {
    e = (1 << ebits) - 1; f = 0; s = (v < 0) ? 1 : 0;
  } else if (v === 0) {
    e = 0; f = 0; s = (1 / v === -Infinity) ? 1 : 0;
  } else {
    s = v < 0;
    v = abs(v);

    if (v >= pow(2, 1 - bias)) {
      e = min(floor(log(v) / LN2), 1023);
      f = roundToEven(v / pow(2, e) * pow(2, fbits));
      if (f / pow(2, fbits) >= 2) {
        e = e + 1;
        f = 1;
      }
      if (e > bias) {
        // Overflow
        e = (1 << ebits) - 1;
        f = 0;
      } else {
        // Normalized
        e = e + bias;
        f = f - pow(2, fbits);
      }
    } else {
      // Denormalized
      e = 0;
      f = roundToEven(v / pow(2, 1 - bias - fbits));
    }
  }

  // Pack sign, exponent, fraction
  bits = [];
  for (i = fbits; i; i -= 1) { bits.push(f % 2 ? 1 : 0); f = floor(f / 2); }
  for (i = ebits; i; i -= 1) { bits.push(e % 2 ? 1 : 0); e = floor(e / 2); }
  bits.push(s ? 1 : 0);
  bits.reverse();
  str = bits.join('');

  // Bits to bytes
  bytes = [];
  while (str.length) {
    bytes.push(parseInt(str.substring(0, 8), 2));
    str = str.substring(8);
  }
  return bytes;
}

function unpackIEEE754(bytes, ebits, fbits) {

  // Bytes to bits
  var bits = [], i, j, b, str,
      bias, s, e, f;

  for (i = bytes.length; i; i -= 1) {
    b = bytes[i - 1];
    for (j = 8; j; j -= 1) {
      bits.push(b % 2 ? 1 : 0); b = b >> 1;
    }
  }
  bits.reverse();
  str = bits.join('');

  // Unpack sign, exponent, fraction
  bias = (1 << (ebits - 1)) - 1;
  s = parseInt(str.substring(0, 1), 2) ? -1 : 1;
  e = parseInt(str.substring(1, 1 + ebits), 2);
  f = parseInt(str.substring(1 + ebits), 2);

  // Produce number
  if (e === (1 << ebits) - 1) {
    return f !== 0 ? NaN : s * Infinity;
  } else if (e > 0) {
    // Normalized
    return s * pow(2, e - bias) * (1 + f / pow(2, fbits));
  } else if (f !== 0) {
    // Denormalized
    return s * pow(2, -(bias - 1)) * (f / pow(2, fbits));
  } else {
    return s < 0 ? -0 : 0;
  }
}

function unpackF64(b) { return unpackIEEE754(b, 11, 52); }
function packF64(v) { return packIEEE754(v, 11, 52); }
function unpackF32(b) { return unpackIEEE754(b, 8, 23); }
function packF32(v) { return packIEEE754(v, 8, 23); }


//
// 3 The ArrayBuffer Type
//

(function() {

  /** @constructor */
  var ArrayBuffer = function ArrayBuffer(length) {
    length = ECMAScript.ToInt32(length);
    if (length < 0) throw new RangeError('ArrayBuffer size is not a small enough positive integer');

    this.byteLength = length;
    this._bytes = [];
    this._bytes.length = length;

    var i;
    for (i = 0; i < this.byteLength; i += 1) {
      this._bytes[i] = 0;
    }

    configureProperties(this);
  };

  exports.ArrayBuffer = exports.ArrayBuffer || ArrayBuffer;

  //
  // 4 The ArrayBufferView Type
  //

  // NOTE: this constructor is not exported
  /** @constructor */
  var ArrayBufferView = function ArrayBufferView() {
    //this.buffer = null;
    //this.byteOffset = 0;
    //this.byteLength = 0;
  };

  //
  // 5 The Typed Array View Types
  //

  function makeConstructor(bytesPerElement, pack, unpack) {
    // Each TypedArray type requires a distinct constructor instance with
    // identical logic, which this produces.

    var ctor;
    ctor = function(buffer, byteOffset, length) {
      var array, sequence, i, s;

      if (!arguments.length || typeof arguments[0] === 'number') {
        // Constructor(unsigned long length)
        this.length = ECMAScript.ToInt32(arguments[0]);
        if (length < 0) throw new RangeError('ArrayBufferView size is not a small enough positive integer');

        this.byteLength = this.length * this.BYTES_PER_ELEMENT;
        this.buffer = new ArrayBuffer(this.byteLength);
        this.byteOffset = 0;
      } else if (typeof arguments[0] === 'object' && arguments[0].constructor === ctor) {
        // Constructor(TypedArray array)
        array = arguments[0];

        this.length = array.length;
        this.byteLength = this.length * this.BYTES_PER_ELEMENT;
        this.buffer = new ArrayBuffer(this.byteLength);
        this.byteOffset = 0;

        for (i = 0; i < this.length; i += 1) {
          this._setter(i, array._getter(i));
        }
      } else if (typeof arguments[0] === 'object' &&
                 !(arguments[0] instanceof ArrayBuffer || ECMAScript.Class(arguments[0]) === 'ArrayBuffer')) {
        // Constructor(sequence<type> array)
        sequence = arguments[0];

        this.length = ECMAScript.ToUint32(sequence.length);
        this.byteLength = this.length * this.BYTES_PER_ELEMENT;
        this.buffer = new ArrayBuffer(this.byteLength);
        this.byteOffset = 0;

        for (i = 0; i < this.length; i += 1) {
          s = sequence[i];
          this._setter(i, Number(s));
        }
      } else if (typeof arguments[0] === 'object' &&
                 (arguments[0] instanceof ArrayBuffer || ECMAScript.Class(arguments[0]) === 'ArrayBuffer')) {
        // Constructor(ArrayBuffer buffer,
        //             optional unsigned long byteOffset, optional unsigned long length)
        this.buffer = buffer;

        this.byteOffset = ECMAScript.ToUint32(byteOffset);
        if (this.byteOffset > this.buffer.byteLength) {
          throw new RangeError("byteOffset out of range");
        }

        if (this.byteOffset % this.BYTES_PER_ELEMENT) {
          // The given byteOffset must be a multiple of the element
          // size of the specific type, otherwise an exception is raised.
          throw new RangeError("ArrayBuffer length minus the byteOffset is not a multiple of the element size.");
        }

        if (arguments.length < 3) {
          this.byteLength = this.buffer.byteLength - this.byteOffset;

          if (this.byteLength % this.BYTES_PER_ELEMENT) {
            throw new RangeError("length of buffer minus byteOffset not a multiple of the element size");
          }
          this.length = this.byteLength / this.BYTES_PER_ELEMENT;
        } else {
          this.length = ECMAScript.ToUint32(length);
          this.byteLength = this.length * this.BYTES_PER_ELEMENT;
        }

        if ((this.byteOffset + this.byteLength) > this.buffer.byteLength) {
          throw new RangeError("byteOffset and length reference an area beyond the end of the buffer");
        }
      } else {
        throw new TypeError("Unexpected argument type(s)");
      }

      this.constructor = ctor;

      configureProperties(this);
      makeArrayAccessors(this);
    };

    ctor.prototype = new ArrayBufferView();
    ctor.prototype.BYTES_PER_ELEMENT = bytesPerElement;
    ctor.prototype._pack = pack;
    ctor.prototype._unpack = unpack;
    ctor.BYTES_PER_ELEMENT = bytesPerElement;

    // getter type (unsigned long index);
    ctor.prototype._getter = function(index) {
      if (arguments.length < 1) throw new SyntaxError("Not enough arguments");

      index = ECMAScript.ToUint32(index);
      if (index >= this.length) {
        return undefined;
      }

      var bytes = [], i, o;
      for (i = 0, o = this.byteOffset + index * this.BYTES_PER_ELEMENT;
           i < this.BYTES_PER_ELEMENT;
           i += 1, o += 1) {
        bytes.push(this.buffer._bytes[o]);
      }
      return this._unpack(bytes);
    };

    // NONSTANDARD: convenience alias for getter: type get(unsigned long index);
    ctor.prototype.get = ctor.prototype._getter;

    // setter void (unsigned long index, type value);
    ctor.prototype._setter = function(index, value) {
      if (arguments.length < 2) throw new SyntaxError("Not enough arguments");

      index = ECMAScript.ToUint32(index);
      if (index >= this.length) {
        return undefined;
      }

      var bytes = this._pack(value), i, o;
      for (i = 0, o = this.byteOffset + index * this.BYTES_PER_ELEMENT;
           i < this.BYTES_PER_ELEMENT;
           i += 1, o += 1) {
        this.buffer._bytes[o] = bytes[i];
      }
    };

    // void set(TypedArray array, optional unsigned long offset);
    // void set(sequence<type> array, optional unsigned long offset);
    ctor.prototype.set = function(index, value) {
      if (arguments.length < 1) throw new SyntaxError("Not enough arguments");
      var array, sequence, offset, len,
          i, s, d,
          byteOffset, byteLength, tmp;

      if (typeof arguments[0] === 'object' && arguments[0].constructor === this.constructor) {
        // void set(TypedArray array, optional unsigned long offset);
        array = arguments[0];
        offset = ECMAScript.ToUint32(arguments[1]);

        if (offset + array.length > this.length) {
          throw new RangeError("Offset plus length of array is out of range");
        }

        byteOffset = this.byteOffset + offset * this.BYTES_PER_ELEMENT;
        byteLength = array.length * this.BYTES_PER_ELEMENT;

        if (array.buffer === this.buffer) {
          tmp = [];
          for (i = 0, s = array.byteOffset; i < byteLength; i += 1, s += 1) {
            tmp[i] = array.buffer._bytes[s];
          }
          for (i = 0, d = byteOffset; i < byteLength; i += 1, d += 1) {
            this.buffer._bytes[d] = tmp[i];
          }
        } else {
          for (i = 0, s = array.byteOffset, d = byteOffset;
               i < byteLength; i += 1, s += 1, d += 1) {
            this.buffer._bytes[d] = array.buffer._bytes[s];
          }
        }
      } else if (typeof arguments[0] === 'object' && typeof arguments[0].length !== 'undefined') {
        // void set(sequence<type> array, optional unsigned long offset);
        sequence = arguments[0];
        len = ECMAScript.ToUint32(sequence.length);
        offset = ECMAScript.ToUint32(arguments[1]);

        if (offset + len > this.length) {
          throw new RangeError("Offset plus length of array is out of range");
        }

        for (i = 0; i < len; i += 1) {
          s = sequence[i];
          this._setter(offset + i, Number(s));
        }
      } else {
        throw new TypeError("Unexpected argument type(s)");
      }
    };

    // TypedArray subarray(long begin, optional long end);
    ctor.prototype.subarray = function(start, end) {
      function clamp(v, min, max) { return v < min ? min : v > max ? max : v; }

      start = ECMAScript.ToInt32(start);
      end = ECMAScript.ToInt32(end);

      if (arguments.length < 1) { start = 0; }
      if (arguments.length < 2) { end = this.length; }

      if (start < 0) { start = this.length + start; }
      if (end < 0) { end = this.length + end; }

      start = clamp(start, 0, this.length);
      end = clamp(end, 0, this.length);

      var len = end - start;
      if (len < 0) {
        len = 0;
      }

      return new this.constructor(
        this.buffer, this.byteOffset + start * this.BYTES_PER_ELEMENT, len);
    };

    return ctor;
  }

  var Int8Array = makeConstructor(1, packI8, unpackI8);
  var Uint8Array = makeConstructor(1, packU8, unpackU8);
  var Uint8ClampedArray = makeConstructor(1, packU8Clamped, unpackU8);
  var Int16Array = makeConstructor(2, packI16, unpackI16);
  var Uint16Array = makeConstructor(2, packU16, unpackU16);
  var Int32Array = makeConstructor(4, packI32, unpackI32);
  var Uint32Array = makeConstructor(4, packU32, unpackU32);
  var Float32Array = makeConstructor(4, packF32, unpackF32);
  var Float64Array = makeConstructor(8, packF64, unpackF64);

  exports.Int8Array = exports.Int8Array || Int8Array;
  exports.Uint8Array = exports.Uint8Array || Uint8Array;
  exports.Uint8ClampedArray = exports.Uint8ClampedArray || Uint8ClampedArray;
  exports.Int16Array = exports.Int16Array || Int16Array;
  exports.Uint16Array = exports.Uint16Array || Uint16Array;
  exports.Int32Array = exports.Int32Array || Int32Array;
  exports.Uint32Array = exports.Uint32Array || Uint32Array;
  exports.Float32Array = exports.Float32Array || Float32Array;
  exports.Float64Array = exports.Float64Array || Float64Array;
}());

//
// 6 The DataView View Type
//

(function() {
  function r(array, index) {
    return ECMAScript.IsCallable(array.get) ? array.get(index) : array[index];
  }

  var IS_BIG_ENDIAN = (function() {
    var u16array = new(exports.Uint16Array)([0x1234]),
        u8array = new(exports.Uint8Array)(u16array.buffer);
    return r(u8array, 0) === 0x12;
  }());

  // Constructor(ArrayBuffer buffer,
  //             optional unsigned long byteOffset,
  //             optional unsigned long byteLength)
  /** @constructor */
  var DataView = function DataView(buffer, byteOffset, byteLength) {
    if (arguments.length === 0) {
      buffer = new ArrayBuffer(0);
    } else if (!(buffer instanceof ArrayBuffer || ECMAScript.Class(buffer) === 'ArrayBuffer')) {
      throw new TypeError("TypeError");
    }

    this.buffer = buffer || new ArrayBuffer(0);

    this.byteOffset = ECMAScript.ToUint32(byteOffset);
    if (this.byteOffset > this.buffer.byteLength) {
      throw new RangeError("byteOffset out of range");
    }

    if (arguments.length < 3) {
      this.byteLength = this.buffer.byteLength - this.byteOffset;
    } else {
      this.byteLength = ECMAScript.ToUint32(byteLength);
    }

    if ((this.byteOffset + this.byteLength) > this.buffer.byteLength) {
      throw new RangeError("byteOffset and length reference an area beyond the end of the buffer");
    }

    configureProperties(this);
  };

  function makeGetter(arrayType) {
    return function(byteOffset, littleEndian) {

      byteOffset = ECMAScript.ToUint32(byteOffset);

      if (byteOffset + arrayType.BYTES_PER_ELEMENT > this.byteLength) {
        throw new RangeError("Array index out of range");
      }
      byteOffset += this.byteOffset;

      var uint8Array = new Uint8Array(this.buffer, byteOffset, arrayType.BYTES_PER_ELEMENT),
          bytes = [], i;
      for (i = 0; i < arrayType.BYTES_PER_ELEMENT; i += 1) {
        bytes.push(r(uint8Array, i));
      }

      if (Boolean(littleEndian) === Boolean(IS_BIG_ENDIAN)) {
        bytes.reverse();
      }

      return r(new arrayType(new Uint8Array(bytes).buffer), 0);
    };
  }

  DataView.prototype.getUint8 = makeGetter(exports.Uint8Array);
  DataView.prototype.getInt8 = makeGetter(exports.Int8Array);
  DataView.prototype.getUint16 = makeGetter(exports.Uint16Array);
  DataView.prototype.getInt16 = makeGetter(exports.Int16Array);
  DataView.prototype.getUint32 = makeGetter(exports.Uint32Array);
  DataView.prototype.getInt32 = makeGetter(exports.Int32Array);
  DataView.prototype.getFloat32 = makeGetter(exports.Float32Array);
  DataView.prototype.getFloat64 = makeGetter(exports.Float64Array);

  function makeSetter(arrayType) {
    return function(byteOffset, value, littleEndian) {

      byteOffset = ECMAScript.ToUint32(byteOffset);
      if (byteOffset + arrayType.BYTES_PER_ELEMENT > this.byteLength) {
        throw new RangeError("Array index out of range");
      }

      // Get bytes
      var typeArray = new arrayType([value]),
          byteArray = new Uint8Array(typeArray.buffer),
          bytes = [], i, byteView;

      for (i = 0; i < arrayType.BYTES_PER_ELEMENT; i += 1) {
        bytes.push(r(byteArray, i));
      }

      // Flip if necessary
      if (Boolean(littleEndian) === Boolean(IS_BIG_ENDIAN)) {
        bytes.reverse();
      }

      // Write them
      byteView = new Uint8Array(this.buffer, byteOffset, arrayType.BYTES_PER_ELEMENT);
      byteView.set(bytes);
    };
  }

  DataView.prototype.setUint8 = makeSetter(exports.Uint8Array);
  DataView.prototype.setInt8 = makeSetter(exports.Int8Array);
  DataView.prototype.setUint16 = makeSetter(exports.Uint16Array);
  DataView.prototype.setInt16 = makeSetter(exports.Int16Array);
  DataView.prototype.setUint32 = makeSetter(exports.Uint32Array);
  DataView.prototype.setInt32 = makeSetter(exports.Int32Array);
  DataView.prototype.setFloat32 = makeSetter(exports.Float32Array);
  DataView.prototype.setFloat64 = makeSetter(exports.Float64Array);

  exports.DataView = exports.DataView || DataView;

}());

},{}]},{},[])
;;module.exports=require("native-buffer-browserify").Buffer

},{}],4:[function(require,module,exports){
/*jshint node:true */
/**
 * @fileOverview
 * copy Declaration File
 *
 * @author Shannon Moeller
 * @version 1.0
 */

'use strict';

/**
 * Copies the enumerable properties of one or more objects to a target object.
 *
 * @param {Object} target Target object.
 * @param {...Object} objs Objects with properties to copy.
 * @return {Object} Target object, augmented.
 */
module.exports = function copy(target) {
    var arg, i, key, len;
    var args = arguments;

    for (i = 1, len = args.length; i < len; i += 1) {
        arg = args[i];

        for (key in arg) {
            if (arg.hasOwnProperty(key)) {
                target[key] = arg[key];
            }
        }
    }

    return target;
};

},{}],5:[function(require,module,exports){
var Buffer=require("__browserify_Buffer");
(function (global, module) {

  if ('undefined' == typeof module) {
    var module = { exports: {} }
      , exports = module.exports
  }

  /**
   * Exports.
   */

  module.exports = expect;
  expect.Assertion = Assertion;

  /**
   * Exports version.
   */

  expect.version = '0.1.2';

  /**
   * Possible assertion flags.
   */

  var flags = {
      not: ['to', 'be', 'have', 'include', 'only']
    , to: ['be', 'have', 'include', 'only', 'not']
    , only: ['have']
    , have: ['own']
    , be: ['an']
  };

  function expect (obj) {
    return new Assertion(obj);
  }

  /**
   * Constructor
   *
   * @api private
   */

  function Assertion (obj, flag, parent) {
    this.obj = obj;
    this.flags = {};

    if (undefined != parent) {
      this.flags[flag] = true;

      for (var i in parent.flags) {
        if (parent.flags.hasOwnProperty(i)) {
          this.flags[i] = true;
        }
      }
    }

    var $flags = flag ? flags[flag] : keys(flags)
      , self = this

    if ($flags) {
      for (var i = 0, l = $flags.length; i < l; i++) {
        // avoid recursion
        if (this.flags[$flags[i]]) continue;

        var name = $flags[i]
          , assertion = new Assertion(this.obj, name, this)

        if ('function' == typeof Assertion.prototype[name]) {
          // clone the function, make sure we dont touch the prot reference
          var old = this[name];
          this[name] = function () {
            return old.apply(self, arguments);
          }

          for (var fn in Assertion.prototype) {
            if (Assertion.prototype.hasOwnProperty(fn) && fn != name) {
              this[name][fn] = bind(assertion[fn], assertion);
            }
          }
        } else {
          this[name] = assertion;
        }
      }
    }
  };

  /**
   * Performs an assertion
   *
   * @api private
   */

  Assertion.prototype.assert = function (truth, msg, error) {
    var msg = this.flags.not ? error : msg
      , ok = this.flags.not ? !truth : truth;

    if (!ok) {
      throw new Error(msg.call(this));
    }

    this.and = new Assertion(this.obj);
  };

  /**
   * Check if the value is truthy
   *
   * @api public
   */

  Assertion.prototype.ok = function () {
    this.assert(
        !!this.obj
      , function(){ return 'expected ' + i(this.obj) + ' to be truthy' }
      , function(){ return 'expected ' + i(this.obj) + ' to be falsy' });
  };

  /**
   * Assert that the function throws.
   *
   * @param {Function|RegExp} callback, or regexp to match error string against
   * @api public
   */

  Assertion.prototype.throwError =
  Assertion.prototype.throwException = function (fn) {
    expect(this.obj).to.be.a('function');

    var thrown = false
      , not = this.flags.not

    try {
      this.obj();
    } catch (e) {
      if ('function' == typeof fn) {
        fn(e);
      } else if ('object' == typeof fn) {
        var subject = 'string' == typeof e ? e : e.message;
        if (not) {
          expect(subject).to.not.match(fn);
        } else {
          expect(subject).to.match(fn);
        }
      }
      thrown = true;
    }

    if ('object' == typeof fn && not) {
      // in the presence of a matcher, ensure the `not` only applies to
      // the matching.
      this.flags.not = false;
    }

    var name = this.obj.name || 'fn';
    this.assert(
        thrown
      , function(){ return 'expected ' + name + ' to throw an exception' }
      , function(){ return 'expected ' + name + ' not to throw an exception' });
  };

  /**
   * Checks if the array is empty.
   *
   * @api public
   */

  Assertion.prototype.empty = function () {
    var expectation;

    if ('object' == typeof this.obj && null !== this.obj && !isArray(this.obj)) {
      if ('number' == typeof this.obj.length) {
        expectation = !this.obj.length;
      } else {
        expectation = !keys(this.obj).length;
      }
    } else {
      if ('string' != typeof this.obj) {
        expect(this.obj).to.be.an('object');
      }

      expect(this.obj).to.have.property('length');
      expectation = !this.obj.length;
    }

    this.assert(
        expectation
      , function(){ return 'expected ' + i(this.obj) + ' to be empty' }
      , function(){ return 'expected ' + i(this.obj) + ' to not be empty' });
    return this;
  };

  /**
   * Checks if the obj exactly equals another.
   *
   * @api public
   */

  Assertion.prototype.be =
  Assertion.prototype.equal = function (obj) {
    this.assert(
        obj === this.obj
      , function(){ return 'expected ' + i(this.obj) + ' to equal ' + i(obj) }
      , function(){ return 'expected ' + i(this.obj) + ' to not equal ' + i(obj) });
    return this;
  };

  /**
   * Checks if the obj sortof equals another.
   *
   * @api public
   */

  Assertion.prototype.eql = function (obj) {
    this.assert(
        expect.eql(obj, this.obj)
      , function(){ return 'expected ' + i(this.obj) + ' to sort of equal ' + i(obj) }
      , function(){ return 'expected ' + i(this.obj) + ' to sort of not equal ' + i(obj) });
    return this;
  };

  /**
   * Assert within start to finish (inclusive).
   *
   * @param {Number} start
   * @param {Number} finish
   * @api public
   */

  Assertion.prototype.within = function (start, finish) {
    var range = start + '..' + finish;
    this.assert(
        this.obj >= start && this.obj <= finish
      , function(){ return 'expected ' + i(this.obj) + ' to be within ' + range }
      , function(){ return 'expected ' + i(this.obj) + ' to not be within ' + range });
    return this;
  };

  /**
   * Assert typeof / instance of
   *
   * @api public
   */

  Assertion.prototype.a =
  Assertion.prototype.an = function (type) {
    if ('string' == typeof type) {
      // proper english in error msg
      var n = /^[aeiou]/.test(type) ? 'n' : '';

      // typeof with support for 'array'
      this.assert(
          'array' == type ? isArray(this.obj) :
            'object' == type
              ? 'object' == typeof this.obj && null !== this.obj
              : type == typeof this.obj
        , function(){ return 'expected ' + i(this.obj) + ' to be a' + n + ' ' + type }
        , function(){ return 'expected ' + i(this.obj) + ' not to be a' + n + ' ' + type });
    } else {
      // instanceof
      var name = type.name || 'supplied constructor';
      this.assert(
          this.obj instanceof type
        , function(){ return 'expected ' + i(this.obj) + ' to be an instance of ' + name }
        , function(){ return 'expected ' + i(this.obj) + ' not to be an instance of ' + name });
    }

    return this;
  };

  /**
   * Assert numeric value above _n_.
   *
   * @param {Number} n
   * @api public
   */

  Assertion.prototype.greaterThan =
  Assertion.prototype.above = function (n) {
    this.assert(
        this.obj > n
      , function(){ return 'expected ' + i(this.obj) + ' to be above ' + n }
      , function(){ return 'expected ' + i(this.obj) + ' to be below ' + n });
    return this;
  };

  /**
   * Assert numeric value below _n_.
   *
   * @param {Number} n
   * @api public
   */

  Assertion.prototype.lessThan =
  Assertion.prototype.below = function (n) {
    this.assert(
        this.obj < n
      , function(){ return 'expected ' + i(this.obj) + ' to be below ' + n }
      , function(){ return 'expected ' + i(this.obj) + ' to be above ' + n });
    return this;
  };

  /**
   * Assert string value matches _regexp_.
   *
   * @param {RegExp} regexp
   * @api public
   */

  Assertion.prototype.match = function (regexp) {
    this.assert(
        regexp.exec(this.obj)
      , function(){ return 'expected ' + i(this.obj) + ' to match ' + regexp }
      , function(){ return 'expected ' + i(this.obj) + ' not to match ' + regexp });
    return this;
  };

  /**
   * Assert property "length" exists and has value of _n_.
   *
   * @param {Number} n
   * @api public
   */

  Assertion.prototype.length = function (n) {
    expect(this.obj).to.have.property('length');
    var len = this.obj.length;
    this.assert(
        n == len
      , function(){ return 'expected ' + i(this.obj) + ' to have a length of ' + n + ' but got ' + len }
      , function(){ return 'expected ' + i(this.obj) + ' to not have a length of ' + len });
    return this;
  };

  /**
   * Assert property _name_ exists, with optional _val_.
   *
   * @param {String} name
   * @param {Mixed} val
   * @api public
   */

  Assertion.prototype.property = function (name, val) {
    if (this.flags.own) {
      this.assert(
          Object.prototype.hasOwnProperty.call(this.obj, name)
        , function(){ return 'expected ' + i(this.obj) + ' to have own property ' + i(name) }
        , function(){ return 'expected ' + i(this.obj) + ' to not have own property ' + i(name) });
      return this;
    }

    if (this.flags.not && undefined !== val) {
      if (undefined === this.obj[name]) {
        throw new Error(i(this.obj) + ' has no property ' + i(name));
      }
    } else {
      var hasProp;
      try {
        hasProp = name in this.obj
      } catch (e) {
        hasProp = undefined !== this.obj[name]
      }

      this.assert(
          hasProp
        , function(){ return 'expected ' + i(this.obj) + ' to have a property ' + i(name) }
        , function(){ return 'expected ' + i(this.obj) + ' to not have a property ' + i(name) });
    }

    if (undefined !== val) {
      this.assert(
          val === this.obj[name]
        , function(){ return 'expected ' + i(this.obj) + ' to have a property ' + i(name)
          + ' of ' + i(val) + ', but got ' + i(this.obj[name]) }
        , function(){ return 'expected ' + i(this.obj) + ' to not have a property ' + i(name)
          + ' of ' + i(val) });
    }

    this.obj = this.obj[name];
    return this;
  };

  /**
   * Assert that the array contains _obj_ or string contains _obj_.
   *
   * @param {Mixed} obj|string
   * @api public
   */

  Assertion.prototype.string =
  Assertion.prototype.contain = function (obj) {
    if ('string' == typeof this.obj) {
      this.assert(
          ~this.obj.indexOf(obj)
        , function(){ return 'expected ' + i(this.obj) + ' to contain ' + i(obj) }
        , function(){ return 'expected ' + i(this.obj) + ' to not contain ' + i(obj) });
    } else {
      this.assert(
          ~indexOf(this.obj, obj)
        , function(){ return 'expected ' + i(this.obj) + ' to contain ' + i(obj) }
        , function(){ return 'expected ' + i(this.obj) + ' to not contain ' + i(obj) });
    }
    return this;
  };

  /**
   * Assert exact keys or inclusion of keys by using
   * the `.own` modifier.
   *
   * @param {Array|String ...} keys
   * @api public
   */

  Assertion.prototype.key =
  Assertion.prototype.keys = function ($keys) {
    var str
      , ok = true;

    $keys = isArray($keys)
      ? $keys
      : Array.prototype.slice.call(arguments);

    if (!$keys.length) throw new Error('keys required');

    var actual = keys(this.obj)
      , len = $keys.length;

    // Inclusion
    ok = every($keys, function (key) {
      return ~indexOf(actual, key);
    });

    // Strict
    if (!this.flags.not && this.flags.only) {
      ok = ok && $keys.length == actual.length;
    }

    // Key string
    if (len > 1) {
      $keys = map($keys, function (key) {
        return i(key);
      });
      var last = $keys.pop();
      str = $keys.join(', ') + ', and ' + last;
    } else {
      str = i($keys[0]);
    }

    // Form
    str = (len > 1 ? 'keys ' : 'key ') + str;

    // Have / include
    str = (!this.flags.only ? 'include ' : 'only have ') + str;

    // Assertion
    this.assert(
        ok
      , function(){ return 'expected ' + i(this.obj) + ' to ' + str }
      , function(){ return 'expected ' + i(this.obj) + ' to not ' + str });

    return this;
  };
  /**
   * Assert a failure.
   *
   * @param {String ...} custom message
   * @api public
   */
  Assertion.prototype.fail = function (msg) {
    msg = msg || "explicit failure";
    this.assert(false, msg, msg);
    return this;
  };

  /**
   * Function bind implementation.
   */

  function bind (fn, scope) {
    return function () {
      return fn.apply(scope, arguments);
    }
  }

  /**
   * Array every compatibility
   *
   * @see bit.ly/5Fq1N2
   * @api public
   */

  function every (arr, fn, thisObj) {
    var scope = thisObj || global;
    for (var i = 0, j = arr.length; i < j; ++i) {
      if (!fn.call(scope, arr[i], i, arr)) {
        return false;
      }
    }
    return true;
  };

  /**
   * Array indexOf compatibility.
   *
   * @see bit.ly/a5Dxa2
   * @api public
   */

  function indexOf (arr, o, i) {
    if (Array.prototype.indexOf) {
      return Array.prototype.indexOf.call(arr, o, i);
    }

    if (arr.length === undefined) {
      return -1;
    }

    for (var j = arr.length, i = i < 0 ? i + j < 0 ? 0 : i + j : i || 0
        ; i < j && arr[i] !== o; i++);

    return j <= i ? -1 : i;
  };

  // https://gist.github.com/1044128/
  var getOuterHTML = function(element) {
    if ('outerHTML' in element) return element.outerHTML;
    var ns = "http://www.w3.org/1999/xhtml";
    var container = document.createElementNS(ns, '_');
    var elemProto = (window.HTMLElement || window.Element).prototype;
    var xmlSerializer = new XMLSerializer();
    var html;
    if (document.xmlVersion) {
      return xmlSerializer.serializeToString(element);
    } else {
      container.appendChild(element.cloneNode(false));
      html = container.innerHTML.replace('><', '>' + element.innerHTML + '<');
      container.innerHTML = '';
      return html;
    }
  };

  // Returns true if object is a DOM element.
  var isDOMElement = function (object) {
    if (typeof HTMLElement === 'object') {
      return object instanceof HTMLElement;
    } else {
      return object &&
        typeof object === 'object' &&
        object.nodeType === 1 &&
        typeof object.nodeName === 'string';
    }
  };

  /**
   * Inspects an object.
   *
   * @see taken from node.js `util` module (copyright Joyent, MIT license)
   * @api private
   */

  function i (obj, showHidden, depth) {
    var seen = [];

    function stylize (str) {
      return str;
    };

    function format (value, recurseTimes) {
      // Provide a hook for user-specified inspect functions.
      // Check that value is an object with an inspect function on it
      if (value && typeof value.inspect === 'function' &&
          // Filter out the util module, it's inspect function is special
          value !== exports &&
          // Also filter out any prototype objects using the circular check.
          !(value.constructor && value.constructor.prototype === value)) {
        return value.inspect(recurseTimes);
      }

      // Primitive types cannot have properties
      switch (typeof value) {
        case 'undefined':
          return stylize('undefined', 'undefined');

        case 'string':
          var simple = '\'' + json.stringify(value).replace(/^"|"$/g, '')
                                                   .replace(/'/g, "\\'")
                                                   .replace(/\\"/g, '"') + '\'';
          return stylize(simple, 'string');

        case 'number':
          return stylize('' + value, 'number');

        case 'boolean':
          return stylize('' + value, 'boolean');
      }
      // For some reason typeof null is "object", so special case here.
      if (value === null) {
        return stylize('null', 'null');
      }

      if (isDOMElement(value)) {
        return getOuterHTML(value);
      }

      // Look up the keys of the object.
      var visible_keys = keys(value);
      var $keys = showHidden ? Object.getOwnPropertyNames(value) : visible_keys;

      // Functions without properties can be shortcutted.
      if (typeof value === 'function' && $keys.length === 0) {
        if (isRegExp(value)) {
          return stylize('' + value, 'regexp');
        } else {
          var name = value.name ? ': ' + value.name : '';
          return stylize('[Function' + name + ']', 'special');
        }
      }

      // Dates without properties can be shortcutted
      if (isDate(value) && $keys.length === 0) {
        return stylize(value.toUTCString(), 'date');
      }

      var base, type, braces;
      // Determine the object type
      if (isArray(value)) {
        type = 'Array';
        braces = ['[', ']'];
      } else {
        type = 'Object';
        braces = ['{', '}'];
      }

      // Make functions say that they are functions
      if (typeof value === 'function') {
        var n = value.name ? ': ' + value.name : '';
        base = (isRegExp(value)) ? ' ' + value : ' [Function' + n + ']';
      } else {
        base = '';
      }

      // Make dates with properties first say the date
      if (isDate(value)) {
        base = ' ' + value.toUTCString();
      }

      if ($keys.length === 0) {
        return braces[0] + base + braces[1];
      }

      if (recurseTimes < 0) {
        if (isRegExp(value)) {
          return stylize('' + value, 'regexp');
        } else {
          return stylize('[Object]', 'special');
        }
      }

      seen.push(value);

      var output = map($keys, function (key) {
        var name, str;
        if (value.__lookupGetter__) {
          if (value.__lookupGetter__(key)) {
            if (value.__lookupSetter__(key)) {
              str = stylize('[Getter/Setter]', 'special');
            } else {
              str = stylize('[Getter]', 'special');
            }
          } else {
            if (value.__lookupSetter__(key)) {
              str = stylize('[Setter]', 'special');
            }
          }
        }
        if (indexOf(visible_keys, key) < 0) {
          name = '[' + key + ']';
        }
        if (!str) {
          if (indexOf(seen, value[key]) < 0) {
            if (recurseTimes === null) {
              str = format(value[key]);
            } else {
              str = format(value[key], recurseTimes - 1);
            }
            if (str.indexOf('\n') > -1) {
              if (isArray(value)) {
                str = map(str.split('\n'), function (line) {
                  return '  ' + line;
                }).join('\n').substr(2);
              } else {
                str = '\n' + map(str.split('\n'), function (line) {
                  return '   ' + line;
                }).join('\n');
              }
            }
          } else {
            str = stylize('[Circular]', 'special');
          }
        }
        if (typeof name === 'undefined') {
          if (type === 'Array' && key.match(/^\d+$/)) {
            return str;
          }
          name = json.stringify('' + key);
          if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
            name = name.substr(1, name.length - 2);
            name = stylize(name, 'name');
          } else {
            name = name.replace(/'/g, "\\'")
                       .replace(/\\"/g, '"')
                       .replace(/(^"|"$)/g, "'");
            name = stylize(name, 'string');
          }
        }

        return name + ': ' + str;
      });

      seen.pop();

      var numLinesEst = 0;
      var length = reduce(output, function (prev, cur) {
        numLinesEst++;
        if (indexOf(cur, '\n') >= 0) numLinesEst++;
        return prev + cur.length + 1;
      }, 0);

      if (length > 50) {
        output = braces[0] +
                 (base === '' ? '' : base + '\n ') +
                 ' ' +
                 output.join(',\n  ') +
                 ' ' +
                 braces[1];

      } else {
        output = braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
      }

      return output;
    }
    return format(obj, (typeof depth === 'undefined' ? 2 : depth));
  };

  function isArray (ar) {
    return Object.prototype.toString.call(ar) == '[object Array]';
  };

  function isRegExp(re) {
    var s;
    try {
      s = '' + re;
    } catch (e) {
      return false;
    }

    return re instanceof RegExp || // easy case
           // duck-type for context-switching evalcx case
           typeof(re) === 'function' &&
           re.constructor.name === 'RegExp' &&
           re.compile &&
           re.test &&
           re.exec &&
           s.match(/^\/.*\/[gim]{0,3}$/);
  };

  function isDate(d) {
    if (d instanceof Date) return true;
    return false;
  };

  function keys (obj) {
    if (Object.keys) {
      return Object.keys(obj);
    }

    var keys = [];

    for (var i in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, i)) {
        keys.push(i);
      }
    }

    return keys;
  }

  function map (arr, mapper, that) {
    if (Array.prototype.map) {
      return Array.prototype.map.call(arr, mapper, that);
    }

    var other= new Array(arr.length);

    for (var i= 0, n = arr.length; i<n; i++)
      if (i in arr)
        other[i] = mapper.call(that, arr[i], i, arr);

    return other;
  };

  function reduce (arr, fun) {
    if (Array.prototype.reduce) {
      return Array.prototype.reduce.apply(
          arr
        , Array.prototype.slice.call(arguments, 1)
      );
    }

    var len = +this.length;

    if (typeof fun !== "function")
      throw new TypeError();

    // no value to return if no initial value and an empty array
    if (len === 0 && arguments.length === 1)
      throw new TypeError();

    var i = 0;
    if (arguments.length >= 2) {
      var rv = arguments[1];
    } else {
      do {
        if (i in this) {
          rv = this[i++];
          break;
        }

        // if array contains no values, no initial value to return
        if (++i >= len)
          throw new TypeError();
      } while (true);
    }

    for (; i < len; i++) {
      if (i in this)
        rv = fun.call(null, rv, this[i], i, this);
    }

    return rv;
  };

  /**
   * Asserts deep equality
   *
   * @see taken from node.js `assert` module (copyright Joyent, MIT license)
   * @api private
   */

  expect.eql = function eql (actual, expected) {
    // 7.1. All identical values are equivalent, as determined by ===.
    if (actual === expected) {
      return true;
    } else if ('undefined' != typeof Buffer
        && Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
      if (actual.length != expected.length) return false;

      for (var i = 0; i < actual.length; i++) {
        if (actual[i] !== expected[i]) return false;
      }

      return true;

    // 7.2. If the expected value is a Date object, the actual value is
    // equivalent if it is also a Date object that refers to the same time.
    } else if (actual instanceof Date && expected instanceof Date) {
      return actual.getTime() === expected.getTime();

    // 7.3. Other pairs that do not both pass typeof value == "object",
    // equivalence is determined by ==.
    } else if (typeof actual != 'object' && typeof expected != 'object') {
      return actual == expected;

    // 7.4. For all other Object pairs, including Array objects, equivalence is
    // determined by having the same number of owned properties (as verified
    // with Object.prototype.hasOwnProperty.call), the same set of keys
    // (although not necessarily the same order), equivalent values for every
    // corresponding key, and an identical "prototype" property. Note: this
    // accounts for both named and indexed properties on Arrays.
    } else {
      return objEquiv(actual, expected);
    }
  }

  function isUndefinedOrNull (value) {
    return value === null || value === undefined;
  }

  function isArguments (object) {
    return Object.prototype.toString.call(object) == '[object Arguments]';
  }

  function objEquiv (a, b) {
    if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
      return false;
    // an identical "prototype" property.
    if (a.prototype !== b.prototype) return false;
    //~~~I've managed to break Object.keys through screwy arguments passing.
    //   Converting to array solves the problem.
    if (isArguments(a)) {
      if (!isArguments(b)) {
        return false;
      }
      a = pSlice.call(a);
      b = pSlice.call(b);
      return expect.eql(a, b);
    }
    try{
      var ka = keys(a),
        kb = keys(b),
        key, i;
    } catch (e) {//happens when one is a string literal and the other isn't
      return false;
    }
    // having the same number of owned properties (keys incorporates hasOwnProperty)
    if (ka.length != kb.length)
      return false;
    //the same set of keys (although not necessarily the same order),
    ka.sort();
    kb.sort();
    //~~~cheap key test
    for (i = ka.length - 1; i >= 0; i--) {
      if (ka[i] != kb[i])
        return false;
    }
    //equivalent values for every corresponding key, and
    //~~~possibly expensive deep test
    for (i = ka.length - 1; i >= 0; i--) {
      key = ka[i];
      if (!expect.eql(a[key], b[key]))
         return false;
    }
    return true;
  }

  var json = (function () {
    "use strict";

    if ('object' == typeof JSON && JSON.parse && JSON.stringify) {
      return {
          parse: nativeJSON.parse
        , stringify: nativeJSON.stringify
      }
    }

    var JSON = {};

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    function date(d, key) {
      return isFinite(d.valueOf()) ?
          d.getUTCFullYear()     + '-' +
          f(d.getUTCMonth() + 1) + '-' +
          f(d.getUTCDate())      + 'T' +
          f(d.getUTCHours())     + ':' +
          f(d.getUTCMinutes())   + ':' +
          f(d.getUTCSeconds())   + 'Z' : null;
    };

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

  // If the string contains no control characters, no quote characters, and no
  // backslash characters, then we can safely slap some quotes around it.
  // Otherwise we must also replace the offending characters with safe escape
  // sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

  // Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

  // If the value has a toJSON method, call it to obtain a replacement value.

        if (value instanceof Date) {
            value = date(key);
        }

  // If we were called with a replacer function, then call the replacer to
  // obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

  // What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

  // JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

  // If the value is a boolean or null, convert it to a string. Note:
  // typeof null does not produce 'null'. The case is included here in
  // the remote chance that this gets fixed someday.

            return String(value);

  // If the type is 'object', we might be dealing with an object or an array or
  // null.

        case 'object':

  // Due to a specification blunder in ECMAScript, typeof null is 'object',
  // so watch out for that case.

            if (!value) {
                return 'null';
            }

  // Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

  // Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

  // The value is an array. Stringify every element. Use null as a placeholder
  // for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

  // Join all of the elements together, separated with commas, and wrap them in
  // brackets.

                v = partial.length === 0 ? '[]' : gap ?
                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                    '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

  // If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

  // Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

  // Join all of the member texts together, separated with commas,
  // and wrap them in braces.

            v = partial.length === 0 ? '{}' : gap ?
                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

  // If the JSON object does not yet have a stringify method, give it one.

    JSON.stringify = function (value, replacer, space) {

  // The stringify method takes a value and an optional replacer, and an optional
  // space parameter, and returns a JSON text. The replacer can be a function
  // that can replace values, or an array of strings that will select the keys.
  // A default replacer method can be provided. Use of the space parameter can
  // produce text that is more easily readable.

        var i;
        gap = '';
        indent = '';

  // If the space parameter is a number, make an indent string containing that
  // many spaces.

        if (typeof space === 'number') {
            for (i = 0; i < space; i += 1) {
                indent += ' ';
            }

  // If the space parameter is a string, it will be used as the indent string.

        } else if (typeof space === 'string') {
            indent = space;
        }

  // If there is a replacer, it must be a function or an array.
  // Otherwise, throw an error.

        rep = replacer;
        if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                typeof replacer.length !== 'number')) {
            throw new Error('JSON.stringify');
        }

  // Make a fake root object containing our value under the key of ''.
  // Return the result of stringifying the value.

        return str('', {'': value});
    };

  // If the JSON object does not yet have a parse method, give it one.

    JSON.parse = function (text, reviver) {
    // The parse method takes a text and an optional reviver function, and returns
    // a JavaScript value if the text is a valid JSON text.

        var j;

        function walk(holder, key) {

    // The walk method is used to recursively walk the resulting structure so
    // that modifications can be made.

            var k, v, value = holder[key];
            if (value && typeof value === 'object') {
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = walk(value, k);
                        if (v !== undefined) {
                            value[k] = v;
                        } else {
                            delete value[k];
                        }
                    }
                }
            }
            return reviver.call(holder, key, value);
        }


    // Parsing happens in four stages. In the first stage, we replace certain
    // Unicode characters with escape sequences. JavaScript handles many characters
    // incorrectly, either silently deleting them, or treating them as line endings.

        text = String(text);
        cx.lastIndex = 0;
        if (cx.test(text)) {
            text = text.replace(cx, function (a) {
                return '\\u' +
                    ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            });
        }

    // In the second stage, we run the text against regular expressions that look
    // for non-JSON patterns. We are especially concerned with '()' and 'new'
    // because they can cause invocation, and '=' because it can cause mutation.
    // But just to be safe, we want to reject all unexpected forms.

    // We split the second stage into 4 regexp operations in order to work around
    // crippling inefficiencies in IE's and Safari's regexp engines. First we
    // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
    // replace all simple value tokens with ']' characters. Third, we delete all
    // open brackets that follow a colon or comma or that begin the text. Finally,
    // we look to see that the remaining characters are only whitespace or ']' or
    // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

        if (/^[\],:{}\s]*$/
                .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

    // In the third stage we use the eval function to compile the text into a
    // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
    // in JavaScript: it can begin a block or an object literal. We wrap the text
    // in parens to eliminate the ambiguity.

            j = eval('(' + text + ')');

    // In the optional fourth stage, we recursively walk the new structure, passing
    // each name/value pair to a reviver function for possible transformation.

            return typeof reviver === 'function' ?
                walk({'': j}, '') : j;
        }

    // If the text is not JSON parseable, then a SyntaxError is thrown.

        throw new SyntaxError('JSON.parse');
    };

    return JSON;
  })();

  if ('undefined' != typeof window) {
    window.expect = module.exports;
  }

})(
    this
  , 'undefined' != typeof module ? module : {}
  , 'undefined' != typeof exports ? exports : {}
);

},{"__browserify_Buffer":3}],6:[function(require,module,exports){
console.log("COVERAGE " + "\"/Users/smoeller/Repos/github/shannonmoeller/toga/test/specs/toga-spec.js\"" + " " + "[[25,38],[49,62],[49,62],[40,63],[77,97],[77,97],[64,98],[110,135],[110,135],[99,136],[148,152],[137,153],[255,487],[242,488],[505,517],[498,518],[498,521],[540,802],[526,812],[498,813],[498,814],[221,820],[190,821],[190,822],[893,941],[881,942],[959,965],[952,966],[952,969],[988,1027],[974,1037],[952,1038],[952,1039],[1056,1066],[1049,1067],[1049,1070],[1089,1123],[1075,1133],[1049,1134],[1049,1135],[1152,1160],[1145,1161],[1145,1164],[1183,1213],[1169,1223],[1145,1224],[1145,1225],[1242,1253],[1235,1254],[1235,1257],[1276,1312],[1375,1377],[1326,1379],[1393,1425],[1488,1490],[1439,1492],[1506,1538],[1601,1603],[1552,1605],[1619,1651],[1714,1716],[1665,1718],[1732,1764],[1262,1774],[1235,1775],[1235,1776],[860,1782],[828,1783],[828,1784],[1854,1924],[1843,1925],[1942,1952],[1935,1953],[1935,1956],[1975,2005],[2079,2081],[2019,2083],[2097,2129],[2203,2205],[2143,2207],[2221,2253],[2327,2329],[2267,2331],[2345,2377],[1961,2387],[1935,2388],[1935,2389],[1822,2395],[1790,2396],[1790,2397],[2458,2605],[2448,2606],[2623,2632],[2616,2633],[2616,2636],[2655,2685],[2749,2819],[2748,2820],[2699,2822],[2836,2868],[2932,3002],[2931,3003],[2882,3005],[3019,3051],[3115,3162],[3114,3163],[3065,3165],[3179,3211],[3275,3322],[3274,3323],[3225,3325],[3339,3371],[3435,3451],[3434,3452],[3385,3454],[3468,3500],[2641,3510],[2616,3511],[2616,3512],[2427,3518],[2403,3519],[2403,3520],[3581,3965],[3571,3966],[3983,3992],[3976,3993],[3976,3996],[4015,4045],[4109,4192],[4108,4193],[4059,4195],[4209,4241],[4305,4388],[4304,4389],[4255,4391],[4405,4437],[4501,4582],[4500,4583],[4451,4585],[4599,4631],[4695,4776],[4694,4777],[4645,4779],[4793,4825],[4889,4941],[4888,4942],[4839,4944],[4958,4990],[5054,5104],[5053,5105],[5004,5107],[5121,5153],[5217,5282],[5216,5283],[5167,5285],[5299,5331],[5395,5460],[5394,5461],[5345,5463],[5477,5509],[5573,5636],[5572,5637],[5523,5639],[5653,5685],[5749,5812],[5748,5813],[5699,5815],[5829,5861],[5925,5959],[5924,5960],[5875,5962],[5976,6008],[6072,6104],[6071,6105],[6022,6107],[6121,6153],[4001,6163],[3976,6164],[3976,6165],[3550,6171],[3526,6172],[3526,6173],[6236,6395],[6225,6396],[6413,6423],[6406,6424],[6406,6427],[6446,6476],[6540,6574],[6539,6575],[6490,6577],[6591,6623],[6687,6730],[6686,6731],[6637,6733],[6747,6779],[6843,6903],[6842,6904],[6793,6906],[6920,6952],[7016,7103],[7015,7104],[6966,7106],[7120,7152],[6432,7162],[6406,7163],[6406,7164],[6204,7170],[6179,7171],[6179,7172],[7235,7334],[7224,7335],[7352,7362],[7345,7363],[7345,7366],[7385,7415],[7479,7511],[7478,7512],[7429,7514],[7528,7560],[7624,7658],[7623,7659],[7574,7661],[7675,7707],[7771,7808],[7770,7809],[7721,7811],[7825,7857],[7921,7969],[7920,7970],[7871,7972],[7986,8018],[7371,8028],[7345,8029],[7345,8030],[7203,8036],[7178,8037],[7178,8038],[8108,11339],[8095,11340],[11371,11381],[11371,11381],[11350,11382],[11434,11467],[11405,11468],[11405,11468],[11392,11469],[11479,11493],[11479,11496],[11515,11545],[11853,11936],[11958,12089],[12111,12275],[12297,12366],[12388,12404],[11831,12422],[11559,12981],[12995,13029],[13337,13420],[13442,13573],[13595,13759],[13781,13850],[13872,13888],[13315,13906],[13043,14396],[14410,14444],[14752,14835],[14857,14988],[15010,15174],[15196,15265],[15287,15303],[14730,15321],[14458,15879],[15893,15927],[16235,16318],[16340,16471],[16493,16657],[16679,16748],[16770,16786],[16213,16804],[15941,17475],[17489,17523],[17831,17914],[17936,18067],[18089,18253],[18275,18344],[18366,18382],[17809,18400],[17537,18966],[18980,19014],[19322,19405],[19427,19558],[19580,19744],[19766,19835],[19857,19873],[19300,19891],[19028,20524],[20538,20570],[11501,20580],[11479,20581],[11479,20582],[8074,20588],[8044,20589],[8044,20590],[20673,24625],[20660,24626],[24667,24902],[24658,24903],[24658,24903],[24636,24904],[24957,24990],[24927,24991],[24927,24991],[24914,24992],[25002,25016],[25002,25019],[25038,25068],[25373,25456],[25478,25609],[25631,25795],[25817,25954],[25976,26013],[25351,26031],[25082,26704],[26718,26752],[27057,27140],[27162,27293],[27315,27479],[27501,27638],[27660,27676],[27035,27694],[26766,28253],[28267,28301],[28610,28693],[28715,28846],[28868,29032],[29054,29191],[29213,29229],[28588,29247],[28315,29894],[29908,29942],[30247,30330],[30352,30483],[30505,30669],[30691,30828],[30850,30887],[30225,30905],[29956,31706],[31720,31754],[32059,32142],[32164,32295],[32317,32481],[32503,32640],[32662,32678],[32037,32696],[31768,33347],[33361,33395],[33704,33787],[33809,33940],[33962,34126],[34148,34285],[34307,34323],[33682,34341],[33409,35080],[35094,35230],[25024,35240],[25002,35241],[25002,35242],[20639,35248],[20596,35249],[20596,35250],[35327,35842],[35314,35843],[35879,36047],[35870,36048],[35870,36048],[35853,36049],[36097,36130],[36072,36131],[36072,36131],[36059,36132],[36142,36156],[36142,36159],[36178,36262],[36570,36653],[36675,36806],[36828,36992],[37014,37081],[37103,37119],[36548,37137],[36276,37629],[37643,37675],[36164,37685],[36142,37686],[36142,37687],[35293,37693],[35256,37694],[35256,37695],[172,37697],[155,37698],[155,37699]]");var __coverage = {"0":[25,38],"1":[49,62],"2":[49,62],"3":[40,63],"4":[77,97],"5":[77,97],"6":[64,98],"7":[110,135],"8":[110,135],"9":[99,136],"10":[148,152],"11":[137,153],"12":[255,487],"13":[242,488],"14":[505,517],"15":[498,518],"16":[498,521],"17":[540,802],"18":[526,812],"19":[498,813],"20":[498,814],"21":[221,820],"22":[190,821],"23":[190,822],"24":[893,941],"25":[881,942],"26":[959,965],"27":[952,966],"28":[952,969],"29":[988,1027],"30":[974,1037],"31":[952,1038],"32":[952,1039],"33":[1056,1066],"34":[1049,1067],"35":[1049,1070],"36":[1089,1123],"37":[1075,1133],"38":[1049,1134],"39":[1049,1135],"40":[1152,1160],"41":[1145,1161],"42":[1145,1164],"43":[1183,1213],"44":[1169,1223],"45":[1145,1224],"46":[1145,1225],"47":[1242,1253],"48":[1235,1254],"49":[1235,1257],"50":[1276,1312],"51":[1375,1377],"52":[1326,1379],"53":[1393,1425],"54":[1488,1490],"55":[1439,1492],"56":[1506,1538],"57":[1601,1603],"58":[1552,1605],"59":[1619,1651],"60":[1714,1716],"61":[1665,1718],"62":[1732,1764],"63":[1262,1774],"64":[1235,1775],"65":[1235,1776],"66":[860,1782],"67":[828,1783],"68":[828,1784],"69":[1854,1924],"70":[1843,1925],"71":[1942,1952],"72":[1935,1953],"73":[1935,1956],"74":[1975,2005],"75":[2079,2081],"76":[2019,2083],"77":[2097,2129],"78":[2203,2205],"79":[2143,2207],"80":[2221,2253],"81":[2327,2329],"82":[2267,2331],"83":[2345,2377],"84":[1961,2387],"85":[1935,2388],"86":[1935,2389],"87":[1822,2395],"88":[1790,2396],"89":[1790,2397],"90":[2458,2605],"91":[2448,2606],"92":[2623,2632],"93":[2616,2633],"94":[2616,2636],"95":[2655,2685],"96":[2749,2819],"97":[2748,2820],"98":[2699,2822],"99":[2836,2868],"100":[2932,3002],"101":[2931,3003],"102":[2882,3005],"103":[3019,3051],"104":[3115,3162],"105":[3114,3163],"106":[3065,3165],"107":[3179,3211],"108":[3275,3322],"109":[3274,3323],"110":[3225,3325],"111":[3339,3371],"112":[3435,3451],"113":[3434,3452],"114":[3385,3454],"115":[3468,3500],"116":[2641,3510],"117":[2616,3511],"118":[2616,3512],"119":[2427,3518],"120":[2403,3519],"121":[2403,3520],"122":[3581,3965],"123":[3571,3966],"124":[3983,3992],"125":[3976,3993],"126":[3976,3996],"127":[4015,4045],"128":[4109,4192],"129":[4108,4193],"130":[4059,4195],"131":[4209,4241],"132":[4305,4388],"133":[4304,4389],"134":[4255,4391],"135":[4405,4437],"136":[4501,4582],"137":[4500,4583],"138":[4451,4585],"139":[4599,4631],"140":[4695,4776],"141":[4694,4777],"142":[4645,4779],"143":[4793,4825],"144":[4889,4941],"145":[4888,4942],"146":[4839,4944],"147":[4958,4990],"148":[5054,5104],"149":[5053,5105],"150":[5004,5107],"151":[5121,5153],"152":[5217,5282],"153":[5216,5283],"154":[5167,5285],"155":[5299,5331],"156":[5395,5460],"157":[5394,5461],"158":[5345,5463],"159":[5477,5509],"160":[5573,5636],"161":[5572,5637],"162":[5523,5639],"163":[5653,5685],"164":[5749,5812],"165":[5748,5813],"166":[5699,5815],"167":[5829,5861],"168":[5925,5959],"169":[5924,5960],"170":[5875,5962],"171":[5976,6008],"172":[6072,6104],"173":[6071,6105],"174":[6022,6107],"175":[6121,6153],"176":[4001,6163],"177":[3976,6164],"178":[3976,6165],"179":[3550,6171],"180":[3526,6172],"181":[3526,6173],"182":[6236,6395],"183":[6225,6396],"184":[6413,6423],"185":[6406,6424],"186":[6406,6427],"187":[6446,6476],"188":[6540,6574],"189":[6539,6575],"190":[6490,6577],"191":[6591,6623],"192":[6687,6730],"193":[6686,6731],"194":[6637,6733],"195":[6747,6779],"196":[6843,6903],"197":[6842,6904],"198":[6793,6906],"199":[6920,6952],"200":[7016,7103],"201":[7015,7104],"202":[6966,7106],"203":[7120,7152],"204":[6432,7162],"205":[6406,7163],"206":[6406,7164],"207":[6204,7170],"208":[6179,7171],"209":[6179,7172],"210":[7235,7334],"211":[7224,7335],"212":[7352,7362],"213":[7345,7363],"214":[7345,7366],"215":[7385,7415],"216":[7479,7511],"217":[7478,7512],"218":[7429,7514],"219":[7528,7560],"220":[7624,7658],"221":[7623,7659],"222":[7574,7661],"223":[7675,7707],"224":[7771,7808],"225":[7770,7809],"226":[7721,7811],"227":[7825,7857],"228":[7921,7969],"229":[7920,7970],"230":[7871,7972],"231":[7986,8018],"232":[7371,8028],"233":[7345,8029],"234":[7345,8030],"235":[7203,8036],"236":[7178,8037],"237":[7178,8038],"238":[8108,11339],"239":[8095,11340],"240":[11371,11381],"241":[11371,11381],"242":[11350,11382],"243":[11434,11467],"244":[11405,11468],"245":[11405,11468],"246":[11392,11469],"247":[11479,11493],"248":[11479,11496],"249":[11515,11545],"250":[11853,11936],"251":[11958,12089],"252":[12111,12275],"253":[12297,12366],"254":[12388,12404],"255":[11831,12422],"256":[11559,12981],"257":[12995,13029],"258":[13337,13420],"259":[13442,13573],"260":[13595,13759],"261":[13781,13850],"262":[13872,13888],"263":[13315,13906],"264":[13043,14396],"265":[14410,14444],"266":[14752,14835],"267":[14857,14988],"268":[15010,15174],"269":[15196,15265],"270":[15287,15303],"271":[14730,15321],"272":[14458,15879],"273":[15893,15927],"274":[16235,16318],"275":[16340,16471],"276":[16493,16657],"277":[16679,16748],"278":[16770,16786],"279":[16213,16804],"280":[15941,17475],"281":[17489,17523],"282":[17831,17914],"283":[17936,18067],"284":[18089,18253],"285":[18275,18344],"286":[18366,18382],"287":[17809,18400],"288":[17537,18966],"289":[18980,19014],"290":[19322,19405],"291":[19427,19558],"292":[19580,19744],"293":[19766,19835],"294":[19857,19873],"295":[19300,19891],"296":[19028,20524],"297":[20538,20570],"298":[11501,20580],"299":[11479,20581],"300":[11479,20582],"301":[8074,20588],"302":[8044,20589],"303":[8044,20590],"304":[20673,24625],"305":[20660,24626],"306":[24667,24902],"307":[24658,24903],"308":[24658,24903],"309":[24636,24904],"310":[24957,24990],"311":[24927,24991],"312":[24927,24991],"313":[24914,24992],"314":[25002,25016],"315":[25002,25019],"316":[25038,25068],"317":[25373,25456],"318":[25478,25609],"319":[25631,25795],"320":[25817,25954],"321":[25976,26013],"322":[25351,26031],"323":[25082,26704],"324":[26718,26752],"325":[27057,27140],"326":[27162,27293],"327":[27315,27479],"328":[27501,27638],"329":[27660,27676],"330":[27035,27694],"331":[26766,28253],"332":[28267,28301],"333":[28610,28693],"334":[28715,28846],"335":[28868,29032],"336":[29054,29191],"337":[29213,29229],"338":[28588,29247],"339":[28315,29894],"340":[29908,29942],"341":[30247,30330],"342":[30352,30483],"343":[30505,30669],"344":[30691,30828],"345":[30850,30887],"346":[30225,30905],"347":[29956,31706],"348":[31720,31754],"349":[32059,32142],"350":[32164,32295],"351":[32317,32481],"352":[32503,32640],"353":[32662,32678],"354":[32037,32696],"355":[31768,33347],"356":[33361,33395],"357":[33704,33787],"358":[33809,33940],"359":[33962,34126],"360":[34148,34285],"361":[34307,34323],"362":[33682,34341],"363":[33409,35080],"364":[35094,35230],"365":[25024,35240],"366":[25002,35241],"367":[25002,35242],"368":[20639,35248],"369":[20596,35249],"370":[20596,35250],"371":[35327,35842],"372":[35314,35843],"373":[35879,36047],"374":[35870,36048],"375":[35870,36048],"376":[35853,36049],"377":[36097,36130],"378":[36072,36131],"379":[36072,36131],"380":[36059,36132],"381":[36142,36156],"382":[36142,36159],"383":[36178,36262],"384":[36570,36653],"385":[36675,36806],"386":[36828,36992],"387":[37014,37081],"388":[37103,37119],"389":[36548,37137],"390":[36276,37629],"391":[37643,37675],"392":[36164,37685],"393":[36142,37686],"394":[36142,37687],"395":[35293,37693],"396":[35256,37694],"397":[35256,37695],"398":[172,37697],"399":[155,37698],"400":[155,37699]};var __coverageWrap = function (index, value) {if (__coverage[index]) console.log("COVERED " + "\"/Users/smoeller/Repos/github/shannonmoeller/toga/test/specs/toga-spec.js\"" + " " + index);delete __coverage[index];return value};
/*jshint maxlen:false */
{ __coverageWrap(0);'use strict';};

{ __coverageWrap(3);var fs = __coverageWrap(2,__coverageWrap(1,require('fs')));};
{ __coverageWrap(6);var expect = __coverageWrap(5,__coverageWrap(4,require('expect.js')));};
{ __coverageWrap(9);var toga = __coverageWrap(8,__coverageWrap(7,require('../../lib/toga')));};
{ __coverageWrap(11);var Toga = __coverageWrap(10,toga);};

{ __coverageWrap(400);__coverageWrap(399,describe('Toga', __coverageWrap(398,function () {
    { __coverageWrap(23);__coverageWrap(22,it('should ignore non-blocks', __coverageWrap(21,function() {
        { __coverageWrap(13);var ignore = __coverageWrap(12,"// ignore\n/* ignore */\n/*! ignore */\n\n//\n// ignore\n//\n/*\n * ignore\n */\n/*!\n * ignore\n */\n\n// /** ignore\nvar ignore = '/** ignore */';\nvar foo = function(/** ignore */) {};\nconsole.log(foo(ignore));\n// ignore */\n");};

        { __coverageWrap(20);__coverageWrap(19,__coverageWrap(16,__coverageWrap(15,expect(__coverageWrap(14,toga(ignore)))).to).eql(__coverageWrap(18,[
            __coverageWrap(17,{ 'type': 'Code', 'body': '// ignore\n/* ignore */\n/*! ignore */\n\n//\n// ignore\n//\n/*\n * ignore\n */\n/*!\n * ignore\n */\n\n// /** ignore\nvar ignore = \'/** ignore */\';\nvar foo = function(/** ignore */) {};\nconsole.log(foo(ignore));\n// ignore */\n' })
        ])));};
    })));};

    { __coverageWrap(68);__coverageWrap(67,it('should parse empty blocks', __coverageWrap(66,function() {
        { __coverageWrap(25);var empty = __coverageWrap(24,"/**/\n/***/\n/** */\n/**\n *\n */\n/**\n\n*/\n");};

        { __coverageWrap(32);__coverageWrap(31,__coverageWrap(28,__coverageWrap(27,expect(__coverageWrap(26,toga()))).to).eql(__coverageWrap(30,[
            __coverageWrap(29,{ 'type': 'Code', 'body': 'undefined' })
        ])));};

        { __coverageWrap(39);__coverageWrap(38,__coverageWrap(35,__coverageWrap(34,expect(__coverageWrap(33,toga(null)))).to).eql(__coverageWrap(37,[
            __coverageWrap(36,{ 'type': 'Code', 'body': 'null' })
        ])));};

        { __coverageWrap(46);__coverageWrap(45,__coverageWrap(42,__coverageWrap(41,expect(__coverageWrap(40,toga('')))).to).eql(__coverageWrap(44,[
            __coverageWrap(43,{ 'type': 'Code', 'body': '' })
        ])));};

        { __coverageWrap(65);__coverageWrap(64,__coverageWrap(49,__coverageWrap(48,expect(__coverageWrap(47,toga(empty)))).to).eql(__coverageWrap(63,[
            __coverageWrap(50,{ 'type': 'Code', 'body': '/**/\n' }),
            __coverageWrap(52,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(51,[]) }),
            __coverageWrap(53,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(55,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(54,[]) }),
            __coverageWrap(56,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(58,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(57,[]) }),
            __coverageWrap(59,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(61,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(60,[]) }),
            __coverageWrap(62,{ 'type': 'Code', 'body': '\n' })
        ])));};
    })));};

    { __coverageWrap(89);__coverageWrap(88,it('should parse descriptions', __coverageWrap(87,function() {
        { __coverageWrap(70);var desc = __coverageWrap(69,"/** description */\n/**\n * description\n */\n/**\ndescription\n*/\n");};

        { __coverageWrap(86);__coverageWrap(85,__coverageWrap(73,__coverageWrap(72,expect(__coverageWrap(71,toga(desc)))).to).eql(__coverageWrap(84,[
            __coverageWrap(74,{ 'type': 'Code', 'body': '' }),
            __coverageWrap(76,{ 'type': 'DocBlock', 'description': 'description', 'tags': __coverageWrap(75,[]) }),
            __coverageWrap(77,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(79,{ 'type': 'DocBlock', 'description': 'description', 'tags': __coverageWrap(78,[]) }),
            __coverageWrap(80,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(82,{ 'type': 'DocBlock', 'description': 'description', 'tags': __coverageWrap(81,[]) }),
            __coverageWrap(83,{ 'type': 'Code', 'body': '\n' })
        ])));};
    })));};

    { __coverageWrap(121);__coverageWrap(120,it('should parse tags', __coverageWrap(119,function() {
        { __coverageWrap(91);var tag = __coverageWrap(90,"/** @tag {Type} - Description here. */\n/** @tag {Type} Description here. */\n/** @tag - Description. */\n/** @tag Description. */\n/** @tag */\n");};

        { __coverageWrap(118);__coverageWrap(117,__coverageWrap(94,__coverageWrap(93,expect(__coverageWrap(92,toga(tag)))).to).eql(__coverageWrap(116,[
            __coverageWrap(95,{ 'type': 'Code', 'body': '' }),
            __coverageWrap(98,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(97,[__coverageWrap(96,{ 'tag': 'tag', 'type': '{Type}', 'description': 'Description here.' })]) }),
            __coverageWrap(99,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(102,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(101,[__coverageWrap(100,{ 'tag': 'tag', 'type': '{Type}', 'description': 'Description here.' })]) }),
            __coverageWrap(103,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(106,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(105,[__coverageWrap(104,{ 'tag': 'tag', 'description': 'Description.' })]) }),
            __coverageWrap(107,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(110,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(109,[__coverageWrap(108,{ 'tag': 'tag', 'description': 'Description.' })]) }),
            __coverageWrap(111,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(114,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(113,[__coverageWrap(112,{ 'tag': 'tag' })]) }),
            __coverageWrap(115,{ 'type': 'Code', 'body': '\n' })
        ])));};
    })));};

    { __coverageWrap(181);__coverageWrap(180,it('should parse args', __coverageWrap(179,function() {
        { __coverageWrap(123);var arg = __coverageWrap(122,"/** @arg {Type} [name] - Description. */\n/** @arg {Type} [name] Description. */\n/** @arg {Type} name - Description. */\n/** @arg {Type} name Description. */\n/** @arg {Type} [name] */\n/** @arg {Type} name */\n/** @arg [name] - Description. */\n/** @arg [name] Description. */\n/** @arg name - Description. */\n/** @arg name Description. */\n/** @arg [name] */\n/** @arg name */\n");};

        { __coverageWrap(178);__coverageWrap(177,__coverageWrap(126,__coverageWrap(125,expect(__coverageWrap(124,toga(arg)))).to).eql(__coverageWrap(176,[
            __coverageWrap(127,{ 'type': 'Code', 'body': '' }),
            __coverageWrap(130,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(129,[__coverageWrap(128,{ 'tag': 'arg', 'type': '{Type}', 'name': '[name]', 'description': 'Description.' })]) }),
            __coverageWrap(131,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(134,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(133,[__coverageWrap(132,{ 'tag': 'arg', 'type': '{Type}', 'name': '[name]', 'description': 'Description.' })]) }),
            __coverageWrap(135,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(138,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(137,[__coverageWrap(136,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.' })]) }),
            __coverageWrap(139,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(142,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(141,[__coverageWrap(140,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.' })]) }),
            __coverageWrap(143,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(146,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(145,[__coverageWrap(144,{ 'tag': 'arg', 'type': '{Type}', 'name': '[name]' })]) }),
            __coverageWrap(147,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(150,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(149,[__coverageWrap(148,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name' })]) }),
            __coverageWrap(151,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(154,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(153,[__coverageWrap(152,{ 'tag': 'arg', 'name': '[name]', 'description': 'Description.' })]) }),
            __coverageWrap(155,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(158,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(157,[__coverageWrap(156,{ 'tag': 'arg', 'name': '[name]', 'description': 'Description.' })]) }),
            __coverageWrap(159,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(162,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(161,[__coverageWrap(160,{ 'tag': 'arg', 'name': 'name', 'description': 'Description.' })]) }),
            __coverageWrap(163,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(166,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(165,[__coverageWrap(164,{ 'tag': 'arg', 'name': 'name', 'description': 'Description.' })]) }),
            __coverageWrap(167,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(170,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(169,[__coverageWrap(168,{ 'tag': 'arg', 'name': '[name]' })]) }),
            __coverageWrap(171,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(174,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(173,[__coverageWrap(172,{ 'tag': 'arg', 'name': 'name' })]) }),
            __coverageWrap(175,{ 'type': 'Code', 'body': '\n' })
        ])));};
    })));};

    { __coverageWrap(209);__coverageWrap(208,it('should parse types', __coverageWrap(207,function() {
        { __coverageWrap(183);var type = __coverageWrap(182,"/** @arg {Type} */\n/** @arg {String|Object} */\n/** @arg {Array.<Object.<String,Number>>} */\n/** @arg {Function(String, ...[Number]): Number} callback */\n");};

        { __coverageWrap(206);__coverageWrap(205,__coverageWrap(186,__coverageWrap(185,expect(__coverageWrap(184,toga(type)))).to).eql(__coverageWrap(204,[
            __coverageWrap(187,{ 'type': 'Code', 'body': '' }),
            __coverageWrap(190,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(189,[__coverageWrap(188,{ 'tag': 'arg', 'type': '{Type}' })]) }),
            __coverageWrap(191,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(194,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(193,[__coverageWrap(192,{ 'tag': 'arg', 'type': '{String|Object}' })]) }),
            __coverageWrap(195,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(198,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(197,[__coverageWrap(196,{ 'tag': 'arg', 'type': '{Array.<Object.<String,Number>>}' })]) }),
            __coverageWrap(199,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(202,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(201,[__coverageWrap(200,{ 'tag': 'arg', 'type': '{Function(String, ...[Number]): Number}', 'name': 'callback' })]) }),
            __coverageWrap(203,{ 'type': 'Code', 'body': '\n' })
        ])));};
    })));};

    { __coverageWrap(237);__coverageWrap(236,it('should parse names', __coverageWrap(235,function() {
        { __coverageWrap(211);var name = __coverageWrap(210,"/** @arg name */\n/** @arg [name] */\n/** @arg [name={}] */\n/** @arg [name=\"hello world\"] */\n");};

        { __coverageWrap(234);__coverageWrap(233,__coverageWrap(214,__coverageWrap(213,expect(__coverageWrap(212,toga(name)))).to).eql(__coverageWrap(232,[
            __coverageWrap(215,{ 'type': 'Code', 'body': '' }),
            __coverageWrap(218,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(217,[__coverageWrap(216,{ 'tag': 'arg', 'name': 'name' })]) }),
            __coverageWrap(219,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(222,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(221,[__coverageWrap(220,{ 'tag': 'arg', 'name': '[name]' })]) }),
            __coverageWrap(223,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(226,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(225,[__coverageWrap(224,{ 'tag': 'arg', 'name': '[name={}]' })]) }),
            __coverageWrap(227,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(230,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(229,[__coverageWrap(228,{ 'tag': 'arg', 'name': '[name="hello world"]' })]) }),
            __coverageWrap(231,{ 'type': 'Code', 'body': '\n' })
        ])));};
    })));};

    { __coverageWrap(303);__coverageWrap(302,it('should handle indention', __coverageWrap(301,function() {
        { __coverageWrap(239);var indent = __coverageWrap(238,"/**\n * # Title\n *\n * Long description that spans multiple\n * lines and even has other markdown\n * type things.\n *\n * Like more paragraphs.\n *\n * * Like\n * * Lists\n *\n *     var code = 'samples';\n *\n * @arg {Type} name Description.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n *\n *   And has line breaks, etc.\n *\n * @example\n *\n *     var foo = 'bar';\n *\n * @tag\n */\n\n/**\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = 'samples';\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    var foo = 'bar';\n\n@tag\n */\n\n/**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = 'samples';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = 'bar';\n\n    @tag\n */\n\n    /**\n     * # Title\n     *\n     * Long description that spans multiple\n     * lines and even has other markdown\n     * type things.\n     *\n     * Like more paragraphs.\n     *\n     * * Like\n     * * Lists\n     *\n     *     var code = 'samples';\n     *\n     * @arg {Type} name Description.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     *\n     *   And has line breaks, etc.\n     *\n     * @example\n     *\n     *     var foo = 'bar';\n     *\n     * @tag\n     */\n\n    /**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = 'samples';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = 'bar';\n\n    @tag\n     */\n\n    /**\n        # Title\n\n        Long description that spans multiple\n        lines and even has other markdown\n        type things.\n\n        Like more paragraphs.\n\n        * Like\n        * Lists\n\n            var code = 'samples';\n\n        @arg {Type} name Description.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n\n          And has line breaks, etc.\n\n        @example\n\n            var foo = 'bar';\n\n        @tag\n    */\n");};

        { __coverageWrap(242);var standardParser = __coverageWrap(241,__coverageWrap(240,new Toga()));};

        { __coverageWrap(246);var tokens = __coverageWrap(245,__coverageWrap(244,standardParser.parse(indent, __coverageWrap(243,{
            raw: true
        }))));};

        { __coverageWrap(300);__coverageWrap(299,__coverageWrap(248,__coverageWrap(247,expect(tokens)).to).eql(__coverageWrap(298,[
            __coverageWrap(249,{ 'type': 'Code', 'body': '' }),
            __coverageWrap(256,{
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': __coverageWrap(255,[
                    __coverageWrap(250,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' }),
                    __coverageWrap(251,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' }),
                    __coverageWrap(252,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' }),
                    __coverageWrap(253,{ 'tag': 'example', 'description': '\n\n    var foo = \'bar\';\n\n' }),
                    __coverageWrap(254,{ 'tag': 'tag' })
                ]),
                'raw': '/**\n * # Title\n *\n * Long description that spans multiple\n * lines and even has other markdown\n * type things.\n *\n * Like more paragraphs.\n *\n * * Like\n * * Lists\n *\n *     var code = \'samples\';\n *\n * @arg {Type} name Description.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n *\n *   And has line breaks, etc.\n *\n * @example\n *\n *     var foo = \'bar\';\n *\n * @tag\n */'
            }),
            __coverageWrap(257,{ 'type': 'Code', 'body': '\n\n' }),
            __coverageWrap(264,{
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': __coverageWrap(263,[
                    __coverageWrap(258,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' }),
                    __coverageWrap(259,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' }),
                    __coverageWrap(260,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' }),
                    __coverageWrap(261,{ 'tag': 'example', 'description': '\n\n    var foo = \'bar\';\n\n' }),
                    __coverageWrap(262,{ 'tag': 'tag' })
                ]),
                'raw': '/**\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    var foo = \'bar\';\n\n@tag\n */'
            }),
            __coverageWrap(265,{ 'type': 'Code', 'body': '\n\n' }),
            __coverageWrap(272,{
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': __coverageWrap(271,[
                    __coverageWrap(266,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' }),
                    __coverageWrap(267,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' }),
                    __coverageWrap(268,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' }),
                    __coverageWrap(269,{ 'tag': 'example', 'description': '\n\n    var foo = \'bar\';\n\n' }),
                    __coverageWrap(270,{ 'tag': 'tag' })
                ]),
                'raw': '/**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = \'samples\';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = \'bar\';\n\n    @tag\n */'
            }),
            __coverageWrap(273,{ 'type': 'Code', 'body': '\n\n' }),
            __coverageWrap(280,{
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': __coverageWrap(279,[
                    __coverageWrap(274,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' }),
                    __coverageWrap(275,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' }),
                    __coverageWrap(276,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' }),
                    __coverageWrap(277,{ 'tag': 'example', 'description': '\n\n    var foo = \'bar\';\n\n' }),
                    __coverageWrap(278,{ 'tag': 'tag' })
                ]),
                'raw': '    /**\n     * # Title\n     *\n     * Long description that spans multiple\n     * lines and even has other markdown\n     * type things.\n     *\n     * Like more paragraphs.\n     *\n     * * Like\n     * * Lists\n     *\n     *     var code = \'samples\';\n     *\n     * @arg {Type} name Description.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     *\n     *   And has line breaks, etc.\n     *\n     * @example\n     *\n     *     var foo = \'bar\';\n     *\n     * @tag\n     */'
            }),
            __coverageWrap(281,{ 'type': 'Code', 'body': '\n\n' }),
            __coverageWrap(288,{
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': __coverageWrap(287,[
                    __coverageWrap(282,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' }),
                    __coverageWrap(283,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' }),
                    __coverageWrap(284,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' }),
                    __coverageWrap(285,{ 'tag': 'example', 'description': '\n\n    var foo = \'bar\';\n\n' }),
                    __coverageWrap(286,{ 'tag': 'tag' })
                ]),
                'raw': '    /**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = \'samples\';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = \'bar\';\n\n    @tag\n     */'
            }),
            __coverageWrap(289,{ 'type': 'Code', 'body': '\n\n' }),
            __coverageWrap(296,{
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': __coverageWrap(295,[
                    __coverageWrap(290,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' }),
                    __coverageWrap(291,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' }),
                    __coverageWrap(292,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' }),
                    __coverageWrap(293,{ 'tag': 'example', 'description': '\n\n    var foo = \'bar\';\n\n' }),
                    __coverageWrap(294,{ 'tag': 'tag' })
                ]),
                'raw': '    /**\n        # Title\n\n        Long description that spans multiple\n        lines and even has other markdown\n        type things.\n\n        Like more paragraphs.\n\n        * Like\n        * Lists\n\n            var code = \'samples\';\n\n        @arg {Type} name Description.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n\n          And has line breaks, etc.\n\n        @example\n\n            var foo = \'bar\';\n\n        @tag\n    */'
            }),
            __coverageWrap(297,{ 'type': 'Code', 'body': '\n' })
        ])));};
    })));};

    { __coverageWrap(370);__coverageWrap(369,it('should use custom handlebars grammar', __coverageWrap(368,function() {
        { __coverageWrap(305);var custom = __coverageWrap(304,"{{!---\n  ! # Title\n  !\n  ! Long description that spans multiple\n  ! lines and even has other markdown\n  ! type things.\n  !\n  ! Like more paragraphs.\n  !\n  ! * Like\n  ! * Lists\n  !\n  !     <code>samples</code>\n  !\n  ! @arg {Type} name Description.\n  ! @arg {Type} name Description that is really long\n  !   and wraps to other lines.\n  ! @arg {Type} name Description that is really long\n  !   and wraps to other lines.\n  !\n  !   And has line breaks, etc.\n  !\n  ! @example\n  !\n  !     <ul>\n  !         {{#each item}}\n  !             <li>{{.}}</li>\n  !         {{/each}}\n  !     </ul>\n  !\n  ! @tag\n  !--}}\n\n{{!---\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n@tag\n--}}\n\n{{!---\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        <code>{{samples}}</code>\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        <ul>\n            {{#each item}}\n                <li>{{.}}</li>\n            {{/each}}\n        </ul>\n\n    @tag\n--}}\n\n    {{!---\n      ! # Title\n      !\n      ! Long description that spans multiple\n      ! lines and even has other markdown\n      ! type things.\n      !\n      ! Like more paragraphs.\n      !\n      ! * Like\n      ! * Lists\n      !\n      !     <code>samples</code>\n      !\n      ! @arg {Type} name Description.\n      ! @arg {Type} name Description that is really long\n      !   and wraps to other lines.\n      ! @arg {Type} name Description that is really long\n      !   and wraps to other lines.\n      !\n      !   And has line breaks, etc.\n      !\n      ! @example\n      !\n      !     <ul>\n      !         {{#each item}}\n      !             <li>{{.}}</li>\n      !         {{/each}}\n      !     </ul>\n      !\n      ! @tag\n      !--}}\n\n    {{!---\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        <code>samples</code>\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        <ul>\n            {{#each item}}\n                <li>{{.}}</li>\n            {{/each}}\n        </ul>\n\n    @tag\n    --}}\n\n    {{!---\n        # Title\n\n        Long description that spans multiple\n        lines and even has other markdown\n        type things.\n\n        Like more paragraphs.\n\n        * Like\n        * Lists\n\n            <code>{{samples}}</code>\n\n        @arg {Type} name Description.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n\n          And has line breaks, etc.\n\n        @example\n\n            <ul>\n                {{#each item}}\n                    <li>{{.}}</li>\n                {{/each}}\n            </ul>\n\n        @tag\n    --}}\n\n{{! ignore }}\n{{!-- ignore --}}\n{{!\n  ! ignore\n  !}}\n<!-- {{!--- ignore -->\n<!-- ignore }} -->\n");};

        { __coverageWrap(309);var handlebarParser = __coverageWrap(308,__coverageWrap(307,new Toga(__coverageWrap(306,{
            blockSplit: /(^[\t ]*\{\{!---(?!-)[\s\S]*?\s*--\}\})/m,
            blockParse: /^[\t ]*\{\{!---(?!-)([\s\S]*?)\s*--\}\}/m,
            indent: /^[\t !]/gm,
            named: /^(arg(gument)?|data|prop(erty)?)$/
        }))));};

        { __coverageWrap(313);var tokens = __coverageWrap(312,__coverageWrap(311,handlebarParser.parse(custom, __coverageWrap(310,{
            raw: true
        }))));};

        { __coverageWrap(367);__coverageWrap(366,__coverageWrap(315,__coverageWrap(314,expect(tokens)).to).eql(__coverageWrap(365,[
            __coverageWrap(316,{ 'type': 'Code', 'body': '' }),
            __coverageWrap(323,{
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n',
                'tags': __coverageWrap(322,[
                    __coverageWrap(317,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' }),
                    __coverageWrap(318,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' }),
                    __coverageWrap(319,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' }),
                    __coverageWrap(320,{ 'tag': 'example', 'description': '\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n' }),
                    __coverageWrap(321,{ 'tag': 'tag', 'description': '\n' })
                ]),
                'raw': '{{!---\n  ! # Title\n  !\n  ! Long description that spans multiple\n  ! lines and even has other markdown\n  ! type things.\n  !\n  ! Like more paragraphs.\n  !\n  ! * Like\n  ! * Lists\n  !\n  !     <code>samples</code>\n  !\n  ! @arg {Type} name Description.\n  ! @arg {Type} name Description that is really long\n  !   and wraps to other lines.\n  ! @arg {Type} name Description that is really long\n  !   and wraps to other lines.\n  !\n  !   And has line breaks, etc.\n  !\n  ! @example\n  !\n  !     <ul>\n  !         {{#each item}}\n  !             <li>{{.}}</li>\n  !         {{/each}}\n  !     </ul>\n  !\n  ! @tag\n  !--}}'
            }),
            __coverageWrap(324,{ 'type': 'Code', 'body': '\n\n' }),
            __coverageWrap(331,{
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n',
                'tags': __coverageWrap(330,[
                    __coverageWrap(325,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' }),
                    __coverageWrap(326,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' }),
                    __coverageWrap(327,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' }),
                    __coverageWrap(328,{ 'tag': 'example', 'description': '\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n' }),
                    __coverageWrap(329,{ 'tag': 'tag' })
                ]),
                'raw': '{{!---\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n@tag\n--}}'
            }),
            __coverageWrap(332,{ 'type': 'Code', 'body': '\n\n' }),
            __coverageWrap(339,{
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>{{samples}}</code>\n\n',
                'tags': __coverageWrap(338,[
                    __coverageWrap(333,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' }),
                    __coverageWrap(334,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' }),
                    __coverageWrap(335,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' }),
                    __coverageWrap(336,{ 'tag': 'example', 'description': '\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n' }),
                    __coverageWrap(337,{ 'tag': 'tag' })
                ]),
                'raw': '{{!---\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        <code>{{samples}}</code>\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        <ul>\n            {{#each item}}\n                <li>{{.}}</li>\n            {{/each}}\n        </ul>\n\n    @tag\n--}}'
            }),
            __coverageWrap(340,{ 'type': 'Code', 'body': '\n\n' }),
            __coverageWrap(347,{
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n',
                'tags': __coverageWrap(346,[
                    __coverageWrap(341,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' }),
                    __coverageWrap(342,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' }),
                    __coverageWrap(343,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' }),
                    __coverageWrap(344,{ 'tag': 'example', 'description': '\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n' }),
                    __coverageWrap(345,{ 'tag': 'tag', 'description': '\n' })
                ]),
                'raw': '    {{!---\n      ! # Title\n      !\n      ! Long description that spans multiple\n      ! lines and even has other markdown\n      ! type things.\n      !\n      ! Like more paragraphs.\n      !\n      ! * Like\n      ! * Lists\n      !\n      !     <code>samples</code>\n      !\n      ! @arg {Type} name Description.\n      ! @arg {Type} name Description that is really long\n      !   and wraps to other lines.\n      ! @arg {Type} name Description that is really long\n      !   and wraps to other lines.\n      !\n      !   And has line breaks, etc.\n      !\n      ! @example\n      !\n      !     <ul>\n      !         {{#each item}}\n      !             <li>{{.}}</li>\n      !         {{/each}}\n      !     </ul>\n      !\n      ! @tag\n      !--}}'
            }),
            __coverageWrap(348,{ 'type': 'Code', 'body': '\n\n' }),
            __coverageWrap(355,{
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n',
                'tags': __coverageWrap(354,[
                    __coverageWrap(349,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' }),
                    __coverageWrap(350,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' }),
                    __coverageWrap(351,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' }),
                    __coverageWrap(352,{ 'tag': 'example', 'description': '\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n' }),
                    __coverageWrap(353,{ 'tag': 'tag' })
                ]),
                'raw': '    {{!---\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        <code>samples</code>\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        <ul>\n            {{#each item}}\n                <li>{{.}}</li>\n            {{/each}}\n        </ul>\n\n    @tag\n    --}}'
            }),
            __coverageWrap(356,{ 'type': 'Code', 'body': '\n\n' }),
            __coverageWrap(363,{
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>{{samples}}</code>\n\n',
                'tags': __coverageWrap(362,[
                    __coverageWrap(357,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' }),
                    __coverageWrap(358,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' }),
                    __coverageWrap(359,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' }),
                    __coverageWrap(360,{ 'tag': 'example', 'description': '\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n' }),
                    __coverageWrap(361,{ 'tag': 'tag' })
                ]),
                'raw': '    {{!---\n        # Title\n\n        Long description that spans multiple\n        lines and even has other markdown\n        type things.\n\n        Like more paragraphs.\n\n        * Like\n        * Lists\n\n            <code>{{samples}}</code>\n\n        @arg {Type} name Description.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n\n          And has line breaks, etc.\n\n        @example\n\n            <ul>\n                {{#each item}}\n                    <li>{{.}}</li>\n                {{/each}}\n            </ul>\n\n        @tag\n    --}}'
            }),
            __coverageWrap(364,{ 'type': 'Code', 'body': '\n\n{{! ignore }}\n{{!-- ignore --}}\n{{!\n  ! ignore\n  !}}\n<!-- {{!--- ignore -->\n<!-- ignore }} -->\n' })
        ])));};
    })));};

    { __coverageWrap(397);__coverageWrap(396,it('should use custom perl grammar', __coverageWrap(395,function() {
        { __coverageWrap(372);var custom = __coverageWrap(371,"use strict;\nuse warnings;\n\nprint \"hello world\";\n\n=pod\n\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    my $code = \"samples\";\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    my $foo = \"bar\";\n\n@tag\n\n=cut\n");};

        { __coverageWrap(376);var perlParser = __coverageWrap(375,__coverageWrap(374,new Toga(__coverageWrap(373,{
            blockSplit: /(^=pod[\s\S]*?\n=cut$)/m,
            blockParse: /^=pod([\s\S]*?)\n=cut$/m,
            named: /^(arg(gument)?|data|prop(erty)?)$/
        }))));};

        { __coverageWrap(380);var tokens = __coverageWrap(379,__coverageWrap(378,perlParser.parse(custom, __coverageWrap(377,{
            raw: true
        }))));};

        { __coverageWrap(394);__coverageWrap(393,__coverageWrap(382,__coverageWrap(381,expect(tokens)).to).eql(__coverageWrap(392,[
            __coverageWrap(383,{ 'type': 'Code', 'body': 'use strict;\nuse warnings;\n\nprint "hello world";\n\n' }),
            __coverageWrap(390,{
                'type': 'DocBlock',
                'description': '\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    my $code = "samples";\n\n',
                'tags': __coverageWrap(389,[
                    __coverageWrap(384,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' }),
                    __coverageWrap(385,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' }),
                    __coverageWrap(386,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' }),
                    __coverageWrap(387,{ 'tag': 'example', 'description': '\n\n    my $foo = "bar";\n\n' }),
                    __coverageWrap(388,{ 'tag': 'tag' })
                ]),
                'raw': '=pod\n\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    my $code = "samples";\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    my $foo = "bar";\n\n@tag\n\n=cut'
            }),
            __coverageWrap(391,{ 'type': 'Code', 'body': '\n' })
        ])));};
    })));};
})));};

},{"../../lib/toga":1,"expect.js":5,"fs":2}]},{},[6])