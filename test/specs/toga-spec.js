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
        var ignore = fs.readFileSync(__dirname + '/../fixtures/ignore.js', 'utf8');
        expect(toga(ignore));
    });

    it('should parse empty blocks', function() {
        var empty = fs.readFileSync(__dirname + '/../fixtures/empty.js', 'utf8');

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
        var desc = fs.readFileSync(__dirname + '/../fixtures/desc.js', 'utf8');

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
        var tag = fs.readFileSync(__dirname + '/../fixtures/tag.js', 'utf8');

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
        var arg = fs.readFileSync(__dirname + '/../fixtures/arg.js', 'utf8');

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
        var type = fs.readFileSync(__dirname + '/../fixtures/type.js', 'utf8');

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
        var name = fs.readFileSync(__dirname + '/../fixtures/name.js', 'utf8');

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
        var indent = fs.readFileSync(__dirname + '/../fixtures/indent.js', 'utf8');

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
