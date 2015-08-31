'use strict';

var inherits = require('inherits'),
    urlRegex = require('url-regex'),
    difference = require('lodash/array/difference'),
    filter = require('lodash/collection/filter');

var EventBus = require('../services/eventBus').eventBus;

var getBoundary = require('../utils/boundary');


function Parser(writeView) {
  EventBus.call(this);

  this.writeView = writeView;

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

inherits(Parser, EventBus);


Parser.prototype.reset = function() {
  this.urls = [];
};

Parser.prototype.isImage = function(url) {
  return /(jpg|gif|jpeg|png)$/.test(url);
};

Parser.prototype.getImages = function() {
  return filter(this.urls, function(url) {
    return this.isImage(url);
  }, this);
};

Parser.prototype.parseUrls = function(text) {
  var matches = text.match(urlRegex());

  matches = (matches || []).map(function(url) {
    return url.replace(new RegExp(/(?:[^\w])+$/), '');
  });

  return matches;
};

Parser.prototype.wrapUrl = function(text, url) {
  var escapedUrl = url.replace(/\?/, '\\?').replace(/\#/, '\\#'),
      idx = text.match(escapedUrl).index,
      len = url.length,
      wraping;

  if (this.isImage(url)) {
    wraping = this.snippets.image(url);

    this.emit('parser.image.add', url);
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

    if (this.isImage(url)) {
      this.emit('parser.image.remove', url);
    } else {
      this.emit('parser.link.remove', url);
    }

  }.bind(this));
};

Parser.prototype.insertWrappedUrls = function(text, diff) {
  var newText = text;

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

  return newText;
};

Parser.prototype.replaceUrls = function(text) {
  var urls,
      diff;

  urls = this.parseUrls(text);

  if (this.urls.length > 0 && this.urls.length !== urls.length) {
    this.sync(this.urls, urls);
  }

  // when there are no new parsed urls
  if ((diff = difference(urls, this.urls)).length === 0 || this.urls.length === urls.length) {
    return text;
  }

  if (diff.length === 0) {
    diff = urls;
  }

  this.urls = urls;

  return this.insertWrappedUrls(text, diff);
};


module.exports = Parser;
