'use strict';

var ipc = require('ipc');

function Text(app) {
  this.parser = app.parser;

  // Open
  ipc.on('file.open', function(txt) {
    var writeView = app.writeView,
        readView = app.readView,
        rightbar = app.rightbar,
        textarea = writeView.$el.firstChild,
        parsedText;

    this.parser.reset();

    parsedText = this.parser.replaceUrls(txt);

    if (parsedText) {
      txt = parsedText;
    }

    textarea.value = txt;

    this.set(txt);

    rightbar.changed();

    writeView.changed();

    readView.toMarkdown();

    readView.changed();
  }.bind(this));

  // Save
  ipc.on('file.save', function() {
    this.save();

  }.bind(this));
}

Text.prototype.set = function set(text) {
  this.text = text;
};

Text.prototype.get = function get() {
  return this.text;
};

Text.prototype.save = function save() {
  ipc.send('text.save', this.text);
};

Text.prototype.length = function length() {
  return this.text.length;
};

Text.prototype.wordCount = function wordCount() {
  return (this.text.match(/\w+/g) || '').length;
};

module.exports = Text;
