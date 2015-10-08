/*jshint -W106, -W098*/
/*global b2Body, b2Vec2, Box2dOpenedPolyline, Box2dClosedPolyline, b2BodyDef,
 Box2dCircle*/

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

    var label = stroke.label;
    var type = stroke.type;

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


    if (type === 'dynamic') {
      bodyDef.type = b2Body.b2_dynamicBody;
    } else {
      bodyDef.type = b2Body.b2_staticBody;
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
          var triangles = stroke.measures.triangles;
          shape = new Box2dClosedPolyline(fixtureData, points, triangles);
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
