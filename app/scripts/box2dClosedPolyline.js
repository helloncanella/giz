/*global Triangulator, b2Vec2, b2FixtureDef, b2PolygonShape, FixtureFactory*/
/*jshint -W106, -W098*/
'use strict';


function Box2dClosedPolyline(fixtureData, stroke, centroid) {

  var origin;

  var
    allFixtures = [],
    triangles = new Triangulator(stroke).getTriangles(),
    fixtureFactory = new FixtureFactory();

  triangles.forEach(function(triangle, index) {

    var shape = fixtureData.shape;
    var density = fixtureData.density || 0;
    var friction = fixtureData.friction || 0;

    var fixture = fixtureFactory.spawn(shape, density, friction);

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

    var b2Vertices = [];
    triangle.forEach(function(point) {
      var vertex = {
        x: point.x - origin.x,
        y: point.y - origin.y
      };
      b2Vertices.push(new b2Vec2(vertex.x, vertex.y));
    });

    fixture.shape.SetAsArray(b2Vertices, b2Vertices.length);
    allFixtures.push(fixture);
  });

  this.getAllFixtures = function() {
    return allFixtures;
  };
}
