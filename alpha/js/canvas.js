var Canvas;

Canvas = (function() {
  function Canvas(canvasTag) {
    this.canvasTag = canvasTag;
    this.setBlackboard();
    this.strokeBundler = new Array();
  }

  Canvas.prototype.getStrokeBundler = function() {
    var toSend;
    toSend = this.strokeBundler;
    this.strokeBundler = new Array();
    return toSend;
  };

  Canvas.prototype.setBlackboard = function() {
    var color, old, self, shape, size, stage;
    old = void 0;
    size = 10;
    self = this;
    stage = new createjs.Stage(this.canvasTag.id);
    stage.enableDOMEvents(true);
    shape = new createjs.Shape();
    stage.addChild(shape);
    color = "#0FF";
    stage.on('stagemousedown', function(event) {
      return self.isMouseDown = true;
    });
    stage.on('stagemousemove', function(event) {
      if (old && self.isMouseDown) {
        shape.graphics.beginStroke(color).setStrokeStyle(size, "round").moveTo(old.x, old.y).lineTo(event.stageX, event.stageY);
        stage.update();
        self.strokeBundler.push({
          x: event.stageX,
          y: event.stageY
        });
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
