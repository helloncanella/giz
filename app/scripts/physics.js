/*jshint unused:false*/
/*jshint -W106*/
/*global Classifier, Chainer, b2FixtureDef, b2PolygonShape, b2BodyDef, b2Body,
  b2Vec2, ClosedFreeForm, OpenedFreeForm*/

'use strict';

function Physics(world) {

  var insertedBodies = 0;

  this.insertIntoWorld = function(stroke) {

    var bodyDef = defineBody('dynamic', stroke[0], {id: insertedBodies});
    var body = world.CreateBody(bodyDef);

    insertedBodies++;

    var basicFixture = setupBasicFixture('polygon', 0.3, 1);

    var allFixtures = getAllFixtures(basicFixture,stroke);

    allFixtures.forEach(function(fixture) {
      body.CreateFixture(fixture);
    });

    return body;
  };

  var defineBody = function(type, position, userData) {
    var bodyDef = new b2BodyDef();

    if (type === 'dynamic') {
      bodyDef.type = b2Body.b2_dynamicBody;
    } else {
      bodyDef.type = b2Body.b2_static;
    }
    bodyDef.position = new b2Vec2(position.x, position.y);
    bodyDef.userData = Object.assign({}, userData);

    return bodyDef;
  };

  var setupBasicFixture = function(shape, friction, density) {
    var fixture = new b2FixtureDef();
    fixture.friction = friction;
    fixture.density = density;
    switch (shape) {
      case 'polygon':
        fixture.shape = new b2PolygonShape();
        break;
      case 'circle':
        break;
    }

    return fixture;
  };

  var getAllFixtures = function(basicFixture,stroke) {

    var allFixtures;

    var classifier = new Classifier();
    var openOrClosed = classifier.openedOrClosed(stroke);

    if (openOrClosed === 'closed') {
      var closedFreeForm = new ClosedFreeForm(basicFixture,stroke);
      allFixtures = closedFreeForm.getAllFixtures();
    } else {
      var openedFreeForm = new OpenedFreeForm(basicFixture,stroke);
      allFixtures = openedFreeForm.getAllFixtures();
    }

    return allFixtures;
  };




}
