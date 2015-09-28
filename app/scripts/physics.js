/*jshint unused:false*/
/*jshint -W106*/
/*global Classifier, Triangulator, Chainer, b2FixtureDef, b2PolygonShape, b2BodyDef, b2Body, b2Vec2*/

'use strict';

function Physics() {

  var insertedBodies = 0;

  this.insertIntoWorld = function(stroke) {
    var first = stroke[0];

    var bodyDef = new b2BodyDef();
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.position = new b2Vec2(first.x, first.y);
    bodyDef.userData = {
      id: insertedBodies
    };

    var fixture = new b2FixtureDef();
    fixture.shape = new b2PolygonShape();

    var body = this.prepareBody(stroke);
  };

  this.prepareBody = function(stroke) {
    var classifier = new Classifier();
    var openOrClosed = classifier.openedOrClosed(stroke);

    if (openOrClosed === 'closed') {
      var triangulator = new Triangulator(stroke);
      var triangles = triangulator.getTriangles();

      var b2Vertices = [];

      triangles.forEach(function (triangle) {
        triangle.forEach(function (point) {
          var vertex =    
        });
      });

    } else {
      var chain = new Chainer(stroke);
    }
  };


}
