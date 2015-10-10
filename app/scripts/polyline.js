/*global Shape*/
/*jshint -W003*/
'use strict';

function Polyline(position, canvas) {
  Shape.call(this, position);
  this.canvas = canvas;

  this.points = [];
  this.lastPoint = {
    x: undefined,
    y: undefined
  };

  this.provisoryShapesNumber = 0;

  this.data = {
    label: 'polyline',
    measures: {
      points: this.points
    },
  };
}

Polyline.prototype = Object.create(Shape.prototype);

Polyline.prototype.constructor = Polyline;

Polyline.prototype.start = function(position) {
  var stage = this.stage;

  this.storePoint(position);

  //- Inserting the initial token;
  var initialToken = this.getToken(position, 7.5, this.canvas);
  stage.addChild(initialToken);
  stage.update();

};

Polyline.prototype.setCentroid = function() {

  var
    data = this.data,
    isOpened = data.opened,
    points = this.data.measures.points,
    shape = this;


  var centroid = calculateCentroid();

  Shape.prototype.setCentroid.call(this, centroid);

  setNewPosition();

  var graphics = this.graphics;
  var stage = this.stage;

  //- setting the center of mass graphically
  graphics
    .beginStroke('red')
    .beginFill('red')
    .drawCircle(centroid.x - this.x, centroid.y - this.y, 1);

  stage.update();

  function setNewPosition() {
    shape.x = centroid.x;
    shape.y = centroid.y;

    rebuildShape();

    function rebuildShape() {
      var next;

      var
        graphics = shape.graphics,
        start = {
          x: points[0] - shape.x,
          y: points[0] - shape.y
        };

      graphics.clear();


      graphics
        .beginFill('royalblue')
        .setStrokeStyle(2)
        .moveTo(start.x, start.y);

      for (var i = 1; i < points.length; i++) {

        next = {
          x: points[i].x - shape.x,
          y: points[i].y - shape.y
        };

        graphics.lineTo(next.x, next.y);

        start = next;
      }

      graphics.closePath();
    }
  }

  function calculateCentroid() {

    var centroid = {};
    var start = points[0];

    if (isOpened) {
      centroid = openedPolylineCentroid();
    } else {
      centroid = closedPolylineCentroid();
    }

    //- Deploying the formula found at http://tny.im/dk10D
    function closedPolylineCentroid() {

      var next, I;

      var
        Area = 0,
        sum = {
          x: 0,
          y: 0
        };

      for (var i = 1; i < points.length; i++) {
        next = points[i];
        I = start.x * next.y - next.x * start.y;

        sum.x += (start.x + next.x) * I;
        sum.y += (start.y + next.y) * I;

        Area += I;

        start = next;
      }

      Area /= 2;

      centroid = {
        x: (1 / (6 * Area)) * sum.x,
        y: (1 / (6 * Area)) * sum.y
      };

      return centroid;
    }


    function openedPolylineCentroid() {

      var
        pow = Math.pow,
        sqrt = Math.sqrt;

      var
        sumLength = 0,
        rodMoment = {
          x: 0,
          y: 0
        };

      points.forEach(function(point) {
        var next = point;

        var distance = {
          x: next.x - start.x,
          y: next.y - start.y
        };

        var centroidOfRod = {
          x: start.x + distance.x / 2,
          y: start.y + distance.y / 2
        };

        var distanceLength = sqrt(pow(distance.x, 2) + pow(distance.y, 2));

        sumLength += distanceLength;

        rodMoment.x += distanceLength * centroidOfRod.x;
        rodMoment.y += distanceLength * centroidOfRod.y;

        start = next;
      });

      centroid.x = rodMoment.x / sumLength;
      centroid.y = rodMoment.y / sumLength;

      return centroid;
    }

    return centroid;
  }

  return this;
};

Polyline.prototype.storePoint = function(point) {

  this.points.push({
    x: point.x,
    y: point.y
  });

};

Polyline.prototype.replaceProvisoryShapes = function() {
  var graphics = this.graphics;
  var points = this.points;
  var stage = this.stage;
  var shape = this;

  graphics
    .beginStroke('royalblue')
    .setStrokeStyle(2)
    .moveTo(0, 0);

  points.forEach(function(point) {
    var end = {
      x: point.x - shape.x,
      y: point.y - shape.y
    };

    graphics.lineTo(end.x, end.y);
  });

  var number = this.provisoryShapesNumber;

  var shapeIndex = stage.getChildIndex(shape);

  stage.children.splice(shapeIndex + 1, number);

};

Polyline.prototype.prepare = function() {

  var canvas = this.canvas,
    stage = this.stage,
    shape = this,
    start = {
      x: this.x,
      y: this.y
    };

  var segment = new Segment(start);
  stage.addChild(segment);
  this.provisoryShapesNumber++;

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

        //- Avoiding duplication of points
        //--- Don't store the point if it is equal to the last
        var lastPoint = shape.lastPoint;

        if (lastPoint.x !== end.x && lastPoint.y !== end.y) {
          segment = new Segment(end);

          stage.addChild(segment);
          shape.provisoryShapesNumber++;

          shape.storePoint(end);
          shape.lastPoint = Object.assign({}, end);
        }
      },
      dblclick: function() {
        canvas.trigger('finishPolyline');
      },
      finishPolyline: function(event, close) {

        if (close) {
          shape.close();
          shape.data.opened = false;
        } else {
          shape.data.opened = true;
        }

        //- replace the set of provisories shapes by the definitive
        shape.replaceProvisoryShapes();

        stage.update();

        resolve(shape);
        canvas.off();
      }
    });

  });
  return promise;
};

Polyline.prototype.getToken = function(position, sideLength, canvas) {

  var startToken = new Token(position, sideLength, canvas);
  this.provisoryShapesNumber++;

  return startToken;
};

Polyline.prototype.close = function() {

  //remove last point and add replace for the point
  this.points.splice(-1, 1, this.points[0]);

  this.graphics.beginFill('royalblue').closePath();

};

//----------------------------------------------------------------------
//- Token's abstraction. It marks the initial and end of the Polyline
//----------------------------------------------------------------------
function Token(start, sideLength, canvas) {
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
  this.on('mouseover', function() {
    stroke.style = 'red';
    fill.style = 'red';
  });

  this.on('mouseout', function() {
    stroke.style = 'black';
    fill.style = 'white';
  });

  this.on('click', function() {
    canvas.trigger('finishPolyline', ['close']);
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
