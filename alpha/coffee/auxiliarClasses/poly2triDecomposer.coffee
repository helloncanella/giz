class poly2triDecomposer
  triangulate: (polygon) ->
    console.log 'polygon', polygon
    vertices = polygon.vertices
    start = vertices[0]
    last = vertices[(vertices.length-1)]
    if start.x == last.x && start.y == last.y
      vertices.splice(last)

    for vertex in vertices
      if !arrayOfTriangles
        arrayOfTriangles = new Array()
      componentX = vertex[0]
      componentY = vertex[1]
      arrayOfTriangles.push(new poly2tri.Point(componentX,componentY))


    console.log arrayOfTriangles
    swctx = new poly2tri.SweepContext(arrayOfTriangles)
    console.log 'swctx',swctx
    swctx.triangulate();
    triangles = swctx.getTriangles();

    return triangles
