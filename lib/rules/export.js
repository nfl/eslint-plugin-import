'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _Set = require('babel-runtime/core-js/set')['default'];

var _Map = require('babel-runtime/core-js/map')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreGetExports = require('../core/getExports');

var _coreGetExports2 = _interopRequireDefault(_coreGetExports);

exports['default'] = function (context) {
  var defaults = new _Set(),
      named = new _Map();

  function addNamed(name, node) {
    var nodes = named.get(name);

    if (nodes == null) {
      nodes = new _Set();
      named.set(name, nodes);
    }

    nodes.add(node);
  }

  return {
    'ExportDefaultDeclaration': function ExportDefaultDeclaration(node) {
      defaults.add(node);
    },

    'ExportSpecifier': function ExportSpecifier(node) {
      addNamed(node.exported.name, node.exported);
    },

    'ExportNamedDeclaration': function ExportNamedDeclaration(node) {
      if (node.declaration == null) return;

      if (node.declaration.id != null) {
        addNamed(node.declaration.id.name, node.declaration.id);
      }

      if (node.declaration.declarations != null) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _getIterator(node.declaration.declarations), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var declaration = _step.value;

            if (declaration.id == null) continue;
            addNamed(declaration.id.name, declaration.id);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
              _iterator['return']();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    },

    'ExportAllDeclaration': function ExportAllDeclaration(node) {
      var remoteExports = new _coreGetExports2['default'](context.settings);

      // if false (unresolved), ignore
      if (!remoteExports.captureAll(node, context.getFilename())) return;

      if (remoteExports.named.size === 0) {
        context.report(node.source, 'No named exports found in module \'' + node.source.value + '\'.');
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = _getIterator(remoteExports.named), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _name = _step2.value;

          addNamed(_name, node);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2['return']) {
            _iterator2['return']();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    },

    'Program:exit': function ProgramExit() {
      if (defaults.size > 1) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = _getIterator(defaults), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var node = _step3.value;

            context.report(node, 'Multiple default exports.');
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3['return']) {
              _iterator3['return']();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      }

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = _getIterator(named), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var _step4$value = _slicedToArray(_step4.value, 2);

          var _name2 = _step4$value[0];
          var nodes = _step4$value[1];

          if (nodes.size <= 1) continue;

          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = _getIterator(nodes), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              var node = _step5.value;

              context.report(node, 'Multiple exports of name \'' + _name2 + '\'.');
            }
          } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion5 && _iterator5['return']) {
                _iterator5['return']();
              }
            } finally {
              if (_didIteratorError5) {
                throw _iteratorError5;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4['return']) {
            _iterator4['return']();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }
  };
};

module.exports = exports['default'];