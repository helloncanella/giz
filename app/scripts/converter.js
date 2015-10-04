/*jshint unused:false*/

'use strict';

function Converter() {
  this.canvasToBox2d = function(stroke, scale) {
    var body = [];
    stroke.forEach(function(point, i) {
      body[i]= Object.assign({},point);
      body[i].x = point.x / scale;
      body[i].y = point.y / scale;
    });

    return body;
  };
}
