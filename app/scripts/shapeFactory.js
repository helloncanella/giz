/*global createjs, $, Shape, Circle, Polyline*/
/*jshint -W098, -W003*/
'use strict';

function ShapeFactory(canvasId, stage) {

  this.stage = stage;

  var canvas = $('#' + canvasId);

  stage.enableMouseOver(10);

  this.isClosed = false;

  this.spawnShape = function() {
    var circleProcess, incresingOfRadius;

    var shapeFactory = this;

    var promise = new Promise(function(resolve, reject) {

      //-------------------------------------------------------------
      // SHAPE'S CREATION RULE
      //
      // - if the mousedown's time is greater than a certain amount,
      // create a Circle.
      //
      // - if it is short, create a Polyline.
      //-------------------------------------------------------------

      var shape, firstPoint;

      canvas.on({
        mousedown: function(e) {

          if (!shapeFactory.isClosed) {
            firstPoint = {
              x: e.offsetX,
              y: e.offsetY
            };

            circleProcess = setTimeout(function() {
              var radius = 0;
              shape = new Circle(firstPoint, 0, shapeFactory);
              stage.addChild(shape);
              incresingOfRadius = setInterval(function() {
                shape.increaseRadius();
                stage.update();
              }, 1);
            }, 500);

            //- preventing the mousedown to fire multiple times
            canvas.unbind('mousedown'); //HACK
          }
        },

        mouseup: function(event) {

          if (!shapeFactory.isClosed) {
            clearTimeout(circleProcess);
            clearInterval(incresingOfRadius);

            if (!shape) {
              shape = new Polyline(firstPoint, canvas, shapeFactory);
              stage.addChild(shape);
              shape.start(firstPoint, 7.5);
            }

            stage.update();
            resolve(shape);
          }
        }
      });

    });
    return promise;
  };
}

ShapeFactory.prototype.turnOn = function() {
  this.isClosed = false;
};

ShapeFactory.prototype.turnOff = function() {
  this.isClosed = true;
};
