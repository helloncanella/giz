var box2dAgent;

box2dAgent = (function() {
  function box2dAgent(world, scale) {
    this.world = world;
    this.scale = scale;
    this.box2dEntity = new Object();
  }

  box2dAgent.prototype.transformTheGivenStrokeInABody = function(stroke) {
    var b2Vertices, bayazitDecomp, bayazitPolygons, bodyDef, centroid, classifiedStroke, fixture, fixtureDefArray, i, index, item, itensReadyToBox2d, j, k, l, last, len, len1, len2, len3, len4, len5, localVertex, m, n, newPolygonArray, poly2triPolygon, polygon, scaledStroke, start, strokeVertices, toBeAdded, toBeRemoved, triangulated, triangulatedPolygons, vertex;
    scaledStroke = this.scaleStroke(stroke);
    bodyDef = this.box2dEntity.definition = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.userData = {
      id: stroke.id
    };
    classifiedStroke = this.classifyStroke(scaledStroke);
    switch (classifiedStroke) {
      case "polygon":
        strokeVertices = stroke.measures.vertices;
        bayazitDecomp = new bayazitDecomposer();
        bayazitPolygons = bayazitDecomp.concanveToconvex(strokeVertices);
        for (i = 0, len = bayazitPolygons.length; i < len; i++) {
          polygon = bayazitPolygons[i];
          if (!toBeRemoved && !toBeAdded) {
            toBeRemoved = new Array();
            toBeAdded = new Array();
          }
          if (polygon.vertices.length >= 8) {
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
          index = bayazitPolygons.indexOf(item);
          bayazitPolygons.splice(index, 1);
        }
        newPolygonArray = new Array().concat(bayazitPolygons, toBeAdded);
        for (l = 0, len3 = newPolygonArray.length; l < len3; l++) {
          item = newPolygonArray[l];
          if (!itensReadyToBox2d) {
            itensReadyToBox2d = new Array();
          }
          itensReadyToBox2d.push(item.transformResultToArrayFormat());
        }
        centroid = this.calculateCentroid(itensReadyToBox2d);
        bodyDef.position = new b2Vec2(centroid.x, centroid.y);
        fixtureDefArray = this.box2dEntity.fixtureDefArray = new Array();
        for (m = 0, len4 = itensReadyToBox2d.length; m < len4; m++) {
          polygon = itensReadyToBox2d[m];
          fixture = new b2FixtureDef();
          fixture.shape = new b2PolygonShape();
          b2Vertices = new Array();
          for (n = 0, len5 = polygon.length; n < len5; n++) {
            vertex = polygon[n];
            localVertex = {
              x: vertex.x - centroid.x,
              y: vertex.y - centroid.y
            };
            b2Vertices.push(new b2Vec2(localVertex.x, localVertex.y));
          }
          start = 0;
          last = b2Vertices.length - 1;
          if (b2Vertices[start].x === b2Vertices[last].x && b2Vertices[start].y === b2Vertices[last].y) {
            b2Vertices.splice(last, 1);
          }
          fixture.shape.SetAsArray(b2Vertices, b2Vertices.length);
          fixtureDefArray.push(fixture);
        }
    }
    console.log(this);
    return this;
  };

  box2dAgent.prototype.scaleStroke = function(stroke) {
    var i, len, vertex, vertices;
    vertices = stroke.measures.vertices;
    for (i = 0, len = vertices.length; i < len; i++) {
      vertex = vertices[i];
      vertex.x /= this.scale;
      vertex.y /= this.scale;
    }
    return stroke;
  };

  box2dAgent.prototype.calculateCentroid = function(polygonsArray) {
    var centroid, i, j, len, len1, pointsCounter, polygon, sum, vertex;
    sum = {
      x: 0,
      y: 0
    };
    pointsCounter = 0;
    for (i = 0, len = polygonsArray.length; i < len; i++) {
      polygon = polygonsArray[i];
      for (j = 0, len1 = polygon.length; j < len1; j++) {
        vertex = polygon[j];
        sum.x += vertex.x;
        sum.y += vertex.y;
        pointsCounter++;
      }
    }
    centroid = {
      x: sum.x / pointsCounter,
      y: sum.y / pointsCounter
    };
    return centroid;
  };

  box2dAgent.prototype.insertTheTransformedBodyInTheWorld = function() {
    var body, bodyDefinition, fixture, fixtureArray, i, len;
    if (this.box2dEntity.fixtureDefArray) {
      fixtureArray = this.box2dEntity.fixtureDefArray;
      bodyDefinition = this.box2dEntity.definition;
      body = this.world.CreateBody(bodyDefinition);
      for (i = 0, len = fixtureArray.length; i < len; i++) {
        fixture = fixtureArray[i];
        body.CreateFixture(fixture);
      }
      console.log(this.world.GetBodyList());
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
        vertices = stroke.measures.vertices;
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
