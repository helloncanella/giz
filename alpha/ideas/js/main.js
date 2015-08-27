var canvas, getAABB, isMouseDown, next, shape, stage, start, stroke;

canvas = $('canvas')[0];

isMouseDown = false;

stage = new createjs.Stage("canvas");

shape = void 0;

start = void 0;

next = void 0;

stroke = void 0;

stage.on("stagemousedown", function(event) {
  isMouseDown = true;
  shape = new createjs.Shape();
  shape.x = event.stageX;
  shape.y = event.stageY;
  console.log(shape.x, shape.y);
  stroke = new Array();
  start = {
    x: 0,
    y: 0
  };
  stroke.push(start);
  return stage.addChild(shape);
});

stage.on("stagemousemove", function(event) {
  if (isMouseDown) {
    next = {
      x: event.stageX - shape.x,
      y: event.stageY - shape.y
    };
    shape.graphics.beginStroke("red").moveTo(start.x, start.y).lineTo(next.x, next.y);
    console.log(next.x, next.y);
    stage.update();
    stroke.push(next);
    return start = next;
  }
});

stage.on("stagemouseup", function(event) {
  isMouseDown = false;
  return console.log('shape', shape);
});

getAABB = function(stroke) {
  var aabb, highest, i, lowest, point;
  i = 0;
  while (i < stroke.length) {
    point = stroke[i];
    if (!lowest && !highest) {
      lowest = JSON.parse(JSON.stringify(point));
      highest = JSON.parse(JSON.stringify(point));
      i++;
      continue;
    }
    if (point.x > highest.x) {
      highest.x = point.x;
    }
    if (point.x < lowest.x) {
      lowest.x = point.x;
    }
    if (point.y > highest.y) {
      highest.y = point.y;
    }
    if (point.y < lowest.y) {
      lowest.y = point.y;
    }
    i++;
  }
  aabb = {
    topLeft: {
      x: lowest.x,
      y: lowest.y
    },
    width: highest.x - lowest.x,
    height: highest.y - lowest.y
  };
  return aabb;
};
