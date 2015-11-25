'use strict';

module.exports = function(babel) {
  var t = babel.types;

  function addComponentRegistrationCode(path, node, classId) {
    // This check is necessary to prevent paths from being handled more than once
    // which can happen because of actions from other plugins. For example, the
    // plugin that handles ES2015 classes sometimes converts class declarations
    // into class expressions, causing them to be readded to the tree and handled
    // again.
    if (node.visitedByMetalRegisterComponents || !node.superClass) {
      return;
    }
    node.visitedByMetalRegisterComponents = true;

    var fnId = t.identifier(classId.name + '.prototype.registerMetalComponent');
    path.insertAfter(t.logicalExpression(
      '&&',
      fnId,
      t.callExpression(fnId, [classId, t.stringLiteral(classId.name)])
    ));
  }

  return {
    visitor: {
      ClassDeclaration: function(path) {
        path.insertAfter(addComponentRegistrationCode(path, path.node, path.node.id));
      },

      VariableDeclaration: function(path) {
        path.node.declarations.forEach(function(declaration) {
          if (t.isClassExpression(declaration.init)) {
            addComponentRegistrationCode(path, declaration.init, declaration.id);
          }
        });
      }
    }
  };
};
