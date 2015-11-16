'use strict';

module.exports = function(babel) {
  var t = babel.types;

  return {
    visitor: {
      /**
       * @param {!NodePath} nodePath
       */
      ClassDeclaration: function(nodePath) {
        console.log('ClassDeclaration', nodePath);
      },

      ClassExpression: function(nodePath) {
        console.log('ClassExpression', nodePath);
      }
    }
  };
};
