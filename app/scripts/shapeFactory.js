/*global createjs, $, Shape, Circle, Polyline*/
/*jshint -W098, -W003*/
'use strict';

function ShapeFactory(canvasId) {

  var canvas = $('#' + canvasId);

  this.stage = new createjs.Stage(canvasId);

  var stage = this.stage;


  stage.enableMouseOver(10);

  this.spawnShape = function() {
    var circleProcess, incresingOfRadius;

    var shapeFactory = this;

    var promise = new Promise(function(resolve, reject) {
      var circle, polyline, firstPoint;
      //-------------------------------------------------------------
      // SHAPE'S CREATION RULE
      //
      // - if the mousedown's time is greater than a certain amount,
      // create a Circle.
      //
      // - if it is short, create a Polyline.
      //-------------------------------------------------------------

      var shapeFactory = ShapeFactory.prototype;

      // the listener will be active, just if the shapeFactory is turned on
      canvas.on({
        mousedown: function(e) {
          if (shapeFactory.isOn()) {
            firstPoint = {
              x: e.offsetX,
              y: e.offsetY
            };

            //XXX Problem when two successives shapes is created
            circleProcess = setTimeout(function() {
              circle = new Circle(firstPoint);
              stage.addChild(circle);
              incresingOfRadius = setInterval(function() {
                circle.increaseRadius();
                stage.update();
              }, 1);

            }, 500);
          }
        },

        mouseup: function(event) {
          if (shapeFactory.isOn()) {
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
        }
      });

    });
    return promise;
  };
}

//- It will be used to turn off ShapeFactory.prototye.draw method;
ShapeFactory.prototype.state = true;

ShapeFactory.prototype.turnOff = function() {
  this.state = false;
};

ShapeFactory.prototype.turnOn = function() {
  this.state = true;
};

ShapeFactory.prototype.isOn = function() {
  return this.state;
};
