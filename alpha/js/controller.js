var box2dAgentInstance, canvas, canvasTag, classifyStrokeAndSetId, context, debugDraw, debugDrawCanvas, myscriptWorker, rate, recognizedShape, setBox2d, update, world;

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
  setBox2d = function() {
    var gravity, scale;
    console.log('dfadfadfadf');
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
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    world.SetDebugDraw(debugDraw);
    return console.log('DEBUGDRAW', debugDraw);
  };
  $('canvas').mouseup(function(event) {
    var strokeBundler;
    strokeBundler = canvas.getStrokeBundler();
    return myscriptWorker.postMessage(strokeBundler);
  });
  classifyStrokeAndSetId = function(recognizedShape) {
    var stroke;
    if (!this.strokeId) {
      this.strokeId = 0;
    }
    if (recognizedShape) {
      stroke = {
        uglyOrBeautiful: 'beautiful',
        measures: recognizedShape
      };
    } else {
      stroke = {
        uglyOrBeautiful: 'ugly',
        measures: strokeBundler
      };
    }
    stroke.id = this.strokeId;
    this.strokeId++;
    return stroke;
  };
  recognizedShape = void 0;
  myscriptWorker.onmessage = function(e) {
    var beauty, bodyList, label, strokeClassified;
    recognizedShape = e.data;
    strokeClassified = self.classifyStrokeAndSetId(recognizedShape);
    beauty = strokeClassified.uglyOrBeautiful;
    if (beauty === 'beautiful') {
      label = strokeClassified.measures.label;
      canvas.drawRecognizedShape(strokeClassified);
    }
    box2dAgentInstance.transformTheGivenStrokeInABody(strokeClassified).insertTheTransformedBodyInTheWorld();
    console.log('box2dAgentInstance', box2dAgentInstance);
    bodyList = box2dAgentInstance.getBodyList();
    return console.log('BODYLIST', bodyList);
  };
  (update = function() {
    if (!box2dAgentInstance) {
      setBox2d();
    }
    if (box2dAgentInstance) {
      world.Step(rate, 50, 50);
      world.DrawDebugData();
      canvas.updateDraw(box2dAgentInstance.getBodyList());
    }
    return requestAnimationFrame(update);
  })();
}
