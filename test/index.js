(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var copier = require('copier');

/**
 * Matches start of each line. Useful for getting a count of all lines.
 *
 * @type {RegExp}
 */
var linePattern = /^/gm;

/**
 * Matches empty lines. Useful for getting a count of empty lines.
 *
 * @type {RegExp}
 */
var emptyLinePattern = /^$/gm;

/**
 * Matches surrounding empty lines to be trimmed.
 *
 * @type {RegExp}
 */
var edgeEmptyLinesPattern = /^[\t ]*\n|\n[\t ]*$/g;

/**
 * Default C-style grammar.
 *
 * @type {Object.<String,RegExp>}
 */
var defaultGrammar = {
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
};

/**
 * Default options.
 *
 * @type {Object}
 */
var defaultOptions = {
    raw: false
};

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
    if (arguments.length === 1 && block && typeof block === 'object') {
        grammar = block;
        block = undefined;
    }

    // Support functional execution: `toga(block, grammar)`
    if (!(this instanceof Toga)) {
        return new Toga(grammar).parse(block);
    }

    // Set defaults
    this.grammar = copier({}, defaultGrammar, grammar);
    this.options = copier({}, defaultOptions);

    // Enforce context
    this.parse = this.parse.bind(this);
    this.parseBlock = this.parseBlock.bind(this);
    this.parseCode = this.parseCode.bind(this);
    this.parseDocBlock = this.parseDocBlock.bind(this);
    this.parseTag = this.parseTag.bind(this);
}

/**
 * @method parse
 * @param {String} block
 * @param {String} [options]
 * @return {String}
 */
Toga.prototype.parse = function(block, options) {
    if (arguments.length === 2) {
        this.options = copier({}, defaultOptions, options);
    }

    return String(block)
        .split(this.grammar.blockSplit)
        .map(this.parseBlock);
};

/**
 * @method parseBlock
 * @param {String} [block]
 * @return {Object}
 */
Toga.prototype.parseBlock = function(block) {
    if (this.grammar.blockParse.test(block)) {
        return this.parseDocBlock(block);
    }

    return this.parseCode(block);
};

/**
 * @method parseCode
 * @param {String} [block]
 * @return {Object}
 */
Toga.prototype.parseCode = function(block) {
    return {
        type: 'Code',
        body: String(block)
    };
};

/**
 * @method parseDocBlock
 * @param {String} [block]
 * @return {Object}
 */
Toga.prototype.parseDocBlock = function(block) {
    block = String(block);

    var tags = this
        .normalizeDocBlock(block)
        .split(this.grammar.tagSplit);

    var token = {
        type: 'DocBlock',
        description: tags.shift(),
        tags: tags.map(this.parseTag)
    };

    if (this.options.raw) {
        token.raw = block;
    }

    return token;
};

/**
 * @method normalizeDocBlock
 * @param {String} block
 * @return {String}
 */
Toga.prototype.normalizeDocBlock = function(block) {
    var grammar = this.grammar;

    // Trim comment wrappers
    var blockParse = grammar.blockParse;

    block = String(block)
        .replace(blockParse, '$1')
        .replace(edgeEmptyLinesPattern, '');

    // Unindent content
    var emptyLines;
    var indentedLines;
    var indent = grammar.indent;
    var lines = block.match(linePattern).length;

    while (lines > 0) {
        emptyLines = (block.match(emptyLinePattern) || []).length;
        indentedLines = (block.match(indent) || []).length;

        if (indentedLines && (emptyLines + indentedLines === lines)) {
            // Strip leading indent character
            block = block.replace(indent, '');
        } else {
            // Not indented anymore
            break;
        }
    }

    return block;
};

/**
 * @method parseTag
 * @param {String} [block]
 * @return {Object}
 */
Toga.prototype.parseTag = function(block) {
    var grammar = this.grammar;
    var parts = String(block).match(grammar.tagParse);
    var id = parts[1];
    var type = parts[2];
    var name = parts[3] || '';
    var description = parts[4] || '';
    var token = {};

    // Handle named tags
    if (!grammar.named.test(id)) {
        if (name && description) {
            description = name + ' ' + description;
        } else if (name) {
            description = name;
        }

        name = undefined;
    }

    // Keep tokens light

    if (id) {
        token.tag = id;
    }

    if (type) {
        token.type = type;
    }

    if (name) {
        token.name = name;
    }

    if (description) {
        token.description = description;
    }

    return token;
};

module.exports = Toga;

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
/*jshint maxlen:false */
'use strict';

var fs = require('fs');
var expect = require('expect.js');
var toga = require('../../lib/toga');
var Toga = toga;

