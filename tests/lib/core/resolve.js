'use strict'

var expect = require('chai').expect
  , resolve = require('../../../lib/core/resolve')

var utils = require('../../utils')

describe('resolve', function () {
  it('should throw on bad parameters.', function () {
    expect(resolve.bind(null, null, null)).to.throw(Error)
  })

  it('respects import/resolve extensions', function () {
    var file = resolve( './jsx/MyCoolComponent'
                      , utils.testContext({ 'import/resolve': { 'extensions': ['.jsx'] }})
                      )

    expect(file).to.equal(utils.testFilePath('./jsx/MyCoolComponent.jsx'))
  })
})
