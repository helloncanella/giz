/*global createjs, $*/
/*jshint -W098*/
'use strict';

//-----------------------------------------------------------
//- Shape's abstraction. It inherits from createjs's Shape
//-----------------------------------------------------------
var EaseljsShape = createjs.Shape;

function Shape(position) {

  EaseljsShape.call(this);

  this.x = position.x;
  this.y = position.y;

  this.data = {
    label:'',
    measures:{}
  };
}

Shape.prototype = Object.create(EaseljsShape.prototype);

Shape.prototype.constructor = Shape;

Shape.prototype.prepare = function() {};

//-----------------------------------------------------------
//- Circle's abstraction. It inherits from Shape
//-----------------------------------------------------------
function Circle(position) {
  Shape.call(this, position);

  this.radius = 0;

  this.data = {
    label: 'circle',
    measures:{
      center: {
        x:this.x,
        y:this.y
      },
      radius:0
    }
  };

}

Circle.prototype = Object.create(Shape.prototype);

Circle.prototype.constructor = Circle;

Circle.prototype.prepare = function() {
  var data = this.data;

  var promise = new Promise(function(resolve) {
    resolve(data);
  });
  return promise;
};

Circle.prototype.increaseRadius = function() {

  var radius = this.data.measures.radius += 0.15;

  this.graphics.clear();
  this.graphics.beginFill('red').drawCircle(0, 0, radius);

  this.data.measures.radius = radius;

};

//-----------------------------------------------------------
//- Polyline's abstraction. It inherits from Shape
//-----------------------------------------------------------
function Polyline(position) {
  Shape.call(this,position);
}

Polyline.prototype = Object.create(Shape.prototype);

Polyline.prototype.constructor = Polyline;

Polyline.prototype.prepare = function() {
  var promise = new Promise(function(resolve) {
    resolve('Polyline ninita');
  });
  return promise;
};

Polyline.prototype.getInitialToken = function(sideLength) {

  var startToken = new createjs.Shape();
  startToken
    .graphics
    .setStrokeStyle(2)
    .beginStroke('black')
    .drawRect(
      this.x - sideLength / 2,
      this.y - sideLength / 2,
      sideLength,
      sideLength
    );

  return startToken;
};


//--------------------------------------------------
//- ShapeFactory
//--------------------------------------------------

function ShapeFactory(canvasId) {

  var canvas = $('#' + canvasId),
      stage = new createjs.Stage(canvasId);

  this.spawnShape = function(firstPoint) {
    var circleProcess, incresingOfRadius;

    var promise = new Promise(function(resolve) {
      var circle, polyline  ;

      //-------------------------------------------------------------
      // SHAPE'S CREATION RULE
      //
      // - if the mousedown's time is greater than a certain amount,
      // create a Circle.
      //
      // - if it is short, create a Polyline.
      //-------------------------------------------------------------

      circleProcess = setTimeout(function() {
        circle = new Circle(firstPoint);
        stage.addChild(circle);

        incresingOfRadius = setInterval(function() {
          circle.increaseRadius();
          stage.update();
        }, 1);

      }, 500);

      canvas.mouseup(function(event) {
        clearTimeout(circleProcess);
        clearInterval(incresingOfRadius);
        if (circle) {
          resolve(circle);
        }else{
          polyline = new Polyline(firstPoint);
          var startToken = polyline.getInitialToken(7.5);
          stage.addChild(startToken);
          stage.update();
          resolve(polyline);
        }
      });

    });
    return promise;
  };
}
