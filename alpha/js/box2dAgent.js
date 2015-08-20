var box2dAgent;

box2dAgent = (function() {
  function box2dAgent(world) {
    this.world = world;
    this.box2dEntity = new Object();
  }

  box2dAgent.prototype.transformTheGivenStrokeInABody = function(stroke) {
    var bayazitDecomp, bayazitPolygons, classifiedStroke, i, item, itensReadyToBox2d, j, k, l, len, len1, len2, len3, newPolygonArray, poly2triPolygon, polygon, strokeVertices, toBeAdded, toBeRemoved, triangulated, triangulatedPolygons;
    this.box2dEntity.definition = new b2BodyDef;
    this.box2dEntity.definition.type = b2Body.b2_dynamicBody;
    this.box2dEntity.definition.userData = {
      id: stroke.id
    };
    classifiedStroke = this.classifyStroke(stroke);
    switch (classifiedStroke) {
      case "polygon":
        strokeVertices = stroke.measures.vertexes;
        bayazitDecomp = new bayazitDecomposer();
        bayazitPolygons = bayazitDecomp.concanveToconvex(strokeVertices);
        for (i = 0, len = bayazitPolygons.length; i < len; i++) {
          polygon = bayazitPolygons[i];
          if (!toBeRemoved && !toBeAdded) {
            toBeRemoved = new Array();
            toBeAdded = new Array();
          }
          if (polygon.length >= 8) {
            toBeRemoved.push(polygon);
            poly2triPolygon = new poly2triDecomposer();
            triangulatedPolygons = poly2triPolygon.triangulateBayazitPolygon(polygon);
            for (j = 0, len1 = triangulatedPolygons.length; j < len1; j++) {
              triangulated = triangulatedPolygons[j];
              toBeAdded.push(triangulated);
            }
          }
        }
        for (k = 0, len2 = toBeRemoved.length; k < len2; k++) {
          item = toBeRemoved[k];
          bayazitPolygons.slice(item);
        }
        newPolygonArray = new Array().concat(bayazitPolygons, toBeAdded);
        for (l = 0, len3 = newPolygonArray.length; l < len3; l++) {
          item = newPolygonArray[l];
          if (!itensReadyToBox2d) {
            itensReadyToBox2d = new Array();
          }
          itensReadyToBox2d.push(item.transformResultToArrayFormat());
        }
        console.log(itensReadyToBox2d);
    }
    return this;
  };

  box2dAgent.prototype.insertTheTransformedBodyInTheWorld = function() {
    if (this.box2dEntity.definition) {

    } else {
      console.error("There isn't any body defined");
    }
    return this;
  };

  box2dAgent.prototype.classifyStroke = function(stroke) {
    var closed, label, lastPoint, length, maxRadius, minRadius, opened, startPoint, sweepAngle, vertices, weGotaEllipseArc, weGotaPolyline, weGotaUglyStroke, withDifferentRadius, withEqualRadius;
    label = stroke.measures.label;
    switch (label) {
      case 'polyline':
        vertices = stroke.measures.vertexes;
        length = vertices.length;
        startPoint = vertices[0];
        lastPoint = vertices[length - 1];
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
      return "edge";
    }
    if (weGotaUglyStroke || ((weGotaPolyline || (weGotaEllipseArc && withDifferentRadius)) && closed)) {
      return "polygon";
    }
    if (weGotaEllipseArc && withEqualRadius && closed) {
      return "circle";
    }
  };

  return box2dAgent;

})();
