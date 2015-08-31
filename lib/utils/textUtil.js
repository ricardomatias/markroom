module.exports.wordCount = function wordCount(text) {
  return (text.match(/\w+/g) || '').length;
};

module.exports.toTitle = function toTitle(text) {
  return text[0].toUpperCase() + text.substr(1, text.length);
};
