'use strict'

var Set = require('es6-set')

function message(name) {
  return 'Reassignment of local imported name \'' + name + '\'.'
}

module.exports = function (context) {
  var
    locals = new Set(),
    namespaces = new Set()

  function checkIdentifier(id) {
    if (locals.has(id.name)) context.report(id, message(id.name))
  }

  return {
    'ImportSpecifier': function (node) {
      checkIdentifier(node.local)
      locals.add(node.local.name)
    },

    'ImportDefaultSpecifier': function (node) {
      checkIdentifier(node.local)
      locals.add(node.local.name)
    },

    'ImportNamespaceSpecifier': function (node) {
      checkIdentifier(node.local)
      locals.add(node.local.name)
      namespaces.add(node.local.name)
    },

    'AssignmentExpression': function (node) {
      switch (node.left.type) {
        case 'Identifier':
          checkIdentifier(node.left)
          break

        case 'MemberExpression':
          if (node.left.object.type !== 'Identifier') break
          if (namespaces.has(node.left.object.name)) {
            context.report(node.left,
              'Assignment to member of namespace \'' +
              node.left.object.name + '\'.')
          }
          break
      }
    },

    'FunctionDeclaration': function (fn) {
      if (fn.id != null) checkIdentifier(fn.id)

      fn.params.forEach(function (p) {
        if (p.type !== 'Identifier') return
        checkIdentifier(p)
      })
    },

    'VariableDeclarator': function (vr) {
      if (vr.id.type !== 'Identifier') return
      checkIdentifier(vr.id)
    },

    // todo: destructuring assignment
    'ObjectPattern': function (o) {
      o.properties.forEach(function (p) {
        if (p.value.type === 'Identifier') checkIdentifier(p.value)
        // apparently in `var { foo }`, this fills the key and value fields
        // else if (p.key.type === 'Identifier') checkIdentifier(p.key)
      })
    },

    'ArrayPattern': function (a) {
      a.elements.forEach(function (p) {
        if (p && p.type === 'Identifier') checkIdentifier(p)
      })
    }
  }
}
