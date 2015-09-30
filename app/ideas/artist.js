/*global createjs,jQuery, $*/
/*jshint -W098*/
'use strict';

function Artist(canvasId) {
  var canvas = $('#' + canvasId);
  var stage = new createjs.Stage(canvasId);

  this.draw = function() {
    var promise = new Promise(function(resolve, reject) {

      canvas.on({
        mousedown: function () {
          var shapeFactory  = new ShapeFactory(canvasId);
          shapeFactory.spawnShape().then(function(shape){
            shape.prepare().then(function (drawing) {
              resolve(drawing);
            });
          });
        },
      });

    });

    return promise;
  };

  //--------------------------------------------------
  //- ShapeFactory
  //--------------------------------------------------

  function ShapeFactory (canvasId) {

    var canvas = $('#'+canvasId);

    this.spawnShape = function(){
      var circleProcess;

      var promise = new Promise(function(resolve,reject){

        var shape;

        //-------------------------------------------------------------
        // SHAPE'S CREATION RULE
        //
        // - if the mousedown's time is greater than a certain amount,
        // create a circle.
        //
        // - if it is short, create a Polyline.
        //-------------------------------------------------------------

        circleProcess = setTimeout(function(){
          shape = new Circle();
          resolve(shape);
        },500);

        canvas.mouseup(function(event) {
          clearTimeout(circleProcess);
          if(!shape){
            shape = new Polyline();
            resolve(shape);
          }
        });

      });
      return promise;
    };
  }

  //-----------------------------------------------------------
  //- Shape's abstraction. It inherits from createjs's Shape
  //-----------------------------------------------------------
  var EaseljsShape = createjs.Shape;

  function Shape () {
      EaseljsShape.call(this);
  }

  Shape.prototype = Object.create(EaseljsShape.prototype);

  Shape.prototype.constructor = Shape;

  Shape.prototype.prepare = function(){};

  //-----------------------------------------------------------
  //- Circle's abstraction. It inherits from Shape
  //-----------------------------------------------------------
  function Circle () {
      Shape.call(this);
  }

  Circle.prototype = Object.create(Shape.prototype);

  Circle.prototype.constructor = Circle;

  Circle.prototype.prepare = function(){
    var promise = new Promise(function (resolve,reject) {
      resolve('círculo ninito');
    });
    return promise;
  };

  //-----------------------------------------------------------
  //- Polyline's abstraction. It inherits from Shape
  //-----------------------------------------------------------
  function Polyline () {
      Shape.call(this);
  }

  Polyline.prototype = Object.create(Shape.prototype);

  Polyline.prototype.constructor = Polyline;

  Polyline.prototype.prepare = function(){
    var promise = new Promise(function (resolve,reject) {
      resolve('Polyline ninita');
    });
    return promise;
  };


}
