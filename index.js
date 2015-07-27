'use strict';

const path = require('path');

const electron = require('app');
const browserWindow = require('electron-window');

// report crashes to the Electron project
require('crash-reporter').start();

var mainWindow;

function onReady(win) {
  const menus = require('./app/menus');

  menus(win);
}

function createWin(callback) {
  mainWindow = browserWindow.createWindow({
    resizable: true,
    title: 'Markroom'
  });

  mainWindow.maximize();

  var indexPath = path.resolve(__dirname, 'index.html');

  mainWindow.showUrl(indexPath, function () {
    callback(mainWindow);
  });

  return mainWindow;
}

electron.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		electron.quit();
	}
});

electron.on('activate-with-no-open-windows', function () {
	if (!mainWindow) {
		mainWindow = createWin(onReady);
	}
});

electron.on('ready', function () {
	mainWindow = createWin(onReady);
});

