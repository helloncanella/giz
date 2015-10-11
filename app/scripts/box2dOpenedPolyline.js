/*jshint unused:false*/
/*global b2Vec2, FixtureFactory*/
'use strict';

function Box2dOpenedPolyline(fixtureData, stroke, centroid) {
  var start, next, origin;
  var fixtureFactory = new FixtureFactory();

  var allFixtures = [];

  if (centroid) {
    origin = {
      x: centroid.x,
      y: centroid.y
    };
  } else {
    origin = {
      x: stroke[0].x,
      y: stroke[0].y
    };
  }


  stroke.forEach(function(point) {
    if (!start) {
      start = new b2Vec2(point.x - origin.x, point.y - origin.y);
    } else {
      next = new b2Vec2(point.x - origin.x, point.y - origin.y);

      var distanceVector = new b2Vec2(next.x - start.x, next.y - start.y);
      var distance = distanceVector.Length();

      var shape = fixtureData.shape;
      var density = fixtureData.density || 0;
      var friction = fixtureData.friction || 0;

      var fixture = fixtureFactory.spawn(shape, density, friction);

      var center = new b2Vec2((next.x + start.x) / 2, (next.y + start.y) / 2);
      var angle = Math.atan2(distanceVector.y, distanceVector.x);

      fixture.shape.SetAsOrientedBox(distance / 2, 0.005, center, angle);
      allFixtures.push(fixture);
      start = next;
    }

  });

  this.getAllFixtures = function() {
    return allFixtures;
  };
}
