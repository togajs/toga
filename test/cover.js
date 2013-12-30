(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
console.log("COVERAGE " + "\"/Users/smoeller/Repos/github/shannonmoeller/toga/lib/toga.js\"" + " " + "[[0,13],[28,45],[28,45],[15,46],[92,97],[74,98],[149,155],[126,156],[212,234],[184,235],[306,888],[306,888],[291,889],[1435,1439],[1435,1455],[1433,1456],[1475,1492],[1475,1505],[1522,1543],[1547,1559],[1547,1572],[1522,1572],[1584,1599],[1584,1600],[1609,1621],[1609,1622],[1634,1638],[1647,1651],[1647,1657],[1663,1667],[1634,1668],[1634,1669],[1674,1678],[1692,1696],[1692,1707],[1713,1717],[1674,1718],[1674,1719],[1724,1728],[1741,1745],[1741,1755],[1761,1765],[1724,1766],[1724,1767],[1772,1776],[1789,1793],[1789,1803],[1809,1813],[1772,1814],[1772,1815],[1820,1824],[1836,1840],[1836,1849],[1855,1859],[1820,1860],[1820,1861],[1867,1871],[1867,1891],[1867,1892],[1967,1981],[2019,2023],[2041,2043],[2019,2063],[2019,2064],[2077,2081],[1967,2084],[1967,2085],[2159,2173],[2232,2236],[2232,2244],[2211,2256],[2270,2274],[2211,2286],[2159,2289],[2159,2290],[2369,2383],[2423,2427],[2423,2435],[2423,2446],[2423,2458],[2477,2481],[2477,2498],[2518,2522],[2518,2539],[2369,2542],[2369,2543],[2621,2635],[2677,2725],[2621,2728],[2621,2729],[2807,2821],[2868,2872],[2868,2893],[2868,2893],[2856,2894],[2922,2926],[2922,2934],[2910,2944],[2910,2944],[2899,2945],[2968,2980],[2968,2980],[2950,2981],[3075,3079],[3066,3089],[2994,3115],[2807,3118],[2807,3119],[3199,3213],[3266,3270],[3266,3278],[3266,3278],[3252,3279],[3301,3319],[3301,3319],[3284,3320],[3338,3352],[3338,3352],[3325,3353],[3388,3427],[3388,3428],[3433,3481],[3433,3482],[3512,3527],[3532,3550],[3568,3592],[3596,3598],[3568,3598],[3567,3606],[3567,3606],[3555,3607],[3620,3629],[3655,3684],[3688,3690],[3655,3690],[3641,3698],[3641,3699],[3725,3744],[3748,3750],[3725,3750],[3708,3758],[3708,3759],[3791,3817],[3791,3827],[3773,3828],[3890,3923],[3890,3924],[3199,4033],[3199,4034],[4111,4125],[4183,4187],[4183,4195],[4171,4205],[4171,4205],[4159,4206],[4220,4228],[4220,4228],[4211,4229],[4245,4253],[4245,4253],[4234,4254],[4270,4278],[4270,4278],[4259,4279],[4302,4310],[4302,4316],[4302,4316],[4284,4317],[4332,4334],[4332,4334],[4322,4335],[4354,4358],[4354,4366],[4354,4372],[4354,4381],[4353,4381],[4345,4381],[4407,4417],[4393,4431],[4393,4432],[4441,4457],[4441,4458],[4488,4500],[4488,4501],[4533,4548],[4533,4549],[4581,4596],[4581,4597],[4636,4665],[4636,4666],[4111,4691],[4111,4692],[4694,4715],[4694,4716]]");var __coverage = {"0":[0,13],"1":[28,45],"2":[28,45],"3":[15,46],"4":[92,97],"5":[74,98],"6":[149,155],"7":[126,156],"8":[212,234],"9":[184,235],"10":[306,888],"11":[306,888],"12":[291,889],"13":[1435,1439],"14":[1435,1455],"15":[1433,1456],"16":[1475,1492],"17":[1475,1505],"18":[1522,1543],"19":[1547,1559],"20":[1547,1572],"21":[1522,1572],"22":[1584,1599],"23":[1584,1600],"24":[1609,1621],"25":[1609,1622],"26":[1634,1638],"27":[1647,1651],"28":[1647,1657],"29":[1663,1667],"30":[1634,1668],"31":[1634,1669],"32":[1674,1678],"33":[1692,1696],"34":[1692,1707],"35":[1713,1717],"36":[1674,1718],"37":[1674,1719],"38":[1724,1728],"39":[1741,1745],"40":[1741,1755],"41":[1761,1765],"42":[1724,1766],"43":[1724,1767],"44":[1772,1776],"45":[1789,1793],"46":[1789,1803],"47":[1809,1813],"48":[1772,1814],"49":[1772,1815],"50":[1820,1824],"51":[1836,1840],"52":[1836,1849],"53":[1855,1859],"54":[1820,1860],"55":[1820,1861],"56":[1867,1871],"57":[1867,1891],"58":[1867,1892],"59":[1967,1981],"60":[2019,2023],"61":[2041,2043],"62":[2019,2063],"63":[2019,2064],"64":[2077,2081],"65":[1967,2084],"66":[1967,2085],"67":[2159,2173],"68":[2232,2236],"69":[2232,2244],"70":[2211,2256],"71":[2270,2274],"72":[2211,2286],"73":[2159,2289],"74":[2159,2290],"75":[2369,2383],"76":[2423,2427],"77":[2423,2435],"78":[2423,2446],"79":[2423,2458],"80":[2477,2481],"81":[2477,2498],"82":[2518,2522],"83":[2518,2539],"84":[2369,2542],"85":[2369,2543],"86":[2621,2635],"87":[2677,2725],"88":[2621,2728],"89":[2621,2729],"90":[2807,2821],"91":[2868,2872],"92":[2868,2893],"93":[2868,2893],"94":[2856,2894],"95":[2922,2926],"96":[2922,2934],"97":[2910,2944],"98":[2910,2944],"99":[2899,2945],"100":[2968,2980],"101":[2968,2980],"102":[2950,2981],"103":[3075,3079],"104":[3066,3089],"105":[2994,3115],"106":[2807,3118],"107":[2807,3119],"108":[3199,3213],"109":[3266,3270],"110":[3266,3278],"111":[3266,3278],"112":[3252,3279],"113":[3301,3319],"114":[3301,3319],"115":[3284,3320],"116":[3338,3352],"117":[3338,3352],"118":[3325,3353],"119":[3388,3427],"120":[3388,3428],"121":[3433,3481],"122":[3433,3482],"123":[3512,3527],"124":[3532,3550],"125":[3568,3592],"126":[3596,3598],"127":[3568,3598],"128":[3567,3606],"129":[3567,3606],"130":[3555,3607],"131":[3620,3629],"132":[3655,3684],"133":[3688,3690],"134":[3655,3690],"135":[3641,3698],"136":[3641,3699],"137":[3725,3744],"138":[3748,3750],"139":[3725,3750],"140":[3708,3758],"141":[3708,3759],"142":[3791,3817],"143":[3791,3827],"144":[3773,3828],"145":[3890,3923],"146":[3890,3924],"147":[3199,4033],"148":[3199,4034],"149":[4111,4125],"150":[4183,4187],"151":[4183,4195],"152":[4171,4205],"153":[4171,4205],"154":[4159,4206],"155":[4220,4228],"156":[4220,4228],"157":[4211,4229],"158":[4245,4253],"159":[4245,4253],"160":[4234,4254],"161":[4270,4278],"162":[4270,4278],"163":[4259,4279],"164":[4302,4310],"165":[4302,4316],"166":[4302,4316],"167":[4284,4317],"168":[4332,4334],"169":[4332,4334],"170":[4322,4335],"171":[4354,4358],"172":[4354,4366],"173":[4354,4372],"174":[4354,4381],"175":[4353,4381],"176":[4345,4381],"177":[4407,4417],"178":[4393,4431],"179":[4393,4432],"180":[4441,4457],"181":[4441,4458],"182":[4488,4500],"183":[4488,4501],"184":[4533,4548],"185":[4533,4549],"186":[4581,4596],"187":[4581,4597],"188":[4636,4665],"189":[4636,4666],"190":[4111,4691],"191":[4111,4692],"192":[4694,4715],"193":[4694,4716]};var __coverageWrap = function (index, value) {if (__coverage[index]) console.log("COVERED " + "\"/Users/smoeller/Repos/github/shannonmoeller/toga/lib/toga.js\"" + " " + index);delete __coverage[index];return value};
{ __coverageWrap(0);'use strict';};

{ __coverageWrap(3);var copier = __coverageWrap(2,__coverageWrap(1,require('copier')));};

/**
 * @type {RegExp}
 */
{ __coverageWrap(5);var linePattern = __coverageWrap(4,/^/gm);};

/**
 * @type {RegExp}
 */
{ __coverageWrap(7);var emptyLinePattern = __coverageWrap(6,/^$/gm);};

/**
 * @type {RegExp}
 */
{ __coverageWrap(9);var edgeEmptyLinesPattern = __coverageWrap(8,/^[\t ]*\n|\n[\t ]*$/g);};

/**
 * Default C-style grammar.
 * @type {Object}
 */
{ __coverageWrap(12);var defaults = __coverageWrap(11,__coverageWrap(10,{
    // Matches block delimiters
    blockSplit: /(^[\t ]*\/\*\*(?!\/)[\s\S]*?\s*\*\/)/m,

    // Matches block content
    blockParse: /^[\t ]*\/\*\*(?!\/)([\s\S]*?)\s*\*\//m,

    // Matches indent characters
    indent: /^[\t \*]/gm,

    // Matches tag delimiters
    tagSplit: /^[\t ]*@/m,

    // Matches tag content `tag {Type} [name] - Description.`
    tagParse: /^(\w+)[\t ]*(\{[^\}]+\})?[\t ]*(\[[^\]]*\]\*?|\S*)?[\t -]*([\s\S]+)?$/m,

    // Matches tags that should include a name property
    named: /^(arg(ument)?|augments|class|extends|method|param|prop(erty)?)$/
}));};

