/*global createjs, ShapeFactory, $*/
/*jshint -W098*/
'use strict';

function Artist(canvasId) {

  var canvas = $('#' + canvasId);
  var shapeFactory = new ShapeFactory(canvasId);

  this.draw = function() {

    var promise = new Promise(function(resolve, reject) {

      shapeFactory.spawnShape().then(function(shape) {
        shape.prepare().then(function(drawing) {
          resolve(drawing);
        });
      });

    });

    return promise;

  };

}
