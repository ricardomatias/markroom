'use strict';

// Electron Modules
const Menu = require('menu');
const dialog = require('dialog');

// Services
const File = require('./file');


function saveFile(title, browserWindow, file) {
  dialog.showSaveDialog(browserWindow, {
      title: title,
      filters: [
        { name: 'Markdown', extensions: ['md'] },
      ]
    }, function(filename) {
      if (filename) {
        file.set(filename);

        browserWindow.webContents.send('file.save');
      }
  });
}

function menus(browserWindow, DESKTOP_PATH) {

  var menu = new Menu();

  var file = new File();

  var template = [
    {
      label: 'Electron',
      submenu: [
        {
          label: 'About Markroom',
          selector: 'orderFrontStandardAboutPanel:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          label: 'Hide Electron',
          accelerator: 'Command+H',
          selector: 'hide:'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:'
        },
        {
          label: 'Show All',
          selector: 'unhideAllApplications:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          selector: 'terminate:'
        },
      ]
    },
    {
      label: 'File',
      submenu: [
        {
          label: 'Open File..',
          accelerator: 'Command+O',
          click: function() {
            dialog.showOpenDialog(browserWindow, {
                title: 'Open Markdown file',
                defaultPath: DESKTOP_PATH,
                properties: ['openFile'],
                filters: [
                  { name: 'Markdown', extensions: ['md'] },
                ]
              }, function(filenames) {
                if (filenames) {
                  file.open(browserWindow, filenames);
                }
              });
          }
        },{
          label: 'Save File',
          accelerator: 'Command+S',
          click: function() {
            var filename;

            if ((filename = file.get())) {
              return browserWindow.webContents.send('file.save');
            }
            saveFile('Save file', browserWindow, file);
          }
        },{
          label: 'Save File As..',
          accelerator: 'Command+Shift+S',
          click: function() {
            saveFile('Save file as..', browserWindow, file);
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'Command+Z',
          selector: 'undo:'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+Command+Z',
          selector: 'redo:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Cut',
          accelerator: 'Command+X',
          selector: 'cut:'
        },
        {
          label: 'Copy',
          accelerator: 'Command+C',
          selector: 'copy:'
        },
        {
          label: 'Paste',
          accelerator: 'Command+V',
          selector: 'paste:'
        }
      ]
    },
    {
      label: 'Format',
      submenu: [
        {
          label: 'Bold                      ⌘B'
        },
        {
          label: 'Italic                      ⌘I'
        },
        {
          label: 'Code (Inline)          ⌘U'
        },
        {
          label: 'Code (Block)         ⌘⇧U'
        },
        {
          type: 'separator'
        },
        {
          label: 'Add Link                ⌘K'
        },
        {
          label: 'Add Image (URL)   ⌘⇧K'
        },
      ]
    },
    {
      label: 'Selection',
      submenu: [
        {
          label: 'Select All        ⌘A',
        },
        {
          label: 'Select Word   ⌘D',
        },
        {
          label: 'Select Line     ⌘L',
        },
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: function() {
            browserWindow.reload();
          }
        },
        {
          label: 'Toggle DevTools',
          accelerator: 'Alt+Command+J',
          click: function() {
            browserWindow.toggleDevTools();
          }
        },
      ]
    },
    {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:'
        },
        {
          label: 'Close',
          accelerator: 'Command+W',
          selector: 'performClose:'
        },
        {
          label: 'Fullscreen',
          accelerator: 'Command+Enter',
          click: function() {
            if (browserWindow.isFullScreen()) {
              return browserWindow.setFullScreen(false);
            }

            browserWindow.setFullScreen(true);
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Bring All to Front',
          selector: 'arrangeInFront:'
        }
      ]
    },
    {
      label: 'Help',
      submenu: []
    }
  ];

  menu = Menu.buildFromTemplate(template);

  Menu.setApplicationMenu(menu);
}

module.exports = menus;
