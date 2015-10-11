/*global Shape, Polyline*/
/*jshint -W098, -W003*/
'use strict';

function Limit(position, width, height) {
  Shape.call(this, position);

  this.data = {
    label: 'polyline',
    measures: {
      points: [{
        x: position.x,
        y: position.y
      }, {
        x: position.x,
        y: position.y + height
      }, {
        x: position.x + width,
        y: position.y + height
      }, {
        x: position.x + width,
        y: position.y
      }],
    },
    centroid: {
      x: position.x + width/2,
      y: position.y + height/2
    },
    opened: false
  };

  var graphics = this.graphics;

  graphics.beginFill('green');

}
Limit.prototype = Object.create(Shape.prototype);

Limit.prototype.constructor = Limit;
