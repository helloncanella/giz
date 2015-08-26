var box2dAgent;

box2dAgent = (function() {
  function box2dAgent(world, scale) {
    var fixture, groundDef, shape;
    this.world = world;
    this.scale = scale;
    this.box2dEntity = new Object();
    groundDef = new b2BodyDef();
    groundDef.position = new b2Vec2(0, 24);
    fixture = new b2FixtureDef();
    shape = fixture.shape = new b2PolygonShape();
    shape.SetAsBox(40, 0.5);
    this.world.CreateBody(groundDef).CreateFixture(fixture);
  }

  box2dAgent.prototype.transformTheGivenStrokeInABody = function(stroke) {
    var angle, average, b2Vertices, bodyDef, center, centroid, circleShape, classifiedStroke, distance, distanceVector, fixture, fixtureDefArray, i, itensReadyToBox2d, j, k, l, last, len, len1, len2, len3, localVertex, next, point, points, poly2triPolygon, polygon, precision, scaledStroke, start, strokeVertices, triangulatedPolygons, triangule, vertex;
    scaledStroke = this.scaleStroke(stroke);
    bodyDef = this.box2dEntity.definition = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.userData = {
      id: stroke.id
    };
    classifiedStroke = this.classifyStroke(scaledStroke);
    fixtureDefArray = this.box2dEntity.fixtureDefArray = new Array();
    switch (classifiedStroke) {
      case 'circle':
        fixture = new b2FixtureDef();
        circleShape = fixture.shape = new b2CircleShape();
        center = scaledStroke.measures.box2d.center;
        bodyDef.position = new b2Vec2(center.x, center.y);
        circleShape.m_radius = scaledStroke.measures.box2d.maxRadius;
        fixtureDefArray.push(fixture);
        break;
      case "polygon":
        strokeVertices = stroke.measures.box2d.vertices;
        poly2triPolygon = new poly2triDecomposer();
        triangulatedPolygons = poly2triPolygon.triangulatePolygons(strokeVertices);
        for (i = 0, len = triangulatedPolygons.length; i < len; i++) {
          triangule = triangulatedPolygons[i];
          if (!itensReadyToBox2d) {
            itensReadyToBox2d = new Array();
          }
          itensReadyToBox2d.push(triangule.transformResultToArrayFormat());
        }
        centroid = this.calculateCentroid(itensReadyToBox2d);
        bodyDef.position = new b2Vec2(centroid.x, centroid.y);
        for (j = 0, len1 = itensReadyToBox2d.length; j < len1; j++) {
          polygon = itensReadyToBox2d[j];
          fixture = new b2FixtureDef();
          fixture.shape = new b2PolygonShape();
          b2Vertices = new Array();
          for (k = 0, len2 = polygon.length; k < len2; k++) {
            vertex = polygon[k];
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
        break;
      case 'edge':
        points = scaledStroke.measures.box2d.vertices;
        precision = this.scale / 25;
        for (l = 0, len3 = points.length; l < len3; l++) {
          point = points[l];
          if (!start) {
            start = new b2Vec2(point.x, point.y);
            continue;
          }
          next = new b2Vec2(point.x, point.y);
          distanceVector = new b2Vec2(next.x - start.x, next.y - start.y);
          distance = distanceVector.Length();
          if (distance >= precision) {
            center = average = new b2Vec2((next.x + start.x) / 2, (next.y + start.y) / 2);
            angle = Math.atan2(distanceVector.y, distanceVector.x);
            fixture = new b2FixtureDef();
            fixture.shape = new b2PolygonShape();
            fixture.shape.SetAsOrientedBox(distance / 2, 0.2, center, angle);
            fixtureDefArray.push(fixture);
            start = next;
          }
        }
    }
    return this;
  };

  box2dAgent.prototype.scaleStroke = function(stroke) {
    var box2dMeasures, canvasMeasures, center, i, len, measure, property, vertex, vertices;
    canvasMeasures = stroke.measures.canvas;
    stroke.measures.box2d = JSON.parse(JSON.stringify(canvasMeasures));
    box2dMeasures = stroke.measures.box2d;
    for (property in canvasMeasures) {
      measure = canvasMeasures[property];
      switch (property) {
        case "center":
          center = box2dMeasures[property];
          center.x /= this.scale;
          center.y /= this.scale;
          break;
        case "vertices":
          vertices = box2dMeasures[property];
          for (i = 0, len = vertices.length; i < len; i++) {
            vertex = vertices[i];
            vertex.x /= this.scale;
            vertex.y /= this.scale;
          }
          break;
        case "maxRadius":
          box2dMeasures[property] /= this.scale;
          break;
        case "minRadius":
          box2dMeasures[property] /= this.scale;
      }
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
    var body, bodyDefinition, fixture, fixtureArray, i, len, results;
    if (this.box2dEntity.fixtureDefArray) {
      fixtureArray = this.box2dEntity.fixtureDefArray;
      bodyDefinition = this.box2dEntity.definition;
      body = this.world.CreateBody(bodyDefinition);
      results = [];
      for (i = 0, len = fixtureArray.length; i < len; i++) {
        fixture = fixtureArray[i];
        fixture.friction = 0.3;
        fixture.density = 1;
        results.push(body.CreateFixture(fixture));
      }
      return results;
    } else {
      return console.error("There isn't any body defined");
    }
  };

  box2dAgent.prototype.getBodyList = function() {
    var bodyList, currentBody, id;
    bodyList = new Array();
    currentBody = this.world.GetBodyList();
    while (currentBody) {
      if (typeof currentBody.GetUserData() !== 'undefined' && currentBody.GetUserData() !== null) {
        id = currentBody.GetUserData().id;
        bodyList[id] = {
          vx: currentBody.GetLinearVelocity().x,
          vy: currentBody.GetLinearVelocity().y,
          angularVelocity: currentBody.GetAngularVelocity(),
          centroid: currentBody.GetWorldCenter(),
          id: currentBody.GetUserData().id
        };
      }
      currentBody = currentBody.m_next;
    }
    return bodyList;
  };

  box2dAgent.prototype.classifyStroke = function(stroke) {
    var closed, conditions, opened, weGotaEllipseArc, weGotaPolyline, weGotaUglyStroke, withDifferentRadius, withEqualRadius;
    conditions = stroke.conditions;
    weGotaEllipseArc = conditions.weGotaEllipseArc;
    weGotaPolyline = conditions.weGotaPolyline;
    weGotaUglyStroke = conditions.weGotaUglyStroke;
    withDifferentRadius = conditions.withDifferentRadius;
    withEqualRadius = conditions.withEqualRadius;
    closed = conditions.closed;
    opened = conditions.opened;
    if (opened || (weGotaEllipseArc && withDifferentRadius)) {
      return "edge";
    }
    if (weGotaPolyline && closed) {
      return "polygon";
    }
    if (weGotaEllipseArc && withEqualRadius && closed) {
      return "circle";
    }
  };

  return box2dAgent;

})();
