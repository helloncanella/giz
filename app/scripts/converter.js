/*jshint unused:false*/

'use strict';

function Converter(stroke, scale) {
  this.canvasToBox2d = function() {
    var body = [];
    stroke.forEach(function(point, i) {
      body[i]= Object.assign({},point);
      body[i].x = point.x / scale;
      body[i].y = point.y / scale;
    });

    return body;
  };
}
