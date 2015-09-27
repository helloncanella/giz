/*jshint unused:false*/
/*global describe, before, expect, it, Converter, Physics, Classifier*/
(function() {
  'use strict';
  var body;

  describe('Converter', function() {
    it('it converts canvas to box2d measures', function() {
      var stroke = [{
        x: 5,
        y: 30
      }, {
        x: 10,
        y: 15
      }, {
        x: 7,
        y: 8
      }, {
        x: 3,
        y: 10
      }];
      var scale = 30;
      var converter = new Converter(stroke, scale);
      body = converter.canvasToBox2d();

      expect(body[0].y).to.equal(1);
      expect(body[3].y).to.equal(10 / 30);
    });
  });

  describe('Classifier', function() {
    it('verifies if a body is opened or closed', function() {
      var bodyOpened = [{
        x: 10,
        y: 15
      }, {
        x: 12,
        y: 17
      }, {
        x: 18,
        y: 27
      }];

      var bodyClosed = bodyOpened.concat({
        x: 10,
        y: 15
      });

      var classifier = new Classifier();

      var opened = classifier.openedOrClosed(bodyOpened);
      expect(opened).to.equal('opened');

      var closed = classifier.openedOrClosed(bodyClosed);
      expect(closed).to.equal('closed');
    });
  });









})();