/**
 * # Toga
 *
 * Yet another doc-block parser. Based on a customizable regular-expression
 * grammar. Defaults to C-style comment blocks, so it supports JavaScript, C,
 * PHP, Java, and even CSS right out of the box.
 *
 * Generates a single array of tokens with tags per given blob of text. Tags are
 * parsed greedily. If it looks like a tag, it's a tag. How you handle them is
 * completely up to you.
 *
 * @class Toga
 * @param {String} [block]
 * @param {Object} [options]
 * @constructor
 */
function Toga(block, options) {
    if (__coverageWrap(15,!(__coverageWrap(14,__coverageWrap(13,this) instanceof Toga)))) {
        return __coverageWrap(17,__coverageWrap(16,new Toga(options)).parse(block));
    }

    if (__coverageWrap(21,__coverageWrap(18,options === undefined) && __coverageWrap(20,__coverageWrap(19,typeof block) === 'object'))) {
        { __coverageWrap(23);__coverageWrap(22,options = block);};
        { __coverageWrap(25);__coverageWrap(24,block = null);};
    }

    { __coverageWrap(31);__coverageWrap(30,__coverageWrap(26,this).parse = __coverageWrap(28,__coverageWrap(27,this).parse).bind(__coverageWrap(29,this)));};
    { __coverageWrap(37);__coverageWrap(36,__coverageWrap(32,this).parseBlock = __coverageWrap(34,__coverageWrap(33,this).parseBlock).bind(__coverageWrap(35,this)));};
    { __coverageWrap(43);__coverageWrap(42,__coverageWrap(38,this).parseCode = __coverageWrap(40,__coverageWrap(39,this).parseCode).bind(__coverageWrap(41,this)));};
    { __coverageWrap(49);__coverageWrap(48,__coverageWrap(44,this).parseDocs = __coverageWrap(46,__coverageWrap(45,this).parseDocs).bind(__coverageWrap(47,this)));};
    { __coverageWrap(55);__coverageWrap(54,__coverageWrap(50,this).parseTag = __coverageWrap(52,__coverageWrap(51,this).parseTag).bind(__coverageWrap(53,this)));};

    { __coverageWrap(58);__coverageWrap(57,__coverageWrap(56,this).setOptions(options));};
}

/**
 * @method setOptions
 * @param {Object} options
 * @chainable
 */
{ __coverageWrap(66);__coverageWrap(65,__coverageWrap(59,Toga.prototype).setOptions = function(options) {
    { __coverageWrap(63);__coverageWrap(62,__coverageWrap(60,this).options = copier(__coverageWrap(61,{}), options, defaults));};

    return __coverageWrap(64,this);
});};

/**
 * @method parse
 * @param {String} [block]
 * @return {String}
 */
{ __coverageWrap(74);__coverageWrap(73,__coverageWrap(67,Toga.prototype).parse = function(block) {
    return __coverageWrap(72,__coverageWrap(70,block
        .split(__coverageWrap(69,__coverageWrap(68,this).options).blockSplit))
        .map(__coverageWrap(71,this).parseBlock));
});};

