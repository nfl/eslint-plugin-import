'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreGetExports = require('../core/getExports');

var _importDeclaration = require('../importDeclaration');

var _importDeclaration2 = _interopRequireDefault(_importDeclaration);

exports['default'] = function (context) {
  function checkDefault(nameKey, defaultSpecifier) {
    var declaration = (0, _importDeclaration2['default'])(context);

    var imports = (0, _coreGetExports.get)(declaration.source.value, context);
    if (imports == null) return;

    if (imports.hasDefault && imports.named.has(defaultSpecifier[nameKey].name)) {

      context.report(defaultSpecifier, 'Using exported name \'' + defaultSpecifier[nameKey].name + '\' as identifier for default export.');
    }
  }
  return {
    'ImportDefaultSpecifier': checkDefault.bind(null, 'local'),
    'ExportDefaultSpecifier': checkDefault.bind(null, 'exported')
  };
};

module.exports = exports['default'];