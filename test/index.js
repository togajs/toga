(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var copier = require('copier');

/**
 * @type {RegExp}
 */
var linePattern = /^/gm;

/**
 * @type {RegExp}
 */
var emptyLinePattern = /^$/gm;

/**
 * @type {RegExp}
 */
var edgeEmptyLinesPattern = /^[\t ]*\n|\n[\t ]*$/g;

/**
 * Default C-style grammar.
 * @type {Object}
 */
var defaults = {
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
};

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
    if (!(this instanceof Toga)) {
        return new Toga(options).parse(block);
    }

    if (options === undefined && typeof block === 'object') {
        options = block;
        block = null;
    }

    this.parse = this.parse.bind(this);
    this.parseBlock = this.parseBlock.bind(this);
    this.parseCode = this.parseCode.bind(this);
    this.parseDocs = this.parseDocs.bind(this);
    this.parseTag = this.parseTag.bind(this);

    this.setOptions(options);
}

/**
 * @method setOptions
 * @param {Object} options
 * @chainable
 */
Toga.prototype.setOptions = function(options) {
    this.options = copier({}, options, defaults);

    return this;
};

/**
 * @method parse
 * @param {String} [block]
 * @return {String}
 */
Toga.prototype.parse = function(block) {
    return block
        .split(this.options.blockSplit)
        .map(this.parseBlock);
};

/**
 * @method parseBlock
 * @param {String} [block]
 * @return {Object}
 */
Toga.prototype.parseBlock = function(block) {
    if (this.options.blockParse.test(block)) {
        return this.parseDocs(block);
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
        type: 'code',
        raw: block
    };
};

/**
 * @method parseDocs
 * @param {String} [block]
 * @return {Object}
 */
Toga.prototype.parseDocs = function(block) {
    var clean = this.normalizeDocs(block);
    var tags = clean.split(this.options.tagSplit);
    var description = tags.shift();

    return {
        type: 'docs',
        description: description,
        tags: tags.map(this.parseTag),
        raw: block
    };
};

/**
 * @method normalizeDocs
 * @param {String} block
 * @return {String}
 */