/**
 * @method parseBlock
 * @param {String} [block]
 * @return {Object}
 */
{ __coverageWrap(85);__coverageWrap(84,__coverageWrap(75,Toga.prototype).parseBlock = function(block) {
    if (__coverageWrap(79,__coverageWrap(78,__coverageWrap(77,__coverageWrap(76,this).options).blockParse).test(block))) {
        return __coverageWrap(81,__coverageWrap(80,this).parseDocs(block));
    }

    return __coverageWrap(83,__coverageWrap(82,this).parseCode(block));
});};

/**
 * @method parseCode
 * @param {String} [block]
 * @return {Object}
 */
{ __coverageWrap(89);__coverageWrap(88,__coverageWrap(86,Toga.prototype).parseCode = function(block) {
    return __coverageWrap(87,{
        type: 'code',
        raw: block
    });
});};

/**
 * @method parseDocs
 * @param {String} [block]
 * @return {Object}
 */
{ __coverageWrap(107);__coverageWrap(106,__coverageWrap(90,Toga.prototype).parseDocs = function(block) {
    { __coverageWrap(94);var clean = __coverageWrap(93,__coverageWrap(92,__coverageWrap(91,this).normalizeDocs(block)));};
    { __coverageWrap(99);var tags = __coverageWrap(98,__coverageWrap(97,clean.split(__coverageWrap(96,__coverageWrap(95,this).options).tagSplit)));};
    { __coverageWrap(102);var description = __coverageWrap(101,__coverageWrap(100,tags.shift()));};

    return __coverageWrap(105,{
        type: 'docs',
        description: description,
        tags: __coverageWrap(104,tags.map(__coverageWrap(103,this).parseTag)),
        raw: block
    });
});};

