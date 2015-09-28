/*global poly2tri*/
/*jshint unused:false*/

'use strict';

function Triangulator(stroke) {
  var first = 0;
  var last = stroke.length-1;

  if(stroke[first].x === stroke[last].x && stroke[first].y === stroke[last].y){
    stroke.splice(0,1);
  }

  var contour = [];

  stroke.forEach(function(element) {
    var component = new poly2tri.Point(element.x, element.y);
    contour.push(element);
  });

  var swctx = new poly2tri.SweepContext(contour);

  swctx.triangulate();
  var triangles = swctx.getTriangles();

  var triangleCollection = [];
  triangles.forEach(function(triangle, i) {

    triangleCollection[i] = [];

    triangle.getPoints().forEach(function(point) {
      triangleCollection[i].push({
        x: point.x,
        y: point.y
      });
    });

  });

  this.getTriangles = function () {
    return triangleCollection;
  };

  this.numberOfTriangles = function(){
    return triangleCollection.length;
  };

  this.getTringleWithIndex = function (i) {
    return triangleCollection[i];
  };


}
