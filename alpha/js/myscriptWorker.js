var dependecy, i, len, myscriptRequest;

importScripts('/js/myscriptDependecies.js');

for (i = 0, len = myscriptDependecies.length; i < len; i++) {
  dependecy = myscriptDependecies[i];
  importScripts(dependecy);
}

self.onmessage = function(e) {
  var myscriptRequest, strokeBundler;
  strokeBundler = e.data;
  myscriptRequest = new self.myscriptRequest(strokeBundler);
  myscriptRequest.doRecognition();
  console.log(myscriptRequest.doRecognition());
  return setTimeout(function() {
    return console.log(myscriptRequest.result);
  }, 700);
};

myscriptRequest = (function() {
  function myscriptRequest(strokeBundler1) {
    this.strokeBundler = strokeBundler1;
    this.applicationKey = 'a74d2cfe-c979-42b1-9afe-5203c68a490a';
    this.hmacKey = '4d3be9ad-8f15-40e8-92d7-29af2d6ea0be';
    this.instanceId = void 0;
    this.inkManager = new MyScript.InkManager();
    this.shapeRecognizer = new MyScript.ShapeRecognizer();
    this.fillInkManager();
  }

  myscriptRequest.prototype.fillInkManager = function() {
    var counter, end, j, len1, ref, results, start, stroke;
    counter = start = 0;
    end = this.strokeBundler.length - 1;
    ref = this.strokeBundler;
    results = [];
    for (j = 0, len1 = ref.length; j < len1; j++) {
      stroke = ref[j];
      switch (counter) {
        case start:
          this.inkManager.startInkCapture(stroke.x, stroke.y);
          break;
        case end:
          this.inkManager.endInkCapture();
          break;
        default:
          this.inkManager.continueInkCapture(stroke.x, stroke.y);
      }
      results.push(counter++);
    }
    return results;
  };

  myscriptRequest.prototype.doRecognition = function() {
    var self;
    self = this;
    if (!this.inkManager.isEmpty()) {
      this.shapeRecognizer.doSimpleRecognition(this.applicationKey, this.instanceId, this.inkManager.getStrokes(), this.hmacKey).then(function(data) {
        return self.result = data.getShapeDocument();
      });
    }
    while (!self.result) {
      return self.result;
    }
  };

  return myscriptRequest;

})();
