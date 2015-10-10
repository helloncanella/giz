/*jshint -W106, -W098*/
/*global b2Body, b2Vec2, Box2dOpenedPolyline, Box2dClosedPolyline, b2BodyDef,
 Box2dCircle*/

'use strict';

function Physics(world) {

  var insertedBodies = 0;

  this.insertIntoWorld = function(stroke, type) {
    insertedBodies++;

    var id = insertedBodies;

    var bodyDef = defineBody(stroke, type, id);
    var body = world.CreateBody(bodyDef);

    var allFixtures = getAllFixtures(stroke, id);

    allFixtures.forEach(function(fixture) {
      body.CreateFixture(fixture);
    });

    var position = body.GetWorldCenter();
    var centroid = stroke.centroid;

    if(centroid){
      console.log(id, position.x*30 - centroid.x*30, position.y*30 - centroid.y*30);
    }


  };

  this.getListOfBodies = function() {
    var
      listOfBodies = [],
      bodyDataArray = [];

    var firstBody = world.GetBodyList();
    listOfBodies.push(firstBody);

    var nextBody = firstBody.m_next;
    while (nextBody) {
      if (nextBody.m_mass !== 0) {
        listOfBodies.push(nextBody);
      }
      nextBody = nextBody.GetNext();
    }

    listOfBodies.forEach(function(body, i, listOfBodies) {
      var centroidPosition = body.GetWorldCenter();
      var PI = Math.PI;

      var bodyData = {
        x: centroidPosition.x,
        y: centroidPosition.y,
        angle: body.GetAngle() * 180 / PI
      };

      var id = body.GetUserData();
      bodyDataArray[id] = bodyData;

    });


    return bodyDataArray;
  };

  var defineBody = function(stroke, type, id) {
    var bodyDef = new b2BodyDef();

    var label = stroke.label;

    var centroid = stroke.centroid;

    bodyDef.position = new b2Vec2(centroid.x, centroid.y);

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
        var centroid = stroke.centroid;
        var isOpened = stroke.opened;
        if (isOpened) {
          shape = new Box2dOpenedPolyline(fixtureData, points, centroid);
        } else {
          var triangles = stroke.measures.triangles;
          shape = new Box2dClosedPolyline(fixtureData, points, centroid);
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
