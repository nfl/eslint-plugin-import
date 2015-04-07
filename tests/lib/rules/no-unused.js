"use strict";

var linter = require("eslint").linter,
    ESLintTester = require("eslint-tester");

var eslintTester = new ESLintTester(linter);

var test = require("../../utils").test;

eslintTester.addRuleTest("lib/rules/no-unused", {
  valid: [
    test({code: "import { foo } from './empty-module'; foo();"})
  ],

  invalid: [
    test({code: "import { foo } from './empty-module';",
      errors: [{message: "Unused import: 'foo'.", type: "Identifier"}]}),
    test({code: "import { a } from './named-exports';",
      errors: [{message: "Unused import: 'a'.", type: "Identifier"}]})
  ]
});
