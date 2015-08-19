var box2dWorker, canvas, canvasTag, classifyStrokeAndSetId, myscriptWorker, recognizedShape, strokeBundler;

if (window.Worker) {
  canvasTag = $('canvas')[0];
  canvas = new Canvas(canvasTag);
  myscriptWorker = new Worker('js/myscriptWorker.js');
  box2dWorker = new Worker('js/box2dWorker.js');
  strokeBundler = void 0;
  $('canvas').mouseup(function(event) {
    strokeBundler = canvas.getStrokeBundler();
    return myscriptWorker.postMessage(strokeBundler);
  });
  classifyStrokeAndSetId = function(recognizedShape) {
    var stroke;
    if (!this.strokeId) {
      this.strokeId = 1;
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
    var strokeClassified;
    recognizedShape = e.data;
    canvas.drawRecognizedShape(recognizedShape);
    strokeClassified = self.classifyStrokeAndSetId(recognizedShape);
    return box2dWorker.postMessage(strokeClassified);
  };
} else {
  $('canvas').remove();
  $('body').append("<h1> Your browser doesn't support our application. </h1> <p>Try one more modern, like chrome or firefox, for example.</p>");
}
