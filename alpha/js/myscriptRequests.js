var myscriptRequests;

myscriptRequests = (function() {
  function myscriptRequests() {
    this.applicationKey = 'a74d2cfe-c979-42b1-9afe-5203c68a490a';
    this.hmacKey = '4d3be9ad-8f15-40e8-92d7-29af2d6ea0be';
    this.instanceId = void 0;
    this.inkManager = new MyScript.InkManager();
    this.shapeRecognizer = new MyScript.ShapeRecognizer();
  }

  myscriptRequests.prototype.receiveStrokeBundler = function(strokeBundler) {
    this.strokeBundler = strokeBundler;
    return this.fillInkManager();
  };

  myscriptRequests.prototype.fillInkManager = function() {
    var counter, end, i, len, ref, results, start, stroke;
    counter = start = 0;
    end = this.strokeBundler.length - 1;
    ref = this.strokeBundler;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      stroke = ref[i];
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

  myscriptRequests.prototype.doRecognition = function() {
    if (!this.inkManager.isEmpty()) {
      return this.shapeRecognizer.doSimpleRecognition(this.applicationKey, this.instanceId, this.inkManager.getStrokes(), this.hmacKey);
    } else {
      throw console.error("problem with the Myscript's recognition");
    }
  };

  return myscriptRequests;

})();