describe('Toga', function () {
    it('should ignore non-blocks', function() {
        var ignore = "// ignore\n/* ignore */\n/*! ignore */\n\n//\n// ignore\n//\n/*\n * ignore\n */\n/*!\n * ignore\n */\n\n// /** ignore\nvar ignore = '/** ignore */';\nvar foo = function(/** ignore */) {};\nconsole.log(foo(ignore));\n// ignore */\n";

        expect(toga(ignore)).to.eql([
            { 'type': 'Code', 'body': '// ignore\n/* ignore */\n/*! ignore */\n\n//\n// ignore\n//\n/*\n * ignore\n */\n/*!\n * ignore\n */\n\n// /** ignore\nvar ignore = \'/** ignore */\';\nvar foo = function(/** ignore */) {};\nconsole.log(foo(ignore));\n// ignore */\n' }
        ]);
    });

    it('should parse empty blocks', function() {
        var empty = "/**/\n/***/\n/** */\n/**\n *\n */\n/**\n\n*/\n";

        expect(toga()).to.eql([
            { 'type': 'Code', 'body': 'undefined' }
        ]);

        expect(toga(null)).to.eql([
            { 'type': 'Code', 'body': 'null' }
        ]);

        expect(toga('')).to.eql([
            { 'type': 'Code', 'body': '' }
        ]);

        expect(toga(empty)).to.eql([
            { 'type': 'Code', 'body': '/**/\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [] },
            { 'type': 'Code', 'body': '\n' }
        ]);
    });

    it('should parse descriptions', function() {
        var desc = "/** description */\n/**\n * description\n */\n/**\ndescription\n*/\n";

        expect(toga(desc)).to.eql([
            { 'type': 'Code', 'body': '' },
            { 'type': 'DocBlock', 'description': 'description', 'tags': [] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': 'description', 'tags': [] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': 'description', 'tags': [] },
            { 'type': 'Code', 'body': '\n' }
        ]);
    });

    it('should parse tags', function() {
        var tag = "/** @tag {Type} - Description here. */\n/** @tag {Type} Description here. */\n/** @tag - Description. */\n/** @tag Description. */\n/** @tag */\n";

        expect(toga(tag)).to.eql([
            { 'type': 'Code', 'body': '' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'tag', 'type': '{Type}', 'description': 'Description here.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'tag', 'type': '{Type}', 'description': 'Description here.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'tag', 'description': 'Description.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'tag', 'description': 'Description.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'tag' }] },
            { 'type': 'Code', 'body': '\n' }
        ]);
    });

    it('should parse args', function() {
        var arg = "/** @arg {Type} [name] - Description. */\n/** @arg {Type} [name] Description. */\n/** @arg {Type} name - Description. */\n/** @arg {Type} name Description. */\n/** @arg {Type} [name] */\n/** @arg {Type} name */\n/** @arg [name] - Description. */\n/** @arg [name] Description. */\n/** @arg name - Description. */\n/** @arg name Description. */\n/** @arg [name] */\n/** @arg name */\n";

        expect(toga(arg)).to.eql([
            { 'type': 'Code', 'body': '' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'type': '{Type}', 'name': '[name]', 'description': 'Description.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'type': '{Type}', 'name': '[name]', 'description': 'Description.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'type': '{Type}', 'name': '[name]' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'type': '{Type}', 'name': 'name' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'name': '[name]', 'description': 'Description.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'name': '[name]', 'description': 'Description.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'name': 'name', 'description': 'Description.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'name': 'name', 'description': 'Description.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'name': '[name]' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'name': 'name' }] },
            { 'type': 'Code', 'body': '\n' }
        ]);
    });

    it('should parse types', function() {
        var type = "/** @arg {Type} */\n/** @arg {String|Object} */\n/** @arg {Array.<Object.<String,Number>>} */\n/** @arg {Function(String, ...[Number]): Number} callback */\n";

        expect(toga(type)).to.eql([
            { 'type': 'Code', 'body': '' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'type': '{Type}' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'type': '{String|Object}' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'type': '{Array.<Object.<String,Number>>}' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'type': '{Function(String, ...[Number]): Number}', 'name': 'callback' }] },
            { 'type': 'Code', 'body': '\n' }
        ]);
    });

    it('should parse names', function() {
        var name = "/** @arg name */\n/** @arg [name] */\n/** @arg [name={}] */\n/** @arg [name=\"hello world\"] */\n";

        expect(toga(name)).to.eql([
            { 'type': 'Code', 'body': '' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'name': 'name' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'name': '[name]' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'name': '[name={}]' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'name': '[name="hello world"]' }] },
            { 'type': 'Code', 'body': '\n' }
        ]);
    });

    it('should handle indention', function() {
        var indent = "/**\n * # Title\n *\n * Long description that spans multiple\n * lines and even has other markdown\n * type things.\n *\n * Like more paragraphs.\n *\n * * Like\n * * Lists\n *\n *     var code = 'samples';\n *\n * @arg {Type} name Description.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n *\n *   And has line breaks, etc.\n *\n * @example\n *\n *     var foo = 'bar';\n *\n * @tag\n */\n\n/**\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = 'samples';\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    var foo = 'bar';\n\n@tag\n */\n\n/**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = 'samples';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = 'bar';\n\n    @tag\n */\n\n    /**\n     * # Title\n     *\n     * Long description that spans multiple\n     * lines and even has other markdown\n     * type things.\n     *\n     * Like more paragraphs.\n     *\n     * * Like\n     * * Lists\n     *\n     *     var code = 'samples';\n     *\n     * @arg {Type} name Description.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     *\n     *   And has line breaks, etc.\n     *\n     * @example\n     *\n     *     var foo = 'bar';\n     *\n     * @tag\n     */\n\n    /**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = 'samples';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = 'bar';\n\n    @tag\n     */\n\n    /**\n        # Title\n\n        Long description that spans multiple\n        lines and even has other markdown\n        type things.\n\n        Like more paragraphs.\n\n        * Like\n        * Lists\n\n            var code = 'samples';\n\n        @arg {Type} name Description.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n\n          And has line breaks, etc.\n\n        @example\n\n            var foo = 'bar';\n\n        @tag\n    */\n";

        var standardParser = new Toga();

        var tokens = standardParser.parse(indent, {
            raw: true
        });

        expect(tokens).to.eql([
            { 'type': 'Code', 'body': '' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    var foo = \'bar\';\n\n' },
                    { 'tag': 'tag' }
                ],
                'raw': '/**\n * # Title\n *\n * Long description that spans multiple\n * lines and even has other markdown\n * type things.\n *\n * Like more paragraphs.\n *\n * * Like\n * * Lists\n *\n *     var code = \'samples\';\n *\n * @arg {Type} name Description.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n *\n *   And has line breaks, etc.\n *\n * @example\n *\n *     var foo = \'bar\';\n *\n * @tag\n */'
            },
            { 'type': 'Code', 'body': '\n\n' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    var foo = \'bar\';\n\n' },
                    { 'tag': 'tag' }
                ],
                'raw': '/**\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    var foo = \'bar\';\n\n@tag\n */'
            },
            { 'type': 'Code', 'body': '\n\n' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    var foo = \'bar\';\n\n' },
                    { 'tag': 'tag' }
                ],
                'raw': '/**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = \'samples\';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = \'bar\';\n\n    @tag\n */'
            },
            { 'type': 'Code', 'body': '\n\n' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    var foo = \'bar\';\n\n' },
                    { 'tag': 'tag' }
                ],
                'raw': '    /**\n     * # Title\n     *\n     * Long description that spans multiple\n     * lines and even has other markdown\n     * type things.\n     *\n     * Like more paragraphs.\n     *\n     * * Like\n     * * Lists\n     *\n     *     var code = \'samples\';\n     *\n     * @arg {Type} name Description.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     *\n     *   And has line breaks, etc.\n     *\n     * @example\n     *\n     *     var foo = \'bar\';\n     *\n     * @tag\n     */'
            },
            { 'type': 'Code', 'body': '\n\n' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    var foo = \'bar\';\n\n' },
                    { 'tag': 'tag' }
                ],
                'raw': '    /**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = \'samples\';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = \'bar\';\n\n    @tag\n     */'
            },
            { 'type': 'Code', 'body': '\n\n' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    var foo = \'bar\';\n\n' },
                    { 'tag': 'tag' }
                ],
                'raw': '    /**\n        # Title\n\n        Long description that spans multiple\n        lines and even has other markdown\n        type things.\n\n        Like more paragraphs.\n\n        * Like\n        * Lists\n\n            var code = \'samples\';\n\n        @arg {Type} name Description.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n\n          And has line breaks, etc.\n\n        @example\n\n            var foo = \'bar\';\n\n        @tag\n    */'
            },
            { 'type': 'Code', 'body': '\n' }
        ]);
    });

    it('should use custom handlebars grammar', function() {
        var custom = "{{!---\n  ! # Title\n  !\n  ! Long description that spans multiple\n  ! lines and even has other markdown\n  ! type things.\n  !\n  ! Like more paragraphs.\n  !\n  ! * Like\n  ! * Lists\n  !\n  !     <code>samples</code>\n  !\n  ! @arg {Type} name Description.\n  ! @arg {Type} name Description that is really long\n  !   and wraps to other lines.\n  ! @arg {Type} name Description that is really long\n  !   and wraps to other lines.\n  !\n  !   And has line breaks, etc.\n  !\n  ! @example\n  !\n  !     <ul>\n  !         {{#each item}}\n  !             <li>{{.}}</li>\n  !         {{/each}}\n  !     </ul>\n  !\n  ! @tag\n  !--}}\n\n{{!---\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n@tag\n--}}\n\n{{!---\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        <code>{{samples}}</code>\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        <ul>\n            {{#each item}}\n                <li>{{.}}</li>\n            {{/each}}\n        </ul>\n\n    @tag\n--}}\n\n    {{!---\n      ! # Title\n      !\n      ! Long description that spans multiple\n      ! lines and even has other markdown\n      ! type things.\n      !\n      ! Like more paragraphs.\n      !\n      ! * Like\n      ! * Lists\n      !\n      !     <code>samples</code>\n      !\n      ! @arg {Type} name Description.\n      ! @arg {Type} name Description that is really long\n      !   and wraps to other lines.\n      ! @arg {Type} name Description that is really long\n      !   and wraps to other lines.\n      !\n      !   And has line breaks, etc.\n      !\n      ! @example\n      !\n      !     <ul>\n      !         {{#each item}}\n      !             <li>{{.}}</li>\n      !         {{/each}}\n      !     </ul>\n      !\n      ! @tag\n      !--}}\n\n    {{!---\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        <code>samples</code>\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        <ul>\n            {{#each item}}\n                <li>{{.}}</li>\n            {{/each}}\n        </ul>\n\n    @tag\n    --}}\n\n    {{!---\n        # Title\n\n        Long description that spans multiple\n        lines and even has other markdown\n        type things.\n\n        Like more paragraphs.\n\n        * Like\n        * Lists\n\n            <code>{{samples}}</code>\n\n        @arg {Type} name Description.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n\n          And has line breaks, etc.\n\n        @example\n\n            <ul>\n                {{#each item}}\n                    <li>{{.}}</li>\n                {{/each}}\n            </ul>\n\n        @tag\n    --}}\n\n{{! ignore }}\n{{!-- ignore --}}\n{{!\n  ! ignore\n  !}}\n<!-- {{!--- ignore -->\n<!-- ignore }} -->\n";

        var handlebarParser = new Toga({
            blockSplit: /(^[\t ]*\{\{!---(?!-)[\s\S]*?\s*--\}\})/m,
            blockParse: /^[\t ]*\{\{!---(?!-)([\s\S]*?)\s*--\}\}/m,
            indent: /^[\t !]/gm,
            named: /^(arg(gument)?|data|prop(erty)?)$/
        });

        var tokens = handlebarParser.parse(custom, {
            raw: true
        });

        expect(tokens).to.eql([
            { 'type': 'Code', 'body': '' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n' },
                    { 'tag': 'tag', 'description': '\n' }
                ],
                'raw': '{{!---\n  ! # Title\n  !\n  ! Long description that spans multiple\n  ! lines and even has other markdown\n  ! type things.\n  !\n  ! Like more paragraphs.\n  !\n  ! * Like\n  ! * Lists\n  !\n  !     <code>samples</code>\n  !\n  ! @arg {Type} name Description.\n  ! @arg {Type} name Description that is really long\n  !   and wraps to other lines.\n  ! @arg {Type} name Description that is really long\n  !   and wraps to other lines.\n  !\n  !   And has line breaks, etc.\n  !\n  ! @example\n  !\n  !     <ul>\n  !         {{#each item}}\n  !             <li>{{.}}</li>\n  !         {{/each}}\n  !     </ul>\n  !\n  ! @tag\n  !--}}'
            },
            { 'type': 'Code', 'body': '\n\n' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n' },
                    { 'tag': 'tag' }
                ],
                'raw': '{{!---\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n@tag\n--}}'
            },
            { 'type': 'Code', 'body': '\n\n' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>{{samples}}</code>\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n' },
                    { 'tag': 'tag' }
                ],
                'raw': '{{!---\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        <code>{{samples}}</code>\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        <ul>\n            {{#each item}}\n                <li>{{.}}</li>\n            {{/each}}\n        </ul>\n\n    @tag\n--}}'
            },
            { 'type': 'Code', 'body': '\n\n' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n' },
                    { 'tag': 'tag', 'description': '\n' }
                ],
                'raw': '    {{!---\n      ! # Title\n      !\n      ! Long description that spans multiple\n      ! lines and even has other markdown\n      ! type things.\n      !\n      ! Like more paragraphs.\n      !\n      ! * Like\n      ! * Lists\n      !\n      !     <code>samples</code>\n      !\n      ! @arg {Type} name Description.\n      ! @arg {Type} name Description that is really long\n      !   and wraps to other lines.\n      ! @arg {Type} name Description that is really long\n      !   and wraps to other lines.\n      !\n      !   And has line breaks, etc.\n      !\n      ! @example\n      !\n      !     <ul>\n      !         {{#each item}}\n      !             <li>{{.}}</li>\n      !         {{/each}}\n      !     </ul>\n      !\n      ! @tag\n      !--}}'
            },
            { 'type': 'Code', 'body': '\n\n' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n' },
                    { 'tag': 'tag' }
                ],
                'raw': '    {{!---\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        <code>samples</code>\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        <ul>\n            {{#each item}}\n                <li>{{.}}</li>\n            {{/each}}\n        </ul>\n\n    @tag\n    --}}'
            },
            { 'type': 'Code', 'body': '\n\n' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>{{samples}}</code>\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n' },
                    { 'tag': 'tag' }
                ],
                'raw': '    {{!---\n        # Title\n\n        Long description that spans multiple\n        lines and even has other markdown\n        type things.\n\n        Like more paragraphs.\n\n        * Like\n        * Lists\n\n            <code>{{samples}}</code>\n\n        @arg {Type} name Description.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n\n          And has line breaks, etc.\n\n        @example\n\n            <ul>\n                {{#each item}}\n                    <li>{{.}}</li>\n                {{/each}}\n            </ul>\n\n        @tag\n    --}}'
            },
            { 'type': 'Code', 'body': '\n\n{{! ignore }}\n{{!-- ignore --}}\n{{!\n  ! ignore\n  !}}\n<!-- {{!--- ignore -->\n<!-- ignore }} -->\n' }
        ]);
    });

    it('should use custom perl grammar', function() {
        var custom = "use strict;\nuse warnings;\n\nprint \"hello world\";\n\n=pod\n\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    my $code = \"samples\";\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    my $foo = \"bar\";\n\n@tag\n\n=cut\n";

        var perlParser = new Toga({
            blockSplit: /(^=pod[\s\S]*?\n=cut$)/m,
            blockParse: /^=pod([\s\S]*?)\n=cut$/m,
            named: /^(arg(gument)?|data|prop(erty)?)$/
        });

        var tokens = perlParser.parse(custom, {
            raw: true
        });

        expect(tokens).to.eql([
            { 'type': 'Code', 'body': 'use strict;\nuse warnings;\n\nprint "hello world";\n\n' },
            {
                'type': 'DocBlock',
                'description': '\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    my $code = "samples";\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    my $foo = "bar";\n\n' },
                    { 'tag': 'tag' }
                ],
                'raw': '=pod\n\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    my $code = "samples";\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    my $foo = "bar";\n\n@tag\n\n=cut'
            },
            { 'type': 'Code', 'body': '\n' }
        ]);
    });
});

},{"../../lib/toga":1,"expect.js":5,"fs":2}]},{},[6])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvc21vZWxsZXIvUmVwb3MvZ2l0aHViL3NoYW5ub25tb2VsbGVyL3RvZ2EvbGliL3RvZ2EuanMiLCIvVXNlcnMvc21vZWxsZXIvUmVwb3MvZ2l0aHViL3NoYW5ub25tb2VsbGVyL3RvZ2Evbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvX2VtcHR5LmpzIiwiL1VzZXJzL3Ntb2VsbGVyL1JlcG9zL2dpdGh1Yi9zaGFubm9ubW9lbGxlci90b2dhL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9pbnNlcnQtbW9kdWxlLWdsb2JhbHMvYnVmZmVyLmpzIiwiL1VzZXJzL3Ntb2VsbGVyL1JlcG9zL2dpdGh1Yi9zaGFubm9ubW9lbGxlci90b2dhL25vZGVfbW9kdWxlcy9jb3BpZXIvY29waWVyLmpzIiwiL1VzZXJzL3Ntb2VsbGVyL1JlcG9zL2dpdGh1Yi9zaGFubm9ubW9lbGxlci90b2dhL25vZGVfbW9kdWxlcy9leHBlY3QuanMvZXhwZWN0LmpzIiwiL1VzZXJzL3Ntb2VsbGVyL1JlcG9zL2dpdGh1Yi9zaGFubm9ubW9lbGxlci90b2dhL3Rlc3Qvc3BlY3MvdG9nYS1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeFBBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbnpEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcnVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY29waWVyID0gcmVxdWlyZSgnY29waWVyJyk7XG5cbi8qKlxuICogTWF0Y2hlcyBzdGFydCBvZiBlYWNoIGxpbmUuIFVzZWZ1bCBmb3IgZ2V0dGluZyBhIGNvdW50IG9mIGFsbCBsaW5lcy5cbiAqXG4gKiBAdHlwZSB7UmVnRXhwfVxuICovXG52YXIgbGluZVBhdHRlcm4gPSAvXi9nbTtcblxuLyoqXG4gKiBNYXRjaGVzIGVtcHR5IGxpbmVzLiBVc2VmdWwgZm9yIGdldHRpbmcgYSBjb3VudCBvZiBlbXB0eSBsaW5lcy5cbiAqXG4gKiBAdHlwZSB7UmVnRXhwfVxuICovXG52YXIgZW1wdHlMaW5lUGF0dGVybiA9IC9eJC9nbTtcblxuLyoqXG4gKiBNYXRjaGVzIHN1cnJvdW5kaW5nIGVtcHR5IGxpbmVzIHRvIGJlIHRyaW1tZWQuXG4gKlxuICogQHR5cGUge1JlZ0V4cH1cbiAqL1xudmFyIGVkZ2VFbXB0eUxpbmVzUGF0dGVybiA9IC9eW1xcdCBdKlxcbnxcXG5bXFx0IF0qJC9nO1xuXG4vKipcbiAqIERlZmF1bHQgQy1zdHlsZSBncmFtbWFyLlxuICpcbiAqIEB0eXBlIHtPYmplY3QuPFN0cmluZyxSZWdFeHA+fVxuICovXG52YXIgZGVmYXVsdEdyYW1tYXIgPSB7XG4gICAgLy8gTWF0Y2hlcyBibG9jayBkZWxpbWl0ZXJzXG4gICAgYmxvY2tTcGxpdDogLyheW1xcdCBdKlxcL1xcKlxcKig/IVxcLylbXFxzXFxTXSo/XFxzKlxcKlxcLykvbSxcblxuICAgIC8vIE1hdGNoZXMgYmxvY2sgY29udGVudFxuICAgIGJsb2NrUGFyc2U6IC9eW1xcdCBdKlxcL1xcKlxcKig/IVxcLykoW1xcc1xcU10qPylcXHMqXFwqXFwvL20sXG5cbiAgICAvLyBNYXRjaGVzIGluZGVudCBjaGFyYWN0ZXJzXG4gICAgaW5kZW50OiAvXltcXHQgXFwqXS9nbSxcblxuICAgIC8vIE1hdGNoZXMgdGFnIGRlbGltaXRlcnNcbiAgICB0YWdTcGxpdDogL15bXFx0IF0qQC9tLFxuXG4gICAgLy8gTWF0Y2hlcyB0YWcgY29udGVudCBgdGFnIHtUeXBlfSBbbmFtZV0gLSBEZXNjcmlwdGlvbi5gXG4gICAgdGFnUGFyc2U6IC9eKFxcdyspW1xcdCBcXC1dKihcXHtbXlxcfV0rXFx9KT9bXFx0IFxcLV0qKFxcW1teXFxdXSpcXF1cXCo/fFxcUyopP1tcXHQgXFwtXSooW1xcc1xcU10rKT8kL20sXG5cbiAgICAvLyBNYXRjaGVzIHRhZ3MgdGhhdCBzaG91bGQgaW5jbHVkZSBhIG5hbWUgcHJvcGVydHlcbiAgICBuYW1lZDogL14oYXJnKHVtZW50KT98YXVnbWVudHN8Y2xhc3N8ZXh0ZW5kc3xtZXRob2R8cGFyYW18cHJvcChlcnR5KT8pJC9cbn07XG5cbi8qKlxuICogRGVmYXVsdCBvcHRpb25zLlxuICpcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbnZhciBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICByYXc6IGZhbHNlXG59O1xuXG4vKipcbiAqICMgVG9nYVxuICpcbiAqIFRoZSBzdHVwaWQgZG9jLWJsb2NrIHBhcnNlci4gR2VuZXJhdGVzIGFuIGFic3RyYWN0IHN5bnRheCB0cmVlIGJhc2VkIG9uIGFcbiAqIGN1c3RvbWl6YWJsZSByZWd1bGFyLWV4cHJlc3Npb24gZ3JhbW1hci4gRGVmYXVsdHMgdG8gQy1zdHlsZSBjb21tZW50IGJsb2NrcyxcbiAqIHNvIGl0IHN1cHBvcnRzIEphdmFTY3JpcHQsIFBIUCwgQysrLCBhbmQgZXZlbiBDU1MgcmlnaHQgb3V0IG9mIHRoZSBib3guXG4gKlxuICogVGFncyBhcmUgcGFyc2VkIGdyZWVkaWx5LiBJZiBpdCBsb29rcyBsaWtlIGEgdGFnLCBpdCdzIGEgdGFnLiBXaGF0IHlvdSBkb1xuICogd2l0aCB0aGVtIGlzIGNvbXBsZXRlbHkgdXAgdG8geW91LiBSZW5kZXIgc29tZXRoaW5nIGh1bWFuLXJlYWRhYmxlLCBwZXJoYXBzP1xuICpcbiAqIEBjbGFzcyBUb2dhXG4gKiBAcGFyYW0ge1N0cmluZ30gW2Jsb2NrXVxuICogQHBhcmFtIHtPYmplY3R9IFtncmFtbWFyXVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFRvZ2EoYmxvY2ssIGdyYW1tYXIpIHtcbiAgICAvLyBNYWtlIGBibG9ja2Agb3B0aW9uYWxcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSAmJiBibG9jayAmJiB0eXBlb2YgYmxvY2sgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGdyYW1tYXIgPSBibG9jaztcbiAgICAgICAgYmxvY2sgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgLy8gU3VwcG9ydCBmdW5jdGlvbmFsIGV4ZWN1dGlvbjogYHRvZ2EoYmxvY2ssIGdyYW1tYXIpYFxuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBUb2dhKSkge1xuICAgICAgICByZXR1cm4gbmV3IFRvZ2EoZ3JhbW1hcikucGFyc2UoYmxvY2spO1xuICAgIH1cblxuICAgIC8vIFNldCBkZWZhdWx0c1xuICAgIHRoaXMuZ3JhbW1hciA9IGNvcGllcih7fSwgZGVmYXVsdEdyYW1tYXIsIGdyYW1tYXIpO1xuICAgIHRoaXMub3B0aW9ucyA9IGNvcGllcih7fSwgZGVmYXVsdE9wdGlvbnMpO1xuXG4gICAgLy8gRW5mb3JjZSBjb250ZXh0XG4gICAgdGhpcy5wYXJzZSA9IHRoaXMucGFyc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLnBhcnNlQmxvY2sgPSB0aGlzLnBhcnNlQmxvY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLnBhcnNlQ29kZSA9IHRoaXMucGFyc2VDb2RlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5wYXJzZURvY0Jsb2NrID0gdGhpcy5wYXJzZURvY0Jsb2NrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5wYXJzZVRhZyA9IHRoaXMucGFyc2VUYWcuYmluZCh0aGlzKTtcbn1cblxuLyoqXG4gKiBAbWV0aG9kIHBhcnNlXG4gKiBAcGFyYW0ge1N0cmluZ30gYmxvY2tcbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9uc11cbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuVG9nYS5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbihibG9jaywgb3B0aW9ucykge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IGNvcGllcih7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHJldHVybiBTdHJpbmcoYmxvY2spXG4gICAgICAgIC5zcGxpdCh0aGlzLmdyYW1tYXIuYmxvY2tTcGxpdClcbiAgICAgICAgLm1hcCh0aGlzLnBhcnNlQmxvY2spO1xufTtcblxuLyoqXG4gKiBAbWV0aG9kIHBhcnNlQmxvY2tcbiAqIEBwYXJhbSB7U3RyaW5nfSBbYmxvY2tdXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cblRvZ2EucHJvdG90eXBlLnBhcnNlQmxvY2sgPSBmdW5jdGlvbihibG9jaykge1xuICAgIGlmICh0aGlzLmdyYW1tYXIuYmxvY2tQYXJzZS50ZXN0KGJsb2NrKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZURvY0Jsb2NrKGJsb2NrKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wYXJzZUNvZGUoYmxvY2spO1xufTtcblxuLyoqXG4gKiBAbWV0aG9kIHBhcnNlQ29kZVxuICogQHBhcmFtIHtTdHJpbmd9IFtibG9ja11cbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuVG9nYS5wcm90b3R5cGUucGFyc2VDb2RlID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiAnQ29kZScsXG4gICAgICAgIGJvZHk6IFN0cmluZyhibG9jaylcbiAgICB9O1xufTtcblxuLyoqXG4gKiBAbWV0aG9kIHBhcnNlRG9jQmxvY2tcbiAqIEBwYXJhbSB7U3RyaW5nfSBbYmxvY2tdXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cblRvZ2EucHJvdG90eXBlLnBhcnNlRG9jQmxvY2sgPSBmdW5jdGlvbihibG9jaykge1xuICAgIGJsb2NrID0gU3RyaW5nKGJsb2NrKTtcblxuICAgIHZhciB0YWdzID0gdGhpc1xuICAgICAgICAubm9ybWFsaXplRG9jQmxvY2soYmxvY2spXG4gICAgICAgIC5zcGxpdCh0aGlzLmdyYW1tYXIudGFnU3BsaXQpO1xuXG4gICAgdmFyIHRva2VuID0ge1xuICAgICAgICB0eXBlOiAnRG9jQmxvY2snLFxuICAgICAgICBkZXNjcmlwdGlvbjogdGFncy5zaGlmdCgpLFxuICAgICAgICB0YWdzOiB0YWdzLm1hcCh0aGlzLnBhcnNlVGFnKVxuICAgIH07XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnJhdykge1xuICAgICAgICB0b2tlbi5yYXcgPSBibG9jaztcbiAgICB9XG5cbiAgICByZXR1cm4gdG9rZW47XG59O1xuXG4vKipcbiAqIEBtZXRob2Qgbm9ybWFsaXplRG9jQmxvY2tcbiAqIEBwYXJhbSB7U3RyaW5nfSBibG9ja1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5Ub2dhLnByb3RvdHlwZS5ub3JtYWxpemVEb2NCbG9jayA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gICAgdmFyIGdyYW1tYXIgPSB0aGlzLmdyYW1tYXI7XG5cbiAgICAvLyBUcmltIGNvbW1lbnQgd3JhcHBlcnNcbiAgICB2YXIgYmxvY2tQYXJzZSA9IGdyYW1tYXIuYmxvY2tQYXJzZTtcblxuICAgIGJsb2NrID0gU3RyaW5nKGJsb2NrKVxuICAgICAgICAucmVwbGFjZShibG9ja1BhcnNlLCAnJDEnKVxuICAgICAgICAucmVwbGFjZShlZGdlRW1wdHlMaW5lc1BhdHRlcm4sICcnKTtcblxuICAgIC8vIFVuaW5kZW50IGNvbnRlbnRcbiAgICB2YXIgZW1wdHlMaW5lcztcbiAgICB2YXIgaW5kZW50ZWRMaW5lcztcbiAgICB2YXIgaW5kZW50ID0gZ3JhbW1hci5pbmRlbnQ7XG4gICAgdmFyIGxpbmVzID0gYmxvY2subWF0Y2gobGluZVBhdHRlcm4pLmxlbmd0aDtcblxuICAgIHdoaWxlIChsaW5lcyA+IDApIHtcbiAgICAgICAgZW1wdHlMaW5lcyA9IChibG9jay5tYXRjaChlbXB0eUxpbmVQYXR0ZXJuKSB8fCBbXSkubGVuZ3RoO1xuICAgICAgICBpbmRlbnRlZExpbmVzID0gKGJsb2NrLm1hdGNoKGluZGVudCkgfHwgW10pLmxlbmd0aDtcblxuICAgICAgICBpZiAoaW5kZW50ZWRMaW5lcyAmJiAoZW1wdHlMaW5lcyArIGluZGVudGVkTGluZXMgPT09IGxpbmVzKSkge1xuICAgICAgICAgICAgLy8gU3RyaXAgbGVhZGluZyBpbmRlbnQgY2hhcmFjdGVyXG4gICAgICAgICAgICBibG9jayA9IGJsb2NrLnJlcGxhY2UoaW5kZW50LCAnJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBOb3QgaW5kZW50ZWQgYW55bW9yZVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYmxvY2s7XG59O1xuXG4vKipcbiAqIEBtZXRob2QgcGFyc2VUYWdcbiAqIEBwYXJhbSB7U3RyaW5nfSBbYmxvY2tdXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cblRvZ2EucHJvdG90eXBlLnBhcnNlVGFnID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgICB2YXIgZ3JhbW1hciA9IHRoaXMuZ3JhbW1hcjtcbiAgICB2YXIgcGFydHMgPSBTdHJpbmcoYmxvY2spLm1hdGNoKGdyYW1tYXIudGFnUGFyc2UpO1xuICAgIHZhciBpZCA9IHBhcnRzWzFdO1xuICAgIHZhciB0eXBlID0gcGFydHNbMl07XG4gICAgdmFyIG5hbWUgPSBwYXJ0c1szXSB8fCAnJztcbiAgICB2YXIgZGVzY3JpcHRpb24gPSBwYXJ0c1s0XSB8fCAnJztcbiAgICB2YXIgdG9rZW4gPSB7fTtcblxuICAgIC8vIEhhbmRsZSBuYW1lZCB0YWdzXG4gICAgaWYgKCFncmFtbWFyLm5hbWVkLnRlc3QoaWQpKSB7XG4gICAgICAgIGlmIChuYW1lICYmIGRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICBkZXNjcmlwdGlvbiA9IG5hbWUgKyAnICcgKyBkZXNjcmlwdGlvbjtcbiAgICAgICAgfSBlbHNlIGlmIChuYW1lKSB7XG4gICAgICAgICAgICBkZXNjcmlwdGlvbiA9IG5hbWU7XG4gICAgICAgIH1cblxuICAgICAgICBuYW1lID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8vIEtlZXAgdG9rZW5zIGxpZ2h0XG5cbiAgICBpZiAoaWQpIHtcbiAgICAgICAgdG9rZW4udGFnID0gaWQ7XG4gICAgfVxuXG4gICAgaWYgKHR5cGUpIHtcbiAgICAgICAgdG9rZW4udHlwZSA9IHR5cGU7XG4gICAgfVxuXG4gICAgaWYgKG5hbWUpIHtcbiAgICAgICAgdG9rZW4ubmFtZSA9IG5hbWU7XG4gICAgfVxuXG4gICAgaWYgKGRlc2NyaXB0aW9uKSB7XG4gICAgICAgIHRva2VuLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgfVxuXG4gICAgcmV0dXJuIHRva2VuO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUb2dhO1xuIixudWxsLCJyZXF1aXJlPShmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pKHtcIlBjWmo5TFwiOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbnZhciBUQSA9IHJlcXVpcmUoJ3R5cGVkYXJyYXknKVxudmFyIHhEYXRhVmlldyA9IHR5cGVvZiBEYXRhVmlldyA9PT0gJ3VuZGVmaW5lZCdcbiAgPyBUQS5EYXRhVmlldyA6IERhdGFWaWV3XG52YXIgeEFycmF5QnVmZmVyID0gdHlwZW9mIEFycmF5QnVmZmVyID09PSAndW5kZWZpbmVkJ1xuICA/IFRBLkFycmF5QnVmZmVyIDogQXJyYXlCdWZmZXJcbnZhciB4VWludDhBcnJheSA9IHR5cGVvZiBVaW50OEFycmF5ID09PSAndW5kZWZpbmVkJ1xuICA/IFRBLlVpbnQ4QXJyYXkgOiBVaW50OEFycmF5XG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuQnVmZmVyLnBvb2xTaXplID0gODE5MlxuXG52YXIgYnJvd3NlclN1cHBvcnRcblxuLyoqXG4gKiBDbGFzczogQnVmZmVyXG4gKiA9PT09PT09PT09PT09XG4gKlxuICogVGhlIEJ1ZmZlciBjb25zdHJ1Y3RvciByZXR1cm5zIGluc3RhbmNlcyBvZiBgVWludDhBcnJheWAgdGhhdCBhcmUgYXVnbWVudGVkXG4gKiB3aXRoIGZ1bmN0aW9uIHByb3BlcnRpZXMgZm9yIGFsbCB0aGUgbm9kZSBgQnVmZmVyYCBBUEkgZnVuY3Rpb25zLiBXZSB1c2VcbiAqIGBVaW50OEFycmF5YCBzbyB0aGF0IHNxdWFyZSBicmFja2V0IG5vdGF0aW9uIHdvcmtzIGFzIGV4cGVjdGVkIC0tIGl0IHJldHVybnNcbiAqIGEgc2luZ2xlIG9jdGV0LlxuICpcbiAqIEJ5IGF1Z21lbnRpbmcgdGhlIGluc3RhbmNlcywgd2UgY2FuIGF2b2lkIG1vZGlmeWluZyB0aGUgYFVpbnQ4QXJyYXlgXG4gKiBwcm90b3R5cGUuXG4gKlxuICogRmlyZWZveCBpcyBhIHNwZWNpYWwgY2FzZSBiZWNhdXNlIGl0IGRvZXNuJ3QgYWxsb3cgYXVnbWVudGluZyBcIm5hdGl2ZVwiIG9iamVjdFxuICogaW5zdGFuY2VzLiBTZWUgYFByb3h5QnVmZmVyYCBiZWxvdyBmb3IgbW9yZSBkZXRhaWxzLlxuICovXG5mdW5jdGlvbiBCdWZmZXIgKHN1YmplY3QsIGVuY29kaW5nKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHN1YmplY3RcblxuICAvLyBXb3JrLWFyb3VuZDogbm9kZSdzIGJhc2U2NCBpbXBsZW1lbnRhdGlvblxuICAvLyBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgc3RyaW5ncyB3aGlsZSBiYXNlNjQtanNcbiAgLy8gZG9lcyBub3QuLlxuICBpZiAoZW5jb2RpbmcgPT09ICdiYXNlNjQnICYmIHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgc3ViamVjdCA9IHN0cmluZ3RyaW0oc3ViamVjdClcbiAgICB3aGlsZSAoc3ViamVjdC5sZW5ndGggJSA0ICE9PSAwKSB7XG4gICAgICBzdWJqZWN0ID0gc3ViamVjdCArICc9J1xuICAgIH1cbiAgfVxuXG4gIC8vIEZpbmQgdGhlIGxlbmd0aFxuICB2YXIgbGVuZ3RoXG4gIGlmICh0eXBlID09PSAnbnVtYmVyJylcbiAgICBsZW5ndGggPSBjb2VyY2Uoc3ViamVjdClcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpXG4gICAgbGVuZ3RoID0gQnVmZmVyLmJ5dGVMZW5ndGgoc3ViamVjdCwgZW5jb2RpbmcpXG4gIGVsc2UgaWYgKHR5cGUgPT09ICdvYmplY3QnKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0Lmxlbmd0aCkgLy8gQXNzdW1lIG9iamVjdCBpcyBhbiBhcnJheVxuICBlbHNlXG4gICAgdGhyb3cgbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCBuZWVkcyB0byBiZSBhIG51bWJlciwgYXJyYXkgb3Igc3RyaW5nLicpXG5cbiAgdmFyIGJ1ZiA9IGF1Z21lbnQobmV3IHhVaW50OEFycmF5KGxlbmd0aCkpXG4gIGlmIChCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkpIHtcbiAgICAvLyBTcGVlZCBvcHRpbWl6YXRpb24gLS0gdXNlIHNldCBpZiB3ZSdyZSBjb3B5aW5nIGZyb20gYSBVaW50OEFycmF5XG4gICAgYnVmLnNldChzdWJqZWN0KVxuICB9IGVsc2UgaWYgKGlzQXJyYXlJc2goc3ViamVjdCkpIHtcbiAgICAvLyBUcmVhdCBhcnJheS1pc2ggb2JqZWN0cyBhcyBhIGJ5dGUgYXJyYXkuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihzdWJqZWN0KSlcbiAgICAgICAgYnVmW2ldID0gc3ViamVjdC5yZWFkVUludDgoaSlcbiAgICAgIGVsc2VcbiAgICAgICAgYnVmW2ldID0gc3ViamVjdFtpXVxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgIGJ1Zi53cml0ZShzdWJqZWN0LCAwLCBlbmNvZGluZylcbiAgfVxuXG4gIHJldHVybiBidWZcbn1cblxuLy8gU1RBVElDIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24oZW5jb2RpbmcpIHtcbiAgc3dpdGNoICgoZW5jb2RpbmcgKyAnJykudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICBjYXNlICdyYXcnOlxuICAgICAgcmV0dXJuIHRydWVcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuaXNCdWZmZXIgPSBmdW5jdGlvbiBpc0J1ZmZlciAoYikge1xuICByZXR1cm4gYiAmJiBiLl9pc0J1ZmZlclxufVxuXG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGZ1bmN0aW9uIChzdHIsIGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoZW5jb2RpbmcgfHwgJ3V0ZjgnKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldHVybiBzdHIubGVuZ3RoIC8gMlxuXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cikubGVuZ3RoXG5cbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldHVybiBzdHIubGVuZ3RoXG5cbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0dXJuIGJhc2U2NFRvQnl0ZXMoc3RyKS5sZW5ndGhcblxuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG59XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiAobGlzdCwgdG90YWxMZW5ndGgpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGxpc3QpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdVc2FnZTogQnVmZmVyLmNvbmNhdChsaXN0LCBbdG90YWxMZW5ndGhdKVxcbicgK1xuICAgICAgICAnbGlzdCBzaG91bGQgYmUgYW4gQXJyYXkuJylcbiAgfVxuXG4gIHZhciBpXG4gIHZhciBidWZcblxuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcigwKVxuICB9IGVsc2UgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGxpc3RbMF1cbiAgfVxuXG4gIGlmICh0eXBlb2YgdG90YWxMZW5ndGggIT09ICdudW1iZXInKSB7XG4gICAgdG90YWxMZW5ndGggPSAwXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIGJ1ZiA9IGxpc3RbaV1cbiAgICAgIHRvdGFsTGVuZ3RoICs9IGJ1Zi5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmZmVyID0gbmV3IEJ1ZmZlcih0b3RhbExlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICBidWYgPSBsaXN0W2ldXG4gICAgYnVmLmNvcHkoYnVmZmVyLCBwb3MpXG4gICAgcG9zICs9IGJ1Zi5sZW5ndGhcbiAgfVxuICByZXR1cm4gYnVmZmVyXG59XG5cbi8vIElOU1RBTkNFIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gX2hleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgLy8gbXVzdCBiZSBhbiBldmVuIG51bWJlciBvZiBkaWdpdHNcbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcbiAgaWYgKHN0ckxlbiAlIDIgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaGV4IHN0cmluZycpXG4gIH1cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhciBieXRlID0gcGFyc2VJbnQoc3RyaW5nLnN1YnN0cihpICogMiwgMiksIDE2KVxuICAgIGlmIChpc05hTihieXRlKSkgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGhleCBzdHJpbmcnKVxuICAgIGJ1ZltvZmZzZXQgKyBpXSA9IGJ5dGVcbiAgfVxuICBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9IGkgKiAyXG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIF91dGY4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgYnl0ZXMsIHBvc1xuICByZXR1cm4gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPSBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGJ5dGVzLCBwb3NcbiAgcmV0dXJuIEJ1ZmZlci5fY2hhcnNXcml0dGVuID0gYmxpdEJ1ZmZlcihhc2NpaVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gX2JpbmFyeVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIF9hc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGJ5dGVzLCBwb3NcbiAgcmV0dXJuIEJ1ZmZlci5fY2hhcnNXcml0dGVuID0gYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIEJ1ZmZlcldyaXRlIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBTdXBwb3J0IGJvdGggKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKVxuICAvLyBhbmQgdGhlIGxlZ2FjeSAoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpXG4gIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgaWYgKCFpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICB9IGVsc2UgeyAgLy8gbGVnYWN5XG4gICAgdmFyIHN3YXAgPSBlbmNvZGluZ1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgb2Zmc2V0ID0gbGVuZ3RoXG4gICAgbGVuZ3RoID0gc3dhcFxuICB9XG5cbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcblxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldHVybiBfaGV4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldHVybiBfdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICBjYXNlICdhc2NpaSc6XG4gICAgICByZXR1cm4gX2FzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXR1cm4gX2JpbmFyeVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0dXJuIF9iYXNlNjRXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbn1cblxuZnVuY3Rpb24gQnVmZmVyVG9TdHJpbmcgKGVuY29kaW5nLCBzdGFydCwgZW5kKSB7XG4gIHZhciBzZWxmID0gKHRoaXMgaW5zdGFuY2VvZiBQcm94eUJ1ZmZlcilcbiAgICA/IHRoaXMuX3Byb3h5XG4gICAgOiB0aGlzXG5cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpXG4gIHN0YXJ0ID0gTnVtYmVyKHN0YXJ0KSB8fCAwXG4gIGVuZCA9IChlbmQgIT09IHVuZGVmaW5lZClcbiAgICA/IE51bWJlcihlbmQpXG4gICAgOiBlbmQgPSBzZWxmLmxlbmd0aFxuXG4gIC8vIEZhc3RwYXRoIGVtcHR5IHN0cmluZ3NcbiAgaWYgKGVuZCA9PT0gc3RhcnQpXG4gICAgcmV0dXJuICcnXG5cbiAgc3dpdGNoIChlbmNvZGluZykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXR1cm4gX2hleFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG5cbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXR1cm4gX3V0ZjhTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0dXJuIF9hc2NpaVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG5cbiAgICBjYXNlICdiaW5hcnknOlxuICAgICAgcmV0dXJuIF9iaW5hcnlTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldHVybiBfYmFzZTY0U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcblxuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG59XG5cbmZ1bmN0aW9uIEJ1ZmZlclRvSlNPTiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcywgMClcbiAgfVxufVxuXG4vLyBjb3B5KHRhcmdldEJ1ZmZlciwgdGFyZ2V0U3RhcnQ9MCwgc291cmNlU3RhcnQ9MCwgc291cmNlRW5kPWJ1ZmZlci5sZW5ndGgpXG5mdW5jdGlvbiBCdWZmZXJDb3B5ICh0YXJnZXQsIHRhcmdldF9zdGFydCwgc3RhcnQsIGVuZCkge1xuICB2YXIgc291cmNlID0gdGhpc1xuXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICghdGFyZ2V0X3N0YXJ0KSB0YXJnZXRfc3RhcnQgPSAwXG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgc291cmNlLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBpZiAoZW5kIDwgc3RhcnQpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdzb3VyY2VFbmQgPCBzb3VyY2VTdGFydCcpXG4gIGlmICh0YXJnZXRfc3RhcnQgPCAwIHx8IHRhcmdldF9zdGFydCA+PSB0YXJnZXQubGVuZ3RoKVxuICAgIHRocm93IG5ldyBFcnJvcigndGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChzdGFydCA8IDAgfHwgc3RhcnQgPj0gc291cmNlLmxlbmd0aClcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NvdXJjZVN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBpZiAoZW5kIDwgMCB8fCBlbmQgPiBzb3VyY2UubGVuZ3RoKVxuICAgIHRocm93IG5ldyBFcnJvcignc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aClcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldF9zdGFydCA8IGVuZCAtIHN0YXJ0KVxuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgKyBzdGFydFxuXG4gIC8vIGNvcHkhXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZW5kIC0gc3RhcnQ7IGkrKylcbiAgICB0YXJnZXRbaSArIHRhcmdldF9zdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHJldHVybiByZXF1aXJlKCdiYXNlNjQtanMnKS5mcm9tQnl0ZUFycmF5KGJ5dGVzKVxufVxuXG5mdW5jdGlvbiBfdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHZhciByZXMgPSAnJ1xuICB2YXIgdG1wID0gJydcbiAgdmFyIGkgPSAwXG4gIHdoaWxlIChpIDwgYnl0ZXMubGVuZ3RoKSB7XG4gICAgaWYgKGJ5dGVzW2ldIDw9IDB4N0YpIHtcbiAgICAgIHJlcyArPSBkZWNvZGVVdGY4Q2hhcih0bXApICsgU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSlcbiAgICAgIHRtcCA9ICcnXG4gICAgfSBlbHNlIHtcbiAgICAgIHRtcCArPSAnJScgKyBieXRlc1tpXS50b1N0cmluZygxNilcbiAgICB9XG5cbiAgICBpKytcbiAgfVxuXG4gIHJldHVybiByZXMgKyBkZWNvZGVVdGY4Q2hhcih0bXApXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHZhciByZXQgPSAnJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSsrKVxuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldKVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIF9iaW5hcnlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHJldHVybiBfYXNjaWlTbGljZShidWYsIHN0YXJ0LCBlbmQpXG59XG5cbmZ1bmN0aW9uIF9oZXhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG5cbiAgaWYgKCFzdGFydCB8fCBzdGFydCA8IDApIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCB8fCBlbmQgPCAwIHx8IGVuZCA+IGxlbikgZW5kID0gbGVuXG5cbiAgdmFyIG91dCA9ICcnXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgb3V0ICs9IHRvSGV4KGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gb3V0XG59XG5cbi8vIFRPRE86IGFkZCB0ZXN0IHRoYXQgbW9kaWZ5aW5nIHRoZSBuZXcgYnVmZmVyIHNsaWNlIHdpbGwgbW9kaWZ5IG1lbW9yeSBpbiB0aGVcbi8vIG9yaWdpbmFsIGJ1ZmZlciEgVXNlIGNvZGUgZnJvbTpcbi8vIGh0dHA6Ly9ub2RlanMub3JnL2FwaS9idWZmZXIuaHRtbCNidWZmZXJfYnVmX3NsaWNlX3N0YXJ0X2VuZFxuZnVuY3Rpb24gQnVmZmVyU2xpY2UgKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gY2xhbXAoc3RhcnQsIGxlbiwgMClcbiAgZW5kID0gY2xhbXAoZW5kLCBsZW4sIGxlbilcbiAgcmV0dXJuIGF1Z21lbnQodGhpcy5zdWJhcnJheShzdGFydCwgZW5kKSkgLy8gVWludDhBcnJheSBidWlsdC1pbiBtZXRob2Rcbn1cblxuZnVuY3Rpb24gQnVmZmVyUmVhZFVJbnQ4IChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhciBidWYgPSB0aGlzXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSBidWYubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIHJldHVybiBidWZbb2Zmc2V0XVxufVxuXG5mdW5jdGlvbiBfcmVhZFVJbnQxNiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgKGxpdHRsZUVuZGlhbikgPT09ICdib29sZWFuJyxcbiAgICAgICAgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pIHtcbiAgICByZXR1cm5cbiAgfSBlbHNlIGlmIChvZmZzZXQgKyAxID09PSBsZW4pIHtcbiAgICB2YXIgZHYgPSBuZXcgeERhdGFWaWV3KG5ldyB4QXJyYXlCdWZmZXIoMikpXG4gICAgZHYuc2V0VWludDgoMCwgYnVmW2xlbiAtIDFdKVxuICAgIHJldHVybiBkdi5nZXRVaW50MTYoMCwgbGl0dGxlRW5kaWFuKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBidWYuX2RhdGF2aWV3LmdldFVpbnQxNihvZmZzZXQsIGxpdHRsZUVuZGlhbilcbiAgfVxufVxuXG5mdW5jdGlvbiBCdWZmZXJSZWFkVUludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIEJ1ZmZlclJlYWRVSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkVUludDMyIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiAobGl0dGxlRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbikge1xuICAgIHJldHVyblxuICB9IGVsc2UgaWYgKG9mZnNldCArIDMgPj0gbGVuKSB7XG4gICAgdmFyIGR2ID0gbmV3IHhEYXRhVmlldyhuZXcgeEFycmF5QnVmZmVyKDQpKVxuICAgIGZvciAodmFyIGkgPSAwOyBpICsgb2Zmc2V0IDwgbGVuOyBpKyspIHtcbiAgICAgIGR2LnNldFVpbnQ4KGksIGJ1ZltpICsgb2Zmc2V0XSlcbiAgICB9XG4gICAgcmV0dXJuIGR2LmdldFVpbnQzMigwLCBsaXR0bGVFbmRpYW4pXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJ1Zi5fZGF0YXZpZXcuZ2V0VWludDMyKG9mZnNldCwgbGl0dGxlRW5kaWFuKVxuICB9XG59XG5cbmZ1bmN0aW9uIEJ1ZmZlclJlYWRVSW50MzJMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MzIodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gQnVmZmVyUmVhZFVJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gQnVmZmVyUmVhZEludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFyIGJ1ZiA9IHRoaXNcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IGJ1Zi5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuIGJ1Zi5fZGF0YXZpZXcuZ2V0SW50OChvZmZzZXQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkSW50MTYgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIChsaXR0bGVFbmRpYW4pID09PSAnYm9vbGVhbicsXG4gICAgICAgICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKSB7XG4gICAgcmV0dXJuXG4gIH0gZWxzZSBpZiAob2Zmc2V0ICsgMSA9PT0gbGVuKSB7XG4gICAgdmFyIGR2ID0gbmV3IHhEYXRhVmlldyhuZXcgeEFycmF5QnVmZmVyKDIpKVxuICAgIGR2LnNldFVpbnQ4KDAsIGJ1ZltsZW4gLSAxXSlcbiAgICByZXR1cm4gZHYuZ2V0SW50MTYoMCwgbGl0dGxlRW5kaWFuKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBidWYuX2RhdGF2aWV3LmdldEludDE2KG9mZnNldCwgbGl0dGxlRW5kaWFuKVxuICB9XG59XG5cbmZ1bmN0aW9uIEJ1ZmZlclJlYWRJbnQxNkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDE2KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIEJ1ZmZlclJlYWRJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZEludDMyIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiAobGl0dGxlRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbikge1xuICAgIHJldHVyblxuICB9IGVsc2UgaWYgKG9mZnNldCArIDMgPj0gbGVuKSB7XG4gICAgdmFyIGR2ID0gbmV3IHhEYXRhVmlldyhuZXcgeEFycmF5QnVmZmVyKDQpKVxuICAgIGZvciAodmFyIGkgPSAwOyBpICsgb2Zmc2V0IDwgbGVuOyBpKyspIHtcbiAgICAgIGR2LnNldFVpbnQ4KGksIGJ1ZltpICsgb2Zmc2V0XSlcbiAgICB9XG4gICAgcmV0dXJuIGR2LmdldEludDMyKDAsIGxpdHRsZUVuZGlhbilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYnVmLl9kYXRhdmlldy5nZXRJbnQzMihvZmZzZXQsIGxpdHRsZUVuZGlhbilcbiAgfVxufVxuXG5mdW5jdGlvbiBCdWZmZXJSZWFkSW50MzJMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBCdWZmZXJSZWFkSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQzMih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRGbG9hdCAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgKGxpdHRsZUVuZGlhbikgPT09ICdib29sZWFuJyxcbiAgICAgICAgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHJldHVybiBidWYuX2RhdGF2aWV3LmdldEZsb2F0MzIob2Zmc2V0LCBsaXR0bGVFbmRpYW4pXG59XG5cbmZ1bmN0aW9uIEJ1ZmZlclJlYWRGbG9hdExFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEZsb2F0KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIEJ1ZmZlclJlYWRGbG9hdEJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEZsb2F0KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZERvdWJsZSAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgKGxpdHRsZUVuZGlhbikgPT09ICdib29sZWFuJyxcbiAgICAgICAgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgKyA3IDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHJldHVybiBidWYuX2RhdGF2aWV3LmdldEZsb2F0NjQob2Zmc2V0LCBsaXR0bGVFbmRpYW4pXG59XG5cbmZ1bmN0aW9uIEJ1ZmZlclJlYWREb3VibGVMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gQnVmZmVyUmVhZERvdWJsZUJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZERvdWJsZSh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gQnVmZmVyV3JpdGVVSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFyIGJ1ZiA9IHRoaXNcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgYnVmLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSBidWYubGVuZ3RoKSByZXR1cm5cblxuICBidWZbb2Zmc2V0XSA9IHZhbHVlXG59XG5cbmZ1bmN0aW9uIF93cml0ZVVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgKGxpdHRsZUVuZGlhbikgPT09ICdib29sZWFuJyxcbiAgICAgICAgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZilcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKSB7XG4gICAgcmV0dXJuXG4gIH0gZWxzZSBpZiAob2Zmc2V0ICsgMSA9PT0gbGVuKSB7XG4gICAgdmFyIGR2ID0gbmV3IHhEYXRhVmlldyhuZXcgeEFycmF5QnVmZmVyKDIpKVxuICAgIGR2LnNldFVpbnQxNigwLCB2YWx1ZSwgbGl0dGxlRW5kaWFuKVxuICAgIGJ1ZltvZmZzZXRdID0gZHYuZ2V0VWludDgoMClcbiAgfSBlbHNlIHtcbiAgICBidWYuX2RhdGF2aWV3LnNldFVpbnQxNihvZmZzZXQsIHZhbHVlLCBsaXR0bGVFbmRpYW4pXG4gIH1cbn1cblxuZnVuY3Rpb24gQnVmZmVyV3JpdGVVSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBCdWZmZXJXcml0ZVVJbnQxNkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVVSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIChsaXR0bGVFbmRpYW4pID09PSAnYm9vbGVhbicsXG4gICAgICAgICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmZmZmZmZmKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pIHtcbiAgICByZXR1cm5cbiAgfSBlbHNlIGlmIChvZmZzZXQgKyAzID49IGxlbikge1xuICAgIHZhciBkdiA9IG5ldyB4RGF0YVZpZXcobmV3IHhBcnJheUJ1ZmZlcig0KSlcbiAgICBkdi5zZXRVaW50MzIoMCwgdmFsdWUsIGxpdHRsZUVuZGlhbilcbiAgICBmb3IgKHZhciBpID0gMDsgaSArIG9mZnNldCA8IGxlbjsgaSsrKSB7XG4gICAgICBidWZbaSArIG9mZnNldF0gPSBkdi5nZXRVaW50OChpKVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBidWYuX2RhdGF2aWV3LnNldFVpbnQzMihvZmZzZXQsIHZhbHVlLCBsaXR0bGVFbmRpYW4pXG4gIH1cbn1cblxuZnVuY3Rpb24gQnVmZmVyV3JpdGVVSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBCdWZmZXJXcml0ZVVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBCdWZmZXJXcml0ZUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhciBidWYgPSB0aGlzXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZiwgLTB4ODApXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IGJ1Zi5sZW5ndGgpIHJldHVyblxuXG4gIGJ1Zi5fZGF0YXZpZXcuc2V0SW50OChvZmZzZXQsIHZhbHVlKVxufVxuXG5mdW5jdGlvbiBfd3JpdGVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgKGxpdHRsZUVuZGlhbikgPT09ICdib29sZWFuJyxcbiAgICAgICAgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2ZmZiwgLTB4ODAwMClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKSB7XG4gICAgcmV0dXJuXG4gIH0gZWxzZSBpZiAob2Zmc2V0ICsgMSA9PT0gbGVuKSB7XG4gICAgdmFyIGR2ID0gbmV3IHhEYXRhVmlldyhuZXcgeEFycmF5QnVmZmVyKDIpKVxuICAgIGR2LnNldEludDE2KDAsIHZhbHVlLCBsaXR0bGVFbmRpYW4pXG4gICAgYnVmW29mZnNldF0gPSBkdi5nZXRVaW50OCgwKVxuICB9IGVsc2Uge1xuICAgIGJ1Zi5fZGF0YXZpZXcuc2V0SW50MTYob2Zmc2V0LCB2YWx1ZSwgbGl0dGxlRW5kaWFuKVxuICB9XG59XG5cbmZ1bmN0aW9uIEJ1ZmZlcldyaXRlSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIEJ1ZmZlcldyaXRlSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgKGxpdHRsZUVuZGlhbikgPT09ICdib29sZWFuJyxcbiAgICAgICAgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pIHtcbiAgICByZXR1cm5cbiAgfSBlbHNlIGlmIChvZmZzZXQgKyAzID49IGxlbikge1xuICAgIHZhciBkdiA9IG5ldyB4RGF0YVZpZXcobmV3IHhBcnJheUJ1ZmZlcig0KSlcbiAgICBkdi5zZXRJbnQzMigwLCB2YWx1ZSwgbGl0dGxlRW5kaWFuKVxuICAgIGZvciAodmFyIGkgPSAwOyBpICsgb2Zmc2V0IDwgbGVuOyBpKyspIHtcbiAgICAgIGJ1ZltpICsgb2Zmc2V0XSA9IGR2LmdldFVpbnQ4KGkpXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGJ1Zi5fZGF0YXZpZXcuc2V0SW50MzIob2Zmc2V0LCB2YWx1ZSwgbGl0dGxlRW5kaWFuKVxuICB9XG59XG5cbmZ1bmN0aW9uIEJ1ZmZlcldyaXRlSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIEJ1ZmZlcldyaXRlSW50MzJCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVGbG9hdCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgKGxpdHRsZUVuZGlhbikgPT09ICdib29sZWFuJyxcbiAgICAgICAgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pIHtcbiAgICByZXR1cm5cbiAgfSBlbHNlIGlmIChvZmZzZXQgKyAzID49IGxlbikge1xuICAgIHZhciBkdiA9IG5ldyB4RGF0YVZpZXcobmV3IHhBcnJheUJ1ZmZlcig0KSlcbiAgICBkdi5zZXRGbG9hdDMyKDAsIHZhbHVlLCBsaXR0bGVFbmRpYW4pXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgKyBvZmZzZXQgPCBsZW47IGkrKykge1xuICAgICAgYnVmW2kgKyBvZmZzZXRdID0gZHYuZ2V0VWludDgoaSlcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgYnVmLl9kYXRhdmlldy5zZXRGbG9hdDMyKG9mZnNldCwgdmFsdWUsIGxpdHRsZUVuZGlhbilcbiAgfVxufVxuXG5mdW5jdGlvbiBCdWZmZXJXcml0ZUZsb2F0TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBCdWZmZXJXcml0ZUZsb2F0QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiAobGl0dGxlRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgNyA8IGJ1Zi5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmSUVFRTc1NCh2YWx1ZSwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKSB7XG4gICAgcmV0dXJuXG4gIH0gZWxzZSBpZiAob2Zmc2V0ICsgNyA+PSBsZW4pIHtcbiAgICB2YXIgZHYgPSBuZXcgeERhdGFWaWV3KG5ldyB4QXJyYXlCdWZmZXIoOCkpXG4gICAgZHYuc2V0RmxvYXQ2NCgwLCB2YWx1ZSwgbGl0dGxlRW5kaWFuKVxuICAgIGZvciAodmFyIGkgPSAwOyBpICsgb2Zmc2V0IDwgbGVuOyBpKyspIHtcbiAgICAgIGJ1ZltpICsgb2Zmc2V0XSA9IGR2LmdldFVpbnQ4KGkpXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGJ1Zi5fZGF0YXZpZXcuc2V0RmxvYXQ2NChvZmZzZXQsIHZhbHVlLCBsaXR0bGVFbmRpYW4pXG4gIH1cbn1cblxuZnVuY3Rpb24gQnVmZmVyV3JpdGVEb3VibGVMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBCdWZmZXJXcml0ZURvdWJsZUJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBmaWxsKHZhbHVlLCBzdGFydD0wLCBlbmQ9YnVmZmVyLmxlbmd0aClcbmZ1bmN0aW9uIEJ1ZmZlckZpbGwgKHZhbHVlLCBzdGFydCwgZW5kKSB7XG4gIGlmICghdmFsdWUpIHZhbHVlID0gMFxuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQpIGVuZCA9IHRoaXMubGVuZ3RoXG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICB2YWx1ZSA9IHZhbHVlLmNoYXJDb2RlQXQoMClcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInIHx8IGlzTmFOKHZhbHVlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcigndmFsdWUgaXMgbm90IGEgbnVtYmVyJylcbiAgfVxuXG4gIGlmIChlbmQgPCBzdGFydCkgdGhyb3cgbmV3IEVycm9yKCdlbmQgPCBzdGFydCcpXG5cbiAgLy8gRmlsbCAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICBpZiAoc3RhcnQgPCAwIHx8IHN0YXJ0ID49IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzdGFydCBvdXQgb2YgYm91bmRzJylcbiAgfVxuXG4gIGlmIChlbmQgPCAwIHx8IGVuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdlbmQgb3V0IG9mIGJvdW5kcycpXG4gIH1cblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHRoaXNbaV0gPSB2YWx1ZVxuICB9XG59XG5cbmZ1bmN0aW9uIEJ1ZmZlckluc3BlY3QgKCkge1xuICB2YXIgb3V0ID0gW11cbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBvdXRbaV0gPSB0b0hleCh0aGlzW2ldKVxuICAgIGlmIChpID09PSBleHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTKSB7XG4gICAgICBvdXRbaSArIDFdID0gJy4uLidcbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIHJldHVybiAnPEJ1ZmZlciAnICsgb3V0LmpvaW4oJyAnKSArICc+J1xufVxuXG4vLyBDcmVhdGVzIGEgbmV3IGBBcnJheUJ1ZmZlcmAgd2l0aCB0aGUgKmNvcGllZCogbWVtb3J5IG9mIHRoZSBidWZmZXIgaW5zdGFuY2UuXG4vLyBBZGRlZCBpbiBOb2RlIDAuMTIuXG5mdW5jdGlvbiBCdWZmZXJUb0FycmF5QnVmZmVyICgpIHtcbiAgcmV0dXJuIChuZXcgQnVmZmVyKHRoaXMpKS5idWZmZXJcbn1cblxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIHN0cmluZ3RyaW0gKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpXG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG59XG5cbi8qKlxuICogQ2hlY2sgdG8gc2VlIGlmIHRoZSBicm93c2VyIHN1cHBvcnRzIGF1Z21lbnRpbmcgYSBgVWludDhBcnJheWAgaW5zdGFuY2UuXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBfYnJvd3NlclN1cHBvcnQgKCkge1xuICB2YXIgYXJyID0gbmV3IHhVaW50OEFycmF5KDApXG4gIGFyci5mb28gPSBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9XG5cbiAgdHJ5IHtcbiAgICByZXR1cm4gKDQyID09PSBhcnIuZm9vKCkpXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzOiBQcm94eUJ1ZmZlclxuICogPT09PT09PT09PT09PT09PT09XG4gKlxuICogT25seSB1c2VkIGluIEZpcmVmb3gsIHNpbmNlIEZpcmVmb3ggZG9lcyBub3QgYWxsb3cgYXVnbWVudGluZyBcIm5hdGl2ZVwiXG4gKiBvYmplY3RzIChsaWtlIFVpbnQ4QXJyYXkgaW5zdGFuY2VzKSB3aXRoIG5ldyBwcm9wZXJ0aWVzIGZvciBzb21lIHVua25vd25cbiAqIChwcm9iYWJseSBzaWxseSkgcmVhc29uLiBTbyB3ZSdsbMKgdXNlIGFuIEVTNiBQcm94eSAoc3VwcG9ydGVkIHNpbmNlXG4gKiBGaXJlZm94IDE4KSB0byB3cmFwIHRoZSBVaW50OEFycmF5IGluc3RhbmNlIHdpdGhvdXQgYWN0dWFsbHkgYWRkaW5nIGFueVxuICogcHJvcGVydGllcyB0byBpdC5cbiAqXG4gKiBJbnN0YW5jZXMgb2YgdGhpcyBcImZha2VcIiBCdWZmZXIgY2xhc3MgYXJlIHRoZSBcInRhcmdldFwiIG9mIHRoZVxuICogRVM2IFByb3h5IChzZWUgYGF1Z21lbnRgIGZ1bmN0aW9uKS5cbiAqXG4gKiBXZSBjb3VsZG4ndCBqdXN0IHVzZSB0aGUgYFVpbnQ4QXJyYXlgIGFzIHRoZSB0YXJnZXQgb2YgdGhlIGBQcm94eWAgYmVjYXVzZVxuICogUHJveGllcyBoYXZlIGFuIGltcG9ydGFudCBsaW1pdGF0aW9uIG9uIHRyYXBwaW5nIHRoZSBgdG9TdHJpbmdgIG1ldGhvZC5cbiAqIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwocHJveHkpYCBnZXRzIGNhbGxlZCB3aGVuZXZlciBzb21ldGhpbmcgaXNcbiAqIGltcGxpY2l0bHkgY2FzdCB0byBhIFN0cmluZy4gVW5mb3J0dW5hdGVseSwgd2l0aCBhIGBQcm94eWAgdGhpc1xuICogdW5jb25kaXRpb25hbGx5IHJldHVybnMgYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0YXJnZXQpYCB3aGljaCB3b3VsZFxuICogYWx3YXlzIHJldHVybiBcIltvYmplY3QgVWludDhBcnJheV1cIiBpZiB3ZSB1c2VkIHRoZSBgVWludDhBcnJheWAgaW5zdGFuY2UgYXNcbiAqIHRoZSB0YXJnZXQuIEFuZCwgcmVtZW1iZXIsIGluIEZpcmVmb3ggd2UgY2Fubm90IHJlZGVmaW5lIHRoZSBgVWludDhBcnJheWBcbiAqIGluc3RhbmNlJ3MgYHRvU3RyaW5nYCBtZXRob2QuXG4gKlxuICogU28sIHdlIHVzZSB0aGlzIGBQcm94eUJ1ZmZlcmAgY2xhc3MgYXMgdGhlIHByb3h5J3MgXCJ0YXJnZXRcIi4gU2luY2UgdGhpcyBjbGFzc1xuICogaGFzIGl0cyBvd24gY3VzdG9tIGB0b1N0cmluZ2AgbWV0aG9kLCBpdCB3aWxsIGdldCBjYWxsZWQgd2hlbmV2ZXIgYHRvU3RyaW5nYFxuICogZ2V0cyBjYWxsZWQsIGltcGxpY2l0bHkgb3IgZXhwbGljaXRseSwgb24gdGhlIGBQcm94eWAgaW5zdGFuY2UuXG4gKlxuICogV2UgYWxzbyBoYXZlIHRvIGRlZmluZSB0aGUgVWludDhBcnJheSBtZXRob2RzIGBzdWJhcnJheWAgYW5kIGBzZXRgIG9uXG4gKiBgUHJveHlCdWZmZXJgIGJlY2F1c2UgaWYgd2UgZGlkbid0IHRoZW4gYHByb3h5LnN1YmFycmF5KDApYCB3b3VsZCBoYXZlIGl0c1xuICogYHRoaXNgIHNldCB0byBgcHJveHlgIChhIGBQcm94eWAgaW5zdGFuY2UpIHdoaWNoIHRocm93cyBhbiBleGNlcHRpb24gaW5cbiAqIEZpcmVmb3ggd2hpY2ggZXhwZWN0cyBpdCB0byBiZSBhIGBUeXBlZEFycmF5YCBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gUHJveHlCdWZmZXIgKGFycikge1xuICB0aGlzLl9hcnIgPSBhcnJcblxuICBpZiAoYXJyLmJ5dGVMZW5ndGggIT09IDApXG4gICAgdGhpcy5fZGF0YXZpZXcgPSBuZXcgeERhdGFWaWV3KGFyci5idWZmZXIsIGFyci5ieXRlT2Zmc2V0LCBhcnIuYnl0ZUxlbmd0aClcbn1cblxuUHJveHlCdWZmZXIucHJvdG90eXBlLndyaXRlID0gQnVmZmVyV3JpdGVcblByb3h5QnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IEJ1ZmZlclRvU3RyaW5nXG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUudG9Mb2NhbGVTdHJpbmcgPSBCdWZmZXJUb1N0cmluZ1xuUHJveHlCdWZmZXIucHJvdG90eXBlLnRvSlNPTiA9IEJ1ZmZlclRvSlNPTlxuUHJveHlCdWZmZXIucHJvdG90eXBlLmNvcHkgPSBCdWZmZXJDb3B5XG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBCdWZmZXJTbGljZVxuUHJveHlCdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IEJ1ZmZlclJlYWRVSW50OFxuUHJveHlCdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IEJ1ZmZlclJlYWRVSW50MTZMRVxuUHJveHlCdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IEJ1ZmZlclJlYWRVSW50MTZCRVxuUHJveHlCdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJMRSA9IEJ1ZmZlclJlYWRVSW50MzJMRVxuUHJveHlCdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IEJ1ZmZlclJlYWRVSW50MzJCRVxuUHJveHlCdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gQnVmZmVyUmVhZEludDhcblByb3h5QnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZMRSA9IEJ1ZmZlclJlYWRJbnQxNkxFXG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkUgPSBCdWZmZXJSZWFkSW50MTZCRVxuUHJveHlCdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gQnVmZmVyUmVhZEludDMyTEVcblByb3h5QnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IEJ1ZmZlclJlYWRJbnQzMkJFXG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBCdWZmZXJSZWFkRmxvYXRMRVxuUHJveHlCdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gQnVmZmVyUmVhZEZsb2F0QkVcblByb3h5QnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBCdWZmZXJSZWFkRG91YmxlTEVcblByb3h5QnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBCdWZmZXJSZWFkRG91YmxlQkVcblByb3h5QnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQ4ID0gQnVmZmVyV3JpdGVVSW50OFxuUHJveHlCdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBCdWZmZXJXcml0ZVVJbnQxNkxFXG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IEJ1ZmZlcldyaXRlVUludDE2QkVcblByb3h5QnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gQnVmZmVyV3JpdGVVSW50MzJMRVxuUHJveHlCdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBCdWZmZXJXcml0ZVVJbnQzMkJFXG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gQnVmZmVyV3JpdGVJbnQ4XG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkxFID0gQnVmZmVyV3JpdGVJbnQxNkxFXG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkJFID0gQnVmZmVyV3JpdGVJbnQxNkJFXG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gQnVmZmVyV3JpdGVJbnQzMkxFXG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkJFID0gQnVmZmVyV3JpdGVJbnQzMkJFXG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gQnVmZmVyV3JpdGVGbG9hdExFXG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gQnVmZmVyV3JpdGVGbG9hdEJFXG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IEJ1ZmZlcldyaXRlRG91YmxlTEVcblByb3h5QnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFID0gQnVmZmVyV3JpdGVEb3VibGVCRVxuUHJveHlCdWZmZXIucHJvdG90eXBlLmZpbGwgPSBCdWZmZXJGaWxsXG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IEJ1ZmZlckluc3BlY3RcblByb3h5QnVmZmVyLnByb3RvdHlwZS50b0FycmF5QnVmZmVyID0gQnVmZmVyVG9BcnJheUJ1ZmZlclxuUHJveHlCdWZmZXIucHJvdG90eXBlLl9pc0J1ZmZlciA9IHRydWVcblByb3h5QnVmZmVyLnByb3RvdHlwZS5zdWJhcnJheSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuX2Fyci5zdWJhcnJheS5hcHBseSh0aGlzLl9hcnIsIGFyZ3VtZW50cylcbn1cblByb3h5QnVmZmVyLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLl9hcnIuc2V0LmFwcGx5KHRoaXMuX2FyciwgYXJndW1lbnRzKVxufVxuXG52YXIgUHJveHlIYW5kbGVyID0ge1xuICBnZXQ6IGZ1bmN0aW9uICh0YXJnZXQsIG5hbWUpIHtcbiAgICBpZiAobmFtZSBpbiB0YXJnZXQpIHJldHVybiB0YXJnZXRbbmFtZV1cbiAgICBlbHNlIHJldHVybiB0YXJnZXQuX2FycltuYW1lXVxuICB9LFxuICBzZXQ6IGZ1bmN0aW9uICh0YXJnZXQsIG5hbWUsIHZhbHVlKSB7XG4gICAgdGFyZ2V0Ll9hcnJbbmFtZV0gPSB2YWx1ZVxuICB9XG59XG5cbmZ1bmN0aW9uIGF1Z21lbnQgKGFycikge1xuICBpZiAoYnJvd3NlclN1cHBvcnQgPT09IHVuZGVmaW5lZCkge1xuICAgIGJyb3dzZXJTdXBwb3J0ID0gX2Jyb3dzZXJTdXBwb3J0KClcbiAgfVxuXG4gIGlmIChicm93c2VyU3VwcG9ydCkge1xuICAgIC8vIEF1Z21lbnQgdGhlIFVpbnQ4QXJyYXkgKmluc3RhbmNlKiAobm90IHRoZSBjbGFzcyEpIHdpdGggQnVmZmVyIG1ldGhvZHNcbiAgICBhcnIud3JpdGUgPSBCdWZmZXJXcml0ZVxuICAgIGFyci50b1N0cmluZyA9IEJ1ZmZlclRvU3RyaW5nXG4gICAgYXJyLnRvTG9jYWxlU3RyaW5nID0gQnVmZmVyVG9TdHJpbmdcbiAgICBhcnIudG9KU09OID0gQnVmZmVyVG9KU09OXG4gICAgYXJyLmNvcHkgPSBCdWZmZXJDb3B5XG4gICAgYXJyLnNsaWNlID0gQnVmZmVyU2xpY2VcbiAgICBhcnIucmVhZFVJbnQ4ID0gQnVmZmVyUmVhZFVJbnQ4XG4gICAgYXJyLnJlYWRVSW50MTZMRSA9IEJ1ZmZlclJlYWRVSW50MTZMRVxuICAgIGFyci5yZWFkVUludDE2QkUgPSBCdWZmZXJSZWFkVUludDE2QkVcbiAgICBhcnIucmVhZFVJbnQzMkxFID0gQnVmZmVyUmVhZFVJbnQzMkxFXG4gICAgYXJyLnJlYWRVSW50MzJCRSA9IEJ1ZmZlclJlYWRVSW50MzJCRVxuICAgIGFyci5yZWFkSW50OCA9IEJ1ZmZlclJlYWRJbnQ4XG4gICAgYXJyLnJlYWRJbnQxNkxFID0gQnVmZmVyUmVhZEludDE2TEVcbiAgICBhcnIucmVhZEludDE2QkUgPSBCdWZmZXJSZWFkSW50MTZCRVxuICAgIGFyci5yZWFkSW50MzJMRSA9IEJ1ZmZlclJlYWRJbnQzMkxFXG4gICAgYXJyLnJlYWRJbnQzMkJFID0gQnVmZmVyUmVhZEludDMyQkVcbiAgICBhcnIucmVhZEZsb2F0TEUgPSBCdWZmZXJSZWFkRmxvYXRMRVxuICAgIGFyci5yZWFkRmxvYXRCRSA9IEJ1ZmZlclJlYWRGbG9hdEJFXG4gICAgYXJyLnJlYWREb3VibGVMRSA9IEJ1ZmZlclJlYWREb3VibGVMRVxuICAgIGFyci5yZWFkRG91YmxlQkUgPSBCdWZmZXJSZWFkRG91YmxlQkVcbiAgICBhcnIud3JpdGVVSW50OCA9IEJ1ZmZlcldyaXRlVUludDhcbiAgICBhcnIud3JpdGVVSW50MTZMRSA9IEJ1ZmZlcldyaXRlVUludDE2TEVcbiAgICBhcnIud3JpdGVVSW50MTZCRSA9IEJ1ZmZlcldyaXRlVUludDE2QkVcbiAgICBhcnIud3JpdGVVSW50MzJMRSA9IEJ1ZmZlcldyaXRlVUludDMyTEVcbiAgICBhcnIud3JpdGVVSW50MzJCRSA9IEJ1ZmZlcldyaXRlVUludDMyQkVcbiAgICBhcnIud3JpdGVJbnQ4ID0gQnVmZmVyV3JpdGVJbnQ4XG4gICAgYXJyLndyaXRlSW50MTZMRSA9IEJ1ZmZlcldyaXRlSW50MTZMRVxuICAgIGFyci53cml0ZUludDE2QkUgPSBCdWZmZXJXcml0ZUludDE2QkVcbiAgICBhcnIud3JpdGVJbnQzMkxFID0gQnVmZmVyV3JpdGVJbnQzMkxFXG4gICAgYXJyLndyaXRlSW50MzJCRSA9IEJ1ZmZlcldyaXRlSW50MzJCRVxuICAgIGFyci53cml0ZUZsb2F0TEUgPSBCdWZmZXJXcml0ZUZsb2F0TEVcbiAgICBhcnIud3JpdGVGbG9hdEJFID0gQnVmZmVyV3JpdGVGbG9hdEJFXG4gICAgYXJyLndyaXRlRG91YmxlTEUgPSBCdWZmZXJXcml0ZURvdWJsZUxFXG4gICAgYXJyLndyaXRlRG91YmxlQkUgPSBCdWZmZXJXcml0ZURvdWJsZUJFXG4gICAgYXJyLmZpbGwgPSBCdWZmZXJGaWxsXG4gICAgYXJyLmluc3BlY3QgPSBCdWZmZXJJbnNwZWN0XG4gICAgYXJyLnRvQXJyYXlCdWZmZXIgPSBCdWZmZXJUb0FycmF5QnVmZmVyXG4gICAgYXJyLl9pc0J1ZmZlciA9IHRydWVcblxuICAgIGlmIChhcnIuYnl0ZUxlbmd0aCAhPT0gMClcbiAgICAgIGFyci5fZGF0YXZpZXcgPSBuZXcgeERhdGFWaWV3KGFyci5idWZmZXIsIGFyci5ieXRlT2Zmc2V0LCBhcnIuYnl0ZUxlbmd0aClcblxuICAgIHJldHVybiBhcnJcblxuICB9IGVsc2Uge1xuICAgIC8vIFRoaXMgaXMgYSBicm93c2VyIHRoYXQgZG9lc24ndCBzdXBwb3J0IGF1Z21lbnRpbmcgdGhlIGBVaW50OEFycmF5YFxuICAgIC8vIGluc3RhbmNlICgqYWhlbSogRmlyZWZveCkgc28gdXNlIGFuIEVTNiBgUHJveHlgLlxuICAgIHZhciBwcm94eUJ1ZmZlciA9IG5ldyBQcm94eUJ1ZmZlcihhcnIpXG4gICAgdmFyIHByb3h5ID0gbmV3IFByb3h5KHByb3h5QnVmZmVyLCBQcm94eUhhbmRsZXIpXG4gICAgcHJveHlCdWZmZXIuX3Byb3h5ID0gcHJveHlcbiAgICByZXR1cm4gcHJveHlcbiAgfVxufVxuXG4vLyBzbGljZShzdGFydCwgZW5kKVxuZnVuY3Rpb24gY2xhbXAgKGluZGV4LCBsZW4sIGRlZmF1bHRWYWx1ZSkge1xuICBpZiAodHlwZW9mIGluZGV4ICE9PSAnbnVtYmVyJykgcmV0dXJuIGRlZmF1bHRWYWx1ZVxuICBpbmRleCA9IH5+aW5kZXg7ICAvLyBDb2VyY2UgdG8gaW50ZWdlci5cbiAgaWYgKGluZGV4ID49IGxlbikgcmV0dXJuIGxlblxuICBpZiAoaW5kZXggPj0gMCkgcmV0dXJuIGluZGV4XG4gIGluZGV4ICs9IGxlblxuICBpZiAoaW5kZXggPj0gMCkgcmV0dXJuIGluZGV4XG4gIHJldHVybiAwXG59XG5cbmZ1bmN0aW9uIGNvZXJjZSAobGVuZ3RoKSB7XG4gIC8vIENvZXJjZSBsZW5ndGggdG8gYSBudW1iZXIgKHBvc3NpYmx5IE5hTiksIHJvdW5kIHVwXG4gIC8vIGluIGNhc2UgaXQncyBmcmFjdGlvbmFsIChlLmcuIDEyMy40NTYpIHRoZW4gZG8gYVxuICAvLyBkb3VibGUgbmVnYXRlIHRvIGNvZXJjZSBhIE5hTiB0byAwLiBFYXN5LCByaWdodD9cbiAgbGVuZ3RoID0gfn5NYXRoLmNlaWwoK2xlbmd0aClcbiAgcmV0dXJuIGxlbmd0aCA8IDAgPyAwIDogbGVuZ3RoXG59XG5cbmZ1bmN0aW9uIGlzQXJyYXlJc2ggKHN1YmplY3QpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoc3ViamVjdCkgfHwgQnVmZmVyLmlzQnVmZmVyKHN1YmplY3QpIHx8XG4gICAgICBzdWJqZWN0ICYmIHR5cGVvZiBzdWJqZWN0ID09PSAnb2JqZWN0JyAmJlxuICAgICAgdHlwZW9mIHN1YmplY3QubGVuZ3RoID09PSAnbnVtYmVyJ1xufVxuXG5mdW5jdGlvbiB0b0hleCAobikge1xuICBpZiAobiA8IDE2KSByZXR1cm4gJzAnICsgbi50b1N0cmluZygxNilcbiAgcmV0dXJuIG4udG9TdHJpbmcoMTYpXG59XG5cbmZ1bmN0aW9uIHV0ZjhUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKVxuICAgIGlmIChzdHIuY2hhckNvZGVBdChpKSA8PSAweDdGKVxuICAgICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkpXG4gICAgZWxzZSB7XG4gICAgICB2YXIgaCA9IGVuY29kZVVSSUNvbXBvbmVudChzdHIuY2hhckF0KGkpKS5zdWJzdHIoMSkuc3BsaXQoJyUnKVxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBoLmxlbmd0aDsgaisrKVxuICAgICAgICBieXRlQXJyYXkucHVzaChwYXJzZUludChoW2pdLCAxNikpXG4gICAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYXNjaWlUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgLy8gTm9kZSdzIGNvZGUgc2VlbXMgdG8gYmUgZG9pbmcgdGhpcyBhbmQgbm90ICYgMHg3Ri4uXG4gICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkgJiAweEZGKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIHJlcXVpcmUoJ2Jhc2U2NC1qcycpLnRvQnl0ZUFycmF5KHN0cilcbn1cblxuZnVuY3Rpb24gYmxpdEJ1ZmZlciAoc3JjLCBkc3QsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBwb3MsIGkgPSAwXG4gIHdoaWxlIChpIDwgbGVuZ3RoKSB7XG4gICAgaWYgKChpICsgb2Zmc2V0ID49IGRzdC5sZW5ndGgpIHx8IChpID49IHNyYy5sZW5ndGgpKVxuICAgICAgYnJlYWtcblxuICAgIGRzdFtpICsgb2Zmc2V0XSA9IHNyY1tpXVxuICAgIGkrK1xuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIGRlY29kZVV0ZjhDaGFyIChzdHIpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHN0cilcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoMHhGRkZEKSAvLyBVVEYgOCBpbnZhbGlkIGNoYXJcbiAgfVxufVxuXG4vKlxuICogV2UgaGF2ZSB0byBtYWtlIHN1cmUgdGhhdCB0aGUgdmFsdWUgaXMgYSB2YWxpZCBpbnRlZ2VyLiBUaGlzIG1lYW5zIHRoYXQgaXRcbiAqIGlzIG5vbi1uZWdhdGl2ZS4gSXQgaGFzIG5vIGZyYWN0aW9uYWwgY29tcG9uZW50IGFuZCB0aGF0IGl0IGRvZXMgbm90XG4gKiBleGNlZWQgdGhlIG1heGltdW0gYWxsb3dlZCB2YWx1ZS5cbiAqXG4gKiAgICAgIHZhbHVlICAgICAgICAgICBUaGUgbnVtYmVyIHRvIGNoZWNrIGZvciB2YWxpZGl0eVxuICpcbiAqICAgICAgbWF4ICAgICAgICAgICAgIFRoZSBtYXhpbXVtIHZhbHVlXG4gKi9cbmZ1bmN0aW9uIHZlcmlmdWludCAodmFsdWUsIG1heCkge1xuICBhc3NlcnQodHlwZW9mICh2YWx1ZSkgPT0gJ251bWJlcicsICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgYXNzZXJ0KHZhbHVlID49IDAsXG4gICAgICAnc3BlY2lmaWVkIGEgbmVnYXRpdmUgdmFsdWUgZm9yIHdyaXRpbmcgYW4gdW5zaWduZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgaXMgbGFyZ2VyIHRoYW4gbWF4aW11bSB2YWx1ZSBmb3IgdHlwZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbi8qXG4gKiBBIHNlcmllcyBvZiBjaGVja3MgdG8gbWFrZSBzdXJlIHdlIGFjdHVhbGx5IGhhdmUgYSBzaWduZWQgMzItYml0IG51bWJlclxuICovXG5mdW5jdGlvbiB2ZXJpZnNpbnQodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgKHZhbHVlKSA9PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKVxufVxuXG5mdW5jdGlvbiB2ZXJpZklFRUU3NTQodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgKHZhbHVlKSA9PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKVxufVxuXG5mdW5jdGlvbiBhc3NlcnQgKHRlc3QsIG1lc3NhZ2UpIHtcbiAgaWYgKCF0ZXN0KSB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSB8fCAnRmFpbGVkIGFzc2VydGlvbicpXG59XG5cbn0se1wiYmFzZTY0LWpzXCI6MyxcInR5cGVkYXJyYXlcIjo0fV0sXCJuYXRpdmUtYnVmZmVyLWJyb3dzZXJpZnlcIjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5tb2R1bGUuZXhwb3J0cz1yZXF1aXJlKCdQY1pqOUwnKTtcbn0se31dLDM6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuKGZ1bmN0aW9uIChleHBvcnRzKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgbG9va3VwID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nO1xuXG5cdGZ1bmN0aW9uIGI2NFRvQnl0ZUFycmF5KGI2NCkge1xuXHRcdHZhciBpLCBqLCBsLCB0bXAsIHBsYWNlSG9sZGVycywgYXJyO1xuXHRcblx0XHRpZiAoYjY0Lmxlbmd0aCAlIDQgPiAwKSB7XG5cdFx0XHR0aHJvdyAnSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCc7XG5cdFx0fVxuXG5cdFx0Ly8gdGhlIG51bWJlciBvZiBlcXVhbCBzaWducyAocGxhY2UgaG9sZGVycylcblx0XHQvLyBpZiB0aGVyZSBhcmUgdHdvIHBsYWNlaG9sZGVycywgdGhhbiB0aGUgdHdvIGNoYXJhY3RlcnMgYmVmb3JlIGl0XG5cdFx0Ly8gcmVwcmVzZW50IG9uZSBieXRlXG5cdFx0Ly8gaWYgdGhlcmUgaXMgb25seSBvbmUsIHRoZW4gdGhlIHRocmVlIGNoYXJhY3RlcnMgYmVmb3JlIGl0IHJlcHJlc2VudCAyIGJ5dGVzXG5cdFx0Ly8gdGhpcyBpcyBqdXN0IGEgY2hlYXAgaGFjayB0byBub3QgZG8gaW5kZXhPZiB0d2ljZVxuXHRcdHBsYWNlSG9sZGVycyA9IGI2NC5pbmRleE9mKCc9Jyk7XG5cdFx0cGxhY2VIb2xkZXJzID0gcGxhY2VIb2xkZXJzID4gMCA/IGI2NC5sZW5ndGggLSBwbGFjZUhvbGRlcnMgOiAwO1xuXG5cdFx0Ly8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG5cdFx0YXJyID0gW107Ly9uZXcgVWludDhBcnJheShiNjQubGVuZ3RoICogMyAvIDQgLSBwbGFjZUhvbGRlcnMpO1xuXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuXHRcdGwgPSBwbGFjZUhvbGRlcnMgPiAwID8gYjY0Lmxlbmd0aCAtIDQgOiBiNjQubGVuZ3RoO1xuXG5cdFx0Zm9yIChpID0gMCwgaiA9IDA7IGkgPCBsOyBpICs9IDQsIGogKz0gMykge1xuXHRcdFx0dG1wID0gKGxvb2t1cC5pbmRleE9mKGI2NFtpXSkgPDwgMTgpIHwgKGxvb2t1cC5pbmRleE9mKGI2NFtpICsgMV0pIDw8IDEyKSB8IChsb29rdXAuaW5kZXhPZihiNjRbaSArIDJdKSA8PCA2KSB8IGxvb2t1cC5pbmRleE9mKGI2NFtpICsgM10pO1xuXHRcdFx0YXJyLnB1c2goKHRtcCAmIDB4RkYwMDAwKSA+PiAxNik7XG5cdFx0XHRhcnIucHVzaCgodG1wICYgMHhGRjAwKSA+PiA4KTtcblx0XHRcdGFyci5wdXNoKHRtcCAmIDB4RkYpO1xuXHRcdH1cblxuXHRcdGlmIChwbGFjZUhvbGRlcnMgPT09IDIpIHtcblx0XHRcdHRtcCA9IChsb29rdXAuaW5kZXhPZihiNjRbaV0pIDw8IDIpIHwgKGxvb2t1cC5pbmRleE9mKGI2NFtpICsgMV0pID4+IDQpO1xuXHRcdFx0YXJyLnB1c2godG1wICYgMHhGRik7XG5cdFx0fSBlbHNlIGlmIChwbGFjZUhvbGRlcnMgPT09IDEpIHtcblx0XHRcdHRtcCA9IChsb29rdXAuaW5kZXhPZihiNjRbaV0pIDw8IDEwKSB8IChsb29rdXAuaW5kZXhPZihiNjRbaSArIDFdKSA8PCA0KSB8IChsb29rdXAuaW5kZXhPZihiNjRbaSArIDJdKSA+PiAyKTtcblx0XHRcdGFyci5wdXNoKCh0bXAgPj4gOCkgJiAweEZGKTtcblx0XHRcdGFyci5wdXNoKHRtcCAmIDB4RkYpO1xuXHRcdH1cblxuXHRcdHJldHVybiBhcnI7XG5cdH1cblxuXHRmdW5jdGlvbiB1aW50OFRvQmFzZTY0KHVpbnQ4KSB7XG5cdFx0dmFyIGksXG5cdFx0XHRleHRyYUJ5dGVzID0gdWludDgubGVuZ3RoICUgMywgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcblx0XHRcdG91dHB1dCA9IFwiXCIsXG5cdFx0XHR0ZW1wLCBsZW5ndGg7XG5cblx0XHRmdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuXHRcdFx0cmV0dXJuIGxvb2t1cFtudW0gPj4gMTggJiAweDNGXSArIGxvb2t1cFtudW0gPj4gMTIgJiAweDNGXSArIGxvb2t1cFtudW0gPj4gNiAmIDB4M0ZdICsgbG9va3VwW251bSAmIDB4M0ZdO1xuXHRcdH07XG5cblx0XHQvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG5cdFx0Zm9yIChpID0gMCwgbGVuZ3RoID0gdWludDgubGVuZ3RoIC0gZXh0cmFCeXRlczsgaSA8IGxlbmd0aDsgaSArPSAzKSB7XG5cdFx0XHR0ZW1wID0gKHVpbnQ4W2ldIDw8IDE2KSArICh1aW50OFtpICsgMV0gPDwgOCkgKyAodWludDhbaSArIDJdKTtcblx0XHRcdG91dHB1dCArPSB0cmlwbGV0VG9CYXNlNjQodGVtcCk7XG5cdFx0fVxuXG5cdFx0Ly8gcGFkIHRoZSBlbmQgd2l0aCB6ZXJvcywgYnV0IG1ha2Ugc3VyZSB0byBub3QgZm9yZ2V0IHRoZSBleHRyYSBieXRlc1xuXHRcdHN3aXRjaCAoZXh0cmFCeXRlcykge1xuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHR0ZW1wID0gdWludDhbdWludDgubGVuZ3RoIC0gMV07XG5cdFx0XHRcdG91dHB1dCArPSBsb29rdXBbdGVtcCA+PiAyXTtcblx0XHRcdFx0b3V0cHV0ICs9IGxvb2t1cFsodGVtcCA8PCA0KSAmIDB4M0ZdO1xuXHRcdFx0XHRvdXRwdXQgKz0gJz09Jztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDI6XG5cdFx0XHRcdHRlbXAgPSAodWludDhbdWludDgubGVuZ3RoIC0gMl0gPDwgOCkgKyAodWludDhbdWludDgubGVuZ3RoIC0gMV0pO1xuXHRcdFx0XHRvdXRwdXQgKz0gbG9va3VwW3RlbXAgPj4gMTBdO1xuXHRcdFx0XHRvdXRwdXQgKz0gbG9va3VwWyh0ZW1wID4+IDQpICYgMHgzRl07XG5cdFx0XHRcdG91dHB1dCArPSBsb29rdXBbKHRlbXAgPDwgMikgJiAweDNGXTtcblx0XHRcdFx0b3V0cHV0ICs9ICc9Jztcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG91dHB1dDtcblx0fVxuXG5cdG1vZHVsZS5leHBvcnRzLnRvQnl0ZUFycmF5ID0gYjY0VG9CeXRlQXJyYXk7XG5cdG1vZHVsZS5leHBvcnRzLmZyb21CeXRlQXJyYXkgPSB1aW50OFRvQmFzZTY0O1xufSgpKTtcblxufSx7fV0sNDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG52YXIgdW5kZWZpbmVkID0gKHZvaWQgMCk7IC8vIFBhcmFub2lhXG5cbi8vIEJleW9uZCB0aGlzIHZhbHVlLCBpbmRleCBnZXR0ZXJzL3NldHRlcnMgKGkuZS4gYXJyYXlbMF0sIGFycmF5WzFdKSBhcmUgc28gc2xvdyB0b1xuLy8gY3JlYXRlLCBhbmQgY29uc3VtZSBzbyBtdWNoIG1lbW9yeSwgdGhhdCB0aGUgYnJvd3NlciBhcHBlYXJzIGZyb3plbi5cbnZhciBNQVhfQVJSQVlfTEVOR1RIID0gMWU1O1xuXG4vLyBBcHByb3hpbWF0aW9ucyBvZiBpbnRlcm5hbCBFQ01BU2NyaXB0IGNvbnZlcnNpb24gZnVuY3Rpb25zXG52YXIgRUNNQVNjcmlwdCA9IChmdW5jdGlvbigpIHtcbiAgLy8gU3Rhc2ggYSBjb3B5IGluIGNhc2Ugb3RoZXIgc2NyaXB0cyBtb2RpZnkgdGhlc2VcbiAgdmFyIG9wdHMgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLFxuICAgICAgb3Bob3AgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG4gIHJldHVybiB7XG4gICAgLy8gQ2xhc3MgcmV0dXJucyBpbnRlcm5hbCBbW0NsYXNzXV0gcHJvcGVydHksIHVzZWQgdG8gYXZvaWQgY3Jvc3MtZnJhbWUgaW5zdGFuY2VvZiBpc3N1ZXM6XG4gICAgQ2xhc3M6IGZ1bmN0aW9uKHYpIHsgcmV0dXJuIG9wdHMuY2FsbCh2KS5yZXBsYWNlKC9eXFxbb2JqZWN0ICp8XFxdJC9nLCAnJyk7IH0sXG4gICAgSGFzUHJvcGVydHk6IGZ1bmN0aW9uKG8sIHApIHsgcmV0dXJuIHAgaW4gbzsgfSxcbiAgICBIYXNPd25Qcm9wZXJ0eTogZnVuY3Rpb24obywgcCkgeyByZXR1cm4gb3Bob3AuY2FsbChvLCBwKTsgfSxcbiAgICBJc0NhbGxhYmxlOiBmdW5jdGlvbihvKSB7IHJldHVybiB0eXBlb2YgbyA9PT0gJ2Z1bmN0aW9uJzsgfSxcbiAgICBUb0ludDMyOiBmdW5jdGlvbih2KSB7IHJldHVybiB2ID4+IDA7IH0sXG4gICAgVG9VaW50MzI6IGZ1bmN0aW9uKHYpIHsgcmV0dXJuIHYgPj4+IDA7IH1cbiAgfTtcbn0oKSk7XG5cbi8vIFNuYXBzaG90IGludHJpbnNpY3NcbnZhciBMTjIgPSBNYXRoLkxOMixcbiAgICBhYnMgPSBNYXRoLmFicyxcbiAgICBmbG9vciA9IE1hdGguZmxvb3IsXG4gICAgbG9nID0gTWF0aC5sb2csXG4gICAgbWluID0gTWF0aC5taW4sXG4gICAgcG93ID0gTWF0aC5wb3csXG4gICAgcm91bmQgPSBNYXRoLnJvdW5kO1xuXG4vLyBFUzU6IGxvY2sgZG93biBvYmplY3QgcHJvcGVydGllc1xuZnVuY3Rpb24gY29uZmlndXJlUHJvcGVydGllcyhvYmopIHtcbiAgaWYgKGdldE93blByb3BlcnR5TmFtZXMgJiYgZGVmaW5lUHJvcGVydHkpIHtcbiAgICB2YXIgcHJvcHMgPSBnZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaiksIGk7XG4gICAgZm9yIChpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBkZWZpbmVQcm9wZXJ0eShvYmosIHByb3BzW2ldLCB7XG4gICAgICAgIHZhbHVlOiBvYmpbcHJvcHNbaV1dLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuLy8gZW11bGF0ZSBFUzUgZ2V0dGVyL3NldHRlciBBUEkgdXNpbmcgbGVnYWN5IEFQSXNcbi8vIGh0dHA6Ly9ibG9ncy5tc2RuLmNvbS9iL2llL2FyY2hpdmUvMjAxMC8wOS8wNy90cmFuc2l0aW9uaW5nLWV4aXN0aW5nLWNvZGUtdG8tdGhlLWVzNS1nZXR0ZXItc2V0dGVyLWFwaXMuYXNweFxuLy8gKHNlY29uZCBjbGF1c2UgdGVzdHMgZm9yIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSgpIGluIElFPDkgdGhhdCBvbmx5IHN1cHBvcnRzIGV4dGVuZGluZyBET00gcHJvdG90eXBlcywgYnV0XG4vLyBub3RlIHRoYXQgSUU8OSBkb2VzIG5vdCBzdXBwb3J0IF9fZGVmaW5lR2V0dGVyX18gb3IgX19kZWZpbmVTZXR0ZXJfXyBzbyBpdCBqdXN0IHJlbmRlcnMgdGhlIG1ldGhvZCBoYXJtbGVzcylcbnZhciBkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB8fCBmdW5jdGlvbihvLCBwLCBkZXNjKSB7XG4gIGlmICghbyA9PT0gT2JqZWN0KG8pKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT2JqZWN0LmRlZmluZVByb3BlcnR5IGNhbGxlZCBvbiBub24tb2JqZWN0XCIpO1xuICBpZiAoRUNNQVNjcmlwdC5IYXNQcm9wZXJ0eShkZXNjLCAnZ2V0JykgJiYgT2JqZWN0LnByb3RvdHlwZS5fX2RlZmluZUdldHRlcl9fKSB7IE9iamVjdC5wcm90b3R5cGUuX19kZWZpbmVHZXR0ZXJfXy5jYWxsKG8sIHAsIGRlc2MuZ2V0KTsgfVxuICBpZiAoRUNNQVNjcmlwdC5IYXNQcm9wZXJ0eShkZXNjLCAnc2V0JykgJiYgT2JqZWN0LnByb3RvdHlwZS5fX2RlZmluZVNldHRlcl9fKSB7IE9iamVjdC5wcm90b3R5cGUuX19kZWZpbmVTZXR0ZXJfXy5jYWxsKG8sIHAsIGRlc2Muc2V0KTsgfVxuICBpZiAoRUNNQVNjcmlwdC5IYXNQcm9wZXJ0eShkZXNjLCAndmFsdWUnKSkgeyBvW3BdID0gZGVzYy52YWx1ZTsgfVxuICByZXR1cm4gbztcbn07XG5cbnZhciBnZXRPd25Qcm9wZXJ0eU5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgfHwgZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhvKSB7XG4gIGlmIChvICE9PSBPYmplY3QobykpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyBjYWxsZWQgb24gbm9uLW9iamVjdFwiKTtcbiAgdmFyIHByb3BzID0gW10sIHA7XG4gIGZvciAocCBpbiBvKSB7XG4gICAgaWYgKEVDTUFTY3JpcHQuSGFzT3duUHJvcGVydHkobywgcCkpIHtcbiAgICAgIHByb3BzLnB1c2gocCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBwcm9wcztcbn07XG5cbi8vIEVTNTogTWFrZSBvYmpbaW5kZXhdIGFuIGFsaWFzIGZvciBvYmouX2dldHRlcihpbmRleCkvb2JqLl9zZXR0ZXIoaW5kZXgsIHZhbHVlKVxuLy8gZm9yIGluZGV4IGluIDAgLi4uIG9iai5sZW5ndGhcbmZ1bmN0aW9uIG1ha2VBcnJheUFjY2Vzc29ycyhvYmopIHtcbiAgaWYgKCFkZWZpbmVQcm9wZXJ0eSkgeyByZXR1cm47IH1cblxuICBpZiAob2JqLmxlbmd0aCA+IE1BWF9BUlJBWV9MRU5HVEgpIHRocm93IG5ldyBSYW5nZUVycm9yKFwiQXJyYXkgdG9vIGxhcmdlIGZvciBwb2x5ZmlsbFwiKTtcblxuICBmdW5jdGlvbiBtYWtlQXJyYXlBY2Nlc3NvcihpbmRleCkge1xuICAgIGRlZmluZVByb3BlcnR5KG9iaiwgaW5kZXgsIHtcbiAgICAgICdnZXQnOiBmdW5jdGlvbigpIHsgcmV0dXJuIG9iai5fZ2V0dGVyKGluZGV4KTsgfSxcbiAgICAgICdzZXQnOiBmdW5jdGlvbih2KSB7IG9iai5fc2V0dGVyKGluZGV4LCB2KTsgfSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgfSk7XG4gIH1cblxuICB2YXIgaTtcbiAgZm9yIChpID0gMDsgaSA8IG9iai5sZW5ndGg7IGkgKz0gMSkge1xuICAgIG1ha2VBcnJheUFjY2Vzc29yKGkpO1xuICB9XG59XG5cbi8vIEludGVybmFsIGNvbnZlcnNpb24gZnVuY3Rpb25zOlxuLy8gICAgcGFjazxUeXBlPigpICAgLSB0YWtlIGEgbnVtYmVyIChpbnRlcnByZXRlZCBhcyBUeXBlKSwgb3V0cHV0IGEgYnl0ZSBhcnJheVxuLy8gICAgdW5wYWNrPFR5cGU+KCkgLSB0YWtlIGEgYnl0ZSBhcnJheSwgb3V0cHV0IGEgVHlwZS1saWtlIG51bWJlclxuXG5mdW5jdGlvbiBhc19zaWduZWQodmFsdWUsIGJpdHMpIHsgdmFyIHMgPSAzMiAtIGJpdHM7IHJldHVybiAodmFsdWUgPDwgcykgPj4gczsgfVxuZnVuY3Rpb24gYXNfdW5zaWduZWQodmFsdWUsIGJpdHMpIHsgdmFyIHMgPSAzMiAtIGJpdHM7IHJldHVybiAodmFsdWUgPDwgcykgPj4+IHM7IH1cblxuZnVuY3Rpb24gcGFja0k4KG4pIHsgcmV0dXJuIFtuICYgMHhmZl07IH1cbmZ1bmN0aW9uIHVucGFja0k4KGJ5dGVzKSB7IHJldHVybiBhc19zaWduZWQoYnl0ZXNbMF0sIDgpOyB9XG5cbmZ1bmN0aW9uIHBhY2tVOChuKSB7IHJldHVybiBbbiAmIDB4ZmZdOyB9XG5mdW5jdGlvbiB1bnBhY2tVOChieXRlcykgeyByZXR1cm4gYXNfdW5zaWduZWQoYnl0ZXNbMF0sIDgpOyB9XG5cbmZ1bmN0aW9uIHBhY2tVOENsYW1wZWQobikgeyBuID0gcm91bmQoTnVtYmVyKG4pKTsgcmV0dXJuIFtuIDwgMCA/IDAgOiBuID4gMHhmZiA/IDB4ZmYgOiBuICYgMHhmZl07IH1cblxuZnVuY3Rpb24gcGFja0kxNihuKSB7IHJldHVybiBbKG4gPj4gOCkgJiAweGZmLCBuICYgMHhmZl07IH1cbmZ1bmN0aW9uIHVucGFja0kxNihieXRlcykgeyByZXR1cm4gYXNfc2lnbmVkKGJ5dGVzWzBdIDw8IDggfCBieXRlc1sxXSwgMTYpOyB9XG5cbmZ1bmN0aW9uIHBhY2tVMTYobikgeyByZXR1cm4gWyhuID4+IDgpICYgMHhmZiwgbiAmIDB4ZmZdOyB9XG5mdW5jdGlvbiB1bnBhY2tVMTYoYnl0ZXMpIHsgcmV0dXJuIGFzX3Vuc2lnbmVkKGJ5dGVzWzBdIDw8IDggfCBieXRlc1sxXSwgMTYpOyB9XG5cbmZ1bmN0aW9uIHBhY2tJMzIobikgeyByZXR1cm4gWyhuID4+IDI0KSAmIDB4ZmYsIChuID4+IDE2KSAmIDB4ZmYsIChuID4+IDgpICYgMHhmZiwgbiAmIDB4ZmZdOyB9XG5mdW5jdGlvbiB1bnBhY2tJMzIoYnl0ZXMpIHsgcmV0dXJuIGFzX3NpZ25lZChieXRlc1swXSA8PCAyNCB8IGJ5dGVzWzFdIDw8IDE2IHwgYnl0ZXNbMl0gPDwgOCB8IGJ5dGVzWzNdLCAzMik7IH1cblxuZnVuY3Rpb24gcGFja1UzMihuKSB7IHJldHVybiBbKG4gPj4gMjQpICYgMHhmZiwgKG4gPj4gMTYpICYgMHhmZiwgKG4gPj4gOCkgJiAweGZmLCBuICYgMHhmZl07IH1cbmZ1bmN0aW9uIHVucGFja1UzMihieXRlcykgeyByZXR1cm4gYXNfdW5zaWduZWQoYnl0ZXNbMF0gPDwgMjQgfCBieXRlc1sxXSA8PCAxNiB8IGJ5dGVzWzJdIDw8IDggfCBieXRlc1szXSwgMzIpOyB9XG5cbmZ1bmN0aW9uIHBhY2tJRUVFNzU0KHYsIGViaXRzLCBmYml0cykge1xuXG4gIHZhciBiaWFzID0gKDEgPDwgKGViaXRzIC0gMSkpIC0gMSxcbiAgICAgIHMsIGUsIGYsIGxuLFxuICAgICAgaSwgYml0cywgc3RyLCBieXRlcztcblxuICBmdW5jdGlvbiByb3VuZFRvRXZlbihuKSB7XG4gICAgdmFyIHcgPSBmbG9vcihuKSwgZiA9IG4gLSB3O1xuICAgIGlmIChmIDwgMC41KVxuICAgICAgcmV0dXJuIHc7XG4gICAgaWYgKGYgPiAwLjUpXG4gICAgICByZXR1cm4gdyArIDE7XG4gICAgcmV0dXJuIHcgJSAyID8gdyArIDEgOiB3O1xuICB9XG5cbiAgLy8gQ29tcHV0ZSBzaWduLCBleHBvbmVudCwgZnJhY3Rpb25cbiAgaWYgKHYgIT09IHYpIHtcbiAgICAvLyBOYU5cbiAgICAvLyBodHRwOi8vZGV2LnczLm9yZy8yMDA2L3dlYmFwaS9XZWJJREwvI2VzLXR5cGUtbWFwcGluZ1xuICAgIGUgPSAoMSA8PCBlYml0cykgLSAxOyBmID0gcG93KDIsIGZiaXRzIC0gMSk7IHMgPSAwO1xuICB9IGVsc2UgaWYgKHYgPT09IEluZmluaXR5IHx8IHYgPT09IC1JbmZpbml0eSkge1xuICAgIGUgPSAoMSA8PCBlYml0cykgLSAxOyBmID0gMDsgcyA9ICh2IDwgMCkgPyAxIDogMDtcbiAgfSBlbHNlIGlmICh2ID09PSAwKSB7XG4gICAgZSA9IDA7IGYgPSAwOyBzID0gKDEgLyB2ID09PSAtSW5maW5pdHkpID8gMSA6IDA7XG4gIH0gZWxzZSB7XG4gICAgcyA9IHYgPCAwO1xuICAgIHYgPSBhYnModik7XG5cbiAgICBpZiAodiA+PSBwb3coMiwgMSAtIGJpYXMpKSB7XG4gICAgICBlID0gbWluKGZsb29yKGxvZyh2KSAvIExOMiksIDEwMjMpO1xuICAgICAgZiA9IHJvdW5kVG9FdmVuKHYgLyBwb3coMiwgZSkgKiBwb3coMiwgZmJpdHMpKTtcbiAgICAgIGlmIChmIC8gcG93KDIsIGZiaXRzKSA+PSAyKSB7XG4gICAgICAgIGUgPSBlICsgMTtcbiAgICAgICAgZiA9IDE7XG4gICAgICB9XG4gICAgICBpZiAoZSA+IGJpYXMpIHtcbiAgICAgICAgLy8gT3ZlcmZsb3dcbiAgICAgICAgZSA9ICgxIDw8IGViaXRzKSAtIDE7XG4gICAgICAgIGYgPSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gTm9ybWFsaXplZFxuICAgICAgICBlID0gZSArIGJpYXM7XG4gICAgICAgIGYgPSBmIC0gcG93KDIsIGZiaXRzKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRGVub3JtYWxpemVkXG4gICAgICBlID0gMDtcbiAgICAgIGYgPSByb3VuZFRvRXZlbih2IC8gcG93KDIsIDEgLSBiaWFzIC0gZmJpdHMpKTtcbiAgICB9XG4gIH1cblxuICAvLyBQYWNrIHNpZ24sIGV4cG9uZW50LCBmcmFjdGlvblxuICBiaXRzID0gW107XG4gIGZvciAoaSA9IGZiaXRzOyBpOyBpIC09IDEpIHsgYml0cy5wdXNoKGYgJSAyID8gMSA6IDApOyBmID0gZmxvb3IoZiAvIDIpOyB9XG4gIGZvciAoaSA9IGViaXRzOyBpOyBpIC09IDEpIHsgYml0cy5wdXNoKGUgJSAyID8gMSA6IDApOyBlID0gZmxvb3IoZSAvIDIpOyB9XG4gIGJpdHMucHVzaChzID8gMSA6IDApO1xuICBiaXRzLnJldmVyc2UoKTtcbiAgc3RyID0gYml0cy5qb2luKCcnKTtcblxuICAvLyBCaXRzIHRvIGJ5dGVzXG4gIGJ5dGVzID0gW107XG4gIHdoaWxlIChzdHIubGVuZ3RoKSB7XG4gICAgYnl0ZXMucHVzaChwYXJzZUludChzdHIuc3Vic3RyaW5nKDAsIDgpLCAyKSk7XG4gICAgc3RyID0gc3RyLnN1YnN0cmluZyg4KTtcbiAgfVxuICByZXR1cm4gYnl0ZXM7XG59XG5cbmZ1bmN0aW9uIHVucGFja0lFRUU3NTQoYnl0ZXMsIGViaXRzLCBmYml0cykge1xuXG4gIC8vIEJ5dGVzIHRvIGJpdHNcbiAgdmFyIGJpdHMgPSBbXSwgaSwgaiwgYiwgc3RyLFxuICAgICAgYmlhcywgcywgZSwgZjtcblxuICBmb3IgKGkgPSBieXRlcy5sZW5ndGg7IGk7IGkgLT0gMSkge1xuICAgIGIgPSBieXRlc1tpIC0gMV07XG4gICAgZm9yIChqID0gODsgajsgaiAtPSAxKSB7XG4gICAgICBiaXRzLnB1c2goYiAlIDIgPyAxIDogMCk7IGIgPSBiID4+IDE7XG4gICAgfVxuICB9XG4gIGJpdHMucmV2ZXJzZSgpO1xuICBzdHIgPSBiaXRzLmpvaW4oJycpO1xuXG4gIC8vIFVucGFjayBzaWduLCBleHBvbmVudCwgZnJhY3Rpb25cbiAgYmlhcyA9ICgxIDw8IChlYml0cyAtIDEpKSAtIDE7XG4gIHMgPSBwYXJzZUludChzdHIuc3Vic3RyaW5nKDAsIDEpLCAyKSA/IC0xIDogMTtcbiAgZSA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoMSwgMSArIGViaXRzKSwgMik7XG4gIGYgPSBwYXJzZUludChzdHIuc3Vic3RyaW5nKDEgKyBlYml0cyksIDIpO1xuXG4gIC8vIFByb2R1Y2UgbnVtYmVyXG4gIGlmIChlID09PSAoMSA8PCBlYml0cykgLSAxKSB7XG4gICAgcmV0dXJuIGYgIT09IDAgPyBOYU4gOiBzICogSW5maW5pdHk7XG4gIH0gZWxzZSBpZiAoZSA+IDApIHtcbiAgICAvLyBOb3JtYWxpemVkXG4gICAgcmV0dXJuIHMgKiBwb3coMiwgZSAtIGJpYXMpICogKDEgKyBmIC8gcG93KDIsIGZiaXRzKSk7XG4gIH0gZWxzZSBpZiAoZiAhPT0gMCkge1xuICAgIC8vIERlbm9ybWFsaXplZFxuICAgIHJldHVybiBzICogcG93KDIsIC0oYmlhcyAtIDEpKSAqIChmIC8gcG93KDIsIGZiaXRzKSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHMgPCAwID8gLTAgOiAwO1xuICB9XG59XG5cbmZ1bmN0aW9uIHVucGFja0Y2NChiKSB7IHJldHVybiB1bnBhY2tJRUVFNzU0KGIsIDExLCA1Mik7IH1cbmZ1bmN0aW9uIHBhY2tGNjQodikgeyByZXR1cm4gcGFja0lFRUU3NTQodiwgMTEsIDUyKTsgfVxuZnVuY3Rpb24gdW5wYWNrRjMyKGIpIHsgcmV0dXJuIHVucGFja0lFRUU3NTQoYiwgOCwgMjMpOyB9XG5mdW5jdGlvbiBwYWNrRjMyKHYpIHsgcmV0dXJuIHBhY2tJRUVFNzU0KHYsIDgsIDIzKTsgfVxuXG5cbi8vXG4vLyAzIFRoZSBBcnJheUJ1ZmZlciBUeXBlXG4vL1xuXG4oZnVuY3Rpb24oKSB7XG5cbiAgLyoqIEBjb25zdHJ1Y3RvciAqL1xuICB2YXIgQXJyYXlCdWZmZXIgPSBmdW5jdGlvbiBBcnJheUJ1ZmZlcihsZW5ndGgpIHtcbiAgICBsZW5ndGggPSBFQ01BU2NyaXB0LlRvSW50MzIobGVuZ3RoKTtcbiAgICBpZiAobGVuZ3RoIDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0FycmF5QnVmZmVyIHNpemUgaXMgbm90IGEgc21hbGwgZW5vdWdoIHBvc2l0aXZlIGludGVnZXInKTtcblxuICAgIHRoaXMuYnl0ZUxlbmd0aCA9IGxlbmd0aDtcbiAgICB0aGlzLl9ieXRlcyA9IFtdO1xuICAgIHRoaXMuX2J5dGVzLmxlbmd0aCA9IGxlbmd0aDtcblxuICAgIHZhciBpO1xuICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmJ5dGVMZW5ndGg7IGkgKz0gMSkge1xuICAgICAgdGhpcy5fYnl0ZXNbaV0gPSAwO1xuICAgIH1cblxuICAgIGNvbmZpZ3VyZVByb3BlcnRpZXModGhpcyk7XG4gIH07XG5cbiAgZXhwb3J0cy5BcnJheUJ1ZmZlciA9IGV4cG9ydHMuQXJyYXlCdWZmZXIgfHwgQXJyYXlCdWZmZXI7XG5cbiAgLy9cbiAgLy8gNCBUaGUgQXJyYXlCdWZmZXJWaWV3IFR5cGVcbiAgLy9cblxuICAvLyBOT1RFOiB0aGlzIGNvbnN0cnVjdG9yIGlzIG5vdCBleHBvcnRlZFxuICAvKiogQGNvbnN0cnVjdG9yICovXG4gIHZhciBBcnJheUJ1ZmZlclZpZXcgPSBmdW5jdGlvbiBBcnJheUJ1ZmZlclZpZXcoKSB7XG4gICAgLy90aGlzLmJ1ZmZlciA9IG51bGw7XG4gICAgLy90aGlzLmJ5dGVPZmZzZXQgPSAwO1xuICAgIC8vdGhpcy5ieXRlTGVuZ3RoID0gMDtcbiAgfTtcblxuICAvL1xuICAvLyA1IFRoZSBUeXBlZCBBcnJheSBWaWV3IFR5cGVzXG4gIC8vXG5cbiAgZnVuY3Rpb24gbWFrZUNvbnN0cnVjdG9yKGJ5dGVzUGVyRWxlbWVudCwgcGFjaywgdW5wYWNrKSB7XG4gICAgLy8gRWFjaCBUeXBlZEFycmF5IHR5cGUgcmVxdWlyZXMgYSBkaXN0aW5jdCBjb25zdHJ1Y3RvciBpbnN0YW5jZSB3aXRoXG4gICAgLy8gaWRlbnRpY2FsIGxvZ2ljLCB3aGljaCB0aGlzIHByb2R1Y2VzLlxuXG4gICAgdmFyIGN0b3I7XG4gICAgY3RvciA9IGZ1bmN0aW9uKGJ1ZmZlciwgYnl0ZU9mZnNldCwgbGVuZ3RoKSB7XG4gICAgICB2YXIgYXJyYXksIHNlcXVlbmNlLCBpLCBzO1xuXG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGggfHwgdHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgLy8gQ29uc3RydWN0b3IodW5zaWduZWQgbG9uZyBsZW5ndGgpXG4gICAgICAgIHRoaXMubGVuZ3RoID0gRUNNQVNjcmlwdC5Ub0ludDMyKGFyZ3VtZW50c1swXSk7XG4gICAgICAgIGlmIChsZW5ndGggPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXJyYXlCdWZmZXJWaWV3IHNpemUgaXMgbm90IGEgc21hbGwgZW5vdWdoIHBvc2l0aXZlIGludGVnZXInKTtcblxuICAgICAgICB0aGlzLmJ5dGVMZW5ndGggPSB0aGlzLmxlbmd0aCAqIHRoaXMuQllURVNfUEVSX0VMRU1FTlQ7XG4gICAgICAgIHRoaXMuYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKHRoaXMuYnl0ZUxlbmd0aCk7XG4gICAgICAgIHRoaXMuYnl0ZU9mZnNldCA9IDA7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdvYmplY3QnICYmIGFyZ3VtZW50c1swXS5jb25zdHJ1Y3RvciA9PT0gY3Rvcikge1xuICAgICAgICAvLyBDb25zdHJ1Y3RvcihUeXBlZEFycmF5IGFycmF5KVxuICAgICAgICBhcnJheSA9IGFyZ3VtZW50c1swXTtcblxuICAgICAgICB0aGlzLmxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgICAgICAgdGhpcy5ieXRlTGVuZ3RoID0gdGhpcy5sZW5ndGggKiB0aGlzLkJZVEVTX1BFUl9FTEVNRU5UO1xuICAgICAgICB0aGlzLmJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcih0aGlzLmJ5dGVMZW5ndGgpO1xuICAgICAgICB0aGlzLmJ5dGVPZmZzZXQgPSAwO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgdGhpcy5fc2V0dGVyKGksIGFycmF5Ll9nZXR0ZXIoaSkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdvYmplY3QnICYmXG4gICAgICAgICAgICAgICAgICEoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIgfHwgRUNNQVNjcmlwdC5DbGFzcyhhcmd1bWVudHNbMF0pID09PSAnQXJyYXlCdWZmZXInKSkge1xuICAgICAgICAvLyBDb25zdHJ1Y3RvcihzZXF1ZW5jZTx0eXBlPiBhcnJheSlcbiAgICAgICAgc2VxdWVuY2UgPSBhcmd1bWVudHNbMF07XG5cbiAgICAgICAgdGhpcy5sZW5ndGggPSBFQ01BU2NyaXB0LlRvVWludDMyKHNlcXVlbmNlLmxlbmd0aCk7XG4gICAgICAgIHRoaXMuYnl0ZUxlbmd0aCA9IHRoaXMubGVuZ3RoICogdGhpcy5CWVRFU19QRVJfRUxFTUVOVDtcbiAgICAgICAgdGhpcy5idWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIodGhpcy5ieXRlTGVuZ3RoKTtcbiAgICAgICAgdGhpcy5ieXRlT2Zmc2V0ID0gMDtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgIHMgPSBzZXF1ZW5jZVtpXTtcbiAgICAgICAgICB0aGlzLl9zZXR0ZXIoaSwgTnVtYmVyKHMpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgICAgICAgICAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIgfHwgRUNNQVNjcmlwdC5DbGFzcyhhcmd1bWVudHNbMF0pID09PSAnQXJyYXlCdWZmZXInKSkge1xuICAgICAgICAvLyBDb25zdHJ1Y3RvcihBcnJheUJ1ZmZlciBidWZmZXIsXG4gICAgICAgIC8vICAgICAgICAgICAgIG9wdGlvbmFsIHVuc2lnbmVkIGxvbmcgYnl0ZU9mZnNldCwgb3B0aW9uYWwgdW5zaWduZWQgbG9uZyBsZW5ndGgpXG4gICAgICAgIHRoaXMuYnVmZmVyID0gYnVmZmVyO1xuXG4gICAgICAgIHRoaXMuYnl0ZU9mZnNldCA9IEVDTUFTY3JpcHQuVG9VaW50MzIoYnl0ZU9mZnNldCk7XG4gICAgICAgIGlmICh0aGlzLmJ5dGVPZmZzZXQgPiB0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJieXRlT2Zmc2V0IG91dCBvZiByYW5nZVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmJ5dGVPZmZzZXQgJSB0aGlzLkJZVEVTX1BFUl9FTEVNRU5UKSB7XG4gICAgICAgICAgLy8gVGhlIGdpdmVuIGJ5dGVPZmZzZXQgbXVzdCBiZSBhIG11bHRpcGxlIG9mIHRoZSBlbGVtZW50XG4gICAgICAgICAgLy8gc2l6ZSBvZiB0aGUgc3BlY2lmaWMgdHlwZSwgb3RoZXJ3aXNlIGFuIGV4Y2VwdGlvbiBpcyByYWlzZWQuXG4gICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJBcnJheUJ1ZmZlciBsZW5ndGggbWludXMgdGhlIGJ5dGVPZmZzZXQgaXMgbm90IGEgbXVsdGlwbGUgb2YgdGhlIGVsZW1lbnQgc2l6ZS5cIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDMpIHtcbiAgICAgICAgICB0aGlzLmJ5dGVMZW5ndGggPSB0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoIC0gdGhpcy5ieXRlT2Zmc2V0O1xuXG4gICAgICAgICAgaWYgKHRoaXMuYnl0ZUxlbmd0aCAlIHRoaXMuQllURVNfUEVSX0VMRU1FTlQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwibGVuZ3RoIG9mIGJ1ZmZlciBtaW51cyBieXRlT2Zmc2V0IG5vdCBhIG11bHRpcGxlIG9mIHRoZSBlbGVtZW50IHNpemVcIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMubGVuZ3RoID0gdGhpcy5ieXRlTGVuZ3RoIC8gdGhpcy5CWVRFU19QRVJfRUxFTUVOVDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmxlbmd0aCA9IEVDTUFTY3JpcHQuVG9VaW50MzIobGVuZ3RoKTtcbiAgICAgICAgICB0aGlzLmJ5dGVMZW5ndGggPSB0aGlzLmxlbmd0aCAqIHRoaXMuQllURVNfUEVSX0VMRU1FTlQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoKHRoaXMuYnl0ZU9mZnNldCArIHRoaXMuYnl0ZUxlbmd0aCkgPiB0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJieXRlT2Zmc2V0IGFuZCBsZW5ndGggcmVmZXJlbmNlIGFuIGFyZWEgYmV5b25kIHRoZSBlbmQgb2YgdGhlIGJ1ZmZlclwiKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlVuZXhwZWN0ZWQgYXJndW1lbnQgdHlwZShzKVwiKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jb25zdHJ1Y3RvciA9IGN0b3I7XG5cbiAgICAgIGNvbmZpZ3VyZVByb3BlcnRpZXModGhpcyk7XG4gICAgICBtYWtlQXJyYXlBY2Nlc3NvcnModGhpcyk7XG4gICAgfTtcblxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IEFycmF5QnVmZmVyVmlldygpO1xuICAgIGN0b3IucHJvdG90eXBlLkJZVEVTX1BFUl9FTEVNRU5UID0gYnl0ZXNQZXJFbGVtZW50O1xuICAgIGN0b3IucHJvdG90eXBlLl9wYWNrID0gcGFjaztcbiAgICBjdG9yLnByb3RvdHlwZS5fdW5wYWNrID0gdW5wYWNrO1xuICAgIGN0b3IuQllURVNfUEVSX0VMRU1FTlQgPSBieXRlc1BlckVsZW1lbnQ7XG5cbiAgICAvLyBnZXR0ZXIgdHlwZSAodW5zaWduZWQgbG9uZyBpbmRleCk7XG4gICAgY3Rvci5wcm90b3R5cGUuX2dldHRlciA9IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDEpIHRocm93IG5ldyBTeW50YXhFcnJvcihcIk5vdCBlbm91Z2ggYXJndW1lbnRzXCIpO1xuXG4gICAgICBpbmRleCA9IEVDTUFTY3JpcHQuVG9VaW50MzIoaW5kZXgpO1xuICAgICAgaWYgKGluZGV4ID49IHRoaXMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHZhciBieXRlcyA9IFtdLCBpLCBvO1xuICAgICAgZm9yIChpID0gMCwgbyA9IHRoaXMuYnl0ZU9mZnNldCArIGluZGV4ICogdGhpcy5CWVRFU19QRVJfRUxFTUVOVDtcbiAgICAgICAgICAgaSA8IHRoaXMuQllURVNfUEVSX0VMRU1FTlQ7XG4gICAgICAgICAgIGkgKz0gMSwgbyArPSAxKSB7XG4gICAgICAgIGJ5dGVzLnB1c2godGhpcy5idWZmZXIuX2J5dGVzW29dKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLl91bnBhY2soYnl0ZXMpO1xuICAgIH07XG5cbiAgICAvLyBOT05TVEFOREFSRDogY29udmVuaWVuY2UgYWxpYXMgZm9yIGdldHRlcjogdHlwZSBnZXQodW5zaWduZWQgbG9uZyBpbmRleCk7XG4gICAgY3Rvci5wcm90b3R5cGUuZ2V0ID0gY3Rvci5wcm90b3R5cGUuX2dldHRlcjtcblxuICAgIC8vIHNldHRlciB2b2lkICh1bnNpZ25lZCBsb25nIGluZGV4LCB0eXBlIHZhbHVlKTtcbiAgICBjdG9yLnByb3RvdHlwZS5fc2V0dGVyID0gZnVuY3Rpb24oaW5kZXgsIHZhbHVlKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHRocm93IG5ldyBTeW50YXhFcnJvcihcIk5vdCBlbm91Z2ggYXJndW1lbnRzXCIpO1xuXG4gICAgICBpbmRleCA9IEVDTUFTY3JpcHQuVG9VaW50MzIoaW5kZXgpO1xuICAgICAgaWYgKGluZGV4ID49IHRoaXMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHZhciBieXRlcyA9IHRoaXMuX3BhY2sodmFsdWUpLCBpLCBvO1xuICAgICAgZm9yIChpID0gMCwgbyA9IHRoaXMuYnl0ZU9mZnNldCArIGluZGV4ICogdGhpcy5CWVRFU19QRVJfRUxFTUVOVDtcbiAgICAgICAgICAgaSA8IHRoaXMuQllURVNfUEVSX0VMRU1FTlQ7XG4gICAgICAgICAgIGkgKz0gMSwgbyArPSAxKSB7XG4gICAgICAgIHRoaXMuYnVmZmVyLl9ieXRlc1tvXSA9IGJ5dGVzW2ldO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyB2b2lkIHNldChUeXBlZEFycmF5IGFycmF5LCBvcHRpb25hbCB1bnNpZ25lZCBsb25nIG9mZnNldCk7XG4gICAgLy8gdm9pZCBzZXQoc2VxdWVuY2U8dHlwZT4gYXJyYXksIG9wdGlvbmFsIHVuc2lnbmVkIGxvbmcgb2Zmc2V0KTtcbiAgICBjdG9yLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihpbmRleCwgdmFsdWUpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMSkgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiTm90IGVub3VnaCBhcmd1bWVudHNcIik7XG4gICAgICB2YXIgYXJyYXksIHNlcXVlbmNlLCBvZmZzZXQsIGxlbixcbiAgICAgICAgICBpLCBzLCBkLFxuICAgICAgICAgIGJ5dGVPZmZzZXQsIGJ5dGVMZW5ndGgsIHRtcDtcblxuICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdvYmplY3QnICYmIGFyZ3VtZW50c1swXS5jb25zdHJ1Y3RvciA9PT0gdGhpcy5jb25zdHJ1Y3Rvcikge1xuICAgICAgICAvLyB2b2lkIHNldChUeXBlZEFycmF5IGFycmF5LCBvcHRpb25hbCB1bnNpZ25lZCBsb25nIG9mZnNldCk7XG4gICAgICAgIGFycmF5ID0gYXJndW1lbnRzWzBdO1xuICAgICAgICBvZmZzZXQgPSBFQ01BU2NyaXB0LlRvVWludDMyKGFyZ3VtZW50c1sxXSk7XG5cbiAgICAgICAgaWYgKG9mZnNldCArIGFycmF5Lmxlbmd0aCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJPZmZzZXQgcGx1cyBsZW5ndGggb2YgYXJyYXkgaXMgb3V0IG9mIHJhbmdlXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgYnl0ZU9mZnNldCA9IHRoaXMuYnl0ZU9mZnNldCArIG9mZnNldCAqIHRoaXMuQllURVNfUEVSX0VMRU1FTlQ7XG4gICAgICAgIGJ5dGVMZW5ndGggPSBhcnJheS5sZW5ndGggKiB0aGlzLkJZVEVTX1BFUl9FTEVNRU5UO1xuXG4gICAgICAgIGlmIChhcnJheS5idWZmZXIgPT09IHRoaXMuYnVmZmVyKSB7XG4gICAgICAgICAgdG1wID0gW107XG4gICAgICAgICAgZm9yIChpID0gMCwgcyA9IGFycmF5LmJ5dGVPZmZzZXQ7IGkgPCBieXRlTGVuZ3RoOyBpICs9IDEsIHMgKz0gMSkge1xuICAgICAgICAgICAgdG1wW2ldID0gYXJyYXkuYnVmZmVyLl9ieXRlc1tzXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yIChpID0gMCwgZCA9IGJ5dGVPZmZzZXQ7IGkgPCBieXRlTGVuZ3RoOyBpICs9IDEsIGQgKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5idWZmZXIuX2J5dGVzW2RdID0gdG1wW2ldO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKGkgPSAwLCBzID0gYXJyYXkuYnl0ZU9mZnNldCwgZCA9IGJ5dGVPZmZzZXQ7XG4gICAgICAgICAgICAgICBpIDwgYnl0ZUxlbmd0aDsgaSArPSAxLCBzICs9IDEsIGQgKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5idWZmZXIuX2J5dGVzW2RdID0gYXJyYXkuYnVmZmVyLl9ieXRlc1tzXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIGFyZ3VtZW50c1swXS5sZW5ndGggIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIC8vIHZvaWQgc2V0KHNlcXVlbmNlPHR5cGU+IGFycmF5LCBvcHRpb25hbCB1bnNpZ25lZCBsb25nIG9mZnNldCk7XG4gICAgICAgIHNlcXVlbmNlID0gYXJndW1lbnRzWzBdO1xuICAgICAgICBsZW4gPSBFQ01BU2NyaXB0LlRvVWludDMyKHNlcXVlbmNlLmxlbmd0aCk7XG4gICAgICAgIG9mZnNldCA9IEVDTUFTY3JpcHQuVG9VaW50MzIoYXJndW1lbnRzWzFdKTtcblxuICAgICAgICBpZiAob2Zmc2V0ICsgbGVuID4gdGhpcy5sZW5ndGgpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcIk9mZnNldCBwbHVzIGxlbmd0aCBvZiBhcnJheSBpcyBvdXQgb2YgcmFuZ2VcIik7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgICBzID0gc2VxdWVuY2VbaV07XG4gICAgICAgICAgdGhpcy5fc2V0dGVyKG9mZnNldCArIGksIE51bWJlcihzKSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJVbmV4cGVjdGVkIGFyZ3VtZW50IHR5cGUocylcIik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIFR5cGVkQXJyYXkgc3ViYXJyYXkobG9uZyBiZWdpbiwgb3B0aW9uYWwgbG9uZyBlbmQpO1xuICAgIGN0b3IucHJvdG90eXBlLnN1YmFycmF5ID0gZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgICAgZnVuY3Rpb24gY2xhbXAodiwgbWluLCBtYXgpIHsgcmV0dXJuIHYgPCBtaW4gPyBtaW4gOiB2ID4gbWF4ID8gbWF4IDogdjsgfVxuXG4gICAgICBzdGFydCA9IEVDTUFTY3JpcHQuVG9JbnQzMihzdGFydCk7XG4gICAgICBlbmQgPSBFQ01BU2NyaXB0LlRvSW50MzIoZW5kKTtcblxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAxKSB7IHN0YXJ0ID0gMDsgfVxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7IGVuZCA9IHRoaXMubGVuZ3RoOyB9XG5cbiAgICAgIGlmIChzdGFydCA8IDApIHsgc3RhcnQgPSB0aGlzLmxlbmd0aCArIHN0YXJ0OyB9XG4gICAgICBpZiAoZW5kIDwgMCkgeyBlbmQgPSB0aGlzLmxlbmd0aCArIGVuZDsgfVxuXG4gICAgICBzdGFydCA9IGNsYW1wKHN0YXJ0LCAwLCB0aGlzLmxlbmd0aCk7XG4gICAgICBlbmQgPSBjbGFtcChlbmQsIDAsIHRoaXMubGVuZ3RoKTtcblxuICAgICAgdmFyIGxlbiA9IGVuZCAtIHN0YXJ0O1xuICAgICAgaWYgKGxlbiA8IDApIHtcbiAgICAgICAgbGVuID0gMDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKFxuICAgICAgICB0aGlzLmJ1ZmZlciwgdGhpcy5ieXRlT2Zmc2V0ICsgc3RhcnQgKiB0aGlzLkJZVEVTX1BFUl9FTEVNRU5ULCBsZW4pO1xuICAgIH07XG5cbiAgICByZXR1cm4gY3RvcjtcbiAgfVxuXG4gIHZhciBJbnQ4QXJyYXkgPSBtYWtlQ29uc3RydWN0b3IoMSwgcGFja0k4LCB1bnBhY2tJOCk7XG4gIHZhciBVaW50OEFycmF5ID0gbWFrZUNvbnN0cnVjdG9yKDEsIHBhY2tVOCwgdW5wYWNrVTgpO1xuICB2YXIgVWludDhDbGFtcGVkQXJyYXkgPSBtYWtlQ29uc3RydWN0b3IoMSwgcGFja1U4Q2xhbXBlZCwgdW5wYWNrVTgpO1xuICB2YXIgSW50MTZBcnJheSA9IG1ha2VDb25zdHJ1Y3RvcigyLCBwYWNrSTE2LCB1bnBhY2tJMTYpO1xuICB2YXIgVWludDE2QXJyYXkgPSBtYWtlQ29uc3RydWN0b3IoMiwgcGFja1UxNiwgdW5wYWNrVTE2KTtcbiAgdmFyIEludDMyQXJyYXkgPSBtYWtlQ29uc3RydWN0b3IoNCwgcGFja0kzMiwgdW5wYWNrSTMyKTtcbiAgdmFyIFVpbnQzMkFycmF5ID0gbWFrZUNvbnN0cnVjdG9yKDQsIHBhY2tVMzIsIHVucGFja1UzMik7XG4gIHZhciBGbG9hdDMyQXJyYXkgPSBtYWtlQ29uc3RydWN0b3IoNCwgcGFja0YzMiwgdW5wYWNrRjMyKTtcbiAgdmFyIEZsb2F0NjRBcnJheSA9IG1ha2VDb25zdHJ1Y3Rvcig4LCBwYWNrRjY0LCB1bnBhY2tGNjQpO1xuXG4gIGV4cG9ydHMuSW50OEFycmF5ID0gZXhwb3J0cy5JbnQ4QXJyYXkgfHwgSW50OEFycmF5O1xuICBleHBvcnRzLlVpbnQ4QXJyYXkgPSBleHBvcnRzLlVpbnQ4QXJyYXkgfHwgVWludDhBcnJheTtcbiAgZXhwb3J0cy5VaW50OENsYW1wZWRBcnJheSA9IGV4cG9ydHMuVWludDhDbGFtcGVkQXJyYXkgfHwgVWludDhDbGFtcGVkQXJyYXk7XG4gIGV4cG9ydHMuSW50MTZBcnJheSA9IGV4cG9ydHMuSW50MTZBcnJheSB8fCBJbnQxNkFycmF5O1xuICBleHBvcnRzLlVpbnQxNkFycmF5ID0gZXhwb3J0cy5VaW50MTZBcnJheSB8fCBVaW50MTZBcnJheTtcbiAgZXhwb3J0cy5JbnQzMkFycmF5ID0gZXhwb3J0cy5JbnQzMkFycmF5IHx8IEludDMyQXJyYXk7XG4gIGV4cG9ydHMuVWludDMyQXJyYXkgPSBleHBvcnRzLlVpbnQzMkFycmF5IHx8IFVpbnQzMkFycmF5O1xuICBleHBvcnRzLkZsb2F0MzJBcnJheSA9IGV4cG9ydHMuRmxvYXQzMkFycmF5IHx8IEZsb2F0MzJBcnJheTtcbiAgZXhwb3J0cy5GbG9hdDY0QXJyYXkgPSBleHBvcnRzLkZsb2F0NjRBcnJheSB8fCBGbG9hdDY0QXJyYXk7XG59KCkpO1xuXG4vL1xuLy8gNiBUaGUgRGF0YVZpZXcgVmlldyBUeXBlXG4vL1xuXG4oZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIHIoYXJyYXksIGluZGV4KSB7XG4gICAgcmV0dXJuIEVDTUFTY3JpcHQuSXNDYWxsYWJsZShhcnJheS5nZXQpID8gYXJyYXkuZ2V0KGluZGV4KSA6IGFycmF5W2luZGV4XTtcbiAgfVxuXG4gIHZhciBJU19CSUdfRU5ESUFOID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciB1MTZhcnJheSA9IG5ldyhleHBvcnRzLlVpbnQxNkFycmF5KShbMHgxMjM0XSksXG4gICAgICAgIHU4YXJyYXkgPSBuZXcoZXhwb3J0cy5VaW50OEFycmF5KSh1MTZhcnJheS5idWZmZXIpO1xuICAgIHJldHVybiByKHU4YXJyYXksIDApID09PSAweDEyO1xuICB9KCkpO1xuXG4gIC8vIENvbnN0cnVjdG9yKEFycmF5QnVmZmVyIGJ1ZmZlcixcbiAgLy8gICAgICAgICAgICAgb3B0aW9uYWwgdW5zaWduZWQgbG9uZyBieXRlT2Zmc2V0LFxuICAvLyAgICAgICAgICAgICBvcHRpb25hbCB1bnNpZ25lZCBsb25nIGJ5dGVMZW5ndGgpXG4gIC8qKiBAY29uc3RydWN0b3IgKi9cbiAgdmFyIERhdGFWaWV3ID0gZnVuY3Rpb24gRGF0YVZpZXcoYnVmZmVyLCBieXRlT2Zmc2V0LCBieXRlTGVuZ3RoKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigwKTtcbiAgICB9IGVsc2UgaWYgKCEoYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIgfHwgRUNNQVNjcmlwdC5DbGFzcyhidWZmZXIpID09PSAnQXJyYXlCdWZmZXInKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlR5cGVFcnJvclwiKTtcbiAgICB9XG5cbiAgICB0aGlzLmJ1ZmZlciA9IGJ1ZmZlciB8fCBuZXcgQXJyYXlCdWZmZXIoMCk7XG5cbiAgICB0aGlzLmJ5dGVPZmZzZXQgPSBFQ01BU2NyaXB0LlRvVWludDMyKGJ5dGVPZmZzZXQpO1xuICAgIGlmICh0aGlzLmJ5dGVPZmZzZXQgPiB0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcImJ5dGVPZmZzZXQgb3V0IG9mIHJhbmdlXCIpO1xuICAgIH1cblxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykge1xuICAgICAgdGhpcy5ieXRlTGVuZ3RoID0gdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCAtIHRoaXMuYnl0ZU9mZnNldDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ieXRlTGVuZ3RoID0gRUNNQVNjcmlwdC5Ub1VpbnQzMihieXRlTGVuZ3RoKTtcbiAgICB9XG5cbiAgICBpZiAoKHRoaXMuYnl0ZU9mZnNldCArIHRoaXMuYnl0ZUxlbmd0aCkgPiB0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcImJ5dGVPZmZzZXQgYW5kIGxlbmd0aCByZWZlcmVuY2UgYW4gYXJlYSBiZXlvbmQgdGhlIGVuZCBvZiB0aGUgYnVmZmVyXCIpO1xuICAgIH1cblxuICAgIGNvbmZpZ3VyZVByb3BlcnRpZXModGhpcyk7XG4gIH07XG5cbiAgZnVuY3Rpb24gbWFrZUdldHRlcihhcnJheVR5cGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oYnl0ZU9mZnNldCwgbGl0dGxlRW5kaWFuKSB7XG5cbiAgICAgIGJ5dGVPZmZzZXQgPSBFQ01BU2NyaXB0LlRvVWludDMyKGJ5dGVPZmZzZXQpO1xuXG4gICAgICBpZiAoYnl0ZU9mZnNldCArIGFycmF5VHlwZS5CWVRFU19QRVJfRUxFTUVOVCA+IHRoaXMuYnl0ZUxlbmd0aCkge1xuICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcIkFycmF5IGluZGV4IG91dCBvZiByYW5nZVwiKTtcbiAgICAgIH1cbiAgICAgIGJ5dGVPZmZzZXQgKz0gdGhpcy5ieXRlT2Zmc2V0O1xuXG4gICAgICB2YXIgdWludDhBcnJheSA9IG5ldyBVaW50OEFycmF5KHRoaXMuYnVmZmVyLCBieXRlT2Zmc2V0LCBhcnJheVR5cGUuQllURVNfUEVSX0VMRU1FTlQpLFxuICAgICAgICAgIGJ5dGVzID0gW10sIGk7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgYXJyYXlUeXBlLkJZVEVTX1BFUl9FTEVNRU5UOyBpICs9IDEpIHtcbiAgICAgICAgYnl0ZXMucHVzaChyKHVpbnQ4QXJyYXksIGkpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKEJvb2xlYW4obGl0dGxlRW5kaWFuKSA9PT0gQm9vbGVhbihJU19CSUdfRU5ESUFOKSkge1xuICAgICAgICBieXRlcy5yZXZlcnNlKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByKG5ldyBhcnJheVR5cGUobmV3IFVpbnQ4QXJyYXkoYnl0ZXMpLmJ1ZmZlciksIDApO1xuICAgIH07XG4gIH1cblxuICBEYXRhVmlldy5wcm90b3R5cGUuZ2V0VWludDggPSBtYWtlR2V0dGVyKGV4cG9ydHMuVWludDhBcnJheSk7XG4gIERhdGFWaWV3LnByb3RvdHlwZS5nZXRJbnQ4ID0gbWFrZUdldHRlcihleHBvcnRzLkludDhBcnJheSk7XG4gIERhdGFWaWV3LnByb3RvdHlwZS5nZXRVaW50MTYgPSBtYWtlR2V0dGVyKGV4cG9ydHMuVWludDE2QXJyYXkpO1xuICBEYXRhVmlldy5wcm90b3R5cGUuZ2V0SW50MTYgPSBtYWtlR2V0dGVyKGV4cG9ydHMuSW50MTZBcnJheSk7XG4gIERhdGFWaWV3LnByb3RvdHlwZS5nZXRVaW50MzIgPSBtYWtlR2V0dGVyKGV4cG9ydHMuVWludDMyQXJyYXkpO1xuICBEYXRhVmlldy5wcm90b3R5cGUuZ2V0SW50MzIgPSBtYWtlR2V0dGVyKGV4cG9ydHMuSW50MzJBcnJheSk7XG4gIERhdGFWaWV3LnByb3RvdHlwZS5nZXRGbG9hdDMyID0gbWFrZUdldHRlcihleHBvcnRzLkZsb2F0MzJBcnJheSk7XG4gIERhdGFWaWV3LnByb3RvdHlwZS5nZXRGbG9hdDY0ID0gbWFrZUdldHRlcihleHBvcnRzLkZsb2F0NjRBcnJheSk7XG5cbiAgZnVuY3Rpb24gbWFrZVNldHRlcihhcnJheVR5cGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oYnl0ZU9mZnNldCwgdmFsdWUsIGxpdHRsZUVuZGlhbikge1xuXG4gICAgICBieXRlT2Zmc2V0ID0gRUNNQVNjcmlwdC5Ub1VpbnQzMihieXRlT2Zmc2V0KTtcbiAgICAgIGlmIChieXRlT2Zmc2V0ICsgYXJyYXlUeXBlLkJZVEVTX1BFUl9FTEVNRU5UID4gdGhpcy5ieXRlTGVuZ3RoKSB7XG4gICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwiQXJyYXkgaW5kZXggb3V0IG9mIHJhbmdlXCIpO1xuICAgICAgfVxuXG4gICAgICAvLyBHZXQgYnl0ZXNcbiAgICAgIHZhciB0eXBlQXJyYXkgPSBuZXcgYXJyYXlUeXBlKFt2YWx1ZV0pLFxuICAgICAgICAgIGJ5dGVBcnJheSA9IG5ldyBVaW50OEFycmF5KHR5cGVBcnJheS5idWZmZXIpLFxuICAgICAgICAgIGJ5dGVzID0gW10sIGksIGJ5dGVWaWV3O1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgYXJyYXlUeXBlLkJZVEVTX1BFUl9FTEVNRU5UOyBpICs9IDEpIHtcbiAgICAgICAgYnl0ZXMucHVzaChyKGJ5dGVBcnJheSwgaSkpO1xuICAgICAgfVxuXG4gICAgICAvLyBGbGlwIGlmIG5lY2Vzc2FyeVxuICAgICAgaWYgKEJvb2xlYW4obGl0dGxlRW5kaWFuKSA9PT0gQm9vbGVhbihJU19CSUdfRU5ESUFOKSkge1xuICAgICAgICBieXRlcy5yZXZlcnNlKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFdyaXRlIHRoZW1cbiAgICAgIGJ5dGVWaWV3ID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5idWZmZXIsIGJ5dGVPZmZzZXQsIGFycmF5VHlwZS5CWVRFU19QRVJfRUxFTUVOVCk7XG4gICAgICBieXRlVmlldy5zZXQoYnl0ZXMpO1xuICAgIH07XG4gIH1cblxuICBEYXRhVmlldy5wcm90b3R5cGUuc2V0VWludDggPSBtYWtlU2V0dGVyKGV4cG9ydHMuVWludDhBcnJheSk7XG4gIERhdGFWaWV3LnByb3RvdHlwZS5zZXRJbnQ4ID0gbWFrZVNldHRlcihleHBvcnRzLkludDhBcnJheSk7XG4gIERhdGFWaWV3LnByb3RvdHlwZS5zZXRVaW50MTYgPSBtYWtlU2V0dGVyKGV4cG9ydHMuVWludDE2QXJyYXkpO1xuICBEYXRhVmlldy5wcm90b3R5cGUuc2V0SW50MTYgPSBtYWtlU2V0dGVyKGV4cG9ydHMuSW50MTZBcnJheSk7XG4gIERhdGFWaWV3LnByb3RvdHlwZS5zZXRVaW50MzIgPSBtYWtlU2V0dGVyKGV4cG9ydHMuVWludDMyQXJyYXkpO1xuICBEYXRhVmlldy5wcm90b3R5cGUuc2V0SW50MzIgPSBtYWtlU2V0dGVyKGV4cG9ydHMuSW50MzJBcnJheSk7XG4gIERhdGFWaWV3LnByb3RvdHlwZS5zZXRGbG9hdDMyID0gbWFrZVNldHRlcihleHBvcnRzLkZsb2F0MzJBcnJheSk7XG4gIERhdGFWaWV3LnByb3RvdHlwZS5zZXRGbG9hdDY0ID0gbWFrZVNldHRlcihleHBvcnRzLkZsb2F0NjRBcnJheSk7XG5cbiAgZXhwb3J0cy5EYXRhVmlldyA9IGV4cG9ydHMuRGF0YVZpZXcgfHwgRGF0YVZpZXc7XG5cbn0oKSk7XG5cbn0se31dfSx7fSxbXSlcbjs7bW9kdWxlLmV4cG9ydHM9cmVxdWlyZShcIm5hdGl2ZS1idWZmZXItYnJvd3NlcmlmeVwiKS5CdWZmZXJcbiIsIi8qanNoaW50IG5vZGU6dHJ1ZSAqL1xuLyoqXG4gKiBAZmlsZU92ZXJ2aWV3XG4gKiBjb3B5IERlY2xhcmF0aW9uIEZpbGVcbiAqXG4gKiBAYXV0aG9yIFNoYW5ub24gTW9lbGxlclxuICogQHZlcnNpb24gMS4wXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENvcGllcyB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIG9uZSBvciBtb3JlIG9iamVjdHMgdG8gYSB0YXJnZXQgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXQgVGFyZ2V0IG9iamVjdC5cbiAqIEBwYXJhbSB7Li4uT2JqZWN0fSBvYmpzIE9iamVjdHMgd2l0aCBwcm9wZXJ0aWVzIHRvIGNvcHkuXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRhcmdldCBvYmplY3QsIGF1Z21lbnRlZC5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb3B5KHRhcmdldCkge1xuICAgIHZhciBhcmcsIGksIGtleSwgbGVuO1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgZm9yIChpID0gMSwgbGVuID0gYXJncy5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICBhcmcgPSBhcmdzW2ldO1xuXG4gICAgICAgIGZvciAoa2V5IGluIGFyZykge1xuICAgICAgICAgICAgaWYgKGFyZy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBhcmdba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXQ7XG59O1xuIiwidmFyIEJ1ZmZlcj1yZXF1aXJlKFwiX19icm93c2VyaWZ5X0J1ZmZlclwiKTtcbihmdW5jdGlvbiAoZ2xvYmFsLCBtb2R1bGUpIHtcblxuICBpZiAoJ3VuZGVmaW5lZCcgPT0gdHlwZW9mIG1vZHVsZSkge1xuICAgIHZhciBtb2R1bGUgPSB7IGV4cG9ydHM6IHt9IH1cbiAgICAgICwgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzXG4gIH1cblxuICAvKipcbiAgICogRXhwb3J0cy5cbiAgICovXG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBleHBlY3Q7XG4gIGV4cGVjdC5Bc3NlcnRpb24gPSBBc3NlcnRpb247XG5cbiAgLyoqXG4gICAqIEV4cG9ydHMgdmVyc2lvbi5cbiAgICovXG5cbiAgZXhwZWN0LnZlcnNpb24gPSAnMC4xLjInO1xuXG4gIC8qKlxuICAgKiBQb3NzaWJsZSBhc3NlcnRpb24gZmxhZ3MuXG4gICAqL1xuXG4gIHZhciBmbGFncyA9IHtcbiAgICAgIG5vdDogWyd0bycsICdiZScsICdoYXZlJywgJ2luY2x1ZGUnLCAnb25seSddXG4gICAgLCB0bzogWydiZScsICdoYXZlJywgJ2luY2x1ZGUnLCAnb25seScsICdub3QnXVxuICAgICwgb25seTogWydoYXZlJ11cbiAgICAsIGhhdmU6IFsnb3duJ11cbiAgICAsIGJlOiBbJ2FuJ11cbiAgfTtcblxuICBmdW5jdGlvbiBleHBlY3QgKG9iaikge1xuICAgIHJldHVybiBuZXcgQXNzZXJ0aW9uKG9iaik7XG4gIH1cblxuICAvKipcbiAgICogQ29uc3RydWN0b3JcbiAgICpcbiAgICogQGFwaSBwcml2YXRlXG4gICAqL1xuXG4gIGZ1bmN0aW9uIEFzc2VydGlvbiAob2JqLCBmbGFnLCBwYXJlbnQpIHtcbiAgICB0aGlzLm9iaiA9IG9iajtcbiAgICB0aGlzLmZsYWdzID0ge307XG5cbiAgICBpZiAodW5kZWZpbmVkICE9IHBhcmVudCkge1xuICAgICAgdGhpcy5mbGFnc1tmbGFnXSA9IHRydWU7XG5cbiAgICAgIGZvciAodmFyIGkgaW4gcGFyZW50LmZsYWdzKSB7XG4gICAgICAgIGlmIChwYXJlbnQuZmxhZ3MuaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICB0aGlzLmZsYWdzW2ldID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHZhciAkZmxhZ3MgPSBmbGFnID8gZmxhZ3NbZmxhZ10gOiBrZXlzKGZsYWdzKVxuICAgICAgLCBzZWxmID0gdGhpc1xuXG4gICAgaWYgKCRmbGFncykge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSAkZmxhZ3MubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIC8vIGF2b2lkIHJlY3Vyc2lvblxuICAgICAgICBpZiAodGhpcy5mbGFnc1skZmxhZ3NbaV1dKSBjb250aW51ZTtcblxuICAgICAgICB2YXIgbmFtZSA9ICRmbGFnc1tpXVxuICAgICAgICAgICwgYXNzZXJ0aW9uID0gbmV3IEFzc2VydGlvbih0aGlzLm9iaiwgbmFtZSwgdGhpcylcblxuICAgICAgICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgQXNzZXJ0aW9uLnByb3RvdHlwZVtuYW1lXSkge1xuICAgICAgICAgIC8vIGNsb25lIHRoZSBmdW5jdGlvbiwgbWFrZSBzdXJlIHdlIGRvbnQgdG91Y2ggdGhlIHByb3QgcmVmZXJlbmNlXG4gICAgICAgICAgdmFyIG9sZCA9IHRoaXNbbmFtZV07XG4gICAgICAgICAgdGhpc1tuYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBvbGQuYXBwbHkoc2VsZiwgYXJndW1lbnRzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IgKHZhciBmbiBpbiBBc3NlcnRpb24ucHJvdG90eXBlKSB7XG4gICAgICAgICAgICBpZiAoQXNzZXJ0aW9uLnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eShmbikgJiYgZm4gIT0gbmFtZSkge1xuICAgICAgICAgICAgICB0aGlzW25hbWVdW2ZuXSA9IGJpbmQoYXNzZXJ0aW9uW2ZuXSwgYXNzZXJ0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpc1tuYW1lXSA9IGFzc2VydGlvbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogUGVyZm9ybXMgYW4gYXNzZXJ0aW9uXG4gICAqXG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cblxuICBBc3NlcnRpb24ucHJvdG90eXBlLmFzc2VydCA9IGZ1bmN0aW9uICh0cnV0aCwgbXNnLCBlcnJvcikge1xuICAgIHZhciBtc2cgPSB0aGlzLmZsYWdzLm5vdCA/IGVycm9yIDogbXNnXG4gICAgICAsIG9rID0gdGhpcy5mbGFncy5ub3QgPyAhdHJ1dGggOiB0cnV0aDtcblxuICAgIGlmICghb2spIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihtc2cuY2FsbCh0aGlzKSk7XG4gICAgfVxuXG4gICAgdGhpcy5hbmQgPSBuZXcgQXNzZXJ0aW9uKHRoaXMub2JqKTtcbiAgfTtcblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIHZhbHVlIGlzIHRydXRoeVxuICAgKlxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBBc3NlcnRpb24ucHJvdG90eXBlLm9rID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuYXNzZXJ0KFxuICAgICAgICAhIXRoaXMub2JqXG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBiZSB0cnV0aHknIH1cbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIGJlIGZhbHN5JyB9KTtcbiAgfTtcblxuICAvKipcbiAgICogQXNzZXJ0IHRoYXQgdGhlIGZ1bmN0aW9uIHRocm93cy5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbnxSZWdFeHB9IGNhbGxiYWNrLCBvciByZWdleHAgdG8gbWF0Y2ggZXJyb3Igc3RyaW5nIGFnYWluc3RcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS50aHJvd0Vycm9yID1cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS50aHJvd0V4Y2VwdGlvbiA9IGZ1bmN0aW9uIChmbikge1xuICAgIGV4cGVjdCh0aGlzLm9iaikudG8uYmUuYSgnZnVuY3Rpb24nKTtcblxuICAgIHZhciB0aHJvd24gPSBmYWxzZVxuICAgICAgLCBub3QgPSB0aGlzLmZsYWdzLm5vdFxuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMub2JqKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGZuKSB7XG4gICAgICAgIGZuKGUpO1xuICAgICAgfSBlbHNlIGlmICgnb2JqZWN0JyA9PSB0eXBlb2YgZm4pIHtcbiAgICAgICAgdmFyIHN1YmplY3QgPSAnc3RyaW5nJyA9PSB0eXBlb2YgZSA/IGUgOiBlLm1lc3NhZ2U7XG4gICAgICAgIGlmIChub3QpIHtcbiAgICAgICAgICBleHBlY3Qoc3ViamVjdCkudG8ubm90Lm1hdGNoKGZuKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBleHBlY3Qoc3ViamVjdCkudG8ubWF0Y2goZm4pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aHJvd24gPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICgnb2JqZWN0JyA9PSB0eXBlb2YgZm4gJiYgbm90KSB7XG4gICAgICAvLyBpbiB0aGUgcHJlc2VuY2Ugb2YgYSBtYXRjaGVyLCBlbnN1cmUgdGhlIGBub3RgIG9ubHkgYXBwbGllcyB0b1xuICAgICAgLy8gdGhlIG1hdGNoaW5nLlxuICAgICAgdGhpcy5mbGFncy5ub3QgPSBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgbmFtZSA9IHRoaXMub2JqLm5hbWUgfHwgJ2ZuJztcbiAgICB0aGlzLmFzc2VydChcbiAgICAgICAgdGhyb3duXG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIG5hbWUgKyAnIHRvIHRocm93IGFuIGV4Y2VwdGlvbicgfVxuICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBuYW1lICsgJyBub3QgdG8gdGhyb3cgYW4gZXhjZXB0aW9uJyB9KTtcbiAgfTtcblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBhcnJheSBpcyBlbXB0eS5cbiAgICpcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS5lbXB0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXhwZWN0YXRpb247XG5cbiAgICBpZiAoJ29iamVjdCcgPT0gdHlwZW9mIHRoaXMub2JqICYmIG51bGwgIT09IHRoaXMub2JqICYmICFpc0FycmF5KHRoaXMub2JqKSkge1xuICAgICAgaWYgKCdudW1iZXInID09IHR5cGVvZiB0aGlzLm9iai5sZW5ndGgpIHtcbiAgICAgICAgZXhwZWN0YXRpb24gPSAhdGhpcy5vYmoubGVuZ3RoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXhwZWN0YXRpb24gPSAha2V5cyh0aGlzLm9iaikubGVuZ3RoO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoJ3N0cmluZycgIT0gdHlwZW9mIHRoaXMub2JqKSB7XG4gICAgICAgIGV4cGVjdCh0aGlzLm9iaikudG8uYmUuYW4oJ29iamVjdCcpO1xuICAgICAgfVxuXG4gICAgICBleHBlY3QodGhpcy5vYmopLnRvLmhhdmUucHJvcGVydHkoJ2xlbmd0aCcpO1xuICAgICAgZXhwZWN0YXRpb24gPSAhdGhpcy5vYmoubGVuZ3RoO1xuICAgIH1cblxuICAgIHRoaXMuYXNzZXJ0KFxuICAgICAgICBleHBlY3RhdGlvblxuICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gYmUgZW1wdHknIH1cbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIG5vdCBiZSBlbXB0eScgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgb2JqIGV4YWN0bHkgZXF1YWxzIGFub3RoZXIuXG4gICAqXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIEFzc2VydGlvbi5wcm90b3R5cGUuYmUgPVxuICBBc3NlcnRpb24ucHJvdG90eXBlLmVxdWFsID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHRoaXMuYXNzZXJ0KFxuICAgICAgICBvYmogPT09IHRoaXMub2JqXG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBlcXVhbCAnICsgaShvYmopIH1cbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIG5vdCBlcXVhbCAnICsgaShvYmopIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIG9iaiBzb3J0b2YgZXF1YWxzIGFub3RoZXIuXG4gICAqXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIEFzc2VydGlvbi5wcm90b3R5cGUuZXFsID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHRoaXMuYXNzZXJ0KFxuICAgICAgICBleHBlY3QuZXFsKG9iaiwgdGhpcy5vYmopXG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBzb3J0IG9mIGVxdWFsICcgKyBpKG9iaikgfVxuICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gc29ydCBvZiBub3QgZXF1YWwgJyArIGkob2JqKSB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogQXNzZXJ0IHdpdGhpbiBzdGFydCB0byBmaW5pc2ggKGluY2x1c2l2ZSkuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzdGFydFxuICAgKiBAcGFyYW0ge051bWJlcn0gZmluaXNoXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIEFzc2VydGlvbi5wcm90b3R5cGUud2l0aGluID0gZnVuY3Rpb24gKHN0YXJ0LCBmaW5pc2gpIHtcbiAgICB2YXIgcmFuZ2UgPSBzdGFydCArICcuLicgKyBmaW5pc2g7XG4gICAgdGhpcy5hc3NlcnQoXG4gICAgICAgIHRoaXMub2JqID49IHN0YXJ0ICYmIHRoaXMub2JqIDw9IGZpbmlzaFxuICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gYmUgd2l0aGluICcgKyByYW5nZSB9XG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBub3QgYmUgd2l0aGluICcgKyByYW5nZSB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogQXNzZXJ0IHR5cGVvZiAvIGluc3RhbmNlIG9mXG4gICAqXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIEFzc2VydGlvbi5wcm90b3R5cGUuYSA9XG4gIEFzc2VydGlvbi5wcm90b3R5cGUuYW4gPSBmdW5jdGlvbiAodHlwZSkge1xuICAgIGlmICgnc3RyaW5nJyA9PSB0eXBlb2YgdHlwZSkge1xuICAgICAgLy8gcHJvcGVyIGVuZ2xpc2ggaW4gZXJyb3IgbXNnXG4gICAgICB2YXIgbiA9IC9eW2FlaW91XS8udGVzdCh0eXBlKSA/ICduJyA6ICcnO1xuXG4gICAgICAvLyB0eXBlb2Ygd2l0aCBzdXBwb3J0IGZvciAnYXJyYXknXG4gICAgICB0aGlzLmFzc2VydChcbiAgICAgICAgICAnYXJyYXknID09IHR5cGUgPyBpc0FycmF5KHRoaXMub2JqKSA6XG4gICAgICAgICAgICAnb2JqZWN0JyA9PSB0eXBlXG4gICAgICAgICAgICAgID8gJ29iamVjdCcgPT0gdHlwZW9mIHRoaXMub2JqICYmIG51bGwgIT09IHRoaXMub2JqXG4gICAgICAgICAgICAgIDogdHlwZSA9PSB0eXBlb2YgdGhpcy5vYmpcbiAgICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gYmUgYScgKyBuICsgJyAnICsgdHlwZSB9XG4gICAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIG5vdCB0byBiZSBhJyArIG4gKyAnICcgKyB0eXBlIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBpbnN0YW5jZW9mXG4gICAgICB2YXIgbmFtZSA9IHR5cGUubmFtZSB8fCAnc3VwcGxpZWQgY29uc3RydWN0b3InO1xuICAgICAgdGhpcy5hc3NlcnQoXG4gICAgICAgICAgdGhpcy5vYmogaW5zdGFuY2VvZiB0eXBlXG4gICAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIGJlIGFuIGluc3RhbmNlIG9mICcgKyBuYW1lIH1cbiAgICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgbm90IHRvIGJlIGFuIGluc3RhbmNlIG9mICcgKyBuYW1lIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgbnVtZXJpYyB2YWx1ZSBhYm92ZSBfbl8uXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBuXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIEFzc2VydGlvbi5wcm90b3R5cGUuZ3JlYXRlclRoYW4gPVxuICBBc3NlcnRpb24ucHJvdG90eXBlLmFib3ZlID0gZnVuY3Rpb24gKG4pIHtcbiAgICB0aGlzLmFzc2VydChcbiAgICAgICAgdGhpcy5vYmogPiBuXG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBiZSBhYm92ZSAnICsgbiB9XG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBiZSBiZWxvdyAnICsgbiB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogQXNzZXJ0IG51bWVyaWMgdmFsdWUgYmVsb3cgX25fLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gblxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBBc3NlcnRpb24ucHJvdG90eXBlLmxlc3NUaGFuID1cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS5iZWxvdyA9IGZ1bmN0aW9uIChuKSB7XG4gICAgdGhpcy5hc3NlcnQoXG4gICAgICAgIHRoaXMub2JqIDwgblxuICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gYmUgYmVsb3cgJyArIG4gfVxuICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gYmUgYWJvdmUgJyArIG4gfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFzc2VydCBzdHJpbmcgdmFsdWUgbWF0Y2hlcyBfcmVnZXhwXy5cbiAgICpcbiAgICogQHBhcmFtIHtSZWdFeHB9IHJlZ2V4cFxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBBc3NlcnRpb24ucHJvdG90eXBlLm1hdGNoID0gZnVuY3Rpb24gKHJlZ2V4cCkge1xuICAgIHRoaXMuYXNzZXJ0KFxuICAgICAgICByZWdleHAuZXhlYyh0aGlzLm9iailcbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIG1hdGNoICcgKyByZWdleHAgfVxuICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgbm90IHRvIG1hdGNoICcgKyByZWdleHAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFzc2VydCBwcm9wZXJ0eSBcImxlbmd0aFwiIGV4aXN0cyBhbmQgaGFzIHZhbHVlIG9mIF9uXy5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG5cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS5sZW5ndGggPSBmdW5jdGlvbiAobikge1xuICAgIGV4cGVjdCh0aGlzLm9iaikudG8uaGF2ZS5wcm9wZXJ0eSgnbGVuZ3RoJyk7XG4gICAgdmFyIGxlbiA9IHRoaXMub2JqLmxlbmd0aDtcbiAgICB0aGlzLmFzc2VydChcbiAgICAgICAgbiA9PSBsZW5cbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIGhhdmUgYSBsZW5ndGggb2YgJyArIG4gKyAnIGJ1dCBnb3QgJyArIGxlbiB9XG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBub3QgaGF2ZSBhIGxlbmd0aCBvZiAnICsgbGVuIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgcHJvcGVydHkgX25hbWVfIGV4aXN0cywgd2l0aCBvcHRpb25hbCBfdmFsXy5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAgICogQHBhcmFtIHtNaXhlZH0gdmFsXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIEFzc2VydGlvbi5wcm90b3R5cGUucHJvcGVydHkgPSBmdW5jdGlvbiAobmFtZSwgdmFsKSB7XG4gICAgaWYgKHRoaXMuZmxhZ3Mub3duKSB7XG4gICAgICB0aGlzLmFzc2VydChcbiAgICAgICAgICBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGhpcy5vYmosIG5hbWUpXG4gICAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIGhhdmUgb3duIHByb3BlcnR5ICcgKyBpKG5hbWUpIH1cbiAgICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gbm90IGhhdmUgb3duIHByb3BlcnR5ICcgKyBpKG5hbWUpIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZmxhZ3Mubm90ICYmIHVuZGVmaW5lZCAhPT0gdmFsKSB7XG4gICAgICBpZiAodW5kZWZpbmVkID09PSB0aGlzLm9ialtuYW1lXSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoaSh0aGlzLm9iaikgKyAnIGhhcyBubyBwcm9wZXJ0eSAnICsgaShuYW1lKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBoYXNQcm9wO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaGFzUHJvcCA9IG5hbWUgaW4gdGhpcy5vYmpcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaGFzUHJvcCA9IHVuZGVmaW5lZCAhPT0gdGhpcy5vYmpbbmFtZV1cbiAgICAgIH1cblxuICAgICAgdGhpcy5hc3NlcnQoXG4gICAgICAgICAgaGFzUHJvcFxuICAgICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBoYXZlIGEgcHJvcGVydHkgJyArIGkobmFtZSkgfVxuICAgICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBub3QgaGF2ZSBhIHByb3BlcnR5ICcgKyBpKG5hbWUpIH0pO1xuICAgIH1cblxuICAgIGlmICh1bmRlZmluZWQgIT09IHZhbCkge1xuICAgICAgdGhpcy5hc3NlcnQoXG4gICAgICAgICAgdmFsID09PSB0aGlzLm9ialtuYW1lXVxuICAgICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBoYXZlIGEgcHJvcGVydHkgJyArIGkobmFtZSlcbiAgICAgICAgICArICcgb2YgJyArIGkodmFsKSArICcsIGJ1dCBnb3QgJyArIGkodGhpcy5vYmpbbmFtZV0pIH1cbiAgICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gbm90IGhhdmUgYSBwcm9wZXJ0eSAnICsgaShuYW1lKVxuICAgICAgICAgICsgJyBvZiAnICsgaSh2YWwpIH0pO1xuICAgIH1cblxuICAgIHRoaXMub2JqID0gdGhpcy5vYmpbbmFtZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFzc2VydCB0aGF0IHRoZSBhcnJheSBjb250YWlucyBfb2JqXyBvciBzdHJpbmcgY29udGFpbnMgX29ial8uXG4gICAqXG4gICAqIEBwYXJhbSB7TWl4ZWR9IG9ianxzdHJpbmdcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS5zdHJpbmcgPVxuICBBc3NlcnRpb24ucHJvdG90eXBlLmNvbnRhaW4gPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgaWYgKCdzdHJpbmcnID09IHR5cGVvZiB0aGlzLm9iaikge1xuICAgICAgdGhpcy5hc3NlcnQoXG4gICAgICAgICAgfnRoaXMub2JqLmluZGV4T2Yob2JqKVxuICAgICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBjb250YWluICcgKyBpKG9iaikgfVxuICAgICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBub3QgY29udGFpbiAnICsgaShvYmopIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFzc2VydChcbiAgICAgICAgICB+aW5kZXhPZih0aGlzLm9iaiwgb2JqKVxuICAgICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBjb250YWluICcgKyBpKG9iaikgfVxuICAgICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBub3QgY29udGFpbiAnICsgaShvYmopIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogQXNzZXJ0IGV4YWN0IGtleXMgb3IgaW5jbHVzaW9uIG9mIGtleXMgYnkgdXNpbmdcbiAgICogdGhlIGAub3duYCBtb2RpZmllci5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheXxTdHJpbmcgLi4ufSBrZXlzXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIEFzc2VydGlvbi5wcm90b3R5cGUua2V5ID1cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24gKCRrZXlzKSB7XG4gICAgdmFyIHN0clxuICAgICAgLCBvayA9IHRydWU7XG5cbiAgICAka2V5cyA9IGlzQXJyYXkoJGtleXMpXG4gICAgICA/ICRrZXlzXG4gICAgICA6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgICBpZiAoISRrZXlzLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCdrZXlzIHJlcXVpcmVkJyk7XG5cbiAgICB2YXIgYWN0dWFsID0ga2V5cyh0aGlzLm9iailcbiAgICAgICwgbGVuID0gJGtleXMubGVuZ3RoO1xuXG4gICAgLy8gSW5jbHVzaW9uXG4gICAgb2sgPSBldmVyeSgka2V5cywgZnVuY3Rpb24gKGtleSkge1xuICAgICAgcmV0dXJuIH5pbmRleE9mKGFjdHVhbCwga2V5KTtcbiAgICB9KTtcblxuICAgIC8vIFN0cmljdFxuICAgIGlmICghdGhpcy5mbGFncy5ub3QgJiYgdGhpcy5mbGFncy5vbmx5KSB7XG4gICAgICBvayA9IG9rICYmICRrZXlzLmxlbmd0aCA9PSBhY3R1YWwubGVuZ3RoO1xuICAgIH1cblxuICAgIC8vIEtleSBzdHJpbmdcbiAgICBpZiAobGVuID4gMSkge1xuICAgICAgJGtleXMgPSBtYXAoJGtleXMsIGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgcmV0dXJuIGkoa2V5KTtcbiAgICAgIH0pO1xuICAgICAgdmFyIGxhc3QgPSAka2V5cy5wb3AoKTtcbiAgICAgIHN0ciA9ICRrZXlzLmpvaW4oJywgJykgKyAnLCBhbmQgJyArIGxhc3Q7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGkoJGtleXNbMF0pO1xuICAgIH1cblxuICAgIC8vIEZvcm1cbiAgICBzdHIgPSAobGVuID4gMSA/ICdrZXlzICcgOiAna2V5ICcpICsgc3RyO1xuXG4gICAgLy8gSGF2ZSAvIGluY2x1ZGVcbiAgICBzdHIgPSAoIXRoaXMuZmxhZ3Mub25seSA/ICdpbmNsdWRlICcgOiAnb25seSBoYXZlICcpICsgc3RyO1xuXG4gICAgLy8gQXNzZXJ0aW9uXG4gICAgdGhpcy5hc3NlcnQoXG4gICAgICAgIG9rXG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byAnICsgc3RyIH1cbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIG5vdCAnICsgc3RyIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIC8qKlxuICAgKiBBc3NlcnQgYSBmYWlsdXJlLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZyAuLi59IGN1c3RvbSBtZXNzYWdlXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuICBBc3NlcnRpb24ucHJvdG90eXBlLmZhaWwgPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgbXNnID0gbXNnIHx8IFwiZXhwbGljaXQgZmFpbHVyZVwiO1xuICAgIHRoaXMuYXNzZXJ0KGZhbHNlLCBtc2csIG1zZyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIGJpbmQgaW1wbGVtZW50YXRpb24uXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGJpbmQgKGZuLCBzY29wZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZm4uYXBwbHkoc2NvcGUsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFycmF5IGV2ZXJ5IGNvbXBhdGliaWxpdHlcbiAgICpcbiAgICogQHNlZSBiaXQubHkvNUZxMU4yXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGV2ZXJ5IChhcnIsIGZuLCB0aGlzT2JqKSB7XG4gICAgdmFyIHNjb3BlID0gdGhpc09iaiB8fCBnbG9iYWw7XG4gICAgZm9yICh2YXIgaSA9IDAsIGogPSBhcnIubGVuZ3RoOyBpIDwgajsgKytpKSB7XG4gICAgICBpZiAoIWZuLmNhbGwoc2NvcGUsIGFycltpXSwgaSwgYXJyKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBcnJheSBpbmRleE9mIGNvbXBhdGliaWxpdHkuXG4gICAqXG4gICAqIEBzZWUgYml0Lmx5L2E1RHhhMlxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBmdW5jdGlvbiBpbmRleE9mIChhcnIsIG8sIGkpIHtcbiAgICBpZiAoQXJyYXkucHJvdG90eXBlLmluZGV4T2YpIHtcbiAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGFyciwgbywgaSk7XG4gICAgfVxuXG4gICAgaWYgKGFyci5sZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGZvciAodmFyIGogPSBhcnIubGVuZ3RoLCBpID0gaSA8IDAgPyBpICsgaiA8IDAgPyAwIDogaSArIGogOiBpIHx8IDBcbiAgICAgICAgOyBpIDwgaiAmJiBhcnJbaV0gIT09IG87IGkrKyk7XG5cbiAgICByZXR1cm4gaiA8PSBpID8gLTEgOiBpO1xuICB9O1xuXG4gIC8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tLzEwNDQxMjgvXG4gIHZhciBnZXRPdXRlckhUTUwgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgaWYgKCdvdXRlckhUTUwnIGluIGVsZW1lbnQpIHJldHVybiBlbGVtZW50Lm91dGVySFRNTDtcbiAgICB2YXIgbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWxcIjtcbiAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnXycpO1xuICAgIHZhciBlbGVtUHJvdG8gPSAod2luZG93LkhUTUxFbGVtZW50IHx8IHdpbmRvdy5FbGVtZW50KS5wcm90b3R5cGU7XG4gICAgdmFyIHhtbFNlcmlhbGl6ZXIgPSBuZXcgWE1MU2VyaWFsaXplcigpO1xuICAgIHZhciBodG1sO1xuICAgIGlmIChkb2N1bWVudC54bWxWZXJzaW9uKSB7XG4gICAgICByZXR1cm4geG1sU2VyaWFsaXplci5zZXJpYWxpemVUb1N0cmluZyhlbGVtZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGVsZW1lbnQuY2xvbmVOb2RlKGZhbHNlKSk7XG4gICAgICBodG1sID0gY29udGFpbmVyLmlubmVySFRNTC5yZXBsYWNlKCc+PCcsICc+JyArIGVsZW1lbnQuaW5uZXJIVE1MICsgJzwnKTtcbiAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICAgIHJldHVybiBodG1sO1xuICAgIH1cbiAgfTtcblxuICAvLyBSZXR1cm5zIHRydWUgaWYgb2JqZWN0IGlzIGEgRE9NIGVsZW1lbnQuXG4gIHZhciBpc0RPTUVsZW1lbnQgPSBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgaWYgKHR5cGVvZiBIVE1MRWxlbWVudCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybiBvYmplY3QgaW5zdGFuY2VvZiBIVE1MRWxlbWVudDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9iamVjdCAmJlxuICAgICAgICB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJlxuICAgICAgICBvYmplY3Qubm9kZVR5cGUgPT09IDEgJiZcbiAgICAgICAgdHlwZW9mIG9iamVjdC5ub2RlTmFtZSA9PT0gJ3N0cmluZyc7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBJbnNwZWN0cyBhbiBvYmplY3QuXG4gICAqXG4gICAqIEBzZWUgdGFrZW4gZnJvbSBub2RlLmpzIGB1dGlsYCBtb2R1bGUgKGNvcHlyaWdodCBKb3llbnQsIE1JVCBsaWNlbnNlKVxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgZnVuY3Rpb24gaSAob2JqLCBzaG93SGlkZGVuLCBkZXB0aCkge1xuICAgIHZhciBzZWVuID0gW107XG5cbiAgICBmdW5jdGlvbiBzdHlsaXplIChzdHIpIHtcbiAgICAgIHJldHVybiBzdHI7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGZvcm1hdCAodmFsdWUsIHJlY3Vyc2VUaW1lcykge1xuICAgICAgLy8gUHJvdmlkZSBhIGhvb2sgZm9yIHVzZXItc3BlY2lmaWVkIGluc3BlY3QgZnVuY3Rpb25zLlxuICAgICAgLy8gQ2hlY2sgdGhhdCB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCBhbiBpbnNwZWN0IGZ1bmN0aW9uIG9uIGl0XG4gICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlLmluc3BlY3QgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgICAgICAvLyBGaWx0ZXIgb3V0IHRoZSB1dGlsIG1vZHVsZSwgaXQncyBpbnNwZWN0IGZ1bmN0aW9uIGlzIHNwZWNpYWxcbiAgICAgICAgICB2YWx1ZSAhPT0gZXhwb3J0cyAmJlxuICAgICAgICAgIC8vIEFsc28gZmlsdGVyIG91dCBhbnkgcHJvdG90eXBlIG9iamVjdHMgdXNpbmcgdGhlIGNpcmN1bGFyIGNoZWNrLlxuICAgICAgICAgICEodmFsdWUuY29uc3RydWN0b3IgJiYgdmFsdWUuY29uc3RydWN0b3IucHJvdG90eXBlID09PSB2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlLmluc3BlY3QocmVjdXJzZVRpbWVzKTtcbiAgICAgIH1cblxuICAgICAgLy8gUHJpbWl0aXZlIHR5cGVzIGNhbm5vdCBoYXZlIHByb3BlcnRpZXNcbiAgICAgIHN3aXRjaCAodHlwZW9mIHZhbHVlKSB7XG4gICAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICAgICAgcmV0dXJuIHN0eWxpemUoJ3VuZGVmaW5lZCcsICd1bmRlZmluZWQnKTtcblxuICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgIHZhciBzaW1wbGUgPSAnXFwnJyArIGpzb24uc3RyaW5naWZ5KHZhbHVlKS5yZXBsYWNlKC9eXCJ8XCIkL2csICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKSArICdcXCcnO1xuICAgICAgICAgIHJldHVybiBzdHlsaXplKHNpbXBsZSwgJ3N0cmluZycpO1xuXG4gICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgcmV0dXJuIHN0eWxpemUoJycgKyB2YWx1ZSwgJ251bWJlcicpO1xuXG4gICAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICAgIHJldHVybiBzdHlsaXplKCcnICsgdmFsdWUsICdib29sZWFuJyk7XG4gICAgICB9XG4gICAgICAvLyBGb3Igc29tZSByZWFzb24gdHlwZW9mIG51bGwgaXMgXCJvYmplY3RcIiwgc28gc3BlY2lhbCBjYXNlIGhlcmUuXG4gICAgICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHN0eWxpemUoJ251bGwnLCAnbnVsbCcpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNET01FbGVtZW50KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gZ2V0T3V0ZXJIVE1MKHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgLy8gTG9vayB1cCB0aGUga2V5cyBvZiB0aGUgb2JqZWN0LlxuICAgICAgdmFyIHZpc2libGVfa2V5cyA9IGtleXModmFsdWUpO1xuICAgICAgdmFyICRrZXlzID0gc2hvd0hpZGRlbiA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHZhbHVlKSA6IHZpc2libGVfa2V5cztcblxuICAgICAgLy8gRnVuY3Rpb25zIHdpdGhvdXQgcHJvcGVydGllcyBjYW4gYmUgc2hvcnRjdXR0ZWQuXG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nICYmICRrZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHN0eWxpemUoJycgKyB2YWx1ZSwgJ3JlZ2V4cCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBuYW1lID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgICAgICAgcmV0dXJuIHN0eWxpemUoJ1tGdW5jdGlvbicgKyBuYW1lICsgJ10nLCAnc3BlY2lhbCcpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIERhdGVzIHdpdGhvdXQgcHJvcGVydGllcyBjYW4gYmUgc2hvcnRjdXR0ZWRcbiAgICAgIGlmIChpc0RhdGUodmFsdWUpICYmICRrZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gc3R5bGl6ZSh2YWx1ZS50b1VUQ1N0cmluZygpLCAnZGF0ZScpO1xuICAgICAgfVxuXG4gICAgICB2YXIgYmFzZSwgdHlwZSwgYnJhY2VzO1xuICAgICAgLy8gRGV0ZXJtaW5lIHRoZSBvYmplY3QgdHlwZVxuICAgICAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIHR5cGUgPSAnQXJyYXknO1xuICAgICAgICBicmFjZXMgPSBbJ1snLCAnXSddO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHlwZSA9ICdPYmplY3QnO1xuICAgICAgICBicmFjZXMgPSBbJ3snLCAnfSddO1xuICAgICAgfVxuXG4gICAgICAvLyBNYWtlIGZ1bmN0aW9ucyBzYXkgdGhhdCB0aGV5IGFyZSBmdW5jdGlvbnNcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmFyIG4gPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICAgICAgYmFzZSA9IChpc1JlZ0V4cCh2YWx1ZSkpID8gJyAnICsgdmFsdWUgOiAnIFtGdW5jdGlvbicgKyBuICsgJ10nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYmFzZSA9ICcnO1xuICAgICAgfVxuXG4gICAgICAvLyBNYWtlIGRhdGVzIHdpdGggcHJvcGVydGllcyBmaXJzdCBzYXkgdGhlIGRhdGVcbiAgICAgIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgICAgIGJhc2UgPSAnICcgKyB2YWx1ZS50b1VUQ1N0cmluZygpO1xuICAgICAgfVxuXG4gICAgICBpZiAoJGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgYnJhY2VzWzFdO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjdXJzZVRpbWVzIDwgMCkge1xuICAgICAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHN0eWxpemUoJycgKyB2YWx1ZSwgJ3JlZ2V4cCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBzdHlsaXplKCdbT2JqZWN0XScsICdzcGVjaWFsJyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc2Vlbi5wdXNoKHZhbHVlKTtcblxuICAgICAgdmFyIG91dHB1dCA9IG1hcCgka2V5cywgZnVuY3Rpb24gKGtleSkge1xuICAgICAgICB2YXIgbmFtZSwgc3RyO1xuICAgICAgICBpZiAodmFsdWUuX19sb29rdXBHZXR0ZXJfXykge1xuICAgICAgICAgIGlmICh2YWx1ZS5fX2xvb2t1cEdldHRlcl9fKGtleSkpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZS5fX2xvb2t1cFNldHRlcl9fKGtleSkpIHtcbiAgICAgICAgICAgICAgc3RyID0gc3R5bGl6ZSgnW0dldHRlci9TZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHN0ciA9IHN0eWxpemUoJ1tHZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHZhbHVlLl9fbG9va3VwU2V0dGVyX18oa2V5KSkge1xuICAgICAgICAgICAgICBzdHIgPSBzdHlsaXplKCdbU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChpbmRleE9mKHZpc2libGVfa2V5cywga2V5KSA8IDApIHtcbiAgICAgICAgICBuYW1lID0gJ1snICsga2V5ICsgJ10nO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc3RyKSB7XG4gICAgICAgICAgaWYgKGluZGV4T2Yoc2VlbiwgdmFsdWVba2V5XSkgPCAwKSB7XG4gICAgICAgICAgICBpZiAocmVjdXJzZVRpbWVzID09PSBudWxsKSB7XG4gICAgICAgICAgICAgIHN0ciA9IGZvcm1hdCh2YWx1ZVtrZXldKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHN0ciA9IGZvcm1hdCh2YWx1ZVtrZXldLCByZWN1cnNlVGltZXMgLSAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzdHIuaW5kZXhPZignXFxuJykgPiAtMSkge1xuICAgICAgICAgICAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBzdHIgPSBtYXAoc3RyLnNwbGl0KCdcXG4nKSwgZnVuY3Rpb24gKGxpbmUpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiAnICAnICsgbGluZTtcbiAgICAgICAgICAgICAgICB9KS5qb2luKCdcXG4nKS5zdWJzdHIoMik7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3RyID0gJ1xcbicgKyBtYXAoc3RyLnNwbGl0KCdcXG4nKSwgZnVuY3Rpb24gKGxpbmUpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiAnICAgJyArIGxpbmU7XG4gICAgICAgICAgICAgICAgfSkuam9pbignXFxuJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RyID0gc3R5bGl6ZSgnW0NpcmN1bGFyXScsICdzcGVjaWFsJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBpZiAodHlwZSA9PT0gJ0FycmF5JyAmJiBrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICAgIH1cbiAgICAgICAgICBuYW1lID0ganNvbi5zdHJpbmdpZnkoJycgKyBrZXkpO1xuICAgICAgICAgIGlmIChuYW1lLm1hdGNoKC9eXCIoW2EtekEtWl9dW2EtekEtWl8wLTldKilcIiQvKSkge1xuICAgICAgICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyKDEsIG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICAgICAgICBuYW1lID0gc3R5bGl6ZShuYW1lLCAnbmFtZScpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKVxuICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKF5cInxcIiQpL2csIFwiJ1wiKTtcbiAgICAgICAgICAgIG5hbWUgPSBzdHlsaXplKG5hbWUsICdzdHJpbmcnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmFtZSArICc6ICcgKyBzdHI7XG4gICAgICB9KTtcblxuICAgICAgc2Vlbi5wb3AoKTtcblxuICAgICAgdmFyIG51bUxpbmVzRXN0ID0gMDtcbiAgICAgIHZhciBsZW5ndGggPSByZWR1Y2Uob3V0cHV0LCBmdW5jdGlvbiAocHJldiwgY3VyKSB7XG4gICAgICAgIG51bUxpbmVzRXN0Kys7XG4gICAgICAgIGlmIChpbmRleE9mKGN1ciwgJ1xcbicpID49IDApIG51bUxpbmVzRXN0Kys7XG4gICAgICAgIHJldHVybiBwcmV2ICsgY3VyLmxlbmd0aCArIDE7XG4gICAgICB9LCAwKTtcblxuICAgICAgaWYgKGxlbmd0aCA+IDUwKSB7XG4gICAgICAgIG91dHB1dCA9IGJyYWNlc1swXSArXG4gICAgICAgICAgICAgICAgIChiYXNlID09PSAnJyA/ICcnIDogYmFzZSArICdcXG4gJykgK1xuICAgICAgICAgICAgICAgICAnICcgK1xuICAgICAgICAgICAgICAgICBvdXRwdXQuam9pbignLFxcbiAgJykgK1xuICAgICAgICAgICAgICAgICAnICcgK1xuICAgICAgICAgICAgICAgICBicmFjZXNbMV07XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dHB1dCA9IGJyYWNlc1swXSArIGJhc2UgKyAnICcgKyBvdXRwdXQuam9pbignLCAnKSArICcgJyArIGJyYWNlc1sxXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG4gICAgcmV0dXJuIGZvcm1hdChvYmosICh0eXBlb2YgZGVwdGggPT09ICd1bmRlZmluZWQnID8gMiA6IGRlcHRoKSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gaXNBcnJheSAoYXIpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFyKSA9PSAnW29iamVjdCBBcnJheV0nO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGlzUmVnRXhwKHJlKSB7XG4gICAgdmFyIHM7XG4gICAgdHJ5IHtcbiAgICAgIHMgPSAnJyArIHJlO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmUgaW5zdGFuY2VvZiBSZWdFeHAgfHwgLy8gZWFzeSBjYXNlXG4gICAgICAgICAgIC8vIGR1Y2stdHlwZSBmb3IgY29udGV4dC1zd2l0Y2hpbmcgZXZhbGN4IGNhc2VcbiAgICAgICAgICAgdHlwZW9mKHJlKSA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgICAgICAgICByZS5jb25zdHJ1Y3Rvci5uYW1lID09PSAnUmVnRXhwJyAmJlxuICAgICAgICAgICByZS5jb21waWxlICYmXG4gICAgICAgICAgIHJlLnRlc3QgJiZcbiAgICAgICAgICAgcmUuZXhlYyAmJlxuICAgICAgICAgICBzLm1hdGNoKC9eXFwvLipcXC9bZ2ltXXswLDN9JC8pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGlzRGF0ZShkKSB7XG4gICAgaWYgKGQgaW5zdGFuY2VvZiBEYXRlKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgZnVuY3Rpb24ga2V5cyAob2JqKSB7XG4gICAgaWYgKE9iamVjdC5rZXlzKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqKTtcbiAgICB9XG5cbiAgICB2YXIga2V5cyA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSBpbiBvYmopIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBpKSkge1xuICAgICAgICBrZXlzLnB1c2goaSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGtleXM7XG4gIH1cblxuICBmdW5jdGlvbiBtYXAgKGFyciwgbWFwcGVyLCB0aGF0KSB7XG4gICAgaWYgKEFycmF5LnByb3RvdHlwZS5tYXApIHtcbiAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUubWFwLmNhbGwoYXJyLCBtYXBwZXIsIHRoYXQpO1xuICAgIH1cblxuICAgIHZhciBvdGhlcj0gbmV3IEFycmF5KGFyci5sZW5ndGgpO1xuXG4gICAgZm9yICh2YXIgaT0gMCwgbiA9IGFyci5sZW5ndGg7IGk8bjsgaSsrKVxuICAgICAgaWYgKGkgaW4gYXJyKVxuICAgICAgICBvdGhlcltpXSA9IG1hcHBlci5jYWxsKHRoYXQsIGFycltpXSwgaSwgYXJyKTtcblxuICAgIHJldHVybiBvdGhlcjtcbiAgfTtcblxuICBmdW5jdGlvbiByZWR1Y2UgKGFyciwgZnVuKSB7XG4gICAgaWYgKEFycmF5LnByb3RvdHlwZS5yZWR1Y2UpIHtcbiAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUucmVkdWNlLmFwcGx5KFxuICAgICAgICAgIGFyclxuICAgICAgICAsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdmFyIGxlbiA9ICt0aGlzLmxlbmd0aDtcblxuICAgIGlmICh0eXBlb2YgZnVuICE9PSBcImZ1bmN0aW9uXCIpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG5cbiAgICAvLyBubyB2YWx1ZSB0byByZXR1cm4gaWYgbm8gaW5pdGlhbCB2YWx1ZSBhbmQgYW4gZW1wdHkgYXJyYXlcbiAgICBpZiAobGVuID09PSAwICYmIGFyZ3VtZW50cy5sZW5ndGggPT09IDEpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG5cbiAgICB2YXIgaSA9IDA7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMikge1xuICAgICAgdmFyIHJ2ID0gYXJndW1lbnRzWzFdO1xuICAgIH0gZWxzZSB7XG4gICAgICBkbyB7XG4gICAgICAgIGlmIChpIGluIHRoaXMpIHtcbiAgICAgICAgICBydiA9IHRoaXNbaSsrXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIGFycmF5IGNvbnRhaW5zIG5vIHZhbHVlcywgbm8gaW5pdGlhbCB2YWx1ZSB0byByZXR1cm5cbiAgICAgICAgaWYgKCsraSA+PSBsZW4pXG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgICAgfSB3aGlsZSAodHJ1ZSk7XG4gICAgfVxuXG4gICAgZm9yICg7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKGkgaW4gdGhpcylcbiAgICAgICAgcnYgPSBmdW4uY2FsbChudWxsLCBydiwgdGhpc1tpXSwgaSwgdGhpcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJ2O1xuICB9O1xuXG4gIC8qKlxuICAgKiBBc3NlcnRzIGRlZXAgZXF1YWxpdHlcbiAgICpcbiAgICogQHNlZSB0YWtlbiBmcm9tIG5vZGUuanMgYGFzc2VydGAgbW9kdWxlIChjb3B5cmlnaHQgSm95ZW50LCBNSVQgbGljZW5zZSlcbiAgICogQGFwaSBwcml2YXRlXG4gICAqL1xuXG4gIGV4cGVjdC5lcWwgPSBmdW5jdGlvbiBlcWwgKGFjdHVhbCwgZXhwZWN0ZWQpIHtcbiAgICAvLyA3LjEuIEFsbCBpZGVudGljYWwgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBhcyBkZXRlcm1pbmVkIGJ5ID09PS5cbiAgICBpZiAoYWN0dWFsID09PSBleHBlY3RlZCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIGlmICgndW5kZWZpbmVkJyAhPSB0eXBlb2YgQnVmZmVyXG4gICAgICAgICYmIEJ1ZmZlci5pc0J1ZmZlcihhY3R1YWwpICYmIEJ1ZmZlci5pc0J1ZmZlcihleHBlY3RlZCkpIHtcbiAgICAgIGlmIChhY3R1YWwubGVuZ3RoICE9IGV4cGVjdGVkLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFjdHVhbC5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoYWN0dWFsW2ldICE9PSBleHBlY3RlZFtpXSkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcblxuICAgIC8vIDcuMi4gSWYgdGhlIGV4cGVjdGVkIHZhbHVlIGlzIGEgRGF0ZSBvYmplY3QsIHRoZSBhY3R1YWwgdmFsdWUgaXNcbiAgICAvLyBlcXVpdmFsZW50IGlmIGl0IGlzIGFsc28gYSBEYXRlIG9iamVjdCB0aGF0IHJlZmVycyB0byB0aGUgc2FtZSB0aW1lLlxuICAgIH0gZWxzZSBpZiAoYWN0dWFsIGluc3RhbmNlb2YgRGF0ZSAmJiBleHBlY3RlZCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgIHJldHVybiBhY3R1YWwuZ2V0VGltZSgpID09PSBleHBlY3RlZC5nZXRUaW1lKCk7XG5cbiAgICAvLyA3LjMuIE90aGVyIHBhaXJzIHRoYXQgZG8gbm90IGJvdGggcGFzcyB0eXBlb2YgdmFsdWUgPT0gXCJvYmplY3RcIixcbiAgICAvLyBlcXVpdmFsZW5jZSBpcyBkZXRlcm1pbmVkIGJ5ID09LlxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGFjdHVhbCAhPSAnb2JqZWN0JyAmJiB0eXBlb2YgZXhwZWN0ZWQgIT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybiBhY3R1YWwgPT0gZXhwZWN0ZWQ7XG5cbiAgICAvLyA3LjQuIEZvciBhbGwgb3RoZXIgT2JqZWN0IHBhaXJzLCBpbmNsdWRpbmcgQXJyYXkgb2JqZWN0cywgZXF1aXZhbGVuY2UgaXNcbiAgICAvLyBkZXRlcm1pbmVkIGJ5IGhhdmluZyB0aGUgc2FtZSBudW1iZXIgb2Ygb3duZWQgcHJvcGVydGllcyAoYXMgdmVyaWZpZWRcbiAgICAvLyB3aXRoIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCksIHRoZSBzYW1lIHNldCBvZiBrZXlzXG4gICAgLy8gKGFsdGhvdWdoIG5vdCBuZWNlc3NhcmlseSB0aGUgc2FtZSBvcmRlciksIGVxdWl2YWxlbnQgdmFsdWVzIGZvciBldmVyeVxuICAgIC8vIGNvcnJlc3BvbmRpbmcga2V5LCBhbmQgYW4gaWRlbnRpY2FsIFwicHJvdG90eXBlXCIgcHJvcGVydHkuIE5vdGU6IHRoaXNcbiAgICAvLyBhY2NvdW50cyBmb3IgYm90aCBuYW1lZCBhbmQgaW5kZXhlZCBwcm9wZXJ0aWVzIG9uIEFycmF5cy5cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9iakVxdWl2KGFjdHVhbCwgZXhwZWN0ZWQpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGlzVW5kZWZpbmVkT3JOdWxsICh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNBcmd1bWVudHMgKG9iamVjdCkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqZWN0KSA9PSAnW29iamVjdCBBcmd1bWVudHNdJztcbiAgfVxuXG4gIGZ1bmN0aW9uIG9iakVxdWl2IChhLCBiKSB7XG4gICAgaWYgKGlzVW5kZWZpbmVkT3JOdWxsKGEpIHx8IGlzVW5kZWZpbmVkT3JOdWxsKGIpKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIC8vIGFuIGlkZW50aWNhbCBcInByb3RvdHlwZVwiIHByb3BlcnR5LlxuICAgIGlmIChhLnByb3RvdHlwZSAhPT0gYi5wcm90b3R5cGUpIHJldHVybiBmYWxzZTtcbiAgICAvL35+fkkndmUgbWFuYWdlZCB0byBicmVhayBPYmplY3Qua2V5cyB0aHJvdWdoIHNjcmV3eSBhcmd1bWVudHMgcGFzc2luZy5cbiAgICAvLyAgIENvbnZlcnRpbmcgdG8gYXJyYXkgc29sdmVzIHRoZSBwcm9ibGVtLlxuICAgIGlmIChpc0FyZ3VtZW50cyhhKSkge1xuICAgICAgaWYgKCFpc0FyZ3VtZW50cyhiKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBhID0gcFNsaWNlLmNhbGwoYSk7XG4gICAgICBiID0gcFNsaWNlLmNhbGwoYik7XG4gICAgICByZXR1cm4gZXhwZWN0LmVxbChhLCBiKTtcbiAgICB9XG4gICAgdHJ5e1xuICAgICAgdmFyIGthID0ga2V5cyhhKSxcbiAgICAgICAga2IgPSBrZXlzKGIpLFxuICAgICAgICBrZXksIGk7XG4gICAgfSBjYXRjaCAoZSkgey8vaGFwcGVucyB3aGVuIG9uZSBpcyBhIHN0cmluZyBsaXRlcmFsIGFuZCB0aGUgb3RoZXIgaXNuJ3RcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gaGF2aW5nIHRoZSBzYW1lIG51bWJlciBvZiBvd25lZCBwcm9wZXJ0aWVzIChrZXlzIGluY29ycG9yYXRlcyBoYXNPd25Qcm9wZXJ0eSlcbiAgICBpZiAoa2EubGVuZ3RoICE9IGtiLmxlbmd0aClcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICAvL3RoZSBzYW1lIHNldCBvZiBrZXlzIChhbHRob3VnaCBub3QgbmVjZXNzYXJpbHkgdGhlIHNhbWUgb3JkZXIpLFxuICAgIGthLnNvcnQoKTtcbiAgICBrYi5zb3J0KCk7XG4gICAgLy9+fn5jaGVhcCBrZXkgdGVzdFxuICAgIGZvciAoaSA9IGthLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBpZiAoa2FbaV0gIT0ga2JbaV0pXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy9lcXVpdmFsZW50IHZhbHVlcyBmb3IgZXZlcnkgY29ycmVzcG9uZGluZyBrZXksIGFuZFxuICAgIC8vfn5+cG9zc2libHkgZXhwZW5zaXZlIGRlZXAgdGVzdFxuICAgIGZvciAoaSA9IGthLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBrZXkgPSBrYVtpXTtcbiAgICAgIGlmICghZXhwZWN0LmVxbChhW2tleV0sIGJba2V5XSkpXG4gICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgdmFyIGpzb24gPSAoZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgaWYgKCdvYmplY3QnID09IHR5cGVvZiBKU09OICYmIEpTT04ucGFyc2UgJiYgSlNPTi5zdHJpbmdpZnkpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICAgcGFyc2U6IG5hdGl2ZUpTT04ucGFyc2VcbiAgICAgICAgLCBzdHJpbmdpZnk6IG5hdGl2ZUpTT04uc3RyaW5naWZ5XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIEpTT04gPSB7fTtcblxuICAgIGZ1bmN0aW9uIGYobikge1xuICAgICAgICAvLyBGb3JtYXQgaW50ZWdlcnMgdG8gaGF2ZSBhdCBsZWFzdCB0d28gZGlnaXRzLlxuICAgICAgICByZXR1cm4gbiA8IDEwID8gJzAnICsgbiA6IG47XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGF0ZShkLCBrZXkpIHtcbiAgICAgIHJldHVybiBpc0Zpbml0ZShkLnZhbHVlT2YoKSkgP1xuICAgICAgICAgIGQuZ2V0VVRDRnVsbFllYXIoKSAgICAgKyAnLScgK1xuICAgICAgICAgIGYoZC5nZXRVVENNb250aCgpICsgMSkgKyAnLScgK1xuICAgICAgICAgIGYoZC5nZXRVVENEYXRlKCkpICAgICAgKyAnVCcgK1xuICAgICAgICAgIGYoZC5nZXRVVENIb3VycygpKSAgICAgKyAnOicgK1xuICAgICAgICAgIGYoZC5nZXRVVENNaW51dGVzKCkpICAgKyAnOicgK1xuICAgICAgICAgIGYoZC5nZXRVVENTZWNvbmRzKCkpICAgKyAnWicgOiBudWxsO1xuICAgIH07XG5cbiAgICB2YXIgY3ggPSAvW1xcdTAwMDBcXHUwMGFkXFx1MDYwMC1cXHUwNjA0XFx1MDcwZlxcdTE3YjRcXHUxN2I1XFx1MjAwYy1cXHUyMDBmXFx1MjAyOC1cXHUyMDJmXFx1MjA2MC1cXHUyMDZmXFx1ZmVmZlxcdWZmZjAtXFx1ZmZmZl0vZyxcbiAgICAgICAgZXNjYXBhYmxlID0gL1tcXFxcXFxcIlxceDAwLVxceDFmXFx4N2YtXFx4OWZcXHUwMGFkXFx1MDYwMC1cXHUwNjA0XFx1MDcwZlxcdTE3YjRcXHUxN2I1XFx1MjAwYy1cXHUyMDBmXFx1MjAyOC1cXHUyMDJmXFx1MjA2MC1cXHUyMDZmXFx1ZmVmZlxcdWZmZjAtXFx1ZmZmZl0vZyxcbiAgICAgICAgZ2FwLFxuICAgICAgICBpbmRlbnQsXG4gICAgICAgIG1ldGEgPSB7ICAgIC8vIHRhYmxlIG9mIGNoYXJhY3RlciBzdWJzdGl0dXRpb25zXG4gICAgICAgICAgICAnXFxiJzogJ1xcXFxiJyxcbiAgICAgICAgICAgICdcXHQnOiAnXFxcXHQnLFxuICAgICAgICAgICAgJ1xcbic6ICdcXFxcbicsXG4gICAgICAgICAgICAnXFxmJzogJ1xcXFxmJyxcbiAgICAgICAgICAgICdcXHInOiAnXFxcXHInLFxuICAgICAgICAgICAgJ1wiJyA6ICdcXFxcXCInLFxuICAgICAgICAgICAgJ1xcXFwnOiAnXFxcXFxcXFwnXG4gICAgICAgIH0sXG4gICAgICAgIHJlcDtcblxuXG4gICAgZnVuY3Rpb24gcXVvdGUoc3RyaW5nKSB7XG5cbiAgLy8gSWYgdGhlIHN0cmluZyBjb250YWlucyBubyBjb250cm9sIGNoYXJhY3RlcnMsIG5vIHF1b3RlIGNoYXJhY3RlcnMsIGFuZCBub1xuICAvLyBiYWNrc2xhc2ggY2hhcmFjdGVycywgdGhlbiB3ZSBjYW4gc2FmZWx5IHNsYXAgc29tZSBxdW90ZXMgYXJvdW5kIGl0LlxuICAvLyBPdGhlcndpc2Ugd2UgbXVzdCBhbHNvIHJlcGxhY2UgdGhlIG9mZmVuZGluZyBjaGFyYWN0ZXJzIHdpdGggc2FmZSBlc2NhcGVcbiAgLy8gc2VxdWVuY2VzLlxuXG4gICAgICAgIGVzY2FwYWJsZS5sYXN0SW5kZXggPSAwO1xuICAgICAgICByZXR1cm4gZXNjYXBhYmxlLnRlc3Qoc3RyaW5nKSA/ICdcIicgKyBzdHJpbmcucmVwbGFjZShlc2NhcGFibGUsIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICB2YXIgYyA9IG1ldGFbYV07XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIGMgPT09ICdzdHJpbmcnID8gYyA6XG4gICAgICAgICAgICAgICAgJ1xcXFx1JyArICgnMDAwMCcgKyBhLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtNCk7XG4gICAgICAgIH0pICsgJ1wiJyA6ICdcIicgKyBzdHJpbmcgKyAnXCInO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gc3RyKGtleSwgaG9sZGVyKSB7XG5cbiAgLy8gUHJvZHVjZSBhIHN0cmluZyBmcm9tIGhvbGRlcltrZXldLlxuXG4gICAgICAgIHZhciBpLCAgICAgICAgICAvLyBUaGUgbG9vcCBjb3VudGVyLlxuICAgICAgICAgICAgaywgICAgICAgICAgLy8gVGhlIG1lbWJlciBrZXkuXG4gICAgICAgICAgICB2LCAgICAgICAgICAvLyBUaGUgbWVtYmVyIHZhbHVlLlxuICAgICAgICAgICAgbGVuZ3RoLFxuICAgICAgICAgICAgbWluZCA9IGdhcCxcbiAgICAgICAgICAgIHBhcnRpYWwsXG4gICAgICAgICAgICB2YWx1ZSA9IGhvbGRlcltrZXldO1xuXG4gIC8vIElmIHRoZSB2YWx1ZSBoYXMgYSB0b0pTT04gbWV0aG9kLCBjYWxsIGl0IHRvIG9idGFpbiBhIHJlcGxhY2VtZW50IHZhbHVlLlxuXG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgICAgIHZhbHVlID0gZGF0ZShrZXkpO1xuICAgICAgICB9XG5cbiAgLy8gSWYgd2Ugd2VyZSBjYWxsZWQgd2l0aCBhIHJlcGxhY2VyIGZ1bmN0aW9uLCB0aGVuIGNhbGwgdGhlIHJlcGxhY2VyIHRvXG4gIC8vIG9idGFpbiBhIHJlcGxhY2VtZW50IHZhbHVlLlxuXG4gICAgICAgIGlmICh0eXBlb2YgcmVwID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHJlcC5jYWxsKGhvbGRlciwga2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cblxuICAvLyBXaGF0IGhhcHBlbnMgbmV4dCBkZXBlbmRzIG9uIHRoZSB2YWx1ZSdzIHR5cGUuXG5cbiAgICAgICAgc3dpdGNoICh0eXBlb2YgdmFsdWUpIHtcbiAgICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgICAgIHJldHVybiBxdW90ZSh2YWx1ZSk7XG5cbiAgICAgICAgY2FzZSAnbnVtYmVyJzpcblxuICAvLyBKU09OIG51bWJlcnMgbXVzdCBiZSBmaW5pdGUuIEVuY29kZSBub24tZmluaXRlIG51bWJlcnMgYXMgbnVsbC5cblxuICAgICAgICAgICAgcmV0dXJuIGlzRmluaXRlKHZhbHVlKSA/IFN0cmluZyh2YWx1ZSkgOiAnbnVsbCc7XG5cbiAgICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgIGNhc2UgJ251bGwnOlxuXG4gIC8vIElmIHRoZSB2YWx1ZSBpcyBhIGJvb2xlYW4gb3IgbnVsbCwgY29udmVydCBpdCB0byBhIHN0cmluZy4gTm90ZTpcbiAgLy8gdHlwZW9mIG51bGwgZG9lcyBub3QgcHJvZHVjZSAnbnVsbCcuIFRoZSBjYXNlIGlzIGluY2x1ZGVkIGhlcmUgaW5cbiAgLy8gdGhlIHJlbW90ZSBjaGFuY2UgdGhhdCB0aGlzIGdldHMgZml4ZWQgc29tZWRheS5cblxuICAgICAgICAgICAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XG5cbiAgLy8gSWYgdGhlIHR5cGUgaXMgJ29iamVjdCcsIHdlIG1pZ2h0IGJlIGRlYWxpbmcgd2l0aCBhbiBvYmplY3Qgb3IgYW4gYXJyYXkgb3JcbiAgLy8gbnVsbC5cblxuICAgICAgICBjYXNlICdvYmplY3QnOlxuXG4gIC8vIER1ZSB0byBhIHNwZWNpZmljYXRpb24gYmx1bmRlciBpbiBFQ01BU2NyaXB0LCB0eXBlb2YgbnVsbCBpcyAnb2JqZWN0JyxcbiAgLy8gc28gd2F0Y2ggb3V0IGZvciB0aGF0IGNhc2UuXG5cbiAgICAgICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ251bGwnO1xuICAgICAgICAgICAgfVxuXG4gIC8vIE1ha2UgYW4gYXJyYXkgdG8gaG9sZCB0aGUgcGFydGlhbCByZXN1bHRzIG9mIHN0cmluZ2lmeWluZyB0aGlzIG9iamVjdCB2YWx1ZS5cblxuICAgICAgICAgICAgZ2FwICs9IGluZGVudDtcbiAgICAgICAgICAgIHBhcnRpYWwgPSBbXTtcblxuICAvLyBJcyB0aGUgdmFsdWUgYW4gYXJyYXk/XG5cbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmFwcGx5KHZhbHVlKSA9PT0gJ1tvYmplY3QgQXJyYXldJykge1xuXG4gIC8vIFRoZSB2YWx1ZSBpcyBhbiBhcnJheS4gU3RyaW5naWZ5IGV2ZXJ5IGVsZW1lbnQuIFVzZSBudWxsIGFzIGEgcGxhY2Vob2xkZXJcbiAgLy8gZm9yIG5vbi1KU09OIHZhbHVlcy5cblxuICAgICAgICAgICAgICAgIGxlbmd0aCA9IHZhbHVlLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFydGlhbFtpXSA9IHN0cihpLCB2YWx1ZSkgfHwgJ251bGwnO1xuICAgICAgICAgICAgICAgIH1cblxuICAvLyBKb2luIGFsbCBvZiB0aGUgZWxlbWVudHMgdG9nZXRoZXIsIHNlcGFyYXRlZCB3aXRoIGNvbW1hcywgYW5kIHdyYXAgdGhlbSBpblxuICAvLyBicmFja2V0cy5cblxuICAgICAgICAgICAgICAgIHYgPSBwYXJ0aWFsLmxlbmd0aCA9PT0gMCA/ICdbXScgOiBnYXAgP1xuICAgICAgICAgICAgICAgICAgICAnW1xcbicgKyBnYXAgKyBwYXJ0aWFsLmpvaW4oJyxcXG4nICsgZ2FwKSArICdcXG4nICsgbWluZCArICddJyA6XG4gICAgICAgICAgICAgICAgICAgICdbJyArIHBhcnRpYWwuam9pbignLCcpICsgJ10nO1xuICAgICAgICAgICAgICAgIGdhcCA9IG1pbmQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHY7XG4gICAgICAgICAgICB9XG5cbiAgLy8gSWYgdGhlIHJlcGxhY2VyIGlzIGFuIGFycmF5LCB1c2UgaXQgdG8gc2VsZWN0IHRoZSBtZW1iZXJzIHRvIGJlIHN0cmluZ2lmaWVkLlxuXG4gICAgICAgICAgICBpZiAocmVwICYmIHR5cGVvZiByZXAgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gcmVwLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByZXBbaV0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrID0gcmVwW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgdiA9IHN0cihrLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpYWwucHVzaChxdW90ZShrKSArIChnYXAgPyAnOiAnIDogJzonKSArIHYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAvLyBPdGhlcndpc2UsIGl0ZXJhdGUgdGhyb3VnaCBhbGwgb2YgdGhlIGtleXMgaW4gdGhlIG9iamVjdC5cblxuICAgICAgICAgICAgICAgIGZvciAoayBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBrKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdiA9IHN0cihrLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpYWwucHVzaChxdW90ZShrKSArIChnYXAgPyAnOiAnIDogJzonKSArIHYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gIC8vIEpvaW4gYWxsIG9mIHRoZSBtZW1iZXIgdGV4dHMgdG9nZXRoZXIsIHNlcGFyYXRlZCB3aXRoIGNvbW1hcyxcbiAgLy8gYW5kIHdyYXAgdGhlbSBpbiBicmFjZXMuXG5cbiAgICAgICAgICAgIHYgPSBwYXJ0aWFsLmxlbmd0aCA9PT0gMCA/ICd7fScgOiBnYXAgP1xuICAgICAgICAgICAgICAgICd7XFxuJyArIGdhcCArIHBhcnRpYWwuam9pbignLFxcbicgKyBnYXApICsgJ1xcbicgKyBtaW5kICsgJ30nIDpcbiAgICAgICAgICAgICAgICAneycgKyBwYXJ0aWFsLmpvaW4oJywnKSArICd9JztcbiAgICAgICAgICAgIGdhcCA9IG1pbmQ7XG4gICAgICAgICAgICByZXR1cm4gdjtcbiAgICAgICAgfVxuICAgIH1cblxuICAvLyBJZiB0aGUgSlNPTiBvYmplY3QgZG9lcyBub3QgeWV0IGhhdmUgYSBzdHJpbmdpZnkgbWV0aG9kLCBnaXZlIGl0IG9uZS5cblxuICAgIEpTT04uc3RyaW5naWZ5ID0gZnVuY3Rpb24gKHZhbHVlLCByZXBsYWNlciwgc3BhY2UpIHtcblxuICAvLyBUaGUgc3RyaW5naWZ5IG1ldGhvZCB0YWtlcyBhIHZhbHVlIGFuZCBhbiBvcHRpb25hbCByZXBsYWNlciwgYW5kIGFuIG9wdGlvbmFsXG4gIC8vIHNwYWNlIHBhcmFtZXRlciwgYW5kIHJldHVybnMgYSBKU09OIHRleHQuIFRoZSByZXBsYWNlciBjYW4gYmUgYSBmdW5jdGlvblxuICAvLyB0aGF0IGNhbiByZXBsYWNlIHZhbHVlcywgb3IgYW4gYXJyYXkgb2Ygc3RyaW5ncyB0aGF0IHdpbGwgc2VsZWN0IHRoZSBrZXlzLlxuICAvLyBBIGRlZmF1bHQgcmVwbGFjZXIgbWV0aG9kIGNhbiBiZSBwcm92aWRlZC4gVXNlIG9mIHRoZSBzcGFjZSBwYXJhbWV0ZXIgY2FuXG4gIC8vIHByb2R1Y2UgdGV4dCB0aGF0IGlzIG1vcmUgZWFzaWx5IHJlYWRhYmxlLlxuXG4gICAgICAgIHZhciBpO1xuICAgICAgICBnYXAgPSAnJztcbiAgICAgICAgaW5kZW50ID0gJyc7XG5cbiAgLy8gSWYgdGhlIHNwYWNlIHBhcmFtZXRlciBpcyBhIG51bWJlciwgbWFrZSBhbiBpbmRlbnQgc3RyaW5nIGNvbnRhaW5pbmcgdGhhdFxuICAvLyBtYW55IHNwYWNlcy5cblxuICAgICAgICBpZiAodHlwZW9mIHNwYWNlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHNwYWNlOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBpbmRlbnQgKz0gJyAnO1xuICAgICAgICAgICAgfVxuXG4gIC8vIElmIHRoZSBzcGFjZSBwYXJhbWV0ZXIgaXMgYSBzdHJpbmcsIGl0IHdpbGwgYmUgdXNlZCBhcyB0aGUgaW5kZW50IHN0cmluZy5cblxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzcGFjZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGluZGVudCA9IHNwYWNlO1xuICAgICAgICB9XG5cbiAgLy8gSWYgdGhlcmUgaXMgYSByZXBsYWNlciwgaXQgbXVzdCBiZSBhIGZ1bmN0aW9uIG9yIGFuIGFycmF5LlxuICAvLyBPdGhlcndpc2UsIHRocm93IGFuIGVycm9yLlxuXG4gICAgICAgIHJlcCA9IHJlcGxhY2VyO1xuICAgICAgICBpZiAocmVwbGFjZXIgJiYgdHlwZW9mIHJlcGxhY2VyICE9PSAnZnVuY3Rpb24nICYmXG4gICAgICAgICAgICAgICAgKHR5cGVvZiByZXBsYWNlciAhPT0gJ29iamVjdCcgfHxcbiAgICAgICAgICAgICAgICB0eXBlb2YgcmVwbGFjZXIubGVuZ3RoICE9PSAnbnVtYmVyJykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSlNPTi5zdHJpbmdpZnknKTtcbiAgICAgICAgfVxuXG4gIC8vIE1ha2UgYSBmYWtlIHJvb3Qgb2JqZWN0IGNvbnRhaW5pbmcgb3VyIHZhbHVlIHVuZGVyIHRoZSBrZXkgb2YgJycuXG4gIC8vIFJldHVybiB0aGUgcmVzdWx0IG9mIHN0cmluZ2lmeWluZyB0aGUgdmFsdWUuXG5cbiAgICAgICAgcmV0dXJuIHN0cignJywgeycnOiB2YWx1ZX0pO1xuICAgIH07XG5cbiAgLy8gSWYgdGhlIEpTT04gb2JqZWN0IGRvZXMgbm90IHlldCBoYXZlIGEgcGFyc2UgbWV0aG9kLCBnaXZlIGl0IG9uZS5cblxuICAgIEpTT04ucGFyc2UgPSBmdW5jdGlvbiAodGV4dCwgcmV2aXZlcikge1xuICAgIC8vIFRoZSBwYXJzZSBtZXRob2QgdGFrZXMgYSB0ZXh0IGFuZCBhbiBvcHRpb25hbCByZXZpdmVyIGZ1bmN0aW9uLCBhbmQgcmV0dXJuc1xuICAgIC8vIGEgSmF2YVNjcmlwdCB2YWx1ZSBpZiB0aGUgdGV4dCBpcyBhIHZhbGlkIEpTT04gdGV4dC5cblxuICAgICAgICB2YXIgajtcblxuICAgICAgICBmdW5jdGlvbiB3YWxrKGhvbGRlciwga2V5KSB7XG5cbiAgICAvLyBUaGUgd2FsayBtZXRob2QgaXMgdXNlZCB0byByZWN1cnNpdmVseSB3YWxrIHRoZSByZXN1bHRpbmcgc3RydWN0dXJlIHNvXG4gICAgLy8gdGhhdCBtb2RpZmljYXRpb25zIGNhbiBiZSBtYWRlLlxuXG4gICAgICAgICAgICB2YXIgaywgdiwgdmFsdWUgPSBob2xkZXJba2V5XTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgZm9yIChrIGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGspKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2ID0gd2Fsayh2YWx1ZSwgayk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVba10gPSB2O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgdmFsdWVba107XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmV2aXZlci5jYWxsKGhvbGRlciwga2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cblxuXG4gICAgLy8gUGFyc2luZyBoYXBwZW5zIGluIGZvdXIgc3RhZ2VzLiBJbiB0aGUgZmlyc3Qgc3RhZ2UsIHdlIHJlcGxhY2UgY2VydGFpblxuICAgIC8vIFVuaWNvZGUgY2hhcmFjdGVycyB3aXRoIGVzY2FwZSBzZXF1ZW5jZXMuIEphdmFTY3JpcHQgaGFuZGxlcyBtYW55IGNoYXJhY3RlcnNcbiAgICAvLyBpbmNvcnJlY3RseSwgZWl0aGVyIHNpbGVudGx5IGRlbGV0aW5nIHRoZW0sIG9yIHRyZWF0aW5nIHRoZW0gYXMgbGluZSBlbmRpbmdzLlxuXG4gICAgICAgIHRleHQgPSBTdHJpbmcodGV4dCk7XG4gICAgICAgIGN4Lmxhc3RJbmRleCA9IDA7XG4gICAgICAgIGlmIChjeC50ZXN0KHRleHQpKSB7XG4gICAgICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKGN4LCBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnXFxcXHUnICtcbiAgICAgICAgICAgICAgICAgICAgKCcwMDAwJyArIGEuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikpLnNsaWNlKC00KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAvLyBJbiB0aGUgc2Vjb25kIHN0YWdlLCB3ZSBydW4gdGhlIHRleHQgYWdhaW5zdCByZWd1bGFyIGV4cHJlc3Npb25zIHRoYXQgbG9va1xuICAgIC8vIGZvciBub24tSlNPTiBwYXR0ZXJucy4gV2UgYXJlIGVzcGVjaWFsbHkgY29uY2VybmVkIHdpdGggJygpJyBhbmQgJ25ldydcbiAgICAvLyBiZWNhdXNlIHRoZXkgY2FuIGNhdXNlIGludm9jYXRpb24sIGFuZCAnPScgYmVjYXVzZSBpdCBjYW4gY2F1c2UgbXV0YXRpb24uXG4gICAgLy8gQnV0IGp1c3QgdG8gYmUgc2FmZSwgd2Ugd2FudCB0byByZWplY3QgYWxsIHVuZXhwZWN0ZWQgZm9ybXMuXG5cbiAgICAvLyBXZSBzcGxpdCB0aGUgc2Vjb25kIHN0YWdlIGludG8gNCByZWdleHAgb3BlcmF0aW9ucyBpbiBvcmRlciB0byB3b3JrIGFyb3VuZFxuICAgIC8vIGNyaXBwbGluZyBpbmVmZmljaWVuY2llcyBpbiBJRSdzIGFuZCBTYWZhcmkncyByZWdleHAgZW5naW5lcy4gRmlyc3Qgd2VcbiAgICAvLyByZXBsYWNlIHRoZSBKU09OIGJhY2tzbGFzaCBwYWlycyB3aXRoICdAJyAoYSBub24tSlNPTiBjaGFyYWN0ZXIpLiBTZWNvbmQsIHdlXG4gICAgLy8gcmVwbGFjZSBhbGwgc2ltcGxlIHZhbHVlIHRva2VucyB3aXRoICddJyBjaGFyYWN0ZXJzLiBUaGlyZCwgd2UgZGVsZXRlIGFsbFxuICAgIC8vIG9wZW4gYnJhY2tldHMgdGhhdCBmb2xsb3cgYSBjb2xvbiBvciBjb21tYSBvciB0aGF0IGJlZ2luIHRoZSB0ZXh0LiBGaW5hbGx5LFxuICAgIC8vIHdlIGxvb2sgdG8gc2VlIHRoYXQgdGhlIHJlbWFpbmluZyBjaGFyYWN0ZXJzIGFyZSBvbmx5IHdoaXRlc3BhY2Ugb3IgJ10nIG9yXG4gICAgLy8gJywnIG9yICc6JyBvciAneycgb3IgJ30nLiBJZiB0aGF0IGlzIHNvLCB0aGVuIHRoZSB0ZXh0IGlzIHNhZmUgZm9yIGV2YWwuXG5cbiAgICAgICAgaWYgKC9eW1xcXSw6e31cXHNdKiQvXG4gICAgICAgICAgICAgICAgLnRlc3QodGV4dC5yZXBsYWNlKC9cXFxcKD86W1wiXFxcXFxcL2JmbnJ0XXx1WzAtOWEtZkEtRl17NH0pL2csICdAJylcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1wiW15cIlxcXFxcXG5cXHJdKlwifHRydWV8ZmFsc2V8bnVsbHwtP1xcZCsoPzpcXC5cXGQqKT8oPzpbZUVdWytcXC1dP1xcZCspPy9nLCAnXScpXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oPzpefDp8LCkoPzpcXHMqXFxbKSsvZywgJycpKSkge1xuXG4gICAgLy8gSW4gdGhlIHRoaXJkIHN0YWdlIHdlIHVzZSB0aGUgZXZhbCBmdW5jdGlvbiB0byBjb21waWxlIHRoZSB0ZXh0IGludG8gYVxuICAgIC8vIEphdmFTY3JpcHQgc3RydWN0dXJlLiBUaGUgJ3snIG9wZXJhdG9yIGlzIHN1YmplY3QgdG8gYSBzeW50YWN0aWMgYW1iaWd1aXR5XG4gICAgLy8gaW4gSmF2YVNjcmlwdDogaXQgY2FuIGJlZ2luIGEgYmxvY2sgb3IgYW4gb2JqZWN0IGxpdGVyYWwuIFdlIHdyYXAgdGhlIHRleHRcbiAgICAvLyBpbiBwYXJlbnMgdG8gZWxpbWluYXRlIHRoZSBhbWJpZ3VpdHkuXG5cbiAgICAgICAgICAgIGogPSBldmFsKCcoJyArIHRleHQgKyAnKScpO1xuXG4gICAgLy8gSW4gdGhlIG9wdGlvbmFsIGZvdXJ0aCBzdGFnZSwgd2UgcmVjdXJzaXZlbHkgd2FsayB0aGUgbmV3IHN0cnVjdHVyZSwgcGFzc2luZ1xuICAgIC8vIGVhY2ggbmFtZS92YWx1ZSBwYWlyIHRvIGEgcmV2aXZlciBmdW5jdGlvbiBmb3IgcG9zc2libGUgdHJhbnNmb3JtYXRpb24uXG5cbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgcmV2aXZlciA9PT0gJ2Z1bmN0aW9uJyA/XG4gICAgICAgICAgICAgICAgd2Fsayh7Jyc6IGp9LCAnJykgOiBqO1xuICAgICAgICB9XG5cbiAgICAvLyBJZiB0aGUgdGV4dCBpcyBub3QgSlNPTiBwYXJzZWFibGUsIHRoZW4gYSBTeW50YXhFcnJvciBpcyB0aHJvd24uXG5cbiAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCdKU09OLnBhcnNlJyk7XG4gICAgfTtcblxuICAgIHJldHVybiBKU09OO1xuICB9KSgpO1xuXG4gIGlmICgndW5kZWZpbmVkJyAhPSB0eXBlb2Ygd2luZG93KSB7XG4gICAgd2luZG93LmV4cGVjdCA9IG1vZHVsZS5leHBvcnRzO1xuICB9XG5cbn0pKFxuICAgIHRoaXNcbiAgLCAndW5kZWZpbmVkJyAhPSB0eXBlb2YgbW9kdWxlID8gbW9kdWxlIDoge31cbiAgLCAndW5kZWZpbmVkJyAhPSB0eXBlb2YgZXhwb3J0cyA/IGV4cG9ydHMgOiB7fVxuKTtcbiIsIi8qanNoaW50IG1heGxlbjpmYWxzZSAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZnMgPSByZXF1aXJlKCdmcycpO1xudmFyIGV4cGVjdCA9IHJlcXVpcmUoJ2V4cGVjdC5qcycpO1xudmFyIHRvZ2EgPSByZXF1aXJlKCcuLi8uLi9saWIvdG9nYScpO1xudmFyIFRvZ2EgPSB0b2dhO1xuXG5kZXNjcmliZSgnVG9nYScsIGZ1bmN0aW9uICgpIHtcbiAgICBpdCgnc2hvdWxkIGlnbm9yZSBub24tYmxvY2tzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpZ25vcmUgPSBcIi8vIGlnbm9yZVxcbi8qIGlnbm9yZSAqL1xcbi8qISBpZ25vcmUgKi9cXG5cXG4vL1xcbi8vIGlnbm9yZVxcbi8vXFxuLypcXG4gKiBpZ25vcmVcXG4gKi9cXG4vKiFcXG4gKiBpZ25vcmVcXG4gKi9cXG5cXG4vLyAvKiogaWdub3JlXFxudmFyIGlnbm9yZSA9ICcvKiogaWdub3JlICovJztcXG52YXIgZm9vID0gZnVuY3Rpb24oLyoqIGlnbm9yZSAqLykge307XFxuY29uc29sZS5sb2coZm9vKGlnbm9yZSkpO1xcbi8vIGlnbm9yZSAqL1xcblwiO1xuXG4gICAgICAgIGV4cGVjdCh0b2dhKGlnbm9yZSkpLnRvLmVxbChbXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICcvLyBpZ25vcmVcXG4vKiBpZ25vcmUgKi9cXG4vKiEgaWdub3JlICovXFxuXFxuLy9cXG4vLyBpZ25vcmVcXG4vL1xcbi8qXFxuICogaWdub3JlXFxuICovXFxuLyohXFxuICogaWdub3JlXFxuICovXFxuXFxuLy8gLyoqIGlnbm9yZVxcbnZhciBpZ25vcmUgPSBcXCcvKiogaWdub3JlICovXFwnO1xcbnZhciBmb28gPSBmdW5jdGlvbigvKiogaWdub3JlICovKSB7fTtcXG5jb25zb2xlLmxvZyhmb28oaWdub3JlKSk7XFxuLy8gaWdub3JlICovXFxuJyB9XG4gICAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBwYXJzZSBlbXB0eSBibG9ja3MnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVtcHR5ID0gXCIvKiovXFxuLyoqKi9cXG4vKiogKi9cXG4vKipcXG4gKlxcbiAqL1xcbi8qKlxcblxcbiovXFxuXCI7XG5cbiAgICAgICAgZXhwZWN0KHRvZ2EoKSkudG8uZXFsKFtcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ3VuZGVmaW5lZCcgfVxuICAgICAgICBdKTtcblxuICAgICAgICBleHBlY3QodG9nYShudWxsKSkudG8uZXFsKFtcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ251bGwnIH1cbiAgICAgICAgXSk7XG5cbiAgICAgICAgZXhwZWN0KHRvZ2EoJycpKS50by5lcWwoW1xuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnJyB9XG4gICAgICAgIF0pO1xuXG4gICAgICAgIGV4cGVjdCh0b2dhKGVtcHR5KSkudG8uZXFsKFtcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJy8qKi9cXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW10gfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcbicgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnRG9jQmxvY2snLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbXSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdEb2NCbG9jaycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFtdIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW10gfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcbicgfVxuICAgICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcGFyc2UgZGVzY3JpcHRpb25zJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBkZXNjID0gXCIvKiogZGVzY3JpcHRpb24gKi9cXG4vKipcXG4gKiBkZXNjcmlwdGlvblxcbiAqL1xcbi8qKlxcbmRlc2NyaXB0aW9uXFxuKi9cXG5cIjtcblxuICAgICAgICBleHBlY3QodG9nYShkZXNjKSkudG8uZXFsKFtcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJycgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnRG9jQmxvY2snLCAnZGVzY3JpcHRpb24nOiAnZGVzY3JpcHRpb24nLCAndGFncyc6IFtdIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJ2Rlc2NyaXB0aW9uJywgJ3RhZ3MnOiBbXSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdEb2NCbG9jaycsICdkZXNjcmlwdGlvbic6ICdkZXNjcmlwdGlvbicsICd0YWdzJzogW10gfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcbicgfVxuICAgICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcGFyc2UgdGFncycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdGFnID0gXCIvKiogQHRhZyB7VHlwZX0gLSBEZXNjcmlwdGlvbiBoZXJlLiAqL1xcbi8qKiBAdGFnIHtUeXBlfSBEZXNjcmlwdGlvbiBoZXJlLiAqL1xcbi8qKiBAdGFnIC0gRGVzY3JpcHRpb24uICovXFxuLyoqIEB0YWcgRGVzY3JpcHRpb24uICovXFxuLyoqIEB0YWcgKi9cXG5cIjtcblxuICAgICAgICBleHBlY3QodG9nYSh0YWcpKS50by5lcWwoW1xuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdEb2NCbG9jaycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFt7ICd0YWcnOiAndGFnJywgJ3R5cGUnOiAne1R5cGV9JywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uIGhlcmUuJyB9XSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdEb2NCbG9jaycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFt7ICd0YWcnOiAndGFnJywgJ3R5cGUnOiAne1R5cGV9JywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uIGhlcmUuJyB9XSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdEb2NCbG9jaycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFt7ICd0YWcnOiAndGFnJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uLicgfV0gfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcbicgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnRG9jQmxvY2snLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbeyAndGFnJzogJ3RhZycsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbi4nIH1dIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW3sgJ3RhZyc6ICd0YWcnIH1dIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG4nIH1cbiAgICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHBhcnNlIGFyZ3MnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZyA9IFwiLyoqIEBhcmcge1R5cGV9IFtuYW1lXSAtIERlc2NyaXB0aW9uLiAqL1xcbi8qKiBAYXJnIHtUeXBlfSBbbmFtZV0gRGVzY3JpcHRpb24uICovXFxuLyoqIEBhcmcge1R5cGV9IG5hbWUgLSBEZXNjcmlwdGlvbi4gKi9cXG4vKiogQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi4gKi9cXG4vKiogQGFyZyB7VHlwZX0gW25hbWVdICovXFxuLyoqIEBhcmcge1R5cGV9IG5hbWUgKi9cXG4vKiogQGFyZyBbbmFtZV0gLSBEZXNjcmlwdGlvbi4gKi9cXG4vKiogQGFyZyBbbmFtZV0gRGVzY3JpcHRpb24uICovXFxuLyoqIEBhcmcgbmFtZSAtIERlc2NyaXB0aW9uLiAqL1xcbi8qKiBAYXJnIG5hbWUgRGVzY3JpcHRpb24uICovXFxuLyoqIEBhcmcgW25hbWVdICovXFxuLyoqIEBhcmcgbmFtZSAqL1xcblwiO1xuXG4gICAgICAgIGV4cGVjdCh0b2dhKGFyZykpLnRvLmVxbChbXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICcnIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW3sgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICdbbmFtZV0nLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24uJyB9XSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdEb2NCbG9jaycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFt7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnW25hbWVdJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uLicgfV0gfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcbicgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnRG9jQmxvY2snLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24uJyB9XSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdEb2NCbG9jaycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFt7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbi4nIH1dIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW3sgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICdbbmFtZV0nIH1dIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW3sgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJyB9XSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdEb2NCbG9jaycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFt7ICd0YWcnOiAnYXJnJywgJ25hbWUnOiAnW25hbWVdJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uLicgfV0gfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcbicgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnRG9jQmxvY2snLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbeyAndGFnJzogJ2FyZycsICduYW1lJzogJ1tuYW1lXScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbi4nIH1dIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW3sgJ3RhZyc6ICdhcmcnLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uLicgfV0gfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcbicgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnRG9jQmxvY2snLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbeyAndGFnJzogJ2FyZycsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24uJyB9XSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdEb2NCbG9jaycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFt7ICd0YWcnOiAnYXJnJywgJ25hbWUnOiAnW25hbWVdJyB9XSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdEb2NCbG9jaycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFt7ICd0YWcnOiAnYXJnJywgJ25hbWUnOiAnbmFtZScgfV0gfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcbicgfVxuICAgICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcGFyc2UgdHlwZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHR5cGUgPSBcIi8qKiBAYXJnIHtUeXBlfSAqL1xcbi8qKiBAYXJnIHtTdHJpbmd8T2JqZWN0fSAqL1xcbi8qKiBAYXJnIHtBcnJheS48T2JqZWN0LjxTdHJpbmcsTnVtYmVyPj59ICovXFxuLyoqIEBhcmcge0Z1bmN0aW9uKFN0cmluZywgLi4uW051bWJlcl0pOiBOdW1iZXJ9IGNhbGxiYWNrICovXFxuXCI7XG5cbiAgICAgICAgZXhwZWN0KHRvZ2EodHlwZSkpLnRvLmVxbChbXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICcnIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW3sgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nIH1dIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW3sgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7U3RyaW5nfE9iamVjdH0nIH1dIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW3sgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7QXJyYXkuPE9iamVjdC48U3RyaW5nLE51bWJlcj4+fScgfV0gfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcbicgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnRG9jQmxvY2snLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tGdW5jdGlvbihTdHJpbmcsIC4uLltOdW1iZXJdKTogTnVtYmVyfScsICduYW1lJzogJ2NhbGxiYWNrJyB9XSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9XG4gICAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBwYXJzZSBuYW1lcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbmFtZSA9IFwiLyoqIEBhcmcgbmFtZSAqL1xcbi8qKiBAYXJnIFtuYW1lXSAqL1xcbi8qKiBAYXJnIFtuYW1lPXt9XSAqL1xcbi8qKiBAYXJnIFtuYW1lPVxcXCJoZWxsbyB3b3JsZFxcXCJdICovXFxuXCI7XG5cbiAgICAgICAgZXhwZWN0KHRvZ2EobmFtZSkpLnRvLmVxbChbXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICcnIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW3sgJ3RhZyc6ICdhcmcnLCAnbmFtZSc6ICduYW1lJyB9XSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdEb2NCbG9jaycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFt7ICd0YWcnOiAnYXJnJywgJ25hbWUnOiAnW25hbWVdJyB9XSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdEb2NCbG9jaycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFt7ICd0YWcnOiAnYXJnJywgJ25hbWUnOiAnW25hbWU9e31dJyB9XSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdEb2NCbG9jaycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFt7ICd0YWcnOiAnYXJnJywgJ25hbWUnOiAnW25hbWU9XCJoZWxsbyB3b3JsZFwiXScgfV0gfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcbicgfVxuICAgICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGluZGVudGlvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaW5kZW50ID0gXCIvKipcXG4gKiAjIFRpdGxlXFxuICpcXG4gKiBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gKiBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gKiB0eXBlIHRoaW5ncy5cXG4gKlxcbiAqIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcbiAqXFxuICogKiBMaWtlXFxuICogKiBMaXN0c1xcbiAqXFxuICogICAgIHZhciBjb2RlID0gJ3NhbXBsZXMnO1xcbiAqXFxuICogQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG4gKiBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gKiAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gKiBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gKiAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gKlxcbiAqICAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcbiAqXFxuICogQGV4YW1wbGVcXG4gKlxcbiAqICAgICB2YXIgZm9vID0gJ2Jhcic7XFxuICpcXG4gKiBAdGFnXFxuICovXFxuXFxuLyoqXFxuIyBUaXRsZVxcblxcbkxvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbmxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbnR5cGUgdGhpbmdzLlxcblxcbkxpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiogTGlrZVxcbiogTGlzdHNcXG5cXG4gICAgdmFyIGNvZGUgPSAnc2FtcGxlcyc7XFxuXFxuQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG5AZXhhbXBsZVxcblxcbiAgICB2YXIgZm9vID0gJ2Jhcic7XFxuXFxuQHRhZ1xcbiAqL1xcblxcbi8qKlxcbiAgICAjIFRpdGxlXFxuXFxuICAgIExvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbiAgICBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gICAgdHlwZSB0aGluZ3MuXFxuXFxuICAgIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiAgICAqIExpa2VcXG4gICAgKiBMaXN0c1xcblxcbiAgICAgICAgdmFyIGNvZGUgPSAnc2FtcGxlcyc7XFxuXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgICAgIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4gICAgQGV4YW1wbGVcXG5cXG4gICAgICAgIHZhciBmb28gPSAnYmFyJztcXG5cXG4gICAgQHRhZ1xcbiAqL1xcblxcbiAgICAvKipcXG4gICAgICogIyBUaXRsZVxcbiAgICAgKlxcbiAgICAgKiBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gICAgICogbGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxuICAgICAqIHR5cGUgdGhpbmdzLlxcbiAgICAgKlxcbiAgICAgKiBMaWtlIG1vcmUgcGFyYWdyYXBocy5cXG4gICAgICpcXG4gICAgICogKiBMaWtlXFxuICAgICAqICogTGlzdHNcXG4gICAgICpcXG4gICAgICogICAgIHZhciBjb2RlID0gJ3NhbXBsZXMnO1xcbiAgICAgKlxcbiAgICAgKiBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLlxcbiAgICAgKiBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICogICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAgICAqIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgKiAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgICpcXG4gICAgICogICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuICAgICAqXFxuICAgICAqIEBleGFtcGxlXFxuICAgICAqXFxuICAgICAqICAgICB2YXIgZm9vID0gJ2Jhcic7XFxuICAgICAqXFxuICAgICAqIEB0YWdcXG4gICAgICovXFxuXFxuICAgIC8qKlxcbiAgICAjIFRpdGxlXFxuXFxuICAgIExvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbiAgICBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gICAgdHlwZSB0aGluZ3MuXFxuXFxuICAgIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiAgICAqIExpa2VcXG4gICAgKiBMaXN0c1xcblxcbiAgICAgICAgdmFyIGNvZGUgPSAnc2FtcGxlcyc7XFxuXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgICAgIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4gICAgQGV4YW1wbGVcXG5cXG4gICAgICAgIHZhciBmb28gPSAnYmFyJztcXG5cXG4gICAgQHRhZ1xcbiAgICAgKi9cXG5cXG4gICAgLyoqXFxuICAgICAgICAjIFRpdGxlXFxuXFxuICAgICAgICBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gICAgICAgIGxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbiAgICAgICAgdHlwZSB0aGluZ3MuXFxuXFxuICAgICAgICBMaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4gICAgICAgICogTGlrZVxcbiAgICAgICAgKiBMaXN0c1xcblxcbiAgICAgICAgICAgIHZhciBjb2RlID0gJ3NhbXBsZXMnO1xcblxcbiAgICAgICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG4gICAgICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgICAgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAgICAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgICAgICAgICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuICAgICAgICBAZXhhbXBsZVxcblxcbiAgICAgICAgICAgIHZhciBmb28gPSAnYmFyJztcXG5cXG4gICAgICAgIEB0YWdcXG4gICAgKi9cXG5cIjtcblxuICAgICAgICB2YXIgc3RhbmRhcmRQYXJzZXIgPSBuZXcgVG9nYSgpO1xuXG4gICAgICAgIHZhciB0b2tlbnMgPSBzdGFuZGFyZFBhcnNlci5wYXJzZShpbmRlbnQsIHtcbiAgICAgICAgICAgIHJhdzogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICBleHBlY3QodG9rZW5zKS50by5lcWwoW1xuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnJyB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICd0eXBlJzogJ0RvY0Jsb2NrJyxcbiAgICAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOiAnIyBUaXRsZVxcblxcbkxvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbmxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbnR5cGUgdGhpbmdzLlxcblxcbkxpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiogTGlrZVxcbiogTGlzdHNcXG5cXG4gICAgdmFyIGNvZGUgPSBcXCdzYW1wbGVzXFwnO1xcblxcbicsXG4gICAgICAgICAgICAgICAgJ3RhZ3MnOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uLlxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2V4YW1wbGUnLCAnZGVzY3JpcHRpb24nOiAnXFxuXFxuICAgIHZhciBmb28gPSBcXCdiYXJcXCc7XFxuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAndGFnJyB9XG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAncmF3JzogJy8qKlxcbiAqICMgVGl0bGVcXG4gKlxcbiAqIExvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbiAqIGxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbiAqIHR5cGUgdGhpbmdzLlxcbiAqXFxuICogTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuICpcXG4gKiAqIExpa2VcXG4gKiAqIExpc3RzXFxuICpcXG4gKiAgICAgdmFyIGNvZGUgPSBcXCdzYW1wbGVzXFwnO1xcbiAqXFxuICogQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG4gKiBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gKiAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gKiBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gKiAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gKlxcbiAqICAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcbiAqXFxuICogQGV4YW1wbGVcXG4gKlxcbiAqICAgICB2YXIgZm9vID0gXFwnYmFyXFwnO1xcbiAqXFxuICogQHRhZ1xcbiAqLydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG5cXG4nIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAnRG9jQmxvY2snLFxuICAgICAgICAgICAgICAgICdkZXNjcmlwdGlvbic6ICcjIFRpdGxlXFxuXFxuTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxubGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxudHlwZSB0aGluZ3MuXFxuXFxuTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuKiBMaWtlXFxuKiBMaXN0c1xcblxcbiAgICB2YXIgY29kZSA9IFxcJ3NhbXBsZXNcXCc7XFxuXFxuJyxcbiAgICAgICAgICAgICAgICAndGFncyc6IFtcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24uXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnZXhhbXBsZScsICdkZXNjcmlwdGlvbic6ICdcXG5cXG4gICAgdmFyIGZvbyA9IFxcJ2JhclxcJztcXG5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICd0YWcnIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdyYXcnOiAnLyoqXFxuIyBUaXRsZVxcblxcbkxvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbmxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbnR5cGUgdGhpbmdzLlxcblxcbkxpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiogTGlrZVxcbiogTGlzdHNcXG5cXG4gICAgdmFyIGNvZGUgPSBcXCdzYW1wbGVzXFwnO1xcblxcbkBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuQGV4YW1wbGVcXG5cXG4gICAgdmFyIGZvbyA9IFxcJ2JhclxcJztcXG5cXG5AdGFnXFxuICovJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcblxcbicgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdEb2NCbG9jaycsXG4gICAgICAgICAgICAgICAgJ2Rlc2NyaXB0aW9uJzogJyMgVGl0bGVcXG5cXG5Mb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG5saW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG50eXBlIHRoaW5ncy5cXG5cXG5MaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4qIExpa2VcXG4qIExpc3RzXFxuXFxuICAgIHZhciBjb2RlID0gXFwnc2FtcGxlc1xcJztcXG5cXG4nLFxuICAgICAgICAgICAgICAgICd0YWdzJzogW1xuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbi5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdleGFtcGxlJywgJ2Rlc2NyaXB0aW9uJzogJ1xcblxcbiAgICB2YXIgZm9vID0gXFwnYmFyXFwnO1xcblxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ3RhZycgfVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ3Jhdyc6ICcvKipcXG4gICAgIyBUaXRsZVxcblxcbiAgICBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gICAgbGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxuICAgIHR5cGUgdGhpbmdzLlxcblxcbiAgICBMaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4gICAgKiBMaWtlXFxuICAgICogTGlzdHNcXG5cXG4gICAgICAgIHZhciBjb2RlID0gXFwnc2FtcGxlc1xcJztcXG5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICAgICAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbiAgICBAZXhhbXBsZVxcblxcbiAgICAgICAgdmFyIGZvbyA9IFxcJ2JhclxcJztcXG5cXG4gICAgQHRhZ1xcbiAqLydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG5cXG4nIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAnRG9jQmxvY2snLFxuICAgICAgICAgICAgICAgICdkZXNjcmlwdGlvbic6ICcjIFRpdGxlXFxuXFxuTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxubGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxudHlwZSB0aGluZ3MuXFxuXFxuTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuKiBMaWtlXFxuKiBMaXN0c1xcblxcbiAgICB2YXIgY29kZSA9IFxcJ3NhbXBsZXNcXCc7XFxuXFxuJyxcbiAgICAgICAgICAgICAgICAndGFncyc6IFtcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24uXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnZXhhbXBsZScsICdkZXNjcmlwdGlvbic6ICdcXG5cXG4gICAgdmFyIGZvbyA9IFxcJ2JhclxcJztcXG5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICd0YWcnIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdyYXcnOiAnICAgIC8qKlxcbiAgICAgKiAjIFRpdGxlXFxuICAgICAqXFxuICAgICAqIExvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbiAgICAgKiBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gICAgICogdHlwZSB0aGluZ3MuXFxuICAgICAqXFxuICAgICAqIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcbiAgICAgKlxcbiAgICAgKiAqIExpa2VcXG4gICAgICogKiBMaXN0c1xcbiAgICAgKlxcbiAgICAgKiAgICAgdmFyIGNvZGUgPSBcXCdzYW1wbGVzXFwnO1xcbiAgICAgKlxcbiAgICAgKiBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLlxcbiAgICAgKiBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICogICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAgICAqIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgKiAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgICpcXG4gICAgICogICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuICAgICAqXFxuICAgICAqIEBleGFtcGxlXFxuICAgICAqXFxuICAgICAqICAgICB2YXIgZm9vID0gXFwnYmFyXFwnO1xcbiAgICAgKlxcbiAgICAgKiBAdGFnXFxuICAgICAqLydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG5cXG4nIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAnRG9jQmxvY2snLFxuICAgICAgICAgICAgICAgICdkZXNjcmlwdGlvbic6ICcjIFRpdGxlXFxuXFxuTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxubGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxudHlwZSB0aGluZ3MuXFxuXFxuTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuKiBMaWtlXFxuKiBMaXN0c1xcblxcbiAgICB2YXIgY29kZSA9IFxcJ3NhbXBsZXNcXCc7XFxuXFxuJyxcbiAgICAgICAgICAgICAgICAndGFncyc6IFtcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24uXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnZXhhbXBsZScsICdkZXNjcmlwdGlvbic6ICdcXG5cXG4gICAgdmFyIGZvbyA9IFxcJ2JhclxcJztcXG5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICd0YWcnIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdyYXcnOiAnICAgIC8qKlxcbiAgICAjIFRpdGxlXFxuXFxuICAgIExvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbiAgICBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gICAgdHlwZSB0aGluZ3MuXFxuXFxuICAgIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiAgICAqIExpa2VcXG4gICAgKiBMaXN0c1xcblxcbiAgICAgICAgdmFyIGNvZGUgPSBcXCdzYW1wbGVzXFwnO1xcblxcbiAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLlxcbiAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gICAgICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuICAgIEBleGFtcGxlXFxuXFxuICAgICAgICB2YXIgZm9vID0gXFwnYmFyXFwnO1xcblxcbiAgICBAdGFnXFxuICAgICAqLydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG5cXG4nIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAnRG9jQmxvY2snLFxuICAgICAgICAgICAgICAgICdkZXNjcmlwdGlvbic6ICcjIFRpdGxlXFxuXFxuTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxubGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxudHlwZSB0aGluZ3MuXFxuXFxuTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuKiBMaWtlXFxuKiBMaXN0c1xcblxcbiAgICB2YXIgY29kZSA9IFxcJ3NhbXBsZXNcXCc7XFxuXFxuJyxcbiAgICAgICAgICAgICAgICAndGFncyc6IFtcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24uXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnZXhhbXBsZScsICdkZXNjcmlwdGlvbic6ICdcXG5cXG4gICAgdmFyIGZvbyA9IFxcJ2JhclxcJztcXG5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICd0YWcnIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdyYXcnOiAnICAgIC8qKlxcbiAgICAgICAgIyBUaXRsZVxcblxcbiAgICAgICAgTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxuICAgICAgICBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gICAgICAgIHR5cGUgdGhpbmdzLlxcblxcbiAgICAgICAgTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuICAgICAgICAqIExpa2VcXG4gICAgICAgICogTGlzdHNcXG5cXG4gICAgICAgICAgICB2YXIgY29kZSA9IFxcJ3NhbXBsZXNcXCc7XFxuXFxuICAgICAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLlxcbiAgICAgICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgICAgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICAgICAgICAgIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4gICAgICAgIEBleGFtcGxlXFxuXFxuICAgICAgICAgICAgdmFyIGZvbyA9IFxcJ2JhclxcJztcXG5cXG4gICAgICAgIEB0YWdcXG4gICAgKi8nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9XG4gICAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCB1c2UgY3VzdG9tIGhhbmRsZWJhcnMgZ3JhbW1hcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY3VzdG9tID0gXCJ7eyEtLS1cXG4gICEgIyBUaXRsZVxcbiAgIVxcbiAgISBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gICEgbGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxuICAhIHR5cGUgdGhpbmdzLlxcbiAgIVxcbiAgISBMaWtlIG1vcmUgcGFyYWdyYXBocy5cXG4gICFcXG4gICEgKiBMaWtlXFxuICAhICogTGlzdHNcXG4gICFcXG4gICEgICAgIDxjb2RlPnNhbXBsZXM8L2NvZGU+XFxuICAhXFxuICAhIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuICAhIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgISAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICEgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAhICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAgIVxcbiAgISAgIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG4gICFcXG4gICEgQGV4YW1wbGVcXG4gICFcXG4gICEgICAgIDx1bD5cXG4gICEgICAgICAgICB7eyNlYWNoIGl0ZW19fVxcbiAgISAgICAgICAgICAgICA8bGk+e3sufX08L2xpPlxcbiAgISAgICAgICAgIHt7L2VhY2h9fVxcbiAgISAgICAgPC91bD5cXG4gICFcXG4gICEgQHRhZ1xcbiAgIS0tfX1cXG5cXG57eyEtLS1cXG4jIFRpdGxlXFxuXFxuTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxubGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxudHlwZSB0aGluZ3MuXFxuXFxuTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuKiBMaWtlXFxuKiBMaXN0c1xcblxcbiAgICA8Y29kZT5zYW1wbGVzPC9jb2RlPlxcblxcbkBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuQGV4YW1wbGVcXG5cXG4gICAgPHVsPlxcbiAgICAgICAge3sjZWFjaCBpdGVtfX1cXG4gICAgICAgICAgICA8bGk+e3sufX08L2xpPlxcbiAgICAgICAge3svZWFjaH19XFxuICAgIDwvdWw+XFxuXFxuQHRhZ1xcbi0tfX1cXG5cXG57eyEtLS1cXG4gICAgIyBUaXRsZVxcblxcbiAgICBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gICAgbGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxuICAgIHR5cGUgdGhpbmdzLlxcblxcbiAgICBMaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4gICAgKiBMaWtlXFxuICAgICogTGlzdHNcXG5cXG4gICAgICAgIDxjb2RlPnt7c2FtcGxlc319PC9jb2RlPlxcblxcbiAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLlxcbiAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gICAgICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuICAgIEBleGFtcGxlXFxuXFxuICAgICAgICA8dWw+XFxuICAgICAgICAgICAge3sjZWFjaCBpdGVtfX1cXG4gICAgICAgICAgICAgICAgPGxpPnt7Ln19PC9saT5cXG4gICAgICAgICAgICB7ey9lYWNofX1cXG4gICAgICAgIDwvdWw+XFxuXFxuICAgIEB0YWdcXG4tLX19XFxuXFxuICAgIHt7IS0tLVxcbiAgICAgICEgIyBUaXRsZVxcbiAgICAgICFcXG4gICAgICAhIExvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbiAgICAgICEgbGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxuICAgICAgISB0eXBlIHRoaW5ncy5cXG4gICAgICAhXFxuICAgICAgISBMaWtlIG1vcmUgcGFyYWdyYXBocy5cXG4gICAgICAhXFxuICAgICAgISAqIExpa2VcXG4gICAgICAhICogTGlzdHNcXG4gICAgICAhXFxuICAgICAgISAgICAgPGNvZGU+c2FtcGxlczwvY29kZT5cXG4gICAgICAhXFxuICAgICAgISBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLlxcbiAgICAgICEgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgISAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgICAhIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgICEgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAgICAgIVxcbiAgICAgICEgICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuICAgICAgIVxcbiAgICAgICEgQGV4YW1wbGVcXG4gICAgICAhXFxuICAgICAgISAgICAgPHVsPlxcbiAgICAgICEgICAgICAgICB7eyNlYWNoIGl0ZW19fVxcbiAgICAgICEgICAgICAgICAgICAgPGxpPnt7Ln19PC9saT5cXG4gICAgICAhICAgICAgICAge3svZWFjaH19XFxuICAgICAgISAgICAgPC91bD5cXG4gICAgICAhXFxuICAgICAgISBAdGFnXFxuICAgICAgIS0tfX1cXG5cXG4gICAge3shLS0tXFxuICAgICMgVGl0bGVcXG5cXG4gICAgTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxuICAgIGxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbiAgICB0eXBlIHRoaW5ncy5cXG5cXG4gICAgTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuICAgICogTGlrZVxcbiAgICAqIExpc3RzXFxuXFxuICAgICAgICA8Y29kZT5zYW1wbGVzPC9jb2RlPlxcblxcbiAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLlxcbiAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gICAgICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuICAgIEBleGFtcGxlXFxuXFxuICAgICAgICA8dWw+XFxuICAgICAgICAgICAge3sjZWFjaCBpdGVtfX1cXG4gICAgICAgICAgICAgICAgPGxpPnt7Ln19PC9saT5cXG4gICAgICAgICAgICB7ey9lYWNofX1cXG4gICAgICAgIDwvdWw+XFxuXFxuICAgIEB0YWdcXG4gICAgLS19fVxcblxcbiAgICB7eyEtLS1cXG4gICAgICAgICMgVGl0bGVcXG5cXG4gICAgICAgIExvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbiAgICAgICAgbGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxuICAgICAgICB0eXBlIHRoaW5ncy5cXG5cXG4gICAgICAgIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiAgICAgICAgKiBMaWtlXFxuICAgICAgICAqIExpc3RzXFxuXFxuICAgICAgICAgICAgPGNvZGU+e3tzYW1wbGVzfX08L2NvZGU+XFxuXFxuICAgICAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLlxcbiAgICAgICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgICAgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICAgICAgICAgIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4gICAgICAgIEBleGFtcGxlXFxuXFxuICAgICAgICAgICAgPHVsPlxcbiAgICAgICAgICAgICAgICB7eyNlYWNoIGl0ZW19fVxcbiAgICAgICAgICAgICAgICAgICAgPGxpPnt7Ln19PC9saT5cXG4gICAgICAgICAgICAgICAge3svZWFjaH19XFxuICAgICAgICAgICAgPC91bD5cXG5cXG4gICAgICAgIEB0YWdcXG4gICAgLS19fVxcblxcbnt7ISBpZ25vcmUgfX1cXG57eyEtLSBpZ25vcmUgLS19fVxcbnt7IVxcbiAgISBpZ25vcmVcXG4gICF9fVxcbjwhLS0ge3shLS0tIGlnbm9yZSAtLT5cXG48IS0tIGlnbm9yZSB9fSAtLT5cXG5cIjtcblxuICAgICAgICB2YXIgaGFuZGxlYmFyUGFyc2VyID0gbmV3IFRvZ2Eoe1xuICAgICAgICAgICAgYmxvY2tTcGxpdDogLyheW1xcdCBdKlxce1xceyEtLS0oPyEtKVtcXHNcXFNdKj9cXHMqLS1cXH1cXH0pL20sXG4gICAgICAgICAgICBibG9ja1BhcnNlOiAvXltcXHQgXSpcXHtcXHshLS0tKD8hLSkoW1xcc1xcU10qPylcXHMqLS1cXH1cXH0vbSxcbiAgICAgICAgICAgIGluZGVudDogL15bXFx0ICFdL2dtLFxuICAgICAgICAgICAgbmFtZWQ6IC9eKGFyZyhndW1lbnQpP3xkYXRhfHByb3AoZXJ0eSk/KSQvXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciB0b2tlbnMgPSBoYW5kbGViYXJQYXJzZXIucGFyc2UoY3VzdG9tLCB7XG4gICAgICAgICAgICByYXc6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZXhwZWN0KHRva2VucykudG8uZXFsKFtcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJycgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdEb2NCbG9jaycsXG4gICAgICAgICAgICAgICAgJ2Rlc2NyaXB0aW9uJzogJyMgVGl0bGVcXG5cXG5Mb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG5saW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG50eXBlIHRoaW5ncy5cXG5cXG5MaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4qIExpa2VcXG4qIExpc3RzXFxuXFxuICAgIDxjb2RlPnNhbXBsZXM8L2NvZGU+XFxuXFxuJyxcbiAgICAgICAgICAgICAgICAndGFncyc6IFtcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24uXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnZXhhbXBsZScsICdkZXNjcmlwdGlvbic6ICdcXG5cXG4gICAgPHVsPlxcbiAgICAgICAge3sjZWFjaCBpdGVtfX1cXG4gICAgICAgICAgICA8bGk+e3sufX08L2xpPlxcbiAgICAgICAge3svZWFjaH19XFxuICAgIDwvdWw+XFxuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAndGFnJywgJ2Rlc2NyaXB0aW9uJzogJ1xcbicgfVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ3Jhdyc6ICd7eyEtLS1cXG4gICEgIyBUaXRsZVxcbiAgIVxcbiAgISBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gICEgbGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxuICAhIHR5cGUgdGhpbmdzLlxcbiAgIVxcbiAgISBMaWtlIG1vcmUgcGFyYWdyYXBocy5cXG4gICFcXG4gICEgKiBMaWtlXFxuICAhICogTGlzdHNcXG4gICFcXG4gICEgICAgIDxjb2RlPnNhbXBsZXM8L2NvZGU+XFxuICAhXFxuICAhIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuICAhIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgISAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICEgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAhICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAgIVxcbiAgISAgIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG4gICFcXG4gICEgQGV4YW1wbGVcXG4gICFcXG4gICEgICAgIDx1bD5cXG4gICEgICAgICAgICB7eyNlYWNoIGl0ZW19fVxcbiAgISAgICAgICAgICAgICA8bGk+e3sufX08L2xpPlxcbiAgISAgICAgICAgIHt7L2VhY2h9fVxcbiAgISAgICAgPC91bD5cXG4gICFcXG4gICEgQHRhZ1xcbiAgIS0tfX0nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuXFxuJyB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICd0eXBlJzogJ0RvY0Jsb2NrJyxcbiAgICAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOiAnIyBUaXRsZVxcblxcbkxvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbmxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbnR5cGUgdGhpbmdzLlxcblxcbkxpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiogTGlrZVxcbiogTGlzdHNcXG5cXG4gICAgPGNvZGU+c2FtcGxlczwvY29kZT5cXG5cXG4nLFxuICAgICAgICAgICAgICAgICd0YWdzJzogW1xuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbi5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdleGFtcGxlJywgJ2Rlc2NyaXB0aW9uJzogJ1xcblxcbiAgICA8dWw+XFxuICAgICAgICB7eyNlYWNoIGl0ZW19fVxcbiAgICAgICAgICAgIDxsaT57ey59fTwvbGk+XFxuICAgICAgICB7ey9lYWNofX1cXG4gICAgPC91bD5cXG5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICd0YWcnIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdyYXcnOiAne3shLS0tXFxuIyBUaXRsZVxcblxcbkxvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbmxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbnR5cGUgdGhpbmdzLlxcblxcbkxpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiogTGlrZVxcbiogTGlzdHNcXG5cXG4gICAgPGNvZGU+c2FtcGxlczwvY29kZT5cXG5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLlxcbkBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbkBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbkBleGFtcGxlXFxuXFxuICAgIDx1bD5cXG4gICAgICAgIHt7I2VhY2ggaXRlbX19XFxuICAgICAgICAgICAgPGxpPnt7Ln19PC9saT5cXG4gICAgICAgIHt7L2VhY2h9fVxcbiAgICA8L3VsPlxcblxcbkB0YWdcXG4tLX19J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcblxcbicgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdEb2NCbG9jaycsXG4gICAgICAgICAgICAgICAgJ2Rlc2NyaXB0aW9uJzogJyMgVGl0bGVcXG5cXG5Mb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG5saW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG50eXBlIHRoaW5ncy5cXG5cXG5MaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4qIExpa2VcXG4qIExpc3RzXFxuXFxuICAgIDxjb2RlPnt7c2FtcGxlc319PC9jb2RlPlxcblxcbicsXG4gICAgICAgICAgICAgICAgJ3RhZ3MnOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uLlxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2V4YW1wbGUnLCAnZGVzY3JpcHRpb24nOiAnXFxuXFxuICAgIDx1bD5cXG4gICAgICAgIHt7I2VhY2ggaXRlbX19XFxuICAgICAgICAgICAgPGxpPnt7Ln19PC9saT5cXG4gICAgICAgIHt7L2VhY2h9fVxcbiAgICA8L3VsPlxcblxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ3RhZycgfVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ3Jhdyc6ICd7eyEtLS1cXG4gICAgIyBUaXRsZVxcblxcbiAgICBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gICAgbGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxuICAgIHR5cGUgdGhpbmdzLlxcblxcbiAgICBMaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4gICAgKiBMaWtlXFxuICAgICogTGlzdHNcXG5cXG4gICAgICAgIDxjb2RlPnt7c2FtcGxlc319PC9jb2RlPlxcblxcbiAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLlxcbiAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gICAgICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuICAgIEBleGFtcGxlXFxuXFxuICAgICAgICA8dWw+XFxuICAgICAgICAgICAge3sjZWFjaCBpdGVtfX1cXG4gICAgICAgICAgICAgICAgPGxpPnt7Ln19PC9saT5cXG4gICAgICAgICAgICB7ey9lYWNofX1cXG4gICAgICAgIDwvdWw+XFxuXFxuICAgIEB0YWdcXG4tLX19J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcblxcbicgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdEb2NCbG9jaycsXG4gICAgICAgICAgICAgICAgJ2Rlc2NyaXB0aW9uJzogJyMgVGl0bGVcXG5cXG5Mb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG5saW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG50eXBlIHRoaW5ncy5cXG5cXG5MaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4qIExpa2VcXG4qIExpc3RzXFxuXFxuICAgIDxjb2RlPnNhbXBsZXM8L2NvZGU+XFxuXFxuJyxcbiAgICAgICAgICAgICAgICAndGFncyc6IFtcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24uXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnZXhhbXBsZScsICdkZXNjcmlwdGlvbic6ICdcXG5cXG4gICAgPHVsPlxcbiAgICAgICAge3sjZWFjaCBpdGVtfX1cXG4gICAgICAgICAgICA8bGk+e3sufX08L2xpPlxcbiAgICAgICAge3svZWFjaH19XFxuICAgIDwvdWw+XFxuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAndGFnJywgJ2Rlc2NyaXB0aW9uJzogJ1xcbicgfVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ3Jhdyc6ICcgICAge3shLS0tXFxuICAgICAgISAjIFRpdGxlXFxuICAgICAgIVxcbiAgICAgICEgTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxuICAgICAgISBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gICAgICAhIHR5cGUgdGhpbmdzLlxcbiAgICAgICFcXG4gICAgICAhIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcbiAgICAgICFcXG4gICAgICAhICogTGlrZVxcbiAgICAgICEgKiBMaXN0c1xcbiAgICAgICFcXG4gICAgICAhICAgICA8Y29kZT5zYW1wbGVzPC9jb2RlPlxcbiAgICAgICFcXG4gICAgICAhIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuICAgICAgISBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICAhICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAgICAgICEgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgISAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgICAhXFxuICAgICAgISAgIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG4gICAgICAhXFxuICAgICAgISBAZXhhbXBsZVxcbiAgICAgICFcXG4gICAgICAhICAgICA8dWw+XFxuICAgICAgISAgICAgICAgIHt7I2VhY2ggaXRlbX19XFxuICAgICAgISAgICAgICAgICAgICA8bGk+e3sufX08L2xpPlxcbiAgICAgICEgICAgICAgICB7ey9lYWNofX1cXG4gICAgICAhICAgICA8L3VsPlxcbiAgICAgICFcXG4gICAgICAhIEB0YWdcXG4gICAgICAhLS19fSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG5cXG4nIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAnRG9jQmxvY2snLFxuICAgICAgICAgICAgICAgICdkZXNjcmlwdGlvbic6ICcjIFRpdGxlXFxuXFxuTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxubGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxudHlwZSB0aGluZ3MuXFxuXFxuTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuKiBMaWtlXFxuKiBMaXN0c1xcblxcbiAgICA8Y29kZT5zYW1wbGVzPC9jb2RlPlxcblxcbicsXG4gICAgICAgICAgICAgICAgJ3RhZ3MnOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uLlxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2V4YW1wbGUnLCAnZGVzY3JpcHRpb24nOiAnXFxuXFxuICAgIDx1bD5cXG4gICAgICAgIHt7I2VhY2ggaXRlbX19XFxuICAgICAgICAgICAgPGxpPnt7Ln19PC9saT5cXG4gICAgICAgIHt7L2VhY2h9fVxcbiAgICA8L3VsPlxcblxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ3RhZycgfVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ3Jhdyc6ICcgICAge3shLS0tXFxuICAgICMgVGl0bGVcXG5cXG4gICAgTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxuICAgIGxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbiAgICB0eXBlIHRoaW5ncy5cXG5cXG4gICAgTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuICAgICogTGlrZVxcbiAgICAqIExpc3RzXFxuXFxuICAgICAgICA8Y29kZT5zYW1wbGVzPC9jb2RlPlxcblxcbiAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLlxcbiAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gICAgICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuICAgIEBleGFtcGxlXFxuXFxuICAgICAgICA8dWw+XFxuICAgICAgICAgICAge3sjZWFjaCBpdGVtfX1cXG4gICAgICAgICAgICAgICAgPGxpPnt7Ln19PC9saT5cXG4gICAgICAgICAgICB7ey9lYWNofX1cXG4gICAgICAgIDwvdWw+XFxuXFxuICAgIEB0YWdcXG4gICAgLS19fSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG5cXG4nIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAnRG9jQmxvY2snLFxuICAgICAgICAgICAgICAgICdkZXNjcmlwdGlvbic6ICcjIFRpdGxlXFxuXFxuTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxubGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxudHlwZSB0aGluZ3MuXFxuXFxuTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuKiBMaWtlXFxuKiBMaXN0c1xcblxcbiAgICA8Y29kZT57e3NhbXBsZXN9fTwvY29kZT5cXG5cXG4nLFxuICAgICAgICAgICAgICAgICd0YWdzJzogW1xuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbi5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdleGFtcGxlJywgJ2Rlc2NyaXB0aW9uJzogJ1xcblxcbiAgICA8dWw+XFxuICAgICAgICB7eyNlYWNoIGl0ZW19fVxcbiAgICAgICAgICAgIDxsaT57ey59fTwvbGk+XFxuICAgICAgICB7ey9lYWNofX1cXG4gICAgPC91bD5cXG5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICd0YWcnIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdyYXcnOiAnICAgIHt7IS0tLVxcbiAgICAgICAgIyBUaXRsZVxcblxcbiAgICAgICAgTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxuICAgICAgICBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gICAgICAgIHR5cGUgdGhpbmdzLlxcblxcbiAgICAgICAgTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuICAgICAgICAqIExpa2VcXG4gICAgICAgICogTGlzdHNcXG5cXG4gICAgICAgICAgICA8Y29kZT57e3NhbXBsZXN9fTwvY29kZT5cXG5cXG4gICAgICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuICAgICAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAgICAgICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gICAgICAgICAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbiAgICAgICAgQGV4YW1wbGVcXG5cXG4gICAgICAgICAgICA8dWw+XFxuICAgICAgICAgICAgICAgIHt7I2VhY2ggaXRlbX19XFxuICAgICAgICAgICAgICAgICAgICA8bGk+e3sufX08L2xpPlxcbiAgICAgICAgICAgICAgICB7ey9lYWNofX1cXG4gICAgICAgICAgICA8L3VsPlxcblxcbiAgICAgICAgQHRhZ1xcbiAgICAtLX19J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcblxcbnt7ISBpZ25vcmUgfX1cXG57eyEtLSBpZ25vcmUgLS19fVxcbnt7IVxcbiAgISBpZ25vcmVcXG4gICF9fVxcbjwhLS0ge3shLS0tIGlnbm9yZSAtLT5cXG48IS0tIGlnbm9yZSB9fSAtLT5cXG4nIH1cbiAgICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHVzZSBjdXN0b20gcGVybCBncmFtbWFyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjdXN0b20gPSBcInVzZSBzdHJpY3Q7XFxudXNlIHdhcm5pbmdzO1xcblxcbnByaW50IFxcXCJoZWxsbyB3b3JsZFxcXCI7XFxuXFxuPXBvZFxcblxcbiMgVGl0bGVcXG5cXG5Mb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG5saW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG50eXBlIHRoaW5ncy5cXG5cXG5MaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4qIExpa2VcXG4qIExpc3RzXFxuXFxuICAgIG15ICRjb2RlID0gXFxcInNhbXBsZXNcXFwiO1xcblxcbkBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuQGV4YW1wbGVcXG5cXG4gICAgbXkgJGZvbyA9IFxcXCJiYXJcXFwiO1xcblxcbkB0YWdcXG5cXG49Y3V0XFxuXCI7XG5cbiAgICAgICAgdmFyIHBlcmxQYXJzZXIgPSBuZXcgVG9nYSh7XG4gICAgICAgICAgICBibG9ja1NwbGl0OiAvKF49cG9kW1xcc1xcU10qP1xcbj1jdXQkKS9tLFxuICAgICAgICAgICAgYmxvY2tQYXJzZTogL149cG9kKFtcXHNcXFNdKj8pXFxuPWN1dCQvbSxcbiAgICAgICAgICAgIG5hbWVkOiAvXihhcmcoZ3VtZW50KT98ZGF0YXxwcm9wKGVydHkpPykkL1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgdG9rZW5zID0gcGVybFBhcnNlci5wYXJzZShjdXN0b20sIHtcbiAgICAgICAgICAgIHJhdzogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICBleHBlY3QodG9rZW5zKS50by5lcWwoW1xuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAndXNlIHN0cmljdDtcXG51c2Ugd2FybmluZ3M7XFxuXFxucHJpbnQgXCJoZWxsbyB3b3JsZFwiO1xcblxcbicgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdEb2NCbG9jaycsXG4gICAgICAgICAgICAgICAgJ2Rlc2NyaXB0aW9uJzogJ1xcbiMgVGl0bGVcXG5cXG5Mb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG5saW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG50eXBlIHRoaW5ncy5cXG5cXG5MaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4qIExpa2VcXG4qIExpc3RzXFxuXFxuICAgIG15ICRjb2RlID0gXCJzYW1wbGVzXCI7XFxuXFxuJyxcbiAgICAgICAgICAgICAgICAndGFncyc6IFtcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24uXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnZXhhbXBsZScsICdkZXNjcmlwdGlvbic6ICdcXG5cXG4gICAgbXkgJGZvbyA9IFwiYmFyXCI7XFxuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAndGFnJyB9XG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAncmF3JzogJz1wb2RcXG5cXG4jIFRpdGxlXFxuXFxuTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxubGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxudHlwZSB0aGluZ3MuXFxuXFxuTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuKiBMaWtlXFxuKiBMaXN0c1xcblxcbiAgICBteSAkY29kZSA9IFwic2FtcGxlc1wiO1xcblxcbkBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuQGV4YW1wbGVcXG5cXG4gICAgbXkgJGZvbyA9IFwiYmFyXCI7XFxuXFxuQHRhZ1xcblxcbj1jdXQnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9XG4gICAgICAgIF0pO1xuICAgIH0pO1xufSk7XG4iXX0=
