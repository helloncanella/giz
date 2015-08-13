var Canvas;

Canvas = (function() {
  function Canvas(canvasTag) {
    this.canvasTag = canvasTag;
    this.setBlackboard();
  }

  Canvas.prototype.setBlackboard = function() {
    var color, old, self, shape, size, stage;
    old = void 0;
    size = void 0;
    self = this;
    stage = new createjs.Stage(this.canvasTag.id);
    stage.enableDOMEvents(true);
    shape = new createjs.Shape();
    stage.addChild(shape);
    color = "#0FF";
    stage.on('stagemousedown', function(event) {
      self.isMouseDown = true;
      return size = 10;
    });
    stage.on('stagemousemove', function(event) {
      if (old && self.isMouseDown) {
        shape.graphics.beginStroke(color).setStrokeStyle(size, "round").moveTo(old.x, old.y).lineTo(event.stageX, event.stageY);
        stage.update();
      }
      return old = {
        x: event.stageX,
        y: event.stageY
      };
    });
    return stage.on('stagemouseup', function(event) {
      self.isMouseDown = false;
      return color = createjs.Graphics.getHSL(Math.random() * 360, 100, 50);
    });
  };

  return Canvas;

})();
