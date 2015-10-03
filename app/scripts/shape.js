/*global createjs, $, Artist, ShapeFactory*/
/*jshint -W098, -W003*/
'use strict';

var EaseljsShape = createjs.Shape;

function Shape(position) {

  EaseljsShape.call(this);

  this.x = position.x;this.y = position.y;
  this.y = position.y;

  this.data = {
    label: '',
    measures: {}
  };

}

Shape.prototype = Object.create(EaseljsShape.prototype);

Shape.prototype.constructor = Shape;

Shape.prototype.prepare = function() {};

Shape.prototype.setListeners = function () {

  var initialPosition;
  var shapeFactory = ShapeFactory.prototype;

  this.on('mousedown',function (event) {

    initialPosition = {
      x: event.stageX,
      y: event.stageY
    };

  });

  this.on('pressmove',function(event){

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
