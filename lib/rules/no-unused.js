"use strict";

var
  Map = require("es6-map"),
  Set = require("es6-set");

module.exports = function (context) {
  var
    importSpecifiers = new Map(),
    overwritten = new Set(),
    shadows = new Set(),
    shadowStack = [];

  function captureSpecifier(spec) {
    importSpecifiers.set(spec.local.name, spec.local);
  }
  return {
    "ImportSpecifier": captureSpecifier,
    "ImportDefaultSpecifier": captureSpecifier,
    "ImportNamespaceSpecifier": captureSpecifier,

    "VariableDeclarator": function (v) {
      if (v.id.type !== "Identifier") return;
      shadows.add(v.id.name);
    },

    "AssignmentExpression": function (a) {
      if (a.left.type !== "Identifier") return;
      overwritten.add(a.left.name);
    },

    "BlockStatement": function () {
      shadowStack.push(shadows);
      shadows = new Set(shadows);
    },

    "BlockStatement:exit": function () {
      shadows = shadowStack.pop();
    },

    "CallExpression": function (c) {
      if (c.callee.type !== "Identifier") return; // TODO: member expressions

      if (shadows.has(c.callee.name)) return;

      importSpecifiers.delete(c.callee.name);
    },

    // TODO: for each valid use, if not overwritten or shadowed, remove from map

    "Program:exit": function () {
      // whoever is left is unused
      importSpecifiers.forEach(function (v, k) {
        context.report(v, "Unused import: '" + k + "'.");
      });
    }

  };

};
