'use strict';

var browser = require('../util/browser');


function EditorActions(editor) {

  browser.on('editor.actions', function(payload) {
    switch (payload.event) {
      case 'file.open':
        editor.openDiagram();
        break;
      case 'file.save':
        editor.save(payload.data.create);
        break;
      case 'editor.undo':
        editor.undo();
        break;
      case 'editor.redo':
        editor.redo();
        break;

      case 'selections.word':
        editor.redo();
        break;
      case 'selections.line':
        editor.redo();
        break;

      case 'stylings.bold':
        editor.redo();
        break;
      case 'stylings.italic':
        editor.redo();
        break;
      case 'stylings.code.inline':
        editor.redo();
        break;
      case 'stylings.code.block':
        editor.redo();
        break;

      case 'snippets.link':
        editor.redo();
        break;
      case 'snippets.image':
        editor.redo();
        break;
      default:
      return;
    }
  });
}

module.exports = EditorActions;
