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
    var old, self;
    old = void 0;
    this.lastDrawGraphics = void 0;
    this.lastDraw = void 0;
    self = this;
    this.stage = new createjs.Stage(this.canvasTag.id);
    this.stage.enableDOMEvents(true);
    this.color = "#0FF";
    this.size = 10;
    this.stage.on('stagemousedown', function(event) {
      self.color = createjs.Graphics.getHSL(Math.random() * 360, 100, 50);
      self.isMouseDown = true;
      self.lastDrawGraphics = new createjs.Graphics();
      self.lastDraw = new createjs.Shape(self.lastDrawGraphics);
      return this.stage.addChild(self.lastDraw);
    });
    this.stage.on('stagemousemove', function(event) {
      self.lastDrawGraphics;
      if (old && self.isMouseDown) {
        self.lastDrawGraphics.beginStroke(self.color).setStrokeStyle(self.size, "round").moveTo(old.x, old.y).lineTo(event.stageX, event.stageY);
        this.stage.update();
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
    return this.stage.on('stagemouseup', function(event) {
      return self.isMouseDown = false;
    });
  };

  Canvas.prototype.drawRecognizedShape = function(recognizedShape) {
    var beautifulDraw, beautifulDrawGraphics, center, endAngle, i, label, len, newVertex, old, radius, results, self, startAngle, sweepAngle, vertexes;
    self = this;
    if (recognizedShape) {
      this.stage.removeChild(this.lastDraw);
      beautifulDrawGraphics = new createjs.Graphics();
      beautifulDraw = new createjs.Shape(beautifulDrawGraphics);
      beautifulDrawGraphics.beginStroke(self.color);
      this.stage.addChild(beautifulDraw);
      this.stage.update();
      label = recognizedShape.label;
      switch (label) {
        case 'polyline':
          vertexes = recognizedShape.vertexes;
          results = [];
          for (i = 0, len = vertexes.length; i < len; i++) {
            newVertex = vertexes[i];
            if (!old) {
              old = newVertex;
              continue;
            }
            beautifulDrawGraphics.beginStroke(self.color).setStrokeStyle(self.size, "round").moveTo(old.x, old.y).lineTo(newVertex.x, newVertex.y);
            this.stage.update();
            results.push(old = newVertex);
          }
          return results;
          break;
        case 'ellipseArc':
          center = recognizedShape.center;
          radius = recognizedShape.minRadius;
          startAngle = recognizedShape.startAngle;
          sweepAngle = recognizedShape.sweepAngle;
          endAngle = startAngle + sweepAngle;
          beautifulDrawGraphics.beginStroke(self.color).setStrokeStyle(self.size, "round").arc(center.x, center.y, radius, startAngle, endAngle, true);
          return this.stage.update();
        default:
          return null;
      }
    }
  };

  return Canvas;

})();
