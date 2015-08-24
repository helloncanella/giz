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
    var bodyList, strokeClassified, weGotaBeautifulStroke, weGotaClosedShape;
    recognizedShape = e.data;
    strokeClassified = self.classifyStrokeAndSetId(strokeBundler, recognizedShape);
    console.log('strokeClassified', strokeClassified);
    box2dAgentInstance.transformTheGivenStrokeInABody(strokeClassified).insertTheTransformedBodyInTheWorld();
    weGotaBeautifulStroke = !strokeClassified.conditions.weGotaUglyStroke;
    weGotaClosedShape = strokeClassified.conditions.closed;
    if (weGotaBeautifulStroke && weGotaClosedShape) {
      canvas.drawRecognizedShape(strokeClassified);
    }
    bodyList = box2dAgentInstance.getBodyList();
    return canvas.setLastBodyAxis(bodyList[bodyList.length - 1]);
  };
  classifyStrokeAndSetId = function(rawStroke, recognizedShape) {
    var label, lastPoint, length, maxRadius, minRadius, opened, startPoint, stroke, sweepAngle, vertices, withEqualRadius;
    stroke = {
      measures: {
        canvas: void 0,
        box2d: void 0
      },
      conditions: void 0
    };
    if (recognizedShape) {
      stroke.measures.canvas = recognizedShape;
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
          opened = Math.round(Math.abs(sweepAngle) / (2 * Math.PI)) !== 1;
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
      stroke.measures.canvas = rawStroke;
      stroke.conditions = {
        weGotaUglyStroke: true
      };
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
