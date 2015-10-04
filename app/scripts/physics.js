/*jshint unused:false*/
/*jshint -W106*/
/*global Classifier, Chainer, b2FixtureDef, b2PolygonShape, b2BodyDef,
  b2Body, b2Vec2, Box2dOpenedPolyline, Box2dClosedPolyline, Box2dCircle*/

'use strict';

function Physics(world) {

  var insertedBodies = 0;

  this.insertIntoWorld = function(stroke) {

    var bodyDef = defineBody(stroke);
    var body = world.CreateBody(bodyDef);

    insertedBodies++;

    var id = insertedBodies;

    var allFixtures = getAllFixtures(stroke, id);

    allFixtures.forEach(function(fixture) {
      body.CreateFixture(fixture);
    });

  };

  this.getListOfBodies = function() {
    var listOfBodies = [];

    var firstBody = world.GetBodyList();
    listOfBodies.push(firstBody);

    var nextBody = firstBody.m_next;
    while (nextBody) {
      if (nextBody.m_mass !== 0) {
        listOfBodies.push(nextBody);
      }
      nextBody = nextBody.GetNext();
    }

    return listOfBodies;
  };

  var defineBody = function(stroke, id) {
    var bodyDef = new b2BodyDef();

    bodyDef.type = b2Body.b2_dynamicBody;

    var label = stroke.label;

    switch (label) {
      case 'polyline':
        var start = stroke.measures.points[0];
        bodyDef.position = new b2Vec2(start.x, start.y);
        break;
      case 'circle':
        var center = stroke.measures.center;
        bodyDef.position = new b2Vec2(center.x, center.y);
        break;
      default:
    }

    bodyDef.userData = id;

    return bodyDef;
  };



  var getAllFixtures = function(stroke) {

    var allFixtures, shape;

    var fixtureData = {
      friction: 0.3,
      density: 1
    };

    var label = stroke.label;

    switch (label) {
      case 'polyline':
        fixtureData.shape = 'polygon';
        var points = stroke.measures.points;
        var isOpened = stroke.opened;
        if (isOpened) {
          shape = new Box2dOpenedPolyline(fixtureData, points);
        } else {
          shape = new Box2dClosedPolyline(fixtureData, points);
        }
        break;
      case 'circle':
        var radius = stroke.measures.radius;
        fixtureData.shape = 'circle';
        shape = new Box2dCircle(fixtureData, radius);
        break;
      default:

    }

    allFixtures = shape.getAllFixtures();

    return allFixtures;
  };




}
