'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreGetExports = require('../core/getExports');

exports['default'] = function (context) {

  function checkDefault(specifierType, node) {

    // poor man's Array.find
    var defaultSpecifier = undefined;
    node.specifiers.some(function (n) {
      if (n.type === specifierType) {
        defaultSpecifier = n;
        return true;
      }
    });

    if (!defaultSpecifier) return;
    var imports = (0, _coreGetExports.get)(node.source.value, context);
    if (imports == null) return;

    if (!imports.hasDefault) {
      context.report(defaultSpecifier, 'No default export found in module.');
    }
  }

  return {
    'ImportDeclaration': checkDefault.bind(null, 'ImportDefaultSpecifier'),
    'ExportNamedDeclaration': checkDefault.bind(null, 'ExportDefaultSpecifier')
  };
};

module.exports = exports['default'];