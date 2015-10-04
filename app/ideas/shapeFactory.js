/*global createjs, $, Shape, Circle, Polyline*/
/*jshint -W098, -W003*/
'use strict';

function ShapeFactory(canvasId) {

  var canvas = $('#' + canvasId),
    stage = new createjs.Stage(canvasId);

  stage.enableMouseOver(10);

  this.spawnShape = function() {
    var circleProcess, incresingOfRadius;

    var promise = new Promise(function(resolve) {
      var circle, polyline, firstPoint;

      //-------------------------------------------------------------
      // SHAPE'S CREATION RULE
      //
      // - if the mousedown's time is greater than a certain amount,
      // create a Circle.
      //
      // - if it is short, create a Polyline.
      //-------------------------------------------------------------

      canvas.on({
        mousedown: function(e) {

          firstPoint = {
            x: e.offsetX,
            y: e.offsetY
          };

          circleProcess = setTimeout(function() {
            circle = new Circle(firstPoint);
            stage.addChild(circle);
            incresingOfRadius = setInterval(function() {
              circle.increaseRadius();
              stage.update();
            }, 1);
          }, 500);
        },

        mouseup: function(event) {
          clearTimeout(circleProcess);
          clearInterval(incresingOfRadius);
          if (circle) {
            resolve(circle);
          } else {
            polyline = new Polyline(firstPoint, canvas);
            stage.addChild(polyline);
            polyline.start(firstPoint, 7.5);
            stage.update();
            resolve(polyline);
          }
        }
      });

    });
    return promise;
  };
}
