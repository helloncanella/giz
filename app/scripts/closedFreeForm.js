/*jshint unused:false*/
/*global Triangulator, b2Vec2*/
/*jshint -W106*/
'use strict';

function ClosedFreeForm (basicFixture,stroke){
  var allFixtures = [];
  var triangles = new Triangulator(stroke).getTriangles();

  triangles.forEach(function(triangle, index) {
    var b2Vertices = [];
    triangle.forEach(function(point) {
      var vertex = {
        x: point.x - stroke[0].x,
        y: point.y - stroke[0].y
      };
      b2Vertices.push(new b2Vec2(vertex.x, vertex.y));
    });
    basicFixture.shape.SetAsArray(b2Vertices, b2Vertices.length);
    allFixtures.push(basicFixture);
  });

  this.getAllFixtures = function(){
    return allFixtures;
  };
}
