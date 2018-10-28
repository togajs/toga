# trifle

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url]

A source-agnostic [AST][ast] modifier. Accepts any plain old JavaScript object, visits any node with a `type` property, and lets you modify it reducer style.

## Install

```
$ npm install --save @toga/trifle
```

## Usage

```js
import trifle from '@toga/trifle';

const oldAst = {
  "type": "Program",
  "start": 0,
  "end": 16,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 16,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 4,
          "end": 15,
          "id": {
            "type": "Identifier",
            "start": 4,
            "end": 7,
            "name": "foo"
          },
          "init": {
            "type": "Literal",
            "start": 10,
            "end": 15,
            "value": "bar",
            "raw": "'bar'"
          }
        }
      ],
      "kind": "var"
    }
  ],
  "sourceType": "module"
};

const newAst = trifle(oldAst, (node, meta) => {
  console.log('visited', meta.path);

  switch (node.type) {
    case 'Literal':
      // delete it
      return ;

    case 'Identifier':
      // change it
      return {
        ...node,
        name: 'baz'
      };

    default:
      // keep it
      return node;
  }
});
```

## API

### `trifle(ast, visitor): Object`

- `ast` `{Object}` - An object representing any [AST][ast] where nodes have a `type` property.
- `visitor` `{Function(node, meta): Object?}` - A function to be called with each node in the tree.
  - `node` `{Object}` - The original object from the AST. Return the node, a new node, or `undefined` to delete it.
  - `meta` `{Object}` - Information about the current node including the path, references to parent nodes, etc. See the [`traverse` context documentation][traverse] for a full list of available properties and methods.

----

MIT © [Shannon Moeller](http://shannonmoeller.com) (shannonmoeller.com)

[ast]:           https://en.wikipedia.org/wiki/Abstract_syntax_tree
[doctree]:       https://github.com/togajs/doctree
[traverse]:      https://github.com/substack/js-traverse#context

[downloads-img]: http://img.shields.io/npm/dm/@toga/toga.svg?style=flat-square
[npm-img]:       http://img.shields.io/npm/v/@toga/toga.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/@toga/toga
