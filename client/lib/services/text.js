'use strict';

var ipc = require_electron('ipc');
var inherits = require('inherits');

var findIndex = require('lodash/array/findIndex');

var EventBus = require('../services/eventBus').eventBus;

function Text(app) {
  EventBus.call(this);

  this.parser = app.parser;

  this.text = '';

  this._history = [];
  this._textId = 0;
  this._currentId = 0;

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

  ipc.on('editor.undo', function() {
    this.undo();
  }.bind(this));

  ipc.on('editor.redo', function() {
    this.redo();
  }.bind(this));


  // window.addEventListener('keydown', function(evt) {
  //   // Redo
  //   if (evt.keyCode === 90 && evt.metaKey && evt.shiftKey) {
  //     evt.preventDefault();
  //     evt.stopPropagation();
  //
  //     this.redo();
  //   }
  //
  //   // Undo
  //   if (evt.keyCode === 90 && evt.metaKey && !evt.shiftKey) {
  //     evt.preventDefault();
  //     evt.stopPropagation();
  //
  //     this.undo();
  //   }
  // }.bind(this));
}

inherits(Text, EventBus);


Text.prototype.redo = function () {
  var idx,
      len = this._history.length - 1;

  this._currentId += 1;

  if (this._currentId > len) {
    this.text = this._history[len].text;

    this._currentId = len;
    return;
  }

  idx = findIndex(this._history, 'id', this._currentId);

  this.text = this._history[idx].text;

  this.emit('text.update', this.text);
};

Text.prototype.undo = function () {
  var idx;

  this._currentId -= 1;

  if (this._currentId < 0) {
    this.text = this._history[0].text;

    this._currentId = 0;
    return;
  }

  idx = findIndex(this._history, 'id', this._currentId);

  this.text = this._history[idx].text;

  this.emit('text.update', this.text);
};

Text.prototype.set = function set(text) {
  if (text === this.text) {
    return;
  }

  this.text = text;

  this._history.push({
    id: this._textId,
    text: text
  });

  this._textId += 1;
  this._currentId = this._history.length - 1;
};

Text.prototype.get = function get() {
  return this.text;
};

Text.prototype.length = function length() {
  return this.text.length;
};

Text.prototype.save = function save() {
  ipc.send('text.save', this.text);
};

module.exports = Text;
