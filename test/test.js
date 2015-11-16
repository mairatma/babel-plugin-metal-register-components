'use strict';

var assert = require('assert');
var babel = require('babel-core');
var plugin = require('../index');

module.exports = {
  testPluginExistence: function(test) {
    assert.doesNotThrow(function() {
      babel.transform('var a = 2;', {plugins: [plugin]});
    });
    test.done();
  }
};
