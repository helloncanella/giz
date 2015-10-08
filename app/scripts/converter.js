/*jshint unused:false*/

'use strict';

function Converter() {
  this.canvasToBox2d = function(shape, type, scale) {

    var label = shape.label;

    var measures = shape.measures;

    switch (label) {
      case 'polyline':
        var points = measures.points;
        var body = [];
        points.forEach(function(point, i) {
          body[i]= Object.assign({},point);
          body[i].x = point.x / scale;
          body[i].y = point.y / scale;
          points[i]=body[i];
        });

        var areThereTriangles = measures.hasOwnProperty('triangles');

        if(areThereTriangles){
          var triangles = measures.triangles;

          triangles.forEach(function(triangle) {
            triangle.forEach(function (point) {
              point.x /= scale;
              point.y /= scale;
            });
          });
          
        }

        break;
      case 'circle':
        measures.center.x /= scale ;
        measures.center.y /= scale ;
        measures.radius /= scale;
        break;
      default:
    }

    //Specifying if the body will be dynamic or static
    shape.type = type;

    var convertedShape = shape;


    return convertedShape;
  };
}
