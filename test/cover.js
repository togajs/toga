(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
console.log("COVERAGE " + "\"/Users/smoeller/Repos/github/shannonmoeller/toga/lib/toga.js\"" + " " + "[[22,35],[50,67],[50,67],[37,68],[82,99],[82,99],[69,100],[141,803],[141,803],[126,804],[1350,1354],[1350,1370],[1348,1371],[1390,1407],[1390,1420],[1437,1458],[1462,1474],[1462,1487],[1437,1487],[1499,1514],[1499,1515],[1524,1536],[1524,1537],[1549,1553],[1562,1566],[1562,1572],[1578,1582],[1549,1583],[1549,1584],[1589,1593],[1607,1611],[1607,1622],[1628,1632],[1589,1633],[1589,1634],[1639,1643],[1656,1660],[1656,1670],[1676,1680],[1639,1681],[1639,1682],[1687,1691],[1707,1711],[1707,1724],[1730,1734],[1687,1735],[1687,1736],[1741,1745],[1757,1761],[1757,1770],[1776,1780],[1741,1781],[1741,1782],[1788,1792],[1788,1812],[1788,1813],[1888,1902],[1957,1959],[1940,1979],[1940,1980],[2003,2029],[2039,2041],[2003,2042],[2003,2042],[1986,2043],[2063,2087],[2097,2099],[2063,2100],[2063,2100],[2048,2101],[2148,2171],[2148,2186],[2148,2197],[2148,2203],[2107,2209],[2107,2210],[2256,2277],[2256,2283],[2256,2294],[2256,2305],[2216,2324],[2216,2325],[2331,2335],[2331,2353],[2331,2354],[2367,2371],[1888,2374],[1888,2375],[2449,2463],[2522,2526],[2522,2534],[2501,2546],[2560,2564],[2501,2576],[2449,2579],[2449,2580],[2659,2673],[2714,2718],[2714,2726],[2714,2737],[2714,2749],[2713,2749],[2768,2772],[2768,2789],[2809,2813],[2809,2833],[2659,2836],[2659,2837],[2915,2929],[2971,3019],[2915,3022],[2915,3023],[3104,3118],[3168,3172],[3168,3196],[3168,3196],[3156,3197],[3225,3229],[3225,3237],[3213,3247],[3213,3247],[3202,3248],[3271,3283],[3271,3283],[3253,3284],[3345,3364],[3389,3393],[3380,3403],[3297,3429],[3104,3432],[3104,3433],[3516,3530],[3586,3590],[3586,3598],[3586,3598],[3572,3599],[3617,3644],[3617,3647],[3617,3647],[3604,3648],[3687,3699],[3702,3724],[3734,3736],[3702,3737],[3687,3737],[3667,3757],[3667,3757],[3654,3758],[3771,3816],[3771,3845],[3516,3848],[3516,3849],[3926,3940],[3998,4002],[3998,4010],[3986,4020],[3986,4020],[3974,4021],[4036,4044],[4036,4050],[4036,4050],[4026,4051],[4067,4075],[4067,4081],[4067,4081],[4056,4082],[4098,4106],[4098,4112],[4098,4112],[4087,4113],[4136,4144],[4136,4144],[4118,4145],[4156,4160],[4156,4168],[4156,4174],[4156,4184],[4155,4184],[4210,4220],[4196,4234],[4196,4235],[4244,4260],[4244,4261],[4295,4311],[4327,4344],[4360,4377],[4400,4419],[4400,4432],[4447,4458],[4280,4464],[3926,4467],[3926,4468],[4470,4491],[4470,4492]]");var __coverage = {"0":[22,35],"1":[50,67],"2":[50,67],"3":[37,68],"4":[82,99],"5":[82,99],"6":[69,100],"7":[141,803],"8":[141,803],"9":[126,804],"10":[1350,1354],"11":[1350,1370],"12":[1348,1371],"13":[1390,1407],"14":[1390,1420],"15":[1437,1458],"16":[1462,1474],"17":[1462,1487],"18":[1437,1487],"19":[1499,1514],"20":[1499,1515],"21":[1524,1536],"22":[1524,1537],"23":[1549,1553],"24":[1562,1566],"25":[1562,1572],"26":[1578,1582],"27":[1549,1583],"28":[1549,1584],"29":[1589,1593],"30":[1607,1611],"31":[1607,1622],"32":[1628,1632],"33":[1589,1633],"34":[1589,1634],"35":[1639,1643],"36":[1656,1660],"37":[1656,1670],"38":[1676,1680],"39":[1639,1681],"40":[1639,1682],"41":[1687,1691],"42":[1707,1711],"43":[1707,1724],"44":[1730,1734],"45":[1687,1735],"46":[1687,1736],"47":[1741,1745],"48":[1757,1761],"49":[1757,1770],"50":[1776,1780],"51":[1741,1781],"52":[1741,1782],"53":[1788,1792],"54":[1788,1812],"55":[1788,1813],"56":[1888,1902],"57":[1957,1959],"58":[1940,1979],"59":[1940,1980],"60":[2003,2029],"61":[2039,2041],"62":[2003,2042],"63":[2003,2042],"64":[1986,2043],"65":[2063,2087],"66":[2097,2099],"67":[2063,2100],"68":[2063,2100],"69":[2048,2101],"70":[2148,2171],"71":[2148,2186],"72":[2148,2197],"73":[2148,2203],"74":[2107,2209],"75":[2107,2210],"76":[2256,2277],"77":[2256,2283],"78":[2256,2294],"79":[2256,2305],"80":[2216,2324],"81":[2216,2325],"82":[2331,2335],"83":[2331,2353],"84":[2331,2354],"85":[2367,2371],"86":[1888,2374],"87":[1888,2375],"88":[2449,2463],"89":[2522,2526],"90":[2522,2534],"91":[2501,2546],"92":[2560,2564],"93":[2501,2576],"94":[2449,2579],"95":[2449,2580],"96":[2659,2673],"97":[2714,2718],"98":[2714,2726],"99":[2714,2737],"100":[2714,2749],"101":[2713,2749],"102":[2768,2772],"103":[2768,2789],"104":[2809,2813],"105":[2809,2833],"106":[2659,2836],"107":[2659,2837],"108":[2915,2929],"109":[2971,3019],"110":[2915,3022],"111":[2915,3023],"112":[3104,3118],"113":[3168,3172],"114":[3168,3196],"115":[3168,3196],"116":[3156,3197],"117":[3225,3229],"118":[3225,3237],"119":[3213,3247],"120":[3213,3247],"121":[3202,3248],"122":[3271,3283],"123":[3271,3283],"124":[3253,3284],"125":[3345,3364],"126":[3389,3393],"127":[3380,3403],"128":[3297,3429],"129":[3104,3432],"130":[3104,3433],"131":[3516,3530],"132":[3586,3590],"133":[3586,3598],"134":[3586,3598],"135":[3572,3599],"136":[3617,3644],"137":[3617,3647],"138":[3617,3647],"139":[3604,3648],"140":[3687,3699],"141":[3702,3724],"142":[3734,3736],"143":[3702,3737],"144":[3687,3737],"145":[3667,3757],"146":[3667,3757],"147":[3654,3758],"148":[3771,3816],"149":[3771,3845],"150":[3516,3848],"151":[3516,3849],"152":[3926,3940],"153":[3998,4002],"154":[3998,4010],"155":[3986,4020],"156":[3986,4020],"157":[3974,4021],"158":[4036,4044],"159":[4036,4050],"160":[4036,4050],"161":[4026,4051],"162":[4067,4075],"163":[4067,4081],"164":[4067,4081],"165":[4056,4082],"166":[4098,4106],"167":[4098,4112],"168":[4098,4112],"169":[4087,4113],"170":[4136,4144],"171":[4136,4144],"172":[4118,4145],"173":[4156,4160],"174":[4156,4168],"175":[4156,4174],"176":[4156,4184],"177":[4155,4184],"178":[4210,4220],"179":[4196,4234],"180":[4196,4235],"181":[4244,4260],"182":[4244,4261],"183":[4295,4311],"184":[4327,4344],"185":[4360,4377],"186":[4400,4419],"187":[4400,4432],"188":[4447,4458],"189":[4280,4464],"190":[3926,4467],"191":[3926,4468],"192":[4470,4491],"193":[4470,4492]};var __coverageWrap = function (index, value) {if (__coverage[index]) console.log("COVERED " + "\"/Users/smoeller/Repos/github/shannonmoeller/toga/lib/toga.js\"" + " " + index);delete __coverage[index];return value};
/*jshint node:true */
{ __coverageWrap(0);'use strict';};

{ __coverageWrap(3);var copier = __coverageWrap(2,__coverageWrap(1,require('copier')));};
{ __coverageWrap(6);var marked = __coverageWrap(5,__coverageWrap(4,require('marked')));};

/**
 * @type Object
 */
{ __coverageWrap(9);var defaults = __coverageWrap(8,__coverageWrap(7,{
    // Matches `/**`
    blockStart: /\/\*\*/,

    // Matches `*/`
    blockEnd: /\*\//,

    // Matches leading tabs and spaces
    indent: /^[\t ]*/,

    // Matches leading whitespace and ` * `
    leader: /[\t ]*(\*[\t ]?)?/,

    // Matches leading whitespace and `@`
    tagSplit: /[\t ]*@/,

    // Matches:
    // - `tag {Type} [name] Description.`
    // - `tag {Type} Description.`
    // - `tag [name] Description.`
    // - `tag Description.`
    // - `tag`
    tagParse: /^(\w+)[\t ]*(\{[^\}]+\})?[\t ]*(\[[^\]]*\]\*?|\S*)?[\t ]*([\s\S]+)?$/,

    // Matches tags that should include a name property
    named: /^(class|method|property|param)$/
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
    if (__coverageWrap(12,!(__coverageWrap(11,__coverageWrap(10,this) instanceof Toga)))) {
        return __coverageWrap(14,__coverageWrap(13,new Toga(options)).parse(block));
    }

    if (__coverageWrap(18,__coverageWrap(15,options === undefined) && __coverageWrap(17,__coverageWrap(16,typeof block) === 'object'))) {
        { __coverageWrap(20);__coverageWrap(19,options = block);};
        { __coverageWrap(22);__coverageWrap(21,block = null);};
    }

    { __coverageWrap(28);__coverageWrap(27,__coverageWrap(23,this).parse = __coverageWrap(25,__coverageWrap(24,this).parse).bind(__coverageWrap(26,this)));};
    { __coverageWrap(34);__coverageWrap(33,__coverageWrap(29,this).parseBlock = __coverageWrap(31,__coverageWrap(30,this).parseBlock).bind(__coverageWrap(32,this)));};
    { __coverageWrap(40);__coverageWrap(39,__coverageWrap(35,this).parseCode = __coverageWrap(37,__coverageWrap(36,this).parseCode).bind(__coverageWrap(38,this)));};
    { __coverageWrap(46);__coverageWrap(45,__coverageWrap(41,this).parseComment = __coverageWrap(43,__coverageWrap(42,this).parseComment).bind(__coverageWrap(44,this)));};
    { __coverageWrap(52);__coverageWrap(51,__coverageWrap(47,this).parseTag = __coverageWrap(49,__coverageWrap(48,this).parseTag).bind(__coverageWrap(50,this)));};

    { __coverageWrap(55);__coverageWrap(54,__coverageWrap(53,this).setOptions(options));};
}

/**
 * @method setOptions
 * @param {Object} options
 * @chainable
 */
{ __coverageWrap(87);__coverageWrap(86,__coverageWrap(56,Toga.prototype).setOptions = function(options) {
    { __coverageWrap(59);__coverageWrap(58,options = copier(__coverageWrap(57,{}), options, defaults));};

    { __coverageWrap(64);var blockStart = __coverageWrap(63,__coverageWrap(62,__coverageWrap(60,String(options.blockStart)).slice(1, __coverageWrap(61,-1))));};
    { __coverageWrap(69);var blockEnd = __coverageWrap(68,__coverageWrap(67,__coverageWrap(65,String(options.blockEnd)).slice(1, __coverageWrap(66,-1))));};

    { __coverageWrap(75);__coverageWrap(74,options.blockSplit = new RegExp(
        __coverageWrap(73,__coverageWrap(72,__coverageWrap(71,__coverageWrap(70,'([\\t ]*' + blockStart) + '[\\s\\S]+?') + blockEnd) + ')')
    ));};

    { __coverageWrap(81);__coverageWrap(80,options.blockWrap = new RegExp(
        __coverageWrap(79,__coverageWrap(78,__coverageWrap(77,__coverageWrap(76,'(^\\s*' + blockStart) + '|') + blockEnd) + '\\s*$)'),
        'g'
    ));};

    { __coverageWrap(84);__coverageWrap(83,__coverageWrap(82,this).options = options);};

    return __coverageWrap(85,this);
});};

/**
 * @method parse
 * @param {String} [block]
 * @return {String}
 */
{ __coverageWrap(95);__coverageWrap(94,__coverageWrap(88,Toga.prototype).parse = function(block) {
    return __coverageWrap(93,__coverageWrap(91,block
        .split(__coverageWrap(90,__coverageWrap(89,this).options).blockSplit))
        .map(__coverageWrap(92,this).parseBlock));
});};

/**
 * @method parseBlock
 * @param {String} [block]
 * @return {Object}
 */
{ __coverageWrap(107);__coverageWrap(106,__coverageWrap(96,Toga.prototype).parseBlock = function(block) {
    if (__coverageWrap(101,!__coverageWrap(100,__coverageWrap(99,__coverageWrap(98,__coverageWrap(97,this).options).blockSplit).test(block)))) {
        return __coverageWrap(103,__coverageWrap(102,this).parseCode(block));
    }

    return __coverageWrap(105,__coverageWrap(104,this).parseComment(block));
});};

/**
 * @method parseCode
 * @param {String} [block]
 * @return {Object}
 */
{ __coverageWrap(111);__coverageWrap(110,__coverageWrap(108,Toga.prototype).parseCode = function(block) {
    return __coverageWrap(109,{
        type: 'code',
        raw: block
    });
});};

/**
 * @method parseComment
 * @param {String} [block]
 * @return {Object}
 */
{ __coverageWrap(130);__coverageWrap(129,__coverageWrap(112,Toga.prototype).parseComment = function(block) {
    { __coverageWrap(116);var clean = __coverageWrap(115,__coverageWrap(114,__coverageWrap(113,this).normalizeComment(block)));};
    { __coverageWrap(121);var tags = __coverageWrap(120,__coverageWrap(119,clean.split(__coverageWrap(118,__coverageWrap(117,this).options).tagSplit)));};
    { __coverageWrap(124);var description = __coverageWrap(123,__coverageWrap(122,tags.shift()));};

    return __coverageWrap(128,{
        type: 'comment',
        description: __coverageWrap(125,marked(description)),
        tags: __coverageWrap(127,tags.map(__coverageWrap(126,this).parseTag)),
        raw: block
    });
});};

/**
 * @method normalizeComment
 * @param {String} block
 * @return {String}
 */
{ __coverageWrap(151);__coverageWrap(150,__coverageWrap(131,Toga.prototype).normalizeComment = function(block) {
    { __coverageWrap(135);var options = __coverageWrap(134,__coverageWrap(133,__coverageWrap(132,this).options));};
    { __coverageWrap(139);var indent = __coverageWrap(138,__coverageWrap(137,__coverageWrap(136,block.match(options.indent))[0]));};

    { __coverageWrap(147);var leader = __coverageWrap(146,__coverageWrap(145,new RegExp(
        __coverageWrap(144,__coverageWrap(140,'^' + indent) + __coverageWrap(143,__coverageWrap(141,String(options.leader)).slice(1, __coverageWrap(142,-1)))),
        'gm'
    )));};

    return __coverageWrap(149,__coverageWrap(148,block
        .replace(options.blockWrap, ''))
        .replace(leader, ''));
});};

/**
 * @method parseTag
 * @param {String} [block]
 * @return {Object}
 */
{ __coverageWrap(191);__coverageWrap(190,__coverageWrap(152,Toga.prototype).parseTag = function(block) {
    { __coverageWrap(157);var parts = __coverageWrap(156,__coverageWrap(155,block.match(__coverageWrap(154,__coverageWrap(153,this).options).tagParse)));};
    { __coverageWrap(161);var tag = __coverageWrap(160,__coverageWrap(159,__coverageWrap(158,parts[1]) || ''));};
    { __coverageWrap(165);var type = __coverageWrap(164,__coverageWrap(163,__coverageWrap(162,parts[2]) || ''));};
    { __coverageWrap(169);var name = __coverageWrap(168,__coverageWrap(167,__coverageWrap(166,parts[3]) || ''));};
    { __coverageWrap(172);var description = __coverageWrap(171,__coverageWrap(170,parts[4]));};

    if (__coverageWrap(177,!__coverageWrap(176,__coverageWrap(175,__coverageWrap(174,__coverageWrap(173,this).options).named).test(tag)))) {
        { __coverageWrap(180);__coverageWrap(179,description = __coverageWrap(178,name + ' ') + description);};
        { __coverageWrap(182);__coverageWrap(181,name = undefined);};
    }

    return __coverageWrap(189,{
        tag: __coverageWrap(183,tag || undefined),
        type: __coverageWrap(184,type || undefined),
        name: __coverageWrap(185,name || undefined),
        description: __coverageWrap(187,__coverageWrap(186,marked(description)) || undefined),
        raw: __coverageWrap(188,'@' + block)
    });
});};

{ __coverageWrap(193);__coverageWrap(192,module.exports = Toga);};

},{"copier":3,"marked":4}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
var global=typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};/**
 * marked - a markdown parser
 * Copyright (c) 2011-2013, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

;(function() {

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  nptable: noop,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  blockquote: /^( *>[^\n]+(\n[^\n]+)*\n*)+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment|closed|closing) *(?:\n{2,}|\s*$)/,
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  table: noop,
  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
  text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = replace(block.list)
  (/bull/g, block.bullet)
  ('hr', /\n+(?=(?: *[-*_]){3,} *(?:\n+|$))/)
  ();

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|@)\\b';

block.html = replace(block.html)
  ('comment', /<!--[\s\S]*?-->/)
  ('closed', /<(tag)[\s\S]+?<\/\1>/)
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
  (/tag/g, block._tag)
  ();

block.paragraph = replace(block.paragraph)
  ('hr', block.hr)
  ('heading', block.heading)
  ('lheading', block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' + block._tag)
  ('def', block.def)
  ();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/
});

block.gfm.paragraph = replace(block.paragraph)
  ('(?!', '(?!'
    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
    + block.list.source.replace('\\1', '\\3') + '|')
  ();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top) {
  var src = src.replace(/^ +$/gm, '')
    , next
    , loose
    , cap
    , bull
    , b
    , item
    , space
    , i
    , l;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3]
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];

      this.tokens.push({
        type: 'list_start',
        ordered: bull.length > 1
      });

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === '\n';
          if (!loose) loose = next;
        }

        this.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this.token(item, false);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style',
        text: cap[0]
      });
      continue;
    }

    // def
    if (top && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // table (gfm)
    if (top && (cap = this.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1) === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace(inline.link)
  ('inside', inline._inside)
  ('href', inline._href)
  ();

inline.reflink = replace(inline.reflink)
  ('inside', inline._inside)
  ();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: replace(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: replace(inline.text)
    (']|', '~]|')
    ('|', '|https?://|')
    ()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: replace(inline.br)('{2,}', '*')(),
  text: replace(inline.gfm.text)('{2,}', '*')()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer;

  if (!this.links) {
    throw new
      Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = ''
    , link
    , text
    , href
    , cap;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = cap[1].charAt(6) === ':'
          ? this.mangle(cap[1].substring(7))
          : this.mangle(cap[1]);
        href = this.mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (cap = this.rules.url.exec(src)) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += this.renderer.link(href, null, text);
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? escape(cap[0])
        : cap[0];
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      out += this.outputLink(cap, link);
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.strong(this.output(cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.em(this.output(cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.codespan(escape(cap[2], true));
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.br();
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.del(this.output(cap[1]));
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += escape(this.smartypants(cap[0]));
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  var href = escape(link.href)
    , title = link.title ? escape(link.title) : null;

  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    // em-dashes
    .replace(/--/g, '\u2014')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Renderer
 */

