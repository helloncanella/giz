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
            drawing
              .setAABB()
              .setCentroid();
            resolve(drawing.data);
          });
      });
    });

    return promise;
  };

  this.clearShapeReference = function() {
    shape = null;
  };

}
