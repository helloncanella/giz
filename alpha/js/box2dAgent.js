var box2dAgent;

box2dAgent = (function() {
  function box2dAgent(world) {
    this.world = world;
    this.box2dEntity = new Object();
  }

  box2dAgent.prototype.transformTheGivenStrokeInABody = function(stroke) {
    var bayazitDecomp, bayazitPolygons, classifiedStroke, i, len, poly2tri, polygon, strokeVertices, toBeRemoved, triangles, triangulated;
    this.box2dEntity.definition = new b2BodyDef;
    this.box2dEntity.definition.type = b2Body.b2_dynamicBody;
    this.box2dEntity.definition.userData = {
      id: stroke.id
    };
    console.log('userData', this.box2dEntity.definition.userData);
    classifiedStroke = this.classifyStroke(stroke);
    switch (classifiedStroke) {
      case "polygon":
        strokeVertices = stroke.measures.vertexes;
        bayazitDecomp = new bayazitDecomposer();
        bayazitPolygons = bayazitDecomp.concanveToconvex(strokeVertices);
        for (i = 0, len = bayazitPolygons.length; i < len; i++) {
          polygon = bayazitPolygons[i];
          poly2tri = new poly2triDecomposer();
          triangles = poly2tri.triangulate(polygon);
          console.log(triangles);
          if (polygon.length >= 8) {
            if (!toBeRemoved) {
              toBeRemoved = new Array();
            }
            toBeRemoved.push(polygon);
            triangulated = poly2triDecomposer.triangulate(polygon);
            if (triangulated) {
              console.log('triangulated', triangulated);
            } else {
              console.log("not trianguleted", null);
            }
          }
        }
    }
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
