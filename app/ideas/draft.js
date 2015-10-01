Polyline.prototype.prepare = function() {

  var end;

  var canvas = this.canvas,
    stage = this.stage,
    shape = this,
    start = {
      x: 0,
      y: 0
    };

  // Destroying past events binded to the canvas
  canvas.off();

  var promise = new Promise(function(resolve) {

    canvas.on({
      mousemove: function(e) {
        shape.graphics.clear();

        end = {
          x: e.offsetX - shape.x,
          y: e.offsetY - shape.y
        };

        shape.graphics
          .setStrokeStyle(2)
          .beginStroke('red')
          .moveTo(start.x, start.y)
          .lineTo(end.x, end.y);

        stage.update();
      },
      mousedown: function(e) {
        start = {
          x: e.offsetX - shape.x,
          y: e.offsetY - shape.y
        };
      },
      finshPolyline: function() {
        resolve('Polyline ninita');
      }
    });

  });
  return promise;
};
