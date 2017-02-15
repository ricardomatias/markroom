'use strict';

// Electron Modules
var Menu = require('menu');
var electron = require('app');
var open = require('open');


function menus(browserWindow, fileSystem) {

  var menu = new Menu();

  var template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open File..',
          accelerator: 'Control+O',
          click: function() {
            fileSystem.open(function(err, file) {
              if (err) {
                return fileSystem.handleError(err);
              }
              browserWindow.webContents.send('file.open', null, file);
            });
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Save File',
          accelerator: 'Control+S',
          click: function() {
            browserWindow.webContents.send('editor.actions', {
              event: 'file.save',
              data: {
                create: false
              }
            });
          }
        },
        {
          label: 'Save File As..',
          accelerator: 'Control+Shift+S',
          click: function() {
            browserWindow.webContents.send('editor.actions', {
              event: 'file.save',
              data: {
                create: true
              }
            });
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'Control+Q',
          click: function() {
            electron.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Cut',
          accelerator: 'Control+X',
          role: 'cut'
        },
        {
          label: 'Copy',
          accelerator: 'Control+C',
          role: 'copy'
        },
        {
          label: 'Paste',
          accelerator: 'Control+V',
          role: 'paste'
        },
        {
          type: 'separator'
        },
        {
          label: 'Undo',
          accelerator: 'Control+Z',
          click: function() {
            browserWindow.webContents.send('editor.undo');
          }
        },
        {
          label: 'Redo',
          accelerator: 'Control+Shift+Z',
          click: function() {
            browserWindow.webContents.send('editor.redo');
          }
        }
      ]
    },
    {
      label: 'Selection',
      submenu: [
        {
          label: 'Select Word',
          accelerator: 'Control+D',
          click: function() {
            browserWindow.webContents.send('editor.actions', {
              action: 'selections.word'
            });
          }
        },
        {
          label: 'Select Line',
          accelerator: 'Control+L',
          click: function() {
            browserWindow.webContents.send('editor.actions', {
              action: 'selections.line'
            });
          }
        },
        {
          label: 'Select All',
          accelerator: 'Control+Z',
          role: 'selectall'
        }
      ]
    },
    {
      label: 'Format',
      submenu: [
        {
          label: 'Bold',
          accelerator: 'Control+B',
          click: function() {
            browserWindow.webContents.send('editor.actions', {
              action: 'stylings.bold'
            });
          }
        },
        {
          label: 'Italic',
          accelerator: 'Control+I',
          click: function() {
            browserWindow.webContents.send('editor.actions', {
              action: 'stylings.italic'
            });
          }
        },
        {
          label: 'Code (Inline)',
          accelerator: 'Control+U',
          click: function() {
            browserWindow.webContents.send('editor.actions', {
              action: 'stylings.code.inline'
            });
          }
        },
        {
          label: 'Code (Block)',
          accelerator: 'Control+Shift+U',
          click: function() {
            browserWindow.webContents.send('editor.actions', {
              action: 'stylings.code.block'
            });
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Add Link',
          accelerator: 'Control+K',
          click: function() {
            browserWindow.webContents.send('editor.actions', {
              action: 'snippets.link'
            });
          }
        },
        {
          label: 'Add Image (URL)',
          accelerator: 'Control+Shift+K',
          click: function() {
            browserWindow.webContents.send('editor.actions', {
              action: 'snippets.image'
            });
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Add Image (URL)',
          accelerator: 'Control+Shift+K',
          click: function() {
            browserWindow.webContents.send('editor.actions', {
              action: 'snippets.image'
            });
          }
        },
      ]
    },
    {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Control+M',
          click: function() {
            // browserWindow.webContents.send('editor.actions', { event: 'console.log', data: { evt: evt } });
          }
        },
        {
          label: 'Fullscreen',
          accelerator: 'F11',
          click: function() {
            if (browserWindow.isFullScreen()) {
              return browserWindow.setFullScreen(false);
            }

            browserWindow.setFullScreen(true);
          }
        },
        {
          label: 'Reload',
          accelerator: 'Control+R',
          click: function() {
            browserWindow.reload();
          }
        },
        {
          label: 'Toggle DevTools',
          accelerator: 'F12',
          click: function() {
            browserWindow.toggleDevTools();
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Github Issues',
          click: function() {}
        }
      ]
    }
  ];

  menu = Menu.buildFromTemplate(template);

  Menu.setApplicationMenu(menu);
}

module.exports = menus;
