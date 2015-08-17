var myscriptRequests;

myscriptRequests = (function() {
  function myscriptRequests() {
    this.applicationKey = '63e2c95e-2122-458e-8c4b-9055d42d357f';
    this.hmacKey = '75b47acb-b553-4a9e-878b-f96639e1f7dc';
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

  myscriptRequests.prototype.decodeServerResult = function(serverResult) {
    var arrayLength, constructor, i, len, mostProbableShape, nextPoint, primitive, primitivesList, resultedSegments, shape, startPoint, typeOfResult, typeOfShape, vertexesArray;
    resultedSegments = serverResult.result.segments;
    arrayLength = resultedSegments.length;
    mostProbableShape = resultedSegments[arrayLength - 1].candidates[0];
    console.log(mostProbableShape);
    typeOfResult = constructor = mostProbableShape.constructor.name;
    if (typeOfResult === 'ShapeNotRecognized') {
      console.error('Shape not recognized');
      return shape = null;
    } else {
      primitivesList = mostProbableShape.primitives;
      typeOfShape = primitivesList[0].constructor.name;
      for (i = 0, len = primitivesList.length; i < len; i++) {
        primitive = primitivesList[i];
        switch (typeOfShape) {
          case 'ShapeEllipse':
            shape = {
              label: 'ellipseArc',
              center: primitive.center,
              maxRadius: primitive.maxRadius,
              minRadius: primitive.minRadius,
              orientation: primitive.orientation,
              startAngle: primitive.startAngle,
              sweepAngle: primitive.sweepAngle
            };
            break;
          case 'ShapeLine':
            if (!startPoint) {
              vertexesArray = new Array();
              startPoint = primitive.firstPoint;
              vertexesArray.push(startPoint);
            }
            nextPoint = primitive.lastPoint;
            vertexesArray.push(nextPoint);
            shape = {
              vertexes: vertexesArray,
              label: 'polyline'
            };
            break;
          default:
            shape = null;
        }
      }
      return shape;
    }
  };

  return myscriptRequests;

})();
