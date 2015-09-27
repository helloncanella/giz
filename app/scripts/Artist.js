/*jshint unused:false*/

'use strict';

function Artist(createjs, canvasId) {
  var shape, next;

  this.stage = new createjs.Stage('easeljs');

  this.draw = function(point) {

    if (!shape) {
      shape = new createjs.Shape();
      shape.x = point.x;
      shape.y = point.y;

      shape.graphics.beginStroke('red')
        .moveTo(shape.x, shape.y);

      this.stage.addChild(shape);
      this.stage.update();
    }

    next = {
      x: point.x - shape.x,
      y: point.y - shape.y
    };

    shape.graphics.lineTo(next.x, next.y);

    this.stage.update();

  };

  this.cleanShapeReferene = f

}



function Physics() {

}
