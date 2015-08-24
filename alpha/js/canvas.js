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
    var old, pointToCentroidCalculation, self;
    old = void 0;
    this.lastDrawGraphics = void 0;
    this.lastDraw = void 0;
    self = this;
    pointToCentroidCalculation = void 0;
    this.stage = new createjs.Stage(this.canvasTag.id);
    this.stage.enableDOMEvents(true);
    this.color = "#0FF";
    this.size = 5;
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
      self.isMouseDown = false;
      return this.stage.update();
    });
  };

  Canvas.prototype.drawRecognizedShape = function(recognizedShape) {
    var anticlockwise, beautifulDraw, beautifulDrawGraphics, center, centroid, endAngle, i, label, len, newVertex, old, radius, self, startAngle, sweepAngle, vertices;
    self = this;
    centroid = void 0;
    if (recognizedShape) {
      this.stage.removeChild(this.lastDraw);
      beautifulDrawGraphics = new createjs.Graphics();
      beautifulDraw = new createjs.Shape(beautifulDrawGraphics);
      beautifulDrawGraphics.beginStroke(self.color);
      this.stage.addChild(beautifulDraw);
      this.stage.update();
      label = recognizedShape.measures.canvas.label;
      switch (label) {
        case 'polyline':
          vertices = recognizedShape.measures.canvas.vertices;
          for (i = 0, len = vertices.length; i < len; i++) {
            newVertex = vertices[i];
            if (!old) {
              old = newVertex;
              continue;
            }
            beautifulDrawGraphics.beginStroke(self.color).setStrokeStyle(self.size, "round").moveTo(old.x, old.y).lineTo(newVertex.x, newVertex.y);
            this.stage.update();
            old = newVertex;
          }
          return this.stage.update();
        case 'ellipseArc':
          center = recognizedShape.measures.canvas.center;
          radius = recognizedShape.measures.canvas.minRadius;
          startAngle = recognizedShape.measures.canvas.startAngle;
          sweepAngle = recognizedShape.measures.canvas.sweepAngle;
          endAngle = startAngle + sweepAngle;
          if (sweepAngle <= 0) {
            anticlockwise = true;
          } else {
            anticlockwise = false;
          }
          beautifulDrawGraphics.beginStroke(self.color).setStrokeStyle(self.size, "round").arc(center.x, center.y, radius, startAngle, endAngle, anticlockwise);
          return this.stage.update();
        default:
          return null;
      }
    }
  };

  Canvas.prototype.setLastBodyAxis = function(body) {
    var child, id;
    id = body.id;
    child = this.stage.children[id];
    child.regX = body.centroid.x * 30;
    child.regY = body.centroid.y * 30;
    console.log('body', body);
    child.x += child.regX;
    return child.y += child.regY;
  };

  Canvas.prototype.updateDraw = function(bodyList) {
    var child, i, index, len, ref, results;
    index = 0;
    ref = this.stage.children;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      child = ref[i];
      if (bodyList[index]) {
        child.x += bodyList[index].vx * (1 / 60) * 30;
        child.y += bodyList[index].vy * (1 / 60) * 30;
        child.rotation += bodyList[index].angularVelocity * (1 / 60) * 180 / Math.PI;
        index++;
        results.push(this.stage.update());
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  return Canvas;

})();