function Renderer() {}

Renderer.prototype.code = function(code, lang, escaped, options) {
  options = options || {};

  if (options.highlight) {
    var out = options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>';
  }

  return '<pre><code class="'
    + options.langPrefix
    + lang
    + '">'
    + (escaped ? code : escape(code))
    + '\n</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw, options) {
  return '<h'
    + level
    + ' id="'
    + options.headerPrefix
    + raw.toLowerCase().replace(/[^\w]+/g, '-')
    + '">'
    + text
    + '</h'
    + level
    + '>\n';
};

Renderer.prototype.hr = function() {
  return '<hr>\n';
};

Renderer.prototype.list = function(body, ordered) {
  var type = ordered ? 'ol' : 'ul';
  return '<' + type + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' style="text-align:' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
  return '<br>';
};

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>';
  return out;
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer;
  this.renderer = this.options.renderer;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options, renderer) {
  var parser = new Parser(options, renderer);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options, this.renderer);
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        this.token.text,
        this.options
      );
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped,
        this.options);
    }
    case 'table': {
      var header = ''
        , body = ''
        , i
        , row
        , cell
        , flags
        , j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        flags = { header: true, align: this.token.align[i] };
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]),
          { header: true, align: this.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]),
            { header: false, align: this.token.align[j] }
          );
        }

        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      var body = ''
        , ordered = this.token.ordered;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered);
    }
    case 'list_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'html': {
      var html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
      return this.renderer.html(html);
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function replace(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val) {
    if (!name) return new RegExp(regex, opt);
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}


