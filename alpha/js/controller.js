var box2dAgentInstance, canvas, canvasTag, classifyStrokeAndSetId, context, debugDraw, debugDrawCanvas, myscriptWorker, rate, recognizedShape, setBox2d, strokeBundler, update, world;

if (window.Worker) {
  canvasTag = $('canvas#easel')[0];
  debugDrawCanvas = $('canvas#debugDraw')[0];
  canvas = new Canvas(canvasTag);
  context = debugDrawCanvas.getContext('2d');
  myscriptWorker = new Worker('js/myscriptWorker.js');
  box2dAgentInstance = void 0;
  world = void 0;
  rate = void 0;
  debugDraw = void 0;
  strokeBundler = void 0;
  recognizedShape = void 0;
  setBox2d = function() {
    var gravity, scale;
    gravity = new b2Vec2(0, 10);
    world = new b2World(gravity, false);
    rate = 1 / 60;
    scale = 30;
    box2dAgentInstance = new box2dAgent(world, scale);
    debugDraw = new b2DebugDraw;
    debugDraw.SetSprite(context);
    debugDraw.SetDrawScale(scale);
    debugDraw.SetFillAlpha(0.3);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit | b2DebugDraw.e_centerOfMassBit);
    return world.SetDebugDraw(debugDraw);
  };
  $('canvas').mouseup(function(event) {
    self.strokeBundler = canvas.getStrokeBundler();
    return myscriptWorker.postMessage(strokeBundler);
  });
  myscriptWorker.onmessage = function(e) {
    var bodyList, strokeClassified, toRedrawIsNeeded;
    recognizedShape = e.data;
    strokeClassified = self.classifyStrokeAndSetId(strokeBundler, recognizedShape);
    box2dAgentInstance.transformTheGivenStrokeInABody(strokeClassified).insertTheTransformedBodyInTheWorld();
    toRedrawIsNeeded = strokeClassified.conditions.toRedrawIsNeeded;
    if (toRedrawIsNeeded) {
      canvas.drawRecognizedShape(strokeClassified);
    }
    bodyList = box2dAgentInstance.getBodyList();
    return canvas.setLastBodyAxis(bodyList[bodyList.length - 1]);
  };
  classifyStrokeAndSetId = function(rawStroke, recognizedShape) {
    var ellipseWithDifferentRadius, label, lastPoint, length, maxRadius, minRadius, opened, shapeIsClosed, startPoint, stroke, sweepAngle, vertices, withEqualRadius;
    stroke = {
      measures: {
        canvas: new Object(),
        box2d: new Object()
      },
      conditions: new Object()
    };
    if (recognizedShape) {
      label = recognizedShape.label;
      switch (label) {
        case 'polyline':
          vertices = recognizedShape.vertices;
          length = vertices.length;
          startPoint = vertices[0];
          lastPoint = vertices[length - 1];
          opened = (startPoint.x !== lastPoint.x) && (startPoint.y !== lastPoint.y);
          stroke.conditions = {
            weGotaPolyline: true,
            opened: opened,
            closed: !opened
          };
          break;
        case 'ellipseArc':
          sweepAngle = recognizedShape.sweepAngle;
          maxRadius = recognizedShape.maxRadius;
          minRadius = recognizedShape.minRadius;
          opened = Math.abs(sweepAngle) / (2 * Math.PI) <= 1;
          withEqualRadius = minRadius === maxRadius;
          stroke.conditions = {
            weGotaEllipseArc: true,
            opened: opened,
            closed: !opened,
            withEqualRadius: withEqualRadius,
            withDifferentRadius: !withEqualRadius
          };
      }
    } else {
      stroke.conditions = {
        weGotaUglyStroke: true,
        opened: true
      };
    }
    shapeIsClosed = stroke.conditions.closed;
    ellipseWithDifferentRadius = stroke.conditions.withDifferentRadius;
    if (shapeIsClosed && !ellipseWithDifferentRadius) {
      stroke.measures.canvas = recognizedShape;
      stroke.conditions.toRedrawIsNeeded = true;
    } else {
      stroke.measures.canvas.vertices = rawStroke;
      stroke.conditions.toRedrawIsNeeded = false;
    }
    if (!this.thereIsPreviousStroke) {
      this.thereIsPreviousStroke = true;
      stroke.id = this.id = 0;
    } else {
      stroke.id = this.id + 1;
      this.id++;
    }
    return stroke;
  };
  (update = function() {
    if (!box2dAgentInstance) {
      setBox2d();
    } else {
      world.Step(rate, 10, 10);
      world.DrawDebugData();
      canvas.updateDraw(box2dAgentInstance.getBodyList());
    }
    return requestAnimationFrame(update);
  })();
}
