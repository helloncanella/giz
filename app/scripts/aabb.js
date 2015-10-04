/*jshint unused:false*/
'use strict';

function AABB(shapeData) {
  var aabb, highest, lowest, point;

  var label = shapeData.label;
  var measures = shapeData.measures;

  switch (label) {
    case 'circle':
      var center = measures.center;
      var radius = measures.radius;

      lowest = {
        x: center.x - radius,
        y: center.y - radius
      };
      highest = {
        x: center.x + radius,
        y: center.y + radius
      };

      break;
    case 'polyline':

      var points = measures.points;

      points.forEach(function(element) {
        point = element;
        if (!lowest && !highest) {
          lowest = JSON.parse(JSON.stringify(point));
          highest = JSON.parse(JSON.stringify(point));
        }
        if (point.x > highest.x) {
          highest.x = point.x;
        }
        if (point.x < lowest.x) {
          lowest.x = point.x;
        }
        if (point.y > highest.y) {
          highest.y = point.y;
        }
        if (point.y < lowest.y) {
          lowest.y = point.y;
        }
      }, this);

      break;
    default:
      break;
  }


  this.topLeft = {
    x: lowest.x,
    y: lowest.y
  };
  this.width = highest.x - lowest.x;
  this.height = highest.y - lowest.y;

}
