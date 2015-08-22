class poly2triDecomposer

  triangulatePolygons: (vertices) ->
    startPoint = vertices[0]
    lastPoint = vertices[(vertices.length-1)]

    for vertex in vertices
      if !arrayOfTriangles
        arrayOfTriangles = new Array()
      componentX = vertex.x
      componentY = vertex.y
      if vertex != lastPoint
        arrayOfTriangles.push(new poly2tri.Point(componentX,componentY))

    swctx = new poly2tri.SweepContext(arrayOfTriangles)
    swctx.triangulate();
    @triangles = swctx.getTriangles();

    for triangle in @triangles
      triangle.makeCCW() #garantee that the points of polygon will be CCW

    return @triangles


  triangulateBayazitPolygon: (polygon) ->
    vertices = polygon.vertices
    startPoint = vertices[0]
    lastPoint = vertices[(vertices.length-1)]

    for vertex in vertices
      if !arrayOfTriangles
        arrayOfTriangles = new Array()
      componentX = vertex[0]
      componentY = vertex[1]
      if vertex != lastPoint
        arrayOfTriangles.push(new poly2tri.Point(componentX,componentY))

    swctx = new poly2tri.SweepContext(arrayOfTriangles)
    swctx.triangulate();
    @triangles = swctx.getTriangles();

    for triangle in @triangles
      triangle.makeCCW() #garantee that the points of polygon will be CCW

    return @triangles

  # transformResultToArrayFormat:()->
  #   trianglesArray = new Array()
  #   for element in @triangles
  #     triangle = new Array()
  #     points = element.points_
  #     for point in points
  #       vertex =
  #         x:point.x
  #         y:point.y
  #       triangle.push(vertex)
  #     trianglesArray.push(triangle)
  #   return trianglesArray
