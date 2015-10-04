/*jshint unused:false*/
/*jshint -W020*/
/*global AABB, createjs, drawMode,  ShapeFactory, $*/
//
'use strict';

function Artist(canvasId) {
  var shape, next, strokePoints;

  var canvas = $('#' + canvasId);
  var shapeFactory = new ShapeFactory(canvasId);

  this.stage = new createjs.Stage(canvasId);

  this.draw = function(point) {

    var artist = this;

    var promise = new Promise(function(resolve) {
      shapeFactory.spawnShape().then(function(shape) {
        shape
          .setListeners()
          .prepare()
          .then(function(drawing) {
            resolve(drawing);
          });
      });
    });

    return promise;
  };

  this.setShapeBounds = function() {

    var aabb = new AABB(strokePoints);

    var width = aabb.width,
      height = aabb.height,
      topLeft = Object.assign({}, aabb.topLeft);

    shape.setBounds(topLeft.x, topLeft.y, width, height);

    return this;
  };


  this.clearShapeReference = function() {
    shape = null;
  };

}
