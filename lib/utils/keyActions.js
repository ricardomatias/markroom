'use strict';

var selections = {
  'Command+D': 'selections.word',
  'Command+L': 'selections.line'
};

var snippets = {
  'Command+K': 'snippets.link',
  'Command+Shift+K': 'snippets.image'
};

var stylings = {
  'Command+B': 'stylings.bold',
  'Command+I': 'stylings.italic',
  'Command+U': 'stylings.code.inline',
  'Command+Shift+U': 'stylings.code.block'
};

function actionType(evt) {
  var action = [];

  if (evt.metaKey) {
    action.push('Command');
  }

  if (evt.shiftKey) {
    action.push('Shift');
  }

  action.push(String.fromCharCode(evt.keyCode));

  return action.join('+');
}

module.exports = function(evt) {
  var action = actionType(evt);

  var feature = selections[action] || snippets[action] || stylings[action];

  if (!feature) {
    return null;
  }

  return {
    type: feature.split('.').shift(),
    val: feature.split('.').splice(1, feature.length).join('.')
  };
};