/**
 * @method normalizeDocs
 * @param {String} block
 * @return {String}
 */
{ __coverageWrap(148);__coverageWrap(147,__coverageWrap(108,Toga.prototype).normalizeDocs = function(block) {
    { __coverageWrap(112);var options = __coverageWrap(111,__coverageWrap(110,__coverageWrap(109,this).options));};
    { __coverageWrap(115);var blockParse = __coverageWrap(114,__coverageWrap(113,options.blockParse));};
    { __coverageWrap(118);var indent = __coverageWrap(117,__coverageWrap(116,options.indent));};

    // Trim comment wrappers
    { __coverageWrap(120);__coverageWrap(119,block = block.replace(blockParse, '$1'));};
    { __coverageWrap(122);__coverageWrap(121,block = block.replace(edgeEmptyLinesPattern, ''));};

    // Unindent content
    { __coverageWrap(123);var emptyLines;};
    { __coverageWrap(124);var indentedLines;};
    { __coverageWrap(130);var lines = __coverageWrap(129,__coverageWrap(128,(__coverageWrap(127,__coverageWrap(125,block.match(linePattern)) || __coverageWrap(126,[]))).length));};

    while (__coverageWrap(131,lines > 0)) {
        { __coverageWrap(136);__coverageWrap(135,emptyLines = (__coverageWrap(134,__coverageWrap(132,block.match(emptyLinePattern)) || __coverageWrap(133,[]))).length);};
        { __coverageWrap(141);__coverageWrap(140,indentedLines = (__coverageWrap(139,__coverageWrap(137,block.match(indent)) || __coverageWrap(138,[]))).length);};

        if (__coverageWrap(144,indentedLines && (__coverageWrap(143,__coverageWrap(142,emptyLines + indentedLines) === lines)))) {
            // Strip leading indent character
            { __coverageWrap(146);__coverageWrap(145,block = block.replace(indent, ''));};
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
{ __coverageWrap(191);__coverageWrap(190,__coverageWrap(149,Toga.prototype).parseTag = function(block) {
    { __coverageWrap(154);var parts = __coverageWrap(153,__coverageWrap(152,block.match(__coverageWrap(151,__coverageWrap(150,this).options).tagParse)));};
    { __coverageWrap(157);var id = __coverageWrap(156,__coverageWrap(155,parts[1]));};
    { __coverageWrap(160);var type = __coverageWrap(159,__coverageWrap(158,parts[2]));};
    { __coverageWrap(163);var name = __coverageWrap(162,__coverageWrap(161,parts[3]));};
    { __coverageWrap(167);var description = __coverageWrap(166,__coverageWrap(165,__coverageWrap(164,parts[4]) || ''));};
    { __coverageWrap(170);var tag = __coverageWrap(169,__coverageWrap(168,{}));};

    if (__coverageWrap(176,name && __coverageWrap(175,!__coverageWrap(174,__coverageWrap(173,__coverageWrap(172,__coverageWrap(171,this).options).named).test(id))))) {
        { __coverageWrap(179);__coverageWrap(178,description = __coverageWrap(177,name + ' ') + description);};
        { __coverageWrap(181);__coverageWrap(180,name = undefined);};
    }

    if (id) {
        { __coverageWrap(183);__coverageWrap(182,tag.tag = id);};
    }

    if (type) {
        { __coverageWrap(185);__coverageWrap(184,tag.type = type);};
    }

    if (name) {
        { __coverageWrap(187);__coverageWrap(186,tag.name = name);};
    }

    if (description) {
        { __coverageWrap(189);__coverageWrap(188,tag.description = description);};
    }

    return tag;
});};

{ __coverageWrap(193);__coverageWrap(192,module.exports = Toga);};

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
console.log("COVERAGE " + "\"/Users/smoeller/Repos/github/shannonmoeller/toga/test/specs/toga-spec.js\"" + " " + "[[25,38],[53,73],[53,73],[40,74],[84,97],[84,97],[75,98],[110,135],[110,135],[99,136],[406,638],[393,639],[655,667],[648,668],[648,669],[372,675],[338,676],[338,677],[748,796],[736,797],[907,918],[900,919],[900,922],[941,976],[1035,1037],[990,1055],[1069,1100],[1159,1161],[1114,1180],[1194,1225],[1284,1286],[1239,1311],[1325,1356],[1415,1417],[1370,1439],[1453,1484],[927,1494],[900,1495],[900,1496],[715,1502],[683,1503],[683,1504],[1574,1644],[1563,1645],[1753,1763],[1746,1764],[1746,1767],[1786,1815],[1885,1887],[1829,1918],[1932,1963],[2033,2035],[1977,2072],[2086,2117],[2187,2189],[2131,2222],[2236,2267],[1772,2277],[1746,2278],[1746,2279],[1542,2285],[1510,2286],[1510,2287],[2348,2397],[2338,2398],[2504,2513],[2497,2514],[2497,2517],[2536,2565],[2626,2642],[2624,2644],[2579,2668],[2682,2713],[2774,2790],[2772,2792],[2727,2822],[2836,2867],[2928,2944],[2926,2946],[2881,2972],[2986,3017],[2522,3027],[2497,3028],[2497,3029],[2317,3035],[2293,3036],[2293,3037],[3098,3482],[3088,3483],[3589,3598],[3582,3599],[3582,3602],[3621,3650],[3711,3794],[3709,3796],[3664,3849],[3863,3894],[3955,4038],[3953,4040],[3908,4091],[4105,4136],[4197,4278],[4195,4280],[4150,4331],[4345,4376],[4437,4518],[4435,4520],[4390,4569],[4583,4614],[4675,4727],[4673,4729],[4628,4767],[4781,4812],[4873,4923],[4871,4925],[4826,4961],[4975,5006],[5067,5132],[5065,5134],[5020,5180],[5194,5225],[5286,5351],[5284,5353],[5239,5397],[5411,5442],[5503,5566],[5501,5568],[5456,5612],[5626,5657],[5718,5781],[5716,5783],[5671,5825],[5839,5870],[5931,5965],[5929,5967],[5884,5998],[6012,6043],[6104,6136],[6102,6138],[6057,6167],[6181,6212],[3607,6222],[3582,6223],[3582,6224],[3067,6230],[3043,6231],[3043,6232],[6295,6454],[6284,6455],[6563,6573],[6556,6574],[6556,6577],[6596,6625],[6686,6720],[6684,6722],[6639,6753],[6767,6798],[6859,6902],[6857,6904],[6812,6944],[6958,6989],[7050,7110],[7048,7112],[7003,7169],[7183,7214],[7275,7362],[7273,7364],[7228,7437],[7451,7482],[6582,7492],[6556,7493],[6556,7494],[6263,7500],[6238,7501],[6238,7502],[7565,7664],[7554,7665],[7773,7783],[7766,7784],[7766,7787],[7806,7835],[7896,7928],[7894,7930],[7849,7959],[7973,8004],[8065,8099],[8063,8101],[8018,8132],[8146,8177],[8238,8275],[8236,8277],[8191,8311],[8325,8356],[8417,8465],[8415,8467],[8370,8512],[8526,8557],[7792,8567],[7766,8568],[7766,8569],[7533,8575],[7508,8576],[7508,8577],[8647,11878],[8634,11879],[11991,12003],[11984,12004],[11984,12007],[12026,12099],[12403,12602],[12624,12871],[12893,13173],[13195,13332],[13354,13414],[12381,13432],[12113,13991],[14005,14082],[14386,14585],[14607,14854],[14876,15156],[15178,15315],[15337,15397],[14364,15415],[14096,15905],[15919,15996],[16300,16499],[16521,16768],[16790,17070],[17092,17229],[17251,17311],[16278,17329],[16010,17887],[17901,17978],[18282,18481],[18503,18750],[18772,19052],[19074,19211],[19233,19293],[18260,19311],[17992,19982],[19996,20073],[20377,20576],[20598,20845],[20867,21147],[21169,21306],[21328,21388],[20355,21406],[20087,21972],[21986,22063],[22367,22566],[22588,22835],[22857,23137],[23159,23296],[23318,23378],[22345,23396],[22077,24029],[24043,24118],[12012,24128],[11984,24129],[11984,24130],[8613,24136],[8583,24137],[8583,24138],[320,24140],[303,24141],[303,24142]]");var __coverage = {"0":[25,38],"1":[53,73],"2":[53,73],"3":[40,74],"4":[84,97],"5":[84,97],"6":[75,98],"7":[110,135],"8":[110,135],"9":[99,136],"10":[406,638],"11":[393,639],"12":[655,667],"13":[648,668],"14":[648,669],"15":[372,675],"16":[338,676],"17":[338,677],"18":[748,796],"19":[736,797],"20":[907,918],"21":[900,919],"22":[900,922],"23":[941,976],"24":[1035,1037],"25":[990,1055],"26":[1069,1100],"27":[1159,1161],"28":[1114,1180],"29":[1194,1225],"30":[1284,1286],"31":[1239,1311],"32":[1325,1356],"33":[1415,1417],"34":[1370,1439],"35":[1453,1484],"36":[927,1494],"37":[900,1495],"38":[900,1496],"39":[715,1502],"40":[683,1503],"41":[683,1504],"42":[1574,1644],"43":[1563,1645],"44":[1753,1763],"45":[1746,1764],"46":[1746,1767],"47":[1786,1815],"48":[1885,1887],"49":[1829,1918],"50":[1932,1963],"51":[2033,2035],"52":[1977,2072],"53":[2086,2117],"54":[2187,2189],"55":[2131,2222],"56":[2236,2267],"57":[1772,2277],"58":[1746,2278],"59":[1746,2279],"60":[1542,2285],"61":[1510,2286],"62":[1510,2287],"63":[2348,2397],"64":[2338,2398],"65":[2504,2513],"66":[2497,2514],"67":[2497,2517],"68":[2536,2565],"69":[2626,2642],"70":[2624,2644],"71":[2579,2668],"72":[2682,2713],"73":[2774,2790],"74":[2772,2792],"75":[2727,2822],"76":[2836,2867],"77":[2928,2944],"78":[2926,2946],"79":[2881,2972],"80":[2986,3017],"81":[2522,3027],"82":[2497,3028],"83":[2497,3029],"84":[2317,3035],"85":[2293,3036],"86":[2293,3037],"87":[3098,3482],"88":[3088,3483],"89":[3589,3598],"90":[3582,3599],"91":[3582,3602],"92":[3621,3650],"93":[3711,3794],"94":[3709,3796],"95":[3664,3849],"96":[3863,3894],"97":[3955,4038],"98":[3953,4040],"99":[3908,4091],"100":[4105,4136],"101":[4197,4278],"102":[4195,4280],"103":[4150,4331],"104":[4345,4376],"105":[4437,4518],"106":[4435,4520],"107":[4390,4569],"108":[4583,4614],"109":[4675,4727],"110":[4673,4729],"111":[4628,4767],"112":[4781,4812],"113":[4873,4923],"114":[4871,4925],"115":[4826,4961],"116":[4975,5006],"117":[5067,5132],"118":[5065,5134],"119":[5020,5180],"120":[5194,5225],"121":[5286,5351],"122":[5284,5353],"123":[5239,5397],"124":[5411,5442],"125":[5503,5566],"126":[5501,5568],"127":[5456,5612],"128":[5626,5657],"129":[5718,5781],"130":[5716,5783],"131":[5671,5825],"132":[5839,5870],"133":[5931,5965],"134":[5929,5967],"135":[5884,5998],"136":[6012,6043],"137":[6104,6136],"138":[6102,6138],"139":[6057,6167],"140":[6181,6212],"141":[3607,6222],"142":[3582,6223],"143":[3582,6224],"144":[3067,6230],"145":[3043,6231],"146":[3043,6232],"147":[6295,6454],"148":[6284,6455],"149":[6563,6573],"150":[6556,6574],"151":[6556,6577],"152":[6596,6625],"153":[6686,6720],"154":[6684,6722],"155":[6639,6753],"156":[6767,6798],"157":[6859,6902],"158":[6857,6904],"159":[6812,6944],"160":[6958,6989],"161":[7050,7110],"162":[7048,7112],"163":[7003,7169],"164":[7183,7214],"165":[7275,7362],"166":[7273,7364],"167":[7228,7437],"168":[7451,7482],"169":[6582,7492],"170":[6556,7493],"171":[6556,7494],"172":[6263,7500],"173":[6238,7501],"174":[6238,7502],"175":[7565,7664],"176":[7554,7665],"177":[7773,7783],"178":[7766,7784],"179":[7766,7787],"180":[7806,7835],"181":[7896,7928],"182":[7894,7930],"183":[7849,7959],"184":[7973,8004],"185":[8065,8099],"186":[8063,8101],"187":[8018,8132],"188":[8146,8177],"189":[8238,8275],"190":[8236,8277],"191":[8191,8311],"192":[8325,8356],"193":[8417,8465],"194":[8415,8467],"195":[8370,8512],"196":[8526,8557],"197":[7792,8567],"198":[7766,8568],"199":[7766,8569],"200":[7533,8575],"201":[7508,8576],"202":[7508,8577],"203":[8647,11878],"204":[8634,11879],"205":[11991,12003],"206":[11984,12004],"207":[11984,12007],"208":[12026,12099],"209":[12403,12602],"210":[12624,12871],"211":[12893,13173],"212":[13195,13332],"213":[13354,13414],"214":[12381,13432],"215":[12113,13991],"216":[14005,14082],"217":[14386,14585],"218":[14607,14854],"219":[14876,15156],"220":[15178,15315],"221":[15337,15397],"222":[14364,15415],"223":[14096,15905],"224":[15919,15996],"225":[16300,16499],"226":[16521,16768],"227":[16790,17070],"228":[17092,17229],"229":[17251,17311],"230":[16278,17329],"231":[16010,17887],"232":[17901,17978],"233":[18282,18481],"234":[18503,18750],"235":[18772,19052],"236":[19074,19211],"237":[19233,19293],"238":[18260,19311],"239":[17992,19982],"240":[19996,20073],"241":[20377,20576],"242":[20598,20845],"243":[20867,21147],"244":[21169,21306],"245":[21328,21388],"246":[20355,21406],"247":[20087,21972],"248":[21986,22063],"249":[22367,22566],"250":[22588,22835],"251":[22857,23137],"252":[23159,23296],"253":[23318,23378],"254":[22345,23396],"255":[22077,24029],"256":[24043,24118],"257":[12012,24128],"258":[11984,24129],"259":[11984,24130],"260":[8613,24136],"261":[8583,24137],"262":[8583,24138],"263":[320,24140],"264":[303,24141],"265":[303,24142]};var __coverageWrap = function (index, value) {if (__coverage[index]) console.log("COVERED " + "\"/Users/smoeller/Repos/github/shannonmoeller/toga/test/specs/toga-spec.js\"" + " " + index);delete __coverage[index];return value};
/*jshint maxlen:false */
{ __coverageWrap(0);'use strict';};

{ __coverageWrap(3);var expect = __coverageWrap(2,__coverageWrap(1,require('expect.js')));};
{ __coverageWrap(6);var fs = __coverageWrap(5,__coverageWrap(4,require('fs')));};
{ __coverageWrap(9);var toga = __coverageWrap(8,__coverageWrap(7,require('../../lib/toga')));};

// var difflet = require('difflet')({
//     indent: 4,
//     comment: true
// });
// var diff = function(a, b) {
//     console.log(difflet.compare(a, b));
// };

{ __coverageWrap(265);__coverageWrap(264,describe('Toga', __coverageWrap(263,function () {
    { __coverageWrap(17);__coverageWrap(16,it('should not parse non-blocks', __coverageWrap(15,function() {
        { __coverageWrap(11);var ignore = __coverageWrap(10,"// ignore\n/* ignore */\n/*! ignore */\n\n//\n// ignore\n//\n/*\n * ignore\n */\n/*!\n * ignore\n */\n\n// /** ignore\nvar ignore = '/** ignore */';\nvar foo = function(/** ignore */) {};\nconsole.log(foo(ignore));\n// ignore */\n");};
        { __coverageWrap(14);__coverageWrap(13,expect(__coverageWrap(12,toga(ignore))));};
    })));};

    { __coverageWrap(41);__coverageWrap(40,it('should parse empty blocks', __coverageWrap(39,function() {
        { __coverageWrap(19);var empty = __coverageWrap(18,"/**/\n/***/\n/** */\n/**\n *\n */\n/**\n\n*/\n");};

        // console.log(JSON.stringify(toga(empty), null, 4));
        // diff(toga(empty), [
        { __coverageWrap(38);__coverageWrap(37,__coverageWrap(22,__coverageWrap(21,expect(__coverageWrap(20,toga(empty)))).to).eql(__coverageWrap(36,[
            __coverageWrap(23,{ 'type': 'code', 'raw': '/**/\n' }),
            __coverageWrap(25,{ 'type': 'docs', 'description': '', 'tags': __coverageWrap(24,[]), 'raw': '/***/' }),
            __coverageWrap(26,{ 'type': 'code', 'raw': '\n' }),
            __coverageWrap(28,{ 'type': 'docs', 'description': '', 'tags': __coverageWrap(27,[]), 'raw': '/** */' }),
            __coverageWrap(29,{ 'type': 'code', 'raw': '\n' }),
            __coverageWrap(31,{ 'type': 'docs', 'description': '', 'tags': __coverageWrap(30,[]), 'raw': '/**\n *\n */' }),
            __coverageWrap(32,{ 'type': 'code', 'raw': '\n' }),
            __coverageWrap(34,{ 'type': 'docs', 'description': '', 'tags': __coverageWrap(33,[]), 'raw': '/**\n\n*/' }),
            __coverageWrap(35,{ 'type': 'code', 'raw': '\n' })
        ])));};
    })));};

    { __coverageWrap(62);__coverageWrap(61,it('should parse descriptions', __coverageWrap(60,function() {
        { __coverageWrap(43);var desc = __coverageWrap(42,"/** description */\n/**\n * description\n */\n/**\ndescription\n*/\n");};

        // console.log(JSON.stringify(toga(desc), null, 4));
        // diff(toga(desc), [
        { __coverageWrap(59);__coverageWrap(58,__coverageWrap(46,__coverageWrap(45,expect(__coverageWrap(44,toga(desc)))).to).eql(__coverageWrap(57,[
            __coverageWrap(47,{ 'type': 'code', 'raw': '' }),
            __coverageWrap(49,{ 'type': 'docs', 'description': 'description', 'tags': __coverageWrap(48,[]), 'raw': '/** description */' }),
            __coverageWrap(50,{ 'type': 'code', 'raw': '\n' }),
            __coverageWrap(52,{ 'type': 'docs', 'description': 'description', 'tags': __coverageWrap(51,[]), 'raw': '/**\n * description\n */' }),
            __coverageWrap(53,{ 'type': 'code', 'raw': '\n' }),
            __coverageWrap(55,{ 'type': 'docs', 'description': 'description', 'tags': __coverageWrap(54,[]), 'raw': '/**\ndescription\n*/' }),
            __coverageWrap(56,{ 'type': 'code', 'raw': '\n' })
        ])));};
    })));};

    { __coverageWrap(86);__coverageWrap(85,it('should parse tags', __coverageWrap(84,function() {
        { __coverageWrap(64);var tag = __coverageWrap(63,"/** @tag */\n/**\n * @tag\n */\n/**\n@tag\n*/\n");};

        // console.log(JSON.stringify(toga(tag), null, 4));
        // diff(toga(tag), [
        { __coverageWrap(83);__coverageWrap(82,__coverageWrap(67,__coverageWrap(66,expect(__coverageWrap(65,toga(tag)))).to).eql(__coverageWrap(81,[
            __coverageWrap(68,{ 'type': 'code', 'raw': '' }),
            __coverageWrap(71,{ 'type': 'docs', 'description': '', 'tags': __coverageWrap(70,[ __coverageWrap(69,{ 'tag': 'tag' }) ]), 'raw': '/** @tag */' }),
            __coverageWrap(72,{ 'type': 'code', 'raw': '\n' }),
            __coverageWrap(75,{ 'type': 'docs', 'description': '', 'tags': __coverageWrap(74,[ __coverageWrap(73,{ 'tag': 'tag' }) ]), 'raw': '/**\n * @tag\n */' }),
            __coverageWrap(76,{ 'type': 'code', 'raw': '\n' }),
            __coverageWrap(79,{ 'type': 'docs', 'description': '', 'tags': __coverageWrap(78,[ __coverageWrap(77,{ 'tag': 'tag' }) ]), 'raw': '/**\n@tag\n*/' }),
            __coverageWrap(80,{ 'type': 'code', 'raw': '\n' })
        ])));};
    })));};

    { __coverageWrap(146);__coverageWrap(145,it('should parse args', __coverageWrap(144,function() {
        { __coverageWrap(88);var arg = __coverageWrap(87,"/** @arg {Type} [name] - Description. */\n/** @arg {Type} [name] Description. */\n/** @arg {Type} name - Description. */\n/** @arg {Type} name Description. */\n/** @arg {Type} [name] */\n/** @arg {Type} name */\n/** @arg [name] - Description. */\n/** @arg [name] Description. */\n/** @arg name - Description. */\n/** @arg name Description. */\n/** @arg [name] */\n/** @arg name */\n");};

        // console.log(JSON.stringify(toga(arg), null, 4));
        // diff(toga(arg), [
        { __coverageWrap(143);__coverageWrap(142,__coverageWrap(91,__coverageWrap(90,expect(__coverageWrap(89,toga(arg)))).to).eql(__coverageWrap(141,[
            __coverageWrap(92,{ 'type': 'code', 'raw': '' }),
            __coverageWrap(95,{ 'type': 'docs', 'description': '', 'tags': __coverageWrap(94,[ __coverageWrap(93,{ 'tag': 'arg', 'type': '{Type}', 'name': '[name]', 'description': 'Description.' }) ]), 'raw': '/** @arg {Type} [name] - Description. */' }),
            __coverageWrap(96,{ 'type': 'code', 'raw': '\n' }),
            __coverageWrap(99,{ 'type': 'docs', 'description': '', 'tags': __coverageWrap(98,[ __coverageWrap(97,{ 'tag': 'arg', 'type': '{Type}', 'name': '[name]', 'description': 'Description.' }) ]), 'raw': '/** @arg {Type} [name] Description. */' }),
            __coverageWrap(100,{ 'type': 'code', 'raw': '\n' }),
            __coverageWrap(103,{ 'type': 'docs', 'description': '', 'tags': __coverageWrap(102,[ __coverageWrap(101,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.' }) ]), 'raw': '/** @arg {Type} name - Description. */' }),
            __coverageWrap(104,{ 'type': 'code', 'raw': '\n' }),
            __coverageWrap(107,{ 'type': 'docs', 'description': '', 'tags': __coverageWrap(106,[ __coverageWrap(105,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.' }) ]), 'raw': '/** @arg {Type} name Description. */' }),
            __coverageWrap(108,{ 'type': 'code', 'raw': '\n' }),
            __coverageWrap(111,{ 'type': 'docs', 'description': '', 'tags': __coverageWrap(110,[ __coverageWrap(109,{ 'tag': 'arg', 'type': '{Type}', 'name': '[name]' }) ]), 'raw': '/** @arg {Type} [name] */' }),
            __coverageWrap(112,{ 'type': 'code', 'raw': '\n' }),
            __coverageWrap(115,{ 'type': 'docs', 'description': '', 'tags': __coverageWrap(114,[ __coverageWrap(113,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name' }) ]), 'raw': '/** @arg {Type} name */' }),
            __coverageWrap(116,{ 'type': 'code', 'raw': '\n' }),
            __coverageWrap(119,{ 'type': 'docs', 'description': '', 'tags': __coverageWrap(118,[ __coverageWrap(117,{ 'tag': 'arg', 'name': '[name]', 'description': 'Description.' }) ]), 'raw': '/** @arg [name] - Description. */' }),
            __coverageWrap(120,{ 'type': 'code', 'raw': '\n' }),
            __coverageWrap(123,{ 'type': 'docs', 'description': '', 'tags': __coverageWrap(122,[ __coverageWrap(121,{ 'tag': 'arg', 'name': '[name]', 'description': 'Description.' }) ]), 'raw': '/** @arg [name] Description. */' }),
            __coverageWrap(124,{ 'type': 'code', 'raw': '\n' }),
            __coverageWrap(127,{ 'type': 'docs', 'description': '', 'tags': __coverageWrap(126,[ __coverageWrap(125,{ 'tag': 'arg', 'name': 'name', 'description': 'Description.' }) ]), 'raw': '/** @arg name - Description. */' }),
            __coverageWrap(128,{ 'type': 'code', 'raw': '\n' }),
            __coverageWrap(131,{ 'type': 'docs', 'description': '', 'tags': __coverageWrap(130,[ __coverageWrap(129,{ 'tag': 'arg', 'name': 'name', 'description': 'Description.' }) ]), 'raw': '/** @arg name Description. */' }),
            __coverageWrap(132,{ 'type': 'code', 'raw': '\n' }),
            __coverageWrap(135,{ 'type': 'docs', 'description': '', 'tags': __coverageWrap(134,[ __coverageWrap(133,{ 'tag': 'arg', 'name': '[name]' }) ]), 'raw': '/** @arg [name] */' }),
            __coverageWrap(136,{ 'type': 'code', 'raw': '\n' }),
            __coverageWrap(139,{ 'type': 'docs', 'description': '', 'tags': __coverageWrap(138,[ __coverageWrap(137,{ 'tag': 'arg', 'name': 'name' }) ]), 'raw': '/** @arg name */' }),
            __coverageWrap(140,{ 'type': 'code', 'raw': '\n' })
        ])));};
    })));};

    { __coverageWrap(174);__coverageWrap(173,it('should parse types', __coverageWrap(172,function() {
        { __coverageWrap(148);var type = __coverageWrap(147,"/** @arg {Type} */\n/** @arg {String|Object} */\n/** @arg {Array.<Object.<String,Number>>} */\n/** @arg {Function(String, ...[Number]): Number} callback */\n");};

        // console.log(JSON.stringify(toga(type), null, 4));
        // diff(toga(type), [
        { __coverageWrap(171);__coverageWrap(170,__coverageWrap(151,__coverageWrap(150,expect(__coverageWrap(149,toga(type)))).to).eql(__coverageWrap(169,[
            __coverageWrap(152,{ 'type': 'code', 'raw': '' }),
            __coverageWrap(155,{ 'type': 'docs', 'description': '', 'tags': __coverageWrap(154,[ __coverageWrap(153,{ 'tag': 'arg', 'type': '{Type}' }) ]), 'raw': '/** @arg {Type} */' }),
            __coverageWrap(156,{ 'type': 'code', 'raw': '\n' }),
            __coverageWrap(159,{ 'type': 'docs', 'description': '', 'tags': __coverageWrap(158,[ __coverageWrap(157,{ 'tag': 'arg', 'type': '{String|Object}' }) ]), 'raw': '/** @arg {String|Object} */' }),
            __coverageWrap(160,{ 'type': 'code', 'raw': '\n' }),
            __coverageWrap(163,{ 'type': 'docs', 'description': '', 'tags': __coverageWrap(162,[ __coverageWrap(161,{ 'tag': 'arg', 'type': '{Array.<Object.<String,Number>>}' }) ]), 'raw': '/** @arg {Array.<Object.<String,Number>>} */' }),
            __coverageWrap(164,{ 'type': 'code', 'raw': '\n' }),
            __coverageWrap(167,{ 'type': 'docs', 'description': '', 'tags': __coverageWrap(166,[ __coverageWrap(165,{ 'tag': 'arg', 'type': '{Function(String, ...[Number]): Number}', 'name': 'callback' }) ]), 'raw': '/** @arg {Function(String, ...[Number]): Number} callback */' }),
            __coverageWrap(168,{ 'type': 'code', 'raw': '\n' })
        ])));};
    })));};

    { __coverageWrap(202);__coverageWrap(201,it('should parse names', __coverageWrap(200,function() {
        { __coverageWrap(176);var name = __coverageWrap(175,"/** @arg name */\n/** @arg [name] */\n/** @arg [name={}] */\n/** @arg [name=\"hello world\"] */\n");};

        // console.log(JSON.stringify(toga(name), null, 4));
        // diff(toga(name), [
        { __coverageWrap(199);__coverageWrap(198,__coverageWrap(179,__coverageWrap(178,expect(__coverageWrap(177,toga(name)))).to).eql(__coverageWrap(197,[
            __coverageWrap(180,{ 'type': 'code', 'raw': '' }),
            __coverageWrap(183,{ 'type': 'docs', 'description': '', 'tags': __coverageWrap(182,[ __coverageWrap(181,{ 'tag': 'arg', 'name': 'name' }) ]), 'raw': '/** @arg name */' }),
            __coverageWrap(184,{ 'type': 'code', 'raw': '\n' }),
            __coverageWrap(187,{ 'type': 'docs', 'description': '', 'tags': __coverageWrap(186,[ __coverageWrap(185,{ 'tag': 'arg', 'name': '[name]' }) ]), 'raw': '/** @arg [name] */' }),
            __coverageWrap(188,{ 'type': 'code', 'raw': '\n' }),
            __coverageWrap(191,{ 'type': 'docs', 'description': '', 'tags': __coverageWrap(190,[ __coverageWrap(189,{ 'tag': 'arg', 'name': '[name={}]' }) ]), 'raw': '/** @arg [name={}] */' }),
            __coverageWrap(192,{ 'type': 'code', 'raw': '\n' }),
            __coverageWrap(195,{ 'type': 'docs', 'description': '', 'tags': __coverageWrap(194,[ __coverageWrap(193,{ 'tag': 'arg', 'name': '[name="hello world"]' }) ]), 'raw': '/** @arg [name="hello world"] */' }),
            __coverageWrap(196,{ 'type': 'code', 'raw': '\n' })
        ])));};
    })));};

    { __coverageWrap(262);__coverageWrap(261,it('should handle indention', __coverageWrap(260,function() {
        { __coverageWrap(204);var indent = __coverageWrap(203,"/**\n * # Title\n *\n * Long description that spans multiple\n * lines and even has other markdown\n * type things.\n *\n * Like more paragraphs.\n *\n * * Like\n * * Lists\n *\n *     var code = 'samples';\n *\n * @arg {Type} name Description.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n *\n *   And has line breaks, etc.\n *\n * @example\n *\n *     var foo = 'bar';\n *\n * @tag\n */\n\n/**\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = 'samples';\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    var foo = 'bar';\n\n@tag\n */\n\n/**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = 'samples';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = 'bar';\n\n    @tag\n */\n\n    /**\n     * # Title\n     *\n     * Long description that spans multiple\n     * lines and even has other markdown\n     * type things.\n     *\n     * Like more paragraphs.\n     *\n     * * Like\n     * * Lists\n     *\n     *     var code = 'samples';\n     *\n     * @arg {Type} name Description.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     *\n     *   And has line breaks, etc.\n     *\n     * @example\n     *\n     *     var foo = 'bar';\n     *\n     * @tag\n     */\n\n    /**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = 'samples';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = 'bar';\n\n    @tag\n     */\n\n    /**\n        # Title\n\n        Long description that spans multiple\n        lines and even has other markdown\n        type things.\n\n        Like more paragraphs.\n\n        * Like\n        * Lists\n\n            var code = 'samples';\n\n        @arg {Type} name Description.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n\n          And has line breaks, etc.\n\n        @example\n\n            var foo = 'bar';\n\n        @tag\n    */\n");};

        // console.log(JSON.stringify(toga(indent), null, 4));
        // diff(toga(indent), [
        { __coverageWrap(259);__coverageWrap(258,__coverageWrap(207,__coverageWrap(206,expect(__coverageWrap(205,toga(indent)))).to).eql(__coverageWrap(257,[
            __coverageWrap(208,{
                'type': 'code',
                'raw': ''
            }),
            __coverageWrap(215,{
                'type': 'docs',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': __coverageWrap(214,[
                    __coverageWrap(209,{
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description.\n'
                    }),
                    __coverageWrap(210,{
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description that is really long\n  and wraps to other lines.\n'
                    }),
                    __coverageWrap(211,{
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n'
                    }),
                    __coverageWrap(212,{
                        'tag': 'example',
                        'description': '\n\n    var foo = \'bar\';\n\n'
                    }),
                    __coverageWrap(213,{
                        'tag': 'tag'
                    })
                ]),
                'raw': '/**\n * # Title\n *\n * Long description that spans multiple\n * lines and even has other markdown\n * type things.\n *\n * Like more paragraphs.\n *\n * * Like\n * * Lists\n *\n *     var code = \'samples\';\n *\n * @arg {Type} name Description.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n *\n *   And has line breaks, etc.\n *\n * @example\n *\n *     var foo = \'bar\';\n *\n * @tag\n */'
            }),
            __coverageWrap(216,{
                'type': 'code',
                'raw': '\n\n'
            }),
            __coverageWrap(223,{
                'type': 'docs',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': __coverageWrap(222,[
                    __coverageWrap(217,{
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description.\n'
                    }),
                    __coverageWrap(218,{
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description that is really long\n  and wraps to other lines.\n'
                    }),
                    __coverageWrap(219,{
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n'
                    }),
                    __coverageWrap(220,{
                        'tag': 'example',
                        'description': '\n\n    var foo = \'bar\';\n\n'
                    }),
                    __coverageWrap(221,{
                        'tag': 'tag'
                    })
                ]),
                'raw': '/**\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    var foo = \'bar\';\n\n@tag\n */'
            }),
            __coverageWrap(224,{
                'type': 'code',
                'raw': '\n\n'
            }),
            __coverageWrap(231,{
                'type': 'docs',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': __coverageWrap(230,[
                    __coverageWrap(225,{
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description.\n'
                    }),
                    __coverageWrap(226,{
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description that is really long\n  and wraps to other lines.\n'
                    }),
                    __coverageWrap(227,{
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n'
                    }),
                    __coverageWrap(228,{
                        'tag': 'example',
                        'description': '\n\n    var foo = \'bar\';\n\n'
                    }),
                    __coverageWrap(229,{
                        'tag': 'tag'
                    })
                ]),
                'raw': '/**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = \'samples\';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = \'bar\';\n\n    @tag\n */'
            }),
            __coverageWrap(232,{
                'type': 'code',
                'raw': '\n\n'
            }),
            __coverageWrap(239,{
                'type': 'docs',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': __coverageWrap(238,[
                    __coverageWrap(233,{
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description.\n'
                    }),
                    __coverageWrap(234,{
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description that is really long\n  and wraps to other lines.\n'
                    }),
                    __coverageWrap(235,{
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n'
                    }),
                    __coverageWrap(236,{
                        'tag': 'example',
                        'description': '\n\n    var foo = \'bar\';\n\n'
                    }),
                    __coverageWrap(237,{
                        'tag': 'tag'
                    })
                ]),
                'raw': '    /**\n     * # Title\n     *\n     * Long description that spans multiple\n     * lines and even has other markdown\n     * type things.\n     *\n     * Like more paragraphs.\n     *\n     * * Like\n     * * Lists\n     *\n     *     var code = \'samples\';\n     *\n     * @arg {Type} name Description.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     *\n     *   And has line breaks, etc.\n     *\n     * @example\n     *\n     *     var foo = \'bar\';\n     *\n     * @tag\n     */'
            }),
            __coverageWrap(240,{
                'type': 'code',
                'raw': '\n\n'
            }),
            __coverageWrap(247,{
                'type': 'docs',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': __coverageWrap(246,[
                    __coverageWrap(241,{
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description.\n'
                    }),
                    __coverageWrap(242,{
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description that is really long\n  and wraps to other lines.\n'
                    }),
                    __coverageWrap(243,{
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n'
                    }),
                    __coverageWrap(244,{
                        'tag': 'example',
                        'description': '\n\n    var foo = \'bar\';\n\n'
                    }),
                    __coverageWrap(245,{
                        'tag': 'tag'
                    })
                ]),
                'raw': '    /**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = \'samples\';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = \'bar\';\n\n    @tag\n     */'
            }),
            __coverageWrap(248,{
                'type': 'code',
                'raw': '\n\n'
            }),
            __coverageWrap(255,{
                'type': 'docs',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': __coverageWrap(254,[
                    __coverageWrap(249,{
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description.\n'
                    }),
                    __coverageWrap(250,{
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description that is really long\n  and wraps to other lines.\n'
                    }),
                    __coverageWrap(251,{
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n'
                    }),
                    __coverageWrap(252,{
                        'tag': 'example',
                        'description': '\n\n    var foo = \'bar\';\n\n'
                    }),
                    __coverageWrap(253,{
                        'tag': 'tag'
                    })
                ]),
                'raw': '    /**\n        # Title\n\n        Long description that spans multiple\n        lines and even has other markdown\n        type things.\n\n        Like more paragraphs.\n\n        * Like\n        * Lists\n\n            var code = \'samples\';\n\n        @arg {Type} name Description.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n\n          And has line breaks, etc.\n\n        @example\n\n            var foo = \'bar\';\n\n        @tag\n    */'
            }),
            __coverageWrap(256,{
                'type': 'code',
                'raw': '\n'
            })
        ])));};
    })));};
})));};

},{"../../lib/toga":1,"expect.js":5,"fs":2}]},{},[6])