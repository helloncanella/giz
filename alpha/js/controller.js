var box2dWorker, canvas, canvasTag, myscriptWorker, recognizedShape, strokeBundler;

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
  recognizedShape = void 0;
  myscriptWorker.onmessage = function(e) {
    recognizedShape = e.data;
    canvas.drawRecognizedShape(recognizedShape);
    return box2dWorker.postMessage({
      rawStroke: strokeBundler,
      beautifulStroke: recognizedShape
    });
  };
} else {
  $('canvas').remove();
  $('body').append("<h1> Your browser doesn't support our application. </h1> <p>Try one more modern, like chrome or firefox, for example.</p>");
}