Toga.prototype.normalizeDocs = function(block) {
    var options = this.options;
    var blockParse = options.blockParse;
    var indent = options.indent;

    // Trim comment wrappers
    block = block.replace(blockParse, '$1');
    block = block.replace(edgeEmptyLinesPattern, '');

    // Unindent content
    var emptyLines;
    var indentedLines;
    var lines = (block.match(linePattern) || []).length;

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
    var parts = block.match(this.options.tagParse);
    var id = parts[1];
    var type = parts[2];
    var name = parts[3];
    var description = parts[4] || '';
    var tag = {};

    if (name && !this.options.named.test(id)) {
        description = name + ' ' + description;
        name = undefined;
    }

    if (id) {
        tag.tag = id;
    }

    if (type) {
        tag.type = type;
    }

    if (name) {
        tag.name = name;
    }

    if (description) {
        tag.description = description;
    }

    return tag;
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

var expect = require('expect.js');
var fs = require('fs');
var toga = require('../../lib/toga');

// var difflet = require('difflet')({
//     indent: 4,
//     comment: true
// });
// var diff = function(a, b) {
//     console.log(difflet.compare(a, b));
// };

describe('Toga', function () {
    it('should not parse non-blocks', function() {
        var ignore = "// ignore\n/* ignore */\n/*! ignore */\n\n//\n// ignore\n//\n/*\n * ignore\n */\n/*!\n * ignore\n */\n\n// /** ignore\nvar ignore = '/** ignore */';\nvar foo = function(/** ignore */) {};\nconsole.log(foo(ignore));\n// ignore */\n";
        expect(toga(ignore));
    });

    it('should parse empty blocks', function() {
        var empty = "/**/\n/***/\n/** */\n/**\n *\n */\n/**\n\n*/\n";

        // console.log(JSON.stringify(toga(empty), null, 4));
        // diff(toga(empty), [
        expect(toga(empty)).to.eql([
            { 'type': 'code', 'raw': '/**/\n' },
            { 'type': 'docs', 'description': '', 'tags': [], 'raw': '/***/' },
            { 'type': 'code', 'raw': '\n' },
            { 'type': 'docs', 'description': '', 'tags': [], 'raw': '/** */' },
            { 'type': 'code', 'raw': '\n' },
            { 'type': 'docs', 'description': '', 'tags': [], 'raw': '/**\n *\n */' },
            { 'type': 'code', 'raw': '\n' },
            { 'type': 'docs', 'description': '', 'tags': [], 'raw': '/**\n\n*/' },
            { 'type': 'code', 'raw': '\n' }
        ]);
    });

    it('should parse descriptions', function() {
        var desc = "/** description */\n/**\n * description\n */\n/**\ndescription\n*/\n";

        // console.log(JSON.stringify(toga(desc), null, 4));
        // diff(toga(desc), [
        expect(toga(desc)).to.eql([
            { 'type': 'code', 'raw': '' },
            { 'type': 'docs', 'description': 'description', 'tags': [], 'raw': '/** description */' },
            { 'type': 'code', 'raw': '\n' },
            { 'type': 'docs', 'description': 'description', 'tags': [], 'raw': '/**\n * description\n */' },
            { 'type': 'code', 'raw': '\n' },
            { 'type': 'docs', 'description': 'description', 'tags': [], 'raw': '/**\ndescription\n*/' },
            { 'type': 'code', 'raw': '\n' }
        ]);
    });

    it('should parse tags', function() {
        var tag = "/** @tag */\n/**\n * @tag\n */\n/**\n@tag\n*/\n";

        // console.log(JSON.stringify(toga(tag), null, 4));
        // diff(toga(tag), [
        expect(toga(tag)).to.eql([
            { 'type': 'code', 'raw': '' },
            { 'type': 'docs', 'description': '', 'tags': [ { 'tag': 'tag' } ], 'raw': '/** @tag */' },
            { 'type': 'code', 'raw': '\n' },
            { 'type': 'docs', 'description': '', 'tags': [ { 'tag': 'tag' } ], 'raw': '/**\n * @tag\n */' },
            { 'type': 'code', 'raw': '\n' },
            { 'type': 'docs', 'description': '', 'tags': [ { 'tag': 'tag' } ], 'raw': '/**\n@tag\n*/' },
            { 'type': 'code', 'raw': '\n' }
        ]);
    });

    it('should parse args', function() {
        var arg = "/** @arg {Type} [name] - Description. */\n/** @arg {Type} [name] Description. */\n/** @arg {Type} name - Description. */\n/** @arg {Type} name Description. */\n/** @arg {Type} [name] */\n/** @arg {Type} name */\n/** @arg [name] - Description. */\n/** @arg [name] Description. */\n/** @arg name - Description. */\n/** @arg name Description. */\n/** @arg [name] */\n/** @arg name */\n";

        // console.log(JSON.stringify(toga(arg), null, 4));
        // diff(toga(arg), [
        expect(toga(arg)).to.eql([
            { 'type': 'code', 'raw': '' },
            { 'type': 'docs', 'description': '', 'tags': [ { 'tag': 'arg', 'type': '{Type}', 'name': '[name]', 'description': 'Description.' } ], 'raw': '/** @arg {Type} [name] - Description. */' },
            { 'type': 'code', 'raw': '\n' },
            { 'type': 'docs', 'description': '', 'tags': [ { 'tag': 'arg', 'type': '{Type}', 'name': '[name]', 'description': 'Description.' } ], 'raw': '/** @arg {Type} [name] Description. */' },
            { 'type': 'code', 'raw': '\n' },
            { 'type': 'docs', 'description': '', 'tags': [ { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.' } ], 'raw': '/** @arg {Type} name - Description. */' },
            { 'type': 'code', 'raw': '\n' },
            { 'type': 'docs', 'description': '', 'tags': [ { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.' } ], 'raw': '/** @arg {Type} name Description. */' },
            { 'type': 'code', 'raw': '\n' },
            { 'type': 'docs', 'description': '', 'tags': [ { 'tag': 'arg', 'type': '{Type}', 'name': '[name]' } ], 'raw': '/** @arg {Type} [name] */' },
            { 'type': 'code', 'raw': '\n' },
            { 'type': 'docs', 'description': '', 'tags': [ { 'tag': 'arg', 'type': '{Type}', 'name': 'name' } ], 'raw': '/** @arg {Type} name */' },
            { 'type': 'code', 'raw': '\n' },
            { 'type': 'docs', 'description': '', 'tags': [ { 'tag': 'arg', 'name': '[name]', 'description': 'Description.' } ], 'raw': '/** @arg [name] - Description. */' },
            { 'type': 'code', 'raw': '\n' },
            { 'type': 'docs', 'description': '', 'tags': [ { 'tag': 'arg', 'name': '[name]', 'description': 'Description.' } ], 'raw': '/** @arg [name] Description. */' },
            { 'type': 'code', 'raw': '\n' },
            { 'type': 'docs', 'description': '', 'tags': [ { 'tag': 'arg', 'name': 'name', 'description': 'Description.' } ], 'raw': '/** @arg name - Description. */' },
            { 'type': 'code', 'raw': '\n' },
            { 'type': 'docs', 'description': '', 'tags': [ { 'tag': 'arg', 'name': 'name', 'description': 'Description.' } ], 'raw': '/** @arg name Description. */' },
            { 'type': 'code', 'raw': '\n' },
            { 'type': 'docs', 'description': '', 'tags': [ { 'tag': 'arg', 'name': '[name]' } ], 'raw': '/** @arg [name] */' },
            { 'type': 'code', 'raw': '\n' },
            { 'type': 'docs', 'description': '', 'tags': [ { 'tag': 'arg', 'name': 'name' } ], 'raw': '/** @arg name */' },
            { 'type': 'code', 'raw': '\n' }
        ]);
    });

    it('should parse types', function() {
        var type = "/** @arg {Type} */\n/** @arg {String|Object} */\n/** @arg {Array.<Object.<String,Number>>} */\n/** @arg {Function(String, ...[Number]): Number} callback */\n";

        // console.log(JSON.stringify(toga(type), null, 4));
        // diff(toga(type), [
        expect(toga(type)).to.eql([
            { 'type': 'code', 'raw': '' },
            { 'type': 'docs', 'description': '', 'tags': [ { 'tag': 'arg', 'type': '{Type}' } ], 'raw': '/** @arg {Type} */' },
            { 'type': 'code', 'raw': '\n' },
            { 'type': 'docs', 'description': '', 'tags': [ { 'tag': 'arg', 'type': '{String|Object}' } ], 'raw': '/** @arg {String|Object} */' },
            { 'type': 'code', 'raw': '\n' },
            { 'type': 'docs', 'description': '', 'tags': [ { 'tag': 'arg', 'type': '{Array.<Object.<String,Number>>}' } ], 'raw': '/** @arg {Array.<Object.<String,Number>>} */' },
            { 'type': 'code', 'raw': '\n' },
            { 'type': 'docs', 'description': '', 'tags': [ { 'tag': 'arg', 'type': '{Function(String, ...[Number]): Number}', 'name': 'callback' } ], 'raw': '/** @arg {Function(String, ...[Number]): Number} callback */' },
            { 'type': 'code', 'raw': '\n' }
        ]);
    });

    it('should parse names', function() {
        var name = "/** @arg name */\n/** @arg [name] */\n/** @arg [name={}] */\n/** @arg [name=\"hello world\"] */\n";

        // console.log(JSON.stringify(toga(name), null, 4));
        // diff(toga(name), [
        expect(toga(name)).to.eql([
            { 'type': 'code', 'raw': '' },
            { 'type': 'docs', 'description': '', 'tags': [ { 'tag': 'arg', 'name': 'name' } ], 'raw': '/** @arg name */' },
            { 'type': 'code', 'raw': '\n' },
            { 'type': 'docs', 'description': '', 'tags': [ { 'tag': 'arg', 'name': '[name]' } ], 'raw': '/** @arg [name] */' },
            { 'type': 'code', 'raw': '\n' },
            { 'type': 'docs', 'description': '', 'tags': [ { 'tag': 'arg', 'name': '[name={}]' } ], 'raw': '/** @arg [name={}] */' },
            { 'type': 'code', 'raw': '\n' },
            { 'type': 'docs', 'description': '', 'tags': [ { 'tag': 'arg', 'name': '[name="hello world"]' } ], 'raw': '/** @arg [name="hello world"] */' },
            { 'type': 'code', 'raw': '\n' }
        ]);
    });

    it('should handle indention', function() {
        var indent = "/**\n * # Title\n *\n * Long description that spans multiple\n * lines and even has other markdown\n * type things.\n *\n * Like more paragraphs.\n *\n * * Like\n * * Lists\n *\n *     var code = 'samples';\n *\n * @arg {Type} name Description.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n *\n *   And has line breaks, etc.\n *\n * @example\n *\n *     var foo = 'bar';\n *\n * @tag\n */\n\n/**\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = 'samples';\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    var foo = 'bar';\n\n@tag\n */\n\n/**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = 'samples';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = 'bar';\n\n    @tag\n */\n\n    /**\n     * # Title\n     *\n     * Long description that spans multiple\n     * lines and even has other markdown\n     * type things.\n     *\n     * Like more paragraphs.\n     *\n     * * Like\n     * * Lists\n     *\n     *     var code = 'samples';\n     *\n     * @arg {Type} name Description.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     *\n     *   And has line breaks, etc.\n     *\n     * @example\n     *\n     *     var foo = 'bar';\n     *\n     * @tag\n     */\n\n    /**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = 'samples';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = 'bar';\n\n    @tag\n     */\n\n    /**\n        # Title\n\n        Long description that spans multiple\n        lines and even has other markdown\n        type things.\n\n        Like more paragraphs.\n\n        * Like\n        * Lists\n\n            var code = 'samples';\n\n        @arg {Type} name Description.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n\n          And has line breaks, etc.\n\n        @example\n\n            var foo = 'bar';\n\n        @tag\n    */\n";

        // console.log(JSON.stringify(toga(indent), null, 4));
        // diff(toga(indent), [
        expect(toga(indent)).to.eql([
            {
                'type': 'code',
                'raw': ''
            },
            {
                'type': 'docs',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': [
                    {
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description.\n'
                    },
                    {
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description that is really long\n  and wraps to other lines.\n'
                    },
                    {
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n'
                    },
                    {
                        'tag': 'example',
                        'description': '\n\n    var foo = \'bar\';\n\n'
                    },
                    {
                        'tag': 'tag'
                    }
                ],
                'raw': '/**\n * # Title\n *\n * Long description that spans multiple\n * lines and even has other markdown\n * type things.\n *\n * Like more paragraphs.\n *\n * * Like\n * * Lists\n *\n *     var code = \'samples\';\n *\n * @arg {Type} name Description.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n *\n *   And has line breaks, etc.\n *\n * @example\n *\n *     var foo = \'bar\';\n *\n * @tag\n */'
            },
            {
                'type': 'code',
                'raw': '\n\n'
            },
            {
                'type': 'docs',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': [
                    {
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description.\n'
                    },
                    {
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description that is really long\n  and wraps to other lines.\n'
                    },
                    {
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n'
                    },
                    {
                        'tag': 'example',
                        'description': '\n\n    var foo = \'bar\';\n\n'
                    },
                    {
                        'tag': 'tag'
                    }
                ],
                'raw': '/**\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    var foo = \'bar\';\n\n@tag\n */'
            },
            {
                'type': 'code',
                'raw': '\n\n'
            },
            {
                'type': 'docs',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': [
                    {
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description.\n'
                    },
                    {
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description that is really long\n  and wraps to other lines.\n'
                    },
                    {
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n'
                    },
                    {
                        'tag': 'example',
                        'description': '\n\n    var foo = \'bar\';\n\n'
                    },
                    {
                        'tag': 'tag'
                    }
                ],
                'raw': '/**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = \'samples\';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = \'bar\';\n\n    @tag\n */'
            },
            {
                'type': 'code',
                'raw': '\n\n'
            },
            {
                'type': 'docs',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': [
                    {
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description.\n'
                    },
                    {
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description that is really long\n  and wraps to other lines.\n'
                    },
                    {
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n'
                    },
                    {
                        'tag': 'example',
                        'description': '\n\n    var foo = \'bar\';\n\n'
                    },
                    {
                        'tag': 'tag'
                    }
                ],
                'raw': '    /**\n     * # Title\n     *\n     * Long description that spans multiple\n     * lines and even has other markdown\n     * type things.\n     *\n     * Like more paragraphs.\n     *\n     * * Like\n     * * Lists\n     *\n     *     var code = \'samples\';\n     *\n     * @arg {Type} name Description.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     *\n     *   And has line breaks, etc.\n     *\n     * @example\n     *\n     *     var foo = \'bar\';\n     *\n     * @tag\n     */'
            },
            {
                'type': 'code',
                'raw': '\n\n'
            },
            {
                'type': 'docs',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': [
                    {
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description.\n'
                    },
                    {
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description that is really long\n  and wraps to other lines.\n'
                    },
                    {
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n'
                    },
                    {
                        'tag': 'example',
                        'description': '\n\n    var foo = \'bar\';\n\n'
                    },
                    {
                        'tag': 'tag'
                    }
                ],
                'raw': '    /**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = \'samples\';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = \'bar\';\n\n    @tag\n     */'
            },
            {
                'type': 'code',
                'raw': '\n\n'
            },
            {
                'type': 'docs',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': [
                    {
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description.\n'
                    },
                    {
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description that is really long\n  and wraps to other lines.\n'
                    },
                    {
                        'tag': 'arg',
                        'type': '{Type}',
                        'name': 'name',
                        'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n'
                    },
                    {
                        'tag': 'example',
                        'description': '\n\n    var foo = \'bar\';\n\n'
                    },
                    {
                        'tag': 'tag'
                    }
                ],
                'raw': '    /**\n        # Title\n\n        Long description that spans multiple\n        lines and even has other markdown\n        type things.\n\n        Like more paragraphs.\n\n        * Like\n        * Lists\n\n            var code = \'samples\';\n\n        @arg {Type} name Description.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n\n          And has line breaks, etc.\n\n        @example\n\n            var foo = \'bar\';\n\n        @tag\n    */'
            },
            {
                'type': 'code',
                'raw': '\n'
            }
        ]);
    });
});

},{"../../lib/toga":1,"expect.js":5,"fs":2}]},{},[6])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvc21vZWxsZXIvUmVwb3MvZ2l0aHViL3NoYW5ub25tb2VsbGVyL3RvZ2EvbGliL3RvZ2EuanMiLCIvVXNlcnMvc21vZWxsZXIvUmVwb3MvZ2l0aHViL3NoYW5ub25tb2VsbGVyL3RvZ2Evbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvX2VtcHR5LmpzIiwiL1VzZXJzL3Ntb2VsbGVyL1JlcG9zL2dpdGh1Yi9zaGFubm9ubW9lbGxlci90b2dhL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9pbnNlcnQtbW9kdWxlLWdsb2JhbHMvYnVmZmVyLmpzIiwiL1VzZXJzL3Ntb2VsbGVyL1JlcG9zL2dpdGh1Yi9zaGFubm9ubW9lbGxlci90b2dhL25vZGVfbW9kdWxlcy9jb3BpZXIvY29waWVyLmpzIiwiL1VzZXJzL3Ntb2VsbGVyL1JlcG9zL2dpdGh1Yi9zaGFubm9ubW9lbGxlci90b2dhL25vZGVfbW9kdWxlcy9leHBlY3QuanMvZXhwZWN0LmpzIiwiL1VzZXJzL3Ntb2VsbGVyL1JlcG9zL2dpdGh1Yi9zaGFubm9ubW9lbGxlci90b2dhL3Rlc3Qvc3BlY3MvdG9nYS1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNydUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBjb3BpZXIgPSByZXF1aXJlKCdjb3BpZXInKTtcblxuLyoqXG4gKiBAdHlwZSB7UmVnRXhwfVxuICovXG52YXIgbGluZVBhdHRlcm4gPSAvXi9nbTtcblxuLyoqXG4gKiBAdHlwZSB7UmVnRXhwfVxuICovXG52YXIgZW1wdHlMaW5lUGF0dGVybiA9IC9eJC9nbTtcblxuLyoqXG4gKiBAdHlwZSB7UmVnRXhwfVxuICovXG52YXIgZWRnZUVtcHR5TGluZXNQYXR0ZXJuID0gL15bXFx0IF0qXFxufFxcbltcXHQgXSokL2c7XG5cbi8qKlxuICogRGVmYXVsdCBDLXN0eWxlIGdyYW1tYXIuXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG52YXIgZGVmYXVsdHMgPSB7XG4gICAgLy8gTWF0Y2hlcyBibG9jayBkZWxpbWl0ZXJzXG4gICAgYmxvY2tTcGxpdDogLyheW1xcdCBdKlxcL1xcKlxcKig/IVxcLylbXFxzXFxTXSo/XFxzKlxcKlxcLykvbSxcblxuICAgIC8vIE1hdGNoZXMgYmxvY2sgY29udGVudFxuICAgIGJsb2NrUGFyc2U6IC9eW1xcdCBdKlxcL1xcKlxcKig/IVxcLykoW1xcc1xcU10qPylcXHMqXFwqXFwvL20sXG5cbiAgICAvLyBNYXRjaGVzIGluZGVudCBjaGFyYWN0ZXJzXG4gICAgaW5kZW50OiAvXltcXHQgXFwqXS9nbSxcblxuICAgIC8vIE1hdGNoZXMgdGFnIGRlbGltaXRlcnNcbiAgICB0YWdTcGxpdDogL15bXFx0IF0qQC9tLFxuXG4gICAgLy8gTWF0Y2hlcyB0YWcgY29udGVudCBgdGFnIHtUeXBlfSBbbmFtZV0gLSBEZXNjcmlwdGlvbi5gXG4gICAgdGFnUGFyc2U6IC9eKFxcdyspW1xcdCBdKihcXHtbXlxcfV0rXFx9KT9bXFx0IF0qKFxcW1teXFxdXSpcXF1cXCo/fFxcUyopP1tcXHQgLV0qKFtcXHNcXFNdKyk/JC9tLFxuXG4gICAgLy8gTWF0Y2hlcyB0YWdzIHRoYXQgc2hvdWxkIGluY2x1ZGUgYSBuYW1lIHByb3BlcnR5XG4gICAgbmFtZWQ6IC9eKGFyZyh1bWVudCk/fGF1Z21lbnRzfGNsYXNzfGV4dGVuZHN8bWV0aG9kfHBhcmFtfHByb3AoZXJ0eSk/KSQvXG59O1xuXG4vKipcbiAqICMgVG9nYVxuICpcbiAqIFlldCBhbm90aGVyIGRvYy1ibG9jayBwYXJzZXIuIEJhc2VkIG9uIGEgY3VzdG9taXphYmxlIHJlZ3VsYXItZXhwcmVzc2lvblxuICogZ3JhbW1hci4gRGVmYXVsdHMgdG8gQy1zdHlsZSBjb21tZW50IGJsb2Nrcywgc28gaXQgc3VwcG9ydHMgSmF2YVNjcmlwdCwgQyxcbiAqIFBIUCwgSmF2YSwgYW5kIGV2ZW4gQ1NTIHJpZ2h0IG91dCBvZiB0aGUgYm94LlxuICpcbiAqIEdlbmVyYXRlcyBhIHNpbmdsZSBhcnJheSBvZiB0b2tlbnMgd2l0aCB0YWdzIHBlciBnaXZlbiBibG9iIG9mIHRleHQuIFRhZ3MgYXJlXG4gKiBwYXJzZWQgZ3JlZWRpbHkuIElmIGl0IGxvb2tzIGxpa2UgYSB0YWcsIGl0J3MgYSB0YWcuIEhvdyB5b3UgaGFuZGxlIHRoZW0gaXNcbiAqIGNvbXBsZXRlbHkgdXAgdG8geW91LlxuICpcbiAqIEBjbGFzcyBUb2dhXG4gKiBAcGFyYW0ge1N0cmluZ30gW2Jsb2NrXVxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFRvZ2EoYmxvY2ssIG9wdGlvbnMpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgVG9nYSkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUb2dhKG9wdGlvbnMpLnBhcnNlKGJsb2NrKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucyA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiBibG9jayA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgb3B0aW9ucyA9IGJsb2NrO1xuICAgICAgICBibG9jayA9IG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5wYXJzZSA9IHRoaXMucGFyc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLnBhcnNlQmxvY2sgPSB0aGlzLnBhcnNlQmxvY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLnBhcnNlQ29kZSA9IHRoaXMucGFyc2VDb2RlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5wYXJzZURvY3MgPSB0aGlzLnBhcnNlRG9jcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMucGFyc2VUYWcgPSB0aGlzLnBhcnNlVGFnLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG59XG5cbi8qKlxuICogQG1ldGhvZCBzZXRPcHRpb25zXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQGNoYWluYWJsZVxuICovXG5Ub2dhLnByb3RvdHlwZS5zZXRPcHRpb25zID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IGNvcGllcih7fSwgb3B0aW9ucywgZGVmYXVsdHMpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEBtZXRob2QgcGFyc2VcbiAqIEBwYXJhbSB7U3RyaW5nfSBbYmxvY2tdXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblRvZ2EucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgICByZXR1cm4gYmxvY2tcbiAgICAgICAgLnNwbGl0KHRoaXMub3B0aW9ucy5ibG9ja1NwbGl0KVxuICAgICAgICAubWFwKHRoaXMucGFyc2VCbG9jayk7XG59O1xuXG4vKipcbiAqIEBtZXRob2QgcGFyc2VCbG9ja1xuICogQHBhcmFtIHtTdHJpbmd9IFtibG9ja11cbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuVG9nYS5wcm90b3R5cGUucGFyc2VCbG9jayA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5ibG9ja1BhcnNlLnRlc3QoYmxvY2spKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlRG9jcyhibG9jayk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucGFyc2VDb2RlKGJsb2NrKTtcbn07XG5cbi8qKlxuICogQG1ldGhvZCBwYXJzZUNvZGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBbYmxvY2tdXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cblRvZ2EucHJvdG90eXBlLnBhcnNlQ29kZSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogJ2NvZGUnLFxuICAgICAgICByYXc6IGJsb2NrXG4gICAgfTtcbn07XG5cbi8qKlxuICogQG1ldGhvZCBwYXJzZURvY3NcbiAqIEBwYXJhbSB7U3RyaW5nfSBbYmxvY2tdXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cblRvZ2EucHJvdG90eXBlLnBhcnNlRG9jcyA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gICAgdmFyIGNsZWFuID0gdGhpcy5ub3JtYWxpemVEb2NzKGJsb2NrKTtcbiAgICB2YXIgdGFncyA9IGNsZWFuLnNwbGl0KHRoaXMub3B0aW9ucy50YWdTcGxpdCk7XG4gICAgdmFyIGRlc2NyaXB0aW9uID0gdGFncy5zaGlmdCgpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogJ2RvY3MnLFxuICAgICAgICBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sXG4gICAgICAgIHRhZ3M6IHRhZ3MubWFwKHRoaXMucGFyc2VUYWcpLFxuICAgICAgICByYXc6IGJsb2NrXG4gICAgfTtcbn07XG5cbi8qKlxuICogQG1ldGhvZCBub3JtYWxpemVEb2NzXG4gKiBAcGFyYW0ge1N0cmluZ30gYmxvY2tcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuVG9nYS5wcm90b3R5cGUubm9ybWFsaXplRG9jcyA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgdmFyIGJsb2NrUGFyc2UgPSBvcHRpb25zLmJsb2NrUGFyc2U7XG4gICAgdmFyIGluZGVudCA9IG9wdGlvbnMuaW5kZW50O1xuXG4gICAgLy8gVHJpbSBjb21tZW50IHdyYXBwZXJzXG4gICAgYmxvY2sgPSBibG9jay5yZXBsYWNlKGJsb2NrUGFyc2UsICckMScpO1xuICAgIGJsb2NrID0gYmxvY2sucmVwbGFjZShlZGdlRW1wdHlMaW5lc1BhdHRlcm4sICcnKTtcblxuICAgIC8vIFVuaW5kZW50IGNvbnRlbnRcbiAgICB2YXIgZW1wdHlMaW5lcztcbiAgICB2YXIgaW5kZW50ZWRMaW5lcztcbiAgICB2YXIgbGluZXMgPSAoYmxvY2subWF0Y2gobGluZVBhdHRlcm4pIHx8IFtdKS5sZW5ndGg7XG5cbiAgICB3aGlsZSAobGluZXMgPiAwKSB7XG4gICAgICAgIGVtcHR5TGluZXMgPSAoYmxvY2subWF0Y2goZW1wdHlMaW5lUGF0dGVybikgfHwgW10pLmxlbmd0aDtcbiAgICAgICAgaW5kZW50ZWRMaW5lcyA9IChibG9jay5tYXRjaChpbmRlbnQpIHx8IFtdKS5sZW5ndGg7XG5cbiAgICAgICAgaWYgKGluZGVudGVkTGluZXMgJiYgKGVtcHR5TGluZXMgKyBpbmRlbnRlZExpbmVzID09PSBsaW5lcykpIHtcbiAgICAgICAgICAgIC8vIFN0cmlwIGxlYWRpbmcgaW5kZW50IGNoYXJhY3RlclxuICAgICAgICAgICAgYmxvY2sgPSBibG9jay5yZXBsYWNlKGluZGVudCwgJycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gTm90IGluZGVudGVkIGFueW1vcmVcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGJsb2NrO1xufTtcblxuLyoqXG4gKiBAbWV0aG9kIHBhcnNlVGFnXG4gKiBAcGFyYW0ge1N0cmluZ30gW2Jsb2NrXVxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5Ub2dhLnByb3RvdHlwZS5wYXJzZVRhZyA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gICAgdmFyIHBhcnRzID0gYmxvY2subWF0Y2godGhpcy5vcHRpb25zLnRhZ1BhcnNlKTtcbiAgICB2YXIgaWQgPSBwYXJ0c1sxXTtcbiAgICB2YXIgdHlwZSA9IHBhcnRzWzJdO1xuICAgIHZhciBuYW1lID0gcGFydHNbM107XG4gICAgdmFyIGRlc2NyaXB0aW9uID0gcGFydHNbNF0gfHwgJyc7XG4gICAgdmFyIHRhZyA9IHt9O1xuXG4gICAgaWYgKG5hbWUgJiYgIXRoaXMub3B0aW9ucy5uYW1lZC50ZXN0KGlkKSkge1xuICAgICAgICBkZXNjcmlwdGlvbiA9IG5hbWUgKyAnICcgKyBkZXNjcmlwdGlvbjtcbiAgICAgICAgbmFtZSA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAoaWQpIHtcbiAgICAgICAgdGFnLnRhZyA9IGlkO1xuICAgIH1cblxuICAgIGlmICh0eXBlKSB7XG4gICAgICAgIHRhZy50eXBlID0gdHlwZTtcbiAgICB9XG5cbiAgICBpZiAobmFtZSkge1xuICAgICAgICB0YWcubmFtZSA9IG5hbWU7XG4gICAgfVxuXG4gICAgaWYgKGRlc2NyaXB0aW9uKSB7XG4gICAgICAgIHRhZy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgIH1cblxuICAgIHJldHVybiB0YWc7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRvZ2E7XG4iLG51bGwsInJlcXVpcmU9KGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkoe1wiUGNaajlMXCI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xudmFyIFRBID0gcmVxdWlyZSgndHlwZWRhcnJheScpXG52YXIgeERhdGFWaWV3ID0gdHlwZW9mIERhdGFWaWV3ID09PSAndW5kZWZpbmVkJ1xuICA/IFRBLkRhdGFWaWV3IDogRGF0YVZpZXdcbnZhciB4QXJyYXlCdWZmZXIgPSB0eXBlb2YgQXJyYXlCdWZmZXIgPT09ICd1bmRlZmluZWQnXG4gID8gVEEuQXJyYXlCdWZmZXIgOiBBcnJheUJ1ZmZlclxudmFyIHhVaW50OEFycmF5ID0gdHlwZW9mIFVpbnQ4QXJyYXkgPT09ICd1bmRlZmluZWQnXG4gID8gVEEuVWludDhBcnJheSA6IFVpbnQ4QXJyYXlcblxuZXhwb3J0cy5CdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuU2xvd0J1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUyA9IDUwXG5CdWZmZXIucG9vbFNpemUgPSA4MTkyXG5cbnZhciBicm93c2VyU3VwcG9ydFxuXG4vKipcbiAqIENsYXNzOiBCdWZmZXJcbiAqID09PT09PT09PT09PT1cbiAqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGFyZSBhdWdtZW50ZWRcbiAqIHdpdGggZnVuY3Rpb24gcHJvcGVydGllcyBmb3IgYWxsIHRoZSBub2RlIGBCdWZmZXJgIEFQSSBmdW5jdGlvbnMuIFdlIHVzZVxuICogYFVpbnQ4QXJyYXlgIHNvIHRoYXQgc3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXQgcmV0dXJuc1xuICogYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogQnkgYXVnbWVudGluZyB0aGUgaW5zdGFuY2VzLCB3ZSBjYW4gYXZvaWQgbW9kaWZ5aW5nIHRoZSBgVWludDhBcnJheWBcbiAqIHByb3RvdHlwZS5cbiAqXG4gKiBGaXJlZm94IGlzIGEgc3BlY2lhbCBjYXNlIGJlY2F1c2UgaXQgZG9lc24ndCBhbGxvdyBhdWdtZW50aW5nIFwibmF0aXZlXCIgb2JqZWN0XG4gKiBpbnN0YW5jZXMuIFNlZSBgUHJveHlCdWZmZXJgIGJlbG93IGZvciBtb3JlIGRldGFpbHMuXG4gKi9cbmZ1bmN0aW9uIEJ1ZmZlciAoc3ViamVjdCwgZW5jb2RpbmcpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2Ygc3ViamVjdFxuXG4gIC8vIFdvcmstYXJvdW5kOiBub2RlJ3MgYmFzZTY0IGltcGxlbWVudGF0aW9uXG4gIC8vIGFsbG93cyBmb3Igbm9uLXBhZGRlZCBzdHJpbmdzIHdoaWxlIGJhc2U2NC1qc1xuICAvLyBkb2VzIG5vdC4uXG4gIGlmIChlbmNvZGluZyA9PT0gJ2Jhc2U2NCcgJiYgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBzdWJqZWN0ID0gc3RyaW5ndHJpbShzdWJqZWN0KVxuICAgIHdoaWxlIChzdWJqZWN0Lmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICAgIHN1YmplY3QgPSBzdWJqZWN0ICsgJz0nXG4gICAgfVxuICB9XG5cbiAgLy8gRmluZCB0aGUgbGVuZ3RoXG4gIHZhciBsZW5ndGhcbiAgaWYgKHR5cGUgPT09ICdudW1iZXInKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0KVxuICBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJylcbiAgICBsZW5ndGggPSBCdWZmZXIuYnl0ZUxlbmd0aChzdWJqZWN0LCBlbmNvZGluZylcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ29iamVjdCcpXG4gICAgbGVuZ3RoID0gY29lcmNlKHN1YmplY3QubGVuZ3RoKSAvLyBBc3N1bWUgb2JqZWN0IGlzIGFuIGFycmF5XG4gIGVsc2VcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG5lZWRzIHRvIGJlIGEgbnVtYmVyLCBhcnJheSBvciBzdHJpbmcuJylcblxuICB2YXIgYnVmID0gYXVnbWVudChuZXcgeFVpbnQ4QXJyYXkobGVuZ3RoKSlcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihzdWJqZWN0KSkge1xuICAgIC8vIFNwZWVkIG9wdGltaXphdGlvbiAtLSB1c2Ugc2V0IGlmIHdlJ3JlIGNvcHlpbmcgZnJvbSBhIFVpbnQ4QXJyYXlcbiAgICBidWYuc2V0KHN1YmplY3QpXG4gIH0gZWxzZSBpZiAoaXNBcnJheUlzaChzdWJqZWN0KSkge1xuICAgIC8vIFRyZWF0IGFycmF5LWlzaCBvYmplY3RzIGFzIGEgYnl0ZSBhcnJheS5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoQnVmZmVyLmlzQnVmZmVyKHN1YmplY3QpKVxuICAgICAgICBidWZbaV0gPSBzdWJqZWN0LnJlYWRVSW50OChpKVxuICAgICAgZWxzZVxuICAgICAgICBidWZbaV0gPSBzdWJqZWN0W2ldXG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgYnVmLndyaXRlKHN1YmplY3QsIDAsIGVuY29kaW5nKVxuICB9XG5cbiAgcmV0dXJuIGJ1ZlxufVxuXG4vLyBTVEFUSUMgTUVUSE9EU1xuLy8gPT09PT09PT09PT09PT1cblxuQnVmZmVyLmlzRW5jb2RpbmcgPSBmdW5jdGlvbihlbmNvZGluZykge1xuICBzd2l0Y2ggKChlbmNvZGluZyArICcnKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgIGNhc2UgJ3Jhdyc6XG4gICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbkJ1ZmZlci5pc0J1ZmZlciA9IGZ1bmN0aW9uIGlzQnVmZmVyIChiKSB7XG4gIHJldHVybiBiICYmIGIuX2lzQnVmZmVyXG59XG5cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gZnVuY3Rpb24gKHN0ciwgZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChlbmNvZGluZyB8fCAndXRmOCcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0dXJuIHN0ci5sZW5ndGggLyAyXG5cbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyKS5sZW5ndGhcblxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgICAgcmV0dXJuIHN0ci5sZW5ndGhcblxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXR1cm4gYmFzZTY0VG9CeXRlcyhzdHIpLmxlbmd0aFxuXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbn1cblxuQnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uIChsaXN0LCB0b3RhbExlbmd0aCkge1xuICBpZiAoIUFycmF5LmlzQXJyYXkobGlzdCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1VzYWdlOiBCdWZmZXIuY29uY2F0KGxpc3QsIFt0b3RhbExlbmd0aF0pXFxuJyArXG4gICAgICAgICdsaXN0IHNob3VsZCBiZSBhbiBBcnJheS4nKVxuICB9XG5cbiAgdmFyIGlcbiAgdmFyIGJ1ZlxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKDApXG4gIH0gZWxzZSBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gbGlzdFswXVxuICB9XG5cbiAgaWYgKHR5cGVvZiB0b3RhbExlbmd0aCAhPT0gJ251bWJlcicpIHtcbiAgICB0b3RhbExlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgYnVmID0gbGlzdFtpXVxuICAgICAgdG90YWxMZW5ndGggKz0gYnVmLmxlbmd0aFxuICAgIH1cbiAgfVxuXG4gIHZhciBidWZmZXIgPSBuZXcgQnVmZmVyKHRvdGFsTGVuZ3RoKVxuICB2YXIgcG9zID0gMFxuICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIGJ1ZiA9IGxpc3RbaV1cbiAgICBidWYuY29weShidWZmZXIsIHBvcylcbiAgICBwb3MgKz0gYnVmLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZmZXJcbn1cblxuLy8gSU5TVEFOQ0UgTUVUSE9EU1xuLy8gPT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBfaGV4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSBidWYubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cblxuICAvLyBtdXN0IGJlIGFuIGV2ZW4gbnVtYmVyIG9mIGRpZ2l0c1xuICB2YXIgc3RyTGVuID0gc3RyaW5nLmxlbmd0aFxuICBpZiAoc3RyTGVuICUgMiAhPT0gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBoZXggc3RyaW5nJylcbiAgfVxuICBpZiAobGVuZ3RoID4gc3RyTGVuIC8gMikge1xuICAgIGxlbmd0aCA9IHN0ckxlbiAvIDJcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGJ5dGUgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgaWYgKGlzTmFOKGJ5dGUpKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaGV4IHN0cmluZycpXG4gICAgYnVmW29mZnNldCArIGldID0gYnl0ZVxuICB9XG4gIEJ1ZmZlci5fY2hhcnNXcml0dGVuID0gaSAqIDJcbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gX3V0ZjhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBieXRlcywgcG9zXG4gIHJldHVybiBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9IGJsaXRCdWZmZXIodXRmOFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gX2FzY2lpV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgYnl0ZXMsIHBvc1xuICByZXR1cm4gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPSBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBfYmluYXJ5V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gX2FzY2lpV3JpdGUoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBfYmFzZTY0V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgYnl0ZXMsIHBvc1xuICByZXR1cm4gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPSBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gQnVmZmVyV3JpdGUgKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gIC8vIFN1cHBvcnQgYm90aCAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpXG4gIC8vIGFuZCB0aGUgbGVnYWN5IChzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBpZiAoIWlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGVuY29kaW5nID0gbGVuZ3RoXG4gICAgICBsZW5ndGggPSB1bmRlZmluZWRcbiAgICB9XG4gIH0gZWxzZSB7ICAvLyBsZWdhY3lcbiAgICB2YXIgc3dhcCA9IGVuY29kaW5nXG4gICAgZW5jb2RpbmcgPSBvZmZzZXRcbiAgICBvZmZzZXQgPSBsZW5ndGhcbiAgICBsZW5ndGggPSBzd2FwXG4gIH1cblxuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG4gIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKVxuXG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0dXJuIF9oZXhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0dXJuIF91dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldHVybiBfYXNjaWlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldHVybiBfYmluYXJ5V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXR1cm4gX2Jhc2U2NFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxufVxuXG5mdW5jdGlvbiBCdWZmZXJUb1N0cmluZyAoZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHNlbGYgPSAodGhpcyBpbnN0YW5jZW9mIFByb3h5QnVmZmVyKVxuICAgID8gdGhpcy5fcHJveHlcbiAgICA6IHRoaXNcblxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcbiAgc3RhcnQgPSBOdW1iZXIoc3RhcnQpIHx8IDBcbiAgZW5kID0gKGVuZCAhPT0gdW5kZWZpbmVkKVxuICAgID8gTnVtYmVyKGVuZClcbiAgICA6IGVuZCA9IHNlbGYubGVuZ3RoXG5cbiAgLy8gRmFzdHBhdGggZW1wdHkgc3RyaW5nc1xuICBpZiAoZW5kID09PSBzdGFydClcbiAgICByZXR1cm4gJydcblxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldHVybiBfaGV4U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcblxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldHVybiBfdXRmOFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG5cbiAgICBjYXNlICdhc2NpaSc6XG4gICAgICByZXR1cm4gX2FzY2lpU2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcblxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXR1cm4gX2JpbmFyeVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG5cbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0dXJuIF9iYXNlNjRTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbn1cblxuZnVuY3Rpb24gQnVmZmVyVG9KU09OICgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnQnVmZmVyJyxcbiAgICBkYXRhOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLCAwKVxuICB9XG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbmZ1bmN0aW9uIEJ1ZmZlckNvcHkgKHRhcmdldCwgdGFyZ2V0X3N0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIHZhciBzb3VyY2UgPSB0aGlzXG5cbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKCF0YXJnZXRfc3RhcnQpIHRhcmdldF9zdGFydCA9IDBcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCBzb3VyY2UubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGlmIChlbmQgPCBzdGFydClcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NvdXJjZUVuZCA8IHNvdXJjZVN0YXJ0JylcbiAgaWYgKHRhcmdldF9zdGFydCA8IDAgfHwgdGFyZ2V0X3N0YXJ0ID49IHRhcmdldC5sZW5ndGgpXG4gICAgdGhyb3cgbmV3IEVycm9yKCd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgaWYgKHN0YXJ0IDwgMCB8fCBzdGFydCA+PSBzb3VyY2UubGVuZ3RoKVxuICAgIHRocm93IG5ldyBFcnJvcignc291cmNlU3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChlbmQgPCAwIHx8IGVuZCA+IHNvdXJjZS5sZW5ndGgpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdzb3VyY2VFbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgLy8gQXJlIHdlIG9vYj9cbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKVxuICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0X3N0YXJ0IDwgZW5kIC0gc3RhcnQpXG4gICAgZW5kID0gdGFyZ2V0Lmxlbmd0aCAtIHRhcmdldF9zdGFydCArIHN0YXJ0XG5cbiAgLy8gY29weSFcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbmQgLSBzdGFydDsgaSsrKVxuICAgIHRhcmdldFtpICsgdGFyZ2V0X3N0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxufVxuXG5mdW5jdGlvbiBfYmFzZTY0U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgYnl0ZXMgPSBidWYuc2xpY2Uoc3RhcnQsIGVuZClcbiAgcmV0dXJuIHJlcXVpcmUoJ2Jhc2U2NC1qcycpLmZyb21CeXRlQXJyYXkoYnl0ZXMpXG59XG5cbmZ1bmN0aW9uIF91dGY4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgYnl0ZXMgPSBidWYuc2xpY2Uoc3RhcnQsIGVuZClcbiAgdmFyIHJlcyA9ICcnXG4gIHZhciB0bXAgPSAnJ1xuICB2YXIgaSA9IDBcbiAgd2hpbGUgKGkgPCBieXRlcy5sZW5ndGgpIHtcbiAgICBpZiAoYnl0ZXNbaV0gPD0gMHg3Rikge1xuICAgICAgcmVzICs9IGRlY29kZVV0ZjhDaGFyKHRtcCkgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldKVxuICAgICAgdG1wID0gJydcbiAgICB9IGVsc2Uge1xuICAgICAgdG1wICs9ICclJyArIGJ5dGVzW2ldLnRvU3RyaW5nKDE2KVxuICAgIH1cblxuICAgIGkrK1xuICB9XG5cbiAgcmV0dXJuIHJlcyArIGRlY29kZVV0ZjhDaGFyKHRtcClcbn1cblxuZnVuY3Rpb24gX2FzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgYnl0ZXMgPSBidWYuc2xpY2Uoc3RhcnQsIGVuZClcbiAgdmFyIHJldCA9ICcnXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpKyspXG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0pXG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gX2JpbmFyeVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIF9hc2NpaVNsaWNlKGJ1Ziwgc3RhcnQsIGVuZClcbn1cblxuZnVuY3Rpb24gX2hleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuLy8gVE9ETzogYWRkIHRlc3QgdGhhdCBtb2RpZnlpbmcgdGhlIG5ldyBidWZmZXIgc2xpY2Ugd2lsbCBtb2RpZnkgbWVtb3J5IGluIHRoZVxuLy8gb3JpZ2luYWwgYnVmZmVyISBVc2UgY29kZSBmcm9tOlxuLy8gaHR0cDovL25vZGVqcy5vcmcvYXBpL2J1ZmZlci5odG1sI2J1ZmZlcl9idWZfc2xpY2Vfc3RhcnRfZW5kXG5mdW5jdGlvbiBCdWZmZXJTbGljZSAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSBjbGFtcChzdGFydCwgbGVuLCAwKVxuICBlbmQgPSBjbGFtcChlbmQsIGxlbiwgbGVuKVxuICByZXR1cm4gYXVnbWVudCh0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpKSAvLyBVaW50OEFycmF5IGJ1aWx0LWluIG1ldGhvZFxufVxuXG5mdW5jdGlvbiBCdWZmZXJSZWFkVUludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFyIGJ1ZiA9IHRoaXNcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IGJ1Zi5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuIGJ1ZltvZmZzZXRdXG59XG5cbmZ1bmN0aW9uIF9yZWFkVUludDE2IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiAobGl0dGxlRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbikge1xuICAgIHJldHVyblxuICB9IGVsc2UgaWYgKG9mZnNldCArIDEgPT09IGxlbikge1xuICAgIHZhciBkdiA9IG5ldyB4RGF0YVZpZXcobmV3IHhBcnJheUJ1ZmZlcigyKSlcbiAgICBkdi5zZXRVaW50OCgwLCBidWZbbGVuIC0gMV0pXG4gICAgcmV0dXJuIGR2LmdldFVpbnQxNigwLCBsaXR0bGVFbmRpYW4pXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJ1Zi5fZGF0YXZpZXcuZ2V0VWludDE2KG9mZnNldCwgbGl0dGxlRW5kaWFuKVxuICB9XG59XG5cbmZ1bmN0aW9uIEJ1ZmZlclJlYWRVSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MTYodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gQnVmZmVyUmVhZFVJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQxNih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRVSW50MzIgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIChsaXR0bGVFbmRpYW4pID09PSAnYm9vbGVhbicsXG4gICAgICAgICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKSB7XG4gICAgcmV0dXJuXG4gIH0gZWxzZSBpZiAob2Zmc2V0ICsgMyA+PSBsZW4pIHtcbiAgICB2YXIgZHYgPSBuZXcgeERhdGFWaWV3KG5ldyB4QXJyYXlCdWZmZXIoNCkpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgKyBvZmZzZXQgPCBsZW47IGkrKykge1xuICAgICAgZHYuc2V0VWludDgoaSwgYnVmW2kgKyBvZmZzZXRdKVxuICAgIH1cbiAgICByZXR1cm4gZHYuZ2V0VWludDMyKDAsIGxpdHRsZUVuZGlhbilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYnVmLl9kYXRhdmlldy5nZXRVaW50MzIob2Zmc2V0LCBsaXR0bGVFbmRpYW4pXG4gIH1cbn1cblxuZnVuY3Rpb24gQnVmZmVyUmVhZFVJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBCdWZmZXJSZWFkVUludDMyQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBCdWZmZXJSZWFkSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YXIgYnVmID0gdGhpc1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gYnVmLmxlbmd0aClcbiAgICByZXR1cm5cblxuICByZXR1cm4gYnVmLl9kYXRhdmlldy5nZXRJbnQ4KG9mZnNldClcbn1cblxuZnVuY3Rpb24gX3JlYWRJbnQxNiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgKGxpdHRsZUVuZGlhbikgPT09ICdib29sZWFuJyxcbiAgICAgICAgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pIHtcbiAgICByZXR1cm5cbiAgfSBlbHNlIGlmIChvZmZzZXQgKyAxID09PSBsZW4pIHtcbiAgICB2YXIgZHYgPSBuZXcgeERhdGFWaWV3KG5ldyB4QXJyYXlCdWZmZXIoMikpXG4gICAgZHYuc2V0VWludDgoMCwgYnVmW2xlbiAtIDFdKVxuICAgIHJldHVybiBkdi5nZXRJbnQxNigwLCBsaXR0bGVFbmRpYW4pXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJ1Zi5fZGF0YXZpZXcuZ2V0SW50MTYob2Zmc2V0LCBsaXR0bGVFbmRpYW4pXG4gIH1cbn1cblxuZnVuY3Rpb24gQnVmZmVyUmVhZEludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MTYodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gQnVmZmVyUmVhZEludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkSW50MzIgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIChsaXR0bGVFbmRpYW4pID09PSAnYm9vbGVhbicsXG4gICAgICAgICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKSB7XG4gICAgcmV0dXJuXG4gIH0gZWxzZSBpZiAob2Zmc2V0ICsgMyA+PSBsZW4pIHtcbiAgICB2YXIgZHYgPSBuZXcgeERhdGFWaWV3KG5ldyB4QXJyYXlCdWZmZXIoNCkpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgKyBvZmZzZXQgPCBsZW47IGkrKykge1xuICAgICAgZHYuc2V0VWludDgoaSwgYnVmW2kgKyBvZmZzZXRdKVxuICAgIH1cbiAgICByZXR1cm4gZHYuZ2V0SW50MzIoMCwgbGl0dGxlRW5kaWFuKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBidWYuX2RhdGF2aWV3LmdldEludDMyKG9mZnNldCwgbGl0dGxlRW5kaWFuKVxuICB9XG59XG5cbmZ1bmN0aW9uIEJ1ZmZlclJlYWRJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDMyKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIEJ1ZmZlclJlYWRJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZEZsb2F0IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiAobGl0dGxlRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGJ1Zi5fZGF0YXZpZXcuZ2V0RmxvYXQzMihvZmZzZXQsIGxpdHRsZUVuZGlhbilcbn1cblxuZnVuY3Rpb24gQnVmZmVyUmVhZEZsb2F0TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRmxvYXQodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gQnVmZmVyUmVhZEZsb2F0QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRmxvYXQodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkRG91YmxlIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiAobGl0dGxlRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDcgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGJ1Zi5fZGF0YXZpZXcuZ2V0RmxvYXQ2NChvZmZzZXQsIGxpdHRsZUVuZGlhbilcbn1cblxuZnVuY3Rpb24gQnVmZmVyUmVhZERvdWJsZUxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZERvdWJsZSh0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBCdWZmZXJSZWFkRG91YmxlQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRG91YmxlKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBCdWZmZXJXcml0ZVVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YXIgYnVmID0gdGhpc1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmYpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IGJ1Zi5sZW5ndGgpIHJldHVyblxuXG4gIGJ1ZltvZmZzZXRdID0gdmFsdWVcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiAobGl0dGxlRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZmZmKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pIHtcbiAgICByZXR1cm5cbiAgfSBlbHNlIGlmIChvZmZzZXQgKyAxID09PSBsZW4pIHtcbiAgICB2YXIgZHYgPSBuZXcgeERhdGFWaWV3KG5ldyB4QXJyYXlCdWZmZXIoMikpXG4gICAgZHYuc2V0VWludDE2KDAsIHZhbHVlLCBsaXR0bGVFbmRpYW4pXG4gICAgYnVmW29mZnNldF0gPSBkdi5nZXRVaW50OCgwKVxuICB9IGVsc2Uge1xuICAgIGJ1Zi5fZGF0YXZpZXcuc2V0VWludDE2KG9mZnNldCwgdmFsdWUsIGxpdHRsZUVuZGlhbilcbiAgfVxufVxuXG5mdW5jdGlvbiBCdWZmZXJXcml0ZVVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIEJ1ZmZlcldyaXRlVUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZVVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgKGxpdHRsZUVuZGlhbikgPT09ICdib29sZWFuJyxcbiAgICAgICAgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZmZmZmYpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbikge1xuICAgIHJldHVyblxuICB9IGVsc2UgaWYgKG9mZnNldCArIDMgPj0gbGVuKSB7XG4gICAgdmFyIGR2ID0gbmV3IHhEYXRhVmlldyhuZXcgeEFycmF5QnVmZmVyKDQpKVxuICAgIGR2LnNldFVpbnQzMigwLCB2YWx1ZSwgbGl0dGxlRW5kaWFuKVxuICAgIGZvciAodmFyIGkgPSAwOyBpICsgb2Zmc2V0IDwgbGVuOyBpKyspIHtcbiAgICAgIGJ1ZltpICsgb2Zmc2V0XSA9IGR2LmdldFVpbnQ4KGkpXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGJ1Zi5fZGF0YXZpZXcuc2V0VWludDMyKG9mZnNldCwgdmFsdWUsIGxpdHRsZUVuZGlhbilcbiAgfVxufVxuXG5mdW5jdGlvbiBCdWZmZXJXcml0ZVVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIEJ1ZmZlcldyaXRlVUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIEJ1ZmZlcldyaXRlSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFyIGJ1ZiA9IHRoaXNcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmLCAtMHg4MClcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gYnVmLmxlbmd0aCkgcmV0dXJuXG5cbiAgYnVmLl9kYXRhdmlldy5zZXRJbnQ4KG9mZnNldCwgdmFsdWUpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiAobGl0dGxlRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmLCAtMHg4MDAwKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pIHtcbiAgICByZXR1cm5cbiAgfSBlbHNlIGlmIChvZmZzZXQgKyAxID09PSBsZW4pIHtcbiAgICB2YXIgZHYgPSBuZXcgeERhdGFWaWV3KG5ldyB4QXJyYXlCdWZmZXIoMikpXG4gICAgZHYuc2V0SW50MTYoMCwgdmFsdWUsIGxpdHRsZUVuZGlhbilcbiAgICBidWZbb2Zmc2V0XSA9IGR2LmdldFVpbnQ4KDApXG4gIH0gZWxzZSB7XG4gICAgYnVmLl9kYXRhdmlldy5zZXRJbnQxNihvZmZzZXQsIHZhbHVlLCBsaXR0bGVFbmRpYW4pXG4gIH1cbn1cblxuZnVuY3Rpb24gQnVmZmVyV3JpdGVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gQnVmZmVyV3JpdGVJbnQxNkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiAobGl0dGxlRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbikge1xuICAgIHJldHVyblxuICB9IGVsc2UgaWYgKG9mZnNldCArIDMgPj0gbGVuKSB7XG4gICAgdmFyIGR2ID0gbmV3IHhEYXRhVmlldyhuZXcgeEFycmF5QnVmZmVyKDQpKVxuICAgIGR2LnNldEludDMyKDAsIHZhbHVlLCBsaXR0bGVFbmRpYW4pXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgKyBvZmZzZXQgPCBsZW47IGkrKykge1xuICAgICAgYnVmW2kgKyBvZmZzZXRdID0gZHYuZ2V0VWludDgoaSlcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgYnVmLl9kYXRhdmlldy5zZXRJbnQzMihvZmZzZXQsIHZhbHVlLCBsaXR0bGVFbmRpYW4pXG4gIH1cbn1cblxuZnVuY3Rpb24gQnVmZmVyV3JpdGVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gQnVmZmVyV3JpdGVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiAobGl0dGxlRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmSUVFRTc1NCh2YWx1ZSwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbikge1xuICAgIHJldHVyblxuICB9IGVsc2UgaWYgKG9mZnNldCArIDMgPj0gbGVuKSB7XG4gICAgdmFyIGR2ID0gbmV3IHhEYXRhVmlldyhuZXcgeEFycmF5QnVmZmVyKDQpKVxuICAgIGR2LnNldEZsb2F0MzIoMCwgdmFsdWUsIGxpdHRsZUVuZGlhbilcbiAgICBmb3IgKHZhciBpID0gMDsgaSArIG9mZnNldCA8IGxlbjsgaSsrKSB7XG4gICAgICBidWZbaSArIG9mZnNldF0gPSBkdi5nZXRVaW50OChpKVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBidWYuX2RhdGF2aWV3LnNldEZsb2F0MzIob2Zmc2V0LCB2YWx1ZSwgbGl0dGxlRW5kaWFuKVxuICB9XG59XG5cbmZ1bmN0aW9uIEJ1ZmZlcldyaXRlRmxvYXRMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIEJ1ZmZlcldyaXRlRmxvYXRCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIChsaXR0bGVFbmRpYW4pID09PSAnYm9vbGVhbicsXG4gICAgICAgICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyA3IDwgYnVmLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pIHtcbiAgICByZXR1cm5cbiAgfSBlbHNlIGlmIChvZmZzZXQgKyA3ID49IGxlbikge1xuICAgIHZhciBkdiA9IG5ldyB4RGF0YVZpZXcobmV3IHhBcnJheUJ1ZmZlcig4KSlcbiAgICBkdi5zZXRGbG9hdDY0KDAsIHZhbHVlLCBsaXR0bGVFbmRpYW4pXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgKyBvZmZzZXQgPCBsZW47IGkrKykge1xuICAgICAgYnVmW2kgKyBvZmZzZXRdID0gZHYuZ2V0VWludDgoaSlcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgYnVmLl9kYXRhdmlldy5zZXRGbG9hdDY0KG9mZnNldCwgdmFsdWUsIGxpdHRsZUVuZGlhbilcbiAgfVxufVxuXG5mdW5jdGlvbiBCdWZmZXJXcml0ZURvdWJsZUxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIEJ1ZmZlcldyaXRlRG91YmxlQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbi8vIGZpbGwodmFsdWUsIHN0YXJ0PTAsIGVuZD1idWZmZXIubGVuZ3RoKVxuZnVuY3Rpb24gQnVmZmVyRmlsbCAodmFsdWUsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCF2YWx1ZSkgdmFsdWUgPSAwXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCkgZW5kID0gdGhpcy5sZW5ndGhcblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHZhbHVlID0gdmFsdWUuY2hhckNvZGVBdCgwKVxuICB9XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ251bWJlcicgfHwgaXNOYU4odmFsdWUpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd2YWx1ZSBpcyBub3QgYSBudW1iZXInKVxuICB9XG5cbiAgaWYgKGVuZCA8IHN0YXJ0KSB0aHJvdyBuZXcgRXJyb3IoJ2VuZCA8IHN0YXJ0JylcblxuICAvLyBGaWxsIDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGhpcy5sZW5ndGggPT09IDApIHJldHVyblxuXG4gIGlmIChzdGFydCA8IDAgfHwgc3RhcnQgPj0gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3N0YXJ0IG91dCBvZiBib3VuZHMnKVxuICB9XG5cbiAgaWYgKGVuZCA8IDAgfHwgZW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2VuZCBvdXQgb2YgYm91bmRzJylcbiAgfVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgdGhpc1tpXSA9IHZhbHVlXG4gIH1cbn1cblxuZnVuY3Rpb24gQnVmZmVySW5zcGVjdCAoKSB7XG4gIHZhciBvdXQgPSBbXVxuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIG91dFtpXSA9IHRvSGV4KHRoaXNbaV0pXG4gICAgaWYgKGkgPT09IGV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMpIHtcbiAgICAgIG91dFtpICsgMV0gPSAnLi4uJ1xuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBvdXQuam9pbignICcpICsgJz4nXG59XG5cbi8vIENyZWF0ZXMgYSBuZXcgYEFycmF5QnVmZmVyYCB3aXRoIHRoZSAqY29waWVkKiBtZW1vcnkgb2YgdGhlIGJ1ZmZlciBpbnN0YW5jZS5cbi8vIEFkZGVkIGluIE5vZGUgMC4xMi5cbmZ1bmN0aW9uIEJ1ZmZlclRvQXJyYXlCdWZmZXIgKCkge1xuICByZXR1cm4gKG5ldyBCdWZmZXIodGhpcykpLmJ1ZmZlclxufVxuXG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gc3RyaW5ndHJpbSAoc3RyKSB7XG4gIGlmIChzdHIudHJpbSkgcmV0dXJuIHN0ci50cmltKClcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJylcbn1cblxuLyoqXG4gKiBDaGVjayB0byBzZWUgaWYgdGhlIGJyb3dzZXIgc3VwcG9ydHMgYXVnbWVudGluZyBhIGBVaW50OEFycmF5YCBpbnN0YW5jZS5cbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIF9icm93c2VyU3VwcG9ydCAoKSB7XG4gIHZhciBhcnIgPSBuZXcgeFVpbnQ4QXJyYXkoMClcbiAgYXJyLmZvbyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDQyIH1cblxuICB0cnkge1xuICAgIHJldHVybiAoNDIgPT09IGFyci5mb28oKSlcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbi8qKlxuICogQ2xhc3M6IFByb3h5QnVmZmVyXG4gKiA9PT09PT09PT09PT09PT09PT1cbiAqXG4gKiBPbmx5IHVzZWQgaW4gRmlyZWZveCwgc2luY2UgRmlyZWZveCBkb2VzIG5vdCBhbGxvdyBhdWdtZW50aW5nIFwibmF0aXZlXCJcbiAqIG9iamVjdHMgKGxpa2UgVWludDhBcnJheSBpbnN0YW5jZXMpIHdpdGggbmV3IHByb3BlcnRpZXMgZm9yIHNvbWUgdW5rbm93blxuICogKHByb2JhYmx5IHNpbGx5KSByZWFzb24uIFNvIHdlJ2xswqB1c2UgYW4gRVM2IFByb3h5IChzdXBwb3J0ZWQgc2luY2VcbiAqIEZpcmVmb3ggMTgpIHRvIHdyYXAgdGhlIFVpbnQ4QXJyYXkgaW5zdGFuY2Ugd2l0aG91dCBhY3R1YWxseSBhZGRpbmcgYW55XG4gKiBwcm9wZXJ0aWVzIHRvIGl0LlxuICpcbiAqIEluc3RhbmNlcyBvZiB0aGlzIFwiZmFrZVwiIEJ1ZmZlciBjbGFzcyBhcmUgdGhlIFwidGFyZ2V0XCIgb2YgdGhlXG4gKiBFUzYgUHJveHkgKHNlZSBgYXVnbWVudGAgZnVuY3Rpb24pLlxuICpcbiAqIFdlIGNvdWxkbid0IGp1c3QgdXNlIHRoZSBgVWludDhBcnJheWAgYXMgdGhlIHRhcmdldCBvZiB0aGUgYFByb3h5YCBiZWNhdXNlXG4gKiBQcm94aWVzIGhhdmUgYW4gaW1wb3J0YW50IGxpbWl0YXRpb24gb24gdHJhcHBpbmcgdGhlIGB0b1N0cmluZ2AgbWV0aG9kLlxuICogYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChwcm94eSlgIGdldHMgY2FsbGVkIHdoZW5ldmVyIHNvbWV0aGluZyBpc1xuICogaW1wbGljaXRseSBjYXN0IHRvIGEgU3RyaW5nLiBVbmZvcnR1bmF0ZWx5LCB3aXRoIGEgYFByb3h5YCB0aGlzXG4gKiB1bmNvbmRpdGlvbmFsbHkgcmV0dXJucyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHRhcmdldClgIHdoaWNoIHdvdWxkXG4gKiBhbHdheXMgcmV0dXJuIFwiW29iamVjdCBVaW50OEFycmF5XVwiIGlmIHdlIHVzZWQgdGhlIGBVaW50OEFycmF5YCBpbnN0YW5jZSBhc1xuICogdGhlIHRhcmdldC4gQW5kLCByZW1lbWJlciwgaW4gRmlyZWZveCB3ZSBjYW5ub3QgcmVkZWZpbmUgdGhlIGBVaW50OEFycmF5YFxuICogaW5zdGFuY2UncyBgdG9TdHJpbmdgIG1ldGhvZC5cbiAqXG4gKiBTbywgd2UgdXNlIHRoaXMgYFByb3h5QnVmZmVyYCBjbGFzcyBhcyB0aGUgcHJveHkncyBcInRhcmdldFwiLiBTaW5jZSB0aGlzIGNsYXNzXG4gKiBoYXMgaXRzIG93biBjdXN0b20gYHRvU3RyaW5nYCBtZXRob2QsIGl0IHdpbGwgZ2V0IGNhbGxlZCB3aGVuZXZlciBgdG9TdHJpbmdgXG4gKiBnZXRzIGNhbGxlZCwgaW1wbGljaXRseSBvciBleHBsaWNpdGx5LCBvbiB0aGUgYFByb3h5YCBpbnN0YW5jZS5cbiAqXG4gKiBXZSBhbHNvIGhhdmUgdG8gZGVmaW5lIHRoZSBVaW50OEFycmF5IG1ldGhvZHMgYHN1YmFycmF5YCBhbmQgYHNldGAgb25cbiAqIGBQcm94eUJ1ZmZlcmAgYmVjYXVzZSBpZiB3ZSBkaWRuJ3QgdGhlbiBgcHJveHkuc3ViYXJyYXkoMClgIHdvdWxkIGhhdmUgaXRzXG4gKiBgdGhpc2Agc2V0IHRvIGBwcm94eWAgKGEgYFByb3h5YCBpbnN0YW5jZSkgd2hpY2ggdGhyb3dzIGFuIGV4Y2VwdGlvbiBpblxuICogRmlyZWZveCB3aGljaCBleHBlY3RzIGl0IHRvIGJlIGEgYFR5cGVkQXJyYXlgIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBQcm94eUJ1ZmZlciAoYXJyKSB7XG4gIHRoaXMuX2FyciA9IGFyclxuXG4gIGlmIChhcnIuYnl0ZUxlbmd0aCAhPT0gMClcbiAgICB0aGlzLl9kYXRhdmlldyA9IG5ldyB4RGF0YVZpZXcoYXJyLmJ1ZmZlciwgYXJyLmJ5dGVPZmZzZXQsIGFyci5ieXRlTGVuZ3RoKVxufVxuXG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBCdWZmZXJXcml0ZVxuUHJveHlCdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gQnVmZmVyVG9TdHJpbmdcblByb3h5QnVmZmVyLnByb3RvdHlwZS50b0xvY2FsZVN0cmluZyA9IEJ1ZmZlclRvU3RyaW5nXG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUudG9KU09OID0gQnVmZmVyVG9KU09OXG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUuY29weSA9IEJ1ZmZlckNvcHlcblByb3h5QnVmZmVyLnByb3RvdHlwZS5zbGljZSA9IEJ1ZmZlclNsaWNlXG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gQnVmZmVyUmVhZFVJbnQ4XG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gQnVmZmVyUmVhZFVJbnQxNkxFXG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gQnVmZmVyUmVhZFVJbnQxNkJFXG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gQnVmZmVyUmVhZFVJbnQzMkxFXG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gQnVmZmVyUmVhZFVJbnQzMkJFXG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUucmVhZEludDggPSBCdWZmZXJSZWFkSW50OFxuUHJveHlCdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gQnVmZmVyUmVhZEludDE2TEVcblByb3h5QnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IEJ1ZmZlclJlYWRJbnQxNkJFXG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBCdWZmZXJSZWFkSW50MzJMRVxuUHJveHlCdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFID0gQnVmZmVyUmVhZEludDMyQkVcblByb3h5QnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IEJ1ZmZlclJlYWRGbG9hdExFXG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBCdWZmZXJSZWFkRmxvYXRCRVxuUHJveHlCdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRSA9IEJ1ZmZlclJlYWREb3VibGVMRVxuUHJveHlCdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVCRSA9IEJ1ZmZlclJlYWREb3VibGVCRVxuUHJveHlCdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBCdWZmZXJXcml0ZVVJbnQ4XG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZMRSA9IEJ1ZmZlcldyaXRlVUludDE2TEVcblByb3h5QnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gQnVmZmVyV3JpdGVVSW50MTZCRVxuUHJveHlCdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyTEUgPSBCdWZmZXJXcml0ZVVJbnQzMkxFXG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSA9IEJ1ZmZlcldyaXRlVUludDMyQkVcblByb3h5QnVmZmVyLnByb3RvdHlwZS53cml0ZUludDggPSBCdWZmZXJXcml0ZUludDhcblByb3h5QnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBCdWZmZXJXcml0ZUludDE2TEVcblByb3h5QnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBCdWZmZXJXcml0ZUludDE2QkVcblByb3h5QnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyTEUgPSBCdWZmZXJXcml0ZUludDMyTEVcblByb3h5QnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBCdWZmZXJXcml0ZUludDMyQkVcblByb3h5QnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0TEUgPSBCdWZmZXJXcml0ZUZsb2F0TEVcblByb3h5QnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBCdWZmZXJXcml0ZUZsb2F0QkVcblByb3h5QnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gQnVmZmVyV3JpdGVEb3VibGVMRVxuUHJveHlCdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBCdWZmZXJXcml0ZURvdWJsZUJFXG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUuZmlsbCA9IEJ1ZmZlckZpbGxcblByb3h5QnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gQnVmZmVySW5zcGVjdFxuUHJveHlCdWZmZXIucHJvdG90eXBlLnRvQXJyYXlCdWZmZXIgPSBCdWZmZXJUb0FycmF5QnVmZmVyXG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUuX2lzQnVmZmVyID0gdHJ1ZVxuUHJveHlCdWZmZXIucHJvdG90eXBlLnN1YmFycmF5ID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5fYXJyLnN1YmFycmF5LmFwcGx5KHRoaXMuX2FyciwgYXJndW1lbnRzKVxufVxuUHJveHlCdWZmZXIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuX2Fyci5zZXQuYXBwbHkodGhpcy5fYXJyLCBhcmd1bWVudHMpXG59XG5cbnZhciBQcm94eUhhbmRsZXIgPSB7XG4gIGdldDogZnVuY3Rpb24gKHRhcmdldCwgbmFtZSkge1xuICAgIGlmIChuYW1lIGluIHRhcmdldCkgcmV0dXJuIHRhcmdldFtuYW1lXVxuICAgIGVsc2UgcmV0dXJuIHRhcmdldC5fYXJyW25hbWVdXG4gIH0sXG4gIHNldDogZnVuY3Rpb24gKHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcbiAgICB0YXJnZXQuX2FycltuYW1lXSA9IHZhbHVlXG4gIH1cbn1cblxuZnVuY3Rpb24gYXVnbWVudCAoYXJyKSB7XG4gIGlmIChicm93c2VyU3VwcG9ydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYnJvd3NlclN1cHBvcnQgPSBfYnJvd3NlclN1cHBvcnQoKVxuICB9XG5cbiAgaWYgKGJyb3dzZXJTdXBwb3J0KSB7XG4gICAgLy8gQXVnbWVudCB0aGUgVWludDhBcnJheSAqaW5zdGFuY2UqIChub3QgdGhlIGNsYXNzISkgd2l0aCBCdWZmZXIgbWV0aG9kc1xuICAgIGFyci53cml0ZSA9IEJ1ZmZlcldyaXRlXG4gICAgYXJyLnRvU3RyaW5nID0gQnVmZmVyVG9TdHJpbmdcbiAgICBhcnIudG9Mb2NhbGVTdHJpbmcgPSBCdWZmZXJUb1N0cmluZ1xuICAgIGFyci50b0pTT04gPSBCdWZmZXJUb0pTT05cbiAgICBhcnIuY29weSA9IEJ1ZmZlckNvcHlcbiAgICBhcnIuc2xpY2UgPSBCdWZmZXJTbGljZVxuICAgIGFyci5yZWFkVUludDggPSBCdWZmZXJSZWFkVUludDhcbiAgICBhcnIucmVhZFVJbnQxNkxFID0gQnVmZmVyUmVhZFVJbnQxNkxFXG4gICAgYXJyLnJlYWRVSW50MTZCRSA9IEJ1ZmZlclJlYWRVSW50MTZCRVxuICAgIGFyci5yZWFkVUludDMyTEUgPSBCdWZmZXJSZWFkVUludDMyTEVcbiAgICBhcnIucmVhZFVJbnQzMkJFID0gQnVmZmVyUmVhZFVJbnQzMkJFXG4gICAgYXJyLnJlYWRJbnQ4ID0gQnVmZmVyUmVhZEludDhcbiAgICBhcnIucmVhZEludDE2TEUgPSBCdWZmZXJSZWFkSW50MTZMRVxuICAgIGFyci5yZWFkSW50MTZCRSA9IEJ1ZmZlclJlYWRJbnQxNkJFXG4gICAgYXJyLnJlYWRJbnQzMkxFID0gQnVmZmVyUmVhZEludDMyTEVcbiAgICBhcnIucmVhZEludDMyQkUgPSBCdWZmZXJSZWFkSW50MzJCRVxuICAgIGFyci5yZWFkRmxvYXRMRSA9IEJ1ZmZlclJlYWRGbG9hdExFXG4gICAgYXJyLnJlYWRGbG9hdEJFID0gQnVmZmVyUmVhZEZsb2F0QkVcbiAgICBhcnIucmVhZERvdWJsZUxFID0gQnVmZmVyUmVhZERvdWJsZUxFXG4gICAgYXJyLnJlYWREb3VibGVCRSA9IEJ1ZmZlclJlYWREb3VibGVCRVxuICAgIGFyci53cml0ZVVJbnQ4ID0gQnVmZmVyV3JpdGVVSW50OFxuICAgIGFyci53cml0ZVVJbnQxNkxFID0gQnVmZmVyV3JpdGVVSW50MTZMRVxuICAgIGFyci53cml0ZVVJbnQxNkJFID0gQnVmZmVyV3JpdGVVSW50MTZCRVxuICAgIGFyci53cml0ZVVJbnQzMkxFID0gQnVmZmVyV3JpdGVVSW50MzJMRVxuICAgIGFyci53cml0ZVVJbnQzMkJFID0gQnVmZmVyV3JpdGVVSW50MzJCRVxuICAgIGFyci53cml0ZUludDggPSBCdWZmZXJXcml0ZUludDhcbiAgICBhcnIud3JpdGVJbnQxNkxFID0gQnVmZmVyV3JpdGVJbnQxNkxFXG4gICAgYXJyLndyaXRlSW50MTZCRSA9IEJ1ZmZlcldyaXRlSW50MTZCRVxuICAgIGFyci53cml0ZUludDMyTEUgPSBCdWZmZXJXcml0ZUludDMyTEVcbiAgICBhcnIud3JpdGVJbnQzMkJFID0gQnVmZmVyV3JpdGVJbnQzMkJFXG4gICAgYXJyLndyaXRlRmxvYXRMRSA9IEJ1ZmZlcldyaXRlRmxvYXRMRVxuICAgIGFyci53cml0ZUZsb2F0QkUgPSBCdWZmZXJXcml0ZUZsb2F0QkVcbiAgICBhcnIud3JpdGVEb3VibGVMRSA9IEJ1ZmZlcldyaXRlRG91YmxlTEVcbiAgICBhcnIud3JpdGVEb3VibGVCRSA9IEJ1ZmZlcldyaXRlRG91YmxlQkVcbiAgICBhcnIuZmlsbCA9IEJ1ZmZlckZpbGxcbiAgICBhcnIuaW5zcGVjdCA9IEJ1ZmZlckluc3BlY3RcbiAgICBhcnIudG9BcnJheUJ1ZmZlciA9IEJ1ZmZlclRvQXJyYXlCdWZmZXJcbiAgICBhcnIuX2lzQnVmZmVyID0gdHJ1ZVxuXG4gICAgaWYgKGFyci5ieXRlTGVuZ3RoICE9PSAwKVxuICAgICAgYXJyLl9kYXRhdmlldyA9IG5ldyB4RGF0YVZpZXcoYXJyLmJ1ZmZlciwgYXJyLmJ5dGVPZmZzZXQsIGFyci5ieXRlTGVuZ3RoKVxuXG4gICAgcmV0dXJuIGFyclxuXG4gIH0gZWxzZSB7XG4gICAgLy8gVGhpcyBpcyBhIGJyb3dzZXIgdGhhdCBkb2Vzbid0IHN1cHBvcnQgYXVnbWVudGluZyB0aGUgYFVpbnQ4QXJyYXlgXG4gICAgLy8gaW5zdGFuY2UgKCphaGVtKiBGaXJlZm94KSBzbyB1c2UgYW4gRVM2IGBQcm94eWAuXG4gICAgdmFyIHByb3h5QnVmZmVyID0gbmV3IFByb3h5QnVmZmVyKGFycilcbiAgICB2YXIgcHJveHkgPSBuZXcgUHJveHkocHJveHlCdWZmZXIsIFByb3h5SGFuZGxlcilcbiAgICBwcm94eUJ1ZmZlci5fcHJveHkgPSBwcm94eVxuICAgIHJldHVybiBwcm94eVxuICB9XG59XG5cbi8vIHNsaWNlKHN0YXJ0LCBlbmQpXG5mdW5jdGlvbiBjbGFtcCAoaW5kZXgsIGxlbiwgZGVmYXVsdFZhbHVlKSB7XG4gIGlmICh0eXBlb2YgaW5kZXggIT09ICdudW1iZXInKSByZXR1cm4gZGVmYXVsdFZhbHVlXG4gIGluZGV4ID0gfn5pbmRleDsgIC8vIENvZXJjZSB0byBpbnRlZ2VyLlxuICBpZiAoaW5kZXggPj0gbGVuKSByZXR1cm4gbGVuXG4gIGlmIChpbmRleCA+PSAwKSByZXR1cm4gaW5kZXhcbiAgaW5kZXggKz0gbGVuXG4gIGlmIChpbmRleCA+PSAwKSByZXR1cm4gaW5kZXhcbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gY29lcmNlIChsZW5ndGgpIHtcbiAgLy8gQ29lcmNlIGxlbmd0aCB0byBhIG51bWJlciAocG9zc2libHkgTmFOKSwgcm91bmQgdXBcbiAgLy8gaW4gY2FzZSBpdCdzIGZyYWN0aW9uYWwgKGUuZy4gMTIzLjQ1NikgdGhlbiBkbyBhXG4gIC8vIGRvdWJsZSBuZWdhdGUgdG8gY29lcmNlIGEgTmFOIHRvIDAuIEVhc3ksIHJpZ2h0P1xuICBsZW5ndGggPSB+fk1hdGguY2VpbCgrbGVuZ3RoKVxuICByZXR1cm4gbGVuZ3RoIDwgMCA/IDAgOiBsZW5ndGhcbn1cblxuZnVuY3Rpb24gaXNBcnJheUlzaCAoc3ViamVjdCkge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShzdWJqZWN0KSB8fCBCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkgfHxcbiAgICAgIHN1YmplY3QgJiYgdHlwZW9mIHN1YmplY3QgPT09ICdvYmplY3QnICYmXG4gICAgICB0eXBlb2Ygc3ViamVjdC5sZW5ndGggPT09ICdudW1iZXInXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspXG4gICAgaWYgKHN0ci5jaGFyQ29kZUF0KGkpIDw9IDB4N0YpXG4gICAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSlcbiAgICBlbHNlIHtcbiAgICAgIHZhciBoID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0ci5jaGFyQXQoaSkpLnN1YnN0cigxKS5zcGxpdCgnJScpXG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGgubGVuZ3RoOyBqKyspXG4gICAgICAgIGJ5dGVBcnJheS5wdXNoKHBhcnNlSW50KGhbal0sIDE2KSlcbiAgICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cblxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFRvQnl0ZXMgKHN0cikge1xuICByZXR1cm4gcmVxdWlyZSgnYmFzZTY0LWpzJykudG9CeXRlQXJyYXkoc3RyKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIHBvcywgaSA9IDBcbiAgd2hpbGUgKGkgPCBsZW5ndGgpIHtcbiAgICBpZiAoKGkgKyBvZmZzZXQgPj0gZHN0Lmxlbmd0aCkgfHwgKGkgPj0gc3JjLmxlbmd0aCkpXG4gICAgICBicmVha1xuXG4gICAgZHN0W2kgKyBvZmZzZXRdID0gc3JjW2ldXG4gICAgaSsrXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gZGVjb2RlVXRmOENoYXIgKHN0cikge1xuICB0cnkge1xuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoc3RyKVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSgweEZGRkQpIC8vIFVURiA4IGludmFsaWQgY2hhclxuICB9XG59XG5cbi8qXG4gKiBXZSBoYXZlIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSB2YWx1ZSBpcyBhIHZhbGlkIGludGVnZXIuIFRoaXMgbWVhbnMgdGhhdCBpdFxuICogaXMgbm9uLW5lZ2F0aXZlLiBJdCBoYXMgbm8gZnJhY3Rpb25hbCBjb21wb25lbnQgYW5kIHRoYXQgaXQgZG9lcyBub3RcbiAqIGV4Y2VlZCB0aGUgbWF4aW11bSBhbGxvd2VkIHZhbHVlLlxuICpcbiAqICAgICAgdmFsdWUgICAgICAgICAgIFRoZSBudW1iZXIgdG8gY2hlY2sgZm9yIHZhbGlkaXR5XG4gKlxuICogICAgICBtYXggICAgICAgICAgICAgVGhlIG1heGltdW0gdmFsdWVcbiAqL1xuZnVuY3Rpb24gdmVyaWZ1aW50ICh2YWx1ZSwgbWF4KSB7XG4gIGFzc2VydCh0eXBlb2YgKHZhbHVlKSA9PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPj0gMCxcbiAgICAgICdzcGVjaWZpZWQgYSBuZWdhdGl2ZSB2YWx1ZSBmb3Igd3JpdGluZyBhbiB1bnNpZ25lZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBpcyBsYXJnZXIgdGhhbiBtYXhpbXVtIHZhbHVlIGZvciB0eXBlJylcbiAgYXNzZXJ0KE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZSwgJ3ZhbHVlIGhhcyBhIGZyYWN0aW9uYWwgY29tcG9uZW50Jylcbn1cblxuLypcbiAqIEEgc2VyaWVzIG9mIGNoZWNrcyB0byBtYWtlIHN1cmUgd2UgYWN0dWFsbHkgaGF2ZSBhIHNpZ25lZCAzMi1iaXQgbnVtYmVyXG4gKi9cbmZ1bmN0aW9uIHZlcmlmc2ludCh2YWx1ZSwgbWF4LCBtaW4pIHtcbiAgYXNzZXJ0KHR5cGVvZiAodmFsdWUpID09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmSUVFRTc1NCh2YWx1ZSwgbWF4LCBtaW4pIHtcbiAgYXNzZXJ0KHR5cGVvZiAodmFsdWUpID09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG59XG5cbmZ1bmN0aW9uIGFzc2VydCAodGVzdCwgbWVzc2FnZSkge1xuICBpZiAoIXRlc3QpIHRocm93IG5ldyBFcnJvcihtZXNzYWdlIHx8ICdGYWlsZWQgYXNzZXJ0aW9uJylcbn1cblxufSx7XCJiYXNlNjQtanNcIjozLFwidHlwZWRhcnJheVwiOjR9XSxcIm5hdGl2ZS1idWZmZXItYnJvd3NlcmlmeVwiOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbm1vZHVsZS5leHBvcnRzPXJlcXVpcmUoJ1BjWmo5TCcpO1xufSx7fV0sMzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4oZnVuY3Rpb24gKGV4cG9ydHMpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBsb29rdXAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG5cblx0ZnVuY3Rpb24gYjY0VG9CeXRlQXJyYXkoYjY0KSB7XG5cdFx0dmFyIGksIGosIGwsIHRtcCwgcGxhY2VIb2xkZXJzLCBhcnI7XG5cdFxuXHRcdGlmIChiNjQubGVuZ3RoICUgNCA+IDApIHtcblx0XHRcdHRocm93ICdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0Jztcblx0XHR9XG5cblx0XHQvLyB0aGUgbnVtYmVyIG9mIGVxdWFsIHNpZ25zIChwbGFjZSBob2xkZXJzKVxuXHRcdC8vIGlmIHRoZXJlIGFyZSB0d28gcGxhY2Vob2xkZXJzLCB0aGFuIHRoZSB0d28gY2hhcmFjdGVycyBiZWZvcmUgaXRcblx0XHQvLyByZXByZXNlbnQgb25lIGJ5dGVcblx0XHQvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgdGhlbiB0aGUgdGhyZWUgY2hhcmFjdGVycyBiZWZvcmUgaXQgcmVwcmVzZW50IDIgYnl0ZXNcblx0XHQvLyB0aGlzIGlzIGp1c3QgYSBjaGVhcCBoYWNrIHRvIG5vdCBkbyBpbmRleE9mIHR3aWNlXG5cdFx0cGxhY2VIb2xkZXJzID0gYjY0LmluZGV4T2YoJz0nKTtcblx0XHRwbGFjZUhvbGRlcnMgPSBwbGFjZUhvbGRlcnMgPiAwID8gYjY0Lmxlbmd0aCAtIHBsYWNlSG9sZGVycyA6IDA7XG5cblx0XHQvLyBiYXNlNjQgaXMgNC8zICsgdXAgdG8gdHdvIGNoYXJhY3RlcnMgb2YgdGhlIG9yaWdpbmFsIGRhdGFcblx0XHRhcnIgPSBbXTsvL25ldyBVaW50OEFycmF5KGI2NC5sZW5ndGggKiAzIC8gNCAtIHBsYWNlSG9sZGVycyk7XG5cblx0XHQvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG5cdFx0bCA9IHBsYWNlSG9sZGVycyA+IDAgPyBiNjQubGVuZ3RoIC0gNCA6IGI2NC5sZW5ndGg7XG5cblx0XHRmb3IgKGkgPSAwLCBqID0gMDsgaSA8IGw7IGkgKz0gNCwgaiArPSAzKSB7XG5cdFx0XHR0bXAgPSAobG9va3VwLmluZGV4T2YoYjY0W2ldKSA8PCAxOCkgfCAobG9va3VwLmluZGV4T2YoYjY0W2kgKyAxXSkgPDwgMTIpIHwgKGxvb2t1cC5pbmRleE9mKGI2NFtpICsgMl0pIDw8IDYpIHwgbG9va3VwLmluZGV4T2YoYjY0W2kgKyAzXSk7XG5cdFx0XHRhcnIucHVzaCgodG1wICYgMHhGRjAwMDApID4+IDE2KTtcblx0XHRcdGFyci5wdXNoKCh0bXAgJiAweEZGMDApID4+IDgpO1xuXHRcdFx0YXJyLnB1c2godG1wICYgMHhGRik7XG5cdFx0fVxuXG5cdFx0aWYgKHBsYWNlSG9sZGVycyA9PT0gMikge1xuXHRcdFx0dG1wID0gKGxvb2t1cC5pbmRleE9mKGI2NFtpXSkgPDwgMikgfCAobG9va3VwLmluZGV4T2YoYjY0W2kgKyAxXSkgPj4gNCk7XG5cdFx0XHRhcnIucHVzaCh0bXAgJiAweEZGKTtcblx0XHR9IGVsc2UgaWYgKHBsYWNlSG9sZGVycyA9PT0gMSkge1xuXHRcdFx0dG1wID0gKGxvb2t1cC5pbmRleE9mKGI2NFtpXSkgPDwgMTApIHwgKGxvb2t1cC5pbmRleE9mKGI2NFtpICsgMV0pIDw8IDQpIHwgKGxvb2t1cC5pbmRleE9mKGI2NFtpICsgMl0pID4+IDIpO1xuXHRcdFx0YXJyLnB1c2goKHRtcCA+PiA4KSAmIDB4RkYpO1xuXHRcdFx0YXJyLnB1c2godG1wICYgMHhGRik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGFycjtcblx0fVxuXG5cdGZ1bmN0aW9uIHVpbnQ4VG9CYXNlNjQodWludDgpIHtcblx0XHR2YXIgaSxcblx0XHRcdGV4dHJhQnl0ZXMgPSB1aW50OC5sZW5ndGggJSAzLCAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuXHRcdFx0b3V0cHV0ID0gXCJcIixcblx0XHRcdHRlbXAsIGxlbmd0aDtcblxuXHRcdGZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG5cdFx0XHRyZXR1cm4gbG9va3VwW251bSA+PiAxOCAmIDB4M0ZdICsgbG9va3VwW251bSA+PiAxMiAmIDB4M0ZdICsgbG9va3VwW251bSA+PiA2ICYgMHgzRl0gKyBsb29rdXBbbnVtICYgMHgzRl07XG5cdFx0fTtcblxuXHRcdC8vIGdvIHRocm91Z2ggdGhlIGFycmF5IGV2ZXJ5IHRocmVlIGJ5dGVzLCB3ZSdsbCBkZWFsIHdpdGggdHJhaWxpbmcgc3R1ZmYgbGF0ZXJcblx0XHRmb3IgKGkgPSAwLCBsZW5ndGggPSB1aW50OC5sZW5ndGggLSBleHRyYUJ5dGVzOyBpIDwgbGVuZ3RoOyBpICs9IDMpIHtcblx0XHRcdHRlbXAgPSAodWludDhbaV0gPDwgMTYpICsgKHVpbnQ4W2kgKyAxXSA8PCA4KSArICh1aW50OFtpICsgMl0pO1xuXHRcdFx0b3V0cHV0ICs9IHRyaXBsZXRUb0Jhc2U2NCh0ZW1wKTtcblx0XHR9XG5cblx0XHQvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG5cdFx0c3dpdGNoIChleHRyYUJ5dGVzKSB7XG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdHRlbXAgPSB1aW50OFt1aW50OC5sZW5ndGggLSAxXTtcblx0XHRcdFx0b3V0cHV0ICs9IGxvb2t1cFt0ZW1wID4+IDJdO1xuXHRcdFx0XHRvdXRwdXQgKz0gbG9va3VwWyh0ZW1wIDw8IDQpICYgMHgzRl07XG5cdFx0XHRcdG91dHB1dCArPSAnPT0nO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMjpcblx0XHRcdFx0dGVtcCA9ICh1aW50OFt1aW50OC5sZW5ndGggLSAyXSA8PCA4KSArICh1aW50OFt1aW50OC5sZW5ndGggLSAxXSk7XG5cdFx0XHRcdG91dHB1dCArPSBsb29rdXBbdGVtcCA+PiAxMF07XG5cdFx0XHRcdG91dHB1dCArPSBsb29rdXBbKHRlbXAgPj4gNCkgJiAweDNGXTtcblx0XHRcdFx0b3V0cHV0ICs9IGxvb2t1cFsodGVtcCA8PCAyKSAmIDB4M0ZdO1xuXHRcdFx0XHRvdXRwdXQgKz0gJz0nO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHRyZXR1cm4gb3V0cHV0O1xuXHR9XG5cblx0bW9kdWxlLmV4cG9ydHMudG9CeXRlQXJyYXkgPSBiNjRUb0J5dGVBcnJheTtcblx0bW9kdWxlLmV4cG9ydHMuZnJvbUJ5dGVBcnJheSA9IHVpbnQ4VG9CYXNlNjQ7XG59KCkpO1xuXG59LHt9XSw0OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbnZhciB1bmRlZmluZWQgPSAodm9pZCAwKTsgLy8gUGFyYW5vaWFcblxuLy8gQmV5b25kIHRoaXMgdmFsdWUsIGluZGV4IGdldHRlcnMvc2V0dGVycyAoaS5lLiBhcnJheVswXSwgYXJyYXlbMV0pIGFyZSBzbyBzbG93IHRvXG4vLyBjcmVhdGUsIGFuZCBjb25zdW1lIHNvIG11Y2ggbWVtb3J5LCB0aGF0IHRoZSBicm93c2VyIGFwcGVhcnMgZnJvemVuLlxudmFyIE1BWF9BUlJBWV9MRU5HVEggPSAxZTU7XG5cbi8vIEFwcHJveGltYXRpb25zIG9mIGludGVybmFsIEVDTUFTY3JpcHQgY29udmVyc2lvbiBmdW5jdGlvbnNcbnZhciBFQ01BU2NyaXB0ID0gKGZ1bmN0aW9uKCkge1xuICAvLyBTdGFzaCBhIGNvcHkgaW4gY2FzZSBvdGhlciBzY3JpcHRzIG1vZGlmeSB0aGVzZVxuICB2YXIgb3B0cyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcsXG4gICAgICBvcGhvcCA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbiAgcmV0dXJuIHtcbiAgICAvLyBDbGFzcyByZXR1cm5zIGludGVybmFsIFtbQ2xhc3NdXSBwcm9wZXJ0eSwgdXNlZCB0byBhdm9pZCBjcm9zcy1mcmFtZSBpbnN0YW5jZW9mIGlzc3VlczpcbiAgICBDbGFzczogZnVuY3Rpb24odikgeyByZXR1cm4gb3B0cy5jYWxsKHYpLnJlcGxhY2UoL15cXFtvYmplY3QgKnxcXF0kL2csICcnKTsgfSxcbiAgICBIYXNQcm9wZXJ0eTogZnVuY3Rpb24obywgcCkgeyByZXR1cm4gcCBpbiBvOyB9LFxuICAgIEhhc093blByb3BlcnR5OiBmdW5jdGlvbihvLCBwKSB7IHJldHVybiBvcGhvcC5jYWxsKG8sIHApOyB9LFxuICAgIElzQ2FsbGFibGU6IGZ1bmN0aW9uKG8pIHsgcmV0dXJuIHR5cGVvZiBvID09PSAnZnVuY3Rpb24nOyB9LFxuICAgIFRvSW50MzI6IGZ1bmN0aW9uKHYpIHsgcmV0dXJuIHYgPj4gMDsgfSxcbiAgICBUb1VpbnQzMjogZnVuY3Rpb24odikgeyByZXR1cm4gdiA+Pj4gMDsgfVxuICB9O1xufSgpKTtcblxuLy8gU25hcHNob3QgaW50cmluc2ljc1xudmFyIExOMiA9IE1hdGguTE4yLFxuICAgIGFicyA9IE1hdGguYWJzLFxuICAgIGZsb29yID0gTWF0aC5mbG9vcixcbiAgICBsb2cgPSBNYXRoLmxvZyxcbiAgICBtaW4gPSBNYXRoLm1pbixcbiAgICBwb3cgPSBNYXRoLnBvdyxcbiAgICByb3VuZCA9IE1hdGgucm91bmQ7XG5cbi8vIEVTNTogbG9jayBkb3duIG9iamVjdCBwcm9wZXJ0aWVzXG5mdW5jdGlvbiBjb25maWd1cmVQcm9wZXJ0aWVzKG9iaikge1xuICBpZiAoZ2V0T3duUHJvcGVydHlOYW1lcyAmJiBkZWZpbmVQcm9wZXJ0eSkge1xuICAgIHZhciBwcm9wcyA9IGdldE93blByb3BlcnR5TmFtZXMob2JqKSwgaTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGRlZmluZVByb3BlcnR5KG9iaiwgcHJvcHNbaV0sIHtcbiAgICAgICAgdmFsdWU6IG9ialtwcm9wc1tpXV0sXG4gICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG4vLyBlbXVsYXRlIEVTNSBnZXR0ZXIvc2V0dGVyIEFQSSB1c2luZyBsZWdhY3kgQVBJc1xuLy8gaHR0cDovL2Jsb2dzLm1zZG4uY29tL2IvaWUvYXJjaGl2ZS8yMDEwLzA5LzA3L3RyYW5zaXRpb25pbmctZXhpc3RpbmctY29kZS10by10aGUtZXM1LWdldHRlci1zZXR0ZXItYXBpcy5hc3B4XG4vLyAoc2Vjb25kIGNsYXVzZSB0ZXN0cyBmb3IgT2JqZWN0LmRlZmluZVByb3BlcnR5KCkgaW4gSUU8OSB0aGF0IG9ubHkgc3VwcG9ydHMgZXh0ZW5kaW5nIERPTSBwcm90b3R5cGVzLCBidXRcbi8vIG5vdGUgdGhhdCBJRTw5IGRvZXMgbm90IHN1cHBvcnQgX19kZWZpbmVHZXR0ZXJfXyBvciBfX2RlZmluZVNldHRlcl9fIHNvIGl0IGp1c3QgcmVuZGVycyB0aGUgbWV0aG9kIGhhcm1sZXNzKVxudmFyIGRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5IHx8IGZ1bmN0aW9uKG8sIHAsIGRlc2MpIHtcbiAgaWYgKCFvID09PSBPYmplY3QobykpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPYmplY3QuZGVmaW5lUHJvcGVydHkgY2FsbGVkIG9uIG5vbi1vYmplY3RcIik7XG4gIGlmIChFQ01BU2NyaXB0Lkhhc1Byb3BlcnR5KGRlc2MsICdnZXQnKSAmJiBPYmplY3QucHJvdG90eXBlLl9fZGVmaW5lR2V0dGVyX18pIHsgT2JqZWN0LnByb3RvdHlwZS5fX2RlZmluZUdldHRlcl9fLmNhbGwobywgcCwgZGVzYy5nZXQpOyB9XG4gIGlmIChFQ01BU2NyaXB0Lkhhc1Byb3BlcnR5KGRlc2MsICdzZXQnKSAmJiBPYmplY3QucHJvdG90eXBlLl9fZGVmaW5lU2V0dGVyX18pIHsgT2JqZWN0LnByb3RvdHlwZS5fX2RlZmluZVNldHRlcl9fLmNhbGwobywgcCwgZGVzYy5zZXQpOyB9XG4gIGlmIChFQ01BU2NyaXB0Lkhhc1Byb3BlcnR5KGRlc2MsICd2YWx1ZScpKSB7IG9bcF0gPSBkZXNjLnZhbHVlOyB9XG4gIHJldHVybiBvO1xufTtcblxudmFyIGdldE93blByb3BlcnR5TmFtZXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB8fCBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKG8pIHtcbiAgaWYgKG8gIT09IE9iamVjdChvKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIGNhbGxlZCBvbiBub24tb2JqZWN0XCIpO1xuICB2YXIgcHJvcHMgPSBbXSwgcDtcbiAgZm9yIChwIGluIG8pIHtcbiAgICBpZiAoRUNNQVNjcmlwdC5IYXNPd25Qcm9wZXJ0eShvLCBwKSkge1xuICAgICAgcHJvcHMucHVzaChwKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHByb3BzO1xufTtcblxuLy8gRVM1OiBNYWtlIG9ialtpbmRleF0gYW4gYWxpYXMgZm9yIG9iai5fZ2V0dGVyKGluZGV4KS9vYmouX3NldHRlcihpbmRleCwgdmFsdWUpXG4vLyBmb3IgaW5kZXggaW4gMCAuLi4gb2JqLmxlbmd0aFxuZnVuY3Rpb24gbWFrZUFycmF5QWNjZXNzb3JzKG9iaikge1xuICBpZiAoIWRlZmluZVByb3BlcnR5KSB7IHJldHVybjsgfVxuXG4gIGlmIChvYmoubGVuZ3RoID4gTUFYX0FSUkFZX0xFTkdUSCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJBcnJheSB0b28gbGFyZ2UgZm9yIHBvbHlmaWxsXCIpO1xuXG4gIGZ1bmN0aW9uIG1ha2VBcnJheUFjY2Vzc29yKGluZGV4KSB7XG4gICAgZGVmaW5lUHJvcGVydHkob2JqLCBpbmRleCwge1xuICAgICAgJ2dldCc6IGZ1bmN0aW9uKCkgeyByZXR1cm4gb2JqLl9nZXR0ZXIoaW5kZXgpOyB9LFxuICAgICAgJ3NldCc6IGZ1bmN0aW9uKHYpIHsgb2JqLl9zZXR0ZXIoaW5kZXgsIHYpOyB9LFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcbiAgICB9KTtcbiAgfVxuXG4gIHZhciBpO1xuICBmb3IgKGkgPSAwOyBpIDwgb2JqLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgbWFrZUFycmF5QWNjZXNzb3IoaSk7XG4gIH1cbn1cblxuLy8gSW50ZXJuYWwgY29udmVyc2lvbiBmdW5jdGlvbnM6XG4vLyAgICBwYWNrPFR5cGU+KCkgICAtIHRha2UgYSBudW1iZXIgKGludGVycHJldGVkIGFzIFR5cGUpLCBvdXRwdXQgYSBieXRlIGFycmF5XG4vLyAgICB1bnBhY2s8VHlwZT4oKSAtIHRha2UgYSBieXRlIGFycmF5LCBvdXRwdXQgYSBUeXBlLWxpa2UgbnVtYmVyXG5cbmZ1bmN0aW9uIGFzX3NpZ25lZCh2YWx1ZSwgYml0cykgeyB2YXIgcyA9IDMyIC0gYml0czsgcmV0dXJuICh2YWx1ZSA8PCBzKSA+PiBzOyB9XG5mdW5jdGlvbiBhc191bnNpZ25lZCh2YWx1ZSwgYml0cykgeyB2YXIgcyA9IDMyIC0gYml0czsgcmV0dXJuICh2YWx1ZSA8PCBzKSA+Pj4gczsgfVxuXG5mdW5jdGlvbiBwYWNrSTgobikgeyByZXR1cm4gW24gJiAweGZmXTsgfVxuZnVuY3Rpb24gdW5wYWNrSTgoYnl0ZXMpIHsgcmV0dXJuIGFzX3NpZ25lZChieXRlc1swXSwgOCk7IH1cblxuZnVuY3Rpb24gcGFja1U4KG4pIHsgcmV0dXJuIFtuICYgMHhmZl07IH1cbmZ1bmN0aW9uIHVucGFja1U4KGJ5dGVzKSB7IHJldHVybiBhc191bnNpZ25lZChieXRlc1swXSwgOCk7IH1cblxuZnVuY3Rpb24gcGFja1U4Q2xhbXBlZChuKSB7IG4gPSByb3VuZChOdW1iZXIobikpOyByZXR1cm4gW24gPCAwID8gMCA6IG4gPiAweGZmID8gMHhmZiA6IG4gJiAweGZmXTsgfVxuXG5mdW5jdGlvbiBwYWNrSTE2KG4pIHsgcmV0dXJuIFsobiA+PiA4KSAmIDB4ZmYsIG4gJiAweGZmXTsgfVxuZnVuY3Rpb24gdW5wYWNrSTE2KGJ5dGVzKSB7IHJldHVybiBhc19zaWduZWQoYnl0ZXNbMF0gPDwgOCB8IGJ5dGVzWzFdLCAxNik7IH1cblxuZnVuY3Rpb24gcGFja1UxNihuKSB7IHJldHVybiBbKG4gPj4gOCkgJiAweGZmLCBuICYgMHhmZl07IH1cbmZ1bmN0aW9uIHVucGFja1UxNihieXRlcykgeyByZXR1cm4gYXNfdW5zaWduZWQoYnl0ZXNbMF0gPDwgOCB8IGJ5dGVzWzFdLCAxNik7IH1cblxuZnVuY3Rpb24gcGFja0kzMihuKSB7IHJldHVybiBbKG4gPj4gMjQpICYgMHhmZiwgKG4gPj4gMTYpICYgMHhmZiwgKG4gPj4gOCkgJiAweGZmLCBuICYgMHhmZl07IH1cbmZ1bmN0aW9uIHVucGFja0kzMihieXRlcykgeyByZXR1cm4gYXNfc2lnbmVkKGJ5dGVzWzBdIDw8IDI0IHwgYnl0ZXNbMV0gPDwgMTYgfCBieXRlc1syXSA8PCA4IHwgYnl0ZXNbM10sIDMyKTsgfVxuXG5mdW5jdGlvbiBwYWNrVTMyKG4pIHsgcmV0dXJuIFsobiA+PiAyNCkgJiAweGZmLCAobiA+PiAxNikgJiAweGZmLCAobiA+PiA4KSAmIDB4ZmYsIG4gJiAweGZmXTsgfVxuZnVuY3Rpb24gdW5wYWNrVTMyKGJ5dGVzKSB7IHJldHVybiBhc191bnNpZ25lZChieXRlc1swXSA8PCAyNCB8IGJ5dGVzWzFdIDw8IDE2IHwgYnl0ZXNbMl0gPDwgOCB8IGJ5dGVzWzNdLCAzMik7IH1cblxuZnVuY3Rpb24gcGFja0lFRUU3NTQodiwgZWJpdHMsIGZiaXRzKSB7XG5cbiAgdmFyIGJpYXMgPSAoMSA8PCAoZWJpdHMgLSAxKSkgLSAxLFxuICAgICAgcywgZSwgZiwgbG4sXG4gICAgICBpLCBiaXRzLCBzdHIsIGJ5dGVzO1xuXG4gIGZ1bmN0aW9uIHJvdW5kVG9FdmVuKG4pIHtcbiAgICB2YXIgdyA9IGZsb29yKG4pLCBmID0gbiAtIHc7XG4gICAgaWYgKGYgPCAwLjUpXG4gICAgICByZXR1cm4gdztcbiAgICBpZiAoZiA+IDAuNSlcbiAgICAgIHJldHVybiB3ICsgMTtcbiAgICByZXR1cm4gdyAlIDIgPyB3ICsgMSA6IHc7XG4gIH1cblxuICAvLyBDb21wdXRlIHNpZ24sIGV4cG9uZW50LCBmcmFjdGlvblxuICBpZiAodiAhPT0gdikge1xuICAgIC8vIE5hTlxuICAgIC8vIGh0dHA6Ly9kZXYudzMub3JnLzIwMDYvd2ViYXBpL1dlYklETC8jZXMtdHlwZS1tYXBwaW5nXG4gICAgZSA9ICgxIDw8IGViaXRzKSAtIDE7IGYgPSBwb3coMiwgZmJpdHMgLSAxKTsgcyA9IDA7XG4gIH0gZWxzZSBpZiAodiA9PT0gSW5maW5pdHkgfHwgdiA9PT0gLUluZmluaXR5KSB7XG4gICAgZSA9ICgxIDw8IGViaXRzKSAtIDE7IGYgPSAwOyBzID0gKHYgPCAwKSA/IDEgOiAwO1xuICB9IGVsc2UgaWYgKHYgPT09IDApIHtcbiAgICBlID0gMDsgZiA9IDA7IHMgPSAoMSAvIHYgPT09IC1JbmZpbml0eSkgPyAxIDogMDtcbiAgfSBlbHNlIHtcbiAgICBzID0gdiA8IDA7XG4gICAgdiA9IGFicyh2KTtcblxuICAgIGlmICh2ID49IHBvdygyLCAxIC0gYmlhcykpIHtcbiAgICAgIGUgPSBtaW4oZmxvb3IobG9nKHYpIC8gTE4yKSwgMTAyMyk7XG4gICAgICBmID0gcm91bmRUb0V2ZW4odiAvIHBvdygyLCBlKSAqIHBvdygyLCBmYml0cykpO1xuICAgICAgaWYgKGYgLyBwb3coMiwgZmJpdHMpID49IDIpIHtcbiAgICAgICAgZSA9IGUgKyAxO1xuICAgICAgICBmID0gMTtcbiAgICAgIH1cbiAgICAgIGlmIChlID4gYmlhcykge1xuICAgICAgICAvLyBPdmVyZmxvd1xuICAgICAgICBlID0gKDEgPDwgZWJpdHMpIC0gMTtcbiAgICAgICAgZiA9IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBOb3JtYWxpemVkXG4gICAgICAgIGUgPSBlICsgYmlhcztcbiAgICAgICAgZiA9IGYgLSBwb3coMiwgZmJpdHMpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBEZW5vcm1hbGl6ZWRcbiAgICAgIGUgPSAwO1xuICAgICAgZiA9IHJvdW5kVG9FdmVuKHYgLyBwb3coMiwgMSAtIGJpYXMgLSBmYml0cykpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFBhY2sgc2lnbiwgZXhwb25lbnQsIGZyYWN0aW9uXG4gIGJpdHMgPSBbXTtcbiAgZm9yIChpID0gZmJpdHM7IGk7IGkgLT0gMSkgeyBiaXRzLnB1c2goZiAlIDIgPyAxIDogMCk7IGYgPSBmbG9vcihmIC8gMik7IH1cbiAgZm9yIChpID0gZWJpdHM7IGk7IGkgLT0gMSkgeyBiaXRzLnB1c2goZSAlIDIgPyAxIDogMCk7IGUgPSBmbG9vcihlIC8gMik7IH1cbiAgYml0cy5wdXNoKHMgPyAxIDogMCk7XG4gIGJpdHMucmV2ZXJzZSgpO1xuICBzdHIgPSBiaXRzLmpvaW4oJycpO1xuXG4gIC8vIEJpdHMgdG8gYnl0ZXNcbiAgYnl0ZXMgPSBbXTtcbiAgd2hpbGUgKHN0ci5sZW5ndGgpIHtcbiAgICBieXRlcy5wdXNoKHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoMCwgOCksIDIpKTtcbiAgICBzdHIgPSBzdHIuc3Vic3RyaW5nKDgpO1xuICB9XG4gIHJldHVybiBieXRlcztcbn1cblxuZnVuY3Rpb24gdW5wYWNrSUVFRTc1NChieXRlcywgZWJpdHMsIGZiaXRzKSB7XG5cbiAgLy8gQnl0ZXMgdG8gYml0c1xuICB2YXIgYml0cyA9IFtdLCBpLCBqLCBiLCBzdHIsXG4gICAgICBiaWFzLCBzLCBlLCBmO1xuXG4gIGZvciAoaSA9IGJ5dGVzLmxlbmd0aDsgaTsgaSAtPSAxKSB7XG4gICAgYiA9IGJ5dGVzW2kgLSAxXTtcbiAgICBmb3IgKGogPSA4OyBqOyBqIC09IDEpIHtcbiAgICAgIGJpdHMucHVzaChiICUgMiA/IDEgOiAwKTsgYiA9IGIgPj4gMTtcbiAgICB9XG4gIH1cbiAgYml0cy5yZXZlcnNlKCk7XG4gIHN0ciA9IGJpdHMuam9pbignJyk7XG5cbiAgLy8gVW5wYWNrIHNpZ24sIGV4cG9uZW50LCBmcmFjdGlvblxuICBiaWFzID0gKDEgPDwgKGViaXRzIC0gMSkpIC0gMTtcbiAgcyA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoMCwgMSksIDIpID8gLTEgOiAxO1xuICBlID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZygxLCAxICsgZWJpdHMpLCAyKTtcbiAgZiA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoMSArIGViaXRzKSwgMik7XG5cbiAgLy8gUHJvZHVjZSBudW1iZXJcbiAgaWYgKGUgPT09ICgxIDw8IGViaXRzKSAtIDEpIHtcbiAgICByZXR1cm4gZiAhPT0gMCA/IE5hTiA6IHMgKiBJbmZpbml0eTtcbiAgfSBlbHNlIGlmIChlID4gMCkge1xuICAgIC8vIE5vcm1hbGl6ZWRcbiAgICByZXR1cm4gcyAqIHBvdygyLCBlIC0gYmlhcykgKiAoMSArIGYgLyBwb3coMiwgZmJpdHMpKTtcbiAgfSBlbHNlIGlmIChmICE9PSAwKSB7XG4gICAgLy8gRGVub3JtYWxpemVkXG4gICAgcmV0dXJuIHMgKiBwb3coMiwgLShiaWFzIC0gMSkpICogKGYgLyBwb3coMiwgZmJpdHMpKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcyA8IDAgPyAtMCA6IDA7XG4gIH1cbn1cblxuZnVuY3Rpb24gdW5wYWNrRjY0KGIpIHsgcmV0dXJuIHVucGFja0lFRUU3NTQoYiwgMTEsIDUyKTsgfVxuZnVuY3Rpb24gcGFja0Y2NCh2KSB7IHJldHVybiBwYWNrSUVFRTc1NCh2LCAxMSwgNTIpOyB9XG5mdW5jdGlvbiB1bnBhY2tGMzIoYikgeyByZXR1cm4gdW5wYWNrSUVFRTc1NChiLCA4LCAyMyk7IH1cbmZ1bmN0aW9uIHBhY2tGMzIodikgeyByZXR1cm4gcGFja0lFRUU3NTQodiwgOCwgMjMpOyB9XG5cblxuLy9cbi8vIDMgVGhlIEFycmF5QnVmZmVyIFR5cGVcbi8vXG5cbihmdW5jdGlvbigpIHtcblxuICAvKiogQGNvbnN0cnVjdG9yICovXG4gIHZhciBBcnJheUJ1ZmZlciA9IGZ1bmN0aW9uIEFycmF5QnVmZmVyKGxlbmd0aCkge1xuICAgIGxlbmd0aCA9IEVDTUFTY3JpcHQuVG9JbnQzMihsZW5ndGgpO1xuICAgIGlmIChsZW5ndGggPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXJyYXlCdWZmZXIgc2l6ZSBpcyBub3QgYSBzbWFsbCBlbm91Z2ggcG9zaXRpdmUgaW50ZWdlcicpO1xuXG4gICAgdGhpcy5ieXRlTGVuZ3RoID0gbGVuZ3RoO1xuICAgIHRoaXMuX2J5dGVzID0gW107XG4gICAgdGhpcy5fYnl0ZXMubGVuZ3RoID0gbGVuZ3RoO1xuXG4gICAgdmFyIGk7XG4gICAgZm9yIChpID0gMDsgaSA8IHRoaXMuYnl0ZUxlbmd0aDsgaSArPSAxKSB7XG4gICAgICB0aGlzLl9ieXRlc1tpXSA9IDA7XG4gICAgfVxuXG4gICAgY29uZmlndXJlUHJvcGVydGllcyh0aGlzKTtcbiAgfTtcblxuICBleHBvcnRzLkFycmF5QnVmZmVyID0gZXhwb3J0cy5BcnJheUJ1ZmZlciB8fCBBcnJheUJ1ZmZlcjtcblxuICAvL1xuICAvLyA0IFRoZSBBcnJheUJ1ZmZlclZpZXcgVHlwZVxuICAvL1xuXG4gIC8vIE5PVEU6IHRoaXMgY29uc3RydWN0b3IgaXMgbm90IGV4cG9ydGVkXG4gIC8qKiBAY29uc3RydWN0b3IgKi9cbiAgdmFyIEFycmF5QnVmZmVyVmlldyA9IGZ1bmN0aW9uIEFycmF5QnVmZmVyVmlldygpIHtcbiAgICAvL3RoaXMuYnVmZmVyID0gbnVsbDtcbiAgICAvL3RoaXMuYnl0ZU9mZnNldCA9IDA7XG4gICAgLy90aGlzLmJ5dGVMZW5ndGggPSAwO1xuICB9O1xuXG4gIC8vXG4gIC8vIDUgVGhlIFR5cGVkIEFycmF5IFZpZXcgVHlwZXNcbiAgLy9cblxuICBmdW5jdGlvbiBtYWtlQ29uc3RydWN0b3IoYnl0ZXNQZXJFbGVtZW50LCBwYWNrLCB1bnBhY2spIHtcbiAgICAvLyBFYWNoIFR5cGVkQXJyYXkgdHlwZSByZXF1aXJlcyBhIGRpc3RpbmN0IGNvbnN0cnVjdG9yIGluc3RhbmNlIHdpdGhcbiAgICAvLyBpZGVudGljYWwgbG9naWMsIHdoaWNoIHRoaXMgcHJvZHVjZXMuXG5cbiAgICB2YXIgY3RvcjtcbiAgICBjdG9yID0gZnVuY3Rpb24oYnVmZmVyLCBieXRlT2Zmc2V0LCBsZW5ndGgpIHtcbiAgICAgIHZhciBhcnJheSwgc2VxdWVuY2UsIGksIHM7XG5cbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCB8fCB0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnbnVtYmVyJykge1xuICAgICAgICAvLyBDb25zdHJ1Y3Rvcih1bnNpZ25lZCBsb25nIGxlbmd0aClcbiAgICAgICAgdGhpcy5sZW5ndGggPSBFQ01BU2NyaXB0LlRvSW50MzIoYXJndW1lbnRzWzBdKTtcbiAgICAgICAgaWYgKGxlbmd0aCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdBcnJheUJ1ZmZlclZpZXcgc2l6ZSBpcyBub3QgYSBzbWFsbCBlbm91Z2ggcG9zaXRpdmUgaW50ZWdlcicpO1xuXG4gICAgICAgIHRoaXMuYnl0ZUxlbmd0aCA9IHRoaXMubGVuZ3RoICogdGhpcy5CWVRFU19QRVJfRUxFTUVOVDtcbiAgICAgICAgdGhpcy5idWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIodGhpcy5ieXRlTGVuZ3RoKTtcbiAgICAgICAgdGhpcy5ieXRlT2Zmc2V0ID0gMDtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gJ29iamVjdCcgJiYgYXJndW1lbnRzWzBdLmNvbnN0cnVjdG9yID09PSBjdG9yKSB7XG4gICAgICAgIC8vIENvbnN0cnVjdG9yKFR5cGVkQXJyYXkgYXJyYXkpXG4gICAgICAgIGFycmF5ID0gYXJndW1lbnRzWzBdO1xuXG4gICAgICAgIHRoaXMubGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICAgICAgICB0aGlzLmJ5dGVMZW5ndGggPSB0aGlzLmxlbmd0aCAqIHRoaXMuQllURVNfUEVSX0VMRU1FTlQ7XG4gICAgICAgIHRoaXMuYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKHRoaXMuYnl0ZUxlbmd0aCk7XG4gICAgICAgIHRoaXMuYnl0ZU9mZnNldCA9IDA7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICB0aGlzLl9zZXR0ZXIoaSwgYXJyYXkuX2dldHRlcihpKSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgICAgICAgICAgIShhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciB8fCBFQ01BU2NyaXB0LkNsYXNzKGFyZ3VtZW50c1swXSkgPT09ICdBcnJheUJ1ZmZlcicpKSB7XG4gICAgICAgIC8vIENvbnN0cnVjdG9yKHNlcXVlbmNlPHR5cGU+IGFycmF5KVxuICAgICAgICBzZXF1ZW5jZSA9IGFyZ3VtZW50c1swXTtcblxuICAgICAgICB0aGlzLmxlbmd0aCA9IEVDTUFTY3JpcHQuVG9VaW50MzIoc2VxdWVuY2UubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5ieXRlTGVuZ3RoID0gdGhpcy5sZW5ndGggKiB0aGlzLkJZVEVTX1BFUl9FTEVNRU5UO1xuICAgICAgICB0aGlzLmJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcih0aGlzLmJ5dGVMZW5ndGgpO1xuICAgICAgICB0aGlzLmJ5dGVPZmZzZXQgPSAwO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgcyA9IHNlcXVlbmNlW2ldO1xuICAgICAgICAgIHRoaXMuX3NldHRlcihpLCBOdW1iZXIocykpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdvYmplY3QnICYmXG4gICAgICAgICAgICAgICAgIChhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciB8fCBFQ01BU2NyaXB0LkNsYXNzKGFyZ3VtZW50c1swXSkgPT09ICdBcnJheUJ1ZmZlcicpKSB7XG4gICAgICAgIC8vIENvbnN0cnVjdG9yKEFycmF5QnVmZmVyIGJ1ZmZlcixcbiAgICAgICAgLy8gICAgICAgICAgICAgb3B0aW9uYWwgdW5zaWduZWQgbG9uZyBieXRlT2Zmc2V0LCBvcHRpb25hbCB1bnNpZ25lZCBsb25nIGxlbmd0aClcbiAgICAgICAgdGhpcy5idWZmZXIgPSBidWZmZXI7XG5cbiAgICAgICAgdGhpcy5ieXRlT2Zmc2V0ID0gRUNNQVNjcmlwdC5Ub1VpbnQzMihieXRlT2Zmc2V0KTtcbiAgICAgICAgaWYgKHRoaXMuYnl0ZU9mZnNldCA+IHRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcImJ5dGVPZmZzZXQgb3V0IG9mIHJhbmdlXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuYnl0ZU9mZnNldCAlIHRoaXMuQllURVNfUEVSX0VMRU1FTlQpIHtcbiAgICAgICAgICAvLyBUaGUgZ2l2ZW4gYnl0ZU9mZnNldCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgdGhlIGVsZW1lbnRcbiAgICAgICAgICAvLyBzaXplIG9mIHRoZSBzcGVjaWZpYyB0eXBlLCBvdGhlcndpc2UgYW4gZXhjZXB0aW9uIGlzIHJhaXNlZC5cbiAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcIkFycmF5QnVmZmVyIGxlbmd0aCBtaW51cyB0aGUgYnl0ZU9mZnNldCBpcyBub3QgYSBtdWx0aXBsZSBvZiB0aGUgZWxlbWVudCBzaXplLlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykge1xuICAgICAgICAgIHRoaXMuYnl0ZUxlbmd0aCA9IHRoaXMuYnVmZmVyLmJ5dGVMZW5ndGggLSB0aGlzLmJ5dGVPZmZzZXQ7XG5cbiAgICAgICAgICBpZiAodGhpcy5ieXRlTGVuZ3RoICUgdGhpcy5CWVRFU19QRVJfRUxFTUVOVCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJsZW5ndGggb2YgYnVmZmVyIG1pbnVzIGJ5dGVPZmZzZXQgbm90IGEgbXVsdGlwbGUgb2YgdGhlIGVsZW1lbnQgc2l6ZVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5sZW5ndGggPSB0aGlzLmJ5dGVMZW5ndGggLyB0aGlzLkJZVEVTX1BFUl9FTEVNRU5UO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMubGVuZ3RoID0gRUNNQVNjcmlwdC5Ub1VpbnQzMihsZW5ndGgpO1xuICAgICAgICAgIHRoaXMuYnl0ZUxlbmd0aCA9IHRoaXMubGVuZ3RoICogdGhpcy5CWVRFU19QRVJfRUxFTUVOVDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgodGhpcy5ieXRlT2Zmc2V0ICsgdGhpcy5ieXRlTGVuZ3RoKSA+IHRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcImJ5dGVPZmZzZXQgYW5kIGxlbmd0aCByZWZlcmVuY2UgYW4gYXJlYSBiZXlvbmQgdGhlIGVuZCBvZiB0aGUgYnVmZmVyXCIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVW5leHBlY3RlZCBhcmd1bWVudCB0eXBlKHMpXCIpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNvbnN0cnVjdG9yID0gY3RvcjtcblxuICAgICAgY29uZmlndXJlUHJvcGVydGllcyh0aGlzKTtcbiAgICAgIG1ha2VBcnJheUFjY2Vzc29ycyh0aGlzKTtcbiAgICB9O1xuXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgQXJyYXlCdWZmZXJWaWV3KCk7XG4gICAgY3Rvci5wcm90b3R5cGUuQllURVNfUEVSX0VMRU1FTlQgPSBieXRlc1BlckVsZW1lbnQ7XG4gICAgY3Rvci5wcm90b3R5cGUuX3BhY2sgPSBwYWNrO1xuICAgIGN0b3IucHJvdG90eXBlLl91bnBhY2sgPSB1bnBhY2s7XG4gICAgY3Rvci5CWVRFU19QRVJfRUxFTUVOVCA9IGJ5dGVzUGVyRWxlbWVudDtcblxuICAgIC8vIGdldHRlciB0eXBlICh1bnNpZ25lZCBsb25nIGluZGV4KTtcbiAgICBjdG9yLnByb3RvdHlwZS5fZ2V0dGVyID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMSkgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiTm90IGVub3VnaCBhcmd1bWVudHNcIik7XG5cbiAgICAgIGluZGV4ID0gRUNNQVNjcmlwdC5Ub1VpbnQzMihpbmRleCk7XG4gICAgICBpZiAoaW5kZXggPj0gdGhpcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgdmFyIGJ5dGVzID0gW10sIGksIG87XG4gICAgICBmb3IgKGkgPSAwLCBvID0gdGhpcy5ieXRlT2Zmc2V0ICsgaW5kZXggKiB0aGlzLkJZVEVTX1BFUl9FTEVNRU5UO1xuICAgICAgICAgICBpIDwgdGhpcy5CWVRFU19QRVJfRUxFTUVOVDtcbiAgICAgICAgICAgaSArPSAxLCBvICs9IDEpIHtcbiAgICAgICAgYnl0ZXMucHVzaCh0aGlzLmJ1ZmZlci5fYnl0ZXNbb10pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuX3VucGFjayhieXRlcyk7XG4gICAgfTtcblxuICAgIC8vIE5PTlNUQU5EQVJEOiBjb252ZW5pZW5jZSBhbGlhcyBmb3IgZ2V0dGVyOiB0eXBlIGdldCh1bnNpZ25lZCBsb25nIGluZGV4KTtcbiAgICBjdG9yLnByb3RvdHlwZS5nZXQgPSBjdG9yLnByb3RvdHlwZS5fZ2V0dGVyO1xuXG4gICAgLy8gc2V0dGVyIHZvaWQgKHVuc2lnbmVkIGxvbmcgaW5kZXgsIHR5cGUgdmFsdWUpO1xuICAgIGN0b3IucHJvdG90eXBlLl9zZXR0ZXIgPSBmdW5jdGlvbihpbmRleCwgdmFsdWUpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiTm90IGVub3VnaCBhcmd1bWVudHNcIik7XG5cbiAgICAgIGluZGV4ID0gRUNNQVNjcmlwdC5Ub1VpbnQzMihpbmRleCk7XG4gICAgICBpZiAoaW5kZXggPj0gdGhpcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgdmFyIGJ5dGVzID0gdGhpcy5fcGFjayh2YWx1ZSksIGksIG87XG4gICAgICBmb3IgKGkgPSAwLCBvID0gdGhpcy5ieXRlT2Zmc2V0ICsgaW5kZXggKiB0aGlzLkJZVEVTX1BFUl9FTEVNRU5UO1xuICAgICAgICAgICBpIDwgdGhpcy5CWVRFU19QRVJfRUxFTUVOVDtcbiAgICAgICAgICAgaSArPSAxLCBvICs9IDEpIHtcbiAgICAgICAgdGhpcy5idWZmZXIuX2J5dGVzW29dID0gYnl0ZXNbaV07XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIHZvaWQgc2V0KFR5cGVkQXJyYXkgYXJyYXksIG9wdGlvbmFsIHVuc2lnbmVkIGxvbmcgb2Zmc2V0KTtcbiAgICAvLyB2b2lkIHNldChzZXF1ZW5jZTx0eXBlPiBhcnJheSwgb3B0aW9uYWwgdW5zaWduZWQgbG9uZyBvZmZzZXQpO1xuICAgIGN0b3IucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKGluZGV4LCB2YWx1ZSkge1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAxKSB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJOb3QgZW5vdWdoIGFyZ3VtZW50c1wiKTtcbiAgICAgIHZhciBhcnJheSwgc2VxdWVuY2UsIG9mZnNldCwgbGVuLFxuICAgICAgICAgIGksIHMsIGQsXG4gICAgICAgICAgYnl0ZU9mZnNldCwgYnl0ZUxlbmd0aCwgdG1wO1xuXG4gICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gJ29iamVjdCcgJiYgYXJndW1lbnRzWzBdLmNvbnN0cnVjdG9yID09PSB0aGlzLmNvbnN0cnVjdG9yKSB7XG4gICAgICAgIC8vIHZvaWQgc2V0KFR5cGVkQXJyYXkgYXJyYXksIG9wdGlvbmFsIHVuc2lnbmVkIGxvbmcgb2Zmc2V0KTtcbiAgICAgICAgYXJyYXkgPSBhcmd1bWVudHNbMF07XG4gICAgICAgIG9mZnNldCA9IEVDTUFTY3JpcHQuVG9VaW50MzIoYXJndW1lbnRzWzFdKTtcblxuICAgICAgICBpZiAob2Zmc2V0ICsgYXJyYXkubGVuZ3RoID4gdGhpcy5sZW5ndGgpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcIk9mZnNldCBwbHVzIGxlbmd0aCBvZiBhcnJheSBpcyBvdXQgb2YgcmFuZ2VcIik7XG4gICAgICAgIH1cblxuICAgICAgICBieXRlT2Zmc2V0ID0gdGhpcy5ieXRlT2Zmc2V0ICsgb2Zmc2V0ICogdGhpcy5CWVRFU19QRVJfRUxFTUVOVDtcbiAgICAgICAgYnl0ZUxlbmd0aCA9IGFycmF5Lmxlbmd0aCAqIHRoaXMuQllURVNfUEVSX0VMRU1FTlQ7XG5cbiAgICAgICAgaWYgKGFycmF5LmJ1ZmZlciA9PT0gdGhpcy5idWZmZXIpIHtcbiAgICAgICAgICB0bXAgPSBbXTtcbiAgICAgICAgICBmb3IgKGkgPSAwLCBzID0gYXJyYXkuYnl0ZU9mZnNldDsgaSA8IGJ5dGVMZW5ndGg7IGkgKz0gMSwgcyArPSAxKSB7XG4gICAgICAgICAgICB0bXBbaV0gPSBhcnJheS5idWZmZXIuX2J5dGVzW3NdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBmb3IgKGkgPSAwLCBkID0gYnl0ZU9mZnNldDsgaSA8IGJ5dGVMZW5ndGg7IGkgKz0gMSwgZCArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmJ1ZmZlci5fYnl0ZXNbZF0gPSB0bXBbaV07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvciAoaSA9IDAsIHMgPSBhcnJheS5ieXRlT2Zmc2V0LCBkID0gYnl0ZU9mZnNldDtcbiAgICAgICAgICAgICAgIGkgPCBieXRlTGVuZ3RoOyBpICs9IDEsIHMgKz0gMSwgZCArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmJ1ZmZlci5fYnl0ZXNbZF0gPSBhcnJheS5idWZmZXIuX2J5dGVzW3NdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgYXJndW1lbnRzWzBdLmxlbmd0aCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy8gdm9pZCBzZXQoc2VxdWVuY2U8dHlwZT4gYXJyYXksIG9wdGlvbmFsIHVuc2lnbmVkIGxvbmcgb2Zmc2V0KTtcbiAgICAgICAgc2VxdWVuY2UgPSBhcmd1bWVudHNbMF07XG4gICAgICAgIGxlbiA9IEVDTUFTY3JpcHQuVG9VaW50MzIoc2VxdWVuY2UubGVuZ3RoKTtcbiAgICAgICAgb2Zmc2V0ID0gRUNNQVNjcmlwdC5Ub1VpbnQzMihhcmd1bWVudHNbMV0pO1xuXG4gICAgICAgIGlmIChvZmZzZXQgKyBsZW4gPiB0aGlzLmxlbmd0aCkge1xuICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwiT2Zmc2V0IHBsdXMgbGVuZ3RoIG9mIGFycmF5IGlzIG91dCBvZiByYW5nZVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICAgIHMgPSBzZXF1ZW5jZVtpXTtcbiAgICAgICAgICB0aGlzLl9zZXR0ZXIob2Zmc2V0ICsgaSwgTnVtYmVyKHMpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlVuZXhwZWN0ZWQgYXJndW1lbnQgdHlwZShzKVwiKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gVHlwZWRBcnJheSBzdWJhcnJheShsb25nIGJlZ2luLCBvcHRpb25hbCBsb25nIGVuZCk7XG4gICAgY3Rvci5wcm90b3R5cGUuc3ViYXJyYXkgPSBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgICBmdW5jdGlvbiBjbGFtcCh2LCBtaW4sIG1heCkgeyByZXR1cm4gdiA8IG1pbiA/IG1pbiA6IHYgPiBtYXggPyBtYXggOiB2OyB9XG5cbiAgICAgIHN0YXJ0ID0gRUNNQVNjcmlwdC5Ub0ludDMyKHN0YXJ0KTtcbiAgICAgIGVuZCA9IEVDTUFTY3JpcHQuVG9JbnQzMihlbmQpO1xuXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDEpIHsgc3RhcnQgPSAwOyB9XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHsgZW5kID0gdGhpcy5sZW5ndGg7IH1cblxuICAgICAgaWYgKHN0YXJ0IDwgMCkgeyBzdGFydCA9IHRoaXMubGVuZ3RoICsgc3RhcnQ7IH1cbiAgICAgIGlmIChlbmQgPCAwKSB7IGVuZCA9IHRoaXMubGVuZ3RoICsgZW5kOyB9XG5cbiAgICAgIHN0YXJ0ID0gY2xhbXAoc3RhcnQsIDAsIHRoaXMubGVuZ3RoKTtcbiAgICAgIGVuZCA9IGNsYW1wKGVuZCwgMCwgdGhpcy5sZW5ndGgpO1xuXG4gICAgICB2YXIgbGVuID0gZW5kIC0gc3RhcnQ7XG4gICAgICBpZiAobGVuIDwgMCkge1xuICAgICAgICBsZW4gPSAwO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IoXG4gICAgICAgIHRoaXMuYnVmZmVyLCB0aGlzLmJ5dGVPZmZzZXQgKyBzdGFydCAqIHRoaXMuQllURVNfUEVSX0VMRU1FTlQsIGxlbik7XG4gICAgfTtcblxuICAgIHJldHVybiBjdG9yO1xuICB9XG5cbiAgdmFyIEludDhBcnJheSA9IG1ha2VDb25zdHJ1Y3RvcigxLCBwYWNrSTgsIHVucGFja0k4KTtcbiAgdmFyIFVpbnQ4QXJyYXkgPSBtYWtlQ29uc3RydWN0b3IoMSwgcGFja1U4LCB1bnBhY2tVOCk7XG4gIHZhciBVaW50OENsYW1wZWRBcnJheSA9IG1ha2VDb25zdHJ1Y3RvcigxLCBwYWNrVThDbGFtcGVkLCB1bnBhY2tVOCk7XG4gIHZhciBJbnQxNkFycmF5ID0gbWFrZUNvbnN0cnVjdG9yKDIsIHBhY2tJMTYsIHVucGFja0kxNik7XG4gIHZhciBVaW50MTZBcnJheSA9IG1ha2VDb25zdHJ1Y3RvcigyLCBwYWNrVTE2LCB1bnBhY2tVMTYpO1xuICB2YXIgSW50MzJBcnJheSA9IG1ha2VDb25zdHJ1Y3Rvcig0LCBwYWNrSTMyLCB1bnBhY2tJMzIpO1xuICB2YXIgVWludDMyQXJyYXkgPSBtYWtlQ29uc3RydWN0b3IoNCwgcGFja1UzMiwgdW5wYWNrVTMyKTtcbiAgdmFyIEZsb2F0MzJBcnJheSA9IG1ha2VDb25zdHJ1Y3Rvcig0LCBwYWNrRjMyLCB1bnBhY2tGMzIpO1xuICB2YXIgRmxvYXQ2NEFycmF5ID0gbWFrZUNvbnN0cnVjdG9yKDgsIHBhY2tGNjQsIHVucGFja0Y2NCk7XG5cbiAgZXhwb3J0cy5JbnQ4QXJyYXkgPSBleHBvcnRzLkludDhBcnJheSB8fCBJbnQ4QXJyYXk7XG4gIGV4cG9ydHMuVWludDhBcnJheSA9IGV4cG9ydHMuVWludDhBcnJheSB8fCBVaW50OEFycmF5O1xuICBleHBvcnRzLlVpbnQ4Q2xhbXBlZEFycmF5ID0gZXhwb3J0cy5VaW50OENsYW1wZWRBcnJheSB8fCBVaW50OENsYW1wZWRBcnJheTtcbiAgZXhwb3J0cy5JbnQxNkFycmF5ID0gZXhwb3J0cy5JbnQxNkFycmF5IHx8IEludDE2QXJyYXk7XG4gIGV4cG9ydHMuVWludDE2QXJyYXkgPSBleHBvcnRzLlVpbnQxNkFycmF5IHx8IFVpbnQxNkFycmF5O1xuICBleHBvcnRzLkludDMyQXJyYXkgPSBleHBvcnRzLkludDMyQXJyYXkgfHwgSW50MzJBcnJheTtcbiAgZXhwb3J0cy5VaW50MzJBcnJheSA9IGV4cG9ydHMuVWludDMyQXJyYXkgfHwgVWludDMyQXJyYXk7XG4gIGV4cG9ydHMuRmxvYXQzMkFycmF5ID0gZXhwb3J0cy5GbG9hdDMyQXJyYXkgfHwgRmxvYXQzMkFycmF5O1xuICBleHBvcnRzLkZsb2F0NjRBcnJheSA9IGV4cG9ydHMuRmxvYXQ2NEFycmF5IHx8IEZsb2F0NjRBcnJheTtcbn0oKSk7XG5cbi8vXG4vLyA2IFRoZSBEYXRhVmlldyBWaWV3IFR5cGVcbi8vXG5cbihmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gcihhcnJheSwgaW5kZXgpIHtcbiAgICByZXR1cm4gRUNNQVNjcmlwdC5Jc0NhbGxhYmxlKGFycmF5LmdldCkgPyBhcnJheS5nZXQoaW5kZXgpIDogYXJyYXlbaW5kZXhdO1xuICB9XG5cbiAgdmFyIElTX0JJR19FTkRJQU4gPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHUxNmFycmF5ID0gbmV3KGV4cG9ydHMuVWludDE2QXJyYXkpKFsweDEyMzRdKSxcbiAgICAgICAgdThhcnJheSA9IG5ldyhleHBvcnRzLlVpbnQ4QXJyYXkpKHUxNmFycmF5LmJ1ZmZlcik7XG4gICAgcmV0dXJuIHIodThhcnJheSwgMCkgPT09IDB4MTI7XG4gIH0oKSk7XG5cbiAgLy8gQ29uc3RydWN0b3IoQXJyYXlCdWZmZXIgYnVmZmVyLFxuICAvLyAgICAgICAgICAgICBvcHRpb25hbCB1bnNpZ25lZCBsb25nIGJ5dGVPZmZzZXQsXG4gIC8vICAgICAgICAgICAgIG9wdGlvbmFsIHVuc2lnbmVkIGxvbmcgYnl0ZUxlbmd0aClcbiAgLyoqIEBjb25zdHJ1Y3RvciAqL1xuICB2YXIgRGF0YVZpZXcgPSBmdW5jdGlvbiBEYXRhVmlldyhidWZmZXIsIGJ5dGVPZmZzZXQsIGJ5dGVMZW5ndGgpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDApO1xuICAgIH0gZWxzZSBpZiAoIShidWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciB8fCBFQ01BU2NyaXB0LkNsYXNzKGJ1ZmZlcikgPT09ICdBcnJheUJ1ZmZlcicpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVHlwZUVycm9yXCIpO1xuICAgIH1cblxuICAgIHRoaXMuYnVmZmVyID0gYnVmZmVyIHx8IG5ldyBBcnJheUJ1ZmZlcigwKTtcblxuICAgIHRoaXMuYnl0ZU9mZnNldCA9IEVDTUFTY3JpcHQuVG9VaW50MzIoYnl0ZU9mZnNldCk7XG4gICAgaWYgKHRoaXMuYnl0ZU9mZnNldCA+IHRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwiYnl0ZU9mZnNldCBvdXQgb2YgcmFuZ2VcIik7XG4gICAgfVxuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSB7XG4gICAgICB0aGlzLmJ5dGVMZW5ndGggPSB0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoIC0gdGhpcy5ieXRlT2Zmc2V0O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJ5dGVMZW5ndGggPSBFQ01BU2NyaXB0LlRvVWludDMyKGJ5dGVMZW5ndGgpO1xuICAgIH1cblxuICAgIGlmICgodGhpcy5ieXRlT2Zmc2V0ICsgdGhpcy5ieXRlTGVuZ3RoKSA+IHRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwiYnl0ZU9mZnNldCBhbmQgbGVuZ3RoIHJlZmVyZW5jZSBhbiBhcmVhIGJleW9uZCB0aGUgZW5kIG9mIHRoZSBidWZmZXJcIik7XG4gICAgfVxuXG4gICAgY29uZmlndXJlUHJvcGVydGllcyh0aGlzKTtcbiAgfTtcblxuICBmdW5jdGlvbiBtYWtlR2V0dGVyKGFycmF5VHlwZSkge1xuICAgIHJldHVybiBmdW5jdGlvbihieXRlT2Zmc2V0LCBsaXR0bGVFbmRpYW4pIHtcblxuICAgICAgYnl0ZU9mZnNldCA9IEVDTUFTY3JpcHQuVG9VaW50MzIoYnl0ZU9mZnNldCk7XG5cbiAgICAgIGlmIChieXRlT2Zmc2V0ICsgYXJyYXlUeXBlLkJZVEVTX1BFUl9FTEVNRU5UID4gdGhpcy5ieXRlTGVuZ3RoKSB7XG4gICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwiQXJyYXkgaW5kZXggb3V0IG9mIHJhbmdlXCIpO1xuICAgICAgfVxuICAgICAgYnl0ZU9mZnNldCArPSB0aGlzLmJ5dGVPZmZzZXQ7XG5cbiAgICAgIHZhciB1aW50OEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5idWZmZXIsIGJ5dGVPZmZzZXQsIGFycmF5VHlwZS5CWVRFU19QRVJfRUxFTUVOVCksXG4gICAgICAgICAgYnl0ZXMgPSBbXSwgaTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBhcnJheVR5cGUuQllURVNfUEVSX0VMRU1FTlQ7IGkgKz0gMSkge1xuICAgICAgICBieXRlcy5wdXNoKHIodWludDhBcnJheSwgaSkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoQm9vbGVhbihsaXR0bGVFbmRpYW4pID09PSBCb29sZWFuKElTX0JJR19FTkRJQU4pKSB7XG4gICAgICAgIGJ5dGVzLnJldmVyc2UoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHIobmV3IGFycmF5VHlwZShuZXcgVWludDhBcnJheShieXRlcykuYnVmZmVyKSwgMCk7XG4gICAgfTtcbiAgfVxuXG4gIERhdGFWaWV3LnByb3RvdHlwZS5nZXRVaW50OCA9IG1ha2VHZXR0ZXIoZXhwb3J0cy5VaW50OEFycmF5KTtcbiAgRGF0YVZpZXcucHJvdG90eXBlLmdldEludDggPSBtYWtlR2V0dGVyKGV4cG9ydHMuSW50OEFycmF5KTtcbiAgRGF0YVZpZXcucHJvdG90eXBlLmdldFVpbnQxNiA9IG1ha2VHZXR0ZXIoZXhwb3J0cy5VaW50MTZBcnJheSk7XG4gIERhdGFWaWV3LnByb3RvdHlwZS5nZXRJbnQxNiA9IG1ha2VHZXR0ZXIoZXhwb3J0cy5JbnQxNkFycmF5KTtcbiAgRGF0YVZpZXcucHJvdG90eXBlLmdldFVpbnQzMiA9IG1ha2VHZXR0ZXIoZXhwb3J0cy5VaW50MzJBcnJheSk7XG4gIERhdGFWaWV3LnByb3RvdHlwZS5nZXRJbnQzMiA9IG1ha2VHZXR0ZXIoZXhwb3J0cy5JbnQzMkFycmF5KTtcbiAgRGF0YVZpZXcucHJvdG90eXBlLmdldEZsb2F0MzIgPSBtYWtlR2V0dGVyKGV4cG9ydHMuRmxvYXQzMkFycmF5KTtcbiAgRGF0YVZpZXcucHJvdG90eXBlLmdldEZsb2F0NjQgPSBtYWtlR2V0dGVyKGV4cG9ydHMuRmxvYXQ2NEFycmF5KTtcblxuICBmdW5jdGlvbiBtYWtlU2V0dGVyKGFycmF5VHlwZSkge1xuICAgIHJldHVybiBmdW5jdGlvbihieXRlT2Zmc2V0LCB2YWx1ZSwgbGl0dGxlRW5kaWFuKSB7XG5cbiAgICAgIGJ5dGVPZmZzZXQgPSBFQ01BU2NyaXB0LlRvVWludDMyKGJ5dGVPZmZzZXQpO1xuICAgICAgaWYgKGJ5dGVPZmZzZXQgKyBhcnJheVR5cGUuQllURVNfUEVSX0VMRU1FTlQgPiB0aGlzLmJ5dGVMZW5ndGgpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJBcnJheSBpbmRleCBvdXQgb2YgcmFuZ2VcIik7XG4gICAgICB9XG5cbiAgICAgIC8vIEdldCBieXRlc1xuICAgICAgdmFyIHR5cGVBcnJheSA9IG5ldyBhcnJheVR5cGUoW3ZhbHVlXSksXG4gICAgICAgICAgYnl0ZUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkodHlwZUFycmF5LmJ1ZmZlciksXG4gICAgICAgICAgYnl0ZXMgPSBbXSwgaSwgYnl0ZVZpZXc7XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBhcnJheVR5cGUuQllURVNfUEVSX0VMRU1FTlQ7IGkgKz0gMSkge1xuICAgICAgICBieXRlcy5wdXNoKHIoYnl0ZUFycmF5LCBpKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIEZsaXAgaWYgbmVjZXNzYXJ5XG4gICAgICBpZiAoQm9vbGVhbihsaXR0bGVFbmRpYW4pID09PSBCb29sZWFuKElTX0JJR19FTkRJQU4pKSB7XG4gICAgICAgIGJ5dGVzLnJldmVyc2UoKTtcbiAgICAgIH1cblxuICAgICAgLy8gV3JpdGUgdGhlbVxuICAgICAgYnl0ZVZpZXcgPSBuZXcgVWludDhBcnJheSh0aGlzLmJ1ZmZlciwgYnl0ZU9mZnNldCwgYXJyYXlUeXBlLkJZVEVTX1BFUl9FTEVNRU5UKTtcbiAgICAgIGJ5dGVWaWV3LnNldChieXRlcyk7XG4gICAgfTtcbiAgfVxuXG4gIERhdGFWaWV3LnByb3RvdHlwZS5zZXRVaW50OCA9IG1ha2VTZXR0ZXIoZXhwb3J0cy5VaW50OEFycmF5KTtcbiAgRGF0YVZpZXcucHJvdG90eXBlLnNldEludDggPSBtYWtlU2V0dGVyKGV4cG9ydHMuSW50OEFycmF5KTtcbiAgRGF0YVZpZXcucHJvdG90eXBlLnNldFVpbnQxNiA9IG1ha2VTZXR0ZXIoZXhwb3J0cy5VaW50MTZBcnJheSk7XG4gIERhdGFWaWV3LnByb3RvdHlwZS5zZXRJbnQxNiA9IG1ha2VTZXR0ZXIoZXhwb3J0cy5JbnQxNkFycmF5KTtcbiAgRGF0YVZpZXcucHJvdG90eXBlLnNldFVpbnQzMiA9IG1ha2VTZXR0ZXIoZXhwb3J0cy5VaW50MzJBcnJheSk7XG4gIERhdGFWaWV3LnByb3RvdHlwZS5zZXRJbnQzMiA9IG1ha2VTZXR0ZXIoZXhwb3J0cy5JbnQzMkFycmF5KTtcbiAgRGF0YVZpZXcucHJvdG90eXBlLnNldEZsb2F0MzIgPSBtYWtlU2V0dGVyKGV4cG9ydHMuRmxvYXQzMkFycmF5KTtcbiAgRGF0YVZpZXcucHJvdG90eXBlLnNldEZsb2F0NjQgPSBtYWtlU2V0dGVyKGV4cG9ydHMuRmxvYXQ2NEFycmF5KTtcblxuICBleHBvcnRzLkRhdGFWaWV3ID0gZXhwb3J0cy5EYXRhVmlldyB8fCBEYXRhVmlldztcblxufSgpKTtcblxufSx7fV19LHt9LFtdKVxuOzttb2R1bGUuZXhwb3J0cz1yZXF1aXJlKFwibmF0aXZlLWJ1ZmZlci1icm93c2VyaWZ5XCIpLkJ1ZmZlclxuIiwiLypqc2hpbnQgbm9kZTp0cnVlICovXG4vKipcbiAqIEBmaWxlT3ZlcnZpZXdcbiAqIGNvcHkgRGVjbGFyYXRpb24gRmlsZVxuICpcbiAqIEBhdXRob3IgU2hhbm5vbiBNb2VsbGVyXG4gKiBAdmVyc2lvbiAxLjBcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQ29waWVzIHRoZSBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2Ygb25lIG9yIG1vcmUgb2JqZWN0cyB0byBhIHRhcmdldCBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHRhcmdldCBUYXJnZXQgb2JqZWN0LlxuICogQHBhcmFtIHsuLi5PYmplY3R9IG9ianMgT2JqZWN0cyB3aXRoIHByb3BlcnRpZXMgdG8gY29weS5cbiAqIEByZXR1cm4ge09iamVjdH0gVGFyZ2V0IG9iamVjdCwgYXVnbWVudGVkLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvcHkodGFyZ2V0KSB7XG4gICAgdmFyIGFyZywgaSwga2V5LCBsZW47XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICBmb3IgKGkgPSAxLCBsZW4gPSBhcmdzLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgIGFyZyA9IGFyZ3NbaV07XG5cbiAgICAgICAgZm9yIChrZXkgaW4gYXJnKSB7XG4gICAgICAgICAgICBpZiAoYXJnLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IGFyZ1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldDtcbn07XG4iLCJ2YXIgQnVmZmVyPXJlcXVpcmUoXCJfX2Jyb3dzZXJpZnlfQnVmZmVyXCIpO1xuKGZ1bmN0aW9uIChnbG9iYWwsIG1vZHVsZSkge1xuXG4gIGlmICgndW5kZWZpbmVkJyA9PSB0eXBlb2YgbW9kdWxlKSB7XG4gICAgdmFyIG1vZHVsZSA9IHsgZXhwb3J0czoge30gfVxuICAgICAgLCBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHNcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHBvcnRzLlxuICAgKi9cblxuICBtb2R1bGUuZXhwb3J0cyA9IGV4cGVjdDtcbiAgZXhwZWN0LkFzc2VydGlvbiA9IEFzc2VydGlvbjtcblxuICAvKipcbiAgICogRXhwb3J0cyB2ZXJzaW9uLlxuICAgKi9cblxuICBleHBlY3QudmVyc2lvbiA9ICcwLjEuMic7XG5cbiAgLyoqXG4gICAqIFBvc3NpYmxlIGFzc2VydGlvbiBmbGFncy5cbiAgICovXG5cbiAgdmFyIGZsYWdzID0ge1xuICAgICAgbm90OiBbJ3RvJywgJ2JlJywgJ2hhdmUnLCAnaW5jbHVkZScsICdvbmx5J11cbiAgICAsIHRvOiBbJ2JlJywgJ2hhdmUnLCAnaW5jbHVkZScsICdvbmx5JywgJ25vdCddXG4gICAgLCBvbmx5OiBbJ2hhdmUnXVxuICAgICwgaGF2ZTogWydvd24nXVxuICAgICwgYmU6IFsnYW4nXVxuICB9O1xuXG4gIGZ1bmN0aW9uIGV4cGVjdCAob2JqKSB7XG4gICAgcmV0dXJuIG5ldyBBc3NlcnRpb24ob2JqKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvclxuICAgKlxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgZnVuY3Rpb24gQXNzZXJ0aW9uIChvYmosIGZsYWcsIHBhcmVudCkge1xuICAgIHRoaXMub2JqID0gb2JqO1xuICAgIHRoaXMuZmxhZ3MgPSB7fTtcblxuICAgIGlmICh1bmRlZmluZWQgIT0gcGFyZW50KSB7XG4gICAgICB0aGlzLmZsYWdzW2ZsYWddID0gdHJ1ZTtcblxuICAgICAgZm9yICh2YXIgaSBpbiBwYXJlbnQuZmxhZ3MpIHtcbiAgICAgICAgaWYgKHBhcmVudC5mbGFncy5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgIHRoaXMuZmxhZ3NbaV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyICRmbGFncyA9IGZsYWcgPyBmbGFnc1tmbGFnXSA6IGtleXMoZmxhZ3MpXG4gICAgICAsIHNlbGYgPSB0aGlzXG5cbiAgICBpZiAoJGZsYWdzKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9ICRmbGFncy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgLy8gYXZvaWQgcmVjdXJzaW9uXG4gICAgICAgIGlmICh0aGlzLmZsYWdzWyRmbGFnc1tpXV0pIGNvbnRpbnVlO1xuXG4gICAgICAgIHZhciBuYW1lID0gJGZsYWdzW2ldXG4gICAgICAgICAgLCBhc3NlcnRpb24gPSBuZXcgQXNzZXJ0aW9uKHRoaXMub2JqLCBuYW1lLCB0aGlzKVxuXG4gICAgICAgIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBBc3NlcnRpb24ucHJvdG90eXBlW25hbWVdKSB7XG4gICAgICAgICAgLy8gY2xvbmUgdGhlIGZ1bmN0aW9uLCBtYWtlIHN1cmUgd2UgZG9udCB0b3VjaCB0aGUgcHJvdCByZWZlcmVuY2VcbiAgICAgICAgICB2YXIgb2xkID0gdGhpc1tuYW1lXTtcbiAgICAgICAgICB0aGlzW25hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG9sZC5hcHBseShzZWxmLCBhcmd1bWVudHMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZvciAodmFyIGZuIGluIEFzc2VydGlvbi5wcm90b3R5cGUpIHtcbiAgICAgICAgICAgIGlmIChBc3NlcnRpb24ucHJvdG90eXBlLmhhc093blByb3BlcnR5KGZuKSAmJiBmbiAhPSBuYW1lKSB7XG4gICAgICAgICAgICAgIHRoaXNbbmFtZV1bZm5dID0gYmluZChhc3NlcnRpb25bZm5dLCBhc3NlcnRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzW25hbWVdID0gYXNzZXJ0aW9uO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyBhbiBhc3NlcnRpb25cbiAgICpcbiAgICogQGFwaSBwcml2YXRlXG4gICAqL1xuXG4gIEFzc2VydGlvbi5wcm90b3R5cGUuYXNzZXJ0ID0gZnVuY3Rpb24gKHRydXRoLCBtc2csIGVycm9yKSB7XG4gICAgdmFyIG1zZyA9IHRoaXMuZmxhZ3Mubm90ID8gZXJyb3IgOiBtc2dcbiAgICAgICwgb2sgPSB0aGlzLmZsYWdzLm5vdCA/ICF0cnV0aCA6IHRydXRoO1xuXG4gICAgaWYgKCFvaykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZy5jYWxsKHRoaXMpKTtcbiAgICB9XG5cbiAgICB0aGlzLmFuZCA9IG5ldyBBc3NlcnRpb24odGhpcy5vYmopO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgdmFsdWUgaXMgdHJ1dGh5XG4gICAqXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIEFzc2VydGlvbi5wcm90b3R5cGUub2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5hc3NlcnQoXG4gICAgICAgICEhdGhpcy5vYmpcbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIGJlIHRydXRoeScgfVxuICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gYmUgZmFsc3knIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgdGhhdCB0aGUgZnVuY3Rpb24gdGhyb3dzLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufFJlZ0V4cH0gY2FsbGJhY2ssIG9yIHJlZ2V4cCB0byBtYXRjaCBlcnJvciBzdHJpbmcgYWdhaW5zdFxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBBc3NlcnRpb24ucHJvdG90eXBlLnRocm93RXJyb3IgPVxuICBBc3NlcnRpb24ucHJvdG90eXBlLnRocm93RXhjZXB0aW9uID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgZXhwZWN0KHRoaXMub2JqKS50by5iZS5hKCdmdW5jdGlvbicpO1xuXG4gICAgdmFyIHRocm93biA9IGZhbHNlXG4gICAgICAsIG5vdCA9IHRoaXMuZmxhZ3Mubm90XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5vYmooKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZm4pIHtcbiAgICAgICAgZm4oZSk7XG4gICAgICB9IGVsc2UgaWYgKCdvYmplY3QnID09IHR5cGVvZiBmbikge1xuICAgICAgICB2YXIgc3ViamVjdCA9ICdzdHJpbmcnID09IHR5cGVvZiBlID8gZSA6IGUubWVzc2FnZTtcbiAgICAgICAgaWYgKG5vdCkge1xuICAgICAgICAgIGV4cGVjdChzdWJqZWN0KS50by5ub3QubWF0Y2goZm4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGV4cGVjdChzdWJqZWN0KS50by5tYXRjaChmbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRocm93biA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCdvYmplY3QnID09IHR5cGVvZiBmbiAmJiBub3QpIHtcbiAgICAgIC8vIGluIHRoZSBwcmVzZW5jZSBvZiBhIG1hdGNoZXIsIGVuc3VyZSB0aGUgYG5vdGAgb25seSBhcHBsaWVzIHRvXG4gICAgICAvLyB0aGUgbWF0Y2hpbmcuXG4gICAgICB0aGlzLmZsYWdzLm5vdCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBuYW1lID0gdGhpcy5vYmoubmFtZSB8fCAnZm4nO1xuICAgIHRoaXMuYXNzZXJ0KFxuICAgICAgICB0aHJvd25cbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgbmFtZSArICcgdG8gdGhyb3cgYW4gZXhjZXB0aW9uJyB9XG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIG5hbWUgKyAnIG5vdCB0byB0aHJvdyBhbiBleGNlcHRpb24nIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGFycmF5IGlzIGVtcHR5LlxuICAgKlxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBBc3NlcnRpb24ucHJvdG90eXBlLmVtcHR5ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHBlY3RhdGlvbjtcblxuICAgIGlmICgnb2JqZWN0JyA9PSB0eXBlb2YgdGhpcy5vYmogJiYgbnVsbCAhPT0gdGhpcy5vYmogJiYgIWlzQXJyYXkodGhpcy5vYmopKSB7XG4gICAgICBpZiAoJ251bWJlcicgPT0gdHlwZW9mIHRoaXMub2JqLmxlbmd0aCkge1xuICAgICAgICBleHBlY3RhdGlvbiA9ICF0aGlzLm9iai5sZW5ndGg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBleHBlY3RhdGlvbiA9ICFrZXlzKHRoaXMub2JqKS5sZW5ndGg7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICgnc3RyaW5nJyAhPSB0eXBlb2YgdGhpcy5vYmopIHtcbiAgICAgICAgZXhwZWN0KHRoaXMub2JqKS50by5iZS5hbignb2JqZWN0Jyk7XG4gICAgICB9XG5cbiAgICAgIGV4cGVjdCh0aGlzLm9iaikudG8uaGF2ZS5wcm9wZXJ0eSgnbGVuZ3RoJyk7XG4gICAgICBleHBlY3RhdGlvbiA9ICF0aGlzLm9iai5sZW5ndGg7XG4gICAgfVxuXG4gICAgdGhpcy5hc3NlcnQoXG4gICAgICAgIGV4cGVjdGF0aW9uXG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBiZSBlbXB0eScgfVxuICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gbm90IGJlIGVtcHR5JyB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBvYmogZXhhY3RseSBlcXVhbHMgYW5vdGhlci5cbiAgICpcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS5iZSA9XG4gIEFzc2VydGlvbi5wcm90b3R5cGUuZXF1YWwgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgdGhpcy5hc3NlcnQoXG4gICAgICAgIG9iaiA9PT0gdGhpcy5vYmpcbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIGVxdWFsICcgKyBpKG9iaikgfVxuICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gbm90IGVxdWFsICcgKyBpKG9iaikgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgb2JqIHNvcnRvZiBlcXVhbHMgYW5vdGhlci5cbiAgICpcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS5lcWwgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgdGhpcy5hc3NlcnQoXG4gICAgICAgIGV4cGVjdC5lcWwob2JqLCB0aGlzLm9iailcbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIHNvcnQgb2YgZXF1YWwgJyArIGkob2JqKSB9XG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBzb3J0IG9mIG5vdCBlcXVhbCAnICsgaShvYmopIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgd2l0aGluIHN0YXJ0IHRvIGZpbmlzaCAoaW5jbHVzaXZlKS5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXJ0XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBmaW5pc2hcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS53aXRoaW4gPSBmdW5jdGlvbiAoc3RhcnQsIGZpbmlzaCkge1xuICAgIHZhciByYW5nZSA9IHN0YXJ0ICsgJy4uJyArIGZpbmlzaDtcbiAgICB0aGlzLmFzc2VydChcbiAgICAgICAgdGhpcy5vYmogPj0gc3RhcnQgJiYgdGhpcy5vYmogPD0gZmluaXNoXG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBiZSB3aXRoaW4gJyArIHJhbmdlIH1cbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIG5vdCBiZSB3aXRoaW4gJyArIHJhbmdlIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgdHlwZW9mIC8gaW5zdGFuY2Ugb2ZcbiAgICpcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS5hID1cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS5hbiA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgaWYgKCdzdHJpbmcnID09IHR5cGVvZiB0eXBlKSB7XG4gICAgICAvLyBwcm9wZXIgZW5nbGlzaCBpbiBlcnJvciBtc2dcbiAgICAgIHZhciBuID0gL15bYWVpb3VdLy50ZXN0KHR5cGUpID8gJ24nIDogJyc7XG5cbiAgICAgIC8vIHR5cGVvZiB3aXRoIHN1cHBvcnQgZm9yICdhcnJheSdcbiAgICAgIHRoaXMuYXNzZXJ0KFxuICAgICAgICAgICdhcnJheScgPT0gdHlwZSA/IGlzQXJyYXkodGhpcy5vYmopIDpcbiAgICAgICAgICAgICdvYmplY3QnID09IHR5cGVcbiAgICAgICAgICAgICAgPyAnb2JqZWN0JyA9PSB0eXBlb2YgdGhpcy5vYmogJiYgbnVsbCAhPT0gdGhpcy5vYmpcbiAgICAgICAgICAgICAgOiB0eXBlID09IHR5cGVvZiB0aGlzLm9ialxuICAgICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBiZSBhJyArIG4gKyAnICcgKyB0eXBlIH1cbiAgICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgbm90IHRvIGJlIGEnICsgbiArICcgJyArIHR5cGUgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGluc3RhbmNlb2ZcbiAgICAgIHZhciBuYW1lID0gdHlwZS5uYW1lIHx8ICdzdXBwbGllZCBjb25zdHJ1Y3Rvcic7XG4gICAgICB0aGlzLmFzc2VydChcbiAgICAgICAgICB0aGlzLm9iaiBpbnN0YW5jZW9mIHR5cGVcbiAgICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gYmUgYW4gaW5zdGFuY2Ugb2YgJyArIG5hbWUgfVxuICAgICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyBub3QgdG8gYmUgYW4gaW5zdGFuY2Ugb2YgJyArIG5hbWUgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFzc2VydCBudW1lcmljIHZhbHVlIGFib3ZlIF9uXy5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG5cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS5ncmVhdGVyVGhhbiA9XG4gIEFzc2VydGlvbi5wcm90b3R5cGUuYWJvdmUgPSBmdW5jdGlvbiAobikge1xuICAgIHRoaXMuYXNzZXJ0KFxuICAgICAgICB0aGlzLm9iaiA+IG5cbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIGJlIGFib3ZlICcgKyBuIH1cbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIGJlIGJlbG93ICcgKyBuIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgbnVtZXJpYyB2YWx1ZSBiZWxvdyBfbl8uXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBuXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIEFzc2VydGlvbi5wcm90b3R5cGUubGVzc1RoYW4gPVxuICBBc3NlcnRpb24ucHJvdG90eXBlLmJlbG93ID0gZnVuY3Rpb24gKG4pIHtcbiAgICB0aGlzLmFzc2VydChcbiAgICAgICAgdGhpcy5vYmogPCBuXG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBiZSBiZWxvdyAnICsgbiB9XG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBiZSBhYm92ZSAnICsgbiB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogQXNzZXJ0IHN0cmluZyB2YWx1ZSBtYXRjaGVzIF9yZWdleHBfLlxuICAgKlxuICAgKiBAcGFyYW0ge1JlZ0V4cH0gcmVnZXhwXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIEFzc2VydGlvbi5wcm90b3R5cGUubWF0Y2ggPSBmdW5jdGlvbiAocmVnZXhwKSB7XG4gICAgdGhpcy5hc3NlcnQoXG4gICAgICAgIHJlZ2V4cC5leGVjKHRoaXMub2JqKVxuICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gbWF0Y2ggJyArIHJlZ2V4cCB9XG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyBub3QgdG8gbWF0Y2ggJyArIHJlZ2V4cCB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogQXNzZXJ0IHByb3BlcnR5IFwibGVuZ3RoXCIgZXhpc3RzIGFuZCBoYXMgdmFsdWUgb2YgX25fLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gblxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBBc3NlcnRpb24ucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uIChuKSB7XG4gICAgZXhwZWN0KHRoaXMub2JqKS50by5oYXZlLnByb3BlcnR5KCdsZW5ndGgnKTtcbiAgICB2YXIgbGVuID0gdGhpcy5vYmoubGVuZ3RoO1xuICAgIHRoaXMuYXNzZXJ0KFxuICAgICAgICBuID09IGxlblxuICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gaGF2ZSBhIGxlbmd0aCBvZiAnICsgbiArICcgYnV0IGdvdCAnICsgbGVuIH1cbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIG5vdCBoYXZlIGEgbGVuZ3RoIG9mICcgKyBsZW4gfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFzc2VydCBwcm9wZXJ0eSBfbmFtZV8gZXhpc3RzLCB3aXRoIG9wdGlvbmFsIF92YWxfLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICAgKiBAcGFyYW0ge01peGVkfSB2YWxcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS5wcm9wZXJ0eSA9IGZ1bmN0aW9uIChuYW1lLCB2YWwpIHtcbiAgICBpZiAodGhpcy5mbGFncy5vd24pIHtcbiAgICAgIHRoaXMuYXNzZXJ0KFxuICAgICAgICAgIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLm9iaiwgbmFtZSlcbiAgICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gaGF2ZSBvd24gcHJvcGVydHkgJyArIGkobmFtZSkgfVxuICAgICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBub3QgaGF2ZSBvd24gcHJvcGVydHkgJyArIGkobmFtZSkgfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5mbGFncy5ub3QgJiYgdW5kZWZpbmVkICE9PSB2YWwpIHtcbiAgICAgIGlmICh1bmRlZmluZWQgPT09IHRoaXMub2JqW25hbWVdKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihpKHRoaXMub2JqKSArICcgaGFzIG5vIHByb3BlcnR5ICcgKyBpKG5hbWUpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGhhc1Byb3A7XG4gICAgICB0cnkge1xuICAgICAgICBoYXNQcm9wID0gbmFtZSBpbiB0aGlzLm9ialxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBoYXNQcm9wID0gdW5kZWZpbmVkICE9PSB0aGlzLm9ialtuYW1lXVxuICAgICAgfVxuXG4gICAgICB0aGlzLmFzc2VydChcbiAgICAgICAgICBoYXNQcm9wXG4gICAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIGhhdmUgYSBwcm9wZXJ0eSAnICsgaShuYW1lKSB9XG4gICAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIG5vdCBoYXZlIGEgcHJvcGVydHkgJyArIGkobmFtZSkgfSk7XG4gICAgfVxuXG4gICAgaWYgKHVuZGVmaW5lZCAhPT0gdmFsKSB7XG4gICAgICB0aGlzLmFzc2VydChcbiAgICAgICAgICB2YWwgPT09IHRoaXMub2JqW25hbWVdXG4gICAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIGhhdmUgYSBwcm9wZXJ0eSAnICsgaShuYW1lKVxuICAgICAgICAgICsgJyBvZiAnICsgaSh2YWwpICsgJywgYnV0IGdvdCAnICsgaSh0aGlzLm9ialtuYW1lXSkgfVxuICAgICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBub3QgaGF2ZSBhIHByb3BlcnR5ICcgKyBpKG5hbWUpXG4gICAgICAgICAgKyAnIG9mICcgKyBpKHZhbCkgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5vYmogPSB0aGlzLm9ialtuYW1lXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogQXNzZXJ0IHRoYXQgdGhlIGFycmF5IGNvbnRhaW5zIF9vYmpfIG9yIHN0cmluZyBjb250YWlucyBfb2JqXy5cbiAgICpcbiAgICogQHBhcmFtIHtNaXhlZH0gb2JqfHN0cmluZ1xuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBBc3NlcnRpb24ucHJvdG90eXBlLnN0cmluZyA9XG4gIEFzc2VydGlvbi5wcm90b3R5cGUuY29udGFpbiA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIHRoaXMub2JqKSB7XG4gICAgICB0aGlzLmFzc2VydChcbiAgICAgICAgICB+dGhpcy5vYmouaW5kZXhPZihvYmopXG4gICAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIGNvbnRhaW4gJyArIGkob2JqKSB9XG4gICAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIG5vdCBjb250YWluICcgKyBpKG9iaikgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYXNzZXJ0KFxuICAgICAgICAgIH5pbmRleE9mKHRoaXMub2JqLCBvYmopXG4gICAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIGNvbnRhaW4gJyArIGkob2JqKSB9XG4gICAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIG5vdCBjb250YWluICcgKyBpKG9iaikgfSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgZXhhY3Qga2V5cyBvciBpbmNsdXNpb24gb2Yga2V5cyBieSB1c2luZ1xuICAgKiB0aGUgYC5vd25gIG1vZGlmaWVyLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fFN0cmluZyAuLi59IGtleXNcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS5rZXkgPVxuICBBc3NlcnRpb24ucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbiAoJGtleXMpIHtcbiAgICB2YXIgc3RyXG4gICAgICAsIG9rID0gdHJ1ZTtcblxuICAgICRrZXlzID0gaXNBcnJheSgka2V5cylcbiAgICAgID8gJGtleXNcbiAgICAgIDogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICAgIGlmICghJGtleXMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ2tleXMgcmVxdWlyZWQnKTtcblxuICAgIHZhciBhY3R1YWwgPSBrZXlzKHRoaXMub2JqKVxuICAgICAgLCBsZW4gPSAka2V5cy5sZW5ndGg7XG5cbiAgICAvLyBJbmNsdXNpb25cbiAgICBvayA9IGV2ZXJ5KCRrZXlzLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXR1cm4gfmluZGV4T2YoYWN0dWFsLCBrZXkpO1xuICAgIH0pO1xuXG4gICAgLy8gU3RyaWN0XG4gICAgaWYgKCF0aGlzLmZsYWdzLm5vdCAmJiB0aGlzLmZsYWdzLm9ubHkpIHtcbiAgICAgIG9rID0gb2sgJiYgJGtleXMubGVuZ3RoID09IGFjdHVhbC5sZW5ndGg7XG4gICAgfVxuXG4gICAgLy8gS2V5IHN0cmluZ1xuICAgIGlmIChsZW4gPiAxKSB7XG4gICAgICAka2V5cyA9IG1hcCgka2V5cywgZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4gaShrZXkpO1xuICAgICAgfSk7XG4gICAgICB2YXIgbGFzdCA9ICRrZXlzLnBvcCgpO1xuICAgICAgc3RyID0gJGtleXMuam9pbignLCAnKSArICcsIGFuZCAnICsgbGFzdDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gaSgka2V5c1swXSk7XG4gICAgfVxuXG4gICAgLy8gRm9ybVxuICAgIHN0ciA9IChsZW4gPiAxID8gJ2tleXMgJyA6ICdrZXkgJykgKyBzdHI7XG5cbiAgICAvLyBIYXZlIC8gaW5jbHVkZVxuICAgIHN0ciA9ICghdGhpcy5mbGFncy5vbmx5ID8gJ2luY2x1ZGUgJyA6ICdvbmx5IGhhdmUgJykgKyBzdHI7XG5cbiAgICAvLyBBc3NlcnRpb25cbiAgICB0aGlzLmFzc2VydChcbiAgICAgICAgb2tcbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvICcgKyBzdHIgfVxuICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gbm90ICcgKyBzdHIgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgLyoqXG4gICAqIEFzc2VydCBhIGZhaWx1cmUuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nIC4uLn0gY3VzdG9tIG1lc3NhZ2VcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG4gIEFzc2VydGlvbi5wcm90b3R5cGUuZmFpbCA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICBtc2cgPSBtc2cgfHwgXCJleHBsaWNpdCBmYWlsdXJlXCI7XG4gICAgdGhpcy5hc3NlcnQoZmFsc2UsIG1zZywgbXNnKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogRnVuY3Rpb24gYmluZCBpbXBsZW1lbnRhdGlvbi5cbiAgICovXG5cbiAgZnVuY3Rpb24gYmluZCAoZm4sIHNjb3BlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBmbi5hcHBseShzY29wZSwgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXJyYXkgZXZlcnkgY29tcGF0aWJpbGl0eVxuICAgKlxuICAgKiBAc2VlIGJpdC5seS81RnExTjJcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgZnVuY3Rpb24gZXZlcnkgKGFyciwgZm4sIHRoaXNPYmopIHtcbiAgICB2YXIgc2NvcGUgPSB0aGlzT2JqIHx8IGdsb2JhbDtcbiAgICBmb3IgKHZhciBpID0gMCwgaiA9IGFyci5sZW5ndGg7IGkgPCBqOyArK2kpIHtcbiAgICAgIGlmICghZm4uY2FsbChzY29wZSwgYXJyW2ldLCBpLCBhcnIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFycmF5IGluZGV4T2YgY29tcGF0aWJpbGl0eS5cbiAgICpcbiAgICogQHNlZSBiaXQubHkvYTVEeGEyXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGluZGV4T2YgKGFyciwgbywgaSkge1xuICAgIGlmIChBcnJheS5wcm90b3R5cGUuaW5kZXhPZikge1xuICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoYXJyLCBvLCBpKTtcbiAgICB9XG5cbiAgICBpZiAoYXJyLmxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaiA9IGFyci5sZW5ndGgsIGkgPSBpIDwgMCA/IGkgKyBqIDwgMCA/IDAgOiBpICsgaiA6IGkgfHwgMFxuICAgICAgICA7IGkgPCBqICYmIGFycltpXSAhPT0gbzsgaSsrKTtcblxuICAgIHJldHVybiBqIDw9IGkgPyAtMSA6IGk7XG4gIH07XG5cbiAgLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vMTA0NDEyOC9cbiAgdmFyIGdldE91dGVySFRNTCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICBpZiAoJ291dGVySFRNTCcgaW4gZWxlbWVudCkgcmV0dXJuIGVsZW1lbnQub3V0ZXJIVE1MO1xuICAgIHZhciBucyA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiO1xuICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdfJyk7XG4gICAgdmFyIGVsZW1Qcm90byA9ICh3aW5kb3cuSFRNTEVsZW1lbnQgfHwgd2luZG93LkVsZW1lbnQpLnByb3RvdHlwZTtcbiAgICB2YXIgeG1sU2VyaWFsaXplciA9IG5ldyBYTUxTZXJpYWxpemVyKCk7XG4gICAgdmFyIGh0bWw7XG4gICAgaWYgKGRvY3VtZW50LnhtbFZlcnNpb24pIHtcbiAgICAgIHJldHVybiB4bWxTZXJpYWxpemVyLnNlcmlhbGl6ZVRvU3RyaW5nKGVsZW1lbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZWxlbWVudC5jbG9uZU5vZGUoZmFsc2UpKTtcbiAgICAgIGh0bWwgPSBjb250YWluZXIuaW5uZXJIVE1MLnJlcGxhY2UoJz48JywgJz4nICsgZWxlbWVudC5pbm5lckhUTUwgKyAnPCcpO1xuICAgICAgY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgICAgcmV0dXJuIGh0bWw7XG4gICAgfVxuICB9O1xuXG4gIC8vIFJldHVybnMgdHJ1ZSBpZiBvYmplY3QgaXMgYSBET00gZWxlbWVudC5cbiAgdmFyIGlzRE9NRWxlbWVudCA9IGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgICBpZiAodHlwZW9mIEhUTUxFbGVtZW50ID09PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIG9iamVjdCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb2JqZWN0ICYmXG4gICAgICAgIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmXG4gICAgICAgIG9iamVjdC5ub2RlVHlwZSA9PT0gMSAmJlxuICAgICAgICB0eXBlb2Ygb2JqZWN0Lm5vZGVOYW1lID09PSAnc3RyaW5nJztcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEluc3BlY3RzIGFuIG9iamVjdC5cbiAgICpcbiAgICogQHNlZSB0YWtlbiBmcm9tIG5vZGUuanMgYHV0aWxgIG1vZHVsZSAoY29weXJpZ2h0IEpveWVudCwgTUlUIGxpY2Vuc2UpXG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cblxuICBmdW5jdGlvbiBpIChvYmosIHNob3dIaWRkZW4sIGRlcHRoKSB7XG4gICAgdmFyIHNlZW4gPSBbXTtcblxuICAgIGZ1bmN0aW9uIHN0eWxpemUgKHN0cikge1xuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZm9ybWF0ICh2YWx1ZSwgcmVjdXJzZVRpbWVzKSB7XG4gICAgICAvLyBQcm92aWRlIGEgaG9vayBmb3IgdXNlci1zcGVjaWZpZWQgaW5zcGVjdCBmdW5jdGlvbnMuXG4gICAgICAvLyBDaGVjayB0aGF0IHZhbHVlIGlzIGFuIG9iamVjdCB3aXRoIGFuIGluc3BlY3QgZnVuY3Rpb24gb24gaXRcbiAgICAgIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUuaW5zcGVjdCA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgICAgICAgIC8vIEZpbHRlciBvdXQgdGhlIHV0aWwgbW9kdWxlLCBpdCdzIGluc3BlY3QgZnVuY3Rpb24gaXMgc3BlY2lhbFxuICAgICAgICAgIHZhbHVlICE9PSBleHBvcnRzICYmXG4gICAgICAgICAgLy8gQWxzbyBmaWx0ZXIgb3V0IGFueSBwcm90b3R5cGUgb2JqZWN0cyB1c2luZyB0aGUgY2lyY3VsYXIgY2hlY2suXG4gICAgICAgICAgISh2YWx1ZS5jb25zdHJ1Y3RvciAmJiB2YWx1ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgPT09IHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdmFsdWUuaW5zcGVjdChyZWN1cnNlVGltZXMpO1xuICAgICAgfVxuXG4gICAgICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICAgICAgc3dpdGNoICh0eXBlb2YgdmFsdWUpIHtcbiAgICAgICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICAgICAgICByZXR1cm4gc3R5bGl6ZSgndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcpO1xuXG4gICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgICAgdmFyIHNpbXBsZSA9ICdcXCcnICsganNvbi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL15cInxcIiQvZywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpICsgJ1xcJyc7XG4gICAgICAgICAgcmV0dXJuIHN0eWxpemUoc2ltcGxlLCAnc3RyaW5nJyk7XG5cbiAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICByZXR1cm4gc3R5bGl6ZSgnJyArIHZhbHVlLCAnbnVtYmVyJyk7XG5cbiAgICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgICAgcmV0dXJuIHN0eWxpemUoJycgKyB2YWx1ZSwgJ2Jvb2xlYW4nKTtcbiAgICAgIH1cbiAgICAgIC8vIEZvciBzb21lIHJlYXNvbiB0eXBlb2YgbnVsbCBpcyBcIm9iamVjdFwiLCBzbyBzcGVjaWFsIGNhc2UgaGVyZS5cbiAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gc3R5bGl6ZSgnbnVsbCcsICdudWxsJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc0RPTUVsZW1lbnQodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBnZXRPdXRlckhUTUwodmFsdWUpO1xuICAgICAgfVxuXG4gICAgICAvLyBMb29rIHVwIHRoZSBrZXlzIG9mIHRoZSBvYmplY3QuXG4gICAgICB2YXIgdmlzaWJsZV9rZXlzID0ga2V5cyh2YWx1ZSk7XG4gICAgICB2YXIgJGtleXMgPSBzaG93SGlkZGVuID8gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModmFsdWUpIDogdmlzaWJsZV9rZXlzO1xuXG4gICAgICAvLyBGdW5jdGlvbnMgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZC5cbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicgJiYgJGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gc3R5bGl6ZSgnJyArIHZhbHVlLCAncmVnZXhwJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIG5hbWUgPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICAgICAgICByZXR1cm4gc3R5bGl6ZSgnW0Z1bmN0aW9uJyArIG5hbWUgKyAnXScsICdzcGVjaWFsJyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gRGF0ZXMgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZFxuICAgICAgaWYgKGlzRGF0ZSh2YWx1ZSkgJiYgJGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBzdHlsaXplKHZhbHVlLnRvVVRDU3RyaW5nKCksICdkYXRlJyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBiYXNlLCB0eXBlLCBicmFjZXM7XG4gICAgICAvLyBEZXRlcm1pbmUgdGhlIG9iamVjdCB0eXBlXG4gICAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgdHlwZSA9ICdBcnJheSc7XG4gICAgICAgIGJyYWNlcyA9IFsnWycsICddJ107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0eXBlID0gJ09iamVjdCc7XG4gICAgICAgIGJyYWNlcyA9IFsneycsICd9J107XG4gICAgICB9XG5cbiAgICAgIC8vIE1ha2UgZnVuY3Rpb25zIHNheSB0aGF0IHRoZXkgYXJlIGZ1bmN0aW9uc1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2YXIgbiA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgICAgICBiYXNlID0gKGlzUmVnRXhwKHZhbHVlKSkgPyAnICcgKyB2YWx1ZSA6ICcgW0Z1bmN0aW9uJyArIG4gKyAnXSc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBiYXNlID0gJyc7XG4gICAgICB9XG5cbiAgICAgIC8vIE1ha2UgZGF0ZXMgd2l0aCBwcm9wZXJ0aWVzIGZpcnN0IHNheSB0aGUgZGF0ZVxuICAgICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgICAgYmFzZSA9ICcgJyArIHZhbHVlLnRvVVRDU3RyaW5nKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICgka2V5cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyBicmFjZXNbMV07XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWN1cnNlVGltZXMgPCAwKSB7XG4gICAgICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gc3R5bGl6ZSgnJyArIHZhbHVlLCAncmVnZXhwJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHN0eWxpemUoJ1tPYmplY3RdJywgJ3NwZWNpYWwnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzZWVuLnB1c2godmFsdWUpO1xuXG4gICAgICB2YXIgb3V0cHV0ID0gbWFwKCRrZXlzLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHZhciBuYW1lLCBzdHI7XG4gICAgICAgIGlmICh2YWx1ZS5fX2xvb2t1cEdldHRlcl9fKSB7XG4gICAgICAgICAgaWYgKHZhbHVlLl9fbG9va3VwR2V0dGVyX18oa2V5KSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlLl9fbG9va3VwU2V0dGVyX18oa2V5KSkge1xuICAgICAgICAgICAgICBzdHIgPSBzdHlsaXplKCdbR2V0dGVyL1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc3RyID0gc3R5bGl6ZSgnW0dldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodmFsdWUuX19sb29rdXBTZXR0ZXJfXyhrZXkpKSB7XG4gICAgICAgICAgICAgIHN0ciA9IHN0eWxpemUoJ1tTZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluZGV4T2YodmlzaWJsZV9rZXlzLCBrZXkpIDwgMCkge1xuICAgICAgICAgIG5hbWUgPSAnWycgKyBrZXkgKyAnXSc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzdHIpIHtcbiAgICAgICAgICBpZiAoaW5kZXhPZihzZWVuLCB2YWx1ZVtrZXldKSA8IDApIHtcbiAgICAgICAgICAgIGlmIChyZWN1cnNlVGltZXMgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgc3RyID0gZm9ybWF0KHZhbHVlW2tleV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc3RyID0gZm9ybWF0KHZhbHVlW2tleV0sIHJlY3Vyc2VUaW1lcyAtIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHN0ci5pbmRleE9mKCdcXG4nKSA+IC0xKSB7XG4gICAgICAgICAgICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHN0ciA9IG1hcChzdHIuc3BsaXQoJ1xcbicpLCBmdW5jdGlvbiAobGluZSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuICcgICcgKyBsaW5lO1xuICAgICAgICAgICAgICAgIH0pLmpvaW4oJ1xcbicpLnN1YnN0cigyKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdHIgPSAnXFxuJyArIG1hcChzdHIuc3BsaXQoJ1xcbicpLCBmdW5jdGlvbiAobGluZSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuICcgICAnICsgbGluZTtcbiAgICAgICAgICAgICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHIgPSBzdHlsaXplKCdbQ2lyY3VsYXJdJywgJ3NwZWNpYWwnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBuYW1lID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIGlmICh0eXBlID09PSAnQXJyYXknICYmIGtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHI7XG4gICAgICAgICAgfVxuICAgICAgICAgIG5hbWUgPSBqc29uLnN0cmluZ2lmeSgnJyArIGtleSk7XG4gICAgICAgICAgaWYgKG5hbWUubWF0Y2goL15cIihbYS16QS1aX11bYS16QS1aXzAtOV0qKVwiJC8pKSB7XG4gICAgICAgICAgICBuYW1lID0gbmFtZS5zdWJzdHIoMSwgbmFtZS5sZW5ndGggLSAyKTtcbiAgICAgICAgICAgIG5hbWUgPSBzdHlsaXplKG5hbWUsICduYW1lJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpXG4gICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oXlwifFwiJCkvZywgXCInXCIpO1xuICAgICAgICAgICAgbmFtZSA9IHN0eWxpemUobmFtZSwgJ3N0cmluZycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuYW1lICsgJzogJyArIHN0cjtcbiAgICAgIH0pO1xuXG4gICAgICBzZWVuLnBvcCgpO1xuXG4gICAgICB2YXIgbnVtTGluZXNFc3QgPSAwO1xuICAgICAgdmFyIGxlbmd0aCA9IHJlZHVjZShvdXRwdXQsIGZ1bmN0aW9uIChwcmV2LCBjdXIpIHtcbiAgICAgICAgbnVtTGluZXNFc3QrKztcbiAgICAgICAgaWYgKGluZGV4T2YoY3VyLCAnXFxuJykgPj0gMCkgbnVtTGluZXNFc3QrKztcbiAgICAgICAgcmV0dXJuIHByZXYgKyBjdXIubGVuZ3RoICsgMTtcbiAgICAgIH0sIDApO1xuXG4gICAgICBpZiAobGVuZ3RoID4gNTApIHtcbiAgICAgICAgb3V0cHV0ID0gYnJhY2VzWzBdICtcbiAgICAgICAgICAgICAgICAgKGJhc2UgPT09ICcnID8gJycgOiBiYXNlICsgJ1xcbiAnKSArXG4gICAgICAgICAgICAgICAgICcgJyArXG4gICAgICAgICAgICAgICAgIG91dHB1dC5qb2luKCcsXFxuICAnKSArXG4gICAgICAgICAgICAgICAgICcgJyArXG4gICAgICAgICAgICAgICAgIGJyYWNlc1sxXTtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0cHV0ID0gYnJhY2VzWzBdICsgYmFzZSArICcgJyArIG91dHB1dC5qb2luKCcsICcpICsgJyAnICsgYnJhY2VzWzFdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cbiAgICByZXR1cm4gZm9ybWF0KG9iaiwgKHR5cGVvZiBkZXB0aCA9PT0gJ3VuZGVmaW5lZCcgPyAyIDogZGVwdGgpKTtcbiAgfTtcblxuICBmdW5jdGlvbiBpc0FycmF5IChhcikge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXIpID09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH07XG5cbiAgZnVuY3Rpb24gaXNSZWdFeHAocmUpIHtcbiAgICB2YXIgcztcbiAgICB0cnkge1xuICAgICAgcyA9ICcnICsgcmU7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiByZSBpbnN0YW5jZW9mIFJlZ0V4cCB8fCAvLyBlYXN5IGNhc2VcbiAgICAgICAgICAgLy8gZHVjay10eXBlIGZvciBjb250ZXh0LXN3aXRjaGluZyBldmFsY3ggY2FzZVxuICAgICAgICAgICB0eXBlb2YocmUpID09PSAnZnVuY3Rpb24nICYmXG4gICAgICAgICAgIHJlLmNvbnN0cnVjdG9yLm5hbWUgPT09ICdSZWdFeHAnICYmXG4gICAgICAgICAgIHJlLmNvbXBpbGUgJiZcbiAgICAgICAgICAgcmUudGVzdCAmJlxuICAgICAgICAgICByZS5leGVjICYmXG4gICAgICAgICAgIHMubWF0Y2goL15cXC8uKlxcL1tnaW1dezAsM30kLyk7XG4gIH07XG5cbiAgZnVuY3Rpb24gaXNEYXRlKGQpIHtcbiAgICBpZiAoZCBpbnN0YW5jZW9mIERhdGUpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBmdW5jdGlvbiBrZXlzIChvYmopIHtcbiAgICBpZiAoT2JqZWN0LmtleXMpIHtcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmopO1xuICAgIH1cblxuICAgIHZhciBrZXlzID0gW107XG5cbiAgICBmb3IgKHZhciBpIGluIG9iaikge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGkpKSB7XG4gICAgICAgIGtleXMucHVzaChpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ga2V5cztcbiAgfVxuXG4gIGZ1bmN0aW9uIG1hcCAoYXJyLCBtYXBwZXIsIHRoYXQpIHtcbiAgICBpZiAoQXJyYXkucHJvdG90eXBlLm1hcCkge1xuICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5tYXAuY2FsbChhcnIsIG1hcHBlciwgdGhhdCk7XG4gICAgfVxuXG4gICAgdmFyIG90aGVyPSBuZXcgQXJyYXkoYXJyLmxlbmd0aCk7XG5cbiAgICBmb3IgKHZhciBpPSAwLCBuID0gYXJyLmxlbmd0aDsgaTxuOyBpKyspXG4gICAgICBpZiAoaSBpbiBhcnIpXG4gICAgICAgIG90aGVyW2ldID0gbWFwcGVyLmNhbGwodGhhdCwgYXJyW2ldLCBpLCBhcnIpO1xuXG4gICAgcmV0dXJuIG90aGVyO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHJlZHVjZSAoYXJyLCBmdW4pIHtcbiAgICBpZiAoQXJyYXkucHJvdG90eXBlLnJlZHVjZSkge1xuICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5yZWR1Y2UuYXBwbHkoXG4gICAgICAgICAgYXJyXG4gICAgICAgICwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICB2YXIgbGVuID0gK3RoaXMubGVuZ3RoO1xuXG4gICAgaWYgKHR5cGVvZiBmdW4gIT09IFwiZnVuY3Rpb25cIilcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcblxuICAgIC8vIG5vIHZhbHVlIHRvIHJldHVybiBpZiBubyBpbml0aWFsIHZhbHVlIGFuZCBhbiBlbXB0eSBhcnJheVxuICAgIGlmIChsZW4gPT09IDAgJiYgYXJndW1lbnRzLmxlbmd0aCA9PT0gMSlcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcblxuICAgIHZhciBpID0gMDtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAyKSB7XG4gICAgICB2YXIgcnYgPSBhcmd1bWVudHNbMV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvIHtcbiAgICAgICAgaWYgKGkgaW4gdGhpcykge1xuICAgICAgICAgIHJ2ID0gdGhpc1tpKytdO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgYXJyYXkgY29udGFpbnMgbm8gdmFsdWVzLCBubyBpbml0aWFsIHZhbHVlIHRvIHJldHVyblxuICAgICAgICBpZiAoKytpID49IGxlbilcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICB9IHdoaWxlICh0cnVlKTtcbiAgICB9XG5cbiAgICBmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZiAoaSBpbiB0aGlzKVxuICAgICAgICBydiA9IGZ1bi5jYWxsKG51bGwsIHJ2LCB0aGlzW2ldLCBpLCB0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcnY7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFzc2VydHMgZGVlcCBlcXVhbGl0eVxuICAgKlxuICAgKiBAc2VlIHRha2VuIGZyb20gbm9kZS5qcyBgYXNzZXJ0YCBtb2R1bGUgKGNvcHlyaWdodCBKb3llbnQsIE1JVCBsaWNlbnNlKVxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgZXhwZWN0LmVxbCA9IGZ1bmN0aW9uIGVxbCAoYWN0dWFsLCBleHBlY3RlZCkge1xuICAgIC8vIDcuMS4gQWxsIGlkZW50aWNhbCB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGFzIGRldGVybWluZWQgYnkgPT09LlxuICAgIGlmIChhY3R1YWwgPT09IGV4cGVjdGVkKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKCd1bmRlZmluZWQnICE9IHR5cGVvZiBCdWZmZXJcbiAgICAgICAgJiYgQnVmZmVyLmlzQnVmZmVyKGFjdHVhbCkgJiYgQnVmZmVyLmlzQnVmZmVyKGV4cGVjdGVkKSkge1xuICAgICAgaWYgKGFjdHVhbC5sZW5ndGggIT0gZXhwZWN0ZWQubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWN0dWFsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChhY3R1YWxbaV0gIT09IGV4cGVjdGVkW2ldKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgLy8gNy4yLiBJZiB0aGUgZXhwZWN0ZWQgdmFsdWUgaXMgYSBEYXRlIG9iamVjdCwgdGhlIGFjdHVhbCB2YWx1ZSBpc1xuICAgIC8vIGVxdWl2YWxlbnQgaWYgaXQgaXMgYWxzbyBhIERhdGUgb2JqZWN0IHRoYXQgcmVmZXJzIHRvIHRoZSBzYW1lIHRpbWUuXG4gICAgfSBlbHNlIGlmIChhY3R1YWwgaW5zdGFuY2VvZiBEYXRlICYmIGV4cGVjdGVkIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgcmV0dXJuIGFjdHVhbC5nZXRUaW1lKCkgPT09IGV4cGVjdGVkLmdldFRpbWUoKTtcblxuICAgIC8vIDcuMy4gT3RoZXIgcGFpcnMgdGhhdCBkbyBub3QgYm90aCBwYXNzIHR5cGVvZiB2YWx1ZSA9PSBcIm9iamVjdFwiLFxuICAgIC8vIGVxdWl2YWxlbmNlIGlzIGRldGVybWluZWQgYnkgPT0uXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgYWN0dWFsICE9ICdvYmplY3QnICYmIHR5cGVvZiBleHBlY3RlZCAhPSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIGFjdHVhbCA9PSBleHBlY3RlZDtcblxuICAgIC8vIDcuNC4gRm9yIGFsbCBvdGhlciBPYmplY3QgcGFpcnMsIGluY2x1ZGluZyBBcnJheSBvYmplY3RzLCBlcXVpdmFsZW5jZSBpc1xuICAgIC8vIGRldGVybWluZWQgYnkgaGF2aW5nIHRoZSBzYW1lIG51bWJlciBvZiBvd25lZCBwcm9wZXJ0aWVzIChhcyB2ZXJpZmllZFxuICAgIC8vIHdpdGggT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKSwgdGhlIHNhbWUgc2V0IG9mIGtleXNcbiAgICAvLyAoYWx0aG91Z2ggbm90IG5lY2Vzc2FyaWx5IHRoZSBzYW1lIG9yZGVyKSwgZXF1aXZhbGVudCB2YWx1ZXMgZm9yIGV2ZXJ5XG4gICAgLy8gY29ycmVzcG9uZGluZyBrZXksIGFuZCBhbiBpZGVudGljYWwgXCJwcm90b3R5cGVcIiBwcm9wZXJ0eS4gTm90ZTogdGhpc1xuICAgIC8vIGFjY291bnRzIGZvciBib3RoIG5hbWVkIGFuZCBpbmRleGVkIHByb3BlcnRpZXMgb24gQXJyYXlzLlxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb2JqRXF1aXYoYWN0dWFsLCBleHBlY3RlZCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaXNVbmRlZmluZWRPck51bGwgKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBpc0FyZ3VtZW50cyAob2JqZWN0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmplY3QpID09ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xuICB9XG5cbiAgZnVuY3Rpb24gb2JqRXF1aXYgKGEsIGIpIHtcbiAgICBpZiAoaXNVbmRlZmluZWRPck51bGwoYSkgfHwgaXNVbmRlZmluZWRPck51bGwoYikpXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgLy8gYW4gaWRlbnRpY2FsIFwicHJvdG90eXBlXCIgcHJvcGVydHkuXG4gICAgaWYgKGEucHJvdG90eXBlICE9PSBiLnByb3RvdHlwZSkgcmV0dXJuIGZhbHNlO1xuICAgIC8vfn5+SSd2ZSBtYW5hZ2VkIHRvIGJyZWFrIE9iamVjdC5rZXlzIHRocm91Z2ggc2NyZXd5IGFyZ3VtZW50cyBwYXNzaW5nLlxuICAgIC8vICAgQ29udmVydGluZyB0byBhcnJheSBzb2x2ZXMgdGhlIHByb2JsZW0uXG4gICAgaWYgKGlzQXJndW1lbnRzKGEpKSB7XG4gICAgICBpZiAoIWlzQXJndW1lbnRzKGIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGEgPSBwU2xpY2UuY2FsbChhKTtcbiAgICAgIGIgPSBwU2xpY2UuY2FsbChiKTtcbiAgICAgIHJldHVybiBleHBlY3QuZXFsKGEsIGIpO1xuICAgIH1cbiAgICB0cnl7XG4gICAgICB2YXIga2EgPSBrZXlzKGEpLFxuICAgICAgICBrYiA9IGtleXMoYiksXG4gICAgICAgIGtleSwgaTtcbiAgICB9IGNhdGNoIChlKSB7Ly9oYXBwZW5zIHdoZW4gb25lIGlzIGEgc3RyaW5nIGxpdGVyYWwgYW5kIHRoZSBvdGhlciBpc24ndFxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBoYXZpbmcgdGhlIHNhbWUgbnVtYmVyIG9mIG93bmVkIHByb3BlcnRpZXMgKGtleXMgaW5jb3Jwb3JhdGVzIGhhc093blByb3BlcnR5KVxuICAgIGlmIChrYS5sZW5ndGggIT0ga2IubGVuZ3RoKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIC8vdGhlIHNhbWUgc2V0IG9mIGtleXMgKGFsdGhvdWdoIG5vdCBuZWNlc3NhcmlseSB0aGUgc2FtZSBvcmRlciksXG4gICAga2Euc29ydCgpO1xuICAgIGtiLnNvcnQoKTtcbiAgICAvL35+fmNoZWFwIGtleSB0ZXN0XG4gICAgZm9yIChpID0ga2EubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGlmIChrYVtpXSAhPSBrYltpXSlcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvL2VxdWl2YWxlbnQgdmFsdWVzIGZvciBldmVyeSBjb3JyZXNwb25kaW5nIGtleSwgYW5kXG4gICAgLy9+fn5wb3NzaWJseSBleHBlbnNpdmUgZGVlcCB0ZXN0XG4gICAgZm9yIChpID0ga2EubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGtleSA9IGthW2ldO1xuICAgICAgaWYgKCFleHBlY3QuZXFsKGFba2V5XSwgYltrZXldKSlcbiAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICB2YXIganNvbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBpZiAoJ29iamVjdCcgPT0gdHlwZW9mIEpTT04gJiYgSlNPTi5wYXJzZSAmJiBKU09OLnN0cmluZ2lmeSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBwYXJzZTogbmF0aXZlSlNPTi5wYXJzZVxuICAgICAgICAsIHN0cmluZ2lmeTogbmF0aXZlSlNPTi5zdHJpbmdpZnlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgSlNPTiA9IHt9O1xuXG4gICAgZnVuY3Rpb24gZihuKSB7XG4gICAgICAgIC8vIEZvcm1hdCBpbnRlZ2VycyB0byBoYXZlIGF0IGxlYXN0IHR3byBkaWdpdHMuXG4gICAgICAgIHJldHVybiBuIDwgMTAgPyAnMCcgKyBuIDogbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkYXRlKGQsIGtleSkge1xuICAgICAgcmV0dXJuIGlzRmluaXRlKGQudmFsdWVPZigpKSA/XG4gICAgICAgICAgZC5nZXRVVENGdWxsWWVhcigpICAgICArICctJyArXG4gICAgICAgICAgZihkLmdldFVUQ01vbnRoKCkgKyAxKSArICctJyArXG4gICAgICAgICAgZihkLmdldFVUQ0RhdGUoKSkgICAgICArICdUJyArXG4gICAgICAgICAgZihkLmdldFVUQ0hvdXJzKCkpICAgICArICc6JyArXG4gICAgICAgICAgZihkLmdldFVUQ01pbnV0ZXMoKSkgICArICc6JyArXG4gICAgICAgICAgZihkLmdldFVUQ1NlY29uZHMoKSkgICArICdaJyA6IG51bGw7XG4gICAgfTtcblxuICAgIHZhciBjeCA9IC9bXFx1MDAwMFxcdTAwYWRcXHUwNjAwLVxcdTA2MDRcXHUwNzBmXFx1MTdiNFxcdTE3YjVcXHUyMDBjLVxcdTIwMGZcXHUyMDI4LVxcdTIwMmZcXHUyMDYwLVxcdTIwNmZcXHVmZWZmXFx1ZmZmMC1cXHVmZmZmXS9nLFxuICAgICAgICBlc2NhcGFibGUgPSAvW1xcXFxcXFwiXFx4MDAtXFx4MWZcXHg3Zi1cXHg5ZlxcdTAwYWRcXHUwNjAwLVxcdTA2MDRcXHUwNzBmXFx1MTdiNFxcdTE3YjVcXHUyMDBjLVxcdTIwMGZcXHUyMDI4LVxcdTIwMmZcXHUyMDYwLVxcdTIwNmZcXHVmZWZmXFx1ZmZmMC1cXHVmZmZmXS9nLFxuICAgICAgICBnYXAsXG4gICAgICAgIGluZGVudCxcbiAgICAgICAgbWV0YSA9IHsgICAgLy8gdGFibGUgb2YgY2hhcmFjdGVyIHN1YnN0aXR1dGlvbnNcbiAgICAgICAgICAgICdcXGInOiAnXFxcXGInLFxuICAgICAgICAgICAgJ1xcdCc6ICdcXFxcdCcsXG4gICAgICAgICAgICAnXFxuJzogJ1xcXFxuJyxcbiAgICAgICAgICAgICdcXGYnOiAnXFxcXGYnLFxuICAgICAgICAgICAgJ1xccic6ICdcXFxccicsXG4gICAgICAgICAgICAnXCInIDogJ1xcXFxcIicsXG4gICAgICAgICAgICAnXFxcXCc6ICdcXFxcXFxcXCdcbiAgICAgICAgfSxcbiAgICAgICAgcmVwO1xuXG5cbiAgICBmdW5jdGlvbiBxdW90ZShzdHJpbmcpIHtcblxuICAvLyBJZiB0aGUgc3RyaW5nIGNvbnRhaW5zIG5vIGNvbnRyb2wgY2hhcmFjdGVycywgbm8gcXVvdGUgY2hhcmFjdGVycywgYW5kIG5vXG4gIC8vIGJhY2tzbGFzaCBjaGFyYWN0ZXJzLCB0aGVuIHdlIGNhbiBzYWZlbHkgc2xhcCBzb21lIHF1b3RlcyBhcm91bmQgaXQuXG4gIC8vIE90aGVyd2lzZSB3ZSBtdXN0IGFsc28gcmVwbGFjZSB0aGUgb2ZmZW5kaW5nIGNoYXJhY3RlcnMgd2l0aCBzYWZlIGVzY2FwZVxuICAvLyBzZXF1ZW5jZXMuXG5cbiAgICAgICAgZXNjYXBhYmxlLmxhc3RJbmRleCA9IDA7XG4gICAgICAgIHJldHVybiBlc2NhcGFibGUudGVzdChzdHJpbmcpID8gJ1wiJyArIHN0cmluZy5yZXBsYWNlKGVzY2FwYWJsZSwgZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHZhciBjID0gbWV0YVthXTtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgYyA9PT0gJ3N0cmluZycgPyBjIDpcbiAgICAgICAgICAgICAgICAnXFxcXHUnICsgKCcwMDAwJyArIGEuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikpLnNsaWNlKC00KTtcbiAgICAgICAgfSkgKyAnXCInIDogJ1wiJyArIHN0cmluZyArICdcIic7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBzdHIoa2V5LCBob2xkZXIpIHtcblxuICAvLyBQcm9kdWNlIGEgc3RyaW5nIGZyb20gaG9sZGVyW2tleV0uXG5cbiAgICAgICAgdmFyIGksICAgICAgICAgIC8vIFRoZSBsb29wIGNvdW50ZXIuXG4gICAgICAgICAgICBrLCAgICAgICAgICAvLyBUaGUgbWVtYmVyIGtleS5cbiAgICAgICAgICAgIHYsICAgICAgICAgIC8vIFRoZSBtZW1iZXIgdmFsdWUuXG4gICAgICAgICAgICBsZW5ndGgsXG4gICAgICAgICAgICBtaW5kID0gZ2FwLFxuICAgICAgICAgICAgcGFydGlhbCxcbiAgICAgICAgICAgIHZhbHVlID0gaG9sZGVyW2tleV07XG5cbiAgLy8gSWYgdGhlIHZhbHVlIGhhcyBhIHRvSlNPTiBtZXRob2QsIGNhbGwgaXQgdG8gb2J0YWluIGEgcmVwbGFjZW1lbnQgdmFsdWUuXG5cbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICAgICAgdmFsdWUgPSBkYXRlKGtleSk7XG4gICAgICAgIH1cblxuICAvLyBJZiB3ZSB3ZXJlIGNhbGxlZCB3aXRoIGEgcmVwbGFjZXIgZnVuY3Rpb24sIHRoZW4gY2FsbCB0aGUgcmVwbGFjZXIgdG9cbiAgLy8gb2J0YWluIGEgcmVwbGFjZW1lbnQgdmFsdWUuXG5cbiAgICAgICAgaWYgKHR5cGVvZiByZXAgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHZhbHVlID0gcmVwLmNhbGwoaG9sZGVyLCBrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gIC8vIFdoYXQgaGFwcGVucyBuZXh0IGRlcGVuZHMgb24gdGhlIHZhbHVlJ3MgdHlwZS5cblxuICAgICAgICBzd2l0Y2ggKHR5cGVvZiB2YWx1ZSkge1xuICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgICAgcmV0dXJuIHF1b3RlKHZhbHVlKTtcblxuICAgICAgICBjYXNlICdudW1iZXInOlxuXG4gIC8vIEpTT04gbnVtYmVycyBtdXN0IGJlIGZpbml0ZS4gRW5jb2RlIG5vbi1maW5pdGUgbnVtYmVycyBhcyBudWxsLlxuXG4gICAgICAgICAgICByZXR1cm4gaXNGaW5pdGUodmFsdWUpID8gU3RyaW5nKHZhbHVlKSA6ICdudWxsJztcblxuICAgICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgY2FzZSAnbnVsbCc6XG5cbiAgLy8gSWYgdGhlIHZhbHVlIGlzIGEgYm9vbGVhbiBvciBudWxsLCBjb252ZXJ0IGl0IHRvIGEgc3RyaW5nLiBOb3RlOlxuICAvLyB0eXBlb2YgbnVsbCBkb2VzIG5vdCBwcm9kdWNlICdudWxsJy4gVGhlIGNhc2UgaXMgaW5jbHVkZWQgaGVyZSBpblxuICAvLyB0aGUgcmVtb3RlIGNoYW5jZSB0aGF0IHRoaXMgZ2V0cyBmaXhlZCBzb21lZGF5LlxuXG4gICAgICAgICAgICByZXR1cm4gU3RyaW5nKHZhbHVlKTtcblxuICAvLyBJZiB0aGUgdHlwZSBpcyAnb2JqZWN0Jywgd2UgbWlnaHQgYmUgZGVhbGluZyB3aXRoIGFuIG9iamVjdCBvciBhbiBhcnJheSBvclxuICAvLyBudWxsLlxuXG4gICAgICAgIGNhc2UgJ29iamVjdCc6XG5cbiAgLy8gRHVlIHRvIGEgc3BlY2lmaWNhdGlvbiBibHVuZGVyIGluIEVDTUFTY3JpcHQsIHR5cGVvZiBudWxsIGlzICdvYmplY3QnLFxuICAvLyBzbyB3YXRjaCBvdXQgZm9yIHRoYXQgY2FzZS5cblxuICAgICAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnbnVsbCc7XG4gICAgICAgICAgICB9XG5cbiAgLy8gTWFrZSBhbiBhcnJheSB0byBob2xkIHRoZSBwYXJ0aWFsIHJlc3VsdHMgb2Ygc3RyaW5naWZ5aW5nIHRoaXMgb2JqZWN0IHZhbHVlLlxuXG4gICAgICAgICAgICBnYXAgKz0gaW5kZW50O1xuICAgICAgICAgICAgcGFydGlhbCA9IFtdO1xuXG4gIC8vIElzIHRoZSB2YWx1ZSBhbiBhcnJheT9cblxuICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuYXBwbHkodmFsdWUpID09PSAnW29iamVjdCBBcnJheV0nKSB7XG5cbiAgLy8gVGhlIHZhbHVlIGlzIGFuIGFycmF5LiBTdHJpbmdpZnkgZXZlcnkgZWxlbWVudC4gVXNlIG51bGwgYXMgYSBwbGFjZWhvbGRlclxuICAvLyBmb3Igbm9uLUpTT04gdmFsdWVzLlxuXG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gdmFsdWUubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBwYXJ0aWFsW2ldID0gc3RyKGksIHZhbHVlKSB8fCAnbnVsbCc7XG4gICAgICAgICAgICAgICAgfVxuXG4gIC8vIEpvaW4gYWxsIG9mIHRoZSBlbGVtZW50cyB0b2dldGhlciwgc2VwYXJhdGVkIHdpdGggY29tbWFzLCBhbmQgd3JhcCB0aGVtIGluXG4gIC8vIGJyYWNrZXRzLlxuXG4gICAgICAgICAgICAgICAgdiA9IHBhcnRpYWwubGVuZ3RoID09PSAwID8gJ1tdJyA6IGdhcCA/XG4gICAgICAgICAgICAgICAgICAgICdbXFxuJyArIGdhcCArIHBhcnRpYWwuam9pbignLFxcbicgKyBnYXApICsgJ1xcbicgKyBtaW5kICsgJ10nIDpcbiAgICAgICAgICAgICAgICAgICAgJ1snICsgcGFydGlhbC5qb2luKCcsJykgKyAnXSc7XG4gICAgICAgICAgICAgICAgZ2FwID0gbWluZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gdjtcbiAgICAgICAgICAgIH1cblxuICAvLyBJZiB0aGUgcmVwbGFjZXIgaXMgYW4gYXJyYXksIHVzZSBpdCB0byBzZWxlY3QgdGhlIG1lbWJlcnMgdG8gYmUgc3RyaW5naWZpZWQuXG5cbiAgICAgICAgICAgIGlmIChyZXAgJiYgdHlwZW9mIHJlcCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBsZW5ndGggPSByZXAubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlcFtpXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGsgPSByZXBbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICB2ID0gc3RyKGssIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydGlhbC5wdXNoKHF1b3RlKGspICsgKGdhcCA/ICc6ICcgOiAnOicpICsgdik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gIC8vIE90aGVyd2lzZSwgaXRlcmF0ZSB0aHJvdWdoIGFsbCBvZiB0aGUga2V5cyBpbiB0aGUgb2JqZWN0LlxuXG4gICAgICAgICAgICAgICAgZm9yIChrIGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGspKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2ID0gc3RyKGssIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydGlhbC5wdXNoKHF1b3RlKGspICsgKGdhcCA/ICc6ICcgOiAnOicpICsgdik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgLy8gSm9pbiBhbGwgb2YgdGhlIG1lbWJlciB0ZXh0cyB0b2dldGhlciwgc2VwYXJhdGVkIHdpdGggY29tbWFzLFxuICAvLyBhbmQgd3JhcCB0aGVtIGluIGJyYWNlcy5cblxuICAgICAgICAgICAgdiA9IHBhcnRpYWwubGVuZ3RoID09PSAwID8gJ3t9JyA6IGdhcCA/XG4gICAgICAgICAgICAgICAgJ3tcXG4nICsgZ2FwICsgcGFydGlhbC5qb2luKCcsXFxuJyArIGdhcCkgKyAnXFxuJyArIG1pbmQgKyAnfScgOlxuICAgICAgICAgICAgICAgICd7JyArIHBhcnRpYWwuam9pbignLCcpICsgJ30nO1xuICAgICAgICAgICAgZ2FwID0gbWluZDtcbiAgICAgICAgICAgIHJldHVybiB2O1xuICAgICAgICB9XG4gICAgfVxuXG4gIC8vIElmIHRoZSBKU09OIG9iamVjdCBkb2VzIG5vdCB5ZXQgaGF2ZSBhIHN0cmluZ2lmeSBtZXRob2QsIGdpdmUgaXQgb25lLlxuXG4gICAgSlNPTi5zdHJpbmdpZnkgPSBmdW5jdGlvbiAodmFsdWUsIHJlcGxhY2VyLCBzcGFjZSkge1xuXG4gIC8vIFRoZSBzdHJpbmdpZnkgbWV0aG9kIHRha2VzIGEgdmFsdWUgYW5kIGFuIG9wdGlvbmFsIHJlcGxhY2VyLCBhbmQgYW4gb3B0aW9uYWxcbiAgLy8gc3BhY2UgcGFyYW1ldGVyLCBhbmQgcmV0dXJucyBhIEpTT04gdGV4dC4gVGhlIHJlcGxhY2VyIGNhbiBiZSBhIGZ1bmN0aW9uXG4gIC8vIHRoYXQgY2FuIHJlcGxhY2UgdmFsdWVzLCBvciBhbiBhcnJheSBvZiBzdHJpbmdzIHRoYXQgd2lsbCBzZWxlY3QgdGhlIGtleXMuXG4gIC8vIEEgZGVmYXVsdCByZXBsYWNlciBtZXRob2QgY2FuIGJlIHByb3ZpZGVkLiBVc2Ugb2YgdGhlIHNwYWNlIHBhcmFtZXRlciBjYW5cbiAgLy8gcHJvZHVjZSB0ZXh0IHRoYXQgaXMgbW9yZSBlYXNpbHkgcmVhZGFibGUuXG5cbiAgICAgICAgdmFyIGk7XG4gICAgICAgIGdhcCA9ICcnO1xuICAgICAgICBpbmRlbnQgPSAnJztcblxuICAvLyBJZiB0aGUgc3BhY2UgcGFyYW1ldGVyIGlzIGEgbnVtYmVyLCBtYWtlIGFuIGluZGVudCBzdHJpbmcgY29udGFpbmluZyB0aGF0XG4gIC8vIG1hbnkgc3BhY2VzLlxuXG4gICAgICAgIGlmICh0eXBlb2Ygc3BhY2UgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgc3BhY2U7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIGluZGVudCArPSAnICc7XG4gICAgICAgICAgICB9XG5cbiAgLy8gSWYgdGhlIHNwYWNlIHBhcmFtZXRlciBpcyBhIHN0cmluZywgaXQgd2lsbCBiZSB1c2VkIGFzIHRoZSBpbmRlbnQgc3RyaW5nLlxuXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHNwYWNlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgaW5kZW50ID0gc3BhY2U7XG4gICAgICAgIH1cblxuICAvLyBJZiB0aGVyZSBpcyBhIHJlcGxhY2VyLCBpdCBtdXN0IGJlIGEgZnVuY3Rpb24gb3IgYW4gYXJyYXkuXG4gIC8vIE90aGVyd2lzZSwgdGhyb3cgYW4gZXJyb3IuXG5cbiAgICAgICAgcmVwID0gcmVwbGFjZXI7XG4gICAgICAgIGlmIChyZXBsYWNlciAmJiB0eXBlb2YgcmVwbGFjZXIgIT09ICdmdW5jdGlvbicgJiZcbiAgICAgICAgICAgICAgICAodHlwZW9mIHJlcGxhY2VyICE9PSAnb2JqZWN0JyB8fFxuICAgICAgICAgICAgICAgIHR5cGVvZiByZXBsYWNlci5sZW5ndGggIT09ICdudW1iZXInKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdKU09OLnN0cmluZ2lmeScpO1xuICAgICAgICB9XG5cbiAgLy8gTWFrZSBhIGZha2Ugcm9vdCBvYmplY3QgY29udGFpbmluZyBvdXIgdmFsdWUgdW5kZXIgdGhlIGtleSBvZiAnJy5cbiAgLy8gUmV0dXJuIHRoZSByZXN1bHQgb2Ygc3RyaW5naWZ5aW5nIHRoZSB2YWx1ZS5cblxuICAgICAgICByZXR1cm4gc3RyKCcnLCB7Jyc6IHZhbHVlfSk7XG4gICAgfTtcblxuICAvLyBJZiB0aGUgSlNPTiBvYmplY3QgZG9lcyBub3QgeWV0IGhhdmUgYSBwYXJzZSBtZXRob2QsIGdpdmUgaXQgb25lLlxuXG4gICAgSlNPTi5wYXJzZSA9IGZ1bmN0aW9uICh0ZXh0LCByZXZpdmVyKSB7XG4gICAgLy8gVGhlIHBhcnNlIG1ldGhvZCB0YWtlcyBhIHRleHQgYW5kIGFuIG9wdGlvbmFsIHJldml2ZXIgZnVuY3Rpb24sIGFuZCByZXR1cm5zXG4gICAgLy8gYSBKYXZhU2NyaXB0IHZhbHVlIGlmIHRoZSB0ZXh0IGlzIGEgdmFsaWQgSlNPTiB0ZXh0LlxuXG4gICAgICAgIHZhciBqO1xuXG4gICAgICAgIGZ1bmN0aW9uIHdhbGsoaG9sZGVyLCBrZXkpIHtcblxuICAgIC8vIFRoZSB3YWxrIG1ldGhvZCBpcyB1c2VkIHRvIHJlY3Vyc2l2ZWx5IHdhbGsgdGhlIHJlc3VsdGluZyBzdHJ1Y3R1cmUgc29cbiAgICAvLyB0aGF0IG1vZGlmaWNhdGlvbnMgY2FuIGJlIG1hZGUuXG5cbiAgICAgICAgICAgIHZhciBrLCB2LCB2YWx1ZSA9IGhvbGRlcltrZXldO1xuICAgICAgICAgICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGsgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgaykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHYgPSB3YWxrKHZhbHVlLCBrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZVtrXSA9IHY7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB2YWx1ZVtrXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXZpdmVyLmNhbGwoaG9sZGVyLCBrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuXG5cbiAgICAvLyBQYXJzaW5nIGhhcHBlbnMgaW4gZm91ciBzdGFnZXMuIEluIHRoZSBmaXJzdCBzdGFnZSwgd2UgcmVwbGFjZSBjZXJ0YWluXG4gICAgLy8gVW5pY29kZSBjaGFyYWN0ZXJzIHdpdGggZXNjYXBlIHNlcXVlbmNlcy4gSmF2YVNjcmlwdCBoYW5kbGVzIG1hbnkgY2hhcmFjdGVyc1xuICAgIC8vIGluY29ycmVjdGx5LCBlaXRoZXIgc2lsZW50bHkgZGVsZXRpbmcgdGhlbSwgb3IgdHJlYXRpbmcgdGhlbSBhcyBsaW5lIGVuZGluZ3MuXG5cbiAgICAgICAgdGV4dCA9IFN0cmluZyh0ZXh0KTtcbiAgICAgICAgY3gubGFzdEluZGV4ID0gMDtcbiAgICAgICAgaWYgKGN4LnRlc3QodGV4dCkpIHtcbiAgICAgICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoY3gsIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdcXFxcdScgK1xuICAgICAgICAgICAgICAgICAgICAoJzAwMDAnICsgYS5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgIC8vIEluIHRoZSBzZWNvbmQgc3RhZ2UsIHdlIHJ1biB0aGUgdGV4dCBhZ2FpbnN0IHJlZ3VsYXIgZXhwcmVzc2lvbnMgdGhhdCBsb29rXG4gICAgLy8gZm9yIG5vbi1KU09OIHBhdHRlcm5zLiBXZSBhcmUgZXNwZWNpYWxseSBjb25jZXJuZWQgd2l0aCAnKCknIGFuZCAnbmV3J1xuICAgIC8vIGJlY2F1c2UgdGhleSBjYW4gY2F1c2UgaW52b2NhdGlvbiwgYW5kICc9JyBiZWNhdXNlIGl0IGNhbiBjYXVzZSBtdXRhdGlvbi5cbiAgICAvLyBCdXQganVzdCB0byBiZSBzYWZlLCB3ZSB3YW50IHRvIHJlamVjdCBhbGwgdW5leHBlY3RlZCBmb3Jtcy5cblxuICAgIC8vIFdlIHNwbGl0IHRoZSBzZWNvbmQgc3RhZ2UgaW50byA0IHJlZ2V4cCBvcGVyYXRpb25zIGluIG9yZGVyIHRvIHdvcmsgYXJvdW5kXG4gICAgLy8gY3JpcHBsaW5nIGluZWZmaWNpZW5jaWVzIGluIElFJ3MgYW5kIFNhZmFyaSdzIHJlZ2V4cCBlbmdpbmVzLiBGaXJzdCB3ZVxuICAgIC8vIHJlcGxhY2UgdGhlIEpTT04gYmFja3NsYXNoIHBhaXJzIHdpdGggJ0AnIChhIG5vbi1KU09OIGNoYXJhY3RlcikuIFNlY29uZCwgd2VcbiAgICAvLyByZXBsYWNlIGFsbCBzaW1wbGUgdmFsdWUgdG9rZW5zIHdpdGggJ10nIGNoYXJhY3RlcnMuIFRoaXJkLCB3ZSBkZWxldGUgYWxsXG4gICAgLy8gb3BlbiBicmFja2V0cyB0aGF0IGZvbGxvdyBhIGNvbG9uIG9yIGNvbW1hIG9yIHRoYXQgYmVnaW4gdGhlIHRleHQuIEZpbmFsbHksXG4gICAgLy8gd2UgbG9vayB0byBzZWUgdGhhdCB0aGUgcmVtYWluaW5nIGNoYXJhY3RlcnMgYXJlIG9ubHkgd2hpdGVzcGFjZSBvciAnXScgb3JcbiAgICAvLyAnLCcgb3IgJzonIG9yICd7JyBvciAnfScuIElmIHRoYXQgaXMgc28sIHRoZW4gdGhlIHRleHQgaXMgc2FmZSBmb3IgZXZhbC5cblxuICAgICAgICBpZiAoL15bXFxdLDp7fVxcc10qJC9cbiAgICAgICAgICAgICAgICAudGVzdCh0ZXh0LnJlcGxhY2UoL1xcXFwoPzpbXCJcXFxcXFwvYmZucnRdfHVbMC05YS1mQS1GXXs0fSkvZywgJ0AnKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXCJbXlwiXFxcXFxcblxccl0qXCJ8dHJ1ZXxmYWxzZXxudWxsfC0/XFxkKyg/OlxcLlxcZCopPyg/OltlRV1bK1xcLV0/XFxkKyk/L2csICddJylcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyg/Ol58OnwsKSg/OlxccypcXFspKy9nLCAnJykpKSB7XG5cbiAgICAvLyBJbiB0aGUgdGhpcmQgc3RhZ2Ugd2UgdXNlIHRoZSBldmFsIGZ1bmN0aW9uIHRvIGNvbXBpbGUgdGhlIHRleHQgaW50byBhXG4gICAgLy8gSmF2YVNjcmlwdCBzdHJ1Y3R1cmUuIFRoZSAneycgb3BlcmF0b3IgaXMgc3ViamVjdCB0byBhIHN5bnRhY3RpYyBhbWJpZ3VpdHlcbiAgICAvLyBpbiBKYXZhU2NyaXB0OiBpdCBjYW4gYmVnaW4gYSBibG9jayBvciBhbiBvYmplY3QgbGl0ZXJhbC4gV2Ugd3JhcCB0aGUgdGV4dFxuICAgIC8vIGluIHBhcmVucyB0byBlbGltaW5hdGUgdGhlIGFtYmlndWl0eS5cblxuICAgICAgICAgICAgaiA9IGV2YWwoJygnICsgdGV4dCArICcpJyk7XG5cbiAgICAvLyBJbiB0aGUgb3B0aW9uYWwgZm91cnRoIHN0YWdlLCB3ZSByZWN1cnNpdmVseSB3YWxrIHRoZSBuZXcgc3RydWN0dXJlLCBwYXNzaW5nXG4gICAgLy8gZWFjaCBuYW1lL3ZhbHVlIHBhaXIgdG8gYSByZXZpdmVyIGZ1bmN0aW9uIGZvciBwb3NzaWJsZSB0cmFuc2Zvcm1hdGlvbi5cblxuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiByZXZpdmVyID09PSAnZnVuY3Rpb24nID9cbiAgICAgICAgICAgICAgICB3YWxrKHsnJzogan0sICcnKSA6IGo7XG4gICAgICAgIH1cblxuICAgIC8vIElmIHRoZSB0ZXh0IGlzIG5vdCBKU09OIHBhcnNlYWJsZSwgdGhlbiBhIFN5bnRheEVycm9yIGlzIHRocm93bi5cblxuICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ0pTT04ucGFyc2UnKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEpTT047XG4gIH0pKCk7XG5cbiAgaWYgKCd1bmRlZmluZWQnICE9IHR5cGVvZiB3aW5kb3cpIHtcbiAgICB3aW5kb3cuZXhwZWN0ID0gbW9kdWxlLmV4cG9ydHM7XG4gIH1cblxufSkoXG4gICAgdGhpc1xuICAsICd1bmRlZmluZWQnICE9IHR5cGVvZiBtb2R1bGUgPyBtb2R1bGUgOiB7fVxuICAsICd1bmRlZmluZWQnICE9IHR5cGVvZiBleHBvcnRzID8gZXhwb3J0cyA6IHt9XG4pO1xuIiwiLypqc2hpbnQgbWF4bGVuOmZhbHNlICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBleHBlY3QgPSByZXF1aXJlKCdleHBlY3QuanMnKTtcbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG52YXIgdG9nYSA9IHJlcXVpcmUoJy4uLy4uL2xpYi90b2dhJyk7XG5cbi8vIHZhciBkaWZmbGV0ID0gcmVxdWlyZSgnZGlmZmxldCcpKHtcbi8vICAgICBpbmRlbnQ6IDQsXG4vLyAgICAgY29tbWVudDogdHJ1ZVxuLy8gfSk7XG4vLyB2YXIgZGlmZiA9IGZ1bmN0aW9uKGEsIGIpIHtcbi8vICAgICBjb25zb2xlLmxvZyhkaWZmbGV0LmNvbXBhcmUoYSwgYikpO1xuLy8gfTtcblxuZGVzY3JpYmUoJ1RvZ2EnLCBmdW5jdGlvbiAoKSB7XG4gICAgaXQoJ3Nob3VsZCBub3QgcGFyc2Ugbm9uLWJsb2NrcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaWdub3JlID0gXCIvLyBpZ25vcmVcXG4vKiBpZ25vcmUgKi9cXG4vKiEgaWdub3JlICovXFxuXFxuLy9cXG4vLyBpZ25vcmVcXG4vL1xcbi8qXFxuICogaWdub3JlXFxuICovXFxuLyohXFxuICogaWdub3JlXFxuICovXFxuXFxuLy8gLyoqIGlnbm9yZVxcbnZhciBpZ25vcmUgPSAnLyoqIGlnbm9yZSAqLyc7XFxudmFyIGZvbyA9IGZ1bmN0aW9uKC8qKiBpZ25vcmUgKi8pIHt9O1xcbmNvbnNvbGUubG9nKGZvbyhpZ25vcmUpKTtcXG4vLyBpZ25vcmUgKi9cXG5cIjtcbiAgICAgICAgZXhwZWN0KHRvZ2EoaWdub3JlKSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHBhcnNlIGVtcHR5IGJsb2NrcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZW1wdHkgPSBcIi8qKi9cXG4vKioqL1xcbi8qKiAqL1xcbi8qKlxcbiAqXFxuICovXFxuLyoqXFxuXFxuKi9cXG5cIjtcblxuICAgICAgICAvLyBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeSh0b2dhKGVtcHR5KSwgbnVsbCwgNCkpO1xuICAgICAgICAvLyBkaWZmKHRvZ2EoZW1wdHkpLCBbXG4gICAgICAgIGV4cGVjdCh0b2dhKGVtcHR5KSkudG8uZXFsKFtcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnY29kZScsICdyYXcnOiAnLyoqL1xcbicgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnZG9jcycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFtdLCAncmF3JzogJy8qKiovJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdjb2RlJywgJ3Jhdyc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ2RvY3MnLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbXSwgJ3Jhdyc6ICcvKiogKi8nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ2NvZGUnLCAncmF3JzogJ1xcbicgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnZG9jcycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFtdLCAncmF3JzogJy8qKlxcbiAqXFxuICovJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdjb2RlJywgJ3Jhdyc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ2RvY3MnLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbXSwgJ3Jhdyc6ICcvKipcXG5cXG4qLycgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnY29kZScsICdyYXcnOiAnXFxuJyB9XG4gICAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBwYXJzZSBkZXNjcmlwdGlvbnMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGRlc2MgPSBcIi8qKiBkZXNjcmlwdGlvbiAqL1xcbi8qKlxcbiAqIGRlc2NyaXB0aW9uXFxuICovXFxuLyoqXFxuZGVzY3JpcHRpb25cXG4qL1xcblwiO1xuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHRvZ2EoZGVzYyksIG51bGwsIDQpKTtcbiAgICAgICAgLy8gZGlmZih0b2dhKGRlc2MpLCBbXG4gICAgICAgIGV4cGVjdCh0b2dhKGRlc2MpKS50by5lcWwoW1xuICAgICAgICAgICAgeyAndHlwZSc6ICdjb2RlJywgJ3Jhdyc6ICcnIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ2RvY3MnLCAnZGVzY3JpcHRpb24nOiAnZGVzY3JpcHRpb24nLCAndGFncyc6IFtdLCAncmF3JzogJy8qKiBkZXNjcmlwdGlvbiAqLycgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnY29kZScsICdyYXcnOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdkb2NzJywgJ2Rlc2NyaXB0aW9uJzogJ2Rlc2NyaXB0aW9uJywgJ3RhZ3MnOiBbXSwgJ3Jhdyc6ICcvKipcXG4gKiBkZXNjcmlwdGlvblxcbiAqLycgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnY29kZScsICdyYXcnOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdkb2NzJywgJ2Rlc2NyaXB0aW9uJzogJ2Rlc2NyaXB0aW9uJywgJ3RhZ3MnOiBbXSwgJ3Jhdyc6ICcvKipcXG5kZXNjcmlwdGlvblxcbiovJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdjb2RlJywgJ3Jhdyc6ICdcXG4nIH1cbiAgICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHBhcnNlIHRhZ3MnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHRhZyA9IFwiLyoqIEB0YWcgKi9cXG4vKipcXG4gKiBAdGFnXFxuICovXFxuLyoqXFxuQHRhZ1xcbiovXFxuXCI7XG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkodG9nYSh0YWcpLCBudWxsLCA0KSk7XG4gICAgICAgIC8vIGRpZmYodG9nYSh0YWcpLCBbXG4gICAgICAgIGV4cGVjdCh0b2dhKHRhZykpLnRvLmVxbChbXG4gICAgICAgICAgICB7ICd0eXBlJzogJ2NvZGUnLCAncmF3JzogJycgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnZG9jcycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFsgeyAndGFnJzogJ3RhZycgfSBdLCAncmF3JzogJy8qKiBAdGFnICovJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdjb2RlJywgJ3Jhdyc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ2RvY3MnLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbIHsgJ3RhZyc6ICd0YWcnIH0gXSwgJ3Jhdyc6ICcvKipcXG4gKiBAdGFnXFxuICovJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdjb2RlJywgJ3Jhdyc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ2RvY3MnLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbIHsgJ3RhZyc6ICd0YWcnIH0gXSwgJ3Jhdyc6ICcvKipcXG5AdGFnXFxuKi8nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ2NvZGUnLCAncmF3JzogJ1xcbicgfVxuICAgICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcGFyc2UgYXJncycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJnID0gXCIvKiogQGFyZyB7VHlwZX0gW25hbWVdIC0gRGVzY3JpcHRpb24uICovXFxuLyoqIEBhcmcge1R5cGV9IFtuYW1lXSBEZXNjcmlwdGlvbi4gKi9cXG4vKiogQGFyZyB7VHlwZX0gbmFtZSAtIERlc2NyaXB0aW9uLiAqL1xcbi8qKiBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLiAqL1xcbi8qKiBAYXJnIHtUeXBlfSBbbmFtZV0gKi9cXG4vKiogQGFyZyB7VHlwZX0gbmFtZSAqL1xcbi8qKiBAYXJnIFtuYW1lXSAtIERlc2NyaXB0aW9uLiAqL1xcbi8qKiBAYXJnIFtuYW1lXSBEZXNjcmlwdGlvbi4gKi9cXG4vKiogQGFyZyBuYW1lIC0gRGVzY3JpcHRpb24uICovXFxuLyoqIEBhcmcgbmFtZSBEZXNjcmlwdGlvbi4gKi9cXG4vKiogQGFyZyBbbmFtZV0gKi9cXG4vKiogQGFyZyBuYW1lICovXFxuXCI7XG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkodG9nYShhcmcpLCBudWxsLCA0KSk7XG4gICAgICAgIC8vIGRpZmYodG9nYShhcmcpLCBbXG4gICAgICAgIGV4cGVjdCh0b2dhKGFyZykpLnRvLmVxbChbXG4gICAgICAgICAgICB7ICd0eXBlJzogJ2NvZGUnLCAncmF3JzogJycgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnZG9jcycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFsgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ1tuYW1lXScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbi4nIH0gXSwgJ3Jhdyc6ICcvKiogQGFyZyB7VHlwZX0gW25hbWVdIC0gRGVzY3JpcHRpb24uICovJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdjb2RlJywgJ3Jhdyc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ2RvY3MnLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICdbbmFtZV0nLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24uJyB9IF0sICdyYXcnOiAnLyoqIEBhcmcge1R5cGV9IFtuYW1lXSBEZXNjcmlwdGlvbi4gKi8nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ2NvZGUnLCAncmF3JzogJ1xcbicgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnZG9jcycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFsgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24uJyB9IF0sICdyYXcnOiAnLyoqIEBhcmcge1R5cGV9IG5hbWUgLSBEZXNjcmlwdGlvbi4gKi8nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ2NvZGUnLCAncmF3JzogJ1xcbicgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnZG9jcycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFsgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24uJyB9IF0sICdyYXcnOiAnLyoqIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uICovJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdjb2RlJywgJ3Jhdyc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ2RvY3MnLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICdbbmFtZV0nIH0gXSwgJ3Jhdyc6ICcvKiogQGFyZyB7VHlwZX0gW25hbWVdICovJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdjb2RlJywgJ3Jhdyc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ2RvY3MnLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJyB9IF0sICdyYXcnOiAnLyoqIEBhcmcge1R5cGV9IG5hbWUgKi8nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ2NvZGUnLCAncmF3JzogJ1xcbicgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnZG9jcycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFsgeyAndGFnJzogJ2FyZycsICduYW1lJzogJ1tuYW1lXScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbi4nIH0gXSwgJ3Jhdyc6ICcvKiogQGFyZyBbbmFtZV0gLSBEZXNjcmlwdGlvbi4gKi8nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ2NvZGUnLCAncmF3JzogJ1xcbicgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnZG9jcycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFsgeyAndGFnJzogJ2FyZycsICduYW1lJzogJ1tuYW1lXScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbi4nIH0gXSwgJ3Jhdyc6ICcvKiogQGFyZyBbbmFtZV0gRGVzY3JpcHRpb24uICovJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdjb2RlJywgJ3Jhdyc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ2RvY3MnLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbIHsgJ3RhZyc6ICdhcmcnLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uLicgfSBdLCAncmF3JzogJy8qKiBAYXJnIG5hbWUgLSBEZXNjcmlwdGlvbi4gKi8nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ2NvZGUnLCAncmF3JzogJ1xcbicgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnZG9jcycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFsgeyAndGFnJzogJ2FyZycsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24uJyB9IF0sICdyYXcnOiAnLyoqIEBhcmcgbmFtZSBEZXNjcmlwdGlvbi4gKi8nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ2NvZGUnLCAncmF3JzogJ1xcbicgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnZG9jcycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFsgeyAndGFnJzogJ2FyZycsICduYW1lJzogJ1tuYW1lXScgfSBdLCAncmF3JzogJy8qKiBAYXJnIFtuYW1lXSAqLycgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnY29kZScsICdyYXcnOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdkb2NzJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogWyB7ICd0YWcnOiAnYXJnJywgJ25hbWUnOiAnbmFtZScgfSBdLCAncmF3JzogJy8qKiBAYXJnIG5hbWUgKi8nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ2NvZGUnLCAncmF3JzogJ1xcbicgfVxuICAgICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcGFyc2UgdHlwZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHR5cGUgPSBcIi8qKiBAYXJnIHtUeXBlfSAqL1xcbi8qKiBAYXJnIHtTdHJpbmd8T2JqZWN0fSAqL1xcbi8qKiBAYXJnIHtBcnJheS48T2JqZWN0LjxTdHJpbmcsTnVtYmVyPj59ICovXFxuLyoqIEBhcmcge0Z1bmN0aW9uKFN0cmluZywgLi4uW051bWJlcl0pOiBOdW1iZXJ9IGNhbGxiYWNrICovXFxuXCI7XG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkodG9nYSh0eXBlKSwgbnVsbCwgNCkpO1xuICAgICAgICAvLyBkaWZmKHRvZ2EodHlwZSksIFtcbiAgICAgICAgZXhwZWN0KHRvZ2EodHlwZSkpLnRvLmVxbChbXG4gICAgICAgICAgICB7ICd0eXBlJzogJ2NvZGUnLCAncmF3JzogJycgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnZG9jcycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFsgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScgfSBdLCAncmF3JzogJy8qKiBAYXJnIHtUeXBlfSAqLycgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnY29kZScsICdyYXcnOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdkb2NzJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogWyB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1N0cmluZ3xPYmplY3R9JyB9IF0sICdyYXcnOiAnLyoqIEBhcmcge1N0cmluZ3xPYmplY3R9ICovJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdjb2RlJywgJ3Jhdyc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ2RvY3MnLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7QXJyYXkuPE9iamVjdC48U3RyaW5nLE51bWJlcj4+fScgfSBdLCAncmF3JzogJy8qKiBAYXJnIHtBcnJheS48T2JqZWN0LjxTdHJpbmcsTnVtYmVyPj59ICovJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdjb2RlJywgJ3Jhdyc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ2RvY3MnLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7RnVuY3Rpb24oU3RyaW5nLCAuLi5bTnVtYmVyXSk6IE51bWJlcn0nLCAnbmFtZSc6ICdjYWxsYmFjaycgfSBdLCAncmF3JzogJy8qKiBAYXJnIHtGdW5jdGlvbihTdHJpbmcsIC4uLltOdW1iZXJdKTogTnVtYmVyfSBjYWxsYmFjayAqLycgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnY29kZScsICdyYXcnOiAnXFxuJyB9XG4gICAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBwYXJzZSBuYW1lcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbmFtZSA9IFwiLyoqIEBhcmcgbmFtZSAqL1xcbi8qKiBAYXJnIFtuYW1lXSAqL1xcbi8qKiBAYXJnIFtuYW1lPXt9XSAqL1xcbi8qKiBAYXJnIFtuYW1lPVxcXCJoZWxsbyB3b3JsZFxcXCJdICovXFxuXCI7XG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkodG9nYShuYW1lKSwgbnVsbCwgNCkpO1xuICAgICAgICAvLyBkaWZmKHRvZ2EobmFtZSksIFtcbiAgICAgICAgZXhwZWN0KHRvZ2EobmFtZSkpLnRvLmVxbChbXG4gICAgICAgICAgICB7ICd0eXBlJzogJ2NvZGUnLCAncmF3JzogJycgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnZG9jcycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFsgeyAndGFnJzogJ2FyZycsICduYW1lJzogJ25hbWUnIH0gXSwgJ3Jhdyc6ICcvKiogQGFyZyBuYW1lICovJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdjb2RlJywgJ3Jhdyc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ2RvY3MnLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbIHsgJ3RhZyc6ICdhcmcnLCAnbmFtZSc6ICdbbmFtZV0nIH0gXSwgJ3Jhdyc6ICcvKiogQGFyZyBbbmFtZV0gKi8nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ2NvZGUnLCAncmF3JzogJ1xcbicgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnZG9jcycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFsgeyAndGFnJzogJ2FyZycsICduYW1lJzogJ1tuYW1lPXt9XScgfSBdLCAncmF3JzogJy8qKiBAYXJnIFtuYW1lPXt9XSAqLycgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnY29kZScsICdyYXcnOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdkb2NzJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogWyB7ICd0YWcnOiAnYXJnJywgJ25hbWUnOiAnW25hbWU9XCJoZWxsbyB3b3JsZFwiXScgfSBdLCAncmF3JzogJy8qKiBAYXJnIFtuYW1lPVwiaGVsbG8gd29ybGRcIl0gKi8nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ2NvZGUnLCAncmF3JzogJ1xcbicgfVxuICAgICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGluZGVudGlvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaW5kZW50ID0gXCIvKipcXG4gKiAjIFRpdGxlXFxuICpcXG4gKiBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gKiBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gKiB0eXBlIHRoaW5ncy5cXG4gKlxcbiAqIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcbiAqXFxuICogKiBMaWtlXFxuICogKiBMaXN0c1xcbiAqXFxuICogICAgIHZhciBjb2RlID0gJ3NhbXBsZXMnO1xcbiAqXFxuICogQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG4gKiBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gKiAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gKiBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gKiAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gKlxcbiAqICAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcbiAqXFxuICogQGV4YW1wbGVcXG4gKlxcbiAqICAgICB2YXIgZm9vID0gJ2Jhcic7XFxuICpcXG4gKiBAdGFnXFxuICovXFxuXFxuLyoqXFxuIyBUaXRsZVxcblxcbkxvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbmxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbnR5cGUgdGhpbmdzLlxcblxcbkxpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiogTGlrZVxcbiogTGlzdHNcXG5cXG4gICAgdmFyIGNvZGUgPSAnc2FtcGxlcyc7XFxuXFxuQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG5AZXhhbXBsZVxcblxcbiAgICB2YXIgZm9vID0gJ2Jhcic7XFxuXFxuQHRhZ1xcbiAqL1xcblxcbi8qKlxcbiAgICAjIFRpdGxlXFxuXFxuICAgIExvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbiAgICBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gICAgdHlwZSB0aGluZ3MuXFxuXFxuICAgIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiAgICAqIExpa2VcXG4gICAgKiBMaXN0c1xcblxcbiAgICAgICAgdmFyIGNvZGUgPSAnc2FtcGxlcyc7XFxuXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgICAgIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4gICAgQGV4YW1wbGVcXG5cXG4gICAgICAgIHZhciBmb28gPSAnYmFyJztcXG5cXG4gICAgQHRhZ1xcbiAqL1xcblxcbiAgICAvKipcXG4gICAgICogIyBUaXRsZVxcbiAgICAgKlxcbiAgICAgKiBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gICAgICogbGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxuICAgICAqIHR5cGUgdGhpbmdzLlxcbiAgICAgKlxcbiAgICAgKiBMaWtlIG1vcmUgcGFyYWdyYXBocy5cXG4gICAgICpcXG4gICAgICogKiBMaWtlXFxuICAgICAqICogTGlzdHNcXG4gICAgICpcXG4gICAgICogICAgIHZhciBjb2RlID0gJ3NhbXBsZXMnO1xcbiAgICAgKlxcbiAgICAgKiBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLlxcbiAgICAgKiBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICogICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAgICAqIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgKiAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgICpcXG4gICAgICogICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuICAgICAqXFxuICAgICAqIEBleGFtcGxlXFxuICAgICAqXFxuICAgICAqICAgICB2YXIgZm9vID0gJ2Jhcic7XFxuICAgICAqXFxuICAgICAqIEB0YWdcXG4gICAgICovXFxuXFxuICAgIC8qKlxcbiAgICAjIFRpdGxlXFxuXFxuICAgIExvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbiAgICBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gICAgdHlwZSB0aGluZ3MuXFxuXFxuICAgIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiAgICAqIExpa2VcXG4gICAgKiBMaXN0c1xcblxcbiAgICAgICAgdmFyIGNvZGUgPSAnc2FtcGxlcyc7XFxuXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgICAgIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4gICAgQGV4YW1wbGVcXG5cXG4gICAgICAgIHZhciBmb28gPSAnYmFyJztcXG5cXG4gICAgQHRhZ1xcbiAgICAgKi9cXG5cXG4gICAgLyoqXFxuICAgICAgICAjIFRpdGxlXFxuXFxuICAgICAgICBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gICAgICAgIGxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbiAgICAgICAgdHlwZSB0aGluZ3MuXFxuXFxuICAgICAgICBMaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4gICAgICAgICogTGlrZVxcbiAgICAgICAgKiBMaXN0c1xcblxcbiAgICAgICAgICAgIHZhciBjb2RlID0gJ3NhbXBsZXMnO1xcblxcbiAgICAgICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG4gICAgICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgICAgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAgICAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgICAgICAgICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuICAgICAgICBAZXhhbXBsZVxcblxcbiAgICAgICAgICAgIHZhciBmb28gPSAnYmFyJztcXG5cXG4gICAgICAgIEB0YWdcXG4gICAgKi9cXG5cIjtcblxuICAgICAgICAvLyBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeSh0b2dhKGluZGVudCksIG51bGwsIDQpKTtcbiAgICAgICAgLy8gZGlmZih0b2dhKGluZGVudCksIFtcbiAgICAgICAgZXhwZWN0KHRvZ2EoaW5kZW50KSkudG8uZXFsKFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdjb2RlJyxcbiAgICAgICAgICAgICAgICAncmF3JzogJydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAnZG9jcycsXG4gICAgICAgICAgICAgICAgJ2Rlc2NyaXB0aW9uJzogJyMgVGl0bGVcXG5cXG5Mb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG5saW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG50eXBlIHRoaW5ncy5cXG5cXG5MaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4qIExpa2VcXG4qIExpc3RzXFxuXFxuICAgIHZhciBjb2RlID0gXFwnc2FtcGxlc1xcJztcXG5cXG4nLFxuICAgICAgICAgICAgICAgICd0YWdzJzogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAndGFnJzogJ2FyZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAndHlwZSc6ICd7VHlwZX0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ25hbWUnOiAnbmFtZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24uXFxuJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAndGFnJzogJ2FyZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAndHlwZSc6ICd7VHlwZX0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ25hbWUnOiAnbmFtZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbidcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3RhZyc6ICdhcmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAne1R5cGV9JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICduYW1lJzogJ25hbWUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4nXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd0YWcnOiAnZXhhbXBsZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOiAnXFxuXFxuICAgIHZhciBmb28gPSBcXCdiYXJcXCc7XFxuXFxuJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAndGFnJzogJ3RhZydcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ3Jhdyc6ICcvKipcXG4gKiAjIFRpdGxlXFxuICpcXG4gKiBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gKiBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gKiB0eXBlIHRoaW5ncy5cXG4gKlxcbiAqIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcbiAqXFxuICogKiBMaWtlXFxuICogKiBMaXN0c1xcbiAqXFxuICogICAgIHZhciBjb2RlID0gXFwnc2FtcGxlc1xcJztcXG4gKlxcbiAqIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuICogQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICogICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICogQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICogICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICpcXG4gKiAgIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG4gKlxcbiAqIEBleGFtcGxlXFxuICpcXG4gKiAgICAgdmFyIGZvbyA9IFxcJ2JhclxcJztcXG4gKlxcbiAqIEB0YWdcXG4gKi8nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICd0eXBlJzogJ2NvZGUnLFxuICAgICAgICAgICAgICAgICdyYXcnOiAnXFxuXFxuJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdkb2NzJyxcbiAgICAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOiAnIyBUaXRsZVxcblxcbkxvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbmxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbnR5cGUgdGhpbmdzLlxcblxcbkxpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiogTGlrZVxcbiogTGlzdHNcXG5cXG4gICAgdmFyIGNvZGUgPSBcXCdzYW1wbGVzXFwnO1xcblxcbicsXG4gICAgICAgICAgICAgICAgJ3RhZ3MnOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd0YWcnOiAnYXJnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ3tUeXBlfScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnbmFtZSc6ICduYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbi5cXG4nXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd0YWcnOiAnYXJnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ3tUeXBlfScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnbmFtZSc6ICduYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAndGFnJzogJ2FyZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAndHlwZSc6ICd7VHlwZX0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ25hbWUnOiAnbmFtZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbidcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3RhZyc6ICdleGFtcGxlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkZXNjcmlwdGlvbic6ICdcXG5cXG4gICAgdmFyIGZvbyA9IFxcJ2JhclxcJztcXG5cXG4nXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd0YWcnOiAndGFnJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAncmF3JzogJy8qKlxcbiMgVGl0bGVcXG5cXG5Mb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG5saW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG50eXBlIHRoaW5ncy5cXG5cXG5MaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4qIExpa2VcXG4qIExpc3RzXFxuXFxuICAgIHZhciBjb2RlID0gXFwnc2FtcGxlc1xcJztcXG5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLlxcbkBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbkBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbkBleGFtcGxlXFxuXFxuICAgIHZhciBmb28gPSBcXCdiYXJcXCc7XFxuXFxuQHRhZ1xcbiAqLydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAnY29kZScsXG4gICAgICAgICAgICAgICAgJ3Jhdyc6ICdcXG5cXG4nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICd0eXBlJzogJ2RvY3MnLFxuICAgICAgICAgICAgICAgICdkZXNjcmlwdGlvbic6ICcjIFRpdGxlXFxuXFxuTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxubGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxudHlwZSB0aGluZ3MuXFxuXFxuTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuKiBMaWtlXFxuKiBMaXN0c1xcblxcbiAgICB2YXIgY29kZSA9IFxcJ3NhbXBsZXNcXCc7XFxuXFxuJyxcbiAgICAgICAgICAgICAgICAndGFncyc6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3RhZyc6ICdhcmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAne1R5cGV9JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICduYW1lJzogJ25hbWUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uLlxcbidcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3RhZyc6ICdhcmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAne1R5cGV9JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICduYW1lJzogJ25hbWUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4nXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd0YWcnOiAnYXJnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ3tUeXBlfScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnbmFtZSc6ICduYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAndGFnJzogJ2V4YW1wbGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Rlc2NyaXB0aW9uJzogJ1xcblxcbiAgICB2YXIgZm9vID0gXFwnYmFyXFwnO1xcblxcbidcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3RhZyc6ICd0YWcnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdyYXcnOiAnLyoqXFxuICAgICMgVGl0bGVcXG5cXG4gICAgTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxuICAgIGxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbiAgICB0eXBlIHRoaW5ncy5cXG5cXG4gICAgTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuICAgICogTGlrZVxcbiAgICAqIExpc3RzXFxuXFxuICAgICAgICB2YXIgY29kZSA9IFxcJ3NhbXBsZXNcXCc7XFxuXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgICAgIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4gICAgQGV4YW1wbGVcXG5cXG4gICAgICAgIHZhciBmb28gPSBcXCdiYXJcXCc7XFxuXFxuICAgIEB0YWdcXG4gKi8nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICd0eXBlJzogJ2NvZGUnLFxuICAgICAgICAgICAgICAgICdyYXcnOiAnXFxuXFxuJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdkb2NzJyxcbiAgICAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOiAnIyBUaXRsZVxcblxcbkxvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbmxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbnR5cGUgdGhpbmdzLlxcblxcbkxpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiogTGlrZVxcbiogTGlzdHNcXG5cXG4gICAgdmFyIGNvZGUgPSBcXCdzYW1wbGVzXFwnO1xcblxcbicsXG4gICAgICAgICAgICAgICAgJ3RhZ3MnOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd0YWcnOiAnYXJnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ3tUeXBlfScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnbmFtZSc6ICduYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbi5cXG4nXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd0YWcnOiAnYXJnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ3tUeXBlfScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnbmFtZSc6ICduYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAndGFnJzogJ2FyZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAndHlwZSc6ICd7VHlwZX0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ25hbWUnOiAnbmFtZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbidcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3RhZyc6ICdleGFtcGxlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkZXNjcmlwdGlvbic6ICdcXG5cXG4gICAgdmFyIGZvbyA9IFxcJ2JhclxcJztcXG5cXG4nXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd0YWcnOiAndGFnJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAncmF3JzogJyAgICAvKipcXG4gICAgICogIyBUaXRsZVxcbiAgICAgKlxcbiAgICAgKiBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gICAgICogbGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxuICAgICAqIHR5cGUgdGhpbmdzLlxcbiAgICAgKlxcbiAgICAgKiBMaWtlIG1vcmUgcGFyYWdyYXBocy5cXG4gICAgICpcXG4gICAgICogKiBMaWtlXFxuICAgICAqICogTGlzdHNcXG4gICAgICpcXG4gICAgICogICAgIHZhciBjb2RlID0gXFwnc2FtcGxlc1xcJztcXG4gICAgICpcXG4gICAgICogQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG4gICAgICogQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAqICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAgICAgKiBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICogICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAgICAqXFxuICAgICAqICAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcbiAgICAgKlxcbiAgICAgKiBAZXhhbXBsZVxcbiAgICAgKlxcbiAgICAgKiAgICAgdmFyIGZvbyA9IFxcJ2JhclxcJztcXG4gICAgICpcXG4gICAgICogQHRhZ1xcbiAgICAgKi8nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICd0eXBlJzogJ2NvZGUnLFxuICAgICAgICAgICAgICAgICdyYXcnOiAnXFxuXFxuJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdkb2NzJyxcbiAgICAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOiAnIyBUaXRsZVxcblxcbkxvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbmxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbnR5cGUgdGhpbmdzLlxcblxcbkxpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiogTGlrZVxcbiogTGlzdHNcXG5cXG4gICAgdmFyIGNvZGUgPSBcXCdzYW1wbGVzXFwnO1xcblxcbicsXG4gICAgICAgICAgICAgICAgJ3RhZ3MnOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd0YWcnOiAnYXJnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ3tUeXBlfScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnbmFtZSc6ICduYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbi5cXG4nXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd0YWcnOiAnYXJnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ3tUeXBlfScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnbmFtZSc6ICduYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAndGFnJzogJ2FyZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAndHlwZSc6ICd7VHlwZX0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ25hbWUnOiAnbmFtZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbidcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3RhZyc6ICdleGFtcGxlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkZXNjcmlwdGlvbic6ICdcXG5cXG4gICAgdmFyIGZvbyA9IFxcJ2JhclxcJztcXG5cXG4nXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd0YWcnOiAndGFnJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAncmF3JzogJyAgICAvKipcXG4gICAgIyBUaXRsZVxcblxcbiAgICBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gICAgbGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxuICAgIHR5cGUgdGhpbmdzLlxcblxcbiAgICBMaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4gICAgKiBMaWtlXFxuICAgICogTGlzdHNcXG5cXG4gICAgICAgIHZhciBjb2RlID0gXFwnc2FtcGxlc1xcJztcXG5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICAgICAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbiAgICBAZXhhbXBsZVxcblxcbiAgICAgICAgdmFyIGZvbyA9IFxcJ2JhclxcJztcXG5cXG4gICAgQHRhZ1xcbiAgICAgKi8nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICd0eXBlJzogJ2NvZGUnLFxuICAgICAgICAgICAgICAgICdyYXcnOiAnXFxuXFxuJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdkb2NzJyxcbiAgICAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOiAnIyBUaXRsZVxcblxcbkxvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbmxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbnR5cGUgdGhpbmdzLlxcblxcbkxpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiogTGlrZVxcbiogTGlzdHNcXG5cXG4gICAgdmFyIGNvZGUgPSBcXCdzYW1wbGVzXFwnO1xcblxcbicsXG4gICAgICAgICAgICAgICAgJ3RhZ3MnOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd0YWcnOiAnYXJnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ3tUeXBlfScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnbmFtZSc6ICduYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbi5cXG4nXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd0YWcnOiAnYXJnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ3tUeXBlfScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnbmFtZSc6ICduYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAndGFnJzogJ2FyZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAndHlwZSc6ICd7VHlwZX0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ25hbWUnOiAnbmFtZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbidcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3RhZyc6ICdleGFtcGxlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkZXNjcmlwdGlvbic6ICdcXG5cXG4gICAgdmFyIGZvbyA9IFxcJ2JhclxcJztcXG5cXG4nXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd0YWcnOiAndGFnJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAncmF3JzogJyAgICAvKipcXG4gICAgICAgICMgVGl0bGVcXG5cXG4gICAgICAgIExvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbiAgICAgICAgbGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxuICAgICAgICB0eXBlIHRoaW5ncy5cXG5cXG4gICAgICAgIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiAgICAgICAgKiBMaWtlXFxuICAgICAgICAqIExpc3RzXFxuXFxuICAgICAgICAgICAgdmFyIGNvZGUgPSBcXCdzYW1wbGVzXFwnO1xcblxcbiAgICAgICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG4gICAgICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgICAgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAgICAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgICAgICAgICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuICAgICAgICBAZXhhbXBsZVxcblxcbiAgICAgICAgICAgIHZhciBmb28gPSBcXCdiYXJcXCc7XFxuXFxuICAgICAgICBAdGFnXFxuICAgICovJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdjb2RlJyxcbiAgICAgICAgICAgICAgICAncmF3JzogJ1xcbidcbiAgICAgICAgICAgIH1cbiAgICAgICAgXSk7XG4gICAgfSk7XG59KTtcbiJdfQ==
