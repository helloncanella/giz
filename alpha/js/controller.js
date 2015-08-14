var canvas, canvasTag, myscriptWorker;

if (window.Worker) {
  canvasTag = $('canvas')[0];
  canvas = new Canvas(canvasTag);
  myscriptWorker = new Worker('js/myscriptWorker.js');
  $('canvas').mouseup(function(event) {
    var strokeBundler;
    strokeBundler = canvas.getStrokeBundler();
    return myscriptWorker.postMessage(strokeBundler);
  });
  myscriptWorker.onmessage = function(e) {
    var result;
    result = JSON.parse(e.data);
    return console.log(result);
  };
} else {
  $('canvas').remove();
  $('body').append("<h1> Your browser doesn't support our application. </h1> <p>Try one more modern, like chrome or firefox, for example.</p>");
}