/**
 * Marked
 */

function marked(src, opt, callback) {
  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});

    var highlight = opt.highlight
      , tokens
      , pending
      , i = 0;

    try {
      tokens = Lexer.lex(src, opt)
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function() {
      var out, err;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) opt = merge({}, marked.defaults, opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/chjj/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occured:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false,
  headerPrefix: '',
  renderer: new Renderer
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

if (typeof exports === 'object') {
  module.exports = marked;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return marked; });
} else {
  this.marked = marked;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());

},{}],5:[function(require,module,exports){
var __dirname="/";console.log("COVERAGE " + "\"/Users/smoeller/Repos/github/shannonmoeller/toga/test/specs/toga-spec.js\"" + " " + "[[22,35],[46,59],[46,59],[37,60],[72,97],[72,97],[61,98],[130,163],[114,172],[114,172],[100,173],[187,200],[187,200],[174,201],[215,246],[203,247],[203,248]]");var __coverage = {"0":[22,35],"1":[46,59],"2":[46,59],"3":[37,60],"4":[72,97],"5":[72,97],"6":[61,98],"7":[130,163],"8":[114,172],"9":[114,172],"10":[100,173],"11":[187,200],"12":[187,200],"13":[174,201],"14":[215,246],"15":[203,247],"16":[203,248]};var __coverageWrap = function (index, value) {if (__coverage[index]) console.log("COVERED " + "\"/Users/smoeller/Repos/github/shannonmoeller/toga/test/specs/toga-spec.js\"" + " " + index);delete __coverage[index];return value};
/*jshint node:true */
{ __coverageWrap(0);'use strict';};

{ __coverageWrap(3);var fs = __coverageWrap(2,__coverageWrap(1,require('fs')));};
{ __coverageWrap(6);var toga = __coverageWrap(5,__coverageWrap(4,require('../../lib/toga')));};

{ __coverageWrap(10);var fixture = __coverageWrap(9,__coverageWrap(8,fs.readFileSync(__coverageWrap(7,__dirname + '/../fixtures/all.js'), 'utf8')));};
{ __coverageWrap(13);var tokens = __coverageWrap(12,__coverageWrap(11,toga(fixture)));};

{ __coverageWrap(16);__coverageWrap(15,console.log(__coverageWrap(14,JSON.stringify(tokens, null, 4))));};

},{"../../lib/toga":1,"fs":2}]},{},[5])