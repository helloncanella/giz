/*jshint unused:false*/
/*global b2Vec2*/
'use strict';

function OpenedPolyline(basicFixture, stroke) {
  var start, next;

  var allFixtures = [],
    precision = 1.2; //- value in meters

  stroke.forEach(function(point) {
    if (!start) {

      start = new b2Vec2(point.x, point.y);

    } else {
      next = new b2Vec2(point.x, point.y);

      var distanceVector = new b2Vec2(next.x - start.x, next.y - start.y);
      var distance = distanceVector.Length();

      if (distance >= precision) {
        var center = new b2Vec2((next.x + start.x) / 2, (next.y + start.y) / 2);
        var angle = Math.atan2(distanceVector.y, distanceVector.x);

        basicFixture.shape.SetAsOrientedBox(distance / 2, 0.2, center, angle);
        allFixtures.push(basicFixture);
        start = next;
      }
    }

  });

  this.getAllFixtures = function() {
    return allFixtures;
  };
}
