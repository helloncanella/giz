/*global createjs, $*/
/*jshint -W098, -W003*/
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
    label: '',
    measures: {}
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
    measures: {
      center: {
        x: this.x,
        y: this.y
      },
      radius: 0
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

// var startToken = new createjs.Shape();
// startToken
//   .graphics
//   .setStrokeStyle(2)
//   .beginStroke('black')
//   .drawRect(
//     this.x - sideLength / 2,
//     this.y - sideLength / 2,
//     sideLength,
//     sideLength
//   );


//----------------------------------------------------------------------
//- Token's abstraction. It marks the initial and end of the Polyline
//----------------------------------------------------------------------
function Token(start, sideLength) {
  Shape.call(this, start);

  var graphics = this.graphics;

  var token = this;

  var stroke = graphics.beginStroke(2).command;
  var fill = graphics.beginFill('white').command;

  graphics
    .drawRect(
      0 - sideLength / 2,
      0 - sideLength / 2,
      sideLength,
      sideLength
    );


  //- Setting listeners
  this.on('mouseover',function(){
    stroke.style = 'red';
    fill.style = 'red';
  });

  this.on('mouseout',function(){
    stroke.style = 'black';
    fill.style = 'white';
  });


  this.on('click',function(){
    $('canvas#idea').trigger('finishPolyline');
    token.off('mouseout');
  });

}

Token.prototype = Object.create(Shape.prototype);

Token.prototype.constructor = Token;


//-----------------------------------------------------------
//- Segment's abstraction.
//-----------------------------------------------------------
function Segment(start) {
  Shape.call(this, start);
}

Segment.prototype = Object.create(Shape.prototype);

Segment.prototype.constructor = Segment;

Segment.prototype.setEnd = function(x, y) {
  var graphics = this.graphics;

  var end = {
    x: x - this.x,
    y: y - this.y
  };

  graphics.clear();

  graphics
    .setStrokeStyle(2)
    .beginStroke('red')
    .moveTo(0, 0)
    .lineTo(end.x, end.y);
};


//-----------------------------------------------------------
//- Polyline's abstraction. It inherits from Shape
//-----------------------------------------------------------
function Polyline(position, canvas) {
  Shape.call(this, position);
  this.canvas = canvas;
}

Polyline.prototype = Object.create(Shape.prototype);

Polyline.prototype.constructor = Polyline;

Polyline.prototype.start = function(position, sideLength) {
  var stage = this.stage;

  //- Inserting initial token;
  var initialToken = this.getToken(position, 7.5);
  stage.addChild(initialToken);
  stage.update();

};

Polyline.prototype.prepare = function() {

  var canvas = this.canvas,
    stage = this.stage,
    start = {
      x: this.x,
      y: this.y
    };

  var segment = new Segment(start);
  stage.addChild(segment);

  // Destroying past events binded to the canvas
  canvas.off();

  var promise = new Promise(function(resolve) {

    canvas.on({
      mousemove: function(e) {
        segment.setEnd(e.offsetX, e.offsetY);
        stage.update();
      },
      mousedown: function(e) {
        var end = {
          x: e.offsetX,
          y: e.offsetY
        };
        segment.setEnd(end.x, end.y);
        segment = new Segment(end);
        stage.addChild(segment);
      },
      dblclick: function(e) {
        canvas.trigger('finishPolyline');
      },
      finishPolyline: function() {
        resolve('Polyline ninita');
        canvas.off();
      }
    });

  });
  return promise;
};

Polyline.prototype.getToken = function(position, sideLength) {

  var startToken = new Token(position, sideLength);

  return startToken;
};


//--------------------------------------------------
//- ShapeFactory
//--------------------------------------------------

function ShapeFactory(canvasId) {

  var canvas = $('#' + canvasId),
    stage = new createjs.Stage(canvasId);
    stage.enableMouseOver(10);

  this.spawnShape = function(firstPoint) {
    var circleProcess, incresingOfRadius;

    var promise = new Promise(function(resolve) {
      var circle, polyline;

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
        } else {
          polyline = new Polyline(firstPoint, canvas);
          stage.addChild(polyline);
          polyline.start(firstPoint, 7.5);
          stage.update();
          resolve(polyline);
        }
      });

    });
    return promise;
  };
}
