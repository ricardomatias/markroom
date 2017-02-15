'use strict';

var menus = require('./MenusMac');

function MacOSIntegration(app) {

  // editor menu
  app.on('editor-create-menu', function(mainWindow) {
    menus(mainWindow);
  });
}

module.exports = MacOSIntegration;
