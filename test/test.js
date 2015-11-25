'use strict';

var assert = require('assert');
var babel = require('babel-core');
var plugin = require('../index');
var sinon = require('sinon');

global.myGlobals = {};
var babelOptions = {
  filename: 'foo/Foo.js',
  plugins: [plugin, ['globals', {globalName: 'myGlobals'}]],
  presets: ['es2015']
};

module.exports = {
  setUp: function(done) {
    global.Component = sinon.stub();
    global.Component.prototype.registerMetalComponent = sinon.stub();
    done();
  },

  testPluginExistence: function(test) {
    assert.doesNotThrow(function() {
      babel.transform('var a = 2;', {plugins: [plugin]});
    });
    test.done();
  },

  testClassDeclarationNoSuperClass: function(test) {
    var code = 'class Foo {}\nexport default Foo;\nexport default Foo;';
    var result = babel.transform(code, babelOptions);
    eval.call(global, result.code);
    assert.strictEqual(-1, result.code.indexOf('Foo.prototype.registerMetalComponent(Foo, "Foo")'));
    assert.strictEqual(0, global.Component.prototype.registerMetalComponent.callCount);
    test.done();
  },

  testClassDeclarationNoRegistrationFn: function(test) {
    var code = 'class Bar {}\nclass Foo extends Bar {}\nexport default Foo;';
    var result = babel.transform(code, babelOptions);
    eval.call(global, result.code);
    assert.notStrictEqual(-1, result.code.indexOf('Foo.prototype.registerMetalComponent(Foo, "Foo")'));
    assert.strictEqual(0, global.Component.prototype.registerMetalComponent.callCount);
    test.done();
  },

  testClassDeclarationWithRegistrationFn: function(test) {
    var code = 'class Foo extends Component {}\nexport default Foo;';
    var result = babel.transform(code, babelOptions);
    eval.call(global, result.code);
    assert.notStrictEqual(-1, result.code.indexOf('Foo.prototype.registerMetalComponent(Foo, "Foo")'));
    assert.strictEqual(1, global.myGlobals.Foo.prototype.registerMetalComponent.callCount);
    assert.strictEqual(global.myGlobals.Foo, global.myGlobals.Foo.prototype.registerMetalComponent.args[0][0]);
    test.done();
  },

  testClassExpressionNoSuperClass: function(test) {
    var code = 'var MyFoo = class Foo {}\nexport default MyFoo;';
    var result = babel.transform(code, babelOptions);
    eval.call(global, result.code);
    assert.strictEqual(-1, result.code.indexOf('MyFoo.prototype.registerMetalComponent(MyFoo, "MyFoo")'));
    assert.strictEqual(0, global.Component.prototype.registerMetalComponent.callCount);
    test.done();
  },

  testClassExpressionNoRegistrationFn: function(test) {
    var code = 'class Bar {}\nvar MyFoo = class Foo extends Bar {}\nexport default MyFoo;';
    var result = babel.transform(code, babelOptions);
    eval.call(global, result.code);
    assert.notStrictEqual(-1, result.code.indexOf('MyFoo.prototype.registerMetalComponent(MyFoo, "MyFoo")'));
    assert.strictEqual(0, global.Component.prototype.registerMetalComponent.callCount);
    test.done();
  },

  testClassExpressionWithRegistrationFn: function(test) {
    var code = 'var MyFoo = class Foo extends Component {}\nexport default MyFoo;';
    var result = babel.transform(code, babelOptions);
    eval.call(global, result.code);
    assert.notStrictEqual(-1, result.code.indexOf('MyFoo.prototype.registerMetalComponent(MyFoo, "MyFoo")'));
    assert.strictEqual(1, global.myGlobals.Foo.prototype.registerMetalComponent.callCount);
    assert.strictEqual(global.myGlobals.Foo, global.myGlobals.Foo.prototype.registerMetalComponent.args[0][0]);
    test.done();
  }
};
