/*global createjs, $, Shape, Circle, Polyline*/
/*jshint -W098, -W003*/
'use strict';

function ShapeFactory(canvasId) {

  this.stage = new createjs.Stage(canvasId);

  var
    canvas = $('#' + canvasId),
    stage = this.stage;

  stage.enableMouseOver(10);

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
      var shapeFactory = ShapeFactory.prototype;

      canvas.on({
        mousedown: function(e) {

          firstPoint = {
            x: e.offsetX,
            y: e.offsetY
          };

          circleProcess = setTimeout(function() {
            shape = new Circle(firstPoint);
            stage.addChild(shape);
            incresingOfRadius = setInterval(function() {
              shape.increaseRadius();
              stage.update();
            }, 1);
          }, 500);

          //- preventing the mousedown to fire multiple times
          canvas.unbind('mousedown'); //HACK
        },

        mouseup: function(event) {
          clearTimeout(circleProcess);
          clearInterval(incresingOfRadius);

          if (!shape) {
            shape = new Polyline(firstPoint, canvas);
            stage.addChild(shape);
            shape.start(firstPoint, 7.5);
          }

          stage.update();
          resolve(shape);
        }
      });

    });
    return promise;
  };
}
