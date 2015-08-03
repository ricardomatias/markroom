'use strict';

var urlRegex = require('url-regex');

var difference = require('lodash/array/difference');

var getBoundary = require('../utils/boundary');


function Parser(app) {

  this.app = app;

  this.snippets = {
    link: function(url) {
      return '[](' + url + ')';
    },
    image: function(url) {
      return '![](' + url + ')';
    }
  };

  this.urls = [];
}

Parser.prototype.reset = function() {
  this.urls = [];
};

Parser.prototype.parseUrls = function(text) {
  var matches = text.match(urlRegex());

  matches = matches.map(function(url) {
    return url.replace(new RegExp(/(?:[^\w])+$/), '');
  });

  this.app.emit('parser.urls', matches);

  return matches;
};

Parser.prototype.wrapUrl = function(text, url) {

  var idx = text.match(url).index,
      len = url.length,
      wraping;

  if (this.isImage(url)) {
    wraping = this.snippets.image(url);
  } else {
    wraping = this.snippets.link(url);
  }

  return {
    start: idx,
    end: idx + len,
    string: wraping
  };
};

Parser.prototype.sync = function(prev, curr) {
  var diff = difference(prev, curr);

  if (diff.length === 0) {
    return;
  }

  diff.forEach(function(url) {
    var idx = this.urls.indexOf(url);

    this.urls.splice(idx, 1);
  }.bind(this));
};

Parser.prototype.replaceUrls = function(text) {
  var newText = text,
      urls,
      diff;

  urls = this.parseUrls(text);

  if (this.urls.length > 0 && this.urls.length !== urls.length) {
    this.sync(this.urls, urls);
  }

  if ((diff = difference(urls, this.urls)).length === 0 || this.urls.length === urls.length) {
    return false;
  }

  if (diff.length === 0) {
    diff = urls;
  }

  diff.forEach(function(url) {
    var snippet = this.wrapUrl(newText, url),
        selBoundary = getBoundary(newText, snippet.start - 1, snippet.end, true, /[^\(\)]/);

    if (newText.substr(selBoundary.start, selBoundary.end - selBoundary.start) !== url) {
      return;
    }

    var firstHalf = newText.substr(0, snippet.start),
        secondHalf = newText.substr(snippet.end, newText.length);

    newText = firstHalf + snippet.string + secondHalf;
  }.bind(this));

  this.urls = urls;

  return newText;
};

Parser.prototype.isImage = function(url) {
  return /jpg$|gif$|jpeg$|png$/.test(url);
};

module.exports = Parser;
