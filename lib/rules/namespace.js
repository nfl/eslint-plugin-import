'use strict';

var _Map = require('babel-runtime/core-js/map')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreGetExports = require('../core/getExports');

var _importDeclaration = require('../importDeclaration');

var _importDeclaration2 = _interopRequireDefault(_importDeclaration);

exports['default'] = function (context) {

  var namespaces = new _Map();

  function getImportsAndReport(namespace) {
    var declaration = (0, _importDeclaration2['default'])(context);

    var imports = (0, _coreGetExports.get)(declaration.source.value, context);
    if (imports == null) return null;

    if (imports.named.size === 0) {
      context.report(namespace, 'No exported names found in module \'' + declaration.source.value + '\'.');
    }

    return imports;
  }

  return {
    'ImportNamespaceSpecifier': function ImportNamespaceSpecifier(namespace) {
      var imports = getImportsAndReport(namespace);
      if (imports == null) return;
      namespaces.set(namespace.local.name, imports.named);
    },

    // same as above, but does not add names to local map
    'ExportNamespaceSpecifier': function ExportNamespaceSpecifier(namespace) {
      getImportsAndReport(namespace);
    },

    // todo: check for possible redefinition

    'MemberExpression': function MemberExpression(dereference) {
      if (dereference.object.type !== 'Identifier') return;
      if (!namespaces.has(dereference.object.name)) return;

      if (dereference.parent.type === 'AssignmentExpression' && dereference.parent.left === dereference) {
        context.report(dereference.parent, 'Assignment to member of namespace \'' + dereference.object.name + '\'.');
      }

      if (dereference.computed) {
        context.report(dereference.property, 'Unable to validate computed reference to imported namespace \'' + dereference.object.name + '\'.');
        return;
      }

      var namespace = namespaces.get(dereference.object.name);
      if (!namespace.has(dereference.property.name)) {
        context.report(dereference.property, '\'' + dereference.property.name + '\' not found in imported namespace ' + dereference.object.name + '.');
      }
    }
  };
};

module.exports = exports['default'];