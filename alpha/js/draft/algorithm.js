var b2Vertices, bodyposition, calculateCentroid, centroid, fixture, fixtureDefArray, i, j, len, len1, localVertex, polygon, vertex;

bodyposition = objectCoordinateToB2Vec(centroid);

fixtureDefArray = new Array();

for (i = 0, len = itensReadyToBox2d.length; i < len; i++) {
  polygon = itensReadyToBox2d[i];
  fixture = new b2FixtureDef();
  fixture.shape = new b2PolygonShape();
  b2Vertices = new Array();
  for (j = 0, len1 = polygon.length; j < len1; j++) {
    vertex = polygon[j];
    localVertex = {
      x: vertex.x - centroid.x,
      y: vertex.y - centroid.y
    };
    b2Vertices.push(new b2Vec2(localVertex.x, localVertex.y));
  }
  fixture.shape.SetAsArray(b2Vertices, b2Vertices.length);
  fixtureDefArray.push(fixture);
}

console.log('fixture', fixtureDefArray);

centroid = calculateCentroid(itensReadyToBox2d);

calculateCentroid = function(polygonsArray) {
  var k, l, len2, len3, pointsCounter, sum;
  sum = {
    x: 0,
    y: 0
  };
  pointsCounter = 0;
  for (k = 0, len2 = polygonsArray.length; k < len2; k++) {
    polygon = polygonsArray[k];
    for (l = 0, len3 = polygon.length; l < len3; l++) {
      vertex = polygon[l];
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
