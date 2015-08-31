'use strict';

var expect = require('chai').expect;

var whichAction = require('../../../lib/keyboard/keyActions');

describe('features/keyActions', function () {

  describe('selection', function () {

    it('should return word', function () {
      // given -  Cmd+D
      var evt = {
        keyCode: 'D'.charCodeAt(0),
        metaKey: true
      };

      // then
      expect(whichAction(evt)).to.eql({ type: 'selections', val: 'word' });
    });

  });

  describe('snippets', function () {

    it('should return image', function () {
      // given - Cmd+Shift+K
      var evt = {
        keyCode: 'K'.charCodeAt(0),
        shiftKey: true,
        metaKey: true
      };

      // then
      expect(whichAction(evt)).to.eql({ type: 'snippets', val: 'image' });
    });

  });

});
