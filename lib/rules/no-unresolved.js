/**
 * @fileOverview Ensures that an imported path exists, given resolution rules.
 * @author Ben Mosher
 */
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreResolve = require('../core/resolve');

var _coreResolve2 = _interopRequireDefault(_coreResolve);

exports['default'] = function (context) {

  function checkSource(node) {
    if (node.source == null) return;

    if ((0, _coreResolve2['default'])(node.source.value, context) == null) {
      context.report(node.source, 'Unable to resolve path to module \'' + node.source.value + '\'.');
    }
  }

  return {
    'ImportDeclaration': checkSource,
    'ExportNamedDeclaration': checkSource,
    'ExportAllDeclaration': checkSource
  };
};

module.exports = exports['default'];