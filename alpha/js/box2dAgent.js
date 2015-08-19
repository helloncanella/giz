var box2dAgent;

box2dAgent = (function() {
  function box2dAgent(world) {
    this.world = world;
    this.box2dEntity = new Object();
  }

  box2dAgent.prototype.transformTheGivenStrokeInABody = function(stroke) {
    this.box2dEntity.definition = new b2BodyDef;
    this.box2dEntity.definition.type = b2Body.b2_dynamicBody;
    this.box2dEntity.definition.userData = {
      id: stroke.id
    };
    console.log('userData', this.box2dEntity.definition.userData);
    this.classifyStroke(stroke);
    return this;
  };

  box2dAgent.prototype.insertTheTransformedBodyInTheWorld = function() {
    if (this.box2dEntity.definition) {
      console.log('body');
    } else {
      console.error("There isn't any body defined");
    }
    return this;
  };

  box2dAgent.prototype.classifyStroke = function(stroke) {
    var closed, label, lastPoint, length, maxRadius, minRadius, opened, startPoint, sweepAngle, vertexes, weGotaEllipseArc, weGotaPolyline, weGotaUglyStroke, withDifferentRadius, withEqualRadius;
    label = stroke.measures.label;
    switch (label) {
      case 'polyline':
        vertexes = stroke.measures.vertexes;
        length = vertexes.length;
        startPoint = vertexes[0];
        lastPoint = vertexes[length - 1];
        weGotaPolyline = true;
        opened = (startPoint.x !== lastPoint.x) && (startPoint.y !== lastPoint.y);
        closed = !opened;
        break;
      case 'ellipseArc':
        sweepAngle = stroke.measures.sweepAngle;
        maxRadius = stroke.measures.maxRadius;
        minRadius = stroke.measures.minRadius;
        weGotaEllipseArc = true;
        opened = Math.round(Math.abs(sweepAngle) / (2 * Math.PI)) !== 1;
        closed = !opened;
        withEqualRadius = minRadius === maxRadius;
        withDifferentRadius = !withEqualRadius;
        break;
      default:
        weGotaUglyStroke = true;
    }
    if ((weGotaEllipseArc || weGotaPolyline) && opened) {
      console.log("EDGE");
    }
    if (weGotaUglyStroke || ((weGotaPolyline || (weGotaEllipseArc && withDifferentRadius)) && closed)) {
      console.log("POLYGON");
    }
    if (weGotaEllipseArc && withEqualRadius && closed) {
      return console.log("CIRCLE");
    }
  };

  return box2dAgent;

})();
