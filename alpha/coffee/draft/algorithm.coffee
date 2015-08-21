bodyposition = objectCoordinateToB2Vec(centroid)
fixtureDefArray = new Array()

for polygon in itensReadyToBox2d
  fixture = new b2FixtureDef()
  fixture.shape = new b2PolygonShape()
  b2Vertices = new Array()
  for vertex in polygon
    #localVertex - related to centroid
    localVertex = {x:vertex.x - centroid.x, y: vertex.y - centroid.y}
    b2Vertices.push(new b2Vec2(localVertex.x,localVertex.y))
  fixture.shape.SetAsArray(b2Vertices,b2Vertices.length)
  fixtureDefArray.push(fixture)

console.log 'fixture', fixtureDefArray

# CENTROID
centroid = calculateCentroid(itensReadyToBox2d)

calculateCentroid = (polygonsArray) ->
  sum = {x:0, y:0}
  pointsCounter=0
  for polygon in polygonsArray
    for vertex in polygon
      sum.x+=vertex.x
      sum.y+=vertex.y
      pointsCounter++

  centroid = {x:sum.x/pointsCounter, y:sum.y/pointsCounter}
  return centroid
