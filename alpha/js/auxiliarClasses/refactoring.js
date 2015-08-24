var classifyStrokeAndSetId;

weGotaUglyStroke(X);

weGotaEllipseArc;

weGotaPolyline;

opened;

closed;

withEqualRadius;

withDifferentRadius;

classifyStrokeAndSetId = function(rawStroke, recognizedShape) {
  var label, lastPoint, length, maxRadius, minRadius, startPoint, stroke, sweepAngle, vertices;
  stroke = void 0;
  stroke.measures.box2d = null;
  if (recognizedShape) {
    stroke.measures.canvas = recognizedShape;
    label = recognizedShape.label;
    switch (label) {
      case 'polyline':
        vertices = recognizedShape.measures.box2d.vertices;
        length = vertices.length;
        startPoint = vertices[0];
        lastPoint = vertices[length - 1];
        stroke.conditions = {
          weGotaPolyline: true,
          opened: (startPoint.x !== lastPoint.x) && (startPoint.y !== lastPoint.y),
          closed: !opened
        };
        break;
      case 'ellipseArc':
        sweepAngle = recognizedShape.measures.box2d.sweepAngle;
        maxRadius = recognizedShape.measures.box2d.maxRadius;
        minRadius = recognizedShape.measures.box2d.minRadius;
        stroke.conditions = {
          weGotaEllipseArc: true,
          opened: Math.round(Math.abs(sweepAngle) / (2 * Math.PI)) !== 1,
          closed: !opened,
          withEqualRadius: minRadius === maxRadius,
          withDifferentRadius: !withEqualRadius
        };
    }
  } else {
    stroke.measures.canvas = rawStroke;
    stroke.conditions = {
      weGotaUglyStroke: true
    };
  }
  if (!stroke.id) {
    stroke.id = 0;
  } else {
    stroke.id++;
  }
  return stroke;
};

({
  classifyStroke: function(stroke) {
    if ((weGotaEllipseArc || weGotaPolyline) && opened) {
      return "edge";
    }
    if (weGotaUglyStroke || ((weGotaPolyline || (weGotaEllipseArc && withDifferentRadius)) && closed)) {
      return "polygon";
    }
    if (weGotaEllipseArc && withEqualRadius && closed) {
      return "circle";
    }
    return {
      classifyStroke: function(stroke) {
        var closed, label, lastPoint, length, maxRadius, minRadius, opened, startPoint, sweepAngle, vertices, weGotaEllipseArc, weGotaPolyline, weGotaUglyStroke, withDifferentRadius, withEqualRadius;
        label = stroke.measures.box2d.label;
        switch (label) {
          case 'polyline':
            vertices = stroke.measures.box2d.vertices;
            length = vertices.length;
            startPoint = vertices[0];
            lastPoint = vertices[length - 1];
            weGotaPolyline = true;
            opened = (startPoint.x !== lastPoint.x) && (startPoint.y !== lastPoint.y);
            closed = !opened;
            break;
          case 'ellipseArc':
            sweepAngle = stroke.measures.box2d.sweepAngle;
            maxRadius = stroke.measures.box2d.maxRadius;
            minRadius = stroke.measures.box2d.minRadius;
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
      }
    };
  }
});
