/*jshint unused:false*/
/*global AABB, createjs, $*/

'use strict';

function Artist(canvasId) {
  var shape, next, strokePoints;

  var canvas = $('#'+canvasId);

  this.stage = new createjs.Stage(canvasId);
  this.draw = function(point) {

    if (!shape) {
      shape = new createjs.Shape();
      shape.x = point.x;
      shape.y = point.y;

      shape.graphics.beginStroke('red')
        .moveTo(0, 0);

      this.stage.addChild(shape);
      this.stage.update();
    }

    next = {
      x: point.x - shape.x,
      y: point.y - shape.y
    };

    shape.graphics.lineTo(next.x, next.y);

    this.stage.update();

    return this;
  };

  this.closeOpenedShape = function(stroke) {

    var first = stroke[0],
        last = stroke[stroke.length - 1],
        sqrt = Math.sqrt,
        pow = Math.pow;

      strokePoints = stroke;

    var distance = sqrt(pow(last.x - first.x, 2) + pow(last.y - first.y, 2)),
        precision = 40;

    if (precision > distance) {

      shape.graphics.clear();
      shape.graphics.beginStroke('red').beginFill('red').moveTo(0, 0);

      stroke.forEach(function(element) {
        var point = element;

        shape.graphics.lineTo(point.x-shape.x, point.y-shape.y);

        if (point.x === last.x && point.y === last.y) {
          shape.graphics.closePath();
          this.stage.update();
        }
      },this);
    }

    return this;

  };

  this.setShapeBounds = function(){

    var aabb = new AABB(strokePoints);

    var width = aabb.width,
        height = aabb.height,
        topLeft = Object.assign({}, aabb.topLeft);

    shape.setBounds(topLeft.x, topLeft.y, width, height);

    return this;
  };

  this.setShapeListeners = function () {

    var initialPosition;

    shape.on('mousedown',function (event) {
      initialPosition = {
        x: event.stageX,
        y: event.stageY
      };
    });

    shape.on('pressmove',function(event){
      drawMode = false;
      var newPosition = {
        x: event.stageX,
        y: event.stageY
      };

      var delta = {
        x:newPosition.x - initialPosition.x,
        y:newPosition.y - initialPosition.y
      };

      this.x += delta.x;
      this.y += delta.y;

      initialPosition = newPosition;

      this.stage.update();
    });

    return this;
  };

  this.clearShapeReference = function() {
    shape = null;
  };

}


function Physics() {

}
