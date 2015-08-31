'use strict';

var expect = require('chai').expect;

var fs = require('fs');

var Parser = require('../../../lib/features/parser');

var imagesTxt = fs.readFileSync('./test/fixtures/images.txt', { encoding: 'utf-8' });
var gulpMD = fs.readFileSync('./test/fixtures/gulp.md', { encoding: 'utf-8' });
var mixed = fs.readFileSync('./test/fixtures/mixed.txt', { encoding: 'utf-8' });

describe('features/parser', function () {
  var parser;

  beforeEach(function() {
    parser = new Parser();
  });

  describe('unit', function () {

    it('should be an image', function () {
      // given
      var jpg = 'https://semancha.files.wordpress.com/2013/09/puma.jpg',
          gif = 'http://i.thelocalpeople.co.uk/274777/article/images/1974862/1414385.gif',
          jpeg = 'http://www.sporteve-foto.nl/wp-content/uploads/2013/10/25b867c0b3e39916cddad8b23967aa82.jpeg',
          png = 'https://upload.wikimedia.org/wikipedia/commons/7/73/Lion_waiting_in_Namibia.png';

      // then
      expect(parser.isImage(jpg)).to.be.true;
      expect(parser.isImage(gif)).to.be.true;
      expect(parser.isImage(jpeg)).to.be.true;
      expect(parser.isImage(png)).to.be.true;
    });

    it('should return images', function () {
      // given
      var parsed = parser.replaceUrls(mixed);

      // when
      var images = parser.getImages();

      // then
      expect(images).to.have.length(5);
    });

  });

  describe('integration', function () {
    it('should wrap url', function () {
      // given
      var text = 'https://github.com/Matt-Esch/virtual-dom',
          parsed;

      // when
      parsed = parser.replaceUrls(text);

      // then
      expect(parsed).to.include('[](https://github.com/Matt-Esch/virtual-dom)');
    });

    it('should wrap image url', function () {
      // given
      var text = 'https://semancha.files.wordpress.com/2013/09/puma.jpg',
          parsed;

      // when
      parsed = parser.replaceUrls(text);

      // then
      expect(parsed).to.include('![](https://semancha.files.wordpress.com/2013/09/puma.jpg)');
    });

    it('should wrap all images', function () {
      // when
      parser.replaceUrls(imagesTxt);

      // then
      expect(parser.urls).to.have.length(8);
    });

    it('should remove wrapped images', function () {
      // given
      parser.replaceUrls(imagesTxt);

      // when
      parser.replaceUrls('');

      // then
      expect(parser.urls).to.be.empty;
    });
  });

});
