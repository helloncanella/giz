// token indicating the start of the draw.
var shape, startToken, firstPoint, circleProcess, incresingOfRadius;
var segmentStart, segmentEnd, circle, polyline, oldPosition;

canvas.on({
  mousedown: function(event) {

    segmentStart = firstPoint = {
      x: event.offsetX,
      y: event.offsetY
    };

    if (polyline) {
      polyline.startSegment(oldPosition, segmentStart);
      stage.update();
    } else {
      circleProcess = setTimeout(function() {
        circle = new Circle(firstPoint);
        stage.addChild(circle);
        incresingOfRadius = setInterval(function() {
          circle.increaseRadius();
          stage.update();
        }, 1);
      }, 500);
    }

    oldPosition = segmentStart;

  },
  mouseup: function(event) {

    //- Destroying request for the circle creation
    clearInterval(incresingOfRadius);
    clearTimeout(circleProcess);

    //- If a circle wasn created, resolve the promise
    if (circle) {
      resolve('stroke');
    }

    //- else, build a polyline
    else {
      if (!polyline) {
        polyline = new Polyline(firstPoint);
        stage.addChild(polyline);
        var initialToken = polyline.getInitialToken(7.5);
        polyline.startSegment(segmentStart);
        stage.addChild(initialToken);
        stage.update();
      }
    }

  },

  mousemove: function(event) {
    if (polyline) {

      segmentEnd = {
        x: event.offsetX,
        y: event.offsetY
      };

      polyline.endPosition(segmentEnd);
      stage.update();

    }

  },
  finishDraw: function(event) {
    resolve('stroke');
  }
});

});


//----------------------------------------------------------
//- Class extensions of Shape class
//----------------------------------------------------------

var Shape = createjs.Shape;

//class Circle (inherits from shape)
function Circle(position) {
  Shape.call(this);
  this.x = position.x;
  this.y = position.y;
  this.radius = 0;
}

Circle.prototype = Object.create(Shape.prototype);

Circle.prototype.constructor = Circle;

Circle.prototype.increaseRadius = function() {
  this.radius += 0.15;
  this.graphics.clear();
  this.graphics.beginFill('red').drawCircle(0, 0, this.radius);
};


//class Polyline (inherits from shape)
function Polyline(initialPosition) {
  Shape.call(this);
  this.x = initialPosition.x;
  this.y = initialPosition.y;
  this.stroke = [];
}

Polyline.prototype = Object.create(Shape.prototype);

Polyline.prototype.constructor = Polyline;

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

Polyline.prototype.startSegment = function(oldPosition, position) {
  this.graphics.clear();
  this.stroke.push({
    x: position.x,
    y: position.y
  });
  this.graphics
    .beginStroke('red')
    .moveTo(oldPosition.x - this.x, oldPosition.y - this.y)
    .lineTo(position.x - this.x, position.y - this.y);
};

Polyline.prototype.endPosition = function(end) {
  this.graphics.clear();

  this.graphics.beginStroke('red')
    .moveTo(0, 0).lineTo(end.x - this.x, end.y - this.y);


};
