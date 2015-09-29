/*jshint unused:false*/
/*global describe, before, expect, it, Converter, Physics, Classifier, b2Vec2,
b2World */
(function() {
  'use strict';
  var body;

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

  var bodyClosed = [{
    x: 481,
    y: 113
  }, {
    x: 481,
    y: 114
  }, {
    x: 481,
    y: 115
  }, {
    x: 481,
    y: 116
  }, {
    x: 481,
    y: 117
  }, {
    x: 481,
    y: 118
  }, {
    x: 482,
    y: 120
  }, {
    x: 483,
    y: 120
  }, {
    x: 484,
    y: 120
  }, {
    x: 481,
    y: 113
  }];


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

      var classifier = new Classifier();

      var opened = classifier.openedOrClosed(bodyOpened);
      expect(opened).to.equal('opened');

      var closed = classifier.openedOrClosed(bodyClosed);
      expect(closed).to.equal('closed');
    });
  });



  describe('Physics', function() {
    var gravity = new b2Vec2(0, 10);
    var world = new b2World(gravity, false);
    var physics = new Physics(world);

    describe('insertBody', function() {
      it('insert closed body into the world', function() {
        var body = physics.insertIntoWorld(bodyClosed);
        expect(body.constructor.name).to.equal('b2Body');
      });
      it('insert opened body', function() {
        var body = physics.insertIntoWorld(bodyOpened);
        expect(body.constructor.name).to.equal('b2Body');
      });
    });

    describe('getListOfBodies', function() {
      it('return correct number of inserted bodieis', function() {
        var allBodies = physics.getListOfBodies();
        expect(allBodies).to.have.length(2);
      });

    });

  });



})();
