'use strict';

const path = require('path');

const electron = require('app');
const window = require('electron-window');

// report crashes to the Electron project
require('crash-reporter').start();

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

var mainWindow;

function onReady(win) {
  const menus = require('./app/menus');

  menus(electron, win);
}

function createWin(callback) {
  mainWindow = window.createWindow({
    resizable: true,
    title: 'Markroom'
  });

  mainWindow.maximize();

  var indexPath = path.resolve(__dirname, 'index.html');

  mainWindow.showUrl(indexPath, function () {
    callback(mainWindow);
  });
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
  console.log(this);

	mainWindow = createWin(onReady);
});

